// External Dependencies
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  TextInput,
  Pressable,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckBox from '@react-native-community/checkbox';
import Mailer from 'react-native-mail';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isEmpty } from 'lodash-es';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';
import Config from 'react-native-config';
import { Colors, Text } from 'react-native-ui-lib';

// Internal Dependencies
import { CustomAlert } from '../../../common/components/CustomAlert/CustomAlert';
import log, { removeOldLogFiles, directoryPath as logsDirectoryPath } from '../../../common/utils/logUtils';
import { logScreenView, logEvent } from '../../../analytics/wrapper/analyticsWrapper';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../../analytics/model/analyticsEvent';
import { createReportIssueSentEvent } from '../../../analytics/settings/settingsAnalytics';
import { screenViewEventToHashMap } from '../../../analytics/model/analyticsScreenView';
import createScreenViewEvent from '../../screenViewTracker/screenViewTracker';
import { REPORT_ISSUE_SCREEN } from '../../../analytics/model/constantsScreens';
import {
  DATABASE_FILE_NAME,
  IS_IOS,
  SITE_VALUE_KEY, TRANSISTOR_LOCATION_MANAGER,
} from '../../../common/constants/constants';
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { RootStackParamList } from '../../../common/types/types';
import { getSecuredStringForKey } from '../../../common/data/storage/utils';
import { deleteFile, zipFolder } from '../../../common/utils/zipLogFiles';
import { LogOutAlertIcon } from '../../../common/icons/LogOutAlertIcon';
import { isObservationPendingData } from '../../../common/utils/locationUtils';

// Styles
import { styles } from './style';

// Interfaces + Types
interface ReportIssueViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportIssueView'>;
}

const ReportIssueView = ({ navigation }: ReportIssueViewProps) => {
  const buildPath = Config.BUILD_PATH;
  // Hooks
  const { t } = useTranslation();

  // Component's State
  const [issueMessage, setIssueMessage] = useState('');
  const [toggleCompressFiles, setToggleCompressFiles] = useState(true);
  const [toggleShareDb, setToggleShareDb] = useState(true);
  const [progressVisible, showProgress] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [displayPrivacyWarning, setDisplayPrivacyWarning] = useState(false);

  const SITE = getSecuredStringForKey(SITE_VALUE_KEY);
  const outputLogsFilePath = `${DocumentDirectoryPath}/er_mobile_logs.zip`;
  const inputDbFilePath = IS_IOS ? `${RNFS.LibraryDirectoryPath}/LocalDatabase/`
    : `/data/data/com.earthranger${buildPath}/databases/${DATABASE_FILE_NAME}`;
  const inputObservationsFilePath = IS_IOS ? `${RNFS.LibraryDirectoryPath}/Application Support/TSLocationManager/`
    : `/data/data/com.earthranger${buildPath}/databases/${TRANSISTOR_LOCATION_MANAGER}`;
  const outputDbFilePath = `${DocumentDirectoryPath}/er_mobile_db.zip`;
  const outputObservationsFilePath = `${DocumentDirectoryPath}/${TRANSISTOR_LOCATION_MANAGER}.zip`;

  useEffect(() => {
    async function trackView() {
      log.debug(`Database File Path: ${inputDbFilePath}`);
      trackScreenView();
    }
    trackView();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => sendIssueButton(),
    });
  }, [issueMessage, toggleCompressFiles, toggleShareDb]);

  const sendIssueReport = async () => {
    if (toggleCompressFiles || toggleShareDb) {
      await compressFiles(toggleCompressFiles, toggleShareDb);
    } else {
      composeEmail(['']);
    }
    trackAnalyticsEvent(createReportIssueSentEvent());
  };

  const validateBeforeSending = () => {
    if (toggleShareDb) {
      setDisplayPrivacyWarning(true);
    } else {
      sendIssueReport();
    }
  };

  const resetSharingDatabase = () => {
    setToggleShareDb(false);
    setDisplayPrivacyWarning(false);
  };

  const compressFiles = async (compressLogs: boolean, compressDb: boolean) => {
    showProgress(true);
    let logsPath = '';
    let dbPath = '';
    let observationsPath = '';

    if (compressLogs) {
      try {
        await deleteFile(outputLogsFilePath);
        await removeOldLogFiles();
        const succeeded = await zipFolder(
          logsDirectoryPath,
          outputLogsFilePath,
          (progress: number, filePath: string) => {
            log.debug(`Compressing ${filePath} [${filePath}]`);
            setCompressProgress(progress);
          },
        );
        if (succeeded) {
          logsPath = outputLogsFilePath;
        }
      } catch (error) {
        log.error('Error compressing file', error);
      }
    }
    if (compressDb) {
      try {
        await deleteFile(outputDbFilePath);
        const succeeded = await zipFolder(
          inputDbFilePath,
          outputDbFilePath,
          (progress: number, filePath: string) => {
            log.debug(`Compressing ${filePath} [${filePath}]`);
            setCompressProgress(progress);
          },
        );
        if (succeeded) {
          dbPath = outputDbFilePath;
        }
      } catch (error) {
        log.error('Error compressing db file', error);
      }

      const isPendingObservation = await isObservationPendingData();
      if (isPendingObservation) {
        try {
          await deleteFile(outputObservationsFilePath);
          const succeeded = await zipFolder(
            inputObservationsFilePath,
            outputObservationsFilePath,
            (progress: number, filePath: string) => {
              log.debug(`Compressing ${filePath} [${filePath}]`);
              setCompressProgress(progress);
            },
          );
          if (succeeded) {
            observationsPath = outputObservationsFilePath;
          }
        } catch (error) {
          log.error('Error compressing observations file', error);
        }
      }
    }
    showProgress(false);
    setCompressProgress(0);
    composeEmail([logsPath, dbPath, observationsPath]);
  };

  const composeEmail = (attachmentPath: string[]) => {
    Mailer.mail(
      {
        subject: `${SITE}: ${t('reportIssue.issueReport')}`,
        recipients: ['support+mobile@earthranger.com'],
        body: `<b>${issueMessage}</b>`,
        customChooserTitle: t('reportIssue.compose'),
        isHTML: true,
        attachments: getAttachments(attachmentPath),
      },
      async (error, event) => {
        log.debug('Mail completion event:', event);
        await deleteFile(outputDbFilePath);
        await deleteFile(outputLogsFilePath);
        if (error) showError(error);
      },
    );
    navigation.pop();
  };

  const showError = (error: string) => {
    log.error('Mail completion error:', error);
    Alert.alert(
      'Error',
      error,
      [
        {
          text: 'Ok',
        },
      ],
      { cancelable: true },
    );
  };

  const getAttachments = (filePath: string[]) => (
    filePath.filter((file) => !isEmpty(file)).map((file) => ({
      path: file,
      type: 'zip',
    }))
  );

  const trackAnalyticsEvent = (event: AnalyticsEvent) => {
    logEvent(event.eventName, analyticsEventToHashMap(event));
  };

  const trackScreenView = async () => {
    logScreenView(screenViewEventToHashMap(
      createScreenViewEvent(REPORT_ISSUE_SCREEN, REPORT_ISSUE_SCREEN),
    ));
  };

  const shouldSetResponse = () => true;

  const onRelease = () => (
    Keyboard.dismiss()
  );

  // Additional Components
  const sendIssueButton = () => (
    <Pressable
      disabled={issueMessage.trim().length === 0}
      hitSlop={{
        top: 20, bottom: 20, left: 20, right: 20,
      }}
      onPress={validateBeforeSending}
      style={[styles.sendIssueButton, issueMessage.trim().length === 0 ? styles.disabled : null]}
    >
      <Text
        heading3
        color={Colors.brightBlue}
        style={{ paddingLeft: 4 }}
      >
        {t('reports.send')}
      </Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      behavior={
        IS_IOS ? 'padding' : 'height'
      }
      style={{ flex: 1 }}
      keyboardVerticalOffset={
        IS_IOS ? 40 : 120
      }
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View
          onResponderRelease={onRelease}
          onStartShouldSetResponder={shouldSetResponse}
          style={styles.container}
        >
          <Text style={styles.titleText}>{t('reportIssue.title')}</Text>
          <Text style={styles.bodyText}>{t('reportIssue.body')}</Text>
          <Text style={styles.messageText}>{`${t('reportIssue.message')}*`}</Text>
          <TextInput
            style={styles.textInput}
            multiline
            onChangeText={setIssueMessage}
            value={issueMessage}
          />
          <View style={styles.shareLogsContainer}>
            <CheckBox
              tintColor={COLORS_LIGHT.G3_secondaryMediumLightGray}
              onCheckColor={COLORS_LIGHT.white}
              onFillColor={COLORS_LIGHT.brightBlue}
              boxType="square"
              tintColors={{ true: COLORS_LIGHT.brightBlue }}
              disabled={false}
              value={toggleCompressFiles}
              onValueChange={(newValue) => setToggleCompressFiles(newValue)}
              style={styles.checkBox}
            />
            <Text style={styles.checkBoxTextTitle}>
              {t('reportIssue.shareLogsTitle')}
            </Text>
          </View>
          <Text style={styles.checkBoxTextBody}>
            {t('reportIssue.shareLogsDescription')}
          </Text>
          <View style={styles.shareLogsContainer}>
            <CheckBox
              tintColor={COLORS_LIGHT.G3_secondaryMediumLightGray}
              onCheckColor={COLORS_LIGHT.white}
              onFillColor={COLORS_LIGHT.brightBlue}
              boxType="square"
              tintColors={{ true: COLORS_LIGHT.brightBlue }}
              disabled={false}
              value={toggleShareDb}
              onValueChange={(newValue) => setToggleShareDb(newValue)}
              style={styles.checkBox}
            />
            <Text style={styles.checkBoxTextTitle}>
              {t('reportIssue.shareDbTitle')}
            </Text>
          </View>
          <Text style={styles.checkBoxTextBody}>
            {t('reportIssue.shareDbDescription')}
          </Text>

        </View>
        <CustomAlert
          displayAlert={progressVisible}
          alertTitleText={t('reportIssue.compressTitle')}
          alertMessageText={t('reportIssue.compressBody')}
          progress={compressProgress}
          negativeButtonText={t('reportIssue.cancel')}
          onNegativeButtonPress={() => {}}
        />

        {/* Sensitive Data Confirmation Dialog */}
        <CustomAlert
          displayAlert={displayPrivacyWarning}
          additionalText={t('reportIssue.sensitiveDataAdditionalText')}
          alertTitleText={t('reportIssue.sensitiveDataTitle')}
          alertIcon={<LogOutAlertIcon />}
          alertMessageText={t('reportIssue.sensitiveDataDescription')}
          alertTitleTextColor={COLORS_LIGHT.red}
          positiveButtonText={t('common.ok')}
          onPositiveButtonPress={sendIssueReport}
          positiveButtonBackgroundColor={COLORS_LIGHT.red}
          onNegativeButtonPress={resetSharingDatabase}
          negativeButtonText={t('common.cancel')}
        />
        {/* End Sensitive Data Confirmation Dialog */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ReportIssueView;
