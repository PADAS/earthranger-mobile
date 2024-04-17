// Internal Dependencies
import { Status } from './reportsResponse';

export interface UserResponse {
  data: User;
  status: Status;
}

export interface User {
  accepted_eula: boolean;
  date_joined: string;
  email: string;
  first_name: string;
  id: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
  last_name: string;
  role: string;
  username: string;
  pin?: string;
  subject: {
    id: string;
  };
  permissions: any,
}

export interface Subject {
  id: string;
  name: string;
  content_type: string;
}

export interface UserProfilesResponse {
  data: User[],
  status: {
    code: number;
    message: string;
  };
}
