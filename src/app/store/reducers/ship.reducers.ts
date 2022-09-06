import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { IShip } from '../../interfaces/ships';
import { ShipActionsTypes, ShipActionsUnion } from '../actions/ship.actions';
import { LaunchActionsTypes } from '../actions/launch.actions';

export interface doubleLoadShips extends Loadable {
  entities: IShip[];
}

export function createDefaultShip(): doubleLoadShips {
  return {
    ...createDefaultLoadable(),
    entities: [],
  };
}

function baseShipReducer(state: doubleLoadShips = createDefaultShip(), action: ShipActionsUnion): doubleLoadShips {
  switch (action.type) {
    case ShipActionsTypes.LoadSuccess:
      return {
        ...state,
        entities: action.payload.entities,
      };
    default:
      return state;
  }
}

export function shipReducer(state: doubleLoadShips, action: ShipActionsUnion): doubleLoadShips {
  return withLoadable(baseShipReducer, {
    loadingActionType: ShipActionsTypes.Load,
    successActionType: ShipActionsTypes.LoadSuccess,
    errorActionType: ShipActionsTypes.LoadError,
  })(state, action);
}
