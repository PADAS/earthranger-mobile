// External Dependencies
import React, { useRef, useState } from 'react';
import { View } from 'react-native-ui-lib';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  computeLabel,
  ControlProps,
  isDateTimeControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import dayjs from 'dayjs';

// Internal Dependencies
import { IS_IOS } from '../../../../../common/constants/constants';
import { FormTextField } from '../components/FormTextField/FormTextField';
import { CalendarIcon } from '../../../../../common/icons/CalendarIcon';

// Styles
import styles from './DateTimeRenderer.style';

const DateTimeRenderer = ({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
  uischema,
}: ControlProps) => {
  const getDisplayFormattedDate = (date: Date) => (date ? dayjs(date).format(displayMode === 'datetime' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD') : '');

  // Component State
  const displayMode = useRef(uischema.options?.display === 'date-time'
    ? 'datetime' : uischema.options?.display).current;
  const [value, setValue] = useState<string>(data && dayjs(data) ? getDisplayFormattedDate(dayjs(data).toDate()) : '');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Utilities
  const computedLabel = computeLabel(
    label,
    required || false,
    false,
  );
  const onPressField = () => {
    setIsDatePickerVisible(true);
  };

  const handleConfirmPicker = (date: Date) => {
    dismissDatePicker();
    setSelectedDate(date);
    setValue(getDisplayFormattedDate(date));
    handleChange(path, dayjs(date).toISOString());
  };

  const handleCancelPicker = () => {
    dismissDatePicker();
  };

  const dismissDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const CalendarAccessory = (
    <View style={styles.trailingAccessory}>
      <CalendarIcon />
    </View>
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!schema.isHidden ? (
        <>
          <FormTextField
            placeholder={computedLabel}
            containerStyle={styles.container}
            trailingAccessory={CalendarAccessory}
            editable={false}
            isFocused={isFocused}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPressOut={onPressField}
            value={value}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={displayMode}
            display={IS_IOS ? 'inline' : 'default'}
            onConfirm={handleConfirmPicker}
            onCancel={handleCancelPicker}
            date={selectedDate}
          />
        </>
      ) : null}
    </>
  );
};

export const dateTimeTester: RankedTester = rankWith(3, isDateTimeControl);

export default withJsonFormsControlProps(DateTimeRenderer);
