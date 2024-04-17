// External Dependencies
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';

// Internal Dependencies
import { PatrolTypesCell } from './components/PatrolTypesCell/PatrolTypesCell';
import { useRetrievePatrolTypes } from '../../../../common/data/patrols/useRetrievePatrolTypes';
import { Position } from '../../../../common/types/types';
import log from '../../../../common/utils/logUtils';

// Styles
import styles from './PatrolsTypeView.styles';

// Constants
const GRID_TYPE = 'DEFAULT_TYPE';
const DEFAULT_HEIGHT = 131;

// Types
type RouteParams = {
  coordinates: Position
};

const PatrolsTypeView = () => {
  // Hooks
  const { retrievePatrolTypes } = useRetrievePatrolTypes();
  const navigation = useNavigation();

  // Variables
  const itemSize = (Dimensions.get('window').width) / 3 - 1;

  // Get route parameters
  const {
    coordinates,
  }: RouteParams = navigation.getState().routes[navigation.getState().index].params;

  // Component's State
  const [dataProvider, setDataProvider] = useState(new DataProvider((r1, r2) => r1 !== r2));
  const [layoutProvider] = useState<LayoutProvider>(
    new LayoutProvider(
      () => GRID_TYPE,
      (_, dim) => {
        // eslint-disable-next-line no-param-reassign
        dim.width = itemSize;
        // eslint-disable-next-line no-param-reassign
        dim.height = DEFAULT_HEIGHT;
      },
    ),
  );

  // Component's Life-cycle events
  useFocusEffect(() => {
    const initData = async () => {
      try {
        const patrolTypesList = await retrievePatrolTypes();
        setDataProvider(dataProvider.cloneWithRows(patrolTypesList));
      } catch (error: any) {
        log.error(`ERROR - ${error}`);
      }
    };

    initData();
  });

  // Handlers
  const onPressHandler = (
    patrolType: string,
    patrolTypeId: string,
    patrolTypeDisplay: string,
  ) => {
    // @ts-ignore
    navigation.navigate('StartPatrolView', {
      patrolTitle: patrolTypeDisplay,
      patrolType,
      patrolTypeId,
      coordinates,
    });
  };

  // Additional Components
  const rowRenderer = (type: any, data: any) => (
    <PatrolTypesCell
      typeId={data.id.toString()}
      title={data.display}
      iconImage={data.icon_svg}
      onPress={() => {
        onPressHandler(data.value, data.id.toString(), data.display);
      }}
    />
  );

  return (
    <SafeAreaView style={styles.mainContainer} edges={['bottom']}>
      <RecyclerListView
        canChangeSize={false}
        dataProvider={dataProvider}
        disableRecycling
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        style={styles.recyclerListView}
      />
    </SafeAreaView>
  );
};

export { PatrolsTypeView };
