// External Dependencies
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

// Internal Dependencies
import { PatrolTypesCell } from './components/PatrolTypesCell/PatrolTypesCell';
import { useRetrievePatrolTypes } from '../../../../common/data/patrols/useRetrievePatrolTypes';
import { PersistedPatrolType, Position } from '../../../../common/types/types';
import log from '../../../../common/utils/logUtils';
import { ELEMENT_INSPECTOR_WIDTH } from '../../../../common/constants/constants';

// Styles
import styles from './PatrolsTypeView.styles';

// Types
type RouteParams = {
  coordinates: Position
};

const PatrolsTypeView = () => {
  // Hooks
  const { retrievePatrolTypes } = useRetrievePatrolTypes();
  const navigation = useNavigation();

  // Get route parameters
  const {
    coordinates,
  }: RouteParams = navigation.getState().routes[navigation.getState().index].params;

  // Component's State
  const [dataProvider, setDataProvider] = useState<PersistedPatrolType[]>([]);

  // Component's Life-cycle events
  useFocusEffect(useCallback(() => {
    const initData = async () => {
      try {
        const patrolTypesList = await retrievePatrolTypes();
        setDataProvider(patrolTypesList);
      } catch (error: any) {
        log.error(`ERROR - ${error}`);
      }
    };

    initData();
  }, []));

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
  const renderItem = ({ item }: any) => (
    <PatrolTypesCell
      typeId={item.id.toString()}
      title={item.display}
      iconImage={item.icon_svg}
      onPress={() => {
        onPressHandler(item.value, item.id.toString(), item.display);
      }}
    />
  );

  return (
    <SafeAreaView style={styles.mainContainer} edges={['bottom']}>
      <FlashList
        data={dataProvider}
        estimatedItemSize={ELEMENT_INSPECTOR_WIDTH}
        keyExtractor={(item: PersistedPatrolType) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
      />
    </SafeAreaView>
  );
};

export { PatrolsTypeView };
