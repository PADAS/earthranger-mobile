// External Dependencies
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Button, View, Incubator, Colors,
} from 'react-native-ui-lib';
import { BackHandler } from 'react-native';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash-es';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { RoundedPlusIcon } from '../../../../../../common/icons/RoundedPlusIcon';
import { RepeatableFieldListData } from '../../../../../../common/types/types';
import { ReportRepeatableFieldList } from './components/ReportRepeatableFieldList/ReportRepeatableFieldList';
import { UndoIcon } from '../../../../../../common/icons/UndoIcon';
import { TrashIcon } from '../../../../../../common/icons/TrashIcon';
import { CustomAlert } from '../../../../../../common/components/CustomAlert/CustomAlert';
import { getEventEmitter } from '../../../../../../common/utils/AppEventEmitter';
import { cropHeaderTitleText } from '../../../../../../common/utils/stringUtils';

// Styles
import styles from './ReportRepeatableFieldListView.styles';

const ReportRepeatableFieldListView = () => {
  // Hooks
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Component's State
  const listId = useRef(`repeatable_list_${uuidv4()}`).current;
  const [toastVisible, isToastVisible] = useState(false);
  const [formIdDeleted, setFormIdDeleted] = useState<number | undefined>(undefined);
  const [showAlertCloseForm, setShowAlertCloseForm] = useState(false);
  const eventEmitter = useRef(getEventEmitter()).current;
  const {
    schema,
    formTitle,
    data,
    rendererId,
  } = navigation.getState().routes[navigation.getState().index].params;
  const [listData, setListData] = useState<RepeatableFieldListData[]>([]);
  const itemIdCount = useRef(listData?.length || 0);
  const [formSchema] = useState(schema);
  const shouldRemoveForm = useRef(false);

  // Lifecycle Events
  useEffect(() => {
    initAppBar();
    initData();
  }, []);

  useEffect(() => {
    const eventListener = eventEmitter.addListener(listId, (form: any) => {
      if (form.formId > 0) {
        editForm(form.formId, form.formData);
      } else {
        createForm(form.formData);
      }
    });
    return () => {
      eventListener.removeListener(listId);
    };
  }, [listData]);

  useEffect(() => {
    eventEmitter.emit(rendererId, listData.map((item: RepeatableFieldListData) => (item.data)));
  }, [listData]);

  useEffect(() => {
    const backAction = () => {
      closeReportRepeatableFieldListView();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [listData]);

  // Utility Functions
  const initAppBar = () => {
    navigation.setOptions({ title: cropHeaderTitleText(formTitle) });
  };

  const initData = () => {
    if (data) {
      const initialListData = (data as Array<any>).map((formData: any) => {
        itemIdCount.current += 1;
        return {
          id: itemIdCount.current,
          title: formTitle,
          data: formData,
          hidden: false,
        } as RepeatableFieldListData;
      });
      setListData(initialListData);
    }
  };

  const createForm = (formData: any) => {
    itemIdCount.current += 1;
    setListData((prevState: any) => [...prevState, {
      id: itemIdCount.current,
      title: formTitle,
      data: formData,
      hidden: false,
    } as RepeatableFieldListData]);
  };

  const editForm = (formId: number, formData: any) => {
    const editedListData = listData.map((form) => {
      if (form.id === formId) {
        return { ...form, data: formData };
      }
      return form;
    });
    setListData(editedListData);
  };

  const openNewRepeatableForm = () => {
    navigation.push('RepeatableFormView', {
      title: formTitle,
      schema: formSchema,
      listId,
    });
  };

  const debouncedNewForm = useCallback(
    debounce(openNewRepeatableForm, 1000, { leading: true, trailing: false }),
    [],
  );

  // Handlers
  const onPressRepeatableItem = useCallback((id: number) => {
    const formItem = listData.find((item) => item.id === id);
    if (formItem) {
      navigation.push('RepeatableFormView', {
        title: formTitle,
        schema: formSchema,
        data: formItem.data,
        formId: formItem.id,
        listId,
      });
    }
  }, [listData, formIdDeleted, shouldRemoveForm]);

  const onDeleteRepeatableFormPressed = useCallback((id: number) => {
    const editedListData = listData.map((formData) => {
      if (formData.id === id) {
        setFormIdDeleted(id);
        shouldRemoveForm.current = true;
        return { ...formData, hidden: true };
      }
      return formData;
    });

    isToastVisible(true);
    setListData(editedListData);
  }, [listData, formIdDeleted, shouldRemoveForm]);

  const onUndoDeleteForm = () => {
    const editedListData = listData.map((formData) => {
      if (formData.id === formIdDeleted) {
        setFormIdDeleted(undefined);
        shouldRemoveForm.current = false;
        return { ...formData, hidden: false };
      }
      return formData;
    });
    setListData(editedListData);
  };

  const onDeleteRepeatableForm = () => {
    if (!shouldRemoveForm.current || !formIdDeleted) {
      isToastVisible(false);
      return;
    }
    isToastVisible(false);
    setListData(listData.filter((item) => item.id !== formIdDeleted));
  };

  const closeReportRepeatableFieldListView = () => {
    if (listData.length > 0) {
      setShowAlertCloseForm(true);
    } else {
      navigation.pop();
    }
  };

  const onPositiveButton = () => {
    // @ts-ignore
    navigation.pop();
    setShowAlertCloseForm(false);
  };

  const onNegativeButton = () => {
    setShowAlertCloseForm(false);
  };

  return (
    <>
      {/* List */}
      <ReportRepeatableFieldList
        data={listData}
        schema={schema?.items || {}}
        onPress={onPressRepeatableItem}
        onDeleteItem={onDeleteRepeatableFormPressed}
      />
      {/* End List */}
      {/* Footer */}
      <View style={styles.footer}>
        <Button
          backgroundColor={COLORS_LIGHT.brightBlue}
          size={Button.sizes.large}
              // eslint-disable-next-line react/no-unstable-nested-components
          iconSource={() => <View style={{ marginRight: 8 }}><RoundedPlusIcon /></View>}
          style={{ width: 160 }}
          label={t('reportRepeatableFieldListView.newField')}
          heading3
          onPress={debouncedNewForm}
        />
      </View>
      {/* End Footer */}
      {/* Report Delete Confirmation Toast */}
      <Incubator.Toast
        action={{
          color: COLORS_LIGHT.white,
          iconSource: UndoIcon,
          label: `${t('common.undo')}`,
          onPress: onUndoDeleteForm,
          style: {
            backgroundColor: 'transparent',
            marginRight: 16,
          },
        }}
        autoDismiss={2000}
        backgroundColor={COLORS_LIGHT.G0_black}
        icon={TrashIcon}
        message={t('eventsDrafts.toastRemoveConfirmationText')}
        messageStyle={{ color: COLORS_LIGHT.white }}
        onDismiss={onDeleteRepeatableForm}
        position="bottom"
        style={{ borderRadius: 0 }}
        visible={toastVisible}
      />
      {/* End Report Delete Confirmation Toast */}

      {/* Discard ReportRepeatableFieldListView Alert */}
      <CustomAlert
        displayAlert={showAlertCloseForm}
        alertTitleText={t('reportRepeatableFormView.discardChangesAlert.title')}
        positiveButtonText={t('reportRepeatableFormView.discardChangesAlert.positive')}
        onPositiveButtonPress={onPositiveButton}
        positiveButtonBackgroundColor={Colors.brightRed}
        positiveButtonIcon={<TrashIcon color={Colors.white} />}
        negativeButtonText={t('reportRepeatableFormView.discardChangesAlert.negative')}
        onNegativeButtonPress={onNegativeButton}
      />
      {/* End Discard ReportRepeatableFieldListView Alert */}
    </>
  );
};

export { ReportRepeatableFieldListView };
