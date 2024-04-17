// External Dependencies
import React,
{
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Keyboard, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';

// Internal Dependencies
import { ReportFormSubmitButton } from '../ReportFormSubmitButton/ReportFormSubmitButton';
import { customBackButton } from '../../../../../../common/components/header/header';
import { CloseIcon } from '../../../../../../common/icons/CloseIcon';
import { ALERT_BUTTON_BACKGROUND_COLOR_RED } from '../../../../../../common/constants/constants';
import { CustomAlert } from '../../../../../../common/components/CustomAlert/CustomAlert';
import { TrashIcon } from '../../../../../../common/icons/TrashIcon';
import { Position } from '../../../../../../common/types/types';
import { getEventEmitter } from '../../../../../../common/utils/AppEventEmitter';

// Styles
import styles from './ReportNoteView.styles';

let staticText = '';

const ReportNoteView = () => {
  // Hooks
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const noteText = useRef(route.params?.text || '');
  const eventEmitter = useRef(getEventEmitter()).current;
  const emitterChannelId = useRef(route.params?.channelId || '');
  const noteId = useRef<number>(route.params?.id || 0);
  const [textValue, onChangeText] = useState(route.params?.text || '');
  const [inputBottomMargin, setInputBottomMargin] = useState(0);
  const [showAlertDiscardNote, setShowAlertDiscardNote] = useState(false);
  const [coordinates] = useState<Position>(
    navigation.getState().routes[navigation.getState().index].params.coordinates,
  );

  const closeButtonPressed = () => {
    if (noteText.current !== staticText) {
      setShowAlertDiscardNote(true);
    } else {
      navigateToReportForm();
    }
  };

  const headerRight = () => (
    <Pressable disabled={textIsEmpty(textValue)} onPress={() => handleNoteCreation()} hitSlop={20}>
      <ReportFormSubmitButton disabled={textIsEmpty(textValue)} />
    </Pressable>
  );

  const headerLeft = () => customBackButton(<CloseIcon />, closeButtonPressed, true);

  useEffect(() => {
    navigation.setOptions({
      headerRight,
      headerLeft,
    });
  }, [textValue]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', keyboardWillHide);
    staticText = textValue;

    navigation.setOptions({
      title: !isEmpty(textValue) ? t('reports.editNote') : t('reports.addNote'),
    });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
      staticText = '';
    };
  }, []);

  // Handlers
  const navigateToReportForm = () => {
    navigation.navigate({
      name: 'ReportForm',
      params: { coordinates },
      merge: true,
    });
  };

  const keyboardWillShow = (event: any) => {
    setInputBottomMargin(event.endCoordinates.height);
  };

  const keyboardWillHide = () => {
    setInputBottomMargin(0);
  };

  const handleNoteCreation = useCallback(() => {
    eventEmitter.emit(emitterChannelId.current, { id: noteId.current, text: staticText });
    navigateToReportForm();
  }, []);

  const textIsEmpty = (text: string) => isEmpty(text.trim());

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <TextInput
        style={[styles.textArea, { marginBottom: inputBottomMargin }]}
        autoFocus
        multiline
        scrollEnabled
        onChangeText={(text) => {
          onChangeText(text);
          staticText = text;
        }}
        value={textValue}
      />

      {/* Discard Note Alert */}
      <CustomAlert
        displayAlert={showAlertDiscardNote}
        alertTitleText={isEmpty(noteText.current) ? t('notesView.discardNoteAlert.messageNewNote') : t('notesView.discardNoteAlert.messageExistingNote')}
        positiveButtonText={t('notesView.discardNoteAlert.positiveAction')}
        onPositiveButtonPress={() => {
          setShowAlertDiscardNote(false);
          navigation.pop();
        }}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_RED}
        positiveButtonIcon={<TrashIcon />}
        negativeButtonText={t('notesView.discardNoteAlert.negativeAction')}
        onNegativeButtonPress={() => {
          setShowAlertDiscardNote(false);
        }}
      />
      {/* End Discard Note Alert */}
    </SafeAreaView>
  );
};

export { ReportNoteView };
