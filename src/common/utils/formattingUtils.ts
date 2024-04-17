// Internal Dependencies
import { Position } from '../types/types';

export const formatCoordinates = (position: Position) => `${position[0].toFixed(6)}°, ${position[1].toFixed(6)}°`;
