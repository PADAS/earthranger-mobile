import { EventStatus, PatrolResult } from '../enums/enums';

export type Position = [number, number];

export type RootStackParamList = {
  SplashScreen: undefined,
  LoginView: undefined,
  TrackLocationMapView: {
    flyTo?: Position;
  }
  MainTabBar: undefined,
  ReportsView: undefined,
  ReportIssueView: undefined,
  PinAuthenticationView: undefined,
  SyncLoaderView: undefined,
  ReportCategoriesView: {
    coordinates?: Position,
  },
  ReportTypesView: {
    title: string,
    categoryId: string,
    coordinates?: Position,
    isPatrolInfoEventType?: boolean,
  },
  ReportForm: {
    reportId?: number,
    title: string,
    typeId: string,
    coordinates?: Position
    schema: string,
    geometryType: string,
    isEditMode?: boolean,
    createdAt?: string,
    isDefaultPatrolInfoEnabled?: boolean,
    geoJson?: GeoJSON.FeatureCollection,
    areaMeters?: number,
    perimeterMeters?: number,
    polygonPoints?: string,
    viewBox?: string,
    isPatrolInfoEvent?: boolean,
  },
  ReportEditLocationView: { coordinates: Position },
  RecordReportAreaView: undefined,
  AboutView: undefined,
  ReportNoteView: { id: number, text: string, coordinates: Position, channelId: string },
  MenuSettingsView: undefined,
  SettingsView: undefined,
  StatusView: undefined,
  ReportRepeatableFieldListView: {
    schema: any,
    title: string,
    rendererId: string,
    data?: RepeatableFieldListData[],
  },
  RepeatableFormView: {
    schema: any,
    title: string,
    listId: string,
  },
  EventsListFilterView: undefined,
  ReportsPendingSync: undefined,
  TrackedBySubjectsView: {
    subjects?: any,
  },
  BasemapView: undefined,
  CoordinateUnitsView: undefined,
  PatrolsTypeView: {
    coordinates: Position,
  },
  StartPatrolView: {
    patrolTitle: string,
    patrolType: string,
    patrolTypeId: string,
    coordinates: Position,
  },
  PhotoQualityView: undefined,
  ResetDatabaseCacheView: undefined,
  SubjectsListView: {
    parentSubjectGroupName?: string,
    isParentView?: boolean,
    parentId?: string,
  }
};

export type BottomSheetParamList = {
  Basemap: undefined,
  PatrolDetailsView: { patrolId: number },
  PatrolTrack: undefined,
  TrackingStatusView: undefined,
  SubjectDetailsView: undefined,
};

export interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type RepeatableFieldListData = {
  id: number;
  title: string;
  data: any;
  hidden: boolean,
};

export type LastLocation = {
  timestamp: string;
  displayDate: string;
  latitude: number;
  longitude: number;
  accuracy: number;
};

export interface IconProps {
  width?: string;
  height?: string;
  color?: string;
  viewbox?: string;
  isDisabled?: boolean;
}

export type AttachmentPhotoType = 'photo';
export type AttachmentNoteType = 'note';
export type AttachmentUpdateNoteType = 'updateNote';
export type AttachmentAddNewNoteType = 'addNewNote';
export type AttachmentDeleteNoteType = 'deleteNote';

export type ReportFormEvent = {
  id: number;
  remoteId: string,
  accountId: string,
  eventTypeId: number;
  title: string;
  latitude: number;
  longitude: number;
  geometry: string;
  event_values: string;
  isDraft: number;
  createdAt: number,
  updatedAt: number,
  patrol_segment_id: number | undefined,
};

export type EventData = {
  eventTypeId: string;
  title: string;
  latitude: number;
  longitude: number;
  geometry: string;
  event_values: string;
  isDraft: number;
  createdAt: string,
  updatedAt: string,
  patrol_segment_id: number | undefined,
};

export type ReportFormFullEvent = {
  account_id: number;
  profile_id: number;
  event_type_id: string;
  title: string;
  latitude: number;
  longitude: number;
  geometry: string,
  event_values: string;
  is_draft: number;
  value: string;
  updated_at: string;
  created_at: string;
  id: string;
  geometry_type: string;
  segment_remote_id: string | undefined;
  patrol_segment_id: string | undefined;
};

export type PersistedEventType = {
  id?: number;
  remote_id: string;
  account_id: number;
  profile_id: string;
  value: string;
  display: string;
  schema: string;
  category_id: string;
  geometry_type: string;
  default_priority: string;
  icon: string;
  icon_svg: string;
};

export type PersistedPatrolType = {
  id: number;
  remote_id: string;
  account_id: number;
  value: string;
  display: string;
  icon: string;
  icon_svg: string;
  default_priority: number;
  is_active: number;
  is_selected: boolean;
};

export type PersistedPatrol = {
  id: number;
  remote_id: string;
  account_id: number;
  profile_id: number;
  title: string;
  priority: string;
  state: string;
  created_at: string;
  updated_at: string;
};

export type PersistedPatrolSegment = {
  id: number
  remote_id: string;
  patrol_id: number;
  patrol_type_id: number;
  start_latitude: string;
  start_longitude: string;
  stop_latitude: string;
  stop_longitude: string;
  start_time: string;
  end_time: string;
};

export type PersistedPatrolTypeSegment = {
  id: number;
  remote_id: string;
  patrol_id: number;
  patrol_type_id: number;
  start_latitude: string;
  start_longitude: string;
  stop_latitude: string;
  stop_longitude: string;
  start_time: string;
  end_time: string;
  patrol_type: string;
};

export type DraftReports = {
  id: number;
  title: string;
  type_id: number,
  updated_at: string;
  icon_svg: string;
  default_priority: number;
  schema: string,
  geometry_type: string,
  hidden?: boolean;
  is_draft?: boolean;
};

export type EventUploadDetails = {
  reportId: number;
  reportTitle: string;
  isReportUploaded: boolean;
  uploaded: {
    notes: number;
    images: number;
  };
  pending: {
    notes: number;
    images: number;
  };
  state: string;
};

export type ReportFormEventAttachments = {
  id: number,
  remote_id: string,
  profile_id: number,
  account_id: number,
  event_id: string;
  type: string;
  path: string;
  thumbnail_path: string,
  note_text: string;
  uploaded: number,
  attachment_id: string;
};

export type PersistedPatrolDetail = {
  remote_id: string,
  title: string,
  serial_number: string,
  start_latitude: number,
  start_longitude: number,
  start_time: number,
  icon_svg: number,
  created_at: number,
};

export type PatrolDetail = {
  remoteId: string,
  title: string,
  serialNumber: string,
  startLatitude: number,
  startLongitude: number,
  startTime: number,
  iconSVG: string
  startTimeFormatted: string,
  createdAt: number,
};

export type PersistedUserProfile = {
  id: number;
  remote_id: string;
  account_id: string;
  username: string;
  content_type: string;
  subject_id: string;
  pin: string;
  permissions: string,
};

export type UserInfo = {
  id: number,
  type: string,
  permissions: string,
};

export type PersistedUserSubject = {
  id: number;
  remote_id: string;
  account_id: string;
  name: string;
  content_type: string;
  isSelected: boolean;
};

export type Patrol = {
  id: number,
  typeId: string,
  type: string,
  display: string,
  coordinates: Position | null,
  status: PatrolResult,
  timestamp: string,
};

// Polygon Reducer

export type PolygonState = {
  past: Position[],
  current: Position[],
};

export type PolygonAction = {
  type: 'UNDO' | 'REDO' | 'ADD',
  value?: Position,
};

type TGeometry = 'polygon' | 'point';

export const Geometry: Record<TGeometry, string> = {
  polygon: 'polygon',
  point: 'point',
};

export type Size = {
  width: number,
  height: number,
};

export interface EventListItem {
  bgColor: string,
  defaultPriority: number,
  error: string,
  fgColor: string,
  hidden: boolean,
  icon: string,
  id: number,
  isDraft: boolean,
  labelText: string,
  remoteId: string,
  status: EventStatus,
  statusIcon: string,
  text: string,
  title: string,
  errorMsg?: string,
  hasErrorOnEvent: boolean,
}

export type SubjectGroupData = {
  count: number,
  isVisible: boolean,
  title: string,
  type: 'group',
  subjects: number[],
  id: string,
};

export type Subject = {
  id: number,
  name: string,
  type: 'subject',
  isVisible: boolean,
  icon: string,
  lastPosition: Position,
  lastPositionUpdate: string,
  isHidden: boolean,
};

export type SubjectGroupSyncItem = {
  name: string,
  remoteId: string,
  parentId?: string,
  parentLocalId?: string,
};

export type SubjectSyncItem = {
  iconSVG: string,
  isActive: string,
  lastPosition: string,
  lastPositionDate: string,
  name: string,
  remoteId: string,
  tracksAvailable: string,
  updatedAt: string,
};
