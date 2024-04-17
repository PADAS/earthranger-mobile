/* eslint-disable import/no-named-as-default */
// External Dependencies
import { RankedTester } from '@jsonforms/core';
import { isEmpty } from 'lodash-es';

// Internal Dependencies
import CategorizationRenderer from './complex/categorization/CategorizationRenderer';
import { categorizationTester } from './complex/categorization/tester';
import LabelRenderer, { labelRendererTester } from './complex/LabelRenderer';
// eslint-disable-next-line import/no-cycle
import NumberInputRenderer, { numberInputTester } from './controls/NumberInputRenderer/NumberInputRenderer';
import SelectPickerRenderer, { selectPickerTester } from './controls/SelectPickerRenderer/SelectPickerRenderer';
import TextInputRenderer, { textInputTester } from './controls/TextInputRenderer/TextInputRenderer';
import VerticalLayout, { verticalLayoutTester } from './layouts/VerticalLayout';
import DateTimeRenderer, { dateTimeTester } from './controls/DateTimeRenderer/DateTimeRenderer';
import MultiselectPickerRenderer, {
  multiselectPickerTester,
} from './controls/MultiselectPickerRenderer/MultiselectPickerRenderer';
import RepeatableFieldRenderer, { repeatableFormTester } from './controls/RepeatableFieldRenderer/RepeatableFieldRenderer';
import HeaderLabelRenderer, { headerLabelRendererTester } from './controls/HeaderLabelRenderer/HeaderLabelRenderer';

export enum DateTimeFormat {
  DateTime = 'date-time',
  Date = 'date',
}

export enum PropertyFormat {
  DateTime = 'date-time',
  MultiSelect = 'multiselect',
  RepeatableField = 'repeatable-field',
  FormLabel = 'form-label',
}

export enum ElementDisplay {
  Header = 'header',
}

export const FIELD_SET = 'fieldset';
export const HELP_VALUE = 'helpvalue';
export const REQUIRED_PROPERTY = 'required';
export const CHECKBOXES = 'checkboxes';
export const INACTIVE_ENUM = 'inactive_enum';
export const DISABLED_ENUM = 'inactive_titleMap';
export const STRING_TYPE = 'string';
export const ARRAY_TYPE = 'array';
export const ENUM = 'enum';

export const RNRenderers: { tester: RankedTester; renderer: any }[] = [
  { tester: repeatableFormTester, renderer: RepeatableFieldRenderer },
  { tester: multiselectPickerTester, renderer: MultiselectPickerRenderer },
  { tester: selectPickerTester, renderer: SelectPickerRenderer },
  { tester: textInputTester, renderer: TextInputRenderer },
  { tester: numberInputTester, renderer: NumberInputRenderer },
  { tester: dateTimeTester, renderer: DateTimeRenderer },
  { tester: verticalLayoutTester, renderer: VerticalLayout },
  { tester: labelRendererTester, renderer: LabelRenderer },
  { tester: headerLabelRendererTester, renderer: HeaderLabelRenderer },
  { tester: categorizationTester, renderer: CategorizationRenderer },
];

export const isErrorVisible = (
  visible: boolean,
  errors: string,
  isFocused: boolean,
): boolean => (!isEmpty(errors) && visible && isFocused);

export const RNCells: Array<{ tester: RankedTester; cell: any }> = [];

export const isObject = (item: any) => item instanceof Object;

export const isString = (item: any) => typeof item === STRING_TYPE;

export const isSchemaFieldSet = (definition: any[]) => {
  if (definition.length === 0) {
    return false;
  }
  const fieldSet = definition.find((item: any) => item instanceof Object
    && item && (item.type || '') === FIELD_SET);
  return fieldSet !== undefined;
};

export const isFieldSetTitle = (item: any) => item.type === FIELD_SET
  && !isEmpty(item.title);

export const isFieldSetTitleWithoutItems = (item: any) => item.type === FIELD_SET
  && item.items.length === 0 && !isEmpty(item.title);

export const isFieldSet = (item: any) => item.type === FIELD_SET && item.items.length > 0;

export const isCheckbox = (item: any) => item.type === CHECKBOXES;

export const isPropertyKey = (item: any) => !isEmpty(item.key);

export const getFieldSetTitleKey = (title: string) => {
  const key = title.toLowerCase().replace(/[\s\\/\\%]/gi, '_');
  return `fieldset__title_${key}`;
};

export const getSchemaValidations = (stringSchema: string) => ({
  hasCheckboxes: hasCheckboxes(stringSchema),
  hasInactiveChoices: hasInactiveChoices(stringSchema),
  hasDisabledChoices: hasDisabledChoices(stringSchema),
  hasEnums: hasEnums(stringSchema),
});

export const isArrayProperty = (property: any) => property.type === ARRAY_TYPE
  && !property.items?.enum && !property.items?.enumNames;

export const isRequiredProperty = (property: any) => property.required === 'true' || property.required > 0;

export const isInactiveChoice = (item: any) => item.type === STRING_TYPE
  && item.enum?.length > 0 && item.inactive_enum?.length > 0;

export const isDisabledChoice = (item: any) => isObject(item)
  && item.type === CHECKBOXES && item.inactive_titleMap?.length > 0
  && item.titleMap?.length > 0;

const hasCheckboxes = (stringSchema: string) => stringSchema.includes(CHECKBOXES);

const hasInactiveChoices = (stringSchema: string) => stringSchema.includes(INACTIVE_ENUM);

const hasDisabledChoices = (stringSchema: string) => stringSchema.includes(DISABLED_ENUM);

const hasEnums = (stringSchema: string) => stringSchema.includes(ENUM);

// eslint-disable-next-line max-len
export const hasEnumDuplicatedItems = (options: string[]) => (new Set(options).size !== options.length);
