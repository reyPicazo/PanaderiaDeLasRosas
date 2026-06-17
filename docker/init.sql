CREATE DATABASE IF NOT EXISTS panaderia;
USE panaderia;

-- ─────────────────────────────────────────
--  TABLAS
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Cliente (
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre    VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono  VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Empleado (
    idEmpleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    direccion  VARCHAR(200),
    telefono   VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Pan (
    idPan  INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Orden (
    idOrden    INT AUTO_INCREMENT PRIMARY KEY,
    fecha      DATE NOT NULL,
    estado     TINYINT NOT NULL DEFAULT 0,   -- 0=pendiente, 1=entregada, 2=cancelada
    ClienteId  INT NOT NULL,
    EmpleadoId INT NOT NULL,
    FOREIGN KEY (ClienteId)  REFERENCES Cliente(idCliente),
    FOREIGN KEY (EmpleadoId) REFERENCES Empleado(idEmpleado)
);

CREATE TABLE IF NOT EXISTS Detalle_Orden (
    OrdenidOrden INT NOT NULL,
    PanidPan     INT NOT NULL,
    cantidad     INT NOT NULL DEFAULT 1,
    PRIMARY KEY (OrdenidOrden, PanidPan),
    FOREIGN KEY (OrdenidOrden) REFERENCES Orden(idOrden) ON DELETE CASCADE,
    FOREIGN KEY (PanidPan)     REFERENCES Pan(idPan)
);

-- ─────────────────────────────────────────
--  DATOS DE PRUEBA
-- ─────────────────────────────────────────

INSERT INTO Cliente (nombre, direccion, telefono) VALUES
    ('Ana',      'Calle Hidalgo 12, Zacatecas',   '4921001001'),
    ('Luis',    'Av. Juarez 45, Guadalupe',      '4921002002'),
    ('Maria',  'Blvd. Lopez Mateos 8, Fresnillo','4921003003'),
    ('Carlos',  'Calle Morelos 77, Zacatecas',   '4921004004'),
    ('Sofia ',   'Privada del Sol 3, Jerez',      '4921005005');

INSERT INTO Empleado (nombre, direccion, telefono) VALUES
    ('Roberto',   'Calle 5 de Mayo 22, Zacatecas', '4929001001'),
    ('Gabriela Lara',   'Av. Universidad 10, Zacatecas', '4929002002'),
    ('Ernesto',    'Calle Allende 55, Loreto',      '4929003003'),
    ('Rey',    'Indiana Jones 55, Egipto',      '44978912345'),
    ('cucho',    'Indiana Jones 55, Egipto',      '44978912345');

INSERT INTO Pan (nombre, precio) VALUES
    ('Concha',           8.50),
    ('Cuerno',           9.00),
    ('Polvoron',         7.00),
    ('Beso',             6.50),
    ('Orejas',           7.50),
    ('Pan de nata',      8.00),
    ('Quesito',        12.00),
    ('Rosca', 10.00),
    ('Dona',           9.50);

INSERT INTO Orden (fecha, estado, ClienteId, EmpleadoId) VALUES
    ('2026-06-01', 1, 1, 1),   -- entregada
    ('2026-06-03', 1, 2, 2),   -- entregada
    ('2026-06-08', -1, 3, 1),   -- pendiente
    ('2026-06-10', 1, 4, 3),   -- pendiente
    ('2026-06-12', -1, 5, 2),   -- cancelada
    ('2026-06-14', 1, 1, 3);   -- pendiente

INSERT INTO Detalle_Orden (OrdenidOrden, PanidPan, cantidad) VALUES
    (1, 1, 6), 
    (1, 3, 4),  
    (2, 2, 3), 
    (2, 7, 2), 
    (3, 5, 5),  
    (3, 8, 1),  
    (4, 4, 8),   
    (4, 9, 3),  
    (5, 6, 4),  
    (6, 1, 12), 
    (6, 2, 6);  