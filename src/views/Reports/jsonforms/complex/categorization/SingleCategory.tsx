import { Category, JsonSchema } from '@jsonforms/core';
import { JsonFormsDispatch } from '@jsonforms/react';
import React from 'react';
import { View } from 'react-native';

export interface CategoryProps {
  category: Category;
  schema: JsonSchema;
  path: string;
}

export const SingleCategory = ({ category, schema, path }: CategoryProps) => (
  <View>
    {(category.elements || []).map((child, index) => (
      <JsonFormsDispatch
        /* eslint-disable-next-line react/no-array-index-key */
        key={`${path}-${index}`}
        uischema={child}
        schema={schema}
        path={path}
      />
    ))}
  </View>
);
