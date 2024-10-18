// External Dependencies
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Pressable, StyleProp } from 'react-native';
import Mapbox, { CircleLayerStyle, FillLayerStyle, LineLayerStyle } from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import bbox from '@turf/bbox';
import { clone } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { Colors } from 'react-native-ui-lib';

// Internal Dependencies
import { ReportFormSubmitButton } from '../ReportForm/components/ReportFormSubmitButton/ReportFormSubmitButton';

import { PolygonState, Position } from '../../../../common/types/types';
import log from '../../../../common/utils/logUtils';
import { polygonReducer } from '../../../../common/reducers/polygonReducer';
import {
  calculatePolygonArea,
  calculatePolygonPerimeter,
  calculatePolygonPointsList,
} from '../../../../common/utils/geometryUtils';
import { CustomAlert } from '../../../../common/components/CustomAlert/CustomAlert';
import { TrashIcon } from '../../../../common/icons/TrashIcon';
import { getBoolForKey, getStringForKey, setBoolForKey } from '../../../../common/data/storage/keyValue';
import { AREA_INSTRUCTIONS_VIEWED, BASEMAP_KEY } from '../../../../common/constants/constants';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../../../analytics/model/analyticsEvent';
import { logEvent } from '../../../../analytics/wrapper/analyticsWrapper';
import {
  createRecordReportAreaStartEvent,
  createRecordReportAreaSubmitEvent,
} from '../../../../analytics/reports/reportsAnalytics';

import { StartRecordingButton } from './components/StartRecordingButton/StartRecordingButton';
import { PolygonManagementButtons } from './components/PolygonManagementButtons/PolygonManagementButtons';
import { CurrentLocation } from './components/CurrentLocation/CurrentLocation';
import { AreaStatisticsBar } from './components/AreaStatisticsBar/AreaStatisticsBar';
import { BottomToolbar } from './components/BottomToolbar/BottomToolbar';
import { AreaInstructionsDialog } from './components/AreaInstructionsDialog/AreaInstructionsDialog';

// Styles
import styles from './RecordReportAreaView.styles';

// Constants
const ZOOM_LEVEL = 18;
const ANIMATION_MODE = 'flyTo';
const ANIMATION_DURATION = 2000;
const MIN_POINTS_FOR_POLYGON = 3;
const MAP_ZOOM_PADDING = 16;
const VIEW = 'RecordReportAreaView';
const INITIAL_STATE: PolygonState = {
  past: [],
  current: [],
};

const RecordReportAreaView = () => {
  // Hooks
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Component's State
  const [centerCoordinates, setCenterCoordinates] = useState<Position>([0, 0]);
  const [currentCoordinates, setCurrentCoordinates] = useState<Position>([0, 0]);
  const [polygonState, setPolygonState] = useState<PolygonState>(INITIAL_STATE);

  const [isRecording, setIsRecording] = useState(false);
  const [followUserLocation, setFollowUserLocation] = useState(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [isCloseAreaButtonEnabled, setIsCloseAreaButtonEnabled] = useState(false);
  const [isBottomBarAvailable, setIsBottomBarAvailable] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);
  const [isRedoDisabled, setIsRedoDisabled] = useState(true);
  const [isUndoDisabled, setIsUndoDisabled] = useState(true);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [isAreaInstructionsVisible, setIsAreaInstructionsVisible] = useState(
    !getBoolForKey(AREA_INSTRUCTIONS_VIEWED),
  );
  const [basemapSelected] = useState(
    getStringForKey(BASEMAP_KEY) || Mapbox.StyleURL.Outdoors,
  );

  const [areaMeters, setAreaMeters] = useState(0);
  const [perimeterMeters, setPerimeterMeters] = useState(0);
  const [randomKey, setRandomKey] = useState(0);
  const [shapeSourceKey, setShapeSourceKey] = useState(1);
  const coordinatesCounter = useRef(0);

  const [followUserMode, setFollowUserMode] = useState(
    Mapbox.UserTrackingMode.Follow,
  );
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

  const [fitBounds, setFitBounds] = useState<Position[]>();
  const [polygonPoints, setPolygonPoints] = useState('');
  const [viewBox, setViewBox] = useState('');

  const circleLayerStyles: StyleProp<CircleLayerStyle> = {
    circleRadius: 8,
    circleColor: '#F2A900',
  };
  const lineLayerStyles: StyleProp<LineLayerStyle> = {
    lineColor: '#F2A900',
    lineWidth: 2,
    lineCap: 'round',
  };
  const fillLayerStyles: StyleProp<FillLayerStyle> = {
    fillColor: '#F2A900',
    fillOpacity: 0.2,
  };

  // Handlers
  const onSubmitButtonPress = () => {
    trackAnalyticsEvent(createRecordReportAreaSubmitEvent());
    navigation.navigate({
      name: 'ReportForm',
      params: {
        geoJson,
        areaMeters,
        perimeterMeters,
        polygonPoints,
        viewBox,
      },
      merge: true,
    });
  };

  const onLocationUpdate = (coordinates: Position) => {
    setCurrentCoordinates([coordinates[1], coordinates[0]]);
  };

  const onStartRecording = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const currentCoordinates = await setCurrentLocation();
      setIsRecording(true);
      setFollowUserLocation(true);
      setFollowUserMode(Mapbox.UserTrackingMode.FollowWithCourse);
      setRandomKey(Math.random());
      setIsBottomBarAvailable(true);
      const newPolygonState = polygonReducer({
        current: [],
        past: [],
      });
      setPolygonState(polygonReducer(newPolygonState, { type: 'ADD', value: currentCoordinates }));
      coordinatesCounter.current = 1;
      trackAnalyticsEvent(createRecordReportAreaStartEvent());
    } catch (error) {
      log.error(error);
    }
  }, [centerCoordinates]);

  const onAddPoint = useCallback(() => {
    if (polygonState.current) {
      Geolocation.getCurrentPosition(
        (position) => {
          // Add new coordinates to the polygon
          const newPolygonState = polygonReducer(
            clone(polygonState),
            { type: 'ADD', value: [position.coords.longitude, position.coords.latitude] },
          );
          setPolygonState(newPolygonState);

          // Increase coordinates counter to trigger useEffect
          coordinatesCounter.current += 1;

          // Control bottom edit bar
          if (newPolygonState.current.length > 1) {
            setIsUndoDisabled(false);
          } else {
            setIsUndoDisabled(true);
          }
          setIsDeleteDisabled(false);
          setIsRedoDisabled(true);

          // Calculate stats
          if (newPolygonState.current.length >= 3) {
            const calculationCoordinates = polygonState.current.slice();
            calculationCoordinates.push(polygonState.current[0]);
            setAreaMeters(parseFloat(calculatePolygonArea([calculationCoordinates]).toFixed(2)));
            setPerimeterMeters(
              parseFloat(
                calculatePolygonPerimeter([calculationCoordinates]).toFixed(2),
              ),
            );
          }
        },
        (error) => {
          log.error(`[${VIEW}] - Get current position - ${error}`);
        },
        { enableHighAccuracy: true },
      );
    }
  }, [polygonState, coordinatesCounter]);

  const onCloseArea = useCallback(() => {
    if (polygonState.current) {
      const {
        polygonPointsList,
        maxX,
        maxY,
      } = calculatePolygonPointsList(polygonState.current);

      setPolygonPoints(polygonPointsList.join(' '));
      setViewBox(`0 0 ${maxX} ${maxY}`);

      setPolygonState(polygonReducer(clone(polygonState), { type: 'ADD', value: polygonState.current[0] }));
      setAreaMeters(parseFloat(calculatePolygonArea([polygonState.current]).toFixed(2)));
      setPerimeterMeters(parseFloat(calculatePolygonPerimeter([polygonState.current]).toFixed(2)));
    }
    setIsSaveButtonEnabled(true);
    setFollowUserMode(Mapbox.UserTrackingMode.Follow);
    setFollowUserLocation(false);
    setRandomKey(Math.random());
    setIsBottomBarAvailable(false);
  }, [polygonState]);

  const onUndo = useCallback(() => {
    if (polygonState.current.length > 1) {
      const newPolygonState = polygonReducer(clone(polygonState), { type: 'UNDO' });
      setPolygonState(newPolygonState);
      coordinatesCounter.current -= 1;

      if (newPolygonState.current.length > 1) {
        setIsUndoDisabled(false);
      } else {
        setIsUndoDisabled(true);
      }

      if (newPolygonState.past.length > 0) {
        setIsRedoDisabled(false);
      } else {
        setIsRedoDisabled(true);
      }

      // Calculate stats
      calculateStats(newPolygonState);
    }
  }, [polygonState]);

  const onRedo = useCallback(() => {
    const newPolygonState = polygonReducer(clone(polygonState), { type: 'REDO' });
    setPolygonState(newPolygonState);
    coordinatesCounter.current += 1;

    if (newPolygonState.past.length > 0) {
      setIsRedoDisabled(false);
    } else {
      setIsRedoDisabled(true);
    }

    if (newPolygonState.current.length > 1) {
      setIsUndoDisabled(false);
    } else {
      setIsUndoDisabled(true);
    }

    // Calculate stats
    calculateStats(newPolygonState);
  }, [polygonState]);

  const onDelete = useCallback(() => {
    setDisplayConfirmation(true);
  }, []);

  const onToggleVisibility = (isVisible: boolean) => {
    setIsAreaInstructionsVisible(isVisible);
    setBoolForKey(AREA_INSTRUCTIONS_VIEWED, true);
  };

  // Utilities
  const setCurrentLocation = useCallback(() => new Promise<Position>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        log.error(`[${VIEW}] - Get current position - ${error}`);
        reject(new Error('Could not get current position'));
      },
      { enableHighAccuracy: true },
    );
  }), []);

  const calculateStats = (newPolygonState: PolygonState) => {
    if (newPolygonState.current.length >= 3) {
      const calculationCoordinates = newPolygonState.current.slice();
      calculationCoordinates.push(newPolygonState.current[0]);
      setAreaMeters(parseFloat(calculatePolygonArea([calculationCoordinates]).toFixed(2)));
      setPerimeterMeters(
        parseFloat(
          calculatePolygonPerimeter([calculationCoordinates]).toFixed(2),
        ),
      );
    }
  };

  const deletePolygon = () => {
    setPolygonState({
      current: [],
      past: [],
    });
    setIsUndoDisabled(true);
    setIsRedoDisabled(true);
    setIsDeleteDisabled(true);
    setIsRecording(false);
    setIsBottomBarAvailable(false);
    coordinatesCounter.current = 0;
    setDisplayConfirmation(false);
  };

  const headerRight = () => (
    <Pressable
      onPress={onSubmitButtonPress}
      disabled={!isSaveButtonEnabled}
      hitSlop={20}
    >
      <ReportFormSubmitButton disabled={!isSaveButtonEnabled} />
    </Pressable>
  );

  const trackAnalyticsEvent = (event: AnalyticsEvent) => {
    logEvent(event.eventName, analyticsEventToHashMap(event));
  };

  // Component's Life-cycle
  useEffect(() => {
    const initLocation = async () => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const currentCoordinates = await setCurrentLocation();
      setCenterCoordinates(currentCoordinates);
    };

    initLocation();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [isSaveButtonEnabled]);

  useEffect(() => {
    if (polygonState.current.length >= 0) {
      // Set the geometry coordinates and type based on the number of points
      if (polygonState.current.length === 0) {
        geoJson.features = [];
      } else if (polygonState.current.length === 1) {
        geoJson.features[0] = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: polygonState.current[0],
          },
        };
      } else if (polygonState.current.length > 1) {
        geoJson.features[0] = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: polygonState.current,
          },
        };
      }

      if (
        polygonState.current.length >= MIN_POINTS_FOR_POLYGON
        && isSaveButtonEnabled
      ) {
        geoJson.features[0] = {
          type: 'Feature',
          properties: {
            provenance: 'er-mobile',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [polygonState.current],
          },
        };

        const polygonBounds = bbox(geoJson);
        if (polygonBounds) {
          setFitBounds([
            [polygonBounds[0], polygonBounds[1]],
            [polygonBounds[2], polygonBounds[3]],
          ]);
        }
      }

      setGeoJson(geoJson);

      // Enable the close area button when there are 3 or more points
      if (polygonState.current.length >= MIN_POINTS_FOR_POLYGON) {
        setIsCloseAreaButtonEnabled(true);
      } else {
        setIsCloseAreaButtonEnabled(false);
      }

      setShapeSourceKey(Math.random());

      navigation.setOptions({
        headerRight,
      });
    }
  }, [coordinatesCounter.current, isSaveButtonEnabled, polygonState.current.length]);

  return (
    <>
      {/* Map */}
      <Mapbox.MapView
        style={styles.mapContainer}
        compassViewMargins={{ x: 10, y: 60 }}
        styleURL={basemapSelected}
      >
        <Mapbox.Camera
          zoomLevel={ZOOM_LEVEL}
          animationMode={ANIMATION_MODE}
          animationDuration={ANIMATION_DURATION}
          centerCoordinate={centerCoordinates}
          followZoomLevel={ZOOM_LEVEL}
          followUserLocation={followUserLocation}
          followUserMode={followUserMode}
          bounds={fitBounds ? {
            paddingTop: MAP_ZOOM_PADDING,
            paddingRight: MAP_ZOOM_PADDING,
            paddingBottom: MAP_ZOOM_PADDING,
            paddingLeft: MAP_ZOOM_PADDING,
            ne: fitBounds[0],
            sw: fitBounds[1],
          } : undefined}
          key={randomKey}
        />
        <Mapbox.ShapeSource id="areaPolygon" shape={geoJson} key={shapeSourceKey}>
          <Mapbox.CircleLayer
            id="areaCircleLayer"
            sourceID="areaPolygon"
            style={circleLayerStyles}
          />
          <Mapbox.LineLayer
            id="areaLineLayer"
            sourceID="areaPolygon"
            style={lineLayerStyles}
          />
          {isSaveButtonEnabled && (
            <Mapbox.FillLayer
              id="areaFillLayer"
              sourceID="areaPolygon"
              style={fillLayerStyles}
            />
          )}
        </Mapbox.ShapeSource>
        <Mapbox.UserLocation
          onUpdate={
            (location) => onLocationUpdate([location.coords.latitude, location.coords.longitude])
          }
          showsUserHeadingIndicator
        />
      </Mapbox.MapView>
      {/* End Map */}

      {/* Bottom Toolbar */}
      {isBottomBarAvailable && (
        <BottomToolbar
          isDeleteDisabled={isDeleteDisabled}
          isRedoDisabled={isRedoDisabled}
          isUndoDisabled={isUndoDisabled}
          onDeletePressHandler={onDelete}
          onRedoPressHandler={onRedo}
          onUndoPressHandler={onUndo}
          onToggleHelpPressHandler={onToggleVisibility}
        />
      )}
      {/* End Bottom Toolbar */}

      {/* User's Current Coordinates */}
      <CurrentLocation coordinates={currentCoordinates} />
      {/* End User's Current Coordinates */}

      {/* Area Statistics Bar */}
      {(polygonState.current.length >= MIN_POINTS_FOR_POLYGON) && (
        <AreaStatisticsBar areaMeters={areaMeters} perimeterMeters={perimeterMeters} />
      )}
      {/* End Area Statistics Bar */}

      {/* Buttons */}
      {!isRecording ? (
        <StartRecordingButton onStartRecordingPressHandler={onStartRecording} />
      ) : (
        !isSaveButtonEnabled && (
          <PolygonManagementButtons
            onAddPointPressHandler={onAddPoint}
            onCloseAreaPressHandler={onCloseArea}
            isCloseAreaButtonEnabled={isCloseAreaButtonEnabled}
          />
        )
      )}
      {/* End Buttons */}

      {/* Delete Polygon Confirmation */}
      <CustomAlert
        alertTitleText={t('recordReportArea.discardReportAreaDialog.title')}
        displayAlert={displayConfirmation}
        negativeButtonText={t('recordReportArea.discardReportAreaDialog.negative')}
        onNegativeButtonPress={() => setDisplayConfirmation(false)}
        onPositiveButtonPress={deletePolygon}
        positiveButtonBackgroundColor={Colors.brightRed}
        positiveButtonIcon={<TrashIcon />}
        positiveButtonText={t('recordReportArea.discardReportAreaDialog.positive')}
      />
      {/* End Delete Polygon Confirmation */}

      {/* Help Dialog */}
      {isAreaInstructionsVisible
        && <AreaInstructionsDialog onToggleVisibility={onToggleVisibility} />}
      {/* End Help Dialog */}
    </>
  );
};

export { RecordReportAreaView };
