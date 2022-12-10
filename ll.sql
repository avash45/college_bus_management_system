
CREATE TABLE ADMIN
(
  admin_id INT NOT NULL,
  admin_name VARCHAR(20) NOT NULL,
  admin_password VARCHAR(20) NOT NULL,
  admin_email VARCHAR(20) NOT NULL,
  admin_phone_no INT NOT NULL,
  PRIMARY KEY (admin_id)
);

CREATE TABLE PASS
(
  fees INT NOT NULL,
  pass_id INT NOT NULL,
  issued_date DATE NOT NULL,
  PRIMARY KEY (pass_id)
);

CREATE TABLE TRANSACTION
(
  transaction_id INT NOT NULL,
  payment_mode VARCHAR(20) NOT NULL,
  payment_status INT NOT NULL,
  admin_id INT NOT NULL,
  PRIMARY KEY (transaction_id),
  FOREIGN KEY (admin_id) REFERENCES ADMIN(admin_id)
);

CREATE TABLE ROUTES
(
  location VARCHAR(20) NOT NULL,
  route_no INT NOT NULL,
  distance FLOAT NOT NULL,
  PRIMARY KEY (route_no)
);

CREATE TABLE BUS
(
  bus_driver VARCHAR(20) NOT NULL,
  bus_no INT NOT NULL,
  bus_model VARCHAR(20) NOT NULL,
  bus_capacity INT NOT NULL,
  route_no INT NOT NULL,
  admin_id INT NOT NULL,
  PRIMARY KEY (bus_no),
  FOREIGN KEY (route_no) REFERENCES ROUTES(route_no),
  FOREIGN KEY (admin_id) REFERENCES ADMIN(admin_id)
);

CREATE TABLE PASSENGER
(
  address VARCHAR(40) NOT NULL,
  passenger_id INT NOT NULL,
  Passenger_name VARCHAR(20) NOT NULL,
  Phone_no VARCHAR(20) NOT NULL,
  email VARCHAR(20) NOT NULL,
  designation VARCHAR(20) NOT NULL,
  passenger_password VARCHAR(20) NOT NULL,
  pass_id INT NOT NULL,
  bus_no INT NOT NULL,
  PRIMARY KEY (passenger_id),
  FOREIGN KEY (pass_id) REFERENCES PASS(pass_id),
  FOREIGN KEY (bus_no) REFERENCES BUS(bus_no)
);
