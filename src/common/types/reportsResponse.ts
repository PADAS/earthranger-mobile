export interface ReportCategoriesResponse {
  data: Category[];
  status: Status;
}

export interface Category {
  id: string;
  value: string;
  display: string;
  ordernum: number;
  flag?: string;
  account_id: string | undefined;
  profile_id: number[];
}

export interface ReportTypesResponse {
  data: Type[];
  status: Status;
}

export interface ReportTypeSchemaResponse {
  data: string;
  status: Status;
}

export interface Type {
  id: string;
  icon: string;
  value: string;
  display: string;
  ordernum: number;
  is_collection: boolean;
  readonly?: boolean;
  category: Category;
  icon_id: string;
  is_active: boolean;
  default_priority: number;
  geometry_type: string;
  schema: string;
  url: string;
  icon_svg: string;
}

export interface Status {
  code: number;
  message: string;
}

export interface EventCategory {
  id: number;
  remote_id: string;
  value: string;
  display: string;
}

export interface EventType {
  id: number;
  display: string;
  icon_svg: string;
  default_priority: string;
}

export interface Note {
  id: number,
  text: string,
}

export interface WithChildren {
  children: any;
}

export interface UploadedReport {
  id: number;
}
