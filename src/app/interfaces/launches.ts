export interface ILaunches {
  flight_number: number;
  mission_name: string;
  mission_id: string[];
  launch_year: number;
  launch_date_unix: number;
  launch_date_utc: Date;
  launch_date_local: Date;
  is_tentative: boolean;
  tentative_max_precision: string;
  tbd: boolean;
  launch_window: number;
  rocket: IRocket;
  ships: string[];
  telemetry?: {
    flight_club: string;
  };
  launch_site: {
    site_id: string;
    site_name: string;
    site_name_long: string;
  };
  launch_success: boolean;
  links: ILinks;
  details: string;
  upcoming: boolean;
  static_fire_date_utc: Date;
  static_fire_date_unix: Date;
  timeline?: {
    webcast_liftoff: number;
  };
  crew?: boolean;
  last_date_update: Date;
  last_ll_launch_date?: Date;
  last_ll_update?: Date;
  last_wiki_launch_date?: Date;
  last_wiki_revision?: string;
  last_wiki_update?: Date;
  launch_date_source?: string;
}

interface IRocket {
  rocket_id: string;
  rocket_name: string;
  rocket_type: string;
  first_stage: IFirst_stage;
  second_stage?: ISecond_stage;
  fairings?: {
    reused: boolean;
    recovery_attempt: boolean;
    recovered?: boolean;
    ship?: string;
  };
}

interface IFirst_stage {
  cores: [
    core_serial: string,
    flight: number,
    block: number,
    gridfins: boolean,
    legs: boolean,
    reused: boolean,
    land_success: boolean,
    landing_intent: boolean,
    landing_type: string,
    landing_vehicle: string
  ];
}

interface ISecond_stage {
  block: number;
  payloads: [
    {
      payload_id: string;
      norad_id: number[];
      reused: boolean;
      customers: string[];
      nationality: string;
      manufacturer: string;
      payload_type: string;
      payload_mass_kg: number;
      payload_mass_lbs: number;
      orbit: string;
      orbit_params: IOrbit_params;
    }
  ];
}

interface IOrbit_params {
  reference_system: string;
  regime: string;
  longitude?: number;
  semi_major_axis_km: number;
  eccentricity: number;
  periapsis_km: number;
  apoapsis_km: number;
  inclination_deg: number;
  period_min: number;
  lifespan_years: string;
  epoch: Date;
  mean_motion: number;
  raan: number;
  arg_of_pericenter: number;
  mean_anomaly: number;
}

interface ILinks {
  mission_patch: string;
  mission_patch_small: string;
  reddit_campaign?: string;
  reddit_launch?: string;
  reddit_recovery?: string;
  reddit_media?: string;
  presskit?: string;
  article_link?: string;
  wikipedia?: string;
  video_link?: string;
  youtube_id?: string;
  flickr_images?: string[];
}
