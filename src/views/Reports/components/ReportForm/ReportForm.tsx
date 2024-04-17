/* eslint-disable prefer-destructuring */
// External Dependencies
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackHandler, Dimensions, Image, Pressable, ScrollView, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
  PhotoQuality,
} from 'react-native-image-picker';
import {
  RouteProp, useFocusEffect, useNavigation, useRoute,
} from '@react-navigation/native';
import RNFS, { moveFile } from 'react-native-fs';
import Geolocation from 'react-native-geolocation-service';
import { v4 as uuidv4 } from 'uuid';
import {
  isEmpty, isEqual, isFunction, last, omit, replace,
} from 'lodash-es';
import NetInfo from '@react-native-community/netinfo';
import Svg, { Polygon } from 'react-native-svg';
import { ActionSheet, Incubator } from 'react-native-ui-lib';
import dayjs from 'dayjs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GeoJSON } from 'geodesy';

// Internal Dependencies
import { ReportFormFooter } from './components/ReportFormFooter/ReportFormFooter';
import { ReportFormSubmitButton } from './components/ReportFormSubmitButton/ReportFormSubmitButton';
import {
  EventData,
  Position,
  ReportFormEventAttachments,
  RootStackParamList,
} from '../../../../common/types/types';
import { EditLocationDialog } from '../../../../common/components/EditLocationDialog/EditLocationDialog';
import log from '../../../../common/utils/logUtils';
import { Note } from '../../../../common/types/reportsResponse';
import { CustomAlert } from '../../../../common/components/CustomAlert/CustomAlert';
import { ReportJsonForm } from './components/JSONForm/ReportJsonForm';
import { MapView } from './components/ReportFormMapView/ReportFormMapView';
import { ATTACHMENTS_FOLDER, createThumbnail, QualityType } from '../../../../common/utils/imageUtils';
import { ImagesSection } from './components/ReportFormImagesSection/ReportFormImagesSection';
import { NotesSection } from './components/ReportFormNotesSection/ReportFormNotesSection';
import { usePopulateReportAttachments } from '../../../../common/data/reports/usePopulateReportAttachments';
import { OfflineSection } from './components/ReportFormOfflineSection/ReportFormOfflineSection';
import { createFolderIfNotExists, removeFiles } from '../../../../common/utils/fileHandling';
import { ReportFormSchemaError } from './components/ReportFormSchemaErrorMessage/ReportFormSchemaError';
import { usePopulateReportEvent } from '../../../../common/data/reports/usePopulateReportEvent';
import { RecordReportArea } from './components/ReportFormRecordReportArea/ReportFormRecordReportArea';
import { ReportFormPolygonInfo } from './components/ReportFormPolygonInfo/ReportFormPolygonInfo';
import { useUpdateReportEvent } from '../../../../common/data/reports/useUpdateReportEvent';
import {
  useRetrieveReportAttachmentsById,
  useRetrieveReportEventById,
} from '../../../../common/data/reports/useRetrieveReportEvent';
import { getSecuredStringForKey } from '../../../../common/data/storage/utils';
import {
  calculatePolygonArea,
  calculatePolygonPerimeter,
  calculatePolygonPointsList,
  createMapBoxPointMapURL,
  createMapBoxPolygonMapURL,
} from '../../../../common/utils/geometryUtils';
import { useUpdateReportAttachments } from '../../../../common/data/reports/useUpdateReportAttachments';
import { cropHeaderTitleText } from '../../../../common/utils/stringUtils';
import { getBoolForKey, getStringForKey } from '../../../../common/data/storage/keyValue';
import { useRetrieveActivePatrolSegmentId } from '../../../../common/data/patrols/useRetrieveActivePatrolSegmentId';
import { Loader } from '../../../../common/components/Loader/Loader';
import { getEventEmitter } from '../../../../common/utils/AppEventEmitter';
import { logEvent } from '../../../../analytics/wrapper/analyticsWrapper';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../../../analytics/model/analyticsEvent';
import {
  createRecordReportAreaEvent,
  createSaveReportDraftEvent,
  submitReportEvent,
} from '../../../../analytics/reports/reportsAnalytics';
import { customBackButton, osBackIcon } from '../../../../common/components/header/header';
import { nullIslandLocation } from '../../../../common/utils/locationUtils';

// constants
import {
  ACTIVE_PATROL_KEY,
  ALERT_BUTTON_BACKGROUND_COLOR_RED,
  IS_ANDROID,
  PHOTO_QUALITY_KEY,
  SAVE_TO_CAMERA_ROLL,
  USER_ID_KEY,
} from '../../../../common/constants/constants';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

// Icons
import { TrashIcon } from '../../../../common/icons/TrashIcon';
import { FolderIcon as FolderIconSVG } from '../../../../common/icons/FolderIcon';
import { EditIcon } from '../../../../common/icons/EditIcon';

// Styles
import styles from './ReportForm.styles';

interface ReportDataSnapshot {
  data: any,
  notes: Note[],
  photoCount: number,
  images: string[],
  thumbnails: string[],
}

// Constants
const IMAGE_LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 0, // Let user select multiple images
};
const ATTACHMENTS_THUMBNAILS_FOLDER = `${RNFS.DocumentDirectoryPath}/attachments/thumbnails`;
const MAX_MAPBOX_URL_LENGTH = 8192;

// Icons
const FolderIcon = () => <FolderIconSVG color={COLORS_LIGHT.white} width="20" height="20" viewbox="0 0 20 15" />;
const ActionSheetFolderIcon = () => <FolderIconSVG color={COLORS_LIGHT.G2_secondaryMediumGray} height="36" width="36" viewbox="0 0 28 14" />;
const ActionSheetTrashIcon = () => <TrashIcon color={COLORS_LIGHT.G2_secondaryMediumGray} height="36" width="36" viewbox="0 0 24 14" />;
const ActionSheetEditIcon = () => <EditIcon color={COLORS_LIGHT.G2_secondaryMediumGray} height="36" width="36" viewbox="0 0 25 14" />;

let showCloseFormCustomAlert = false;

const ReportForm = () => {
  // Constants
  const photoQualities: Record<QualityType, PhotoQuality> = {
    [QualityType.HIGH]: 1,
    [QualityType.MEDIUM]: 0.6,
    [QualityType.LOW]: 0.3,
  };

  const CAMERA_OPTIONS: CameraOptions = {
    mediaType: 'photo',
    includeExtra: true,
    quality: photoQualities[getStringForKey(PHOTO_QUALITY_KEY) as QualityType],
    saveToPhotos: getBoolForKey(SAVE_TO_CAMERA_ROLL) || false,
  };

  // Hooks
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ReportForm'>>();
  const currentNoteId = useRef(-1);
  const reportSnapshot = useRef({
    data: {}, notes: [], photoCount: 0, images: [], thumbnails: [],
  } as ReportDataSnapshot);
  const scrollViewRef = useRef<ScrollView>(null);
  const eventEmitter = useRef(getEventEmitter()).current;
  const notesChannelId = useRef(`notes_view_${uuidv4()}`).current;
  const { populateReportAttachments } = usePopulateReportAttachments();
  const { updateReportAttachments } = useUpdateReportAttachments();
  const { populateReportEvent } = usePopulateReportEvent();
  const { retrieveReportEventById } = useRetrieveReportEventById();
  const { retrieveReportAttachmentsById } = useRetrieveReportAttachmentsById();
  const { updateReportEvent } = useUpdateReportEvent();
  const { retrieveActivePatrolSegmentId } = useRetrieveActivePatrolSegmentId();

  const {
    reportId, title, schema, typeId, geometryType, isEditMode,
  } = route.params;

  // References
  const reportTypeId = useRef(typeId).current;
  const reportTitle = useRef(cropHeaderTitleText(title, 5)).current;
  // eslint-disable-next-line max-len
  const isDefaultPatrolTypeEnabled = useRef(route.params.isDefaultPatrolTypeEnabled || false).current;
  const patrolCreatedAt = useRef(route.params.createdAt || '').current;
  const initialCoordinates = useRef(route.params.coordinates);

  // Component's State
  const [jsonSchema, setJsonSchema] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [draftNewImages, setDraftNewImages] = useState<string[]>([]);
  const [draftNewthumbnails, setDraftNewThumbnails] = useState<string[]>([]);
  const [notesDataSource, setNotesDataSource] = useState<Note[]>([]);
  const [draftDeletedNotesDataSource, setDraftDeletedNotesDataSource] = useState<Note[]>([]);
  const [showAlertDeleteNote, setShowAlertDeleteNote] = useState(false);
  const [showAlertCloseForm, setShowAlertCloseForm] = useState(false);
  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [isDeviceOnline, setIsDeviceOnline] = useState(true);
  const [currentCoordinates, setCurrentCoordinates] = useState<Position>([0, 0]);
  const [enableLocationIcon, setEnableLocationIcon] = useState(false);
  const [showSchemaErrorMessage, setShowSchemaErrorMessage] = useState(false);
  const [reportCoordinates, setReportCoordinates] = useState<Position>([0, 0]);
  const [isFormEmpty, setIsFormEmpty] = useState(true);
  const [isSaveDraftEnabled, setIsSaveDraftEnabled] = useState(false);
  const [eventDraftId, setEventDraftId] = useState<number>(reportId || 0);
  const [hasFormRequiredFieldEmpty, setHasFormRequiredFieldEmpty] = useState(true);
  const [shouldDisplayRequiredFieldAlert, setShouldDisplayRequiredFieldAlert] = useState(false);
  const [formData, setFormData] = useState<any>();
  const [schemaErrors, setSchemaErrors] = useState<any>();
  const [schemaFilteredErrors, setSchemaFilteredErrors] = useState<any>();
  const [formEditData, setFormEditData] = useState<any>({});
  const [reportGeometry, setReportGeometry] = useState<GeoJSON.FeatureCollection>();
  const [reportGeometryType] = useState(geometryType);
  const [area, setArea] = useState(0);
  const [perimeter, setPerimeter] = useState(0);
  const [polygonPoints, setPolygonPoints] = useState('');
  const [viewBox, setViewBox] = useState('');
  const [mapboxStaticImageSource, setMapboxStaticImageSource] = useState('');
  const [displayToast, setDisplayToast] = useState(false);
  const [notesIdCounter, setNotesIdCounter] = useState(0);
  const [coordinatesOfScreenElements] = useState<number[]>([]);
  const [draftViewFinishedLoading, setDraftViewFinishedLoading] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  let mapURL = createMapBoxPointMapURL(reportCoordinates);

  // Component's Lifecycle Events
  useEffect(() => {
    const initFolder = async (path: string) => {
      try {
        await createFolderIfNotExists(path);
      } catch (error) {
        log.error(`[ReportForm] - Could not init ${path} folder`);
      }
    };

    const loadReportDraftData = async () => {
      if (reportId && isEditMode) {
        const accountId = getSecuredStringForKey(USER_ID_KEY) || '';
        await loadReportFormData(accountId);
        await loadReportAttachments(accountId);
      } else {
        setJsonSchema(schema);
      }
      setDraftViewFinishedLoading(true);
    };

    initAppBar();
    getCurrentCoordinates();
    verifyInternetConnection();
    loadReportDraftData();
    initFolder(ATTACHMENTS_FOLDER);
    initFolder(ATTACHMENTS_THUMBNAILS_FOLDER);
  }, []);

  useEffect(() => {
    const eventListener = eventEmitter.addListener(notesChannelId, (note: Note) => {
      const noteUpdate = notesDataSource.find((item) => (item.id === note.id));
      if (noteUpdate) {
        const index = notesDataSource.indexOf(noteUpdate);
        updateNote(note.id, note.text, index);
      } else {
        createNote(note.id, note.text);
        setNotesIdCounter(note.id);
      }
    });

    return () => {
      eventListener.removeListener(notesChannelId);
    };
  }, [notesDataSource]);

  useEffect(() => {
    showCloseFormCustomAlert = hasReportChanges();
    setIsSaveDraftEnabled(showCloseFormCustomAlert);
  }, [notesDataSource, images, isFormEmpty, formData, polygonPoints, reportCoordinates]);

  useEffect(() => {
    const backAction = () => {
      closeFormView();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showCloseFormCustomAlert, isSaveDraftEnabled, showSchemaErrorMessage, isFormEmpty]);

  useEffect(() => {
    const requiredFieldError = schemaErrors
      && schemaErrors.length > 0
      && schemaErrors.find((item: any) => (item.keyword === 'required')) !== undefined;
    setHasFormRequiredFieldEmpty(requiredFieldError);
    setSchemaFilteredErrors(requiredFieldError
      ? schemaErrors.filter((item: any) => (item.keyword !== 'required')) || []
      : schemaErrors);
  }, [schemaErrors]);

  useEffect(() => {
    initAppBar();
  }, [
    images,
    thumbnails,
    notesDataSource,
    showSchemaErrorMessage,
    isFormEmpty,
    hasFormRequiredFieldEmpty,
    formEditData,
    formData,
    reportGeometry,
    area,
    eventDraftId,
    reportSnapshot,
    schemaFilteredErrors,
    reportCoordinates,
    isSaveDraftEnabled,
  ]);

  useEffect(() => {
    if (isEqual(reportCoordinates, currentCoordinates)) {
      setEnableLocationIcon(false);
    } else {
      setEnableLocationIcon(true);
    }
  }, [reportCoordinates]);

  useFocusEffect(useCallback(() => {
    verifyInternetConnection();
    if (geometryType === 'Polygon') {
      const geojson = route.params.geoJson;
      const areaParam: number = route.params.areaMeters || 0;
      const perimeterParam: number = route.params.perimeterMeters || 0;
      const polygonPointsParam: string = route.params.polygonPoints || '';
      const viewBoxParam: string = route.params.viewBox || '';

      if (geojson) {
        setIsSaveDraftEnabled(true);
        setReportGeometry(geojson);
      }

      if (areaParam) {
        setArea(areaParam);
      }
      if (perimeterParam) {
        setPerimeter(perimeterParam);
      }
      if (polygonPointsParam) {
        setPolygonPoints(polygonPointsParam);
      }
      if (viewBoxParam) {
        setViewBox(viewBoxParam);
      }

      // Prepare data for static image map
      if (geojson) {
        setMapboxStaticImageSource(createMapBoxPolygonMapURL(geojson));
      }
    } else {
      const updatedCoordinates: Position = route.params.coordinates || nullIslandLocation;

      if (!isEqual(updatedCoordinates, [0, 0])) {
        setReportCoordinates([
          parseFloat(updatedCoordinates[0].toFixed(6)),
          parseFloat(updatedCoordinates[1].toFixed(6)),
        ]);
        setIsSaveDraftEnabled(true);
      }

      mapURL = createMapBoxPointMapURL(reportCoordinates);
    }
  }, [route]));

  useEffect(() => {
    if (isEditMode) {
      if (draftViewFinishedLoading) {
        scrollViewRef.current?.scrollTo({ y: coordinatesOfScreenElements[0] });
      }
    } else {
      scrollViewRef.current?.scrollTo({ y: coordinatesOfScreenElements[0] });
    }
  }, [notesDataSource]);

  useEffect(() => {
    if (isEditMode) {
      if (draftViewFinishedLoading) {
        scrollViewRef.current?.scrollTo({ y: coordinatesOfScreenElements[1] });
      }
    } else {
      scrollViewRef.current?.scrollTo({ y: coordinatesOfScreenElements[1] });
    }
  }, [thumbnails]);

  // Report Handlers
  const onReportSubmitPressHandler = async () => {
    try {
      if (hasFormRequiredFieldEmpty) {
        setShouldDisplayRequiredFieldAlert(hasFormRequiredFieldEmpty);
      } else {
        let eventId;
        const eventData = {
          eventTypeId: reportTypeId,
          title,
          latitude: 0,
          longitude: 0,
          geometry: '',
          event_values: '',
          isDraft: 0,
          createdAt: getCreatedAt(),
          updatedAt: '',
          patrol_segment_id: undefined,
        } as EventData;

        // form data is not a plain JS object, need to clean it up.
        // @ts-ignore
        eventData.event_values = JSON.stringify(omit(formData, isFunction));

        if (getBoolForKey(ACTIVE_PATROL_KEY)) {
          eventData.patrol_segment_id = await retrieveActivePatrolSegmentId();
        }

        if (reportGeometryType === 'Polygon') {
          eventData.geometry = JSON.stringify(reportGeometry);
          if (eventDraftId) {
            await updateReportData(eventData);
          } else {
            eventId = await populateReportEvent(eventData);
          }
        } else {
          eventData.latitude = reportCoordinates[1];
          eventData.longitude = reportCoordinates[0];
          // eslint-disable-next-line no-lonely-if
          if (eventDraftId) {
            await updateReportData(eventData);
          } else {
            eventId = await populateReportEvent(eventData);
          }
        }

        if (eventId) {
          // Save the image and thumbnail attachments
          await populateReportAttachments({
            type: 'photo',
            attachments: {
              images,
              thumbnails,
            },
            eventId,
          });
          // Save the note attachments
          await populateReportAttachments({
            type: 'note',
            attachments: notesDataSource,
            eventId,
          });
        }
        navigation.popToTop();
      }
    } catch {
      log.error('[ReportForm] - Error populating report attachments');
    }
  };

  const onReportDiscardPressHandler = async () => {
    if (images.length > 0 || thumbnails.length > 0) {
      try {
        await removeFiles(images);
        await removeFiles(thumbnails);
      } catch (error) {
        log.error(`[ReportForm] - Error discarding report - ${error}`);
      }
    }
  };

  // Utility Functions
  const initAppBar = () => {
    navigation.setOptions({
      title: reportTitle,
      headerRight,
      headerLeft: () => (isDefaultPatrolTypeEnabled ? emptyBackButton : customBackButton(
        osBackIcon,
        closeFormView,
        false,
      )),
      gestureEnabled: false,
    });
  };

  const emptyBackButton = () => (<View />);

  // Additional components
  const headerRight = () => (
    <Pressable
      onPress={() => {
        onReportSubmitPressHandler();
        trackAnalyticsEvent(submitReportEvent());
      }}
      disabled={!isValidForm() || !hasAttachmentsOrData()}
      hitSlop={20}
    >
      <ReportFormSubmitButton
        disabled={!isValidForm() || !hasAttachmentsOrData()}
        isExtended
      />
    </Pressable>
  );

  const verifyInternetConnection = () => {
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable !== null) {
        setIsDeviceOnline(state.isInternetReachable);
      }
    });
  };

  const getCurrentCoordinates = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoordinates(
          [parseFloat(position.coords.longitude.toFixed(6)),
            parseFloat(position.coords.latitude.toFixed(6))],
        );
        if (isEqual(route.params.coordinates, [0, 0]) && !isEditMode) {
          setReportCoordinates(
            [parseFloat(position.coords.longitude.toFixed(6)),
              parseFloat(position.coords.latitude.toFixed(6))],
          );
        }
      },
      (error) => {
        log.error(`[ReportForm] - Get current position - ${error}`);
      },
      { enableHighAccuracy: true },
    );
  };

  const loadReportFormData = async (accountId: string) => {
    const reportDraft = await retrieveReportEventById(reportId || 0, accountId);

    if (reportDraft) {
      try {
        const jsonData = JSON.parse(reportDraft.event_values);
        reportSnapshot.current.data = jsonData;
        setFormEditData(jsonData);
      } catch (error) {
        log.error(`[ReportForm] - Load report data - ${error}`);
      } finally {
        setJsonSchema(schema);
      }

      if (geometryType === 'Polygon') {
        loadReportGeometry(reportDraft.geometry);
      } else {
        initialCoordinates.current = [reportDraft.longitude, reportDraft.latitude];
        setReportCoordinates([reportDraft.longitude, reportDraft.latitude]);
      }
    }
  };

  const loadReportGeometry = (stringGeometry: string) => {
    try {
      const geometry = JSON.parse(stringGeometry);
      const areaMeasured = calculatePolygonArea([geometry.features[0].geometry.coordinates[0]]);
      setReportGeometry(geometry);
      if (geometry.features[0].geometry.type === 'Polygon') {
        setArea(areaMeasured > 0 ? Math.floor(areaMeasured * 100) / 100 : areaMeasured);
        setPerimeter(calculatePolygonPerimeter(geometry.features[0].geometry.coordinates));
        const {
          polygonPointsList,
          maxX,
          maxY,
        } = calculatePolygonPointsList(geometry.features[0].geometry.coordinates[0]);
        setPolygonPoints(polygonPointsList.join(' '));
        setViewBox(`0 0 ${maxX} ${maxY}`);
        setMapboxStaticImageSource(createMapBoxPolygonMapURL(geometry));
      }
    } catch (error) {
      log.error(`[ReportForm] - Load report geometry - ${error}`);
    }
  };

  const loadReportAttachments = async (accountId: string) => {
    const reportDraftAttachments = await retrieveReportAttachmentsById(reportId || 0, accountId);
    const draftImages = Array<string>();
    const draftThumbnails = Array<string>();
    const notes = Array<Note>();

    reportDraftAttachments.forEach((attachment: ReportFormEventAttachments) => {
      if (attachment.type === 'photo') {
        draftThumbnails.push(attachment.path);
        draftImages.push(attachment.thumbnail_path);
      } else {
        notes.push({
          id: attachment.id,
          text: attachment.note_text,
        } as Note);
      }
    });

    const lastNote = last(notes);
    if (lastNote) {
      setNotesIdCounter(lastNote.id);
    }

    reportSnapshot.current.notes = notes;
    reportSnapshot.current.photoCount = draftImages.length;
    reportSnapshot.current.images = draftImages;
    reportSnapshot.current.thumbnails = draftThumbnails;
    setImages(draftImages);
    setThumbnails(draftThumbnails);
    setNotesDataSource(notes);
  };

  const getReportAreaValues = (areaInMeters: number, perimeterInMeters: number) => {
    let areaValue = '';
    let perimeterValue = '';

    if (areaInMeters > 1000) {
      areaValue = `${(areaInMeters / 1000).toFixed(2)} sqkm ${t('reports.area')}`;
    } else {
      areaValue = `${areaInMeters} sqm ${t('reports.area')}`;
    }

    if (perimeterInMeters > 1000) {
      perimeterValue = `${(perimeterInMeters / 1000).toFixed(2)} km ${t('reports.perimeter')}`;
    } else {
      perimeterValue = `${perimeterInMeters} m ${t('reports.perimeter')}`;
    }

    return `${areaValue}, ${perimeterValue}`;
  };

  // Handler Functions
  const onMapPress = () => {
    navigation.navigate('ReportEditLocationView', { coordinates: reportCoordinates });
  };

  const onCoordinatePress = () => {
    setDisplayEditDialog(true);
  };

  const onCancelDialogPress = () => {
    setDisplayEditDialog(false);
  };

  const onSaveDialogPress = (updatedReportCoordinates: Position) => {
    setDisplayEditDialog(false);
    setReportCoordinates([
      parseFloat(updatedReportCoordinates[0].toFixed(6)),
      parseFloat(updatedReportCoordinates[1].toFixed(6)),
    ]);
    setIsSaveDraftEnabled(true);
  };

  const onNotePress = () => {
    navigation.navigate('ReportNoteView', {
      text: '',
      id: notesIdCounter + 1,
      coordinates: reportCoordinates,
      channelId: notesChannelId,
    });
  };

  const onNoteEdit = (item: Note) => {
    navigation.navigate('ReportNoteView', {
      text: item.text,
      id: item.id,
      coordinates: reportCoordinates,
      channelId: notesChannelId,
    });
  };

  const onNoteDelete = (id: number) => {
    setShowAlertDeleteNote(true);
    currentNoteId.current = id;
  };

  const createNote = (id: number, text: string) => {
    setNotesDataSource((array) => [...array, {
      id,
      text,
    } as Note]);
    setIsSaveDraftEnabled(true);
  };

  const updateNote = (id: number, text: string, index: number) => {
    const notes = [...notesDataSource];
    notes[index] = {
      id,
      text,
    } as Note;
    setNotesDataSource(notes);
    setIsSaveDraftEnabled(true);
  };

  const removeNote = (id: number) => {
    if (isEditMode) {
      setDraftDeletedNotesDataSource((array) => [...array, {
        id,
      } as Note]);
    }
    setNotesDataSource((notes) => notes.filter((note) => note.id !== id));
    setIsSaveDraftEnabled(true);
  };

  const getPhotoName = () => {
    const now = dayjs().format('YYYY-MM-DD_HH-mm-ss');

    return `${now}_${replace(reportTitle.toLowerCase(), /[\s|/]/gi, '_')}`;
  };

  const onImagePress = async () => {
    try {
      const response = await launchImageLibrary(IMAGE_LIBRARY_OPTIONS);
      const addedImages = [];
      const addedThumbnails = [];

      if (response?.assets) {
        setIsLoaderVisible(true);
        for (let i = 0, l = response.assets.length; i < l; i++) {
          const image = response.assets[i];
          if (image.uri) {
            let photoName = getPhotoName();
            if (response.assets.length > 1) {
              photoName += `-${String(i + 1).padStart(2, '0')}`;
            }
            const imageURI = `${ATTACHMENTS_FOLDER}/${photoName}.jpg`;
            const thumbnailURI = `${ATTACHMENTS_THUMBNAILS_FOLDER}/${photoName}.jpg`;

            // Persist new image to document directory
            // eslint-disable-next-line no-await-in-loop
            await moveFile(image.uri, imageURI);

            addedImages.push(imageURI);
            if (isEditMode) {
              draftNewImages.push(imageURI);
            }
            // eslint-disable-next-line no-await-in-loop
            const thumbnailResponse = await createThumbnail(imageURI);
            if (thumbnailResponse.uri) {
              // Persist new thumbnail to document directory
              // eslint-disable-next-line no-await-in-loop
              await moveFile(thumbnailResponse.uri, thumbnailURI);
              addedThumbnails.push(thumbnailURI);
              if (isEditMode) {
                draftNewthumbnails.push(thumbnailURI);
              }
            }
          }
        }
      }

      const updatedImages = [...images, ...addedImages];
      setImages(updatedImages);
      const updatedThumbnails = [...thumbnails, ...addedThumbnails];
      setThumbnails(updatedThumbnails);
      setIsSaveDraftEnabled(true);
      setIsLoaderVisible(false);
    } catch (error) {
      log.error(`[Report Form] - onImagePress - ${error}`);
    }
  };

  const onCameraPress = async () => {
    try {
      let newImageURI = '';

      const response = await launchCamera(CAMERA_OPTIONS);
      const photoName = getPhotoName();

      if (response?.assets && response.assets.length === 1) {
        setIsLoaderVisible(true);
        newImageURI = response.assets[0].uri || '';

        const imageURI = `${ATTACHMENTS_FOLDER}/${photoName}.jpg`;
        const thumbnailURI = `${ATTACHMENTS_THUMBNAILS_FOLDER}/${photoName}.jpg`;

        // Persist new image to document directory
        await moveFile(newImageURI, imageURI);

        // Generate thumbnail
        const thumbnailResponse = await createThumbnail(imageURI);

        if (thumbnailResponse.uri) {
          // Persist new thumbnail to document directory
          await moveFile(thumbnailResponse.uri, thumbnailURI);
        }

        // Add new image to the state
        const updatedImages = [...images, imageURI];
        setImages(updatedImages);
        const updatedThumbnails = [...thumbnails, thumbnailURI];
        setThumbnails(updatedThumbnails);
        if (isEditMode) {
          const draftUpdatedImages = [...draftNewImages, imageURI];
          const draftsUpdatedThumbnails = [...draftNewthumbnails, thumbnailURI];
          setDraftNewImages(draftUpdatedImages);
          setDraftNewThumbnails(draftsUpdatedThumbnails);
        }
        setIsSaveDraftEnabled(true);
        setIsLoaderVisible(false);
      }
    } catch (error) {
      log.error(`[Report Form] - onCameraPress - ${error}`);
    }
  };

  const onSaveDraft = async () => {
    const reportEvent = {
      eventTypeId: reportTypeId,
      title,
      latitude: 0,
      longitude: 0,
      geometry: '',
      // @ts-ignore
      event_values: JSON.stringify(omit(formData, isFunction)),
      isDraft: 1,
      createdAt: getCreatedAt(),
      updatedAt: '',
      patrol_segment_id: undefined,
    } as EventData;

    if (getBoolForKey(ACTIVE_PATROL_KEY)) {
      reportEvent.patrol_segment_id = await retrieveActivePatrolSegmentId();
    }

    if (geometryType === 'Polygon') {
      reportEvent.geometry = JSON.stringify(reportGeometry);
    } else {
      [reportEvent.longitude, reportEvent.latitude] = reportCoordinates;
    }

    try {
      if (eventDraftId) {
        await updateReportData(reportEvent);
      } else {
        const eventId = await populateReportEvent(reportEvent);

        if (eventId > 0) {
          setEventDraftId(eventId);

          await populateReportAttachments({
            type: 'photo',
            attachments: {
              images,
              thumbnails,
            },
            eventId,
          });
          // Save the note attachments
          await populateReportAttachments({
            type: 'note',
            attachments: notesDataSource,
            eventId,
          });
        }

        showCloseFormCustomAlert = false;
      }

      setIsSaveDraftEnabled(false);
      setDisplayToast(true);
    } catch (error) {
      log.debug(`[ReportForm] :: Could not save draft report - ${error}`);
    }
    saveReportSnapshot();
  };

  const getCreatedAt = () => (isDefaultPatrolTypeEnabled ? patrolCreatedAt : '');

  const updateReportData = async (reportEvent: EventData) => {
    const updatedNotes = reportSnapshot.current.notes.filter(
      (a) => notesDataSource.some((b) => a.id === b.id && a.text !== b.text),
    );
    const newNotes = notesDataSource.filter(
      (a) => !reportSnapshot.current.notes.some((b) => a.id === b.id),
    );
    await updateReportEvent(reportEvent, eventDraftId.toString());

    if (reportSnapshot.current.photoCount < images.length) {
      const newImages = images.filter(
        (a) => !reportSnapshot.current.images.some((b) => a === b),
      );
      const newThumbnails = thumbnails.filter(
        (a) => !reportSnapshot.current.thumbnails.some((b) => a === b),
      );
      await updateReportAttachments({
        type: 'photo',
        attachments: {
          images: newImages,
          thumbnails: newThumbnails,
        },
        eventId: eventDraftId,
      });
    }

    if (updatedNotes.length > 0) {
      await updateReportAttachments({
        type: 'updateNote',
        attachments: notesDataSource,
        eventId: eventDraftId,
      });
    }

    if (newNotes.length > 0) {
      await updateReportAttachments({
        type: 'addNewNote',
        attachments: newNotes,
        eventId: eventDraftId,
      });
    }

    if (draftDeletedNotesDataSource.length > 0) {
      await updateReportAttachments({
        type: 'deleteNote',
        attachments: draftDeletedNotesDataSource,
        eventId: eventDraftId,
      });
      setDraftDeletedNotesDataSource([]);
    }

    showCloseFormCustomAlert = false;
  };

  // Utility Functions

  const trackAnalyticsEvent = (event: AnalyticsEvent) => {
    logEvent(event.eventName, analyticsEventToHashMap(event));
  };

  const onRecordAreaPress = () => {
    trackAnalyticsEvent(createRecordReportAreaEvent());
    navigation.navigate('RecordReportAreaView');
  };

  const hasAttachmentsOrData = () => notesDataSource.length > 0
    || images.length > 0 || !isFormEmpty || (reportGeometryType === 'Polygon' && area)
    || (reportGeometryType === 'Point' && !isEqual(reportCoordinates, [0, 0]));

  const isValidForm = () => !showSchemaErrorMessage
    && (!schemaFilteredErrors || schemaFilteredErrors.length === 0);

  const hasReportChanges = () => {
    if (reportGeometry?.features[0].geometry.coordinates[0]) {
      const { polygonPointsList } = calculatePolygonPointsList(
        reportGeometry?.features[0].geometry.coordinates[0],
      );

      return (!isEqual(reportSnapshot.current.data, formData) && !isFormEmpty)
      || !isEqual(reportSnapshot.current.notes, notesDataSource)
      || !isEqual(polygonPointsList.join(' '), polygonPoints)
      || reportSnapshot.current.photoCount !== images.length;
    }

    return (!isEqual(reportSnapshot.current.data, formData) && !isFormEmpty)
      || !isEqual(reportSnapshot.current.notes, notesDataSource)
      || reportSnapshot.current.photoCount !== images.length
      || (reportGeometryType === 'Point' && !isEqual(reportCoordinates, initialCoordinates.current));
  };

  const saveReportSnapshot = () => {
    reportSnapshot.current = {
      data: formData || {},
      notes: notesDataSource || [],
      photoCount: images.length,
    } as ReportDataSnapshot;
  };

  const closeFormView = () => {
    if (showSchemaErrorMessage || isFormEmpty) {
      navigation.pop();
    } else if (showCloseFormCustomAlert) {
      setShowAlertCloseForm(true);
    } else if (!isSaveDraftEnabled) {
      navigation.popToTop();
    }
  };

  const onOfflineFieldPress = () => {
    if (!isDeviceOnline) {
      setDisplayEditDialog(true);
    } else {
      navigation.navigate('ReportEditLocationView', { coordinates: reportCoordinates });
    }
  };

  const onOfflineIconPress = () => {
    setReportCoordinates([
      parseFloat(currentCoordinates[0].toFixed(6)),
      parseFloat(currentCoordinates[1].toFixed(6)),
    ]);
  };

  return (
    <SafeAreaView style={styles.reportFormMainContainer} edges={['bottom']}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
      >
        {/* Schema Error Message */}
        {showSchemaErrorMessage ? (
          <ReportFormSchemaError />
        ) : (
          <View>
            {/* Record Report Area / Map View / Offline Report Location Field */}
            {reportGeometryType === 'Polygon' ? (
              <View>
                {(area && perimeter) ? (
                  <View>
                    {/* eslint-disable-next-line max-len */}
                    {(!isDeviceOnline || mapboxStaticImageSource.length >= MAX_MAPBOX_URL_LENGTH) ? (
                      <View style={styles.polygonContainer}>
                        <Svg width="100" height="100" viewBox={viewBox}>
                          <Polygon
                            points={polygonPoints}
                            fill="#FF9500"
                            fillOpacity="0.3"
                          />
                        </Svg>
                      </View>
                    ) : (
                      <Image
                        style={styles.mapImage}
                        source={{ uri: mapboxStaticImageSource }}
                        key={mapboxStaticImageSource}
                      />
                    )}

                    <ReportFormPolygonInfo
                      data={`${getReportAreaValues(area, perimeter)}`}
                    />
                  </View>
                ) : (
                  <RecordReportArea
                    onRecordAreaPress={onRecordAreaPress}
                    areaValue={area}
                  />
                )}
              </View>
            ) : (
              <View>
                {isDeviceOnline ? (
                  <MapView
                    mapURL={mapURL}
                    reportCoordinates={reportCoordinates}
                    onMapPress={onMapPress}
                    onCoordinatesPress={onCoordinatePress}
                  />
                ) : (
                  <OfflineSection
                    reportCoordinates={reportCoordinates}
                    enableLocationIcon={enableLocationIcon}
                    onFieldPress={onOfflineFieldPress}
                    onIconPress={onOfflineIconPress}
                  />
                )}
              </View>
            )}
            {/* End Map View */}

            {/* JSON Form */}
            {isEmpty(jsonSchema) ? null : (
              <ReportJsonForm
                draftData={formEditData}
                schema={jsonSchema}
                setIsFormEmpty={setIsFormEmpty}
                setShowSchemaErrorMessage={setShowSchemaErrorMessage}
                setReportFormData={setFormData}
                setSchemaErrors={setSchemaErrors}
              />
            )}
            {/* End JSON Form */}

            {/* Edit Location Dialog */}
            {displayEditDialog && (
              <EditLocationDialog
                coordinates={reportCoordinates}
                displayEditDialog={displayEditDialog}
                onCancelDialogPress={onCancelDialogPress}
                onSaveDialogPress={onSaveDialogPress}
              />
            )}
            {/* End Edit Location Dialog */}

            {/* Notes section */}
            <NotesSection
              notes={notesDataSource}
              onNoteEdit={onNoteEdit}
              onNoteDelete={onNoteDelete}
              onNotePress={onNotePress}
            />
            <View
              onLayout={(event) => {
                const screenDimensions = Dimensions.get('screen');
                const layout = event.nativeEvent.layout;
                coordinatesOfScreenElements[0] = layout.y - (screenDimensions.height / 2);
              }}
            />
            {/* End notes section */}

            {/* Images section */}
            <ImagesSection thumbnails={thumbnails} onCameraPress={onCameraPress} />
            <View
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                coordinatesOfScreenElements[1] = layout.y;
              }}
            />
            {/* End Images section */}
          </View>
        )}
        {/* End Schema Error Message */}
      </ScrollView>

      {/* Bottom Bar */}
      <ReportFormFooter
        onNotePress={onNotePress}
        onImagePress={onImagePress}
        onCameraPress={onCameraPress}
        onSaveDraftPress={onSaveDraft}
        disabledIcons={showSchemaErrorMessage}
        isSaveDraftEnabled={isSaveDraftEnabled}
      />
      {/* End Bottom Bar */}

      {/* Delete Note Alert */}
      <CustomAlert
        displayAlert={showAlertDeleteNote}
        alertTitleText={t('reports.deleteNoteAlert.message')}
        positiveButtonText={t('reports.deleteNoteAlert.positiveAction')}
        onPositiveButtonPress={() => {
          setShowAlertDeleteNote(false);
          removeNote(currentNoteId.current);
        }}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_RED}
        positiveButtonIcon={<TrashIcon />}
        negativeButtonText={t('reports.deleteNoteAlert.negativeAction')}
        onNegativeButtonPress={() => {
          setShowAlertDeleteNote(false);
        }}
      />
      {/* End Delete Note Alert */}

      {/* Discard Form ActionSheet */}
      <ActionSheet
        visible={showAlertCloseForm}
        title={t('reports.closeFormAlert.message')}
        options={[
          {
            label: t('reports.closeFormAlert.saveDraft'),
            onPress: async () => {
              await onSaveDraft();
              trackAnalyticsEvent(createSaveReportDraftEvent());
              navigation.popToTop();
              showCloseFormCustomAlert = false;
            },
            iconSource: () => ActionSheetFolderIcon,
          },
          {
            label: t('reports.closeFormAlert.discard'),
            onPress: async () => {
              await onReportDiscardPressHandler();
              navigation.popToTop();
              showCloseFormCustomAlert = false;
            },
            iconSource: () => ActionSheetTrashIcon,
          },
          {
            label: t('reports.closeFormAlert.continueEditing'),
            onPress: () => setShowAlertCloseForm(false),
            iconSource: () => ActionSheetEditIcon,
          },
        ]}
        cancelButtonIndex={3}
        destructiveButtonIndex={1}
        onDismiss={() => { setShowAlertCloseForm(false); }}
      />
      {/* End Discard Form ActionSheet */}

      {/* Required Fields Warning Alert */}
      <CustomAlert
        displayAlert={shouldDisplayRequiredFieldAlert}
        alertTitleText={t('reports.requiredFieldsAlert.title')}
        alertMessageText={t('reports.requiredFieldsAlert.subtitle')}
        positiveButtonText={t('reports.requiredFieldsAlert.positiveAction')}
        positiveButtonBackgroundColor={COLORS_LIGHT.brightBlue}
        onPositiveButtonPress={async () => {
          await onSaveDraft();
          setShouldDisplayRequiredFieldAlert(false);
          navigation.popToTop();
        }}
        positiveButtonIcon={<FolderIconSVG color={COLORS_LIGHT.white} height="16" width="16" viewbox="0 0 16 16" />}
        negativeButtonText={t('reports.requiredFieldsAlert.negativeAction')}
        negativeButtonIcon={<EditIcon color={COLORS_LIGHT.G3_secondaryMediumLightGray} />}
        onNegativeButtonPress={() => setShouldDisplayRequiredFieldAlert(false)}
      />
      {/* End Required Fields Warning Alert */}

      {/* Loader */}
      <Loader isVisible={IS_ANDROID && isLoaderVisible} />
      {/* End Loader */}

      {/* Report Saved as Draft Confirmation Toast */}
      <Incubator.Toast
        autoDismiss={2000}
        backgroundColor={COLORS_LIGHT.G0_black}
        icon={FolderIcon}
        message={t('reportDrafts.toastSavedConfirmationText')}
        messageStyle={{ color: COLORS_LIGHT.white }}
        onDismiss={() => setDisplayToast(false)}
        position="bottom"
        style={{ borderRadius: 0 }}
        visible={displayToast}
      />
      {/* End Report Saved as Draft Confirmation Toast */}
    </SafeAreaView>
  );
};

export { ReportForm };
