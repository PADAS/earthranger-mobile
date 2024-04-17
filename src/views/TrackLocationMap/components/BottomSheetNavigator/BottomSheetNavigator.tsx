/* eslint-disable import/no-cycle */
// External Dependencies
import React, {
  createContext,
  MutableRefObject,
  Ref, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import BottomSheet from '@gorhom/bottom-sheet';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';
import { SharedValue, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { getLocales } from 'react-native-localize';

// Internal dependencies
import { BottomSheetParamList } from '../../../../common/types/types';
import { Basemap } from '../../../../common/components/Basemap/Basemap';
import { hiddenHeaderOption } from '../../../../common/props/headerProps';
import { BottomSheetMainView } from './components/PatrolTrack/BottomSheetMainView';
import {
  BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX,
  IS_DEVICE_TRACKING, PATROL_STATUS_KEY,
} from '../../../../common/constants/constants';
import {
  getBoolForKey,
  localStorage,
  setNumberForKey,
} from '../../../../common/data/storage/keyValue';
import { PatrolDetailsView } from '../PatrolDetailsView/PatrolDetailsView';
import { TrackingStatusView } from '../TrackingStatusView/TrackingStatusView';
import {
  PATROL_DETAILS_CONTENT_HEIGHT,
  PATROL_DETAILS_TITLE_HEIGHT,
  TRACKING_STATUS_INLINE_BUTTONS_HEIGHT, TRACKING_STATUS_STACKED_BUTTONS_HEIGHT,
  TRACKING_STATUS_TITLE_HEIGHT,
} from '../../../../common/constants/dimens';

// Styles
import styles, { navigationTheme } from './BottomSheetNavigator.styles';

type BottomSheetContextType = {
  animatedPosition: SharedValue<number>;
};

export const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheetContext must be used within a BottomSheetNavigator');
  }
  return context;
};

export interface BottomSheetNavigatorMethods {
  navigate: (screen: keyof BottomSheetParamList, params: any, expand?: boolean) => void;
  restoreScreen: () => void;
}
interface BottomSheetNavigatorProps {
  bottomSheetRef: Ref<BottomSheetMethods>;
  bottomSheetMethodsRef: Ref<BottomSheetNavigatorMethods>;
  sharedAnimatedPosition: SharedValue<number>;
}

const Stack = createNativeStackNavigator<BottomSheetParamList>();
const BottomSheetNavigator = ({
  bottomSheetRef,
  bottomSheetMethodsRef,
  sharedAnimatedPosition,
}: BottomSheetNavigatorProps) => {
  // Hooks
  const { t } = useTranslation();
  const [isPatrolOn] = useMMKVBoolean(
    PATROL_STATUS_KEY,
    localStorage,
  );
  const [isTrackingOn] = useMMKVBoolean(
    IS_DEVICE_TRACKING,
    localStorage,
  );
  const animatedPosition = useSharedValue(0);

  useDerivedValue(() => {
    // eslint-disable-next-line no-param-reassign
    sharedAnimatedPosition.value = animatedPosition.value;
  }, []);

  const getInitialScreen = (): keyof BottomSheetParamList => {
    if (getBoolForKey(PATROL_STATUS_KEY)) {
      return 'PatrolDetailsView';
    }
    if (getBoolForKey(IS_DEVICE_TRACKING)) {
      return 'TrackingStatusView';
    }
    return 'PatrolTrack';
  };

  // References
  const navigationRef = useRef<NavigationContainerRef<BottomSheetParamList>>(null);
  const isVisible = useRef(false);
  const innerBottomSheetRef = bottomSheetRef as MutableRefObject<BottomSheetMethods>;

  // State
  const [handleDisplay, setHandleDisplay] = useState<'flex' | 'none' | undefined>('none');
  // eslint-disable-next-line max-len
  const [currentScreen, setCurrentScreen] = useState<keyof BottomSheetParamList>(getInitialScreen());

  // Constants
  const isSmallScreen = Dimensions.get('window').width <= 320;
  const isLongTextButton = t('mapTrackLocation.patrol').length >= 10 || t('mapTrackLocation.tracking').length >= 10;
  const screenHeight = (isSmallScreen && isLongTextButton) ? 140 : 90;
  const stackedLanguages = ['es', 'fr', 'sw', 'pt'];
  const isButtonStacked = stackedLanguages.includes(getLocales()[0].languageCode);

  const snapPoints = useMemo(() => {
    switch (currentScreen) {
      case 'PatrolDetailsView':
        return [PATROL_DETAILS_TITLE_HEIGHT, PATROL_DETAILS_CONTENT_HEIGHT];
      case 'PatrolTrack':
        return [screenHeight];
      case 'TrackingStatusView':
        return [
          TRACKING_STATUS_TITLE_HEIGHT,
          isButtonStacked ? TRACKING_STATUS_STACKED_BUTTONS_HEIGHT
            : TRACKING_STATUS_INLINE_BUTTONS_HEIGHT,
        ];
      default:
        return [250];
    }
  }, [currentScreen]);

  const getInitialIndex = () => {
    switch (currentScreen) {
      case 'PatrolTrack':
      case 'TrackingStatusView':
      case 'PatrolDetailsView':
        return 0;
      default:
        return -1;
    }
  };

  const getHandleDisplay = () => (currentScreen === 'PatrolDetailsView' || currentScreen === 'TrackingStatusView'
    ? 'flex' : 'none');

  useEffect(() => {
    setHandleDisplay(getHandleDisplay());
  }, [currentScreen]);

  useEffect(() => {
    handleRestoreScreen();
  }, [isPatrolOn, isTrackingOn]);

  useImperativeHandle(bottomSheetMethodsRef, () => ({
    navigate: handleNavigate,
    restoreScreen: handleRestoreScreen,
  }));

  const handleNavigate = (
    screen: keyof BottomSheetParamList,
    params: any,
    expand?: boolean,
  ) => {
    if (currentScreen !== screen) {
      setCurrentScreen(screen);
      navigationRef.current?.navigate(screen, params);
    }
    if (expand) {
      if (isVisible) {
        innerBottomSheetRef.current?.snapToIndex(0);
      } else {
        innerBottomSheetRef.current?.expand();
      }
    }
  };

  const handleRestoreScreen = () => {
    const screen = getInitialScreen();
    if (screen === 'Basemap') {
      innerBottomSheetRef.current?.close();
    } else {
      handleNavigate(screen, null, true);
    }
  };

  const handleOnChange = (index: number) => {
    isVisible.current = index >= 0;
    setNumberForKey(BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX, index);
  };

  const handleOnClose = () => {
    isVisible.current = false;
  };

  return (
    <BottomSheet
      style={styles.bottomSheet}
      backgroundStyle={styles.background}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      enableContentPanningGesture
      enablePanDownToClose={false}
      index={getInitialIndex()}
      handleStyle={{ display: handleDisplay }}
      onChange={handleOnChange}
      onClose={handleOnClose}
      animatedPosition={animatedPosition}
    >
      <BottomSheetContext.Provider value={useMemo(() => ({ animatedPosition }), [])}>
        <GestureHandlerRootView style={{ flex: 1, flexGrow: 1 }}>
          <NavigationContainer independent ref={navigationRef} theme={navigationTheme}>
            <Stack.Navigator initialRouteName={currentScreen}>
              <Stack.Screen
                name="PatrolTrack"
                component={BottomSheetMainView}
                options={{
                  ...hiddenHeaderOption,
                  animation: 'none',
                }}
              />
              <Stack.Screen
                name="TrackingStatusView"
                component={TrackingStatusView}
                options={{
                  ...hiddenHeaderOption,
                  animation: 'none',
                }}
              />
              <Stack.Screen
                name="Basemap"
                component={Basemap}
                options={{
                  ...hiddenHeaderOption,
                  animation: 'none',
                }}
              />
              <Stack.Screen
                name="PatrolDetailsView"
                component={PatrolDetailsView}
                options={{
                  ...hiddenHeaderOption,
                  animation: 'none',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </BottomSheetContext.Provider>
    </BottomSheet>
  );
};

export { BottomSheetNavigator };
