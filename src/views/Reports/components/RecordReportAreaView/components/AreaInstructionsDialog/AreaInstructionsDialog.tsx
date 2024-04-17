// External Dependencies
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import {
  Colors,
  Dialog,
  PageControl,
  Text,
  View,
  Wizard,
} from 'react-native-ui-lib';

// Internal Dependencies
import { LeftArrowIcon } from '../../../../../../common/icons/LeftArrowIcon';
import { RightArrowIcon } from '../../../../../../common/icons/RightArrowIcon';
import { StepOne } from './components/StepOne/StepOne';
import { StepThree } from './components/StepThree/StepThree';
import { StepTwo } from './components/StepTwo/StepTwo';

// Styles
import styles from './AreaInstructionsDialog.styles';

// Constants
const WIZARD_PAGES = 3;

// Interfaces
interface AreaInstructionsDialogProps {
  onToggleVisibility: (isVisible: boolean) => void;
}

const AreaInstructionsDialog = ({
  onToggleVisibility,
}: AreaInstructionsDialogProps) => {
  // Hooks
  const { t } = useTranslation();

  // Component's State
  const [activeIndex, setActiveIndex] = useState(0);

  // Utilities
  const renderCurrentStep = () => {
    switch (activeIndex) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
      default:
        break;
    }

    return null;
  };

  // Handlers
  const onArrowPress = (direction: 'BACKWARD' | 'FORWARD') => {
    if (direction === 'BACKWARD') {
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    } else if (direction === 'FORWARD') {
      if (activeIndex < 2) {
        setActiveIndex(activeIndex + 1);
      }
    }
  };

  return (
    <Dialog
      visible
      containerStyle={styles.dialog}
      ignoreBackgroundPress
    >
      {/* Main Container */}
      <>
        {/* Wizard */}
        <Wizard activeIndex={activeIndex} containerStyle={styles.wizard}>
          {renderCurrentStep()}
        </Wizard>
        {/* End Wizard */}

        {/* Bottom Bar */}
        <>
          <PageControl
            color={Colors.brightBlue}
            currentPage={activeIndex}
            inactiveColor={Colors.lightGrayLines}
            numOfPages={WIZARD_PAGES}
          />

          <View style={styles.controlBar}>
            {/* Left Controls */}
            <Pressable
              onPress={() => onToggleVisibility(false)}
              hitSlop={{
                top: 20, bottom: 20, left: 20, right: 20,
              }}
            >
              <Text heading3 color={Colors.secondaryGray}>
                {activeIndex === 2 ? t('common.done') : t('common.skip')}
              </Text>
            </Pressable>
            {/* Left Controls */}

            {/* Right Controls */}
            <View style={styles.rightControls}>
              {/* Previous */}
              <Pressable
                style={[styles.leftArrow, activeIndex === 0 ? styles.disabledArrow : null]}
                onPress={() => onArrowPress('BACKWARD')}
                hitSlop={{
                  top: 20, bottom: 20, left: 20, right: 20,
                }}
                disabled={activeIndex === 0}
              >
                <LeftArrowIcon color={Colors.secondaryMediumGray} />
              </Pressable>

              {/* Next */}
              <Pressable
                style={[styles.rightArrow, activeIndex >= 2 ? styles.disabledArrow : null]}
                onPress={() => onArrowPress('FORWARD')}
                hitSlop={{
                  top: 20, bottom: 20, left: 20, right: 20,
                }}
                disabled={activeIndex >= 2}
              >
                <RightArrowIcon color={Colors.secondaryMediumGray} />
              </Pressable>
            </View>
            {/* Right Controls */}
          </View>
        </>
        {/* End Bottom Bar */}
      </>
      {/* End Main Container */}
    </Dialog>
  );
};

export { AreaInstructionsDialog };
