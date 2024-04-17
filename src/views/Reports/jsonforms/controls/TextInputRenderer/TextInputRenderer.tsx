// External Dependencies
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  computeLabel,
  ControlProps,
  isStringControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { isEmpty } from 'lodash-es';

// Internal Dependencies
import { FormTextField } from '../components/FormTextField/FormTextField';

// Styles
import styles from '../Controls.style';

const TextInputRenderer = ({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
}: ControlProps) => {
  // Component State
  const [value, setValue] = useState<string>((data || (schema.default ? schema.default : '')));
  const [isFocused, setIsFocused] = useState(false);

  // Utility Functions
  const computedLabel = computeLabel(
    label,
    required || false,
    false,
  );

  useEffect(() => {
    if (schema.default) {
      setTimeout(() => {
        handleChange(path, schema.default);
      }, 10);
    }
  }, [schema]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!schema.isHidden ? (
        <View style={styles.container}>
          <FormTextField
            placeholder={computedLabel}
            isFocused={isFocused}
            onChangeText={(text: string) => {
              setValue(text);
              handleChange(path, isEmpty(text) ? undefined : text);
            }}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      ) : null}
    </>
  );
};

export const textInputTester: RankedTester = rankWith(1, isStringControl);

export default withJsonFormsControlProps(TextInputRenderer);
