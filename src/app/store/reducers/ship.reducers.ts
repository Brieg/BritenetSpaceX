import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { ShipActionsTypes, ShipActionsUnion } from '../actions/ship.actions';
import { IShip } from '../../interfaces/ships';

export interface doubleLoadShips extends Loadable {
  entities: IShip[];
}

export function createDefaultLaunch(): doubleLoadShips {
  return {
    ...createDefaultLoadable(),
    entities: [],
  };
}

function baseShipReducer(state: doubleLoadShips = createDefaultLaunch(), action: ShipActionsUnion): doubleLoadShips {
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
