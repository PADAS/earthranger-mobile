/* eslint-disable no-param-reassign */
/* eslint-disable no-fallthrough */
/* eslint-disable no-restricted-syntax */
// Internal Dependencies
import {
  ElementDisplay,
  getFieldSetTitleKey,
  getSchemaValidations,
  hasEnumDuplicatedItems,
  HELP_VALUE,
  isArrayProperty,
  isCheckbox,
  isDisabledChoice,
  isFieldSet,
  isFieldSetTitle,
  isInactiveChoice,
  isObject,
  isPropertyKey,
  isRequiredProperty,
  isSchemaFieldSet,
  isString,
  REQUIRED_PROPERTY,
} from '../../views/Reports/jsonforms/jsonFormsUtils';

const specialCharactersInKey = /[^\w\n\s_"](?=[^:\n\s{}[]]*:[\t\n\s]*(\{|\[)+)/g;
const emptyEnumRegex = '\\"enum\\"\\n*\\s*\\:\\n*\\s*\\[\\n*\\s*\\]';
const emptyEnumValue = '"enum": ["0"]';
const emptyEnumNamesRegex = '\\"enumNames\\"\\n*\\s*\\:\\n*\\s*\\{\\n*\\s*\\}';
const emptyEnumNamesValue = '"enumNames": {"0":"No Options"}';
const emptyTitleMapRegex = '\\"titleMap\\"\\n*\\s*\\:\\n*\\s*\\[\\n*\\s*\\]';
const emptyTitleMapValue = '"titleMap": [{"value":"no_option", "name":"No Option"}]';
const minParamRegex = /"minimum"(?:[^\\"]|\\\\|\\")*"\d+\.*\d*"/g;
const maxParamRegex = /"maximum"(?:[^\\"]|\\\\|\\")*"\d+\.*\d*"/g;
const doubleSingleQuotesRegex = /"(?=[^"]*(?:"[^"]*)?$)/g;

const getSchemaForCheckbox = (
  definition: any,
  title: string,
  required: boolean,
  defaultValue: string,
) => ({
  type: 'array',
  uniqueItems: true,
  isHidden: false,
  ...required && { required },
  title: title || definition.title,
  items: {
    enum: definition.titleMap.map((item: any) => item.value),
    enumNames: definition.titleMap.map((item: any) => item.name),
  },
  ...defaultValue && { default: defaultValue },
});

const getTitleProperty = (title: string) => ({
  type: 'string',
  readOnly: true,
  isHidden: false,
  display: ElementDisplay.Header,
  title,
});

const getPropertyVisibility = (property: any) => property?.isHidden || false;

const cleanUpRequiredProperty = (schema: any) => {
  const requiredProperties = [];

  // Iterate over the properties to get clean enum data
  for (const key of Object.keys(schema.properties)) {
    const property = schema.properties[key];
    if (isRequiredProperty(property)) {
      requiredProperties.push(key);
      delete schema.properties[key].required;
    }
    if (isArrayProperty(property)) {
      cleanUpRequiredProperty(property.items);
    }
  }

  if (requiredProperties.length > 0) {
    // eslint-disable-next-line no-param-reassign
    schema.required = requiredProperties;
  }

  return schema;
};

const formatDefinitionInSchema = (schema: any) => {
  if (schema.schema.definition) {
    const { definition } = schema.schema;
    delete schema.schema.definition;
    schema.definition = definition;
    return schema;
  }
  return schema;
};

const formatSchemaRepeatableFieldLayout = (schema: any) => {
  const properties: any = {};
  let headerCount = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const item of schema.definition) {
    if (isString(item)) {
      properties[item] = schema.schema.properties[item];
      delete schema.schema.properties[item];
    } else if (isObject(item)) {
      if (item.helpvalue) {
        const property = `help_value_${headerCount}`;
        headerCount += 1;
        properties[property] = getTitleProperty((item.helpvalue || '').replace(/(<.+?>)/g, ''));
      } else if (item.key) {
        properties[item.key] = schema.schema.properties[item.key];
        delete schema.schema.properties[item.key];
      }
    }
  }

  schema.schema.properties = Object.assign(properties, schema.schema.properties);
};

// eslint-disable-next-line max-len
const cleanUpInactiveEnumChoice = (property: any) => property.enum.filter((choice: any) => !property.inactive_enum.includes(choice));

// eslint-disable-next-line max-len
const cleanUpDisabledEnumChoice = (definitionItem: any) => definitionItem.titleMap.filter((item: any) => !definitionItem.inactive_titleMap.includes(item.value));

const validateJSON = (stringSchema: string) => {
  if (stringSchema.match(specialCharactersInKey) !== null) {
    throw Error('Special characters not supported in JSON Schema');
  }
  // Invalid double quotes
  stringSchema = stringSchema.replace(/([“”])/g, '"');
  // Empty enum choices
  stringSchema = stringSchema.replace(new RegExp(emptyEnumRegex, 'g'), emptyEnumValue);
  // Empty enumNames choices
  stringSchema = stringSchema.replace(new RegExp(emptyEnumNamesRegex, 'g'), emptyEnumNamesValue);
  // Empty titleMap choices
  stringSchema = stringSchema.replace(new RegExp(emptyTitleMapRegex, 'g'), emptyTitleMapValue);
  // Numeric ranges
  stringSchema = stringSchema.replace(minParamRegex, (match: string) => match.replace(doubleSingleQuotesRegex, ''));
  stringSchema = stringSchema.replace(maxParamRegex, (match: string) => match.replace(doubleSingleQuotesRegex, ''));

  return stringSchema;
};

const cleanUpJTD = (validations: any, schema: any) => {
  if (isSchemaFieldSet(schema.definition)) {
    validateFieldSetDefinition(validations, schema);
  } else if (schema.definition?.length > 0) {
    for (const item of schema.definition) {
      validateDefinition(validations, item, schema);
    }
  }
};

const validateFieldSetDefinition = (validations: any, schema: any) => {
  for (const item of schema.definition) {
    switch (true) {
      case isString(item):
        break;
      // Create field set header
      case isFieldSetTitle(item):
        {
          const key = getFieldSetTitleKey(item.title);
          schema.schema.properties[key] = getTitleProperty(item.title);
        }
        break;
      // Format field-set sub-items
      case isFieldSet(item):
        // eslint-disable-next-line no-restricted-syntax
        for (const subItem of item.items) {
          validateDefinition(validations, subItem, schema, item);
        }
        break;
      default:
        break;
    }
  }
};

const validateDefinition = (validations: any, item: any, schema: any, parentItem?: any) => {
  const { hasCheckboxes, hasDisabledChoices } = validations;
  // Set property visibility
  if (isString(item) && schema.schema.properties[item]) {
    schema.schema.properties[item].isHidden = getPropertyVisibility(schema.schema.properties[item]);
  } else {
    // Set property visibility
    if ((isObject(item) || isPropertyKey(item))
        && item.key
        && schema.schema.properties[item.key]
    ) {
      // eslint-disable-next-line max-len
      schema.schema.properties[item.key].isHidden = getPropertyVisibility(schema.schema.properties[item.key]);
    }

    // Clean up disabled choices
    if (hasDisabledChoices && isDisabledChoice(item)) {
      if (parentItem) {
        const parentIndex = schema.definition.indexOf(parentItem);
        const childIndex = schema.definition[parentIndex].items.indexOf(item);
        schema.definition[parentIndex].items[childIndex].titleMap = cleanUpDisabledEnumChoice(item);
      } else {
        // eslint-disable-next-line max-len
        schema.definition[schema.definition.indexOf(item)].titleMap = cleanUpDisabledEnumChoice(item);
      }
    }

    // Generate checkbox data in schema
    if (hasCheckboxes && isCheckbox(item)) {
      schema.schema.properties[item.key] = getSchemaForCheckbox(
        item,
        schema.schema.properties[item.key].title || '',
        schema.schema.properties[item.key].required || false,
        schema.schema.properties[item.key].default || false,
      );
    }
  }
};

const validateSchema = (validations: any, schema: any) => {
  const { hasInactiveChoices, hasEnums } = validations;
  if (hasInactiveChoices) {
    for (const key of Object.keys(schema.schema.properties)) {
      const property = schema.schema.properties[key];
      // Clean up inactive choices
      if (isInactiveChoice(property)) {
        schema.schema.properties[key].enum = cleanUpInactiveEnumChoice(property);

        if (schema.schema.properties[key].enum.length === 0) {
          schema.schema.properties[key].enum = ['0'];
          schema.schema.properties[key].enumNames = { 0: 'No Options' };
        }
      }
    }
  }

  if (hasEnums) {
    for (const key of Object.keys(schema.schema.properties)) {
      // Detect duplicated enum items
      if (
        schema.schema.properties[key].enum?.length > 0
        && hasEnumDuplicatedItems(schema.schema.properties[key].enum)
      ) {
        throw new Error('Duplicated items');
      }
    }
  }
};

export const validateJSONSchema = (stringSchema: string) => {
  // Validate/Remove JSON issues
  stringSchema = validateJSON(stringSchema);

  const schema = JSON.parse(stringSchema);

  // $schema and id make JSON forms crash
  delete schema.schema.$schema;
  delete schema.schema.id;

  // Definition array should be at the same level as a schema object
  formatDefinitionInSchema(schema);

  const schemaValidations = getSchemaValidations(stringSchema);

  validateSchema(schemaValidations, schema);

  // JSON forms library does not support JSON Type Definition JTD
  cleanUpJTD(schemaValidations, schema);

  if (stringSchema.includes(HELP_VALUE)) {
    formatSchemaRepeatableFieldLayout(schema);
  }

  if (stringSchema.includes(REQUIRED_PROPERTY)) {
    schema.schema = cleanUpRequiredProperty(schema.schema);
  }
  return schema;
};
