export interface SubjectGroupResponse {
  data: SubjectGroup[],
  status: Status,
}

export interface SubjectGroup {
  name: string,
  id: string,
  subgroups: SubjectGroup[],
  subjects: Subject[],
}

export interface Subject {
  content_type: string,
  id: string,
  name: string,
  subject_type: string,
  subject_subtype: string,
  common_name: string | null,
  additional: SubjectAdditional,
  created_at: string,
  updated_at: string,
  is_active: boolean,
  user: null,
  region: string,
  country: string,
  sex: string,
  tracks_available: boolean,
  image_url: string,
  last_position_status: SubjectLastPositionStatus,
  last_position_date: string,
  last_position: SubjectLastPosition,
  device_status_properties: SubjectDeviceStatusProperties[],
  url: string,
}

interface SubjectAdditional {
  rgb: string,
  sex: string,
  region: string,
  country: string,
  external_id: string,
  tm_animal_id: string,
  external_name: string,
}

interface SubjectLastPositionStatus {
  last_voice_call_start_at: string | null,
  radio_state_at: string | null,
  radio_state: string,
}

interface SubjectLastPosition {
  type: string,
  geometry: {
    type: string,
    coordinates: [number, number]
  },
  properties: {
    title: string,
    subject_type: string,
    subject_subtype: string,
    id: string,
    stroke: string,
    stroke_opacity: number,
    stroke_width: number,
    image: string,
    last_voice_call_start_at: string | null,
    location_requested_at: string | null,
    radio_state_at: string,
    radio_state: string,
    coordinateProperties: {
      time: string,
    },
    DateTime: string,
  }
}

interface SubjectDeviceStatusProperties {
  label: string,
  units: string,
  value: number,
}

interface Status {
  code: number;
  message: string;
}
