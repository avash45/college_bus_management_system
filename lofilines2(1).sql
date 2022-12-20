-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 20, 2022 at 10:36 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lofilines2`
--

-- --------------------------------------------------------

--
-- Table structure for table `ADMIN`
--

CREATE TABLE `ADMIN` (
  `admin_id` int(11) NOT NULL,
  `admin_name` varchar(20) NOT NULL,
  `admin_password` varchar(20) NOT NULL,
  `admin_email` varchar(40) NOT NULL,
  `admin_phone_no` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ADMIN`
--

INSERT INTO `ADMIN` (`admin_id`, `admin_name`, `admin_password`, `admin_email`, `admin_phone_no`) VALUES
(0, 'admin', 'e715cd86', 'lofilinesnmamit0@gmail.com', '9686104291');

-- --------------------------------------------------------

--
-- Table structure for table `BUS`
--

CREATE TABLE `BUS` (
  `bus_driver` varchar(20) NOT NULL,
  `bus_no` int(11) NOT NULL,
  `bus_model` varchar(20) NOT NULL,
  `bus_capacity` int(11) NOT NULL,
  `route_no` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `BUS`
--

INSERT INTO `BUS` (`bus_driver`, `bus_no`, `bus_model`, `bus_capacity`, `route_no`, `admin_id`) VALUES
('Rameshanna', 7, 'Tata', 60, 1, 0),
('Sureshanna', 8, 'Ashok', 65, 2, 0),
('lokesh', 9, 'volvo', 10, 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `PASS`
--

CREATE TABLE `PASS` (
  `fees` int(11) NOT NULL,
  `pass_id` int(11) NOT NULL,
  `payment_status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `PASS`
--

INSERT INTO `PASS` (`fees`, `pass_id`, `payment_status`) VALUES
(20000, 10020, 0),
(24000, 10021, 1);

-- --------------------------------------------------------

--
-- Table structure for table `PASSENGER`
--

CREATE TABLE `PASSENGER` (
  `address` varchar(40) NOT NULL,
  `usn` varchar(11) NOT NULL,
  `Passenger_name` varchar(20) NOT NULL,
  `Phone_no` varchar(20) NOT NULL,
  `passenger_email` varchar(40) NOT NULL,
  `designation` varchar(20) NOT NULL,
  `passenger_password` varchar(20) NOT NULL,
  `pass_id` int(11) NOT NULL,
  `bus_no` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `PASSENGER`
--

INSERT INTO `PASSENGER` (`address`, `usn`, `Passenger_name`, `Phone_no`, `passenger_email`, `designation`, `passenger_password`, `pass_id`, `bus_no`) VALUES
('home', '4nm', 'av', '123', 'sriharipadma2767@gmail.com', 'faculty', 'av', 10021, 7),
('My home, Surathkal', '4nm20cs044', 'Avaneesh', '9686104291', '4nm20cs044@nmamit.in', 'student', 'av', 10020, 8);

-- --------------------------------------------------------

--
-- Table structure for table `ROUTES`
--

CREATE TABLE `ROUTES` (
  `location` varchar(40) NOT NULL,
  `route_no` int(11) NOT NULL,
  `distance` float NOT NULL,
  `fees` int(11) NOT NULL,
  `link` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ROUTES`
--

INSERT INTO `ROUTES` (`location`, `route_no`, `distance`, `fees`, `link`) VALUES
('Bajpe-Kinnigoli', 1, 39.2, 24000, 'https://rb.gy/l13mso'),
('Mangalore-Surathkal', 2, 44, 20000, 'https://rb.gy/z8zsum'),
('Udupi- Belman', 3, 25, 18000, 'https://rb.gy/wiae8h');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ADMIN`
--
ALTER TABLE `ADMIN`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `BUS`
--
ALTER TABLE `BUS`
  ADD PRIMARY KEY (`bus_no`),
  ADD KEY `route_no` (`route_no`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `PASS`
--
ALTER TABLE `PASS`
  ADD PRIMARY KEY (`pass_id`);

--
-- Indexes for table `PASSENGER`
--
ALTER TABLE `PASSENGER`
  ADD PRIMARY KEY (`usn`),
  ADD KEY `pass_id` (`pass_id`),
  ADD KEY `bus_no` (`bus_no`);

--
-- Indexes for table `ROUTES`
--
ALTER TABLE `ROUTES`
  ADD PRIMARY KEY (`route_no`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `BUS`
--
ALTER TABLE `BUS`
  ADD CONSTRAINT `BUS_ibfk_1` FOREIGN KEY (`route_no`) REFERENCES `ROUTES` (`route_no`),
  ADD CONSTRAINT `BUS_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `ADMIN` (`admin_id`);

--
-- Constraints for table `PASSENGER`
--
ALTER TABLE `PASSENGER`
  ADD CONSTRAINT `PASSENGER_ibfk_1` FOREIGN KEY (`pass_id`) REFERENCES `PASS` (`pass_id`),
  ADD CONSTRAINT `PASSENGER_ibfk_2` FOREIGN KEY (`bus_no`) REFERENCES `BUS` (`bus_no`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
