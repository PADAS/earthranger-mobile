// External Dependencies
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  computeLabel,
  ControlProps,
  isNumberControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { isEmpty } from 'lodash-es';

// eslint-disable-next-line import/no-cycle
import { isErrorVisible } from '../../jsonFormsUtils';

// Styles
import styles from '../Controls.style';
import { FormTextField } from '../components/FormTextField/FormTextField';

// Utility Functions
const convertToNumber = (value: string) => {
  if (value.indexOf('.') !== -1) {
    return parseFloat(value);
  }
  return parseInt(value, 10);
};

const NumberInputRenderer = ({
  data,
  handleChange,
  path,
  label,
  required,
  visible,
  errors,
  schema,
}: ControlProps) => {
  // Component State
  const focused = useRef(false);
  const firstLoad = useRef(true);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState<string>((data || (schema.default ? schema.default : '')).toString());
  const [showErrors, setShowErrors] = useState(isErrorVisible(
    visible,
    errors,
    data !== undefined,
  ));
  // Utilities
  // eslint-disable-next-line no-nested-ternary
  const computedLabel = computeLabel(
    label,
    required || false,
    false,
  );

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    setShowErrors(isErrorVisible(
      visible,
      errors,
      focused.current,
    ));
  }, [errors, focused, visible]);

  useEffect(() => {
    if (schema.default) {
      setTimeout(() => {
        handleChange(path, schema.default);
      }, 10);
    }
  }, [schema]);

  // Handlers
  const onChangeTextHandler = (inputValue: string) => {
    if (parseFloat(inputValue) || !isEmpty(inputValue)) {
      handleChange(path, convertToNumber(inputValue));
      setValue(inputValue);
    } else if (isEmpty(inputValue)) {
      handleChange(path, undefined);
      setValue('');
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!schema.isHidden ? (
        <View style={styles.container}>
          <FormTextField
            placeholder={computedLabel}
            keyboardType="decimal-pad"
            enableErrors={showErrors}
            validationMessage={errors}
            onChangeText={(number: string) => onChangeTextHandler(number)}
            isFocused={isFocused}
            onFocus={() => {
              focused.current = true;
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            value={value}
          />
        </View>
      ) : null}
    </>
  );
};

export const numberInputTester: RankedTester = rankWith(1, isNumberControl);

export default withJsonFormsControlProps(NumberInputRenderer);
