// External Dependencies
import React from 'react';
import {
  Pressable, StyleSheet,
} from 'react-native';
import { Drawer, Text, View } from 'react-native-ui-lib';
import { SvgXml } from 'react-native-svg';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { cleanUpSvg, mapPriorityToBgColor } from '../../../../common/utils/svgIconsUtils';
import { EventStatus } from '../../../../common/enums/enums';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

// Icons
import { DefaultEventTypeIcon } from '../../../../common/icons/DefaultEventTypeIcon';
import { ReportsArrowIcon } from '../../../../common/icons/ReportArrowIcon';
import { EditIcon } from '../../../../common/icons/EditIcon';
import { LogOutAlertIcon } from '../../../../common/icons/LogOutAlertIcon';
import { ReportsSyncNotRequiredIcon } from '../../../../common/icons/ReportsSyncNotRequiredIcon';
import { ReportsSyncRequiredIcon } from '../../../../common/icons/ReportsSyncRequiredIcon';
import { icons } from '../../../../ui/AssetsUtils';

// Styles
import styles from './EventCell.styles';
import { isSyncingReports } from '../../../../common/utils/syncUtils';

interface EventCellProps {
  bgColor: string,
  defaultPriority: number;
  fgColor: string,
  iconImage: string;
  id: number;
  labelText: string,
  navigateToReportForm: (reportId: number) => Promise<void>,
  onRemoveReport: (id: number) => Promise<void>,
  statusIcon: string,
  text: string,
  title: string;
  type: EventStatus;
  isEditable: boolean;
  errorMsg?: string;
  hasErrorOnEvent: boolean;
}

const EventCell = ({
  bgColor,
  defaultPriority,
  fgColor,
  iconImage,
  id,
  labelText,
  navigateToReportForm,
  onRemoveReport,
  statusIcon,
  text,
  title,
  type,
  isEditable,
  errorMsg,
  hasErrorOnEvent,
}: EventCellProps) => {
  // Hooks
  const { t } = useTranslation();

  /**
   * Some icons have a previously loaded color,
   * which results in it ignoring the color we assign based on the priority.
   * For these icons, it is necessary to remove the `fill` property.
   */
  const xml = cleanUpSvg(iconImage);

  const cell = () => {
    let badgeIcon;

    if (statusIcon === 'editIcon') {
      badgeIcon = <EditIcon width="12" height="12" color={fgColor} />;
    } else if (statusIcon === 'errorIcon') {
      badgeIcon = <LogOutAlertIcon width="12" height="12" color={fgColor} />;
    } else if (statusIcon === 'submittedIcon') {
      badgeIcon = <ReportsSyncNotRequiredIcon width="12" height="12" color={fgColor} />;
    } else {
      badgeIcon = <ReportsSyncRequiredIcon width="12" height="12" color={fgColor} />;
    }

    return (
      <Pressable onPress={
          () => {
            if (
              (
                type === EventStatus.draft
                || type === EventStatus.pendingSync
                || (type === EventStatus.error && hasErrorOnEvent)
              )
              && isEditable
            ) {
              navigateToReportForm(id);
            }
          }
        }
      >
        <View style={styles.mainContainer}>
          {/* Icon */}
          <View style={
            StyleSheet.flatten(
              [
                styles.iconContainer,
                { backgroundColor: mapPriorityToBgColor(defaultPriority) || '' },
              ],
            )
            }
          >
            {iconImage
              ? <SvgXml xml={xml} width="24" height="24" fill={COLORS_LIGHT.white} />
              : <DefaultEventTypeIcon color={COLORS_LIGHT.white} />}
          </View>
          {/* End Icon */}

          {/* Details */}
          <View style={styles.detailsContainer}>
            <Text heading3 numberOfLines={1}>{title}</Text>

            {/* Badge */}
            <View style={styles.badgeContainer}>
              <View style={StyleSheet.flatten(
                [styles.badgeMainContainer, { backgroundColor: bgColor }],
              )}
              >
                {badgeIcon}
                <Text bodySmall style={{ color: fgColor, marginLeft: 4 }}>{labelText}</Text>
              </View>
              <Text marginL-8>
                {errorMsg}
              </Text>
            </View>
            {/* End Badge */}

            <Text bodySmall secondaryMediumGray numberOfLines={1}>{text}</Text>
          </View>
          {/* End Details */}

          {/* Caret */}
          <View style={styles.caretContainer}>
            {
              (
                (
                  (
                    (type === EventStatus.pendingSync && !isSyncingReports())
                    || type === EventStatus.draft
                    || (type === EventStatus.error && hasErrorOnEvent)
                  )
                  && isEditable
                )
              )
              && <ReportsArrowIcon />
            }
          </View>
          {/* End Caret */}
        </View>
      </Pressable>
    );
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {
        (type === EventStatus.draft || type === EventStatus.pendingSync) ? (
          <GestureHandlerRootView>
            <Drawer
              rightItems={[
                {
                  // eslint-disable-next-line global-require
                  icon: icons.Trash.icon,
                  text: t('common.delete'),
                  background: COLORS_LIGHT.red,
                  onPress: onRemoveReport,
                },
              ]}
              itemsTextStyle={{ fontSize: 12 }}
              itemsIconSize={24}
            >
              { cell() }
            </Drawer>
          </GestureHandlerRootView>
        ) : (
          <>
            { cell() }
          </>
        )
      }
    </>
  );
};

export { EventCell };
