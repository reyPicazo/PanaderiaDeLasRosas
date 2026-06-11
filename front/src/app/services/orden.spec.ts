import { Orden } from '../models/orden.model';

describe('Orden', () => {

  it('should create an object with Orden structure', () => {
    const orden: Orden = {
      // 👇 pon aquí las propiedades reales de tu modelo
      id: 1,
      quesadillas: 2,
      nuggets: 3,
      precioQ: 100,
      precioN: 100,
      total: 500
    };

    expect(orden).toBeDefined();
  });

});