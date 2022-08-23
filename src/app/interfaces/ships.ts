export interface IShip {
  ship_id: string;
  ship_name: string;
  ship_model?: string;
  ship_type: string;
  roles: string[];
  active: boolean;
  imo: number;
  mmsi: number;
  abs: number;
  class: number;
  weight_lbs: number;
  weight_kg: number;
  year_built: number;
  home_port: string;
  status: string;
  speed_kn: number;
  course_deg?: number;
  position: IPosition;
  successful_landings?: string;
  attempted_landings: string;
  missions: IMissions[];
  url: string;
  image: string;
}

export interface IPosition {
  latitude: number;
  longitude: number;
}

export interface IMissions {
  name: string;
  flight: number;
}
