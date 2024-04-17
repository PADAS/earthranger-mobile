// External Dependencies
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isEmpty, isEqual } from 'lodash-es';
import {
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from 'react-native-ui-lib';

// Internal Dependencies
import { ReportFormSchemaError } from '../../../ReportFormSchemaErrorMessage/ReportFormSchemaError';
import { ReportJsonForm } from '../../../JSONForm/ReportJsonForm';
import { CustomAlert } from '../../../../../../../../common/components/CustomAlert/CustomAlert';
import { TrashIcon } from '../../../../../../../../common/icons/TrashIcon';
import { BackViewButton } from '../../../../../../../../common/components/CloseViewButton/BackViewButton';
import { ReportFormSubmitButton } from '../../../ReportFormSubmitButton/ReportFormSubmitButton';
import { getEventEmitter } from '../../../../../../../../common/utils/AppEventEmitter';
import { COLORS_LIGHT } from '../../../../../../../../common/constants/colors';
import { cropHeaderTitleText } from '../../../../../../../../common/utils/stringUtils';

// Styles
import styles from './RepeatableFormView.styles';

// Types
type RouteParams = {
  schema: any;
  data: any;
  title: string;
  formId: number;
  listId: string;
};

const RepeatableFormView = () => {
  // Hooks
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Component's State
  const {
    schema,
    title,
    data,
    formId,
    listId,
  }: RouteParams = navigation.getState().routes[navigation.getState().index].params;
  const [showSchemaErrorMessage, setShowSchemaErrorMessage] = useState(false);
  const [jsonSchema, setJsonSchema] = useState<string>('');
  const [formEditData] = useState<any>(data || {});
  const [isFormEmpty, setIsFormEmpty] = useState(true);
  const [formData, setFormData] = useState<any>();
  const [schemaErrors, setSchemaErrors] = useState<any>();
  const [schemaFilteredErrors, setSchemaFilteredErrors] = useState<any>();
  const [hasFormRequiredFieldEmpty, setHasFormRequiredFieldEmpty] = useState(true);
  const [shouldDisplayRequiredFieldAlert, setShouldDisplayRequiredFieldAlert] = useState(false);
  const [displayDiscardChangesDialog, setDisplayDiscardChangesDialog] = useState(false);
  const eventEmitter = useRef(getEventEmitter()).current;
  const channelId = useRef(listId).current;
  const editFormId = useRef(formId || -1).current;
  const isFormDirty = useRef(false);

  // Handlers
  const onBackButtonView = () => {
    if (isFormDirty.current) {
      setDisplayDiscardChangesDialog(true);
    } else {
      // @ts-ignore
      navigation.pop();
    }
  };

  const onReportSubmitPressHandler = () => {
    if (hasFormRequiredFieldEmpty) {
      setShouldDisplayRequiredFieldAlert(true);
    } else {
      sumbmitData();
      // @ts-ignore
      navigation.pop();
    }
  };

  const sumbmitData = () => {
    eventEmitter.emit(channelId, {
      formData,
      formId: editFormId,
    });
  };

  const onPositiveButton = () => {
    // @ts-ignore
    navigation.pop();
  };

  const onNegativeButton = () => {
    setDisplayDiscardChangesDialog(false);
  };

  useEffect(() => {
    // This function has to exist here since we depend on the `formData` changed value.
    const getIsFormDirty = () => {
      const isExistingDataModified = formEditData && !isEqual(formEditData, formData);
      const hasNewData = !formEditData && !isFormEmpty;
      return hasNewData || isExistingDataModified;
    };

    isFormDirty.current = getIsFormDirty();
  }, [formData]);

  // Lifecycle Events
  useEffect(() => {
    navigation.setOptions({
      title: cropHeaderTitleText(schema.items.title) || cropHeaderTitleText(title),
    });
    const repeatableSchema = createRepeatableSchema();
    if (repeatableSchema) {
      setJsonSchema(JSON.stringify(repeatableSchema));
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft,
      headerRight,
    });
  }, [
    isFormEmpty,
    formData,
    eventEmitter,
    listId,
    schemaFilteredErrors,
    hasFormRequiredFieldEmpty,
  ]);

  useEffect(() => {
    const requiredFieldError = schemaErrors
      && schemaErrors.length > 0
      && schemaErrors.find((item: any) => (item.keyword === 'required')) !== undefined;
    setHasFormRequiredFieldEmpty(requiredFieldError);
    setSchemaFilteredErrors(requiredFieldError
      ? schemaErrors.filter((item: any) => (item.keyword !== 'required')) || []
      : []);
  }, [schemaErrors]);

  const headerRight = () => (
    <Pressable
      onPress={() => onReportSubmitPressHandler()}
      disabled={!isValidForm()}
      hitSlop={20}
    >
      <ReportFormSubmitButton disabled={!isValidForm()} />
    </Pressable>
  );

  const isValidForm = () => !showSchemaErrorMessage
    && (!schemaFilteredErrors || schemaFilteredErrors.length === 0);

  // Utilities
  const headerLeft = useCallback(
    () => <BackViewButton onPressHandler={onBackButtonView} />,
    [isFormEmpty],
  );

  const createRepeatableSchema = () => {
    if (schema.items && schema.items.properties) {
      const newSchema = {
        type: 'object',
        title: schema.items.title || '',
        properties: schema.items.properties,
        required: schema.items.required || [],
      };
      const definition = Object.keys(schema.items.properties).map((key: string) => ({ key }));

      return { schema: newSchema, definition };
    }

    setShowSchemaErrorMessage(true);

    return {};
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {showSchemaErrorMessage ? (
        <ReportFormSchemaError />
      ) : (
      // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          { isEmpty(jsonSchema) ? null : (
            <ScrollView style={styles.scrollView}>
              <View style={styles.formContainer}>
                <ReportJsonForm
                  draftData={formEditData}
                  schema={jsonSchema}
                  setIsFormEmpty={setIsFormEmpty}
                  setShowSchemaErrorMessage={setShowSchemaErrorMessage}
                  setReportFormData={setFormData}
                  setSchemaErrors={setSchemaErrors}
                />
              </View>
            </ScrollView>
          )}
        </>
      )}

      {/* Discard Form Alert */}
      <CustomAlert
        displayAlert={displayDiscardChangesDialog}
        alertTitleText={t('reportRepeatableFormView.discardChangesAlert.title')}
        positiveButtonText={t('reportRepeatableFormView.discardChangesAlert.positive')}
        onPositiveButtonPress={onPositiveButton}
        positiveButtonBackgroundColor={Colors.brightRed}
        positiveButtonIcon={<TrashIcon color={Colors.white} />}
        negativeButtonText={t('reportRepeatableFormView.discardChangesAlert.negative')}
        onNegativeButtonPress={onNegativeButton}
      />
      {/* End Discard Form Alert */}
      {/* Required Fields Warning Alert */}
      <CustomAlert
        displayAlert={shouldDisplayRequiredFieldAlert}
        alertMessageText={t('reports.requiredFieldsAlert.title')}
        positiveButtonText={t('common.ok')}
        positiveButtonBackgroundColor={COLORS_LIGHT.brightBlue}
        onPositiveButtonPress={() => {
          setShouldDisplayRequiredFieldAlert(false);
        }}
      />
      {/* End Required Fields Warning Alert */}
    </SafeAreaView>
  );
};

export { RepeatableFormView };
