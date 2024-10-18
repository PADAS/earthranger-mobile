// External Dependencies
import { Text } from 'react-native';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { JsonForms } from '@jsonforms/react';
import { createAjv } from '@jsonforms/core';
import { generateUISchema, validateJSONSchema } from '@earthranger/react-native-jsonforms-formatter';

// Internal Dependencies
import {
  RNCells,
  RNRenderers,
} from '../../../../jsonforms/jsonFormsUtils';
import log from '../../../../../../common/utils/logUtils';

// Interfaces
interface ReportJsonFormProps {
  schema: string;
  draftData: any;
  setIsFormEmpty: Dispatch<SetStateAction<boolean>>;
  setReportFormData: Dispatch<SetStateAction<any>>;
  setShowSchemaErrorMessage: Dispatch<SetStateAction<boolean>>;
  setSchemaErrors: Dispatch<SetStateAction<any>>;
}

const VIEW_NAME = 'ReportJsonForm';

export const ReportJsonForm = ({
  schema,
  draftData,
  setIsFormEmpty,
  setReportFormData,
  setSchemaErrors,
  setShowSchemaErrorMessage,
}: ReportJsonFormProps) => {
  // Component's State
  const [jsonSchema, setJsonSchema] = useState<any>({});
  const [uiSchema, setUiSchema] = useState<any>();
  const [isValidSchema, setIsValidSchema] = useState<boolean | undefined>(undefined);

  // References
  const ajv = useRef(createAjv({ useDefaults: true })).current;

  useEffect(() => {
    const initJsonForm = async () => {
      try {
        const validSchema = validateJSONSchema(schema);
        const uiElements = generateUISchema(validSchema);
        setJsonSchema(validSchema.schema);
        setUiSchema({
          type: 'Categorization',
          elements: [...[uiElements]],
          options: {
            variant: 'navigation',
          },
        });

        if (draftData) {
          setReportFormData(draftData);
        }
        setIsValidSchema(true);
      } catch (error) {
        setIsValidSchema(false);
        setShowSchemaErrorMessage(true);
        log.error(`${VIEW_NAME} :: Could not render form ->`, error);
      }
    };

    initJsonForm();
  }, [schema]);

  // Handlers
  const validateFormIsEmpty = (data: any) => {
    const isEmpty = Object.values(data).every((x) => x === null || x === '' || Number.isNaN(x));
    setIsFormEmpty(isEmpty);
  };

  return (
    <>
      { !isValidSchema && (<Text>{isValidSchema === undefined ? '' : 'Invalid JSON Schema'}</Text>) }
      {
        isValidSchema && (
          <JsonForms
            schema={jsonSchema}
            uischema={uiSchema}
            data={draftData ?? {}}
            renderers={RNRenderers}
            cells={RNCells}
            onChange={({ data, errors }) => {
              validateFormIsEmpty(data);
              setSchemaErrors(errors);
              setReportFormData(data);
            }}
            ajv={ajv}
          />
        )
      }
    </>
  );
};
