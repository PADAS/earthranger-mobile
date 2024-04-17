import { RendererProps } from '@jsonforms/core';
import React from 'react';
import { ScrollView } from 'react-native';
import { WithChildren } from '../../../../common/types/reportsResponse';

interface Props {
  orientation: 'horizontal' | 'vertical';
}

export const JsonFormsLayout = (
  props: RendererProps & WithChildren & Props,
) => {
  // eslint-disable-next-line react/destructuring-assignment
  const flexDirection = props.orientation === 'horizontal' ? 'row' : 'column';

  return (
    <ScrollView
      style={{
        flex: 1,
        flexDirection,
      }}
    >
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.children}
    </ScrollView>
  );
};
