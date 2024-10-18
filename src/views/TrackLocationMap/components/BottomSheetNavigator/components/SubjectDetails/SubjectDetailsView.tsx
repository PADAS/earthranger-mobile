/* eslint-disable react/jsx-no-useless-fragment */
// External Dependencies
import { Button, Text, View } from 'react-native-ui-lib';
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

      initData(currentSubjectData.id);
    }
  }, [subjectData]);

  // Icons
  const closeIcon = () => <CloseIcon />;

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

        <Text mobileBody brightBlue>
          {calculateDateDifference(subjectLastUpdate, t)}
        </Text>

        <Text bodySmall black>
          {formatCoordinates(
            subjectCoordinates.latitude,
            subjectCoordinates.longitude,
            getStringForKey(COORDINATES_FORMAT_KEY),
          )}
        </Text>
      </View>
    </>
  );
};

export { SubjectDetailsView };
