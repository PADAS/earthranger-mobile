/* eslint-disable react/jsx-no-useless-fragment */
// External Dependencies
import {
  Button,
  Incubator,
  Text,
  View,
} from 'react-native-ui-lib';
import { SvgXml } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { Pressable } from 'react-native';
import Clipboard from '@react-native-community/clipboard';

// Internal Dependencies
import {
  BOTTOM_SHEET_NAVIGATOR,
  COORDINATES_FORMAT_KEY,
  SELECTED_SUBJECT_IN_MAP,
} from '../../../../../../common/constants/constants';
import { BottomSheetAction } from '../../../../../../common/enums/enums';
import { cleanUpSvg } from '../../../../../../common/utils/svgIconsUtils';
import { CloseIcon } from '../../../../../../common/icons/CloseIcon';
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { formatCoordinates } from '../../../../../../common/utils/locationUtils';
import { getEventEmitter } from '../../../../../../common/utils/AppEventEmitter';
import { getStringForKey, localStorage } from '../../../../../../common/data/storage/keyValue';
import { useRetrieveSubjectIcon } from '../../../../../../common/data/subjects/useRetrieveSubjectIcon';
import { calculateDateDifference } from '../../../../../../common/utils/timeUtils';
import { CopyIcon } from '../../../../../../common/icons/CopyIcon';
import BackgroundLocation from '../../../../../../common/backgrounGeolocation/BackgroundLocation';
import { logTracking } from '../../../../../../common/utils/logUtils';
import { addDistance } from '../../../../../../common/utils/geometryUtils';

// Styles
import { styles } from './SubjectDetailsView.styles';

const SubjectDetailsView = () => {
  // Hooks
  const { t } = useTranslation();
  const { retrieveSubjectIcon } = useRetrieveSubjectIcon();

  // State
  const [subjectData] = useMMKVString(SELECTED_SUBJECT_IN_MAP, localStorage);
  const [subjectIcon, setSubjectIcon] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');
  const [subjectLastUpdate, setSubjectLastUpdate] = useState<string>('');
  const [subjectCoordinates, setSubjectCoordinates] = useState<{ latitude: number, longitude: number }>(
    {
      latitude: 0,
      longitude: 0,
    },
  );
  const [displayCoordinatesCopied, setDisplayCoordinatesCopied] = useState(false);
  const [subjectDistance, setSubjectDistance] = useState<string>('');

  // References
  const eventEmitter = useRef(getEventEmitter()).current;

  useFocusEffect(useCallback(() => {
    //
  }, []));

  useEffect(() => {
    if (subjectData) {
      const currentSubjectData = JSON.parse(subjectData);
      setSubjectName(currentSubjectData.name);
      setSubjectLastUpdate(currentSubjectData.lastUpdate);
      setSubjectCoordinates(currentSubjectData.coordinates);

      const initData = async (id: string) => {
        setSubjectIcon(await retrieveSubjectIcon(id) || '');
      };

      const getCurrentDistanceToSubject = async () => {
        try {
          const location = await BackgroundLocation.getCurrentPosition({
            samples: 1,
            persist: false,
          });

          if (location) {
            setSubjectDistance(addDistance(
              [
                location.coords.latitude,
                location.coords.longitude,
              ],
              [
                currentSubjectData.coordinates.latitude,
                currentSubjectData.coordinates.longitude,
              ],
              0,
            ).toFixed(2));
          }
        } catch (error) {
          logTracking.error('getCurrentLocation: error', error);
        }
      };

      initData(currentSubjectData.id);
      getCurrentDistanceToSubject();
    }
  }, [subjectData]);

  // Icons
  const closeIcon = () => <CloseIcon />;

  const onPressCopyCoordinates = () => {
    Clipboard.setString(
      formatCoordinates(
        subjectCoordinates.latitude || 0,
        subjectCoordinates.longitude || 0,
        getStringForKey(COORDINATES_FORMAT_KEY),
      ),
    );

    setDisplayCoordinatesCopied(true);
  };

  return (
    <>
      <View style={styles.container}>
        { /* Header */ }
        <View style={styles.headerContainer}>
          {/* Subject Icon */}
          <View>
            {subjectIcon && (
              <SvgXml
                xml={cleanUpSvg(subjectIcon)}
                width="26"
                height="26"
                fill={COLORS_LIGHT.G2_5_mobileSecondaryGray}
              />
            )}
          </View>
          {/* End Subject Icon */}

          {/* Subject Name */}
          <Text
            numberOfLines={1}
            style={styles.header}
          >
            {subjectName}
          </Text>
          {/* End Subject Name */}

          {/* Close Icon */}
          <Button
            iconSource={closeIcon}
            style={styles.closeIcon}
            onPress={() => eventEmitter.emit(
              BOTTOM_SHEET_NAVIGATOR,
              { bottomSheetAction: BottomSheetAction.dismiss },
            )}
            hitSlop={{
              top: 20, bottom: 20, left: 20, right: 20,
            }}
          />
          {/* End Close Icon */}
        </View>
        { /* End Header */ }

        <Text heading2 black marginB-16>
          {t('subjectsView.distance', { subjectDistance })}
        </Text>

        <Text mobileBody brightBlue>
          {calculateDateDifference(subjectLastUpdate, t)}
        </Text>

        <View style={styles.coordinatesContainer}>
          <Text bodySmall black marginR-12>
            {formatCoordinates(
              subjectCoordinates.latitude,
              subjectCoordinates.longitude,
              getStringForKey(COORDINATES_FORMAT_KEY),
            )}
          </Text>
          <Pressable
            hitSlop={{
              top: 18, bottom: 18, left: 18, right: 18,
            }}
            onPress={onPressCopyCoordinates}
          >
            <CopyIcon />
          </Pressable>
        </View>
      </View>

      {/* Coordinates copied to clipboard Toast */}
      <Incubator.Toast
        autoDismiss={2000}
        backgroundColor={COLORS_LIGHT.G0_black}
        message={t('mapTrackLocation.coordinatesCopied')}
        messageStyle={{ color: COLORS_LIGHT.white, marginLeft: -24 }}
        onDismiss={() => setDisplayCoordinatesCopied(false)}
        position="bottom"
        style={{ borderRadius: 4 }}
        visible={displayCoordinatesCopied}
      />
      {/* End Coordinates copied to clipboard Toast */}
    </>
  );
};

export { SubjectDetailsView };
