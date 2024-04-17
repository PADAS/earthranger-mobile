export const PATROL_TYPES_RESPONSE_MOCK_DATA = {
  data: [
    {
      default_priority: 200,
      display: 'Helicopter Patrol',
      icon_id: 'helicopter-patrol-icon',
      id: 'd0884b8c-4ecb-45da-841d-f2f8d6246abf',
      is_active: true,
      value: 'heli-p-new',
      ordernum: 1,
    },
  ],
  status: {
    code: 200,
    message: 'OK',
  },
};

export const PATROL_TRACKED_BY_RESPONSE_MOCK_DATA = {
  data: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    dependencies: {},
    description: '',
    properties: {
      leader: {
        enum: [
          {
            additional: {
              country: '',
              region: '',
              rgb: '',
              sex: 'male',
              tm_animal_id: '',
            },
            common_name: null,
            content_type: 'observations.subject',
            country: '',
            created_at: '2022-08-12T10:49:04.519622-07:00',
            id: '46535104-c874-47b9-9ffa-1518c0e01e6e',
            image_url: '/static/car.svg',
            is_active: true,
            name: 'car',
            region: '',
            sex: 'male',
            subject_subtype: 'car',
            subject_type: 'vehicle',
            tracks_available: false,
            updated_at: '2022-08-12T10:49:04.519641-07:00',
            user: null,
          },
        ],
        enum_ext: [
          {
            title: 'car',
            value: {
              additional: {
                country: '',
                region: '',
                rgb: '',
                sex: 'male',
                tm_animal_id: '',
              },
              common_name: null,
              content_type: 'observations.subject',
              country: '',
              created_at: '2022-08-12T10:49:04.519622-07:00',
              id: '46535104-c874-47b9-9ffa-1518c0e01e6e',
              image_url: '/static/car.svg',
              is_active: true,
              name: 'car',
              region: '',
              sex: 'male',
              subject_subtype: 'car',
              subject_type: 'vehicle',
              tracks_available: false,
              updated_at: '2022-08-12T10:49:04.519641-07:00',
              user: null,
            },
          },
        ],
        required: false,
        title: 'Leader',
        type: 'object',
      },
    },
    required: [],
    type: 'object',
  },
  status: {
    code: 200,
    message: 'OK',
  },
};
