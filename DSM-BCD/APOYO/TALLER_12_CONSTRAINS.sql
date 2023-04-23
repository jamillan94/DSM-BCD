SET search_path= ingenieria;

create table a (id_a int primary key check(id_a>=0),
			   aa int not null check(aa>=0)
			   );
			  
create table b (id_b int primary key check(id_b>=0),
			   bb int not null check(bb>=0)
			   );
			   
create table c (id_c int primary key check(id_c>=0),
			   cc int not null check(cc>=0)
			   );
			   
create table r1 (id_a int references a(id_a),
			     id_b int references b(id_b),
				 rr1 int check(rr1>=0),
				primary key (id_a,id_b,rr1)
			   );		
create table r2 (id_b int references b(id_b) ,
			   id_c int references c(id_c),
				rr2 int check(rr2>=0),
				 primary key (id_b,id_c,rr2)
			   );	
			   
create table r3 ( rr1 int,
				  rr2 int,
				  id_a int,
				  id_b int,
				  id_c int,
				  primary key (id_a,id_b,id_c,rr1,rr2),
				  foreign key (id_a,id_b,rr1)references r1(id_a,id_b,rr1),
				  foreign key (id_b,id_c,rr3)references r2(id_b,id_c,rr2)
				);