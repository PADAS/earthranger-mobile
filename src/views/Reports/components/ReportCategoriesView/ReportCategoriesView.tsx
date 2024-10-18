// External Dependencies
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

// Internal Dependencies
import { useRetrieveReportCategories } from '../../../../common/data/reports/useRetrieveReportCategories';
import { EventCategory } from '../../../../common/types/reportsResponse';
import { RootStackParamList, Position } from '../../../../common/types/types';
import { PermissionView } from '../../../Permission/PermissionView';
import { UserType } from '../../../../common/enums/enums';
import { useRetrieveUser } from '../../../../common/data/users/useRetrieveUser';

// Styles
import styles from './ReportCategoriesView.styles';

interface ReportCategoriesViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportCategoriesView'>;
  route: NativeStackScreenProps<RootStackParamList, 'ReportCategoriesView'>;
}

const ReportCategoriesView = ({
  route,
  navigation,
}: ReportCategoriesViewProps) => {
  // Hooks
  const { retrieveUserInfo } = useRetrieveUser();
  const { retrieveReportCategoriesByUserType } = useRetrieveReportCategories();

  // Component's State
  const [reportTypes, setReportTypes] = useState<EventCategory[]>([]);
  const [coordinates, setCoordinates] = useState<Position>();

  useEffect(() => {
    getReportCategories();
    initMapCoordinates();
  }, []);

  // Handlers
  const getReportCategories = async () => {
    const userInfo = await retrieveUserInfo();
    if (userInfo?.userType) {
      const profileId = userInfo?.userType === UserType.profile ? parseInt(userInfo.userId || '', 10) : undefined;
      const reportCategoriesList = await retrieveReportCategoriesByUserType(
        userInfo.userType,
        profileId,
      );
      setReportTypes(reportCategoriesList);
    }
  };

  const initMapCoordinates = () => {
    if (route.params.coordinates) {
      setCoordinates(
        [
          parseFloat(route.params.coordinates[0].toFixed(6)),
          parseFloat(route.params.coordinates[1].toFixed(6)),
        ],
      );
    }
  };

  const onPress = (categoryId: string, title: string) => {
    navigation.navigate('ReportTypesView', {
      categoryId,
      coordinates,
      title,
    });
  };

  return (
    <SafeAreaView style={styles.content} edges={['bottom']}>
      {(reportTypes.length > 0) ? (
        <View>
          {/* List of Report Types */}
          <FlatList
            data={reportTypes}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                onPress(item.remote_id, item.display);
              }}
              >
                <View style={styles.listRow} key={item.id}>
                  <Text style={styles.listRowText}>{item.display}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          {/* End List of Report Types */}
        </View>
      ) : (<PermissionView />)}
    </SafeAreaView>
  );
};

export { ReportCategoriesView };
