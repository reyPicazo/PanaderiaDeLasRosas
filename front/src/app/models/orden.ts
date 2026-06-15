import { Empleado } from './empleado';
import { Cliente } from './cliente';
import { Pan } from './pan';

export interface DetalleOrden {
    cantidad: number;
    pan: Pan;
}

export interface Orden {
    idOrden: number;
    fecha: string;
    empleado: Empleado;
    cliente: Cliente;
    estado: -1 | 0| 1; // -1: Cancelada, 0: Pendiente, 1: Completada
    detalles?: DetalleOrden[];
}
