// External Dependencies
import React from 'react';
import { Incubator } from 'react-native-ui-lib';

// Internal Dependencies
import { isEmpty } from 'lodash-es';
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

// Styles
import styles from '../../Controls.style';

interface FormTextFieldProps {
  isFocused: Boolean,
}

export const FormTextField = ({
  isFocused,
  value,
  placeholder,
  ...props
}: FormTextFieldProps & Incubator.TextFieldProps) => {
  // eslint-disable-next-line no-nested-ternary
  const backgroundColor = (isFocused ? COLORS_LIGHT.G7_veryLightGrey
    : isEmpty(value) ? COLORS_LIGHT.transparent : COLORS_LIGHT.G7_veryLightGrey);
  const placeholderColor = isFocused ? COLORS_LIGHT.brightBlue
    : COLORS_LIGHT.G2_5_mobileSecondaryGray;
  const borderColor = isFocused ? COLORS_LIGHT.brightBlue : COLORS_LIGHT.G5_LightGreyLines;

  const isLongPlaceHolder = (placeholder?.length || '') > 35;

  const floatingTextField = () => (
    <Incubator.TextField
      bodySmall
      style={styles.textInput}
      floatingPlaceholderStyle={[isLongPlaceHolder ? null : styles.placeholder]}
      floatingPlaceholderColor={placeholderColor}
      containerStyle={[
        styles.textFieldContainer, {
          backgroundColor,
        }]}
      floatingPlaceholder
      floatOnFocus
      multiline
      fieldStyle={[styles.field, { borderColor }]}
      returnKeyType="done"
      blurOnSubmit
      enableErrors={false}
      validationMessageStyle={styles.validationMessage}
      errorColor={COLORS_LIGHT.red}
      value={value}
      placeholder={placeholder}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  );

  const labeledTextField = () => (
    <Incubator.TextField
      bodySmall
      style={styles.textInput}
      containerStyle={[
        styles.textFieldContainer, {
          backgroundColor,
        }]}
      labelColor={placeholderColor}
      multiline
      fieldStyle={[styles.field, { borderColor }]}
      returnKeyType="done"
      blurOnSubmit
      enableErrors={false}
      validationMessageStyle={styles.validationMessage}
      errorColor={COLORS_LIGHT.red}
      value={value}
      label={placeholder}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  );

  return (isLongPlaceHolder ? labeledTextField() : floatingTextField());
};
