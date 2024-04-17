// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { AreaIcon } from '../../../../../../common/icons/AreaIcon';
import { LocationIcon } from '../../../../../../common/icons/LocationIcon';

// Styles
import generalStyles from '../../RecordReportAreaView.styles';
import styles from './PolygonManagementButtons.styles';

interface PolygonManagementButtonsProps {
  onAddPointPressHandler: () => void;
  onCloseAreaPressHandler: () => void;
  isCloseAreaButtonEnabled: boolean;
}

const PolygonManagementButtons = ({
  onAddPointPressHandler,
  onCloseAreaPressHandler,
  isCloseAreaButtonEnabled,
}: PolygonManagementButtonsProps) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View style={generalStyles.buttonOuterContainer}>
      <View style={[generalStyles.buttonInnerContainer, generalStyles.buttonsSpacer]}>
        {/* Add Point */}
        <Pressable
          style={
            [
              generalStyles.buttonBase,
              styles.addPointButton,
            ]
          }
          onPress={onAddPointPressHandler}
        >
          <LocationIcon color={COLORS_LIGHT.white} />
          <Text style={styles.addPointButtonText}>{t('recordReportArea.addPoint')}</Text>
        </Pressable>

        {/* Close Area */}
        <Pressable
          style={[
            generalStyles.buttonBase,
            styles.closeAreaButton,
            isCloseAreaButtonEnabled ? null : generalStyles.disabledState,
          ]}
          onPress={isCloseAreaButtonEnabled ? onCloseAreaPressHandler : null}
        >
          <AreaIcon isDisabled={!isCloseAreaButtonEnabled} />
          <Text style={[
            styles.closeAreaButtonText,
            isCloseAreaButtonEnabled ? null : generalStyles.disabledState,
          ]}
          >
            {t('recordReportArea.closeArea')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export { PolygonManagementButtons };
