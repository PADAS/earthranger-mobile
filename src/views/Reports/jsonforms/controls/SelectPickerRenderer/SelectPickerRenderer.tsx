// External Dependencies
import React, { useState } from 'react';
import { View } from 'react-native';
import { Picker, PickerValue } from 'react-native-ui-lib';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  computeLabel,
  ControlProps,
  isEnumControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';

// Internal Dependencies
import { ArrowDownIcon } from '../../../../../common/icons/ArrowDownIcon';
import { FormTextField } from '../components/FormTextField/FormTextField';
import { BackIconAndroid } from '../../../../../common/icons/BackIconAndroid';
import { IS_ANDROID } from '../../../../../common/constants/constants';
import { BackIconiOS } from '../../../../../common/icons/BackIconiOS';

// Styles
import styles from '../Controls.style';

const BackIcon = React.memo(() => (IS_ANDROID ? <BackIconAndroid /> : <BackIconiOS />));

const SelectPickerRenderer = ({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
}: ControlProps) => {
  // Component's State
  const [value, setValue] = useState(data || '');
  const [isFocused, setIsFocused] = useState(false);

  // Handlers
  const onPickerChangeHandler = (pickerValue: PickerValue) => {
    setValue(pickerValue);
    handleChange(path, pickerValue);
  };

  // Utility Functions
  const computedLabel = computeLabel(
    label,
    required || false,
    false,
  );

  const ArrowDownCustomIcon = (
    <View style={styles.trailingAccessory}>
      <ArrowDownIcon />
    </View>
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!schema.isHidden ? (
        <View>
          <Picker
            placeholder={label}
            value={value}
            migrate
            showSearch
            onChange={onPickerChangeHandler}
            // eslint-disable-next-line react/no-unstable-nested-components
            topBarProps={{ title: schema.title, cancelIcon: () => <BackIcon /> }}
            renderPicker={(_value: PickerValue, _label: PickerValue) => (
              <View style={styles.container}>
                <FormTextField
                  placeholder={computedLabel}
                  value={_label?.toString()}
                  trailingAccessory={ArrowDownCustomIcon}
                  isFocused={isFocused}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </View>
            )}
          >
            {schema.enum?.map((item, index) => {
              switch (true) {
                case schema.enumNames && Array.isArray(schema.enumNames):
                  return <Picker.Item key={item} value={item} label={schema.enumNames[index]} />;
                case schema.enumNames && schema.enumNames instanceof Object:
                  return <Picker.Item key={item} value={item} label={schema.enumNames[item]} />;
                default:
                  return <Picker.Item key={item} value={item} label={item} />;
              }
            })}
          </Picker>
        </View>
      ) : null}
    </>
  );
};

export const selectPickerTester: RankedTester = rankWith(1, isEnumControl);

export default withJsonFormsControlProps(SelectPickerRenderer);
