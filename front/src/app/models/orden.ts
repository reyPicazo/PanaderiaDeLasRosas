import { Empleado } from './empleado';
import { Cliente } from './cliente';

export interface Orden {
    idOrden: number;
    fecha: string;
    empleado: Empleado;
    cliente: Cliente;
    estado: -1 | 0| 1; // -1: Cancelada, 0: Pendiente, 1: Completada
}
