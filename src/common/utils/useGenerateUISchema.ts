// External Dependencies
import { useCallback } from 'react';
import { isEmpty } from 'lodash-es';

// Internal Dependencies
import {
  DateTimeFormat,
  ElementDisplay,
  getFieldSetTitleKey,
  isFieldSet,
  isFieldSetTitleWithoutItems, isPropertyKey,
  isSchemaFieldSet, PropertyFormat,
} from '../../views/Reports/jsonforms/jsonFormsUtils';
import { isEmptyString } from './stringUtils';

// Enums
enum SchemaTypes {
  Number = 'number',
  String = 'string',
  Array = 'array',
}

const getBaseUIObject = (key: string, title: string, options: any = {}) => (
  {
    type: 'Control',
    scope: `#/properties/${key}`,
    label: title,
    ...options && { options },
  });

const getDateTimeControlFormat = (key: string, jsonSchema: any, fieldSetItem: any = undefined) => {
  try {
    const definitionObject = fieldSetItem
      || jsonSchema.definition.find((object: any) => (object.key === key));

    if (definitionObject.fieldHtmlClass === 'date-time-picker json-schema'
      || (definitionObject && (definitionObject.type || '') === 'datetime')) {
      if (jsonSchema.schema.properties[key].format === 'date') {
        return DateTimeFormat.Date;
      }
      return DateTimeFormat.DateTime;
    }
    if (definitionObject.fieldHtmlClass === 'date-picker json-schema'
      || jsonSchema.schema.properties[key].format === 'date') {
      return DateTimeFormat.Date;
    }
  } catch {
    return undefined;
  }
  return undefined;
};

export const useGenerateUISchema = () => {
  const generateUISchema = useCallback((schema: any) => {
    const elements: Object[] = [];

    if (isSchemaFieldSet(schema.definition)) {
      elements.push(...getFieldSetsElements(schema));
    } else {
      Object.keys(schema.schema.properties).forEach((key: string) => {
        const element = getUIElement(key, schema);
        if (element) {
          elements.push(element);
        }
      });
    }
    return {
      type: 'Category',
      elements,
    };
  }, []);

  return { generateUISchema };
};

const getFieldSetsElements = (schema: any) => {
  const elements: Object[] = [];

  schema.definition.forEach((item: any) => {
    if (typeof item === 'string') {
      elements.push(getBaseUIObject(item, schema.schema.properties[item].title || ''));
    } else if (item instanceof Object) {
      switch (true) {
        case isFieldSetTitleWithoutItems(item):
          elements.push(getBaseUIObject(
            getFieldSetTitleKey(item.title),
            item.title,
            getElementOptions(PropertyFormat.FormLabel),
          ));
          break;
        case isFieldSet(item):
          if (item.title) {
            elements.push(getBaseUIObject(
              getFieldSetTitleKey(item.title),
              item.title,
              getElementOptions(PropertyFormat.FormLabel),
            ));
          }
          item.items.forEach((value: any) => {
            if (value instanceof Object) {
              const element = getUIElement(value.key || '', schema, value);
              if (element) {
                elements.push(element);
              }
            } else if (typeof value === 'string') {
              const element = getUIElement(value, schema);
              if (element) {
                elements.push(element);
              }
            }
          });
          break;
        case isPropertyKey(item):
          // eslint-disable-next-line no-case-declarations
          const element = getUIElement(item.key, schema);
          if (element) {
            elements.push(element);
          }
          break;
        default:
          break;
      }
    }
  });
  return elements;
};

const getElementOptions = (format: string = '', display: string = '') => {
  if (isEmpty(format)) {
    return {};
  }
  const options = { format };
  if (!isEmpty(display)) {
    // @ts-ignore
    options.display = display;
  }
  return options;
};

const getUIElement = (key: string, schema: any, fieldSetItem: any = undefined) => {
  let options = {};
  switch (schema.schema.properties[key].type as SchemaTypes) {
    case SchemaTypes.Number:
      return getBaseUIObject(key, schema.schema.properties[key].title || '');

    case SchemaTypes.String: {
      const dateTimeFormat = getDateTimeControlFormat(key, schema, fieldSetItem);
      if (!isEmptyString(dateTimeFormat)) {
        options = getElementOptions(PropertyFormat.DateTime, dateTimeFormat);
      } else if (schema.schema.properties[key].display
        && schema.schema.properties[key].display === ElementDisplay.Header) {
        options = getElementOptions(PropertyFormat.FormLabel);
      }
      return getBaseUIObject(key, schema.schema.properties[key].title || '', options);
    }

    case SchemaTypes.Array:
      if (schema.schema.properties[key].items.enum
        && schema.schema.properties[key].items.enumNames) {
        options = getElementOptions(PropertyFormat.MultiSelect);
      } else if (schema.schema.properties[key].items) {
        options = getElementOptions(PropertyFormat.RepeatableField);
      }
      return getBaseUIObject(key, schema.schema.properties[key].title || '', options);

    case undefined:
    {
      const dateTimeFormat = getDateTimeControlFormat(key, schema, fieldSetItem);
      if (!isEmptyString(dateTimeFormat)) {
        options = getElementOptions(PropertyFormat.DateTime, dateTimeFormat);
        return getBaseUIObject(key, schema.schema.properties[key].title || '', options);
      }
      return undefined;
    }

    default:
      break;
  }

  return undefined;
};
