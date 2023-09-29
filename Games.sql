create table sudoku(
	id serial primary key,
	member_id int not null,
	minute int not null,
	second int not null,
	error int not null,
	foreign key (id) references member(id)
);

select * from sudoku

drop table sudoku

create table session( 
	id SERIAL PRIMARY KEY,        
  	session_from INT NOT NULL,     
	session_to INT NOT NULL,     
	game_name VARCHAR(15) NOT NULL,     
	choice VARCHAR(6) NOT NULL,
	is_Played BOOLEAN DEFAULT false,
	FOREIGN KEY(session_from) REFERENCES member(id),    
	FOREIGN KEY(session_to) REFERENCES member(id)
);

select * from session

DROP TABLE session

truncate table session

create table member( 
	id SERIAL PRIMARY KEY,   
  	name VARCHAR(50) NOT NULL,  
	email VARCHAR(50) NOT NULL,
	password VARCHAR(50) NOT NULL
); 

select * from member

DROP TABLE member

truncate table member
