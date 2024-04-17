// External Dependencies
import React from 'react';
import {
  ActivityIndicator,
  View,
  Modal,
} from 'react-native';
import { COLORS_LIGHT } from '../../constants/colors';

// Styles
import styles from './Loader.styles';

interface LoaderProps {
  isVisible: boolean;
}

const Loader = ({
  isVisible,
}: LoaderProps) => (
  <Modal visible={isVisible} transparent animationType="none">
    <View style={styles.container}>
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator style={styles.activityIndicator} size="large" color={COLORS_LIGHT.erTeal} animating />
      </View>
    </View>
  </Modal>
);

export { Loader };
