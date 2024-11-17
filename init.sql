USE test_db;

create table user(
    id int primary key auto_increment,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    email varchar(100) not null
);

create table post(
    id int primary key auto_increment,
    title varchar(100) not null,
    description varchar(100) not null,
    user_id int not null,
    foreign key (user_id) references User(id)
);