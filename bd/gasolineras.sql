CREATE DATABASE IF NOT EXISTS geoportal;

USE geoportal;

CREATE TABLE gasolineras(
	id int(11) not null auto_increment,
    nombre_estacion varchar(45) not null,
    direccion_estacion varchar(45) default null,
    telefono_estacion varchar(20) default null,
    latitud_estacion varchar(20) default null,
    longitud_estacion varchar(20) default null,
    primary key(id)
);
describe gasolineras;

insert into gasolineras values
	(1,'Estacion el Prado', 'Carrera 20 # 25 41', '2242612','4.087963600743078' ,'-76.2016288673446' ),
    (2,'Los profesionales', 'Calle 34 # 31 77', null, '4.078289952262172', '-76.19626833661565'),
    (3,'EDS El terminal', 'Carrera 20 # 27A 28', '2249998', '4.0858660962889415', '-76.20184074802744'),
    (4,'Terpel Tulua', 'Via RioFrio', '3183162628', '4.088578923875464', '-76.21580742314305'),
    (5,'EDS Texaco 26', 'Calle 27 # 30 01', '2247249', '4.084684161056595', '-76.19467417127404'),
    (6,'Gazel', 'Carrera 27A # 40 39', '2242707', '4.070921145345564', '-76.19732322987656'),
    (7,'Estacion de servicio Texaco', 'Calle 32 Carrera 40 Esquina', null, '4.078295545776264', '-76.1890323377809'),
    (8,'Terpel Tulua', null, null, '4.085371307430105', '-76.18630419002551'),
    (9,'EDS Terpel Entre Rios', 'Carrera 30 # 163', null, '4.092596434077139', '-76.19015969231661'),
    (10,'Estacion de Servicio La Ribera', 'Calle 25 Carrera 40 Esquina', '2248263', '4.085628145163381', '-76.18630419002551');
    
select * from gasolineras;