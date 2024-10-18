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
