// Internal Dependencies
import { PolygonAction, PolygonState } from '../types/types';

export const polygonReducer = (state: PolygonState, action?: PolygonAction) => {
  const { past, current } = state;

  if (action?.type === 'ADD' && action.value) {
    current.push(action.value);
    past.length = 0;
  }

  if (action?.type === 'REDO') {
    const previous = past.pop();

    if (previous) {
      current.push(previous);
    }
  }

  if (action?.type === 'UNDO') {
    past.push(current[current.length - 1]);
    current.pop();
  }

  return {
    past,
    current,
  };
};
