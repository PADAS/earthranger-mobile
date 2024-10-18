/* eslint-disable @typescript-eslint/indent */
// External Dependencies
import React, { useState } from 'react';
import { View } from 'react-native';
import {
    Picker,
    PickerModes,
    PickerValue,
} from 'react-native-ui-lib';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  and,
  computeLabel,
  ControlProps,
  optionIs,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { OwnPropsOfEnum } from '@jsonforms/core/src/util/renderer';
import { schemaTypeIs, uiTypeIs } from '@jsonforms/core/src/testers/testers';

// Internal Dependencies
import { ArrowDownIcon } from '../../../../../common/icons/ArrowDownIcon';
import {
  ReportFormSubmitButton,
} from '../../../components/ReportForm/components/ReportFormSubmitButton/ReportFormSubmitButton';
import { FormTextField } from '../components/FormTextField/FormTextField';
import { BackIconAndroid } from '../../../../../common/icons/BackIconAndroid';
import { BackIconiOS } from '../../../../../common/icons/BackIconiOS';
import { IS_ANDROID } from '../../../../../common/constants/constants';

// Styles
import styles from '../Controls.style';

const BackIcon = React.memo(() => (IS_ANDROID ? <BackIconAndroid /> : <BackIconiOS />));

const MultiselectPickerRenderer = ({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
}: ControlProps & OwnPropsOfEnum) => {
  // Component's State
  const [value, setValue] = useState<[any]>(data || []);
  const [isFocused, setIsFocused] = useState(false);

  // Handlers
  const onPickerChangeHandler = (items: [any]) => {
    setValue(items);
    handleChange(path, items);
  };

  // Utility Functions
  const computedLabel = computeLabel(
    label,
    required || false,
    false,
  );

  const submitButton = () => <ReportFormSubmitButton />;

  const ArrowDownCustomIcon = (
    <View style={styles.trailingAccessory}>
      <ArrowDownIcon />
    </View>
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!schema.isHidden ? (
        <View style={styles.container}>
          <Picker
            placeholder={label}
            value={value}
            migrate
            mode={PickerModes.MULTI}
            onChange={onPickerChangeHandler}
            showSearch
            topBarProps={{
              title: schema.title,
              doneButtonProps: {
                label: '',
                iconSource: submitButton,
              },
              // eslint-disable-next-line react/no-unstable-nested-components
              cancelIcon: () => <BackIcon />,
            }}
            renderPicker={(_pickerValue: PickerValue, pickerLabel: PickerValue) => (
              <FormTextField
                placeholder={computedLabel}
                value={pickerLabel?.toString().replace(/,/g, ', ')}
                trailingAccessory={ArrowDownCustomIcon}
                isFocused={isFocused}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            )}
          >
            {schema?.items?.enum.map((item: any, i: number) => (
              <Picker.Item key={item} value={item} label={schema?.items?.enumNames[i]} />
            ))}
          </Picker>
        </View>
      ) : null}
    </>
  );
};

export const multiselectPickerTester: RankedTester = rankWith(
  6,
  and(
    uiTypeIs('Control'),
    schemaTypeIs('array'),
    optionIs('format', 'multiselect'),
  ),
);

export default withJsonFormsControlProps(MultiselectPickerRenderer);
