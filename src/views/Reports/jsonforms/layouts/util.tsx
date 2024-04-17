// External Dependencies
import React from 'react';
import { View } from 'react-native';
import { JsonSchema, Layout } from '@jsonforms/core';
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react';
import { isEmpty } from 'lodash-es';

// Interfaces
interface RenderChildrenProps {
  layout: Layout;
  schema: JsonSchema;
  path: string;
}

export const renderChildren = ({
  layout,
  schema,
  path,
}: RenderChildrenProps) => {
  if (isEmpty(layout.elements)) {
    return [];
  }

  const { renderers, cells } = useJsonForms();

  return layout.elements.map((child, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <View key={`${path}-${index}`}>
      <JsonFormsDispatch
        renderers={renderers}
        cells={cells}
        uischema={child}
        schema={schema}
        path={path}
      />
    </View>
  ));
};
