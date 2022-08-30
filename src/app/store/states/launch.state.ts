import { ILaunches } from '../../interfaces/launches';

export const LAUNCH_FEATURE_KEY = 'launch';

export interface LaunchState {
  launch: ILaunches[];
  loaded: boolean;
  error?: string | null;
}

export const initialLaunchState: LaunchState = {
  launch: [],
  loaded: false,
  error: null,
};
