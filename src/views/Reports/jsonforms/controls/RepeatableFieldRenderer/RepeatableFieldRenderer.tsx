/* eslint-disable @typescript-eslint/indent */
// External Dependencies
import React, { useEffect, useRef, useState } from 'react';
import {
  Text, View,
} from 'react-native-ui-lib';
import { Pressable } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { startCase } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';

// Internal Dependencies
import { EventRightArrow } from '../../../../../common/icons/EventRightArrow';

// Styles
import repeatableFieldStyles from './RepeatableFieldRenderer.styles';
import { getEventEmitter } from '../../../../../common/utils/AppEventEmitter';

const RepeatableFieldRenderer = ({
  path,
  handleChange,
  required,
  schema,
  data,
  id,
}: ControlProps & OwnPropsOfEnum) => {
  // Hooks
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Component's State
  const [repeatableFormData, setRepeatableFormData] = useState<any>(data || []);
  const rendererId = useRef(`repeatable_renderer_${uuidv4()}`).current;
  const eventEmitter = useRef(getEventEmitter()).current;

  // Utility Functions
  const computedLabel = computeLabel(
    schema.title && schema.title.replace(' ', '').length > 0 ? schema.title : startCase(id.split('/').pop()),
    required || false,
    false,
  );

  useEffect(() => {
    const eventListener = eventEmitter.addListener(rendererId, (newData: any) => {
      setRepeatableFormData(newData);
    });

    return () => {
      eventListener.removeListener(rendererId);
    };
  }, []);

  useEffect(() => {
    handleChange(path, repeatableFormData);
  }, [repeatableFormData]);

  const onFieldPressed = () => {
    navigation.push(
      'ReportRepeatableFieldListView',
      {
        formTitle: schema.title && schema.title.replace(' ', '').length > 0 ? schema.title : startCase(id.split('/').pop()),
        rendererId,
        data: repeatableFormData,
        schema,
      },
    );
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!schema.isHidden ? (
        <View style={repeatableFieldStyles.container}>
          <Text label secondaryMediumGray style={repeatableFieldStyles.title}>{computedLabel}</Text>
          <Pressable onPress={onFieldPressed} style={repeatableFieldStyles.fieldContainer}>
            <View style={repeatableFieldStyles.labelContainer}>
              <Text heading3 style={repeatableFieldStyles.label}>{`${t('eventRenderers.multiField.total')} `}</Text>
              <Text heading3 style={repeatableFieldStyles.labelCount}>
                {repeatableFormData.length}
              </Text>
            </View>
            <View style={repeatableFieldStyles.arrowIcon}>
              <EventRightArrow />
            </View>
          </Pressable>
        </View>
        ) : null}
    </>
  );
};

export const repeatableFormTester: RankedTester = rankWith(
  7,
  and(
    uiTypeIs('Control'),
    schemaTypeIs('array'),
    optionIs('format', 'repeatable-field'),
  ),
);

export default withJsonFormsControlProps(RepeatableFieldRenderer);
