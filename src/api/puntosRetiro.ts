import type { PickupPoint } from '../types';
import { peticion } from './cliente';

export const listarPuntosRetiro = (): Promise<PickupPoint[]> => peticion<PickupPoint[]>('/api/puntos-retiro');
