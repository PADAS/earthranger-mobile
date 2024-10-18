// External Dependencies
import React, { useEffect, useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, Platform, KeyboardAvoidingView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@react-native-material/core';
import { inRange } from 'lodash-es';

// Internal Dependencies
import { Position } from '../../types/types';
import { COLORS_LIGHT } from '../../constants/colors';

// Styles
import styles from './EditLocationDialog.styles';

// Interfaces
interface EditLocationDialogProps {
  coordinates: Position;
  displayEditDialog: boolean;
  onCancelDialogPress: () => void;
  onSaveDialogPress: (updatedReportCoordinates: Position) => void;
}

// Constants

// End value is 1 above to include the real value.
const LATITUDE_VALUES_RANGE = [-85.0511, 85.0512];
const LONGITUDE_VALUES_RANGE = [-180, 180.000001];

// Utility Functions
const isValidCoordinate = (value: string) => value.match(/^-?[0-9]{1,}\.{0,1}[0-9]{0,}$/);

export const EditLocationDialog = ({
  coordinates,
  displayEditDialog,
  onCancelDialogPress,
  onSaveDialogPress,
}: EditLocationDialogProps) => {
  // Hooks
  const { t } = useTranslation();

  // Component's State
  const [originalCoordinates, setOriginalCoordinates] = useState(coordinates);
  const [latitude, setLatitude] = useState(coordinates[1].toString());
  const [longitude, setLongitude] = useState(coordinates[0].toString());
  const [hasLatitudeError, setHasLatitudeError] = useState(false);
  const [latitudeErrorMsg, setLatitudeErrorMsg] = useState('');
  const [hasLongitudeError, setHasLongitudeError] = useState(false);
  const [longitudeErrorMsg, setLongitudeErrorMsg] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Handlers
  const onLatitudeChange = (value: string) => {
    if (value
      && (
        !isValidCoordinate(value)
        || !inRange(parseFloat(value), LATITUDE_VALUES_RANGE[0], LATITUDE_VALUES_RANGE[1])
      )
    ) {
      setHasLatitudeError(true);
      setLatitudeErrorMsg(t('editCoordinatesDialog.errorMsg'));
    } else {
      setHasLatitudeError(false);
      setLatitudeErrorMsg('');
    }
    setLatitude(value);
  };

  const onLongitudeChange = (value: string) => {
    if (value
      && (
        !isValidCoordinate(value)
        || !inRange(parseFloat(value), LONGITUDE_VALUES_RANGE[0], LONGITUDE_VALUES_RANGE[1])
      )
    ) {
      setHasLongitudeError(true);
      setLongitudeErrorMsg(t('editCoordinatesDialog.errorMsg'));
    } else {
      setHasLongitudeError(false);
      setLongitudeErrorMsg('');
    }
    setLongitude(value);
  };

  const onDialogReset = () => {
    setLatitude(originalCoordinates[1].toString());
    setLongitude(originalCoordinates[0].toString());
    setHasLatitudeError(false);
    setHasLongitudeError(false);
    setIsFormValid(true);
    onCancelDialogPress();
  };

  const onDialogSave = () => {
    setOriginalCoordinates([parseFloat(longitude), parseFloat(latitude)]);
    onSaveDialogPress([parseFloat(longitude), parseFloat(latitude)] as Position);
  };

  // Component's Life-cycle
  useEffect(() => {
    if (latitude && longitude && !hasLatitudeError && !hasLongitudeError) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [latitude, longitude, hasLatitudeError, hasLongitudeError]);

  useEffect(() => {
    setLatitude(coordinates[1].toString());
    setLongitude(coordinates[0].toString());
  }, [coordinates]);

  return (
    <Modal visible={displayEditDialog} transparent animationType="fade">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Latitude/Longitude Text Inputs */}
            <TextInput
              label={t('editCoordinatesDialog.latitude')}
              color={hasLatitudeError ? COLORS_LIGHT.red : COLORS_LIGHT.brightBlue}
              inputStyle={styles.modalTextInput}
              inputContainerStyle={[
                styles.modalInputContainer,
                hasLatitudeError ? styles.modalInputContainerError : null,
              ]}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              value={latitude}
              onChangeText={onLatitudeChange}
              maxLength={10}
            />

            {hasLatitudeError
              && <Text style={styles.modalErrorText}>{latitudeErrorMsg}</Text>}

            <TextInput
              label={t('editCoordinatesDialog.longitude')}
              color={hasLongitudeError ? COLORS_LIGHT.red : COLORS_LIGHT.brightBlue}
              style={styles.modalTextInputContainer}
              inputStyle={styles.modalTextInput}
              inputContainerStyle={[
                styles.modalInputContainer,
                hasLongitudeError ? styles.modalInputContainerError : null,
              ]}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              value={longitude}
              onChangeText={onLongitudeChange}
              maxLength={11}
            />

            {hasLongitudeError
              && <Text style={styles.modalErrorText}>{longitudeErrorMsg}</Text>}
            {/* End Latitude/Longitude Text Inputs */}

            {/* Buttons */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={() => onDialogReset()}>
                <View style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>{t('editCoordinatesDialog.cancel')}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={
                  () => onDialogSave()
                }
                disabled={!isFormValid}
              >
                <View style={[styles.saveButton, !isFormValid ? styles.saveButtonDisabled : null]}>
                  <Text style={styles.saveButtonText}>{t('editCoordinatesDialog.save')}</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* End Buttons */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
