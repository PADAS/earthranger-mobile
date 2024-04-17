// External Dependencies
import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { SearchIcon } from '../../icons/SearchIcon';
import { COLORS_LIGHT } from '../../constants/colors';

// styles
import style from './EmptySearchResultsView.styles';

export const EmptySearchResultsView = () => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View style={style.emptyStateContainer}>
      <SearchIcon color={COLORS_LIGHT.G3_secondaryMediumLightGray} width="40" height="40" viewbox="0 0 40 40" />
      <Text style={style.emptyStateText}>{t('reportTypes.emptyStateSearch')}</Text>
    </View>
  );
};
