// External Dependencies
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { CameraIcon } from '../../../../../../common/icons/CameraIcon';
import { FolderIcon } from '../../../../../../common/icons/FolderIcon';
import { ImageIcon } from '../../../../../../common/icons/ImageIcon';
import { NoteIcon } from '../../../../../../common/icons/NoteIcon';
import log from '../../../../../../common/utils/logUtils';

// Styles
import styles from './ReportFormFooter.styles';

interface ReportFormFooterProps {
  onNotePress: () => void;
  onImagePress: () => void;
  onCameraPress: () => void;
  onSaveDraftPress: () => void;
  disabledIcons: boolean;
  isSaveDraftEnabled: boolean;
}

export const ReportFormFooter = ({
  onNotePress,
  onImagePress,
  onCameraPress,
  onSaveDraftPress,
  disabledIcons,
  isSaveDraftEnabled,
}: ReportFormFooterProps) => {
  // Hooks
  const { t } = useTranslation();

  // Hanlders
  const onSaveDraftPressHandler = () => {
    try {
      onSaveDraftPress();
    } catch (error) {
      log.debug(`[ReportFormFooter] :: Could not save draft - Error ${error}`);
    }
  };

  return (
    <View style={styles.reportFormFooter}>
      <View style={styles.reportFormFooterIcons}>
        <Pressable onPress={onNotePress} disabled={disabledIcons} hitSlop={5}>
          <NoteIcon
            color={
              disabledIcons
                ? COLORS_LIGHT.G4_secondaryLightGray
                : COLORS_LIGHT.G2_secondaryMediumGray
            }
          />
        </Pressable>
        <View style={styles.reportFormCentralIcon}>
          <Pressable onPress={onImagePress} disabled={disabledIcons} hitSlop={5}>
            <ImageIcon
              color={
                disabledIcons
                  ? COLORS_LIGHT.G4_secondaryLightGray
                  : COLORS_LIGHT.G2_secondaryMediumGray
              }
            />
          </Pressable>
        </View>
        <Pressable onPress={onCameraPress} disabled={disabledIcons} hitSlop={5}>
          <CameraIcon
            color={
              disabledIcons
                ? COLORS_LIGHT.G4_secondaryLightGray
                : COLORS_LIGHT.G2_secondaryMediumGray
            }
          />
        </Pressable>
      </View>
      <View style={styles.reportFormFooterDraftContainer}>
        <Pressable
          onPress={isSaveDraftEnabled ? onSaveDraftPressHandler : undefined}
          disabled={disabledIcons || !isSaveDraftEnabled}
          hitSlop={5}
          style={styles.reportFormFooterDraftPressable}
        >
          <FolderIcon color={
            (disabledIcons || !isSaveDraftEnabled)
              ? COLORS_LIGHT.G4_secondaryLightGray
              : COLORS_LIGHT.G2_secondaryMediumGray
          }
          />
          <Text style={styles.reportFormFooterDraftText}>
            {t('reports.save')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
