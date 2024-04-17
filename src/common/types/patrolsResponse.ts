import { Subject } from './usersResponse';

export interface Status {
  code: number;
  message: string;
}

export interface PatrolType {
  default_priority: number;
  display: string;
  icon_id: string;
  id: string;
  is_active: boolean;
  value: string;
  ordernum: number;
}

export interface PatrolTypesResponse {
  data: PatrolType[];
  status: Status;
}

export interface TrackPatrolByResponse {
  data: {
    properties: {
      leader: {
        enum: Subject [],
      }
    }
  }
  status: Status,
}
