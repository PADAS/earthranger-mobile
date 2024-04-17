// External Dependencies
import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import {
  and,
  isStringControl,
  optionIs,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';

// Styles
import styles from '../Controls.style';

export const HeaderLabelRenderer = ({
  label,
}: any) => (
  <>
    <View style={styles.divider} />
    <Text style={styles.headerText} heading2 black>{label}</Text>
  </>
);

export const headerLabelRendererTester: RankedTester = rankWith(5, and(
  isStringControl,
  optionIs('format', 'form-label'),
));

export default withJsonFormsLayoutProps(HeaderLabelRenderer);
