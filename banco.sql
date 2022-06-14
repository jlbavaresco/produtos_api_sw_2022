create table produtos (
codigo serial not null primary key, 
nome varchar(50) not null, 
preco decimal (10,2) not null, 
estoque integer not null);

insert into produtos (nome, preco, estoque) values ('Monitor 15', 400.00, 10),
('Mouse sem fio', 200.00, 20);