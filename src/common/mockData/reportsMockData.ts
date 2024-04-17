// Internal Dependencies
import { EventStatus } from '../enums/enums';
import { EventListItem } from '../types/types';

export const CATEGORIES_RESPONSE_MOCK_DATA = {
  data: [
    {
      id: '3c7f5dc3-dc33-4e7e-9de4-33b97b5fab03',
      value: 'sprinttesting',
      display: 'Sprint Testing',
      ordernum: -4,
      flag: 'user',
      account_id: undefined,
      profile_id: [],
    },
  ],
  status: {
    code: 200,
    message: 'OK',
  },
};

export const REPORT_TYPES_RESPONSE_MOCK_DATA = {
  data: [
    {
      id: 'd0884b8c-4ecb-45da-841d-f2f8d6246abf',
      icon: '',
      value: 'jtar',
      display: 'Jenae Test Auto Resolve',
      ordernum: -20,
      is_collection: false,
      readonly: false,
      category: {
        id: '3c7f5dc3-dc33-4e7e-9de4-33b97b5fab03',
        value: 'sprinttesting',
        display: 'Sprint Testing',
        is_active: true,
        ordernum: -4,
        flag: 'user',
        permissions: ['create', 'update', 'read', 'delete'],
      },
      icon_id: 'jtar',
      is_active: true,
      default_priority: 200,
      geometry_type: 'point',
      schema: 'schema',
      url: 'https://develop.pamdas.org/api/v1.0/activity/events/eventtypes/d0884b8c-4ecb-45da-841d-f2f8d6246abf',
      icon_svg: '',
    },
  ],
  status: {
    code: 200,
    message: 'OK',
  },
};

export const UPLOAD_FILE_RESPONSE_MOCK_DATA = {
  data: {
    status: {
      code: 201,
      message: 'Created',
    },
  },
};

export const POST_NOTE_RESPONSE_MOCK_DATA = {
  data: {
    status: {
      code: 201,
      message: 'Created',
    },
  },
};

export const FILE_MOCK_DATA = {
  uri: 'file://assets/assets/icons/ic-login-logo.png',
  type: 'image/png',
  name: 'image.png',
};

export const NOTE_MOCK_DATA = 'Note report';

export const REPORT_MOCK_DATA = {
  reportId: '3e7ac9a7-0f52-46fa-988c-93a684a6d32b',
};

export const PATROL_SEGMENT_EVENT_MOCK_DATA = {
  event_type: 'reptile',
  icon_id: 'reptiles_amphibians_rep',
  is_collection: false,
  location: {
    latitude: 61.53504,
    longitude: -166.09844,
  },
  priority: 100,
  reported_by: {
    content_type: 'observations.subject',
    id: '{subject id}',
  },
  time: '2023-02-28T10:45:50.056439',
  event_details: {},
};

export const POST_PATROL_SEGMENT_EVENT_RESPONSE_DATA = {
  data: {
    id: '201cc6f5-f962-46a3-99c6-a8249fa5a6fc',
    location: {
      latitude: 61.53504,
      longitude: -166.09844,
    },
    time: '2023-02-28T10:45:50.056439-08:00',
    end_time: null,
    serial_number: 190620,
    message: '',
    provenance: '',
    event_type: 'reptile',
    priority: 100,
    priority_label: 'Green',
    attributes: {},
    comment: null,
    title: null,
    notes: [],
    reported_by: {
      content_type: 'accounts.user',
      id: 'd265ec4a-7bf5-4a9c-93af-23541d4df3d7',
      name: 'dai2',
      subject_type: 'person',
      subject_subtype: 'ranger',
      common_name: null,
      additional: {},
      created_at: '2023-02-16T22:24:05.282373-08:00',
      updated_at: '2023-02-16T22:24:05.282395-08:00',
      is_active: true,
      tracks_available: false,
      image_url: '/static/ranger-black.svg',
    },
    state: 'new',
    event_details: {},
    contains: [],
    is_linked_to: [],
    is_contained_in: [],
    files: [],
    related_subjects: [],
    sort_at: '2023-03-02T11:16:27.333380-08:00',
    patrol_segments: [
      'a892fa94-6f31-4175-b1df-c89999bf6d34',
    ],
    geometry: null,
    updated_at: '2023-03-02T11:16:27.333380-08:00',
    created_at: '2023-03-02T11:16:27.334222-08:00',
    icon_id: 'reptiles_amphibians_rep',
    event_category: 'Favorite Icons',
    url: 'https://develop.pamdas.org/api/v1.0/activity/event/201cc6f5-f962-46a3-99c6-a8249fa5a6fc',
    image_url: 'https://develop.pamdas.org/static/sprite-src/reptiles_amphibians_rep.svg',
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          -166.09844,
          61.53504,
        ],
      },
      properties: {
        message: '',
        datetime: '2023-02-28T18:45:50.056439+00:00',
        image: 'https://develop.pamdas.org/static/sprite-src/reptiles_amphibians_rep.svg',
        icon: {
          iconUrl: 'https://develop.pamdas.org/static/sprite-src/reptiles_amphibians_rep.svg',
          iconSize: [
            25,
            25,
          ],
          iconAncor: [
            12,
            12,
          ],
          popupAncor: [
            0,
            -13,
          ],
          className: 'dot',
        },
      },
    },
    is_collection: false,
    updates: [
      {
        message: 'Added',
        time: '2023-03-02T19:16:27.357715+00:00',
        user: {
          username: 'hugoh',
          first_name: 'Hugo',
          last_name: 'Habel',
          id: '5c1d6c00-5d03-4c4b-b3f1-4128ada9f554',
          content_type: 'accounts.user',
        },
        type: 'add_event',
      },
    ],
    patrols: [
      '5887cf11-45fb-44cb-90ed-aa7e6967bc36',
    ],
  },
  status: {
    code: 201,
    message: 'Created',
  },
};

export const EVENTS_LIST_MOCK_DATA : EventListItem[] = [
  {
    bgColor: '#DDE8F8',
    defaultPriority: 0,
    error: '',
    fgColor: '#0056C7',
    hidden: false,
    icon: '',
    id: 1,
    isDraft: true,
    labelText: 'Draft',
    remoteId: '',
    status: EventStatus.draft,
    statusIcon: 'editIcon',
    text: 'Edited 2024 Feb 29, 16:12',
    title: 'All Posts',
  },
  {
    bgColor: '#DDE8F8',
    defaultPriority: 0,
    error: '',
    fgColor: '#0056C7',
    hidden: false,
    icon: '',
    id: 2,
    isDraft: true,
    labelText: 'Draft',
    remoteId: '',
    status: EventStatus.draft,
    statusIcon: 'editIcon',
    text: 'Edited 2024 Mar 1, 15:00',
    title: 'Rainfall',
  },
  {
    bgColor: '#F5F7F3',
    defaultPriority: 0,
    error: '',
    fgColor: '#0056C7',
    hidden: false,
    icon: '',
    id: 3,
    isDraft: false,
    labelText: 'Synced',
    remoteId: '',
    status: EventStatus.submitted,
    statusIcon: 'submittedIcon',
    text: 'Submitted 2024 Mar 5, 12:55',
    title: 'Geofence Break',
  },
];
