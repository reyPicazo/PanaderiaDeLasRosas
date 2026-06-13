import { Pan } from './pan';

export interface DetalleOrden {
    OrdenidOrden: number;
    cantidad: number;
    
    pan: Pan;
}