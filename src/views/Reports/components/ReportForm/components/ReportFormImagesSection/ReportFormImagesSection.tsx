// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  View,
} from 'react-native';

// Internal Dependencies
import { AddImagePlaceholder } from '../ReportFormAddImagePlaceholder/ReportFormAddImagePlaceholder';

// Styles
import styles from './ReportFormImagesSection.styles';

// Constants
const ADD_IMAGE_PLACEHOLDER = 'ADD_IMAGE_PLACEHOLDER';

// Interfaces
interface ImagesSectionProps {
  thumbnails: string[];
  onCameraPress: () => void;
}

export const ImagesSection = ({
  thumbnails,
  onCameraPress,
}: ImagesSectionProps) => {
  // Hooks
  const { t } = useTranslation();

  const data = [...thumbnails, ADD_IMAGE_PLACEHOLDER];

  return (
    <>
      <Text style={styles.imagesSectionTitle}>{t('reportForm.images')}</Text>
      <View style={styles.imagesContainer}>
        {data.map((img) => {
          if (img === ADD_IMAGE_PLACEHOLDER) {
            return (
              <View key={ADD_IMAGE_PLACEHOLDER} style={styles.addImagePlaceholderContainer}>
                <AddImagePlaceholder onCameraPress={onCameraPress} />
              </View>
            );
          }

          return (
            <Image
              key={img.split('/').reverse()[0]}
              source={{
                uri: `file:///${img}`,
              }}
              style={styles.imageItem}
            />
          );
        })}
      </View>
    </>
  );
};
