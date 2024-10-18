// External Dependencies
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BackHandler, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActionSheet,
  Button,
  Checkbox,
  Text,
  View,
} from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportFormSubmitButton } from '../ReportForm/components/ReportFormSubmitButton/ReportFormSubmitButton';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import {
  EVENT_FILTERS_CHANGED,
  IS_STATUS_FILTER_DRAFT_SELECTED,
  IS_STATUS_FILTER_ENABLED,
  IS_STATUS_FILTER_PENDING_SELECTED,
  IS_STATUS_FILTER_SYNCED_SELECTED,
} from '../../../../common/constants/constants';
import { getBoolForKey, setBoolForKey } from '../../../../common/data/storage/keyValue';
import { CheckmarkIcon } from '../../../../common/icons/CheckmarkIcon';
import { CloseIcon } from '../../../../common/icons/CloseIcon';
import { customBackButton, osBackIcon } from '../../../../common/components/header/header';
import { getEventEmitter } from '../../../../common/utils/AppEventEmitter';

import { RootStackParamList } from '../../../../common/types/types';
// Styles
import styles from './EventsListFilterView.styles';

// Icons
const ActionSheetCheckmark = () => <CheckmarkIcon color={COLORS_LIGHT.G0_black} height="24" width="24" viewbox="0 0 28 14" />;
const ActionSheetClose = () => <CloseIcon color={COLORS_LIGHT.G0_black} height="24" width="24" viewbox="0 0 28 14" />;

const EventsListFilterView = () => {
  // Hooks
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'EventsListFilterView'>>();

  // State
  const [isDraftsSelected, setIsDraftsSelected] = useState(
    getBoolForKey(IS_STATUS_FILTER_DRAFT_SELECTED) || false,
  );
  const [isPendingSyncSelected, setIsPendingSyncSelected] = useState(
    getBoolForKey(IS_STATUS_FILTER_PENDING_SELECTED) || false,
  );
  const [isSyncedSelected, setIsSyncedSelected] = useState(
    getBoolForKey(IS_STATUS_FILTER_SYNCED_SELECTED) || false,
  );
  const [originalFilterState] = useState({
    IS_STATUS_FILTER_DRAFT_SELECTED: getBoolForKey(IS_STATUS_FILTER_DRAFT_SELECTED) || false,
    IS_STATUS_FILTER_PENDING_SELECTED: getBoolForKey(IS_STATUS_FILTER_PENDING_SELECTED) || false,
    IS_STATUS_FILTER_SYNCED_SELECTED: getBoolForKey(IS_STATUS_FILTER_SYNCED_SELECTED) || false,
    IS_STATUS_FILTER_ENABLED: getBoolForKey(IS_STATUS_FILTER_ENABLED) || false,
  });
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);
  const [showFilterChangeAlert, setShowFilterChangeAlert] = useState(false);

  // Utilities
  const closeFilterView = () => {
    if (hasSelectionChanged) {
      setShowFilterChangeAlert(true);
    } else {
      dismissFilterView();
    }
  };

  const dismissFilterView = () => {
    if (hasSelectionChanged) {
      getEventEmitter().emit(EVENT_FILTERS_CHANGED);
    }
    navigation.pop();
  };

  // Components
  const headerRight = () => (
    <Pressable
      // @ts-ignore
      onPress={() => dismissFilterView()}
      hitSlop={20}
    >
      <ReportFormSubmitButton />
    </Pressable>
  );

  // eslint-disable-next-line arrow-body-style
  const cancelIcon = useMemo(() => {
    return (
      <View style={styles.footerButtonIcon}>
        <CloseIcon
          width="13"
          height="13"
          viewbox="0 0 16 16"
        />
      </View>
    );
  }, []);
  // eslint-disable-next-line arrow-body-style
  const applyIcon = useMemo(() => {
    return (
      <View style={styles.footerButtonIcon}>
        <CheckmarkIcon
          width="16"
          height="13"
          viewbox="0 0 16 13"
          color={COLORS_LIGHT.white}
        />
      </View>
    );
  }, []);

  // Effects
  useEffect(() => {
    navigation.setOptions({
      // @ts-ignore
      headerRight,
      headerLeft: () => customBackButton(osBackIcon, closeFilterView, false),
      gestureEnabled: false,
    });
  }, [hasSelectionChanged]);

  useEffect(() => {
    if (!isDraftsSelected && !isPendingSyncSelected && !isSyncedSelected) {
      setBoolForKey(IS_STATUS_FILTER_ENABLED, false);
    } else {
      setBoolForKey(IS_STATUS_FILTER_ENABLED, true);
    }
  }, [
    isDraftsSelected,
    isPendingSyncSelected,
    isSyncedSelected,
  ]);

  useEffect(() => {
    const backAction = () => {
      closeFilterView();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [hasSelectionChanged]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      {/* Status Section */}
      <>
        <Text label style={styles.sectionTitle}>{t('eventsListFilterView.status.title')}</Text>
        <View style={styles.statusSectionContainer}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              borderRadius={4}
              color={COLORS_LIGHT.brightBlue}
              label={t('eventsListFilterView.status.options.draft')}
              labelStyle={styles.checkboxLabel}
              onValueChange={() => {
                setBoolForKey(IS_STATUS_FILTER_DRAFT_SELECTED, !isDraftsSelected);
                setIsDraftsSelected(!isDraftsSelected);
                setHasSelectionChanged(true);
              }}
              value={isDraftsSelected}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              borderRadius={4}
              color={COLORS_LIGHT.brightBlue}
              label={t('eventsListFilterView.status.options.pendingSync')}
              labelStyle={styles.checkboxLabel}
              onValueChange={() => {
                setBoolForKey(IS_STATUS_FILTER_PENDING_SELECTED, !isPendingSyncSelected);
                setIsPendingSyncSelected(!isPendingSyncSelected);
                setHasSelectionChanged(true);
              }}
              value={isPendingSyncSelected}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              borderRadius={4}
              color={COLORS_LIGHT.brightBlue}
              label={t('eventsListFilterView.status.options.synced')}
              labelStyle={styles.checkboxLabel}
              onValueChange={() => {
                setBoolForKey(IS_STATUS_FILTER_SYNCED_SELECTED, !isSyncedSelected);
                setIsSyncedSelected(!isSyncedSelected);
                setHasSelectionChanged(true);
              }}
              value={isSyncedSelected}
            />
          </View>
        </View>
      </>
      {/* End Status Section */}

      {/* Discard changes ActionSheet */}
      <ActionSheet
        visible={showFilterChangeAlert}
        title={t('eventsListFilterView.title')}
        onDismiss={() => setShowFilterChangeAlert(false)}
        options={[
          {
            iconSource: () => ActionSheetCheckmark,
            label: t('eventsListFilterView.saveAndApply'),
            onPress: () => {
              dismissFilterView();
            },
          },
          {
            iconSource: () => ActionSheetClose,
            label: t('eventsListFilterView.discard'),
            onPress: () => {
              setIsDraftsSelected(false);
              setIsPendingSyncSelected(false);
              setIsSyncedSelected(false);
              setBoolForKey(
                IS_STATUS_FILTER_DRAFT_SELECTED,
                originalFilterState.IS_STATUS_FILTER_DRAFT_SELECTED,
              );
              setBoolForKey(
                IS_STATUS_FILTER_PENDING_SELECTED,
                originalFilterState.IS_STATUS_FILTER_PENDING_SELECTED,
              );
              setBoolForKey(
                IS_STATUS_FILTER_SYNCED_SELECTED,
                originalFilterState.IS_STATUS_FILTER_SYNCED_SELECTED,
              );
              setBoolForKey(
                IS_STATUS_FILTER_ENABLED,
                originalFilterState.IS_STATUS_FILTER_ENABLED,
              );
              dismissFilterView();
            },
          },
        ]}
      />
      {/* End Discard changes ActionSheet */}

      {/* Footer Section */}
      <View style={styles.footer}>
        {/* Clear */}
        <Button
          disabled={!isDraftsSelected && !isPendingSyncSelected && !isSyncedSelected}
          iconSource={() => cancelIcon}
          label={t('common.clearAll')}
          labelStyle={{
            ...styles.footerButtonLabel,
            color: COLORS_LIGHT.G1_off_black,
          }}
          onPress={() => {
            setIsDraftsSelected(false);
            setIsPendingSyncSelected(false);
            setIsSyncedSelected(false);
            setBoolForKey(IS_STATUS_FILTER_DRAFT_SELECTED, false);
            setBoolForKey(IS_STATUS_FILTER_PENDING_SELECTED, false);
            setBoolForKey(IS_STATUS_FILTER_SYNCED_SELECTED, false);
            setHasSelectionChanged(true);
          }}
          style={[
            styles.footerButton,
            !isDraftsSelected && !isPendingSyncSelected && !isSyncedSelected
              ? styles.footerButtonDisabled
              : null,
          ]}
          size={Button.sizes.medium}
        />

        {/* Apply */}
        <Button
          iconSource={() => applyIcon}
          label={t('common.apply')}
          labelStyle={{
            ...styles.footerButtonLabel,
            color: COLORS_LIGHT.white,
          }}
          onPress={() => dismissFilterView()}
          style={[styles.footerButton, styles.footerButtonConfirm]}
          size={Button.sizes.medium}
        />
      </View>
      {/* End Footer Section */}
    </SafeAreaView>
  );
};

export { EventsListFilterView };
