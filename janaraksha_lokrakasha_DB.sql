-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2021 at 10:11 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `janaraksha_lokrakasha`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `name` varchar(250) DEFAULT NULL,
  `country` varchar(150) DEFAULT NULL,
  `state` varchar(150) DEFAULT NULL,
  `city` varchar(150) DEFAULT NULL,
  `thaluk` varchar(100) DEFAULT NULL,
  `panchayath` varchar(200) DEFAULT NULL,
  `ward` varchar(200) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(200) DEFAULT NULL,
  `squard` varchar(100) DEFAULT NULL,
  `referid` varchar(50) NOT NULL,
  `bank` varchar(250) DEFAULT NULL,
  `account` varchar(250) DEFAULT NULL,
  `ifsc` varchar(250) DEFAULT NULL,
  `user_type` varchar(20) DEFAULT 'member',
  `memberid` varchar(50) DEFAULT NULL,
  `upline_one_active` varchar(50) DEFAULT NULL,
  `upline_two_active` varchar(50) DEFAULT NULL,
  `referer_active` varchar(50) DEFAULT NULL,
  `google_pay` varchar(100) DEFAULT NULL,
  `phone_pay` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `name`, `country`, `state`, `city`, `thaluk`, `panchayath`, `ward`, `password`, `email`, `phone`, `squard`, `referid`, `bank`, `account`, `ifsc`, `user_type`, `memberid`, `upline_one_active`, `upline_two_active`, `referer_active`, `google_pay`, `phone_pay`) VALUES
(1, 'Pradeeppt', 'Pradeep kumar  ', 'India', 'Kerala', 'Trichur', 'ollur', 'panencherry', '1', '123', 'write2mepradeep@gmail.com', '8281582526', '1', '8281582526', 'H D F C', '123456789', 'HDFC000001', 'member', 'JAN39610', NULL, NULL, NULL, '1234567890', '1234567895');

-- --------------------------------------------------------

--
-- Table structure for table `aloted_request`
--

CREATE TABLE `aloted_request` (
  `id` int(9) NOT NULL,
  `r_id` int(9) NOT NULL,
  `u_id` int(9) NOT NULL,
  `payment` varchar(3) DEFAULT NULL COMMENT 'payment done or not(Y or N)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `aloted_request`
--

INSERT INTO `aloted_request` (`id`, `r_id`, `u_id`, `payment`) VALUES
(71, 18, 84, NULL),
(72, 18, 85, NULL),
(73, 20, 84, NULL),
(74, 20, 85, NULL),
(75, 21, 84, NULL),
(76, 22, 92, NULL),
(77, 22, 85, NULL),
(78, 22, 84, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `approval`
--

CREATE TABLE `approval` (
  `id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `r_id` int(15) DEFAULT NULL,
  `authority_id` int(50) NOT NULL,
  `dis` varchar(50) NOT NULL,
  `user_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `approval`
--

INSERT INTO `approval` (`id`, `status`, `r_id`, `authority_id`, `dis`, `user_type`) VALUES
(36, 'approved', 18, 38, '8', 'cl'),
(37, 'approved', 20, 38, '8', 'cl'),
(38, 'approved', 19, 38, '8', 'cl'),
(39, 'approved', 21, 38, '8', 'cl'),
(40, 'approved', 22, 38, '8', 'cl');

-- --------------------------------------------------------

--
-- Table structure for table `family_members`
--

CREATE TABLE `family_members` (
  `id` int(9) NOT NULL,
  `member_name` varchar(200) NOT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `gender` varchar(5) DEFAULT NULL,
  `lok_family_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `fund_statement`
--

CREATE TABLE `fund_statement` (
  `id` int(50) NOT NULL,
  `samithy_id` int(9) NOT NULL,
  `u_id` int(9) NOT NULL,
  `description` varchar(250) NOT NULL,
  `amount` float DEFAULT NULL COMMENT 'payment done or not(Y or N)',
  `deposit_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `fund_statement`
--

INSERT INTO `fund_statement` (`id`, `samithy_id`, `u_id`, `description`, `amount`, `deposit_date`) VALUES
(17, 2147483647, 86, 'regfee', NULL, NULL),
(18, 2147483647, 87, 'regfee', NULL, NULL),
(19, 2147483647, 88, 'regfee', NULL, NULL),
(20, 2147483647, 89, 'regfee', NULL, NULL),
(21, 2147483647, 90, 'regfee', NULL, NULL),
(22, 84, 0, 'sent', 100, NULL),
(23, 85, 0, 'sent', 10, NULL),
(24, 2147483647, 93, 'regfee', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `fund_transfer`
--

CREATE TABLE `fund_transfer` (
  `id` int(9) NOT NULL,
  `user_id` int(9) NOT NULL,
  `for_member` varchar(100) DEFAULT NULL,
  `amount` float NOT NULL,
  `deposit_slip` varchar(200) DEFAULT NULL,
  `issue_date` date NOT NULL,
  `ref_no` varchar(50) DEFAULT NULL,
  `entry_date` date DEFAULT NULL,
  `leader1` varchar(10) DEFAULT NULL,
  `leader2` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `gp_members`
--

CREATE TABLE `gp_members` (
  `sno` int(100) NOT NULL,
  `gp_code` varchar(100) NOT NULL,
  `gp_name` varchar(100) DEFAULT NULL,
  `gp_member_name` varchar(100) DEFAULT NULL,
  `gp_member_id` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gp_members`
--

INSERT INTO `gp_members` (`sno`, `gp_code`, `gp_name`, `gp_member_name`, `gp_member_id`) VALUES
(8, '8235323898', NULL, NULL, '5426184241');

-- --------------------------------------------------------

--
-- Table structure for table `group_form`
--

CREATE TABLE `group_form` (
  `gp_id` int(100) NOT NULL,
  `gp_name` varchar(100) NOT NULL,
  `gp_admin_id` varchar(100) DEFAULT NULL,
  `gp_ad_name` varchar(100) DEFAULT NULL,
  `gp_code` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `group_form`
--

INSERT INTO `group_form` (`gp_id`, `gp_name`, `gp_admin_id`, `gp_ad_name`, `gp_code`) VALUES
(4, 'group1', NULL, NULL, '8235323898');

-- --------------------------------------------------------

--
-- Table structure for table `inter_communication`
--

CREATE TABLE `inter_communication` (
  `id` int(9) NOT NULL,
  `title` varchar(250) NOT NULL,
  `message` text NOT NULL,
  `proof` varchar(200) NOT NULL,
  `msg_from_id` int(9) NOT NULL,
  `msg_to_id` int(9) NOT NULL,
  `view_status` varchar(3) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `leaders`
--

CREATE TABLE `leaders` (
  `id` int(9) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `position` varchar(50) NOT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `country` varchar(200) DEFAULT NULL,
  `state` varchar(200) DEFAULT NULL,
  `district` varchar(200) DEFAULT NULL,
  `thaluk` varchar(200) DEFAULT NULL,
  `panchayath` varchar(200) DEFAULT NULL,
  `ward` varchar(200) DEFAULT NULL,
  `squard` varchar(200) DEFAULT NULL,
  `lok_mem_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `leaders`
--

INSERT INTO `leaders` (`id`, `username`, `password`, `position`, `phone`, `country`, `state`, `district`, `thaluk`, `panchayath`, `ward`, `squard`, `lok_mem_id`) VALUES
(1, 'tima', '123456', 'state_lead', NULL, 'India', 'Kerala', '', '', '', '', '', 'JAN39610'),
(1, 'tima', '123456', 'state_lead', NULL, 'India', 'Kerala', '', '', '', '', '', 'JAN39610');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `u_id` int(15) NOT NULL,
  `first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `request` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `amt` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `paid_date` date NOT NULL,
  `image` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `u_id`, `first_name`, `request`, `amt`, `paid_date`, `image`, `created_at`, `updated_at`) VALUES
(22, 85, 'member2', '84', '100', '2021-09-21', '1fb471c4-36fc-4469-a11a-24cdf23b3e2f.png', '', ''),
(23, 85, 'member2', '85', '10', '2021-09-14', '5aa68686-1a8d-49df-b80b-0aee18925d93.png', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `proof_photos`
--

CREATE TABLE `proof_photos` (
  `id` int(11) NOT NULL,
  `u_id` int(9) DEFAULT NULL,
  `image` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `proof_photos`
--

INSERT INTO `proof_photos` (`id`, `u_id`, `image`) VALUES
(5, 91, '1632853180268-bezkoder-home.PNG');

-- --------------------------------------------------------

--
-- Table structure for table `registration`
--

CREATE TABLE `registration` (
  `r_id` int(50) NOT NULL,
  `r_ref` varchar(10) NOT NULL,
  `r_fname` varchar(50) NOT NULL,
  `r_lname` varchar(50) NOT NULL,
  `r_gender` varchar(10) NOT NULL,
  `r_address` varchar(50) NOT NULL,
  `r_dob` date NOT NULL,
  `r_pno` int(10) NOT NULL,
  `r_emailid` varchar(50) NOT NULL,
  `r_ward` varchar(50) NOT NULL,
  `r_pan` varchar(50) NOT NULL,
  `r_taluk` varchar(50) NOT NULL,
  `r_dis` varchar(50) NOT NULL,
  `r_state` varchar(50) NOT NULL,
  `r_pin` int(10) NOT NULL,
  `r_bankno` varchar(50) NOT NULL,
  `r_bankholdername` varchar(50) NOT NULL,
  `r_bankifsc` varchar(50) NOT NULL,
  `r_bankdetails` varchar(50) NOT NULL,
  `r_uname` varchar(50) NOT NULL,
  `r_pass` varchar(100) NOT NULL,
  `r_cpass` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `request_photos`
--

CREATE TABLE `request_photos` (
  `id` int(11) NOT NULL,
  `r_id` int(9) DEFAULT NULL,
  `image` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `request_photos`
--

INSERT INTO `request_photos` (`id`, `r_id`, `image`) VALUES
(47, 18, '1632852156701-bezkoder-a1.PNG'),
(48, 19, '1632852198430-bezkoder-a2.PNG'),
(49, 20, '1632852367123-bezkoder-a3.PNG'),
(50, 21, '1632852396106-bezkoder-a4.PNG'),
(51, 22, '1632895901222-bezkoder-IMG-20200906-WA0065.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `req_need`
--

CREATE TABLE `req_need` (
  `r_id` int(15) NOT NULL,
  `memid` varchar(100) NOT NULL,
  `bac` varchar(100) NOT NULL,
  `title` varchar(50) NOT NULL,
  `need` varchar(50) DEFAULT NULL,
  `dis` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `googlepay` varchar(50) DEFAULT NULL,
  `phonepe` varchar(50) DEFAULT NULL,
  `paytm` varchar(50) DEFAULT NULL,
  `u_id` int(50) NOT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `req_need`
--

INSERT INTO `req_need` (`r_id`, `memid`, `bac`, `title`, `need`, `dis`, `state`, `googlepay`, `phonepe`, `paytm`, `u_id`, `status`) VALUES
(18, '2928731118', '2222', 'member1', 'member1', NULL, NULL, 'y', 'y', 'y', 84, 'approved'),
(19, '2928731118', '2222', 'member2', 'member2', NULL, NULL, 'y', 'n', 'n', 84, 'approved'),
(20, '7176052600', '102', 'member4', 'member4', NULL, NULL, 'n', 'n', 'n', 85, 'approved'),
(21, '4511923970', '101', 'member3', 'member3', NULL, NULL, 'n', 'n', 'y', 85, 'approved'),
(22, '0492297054', '5555', 'request', 'education', NULL, NULL, 'y', 'y', 'n', 92, 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `special_request`
--

CREATE TABLE `special_request` (
  `id` int(9) UNSIGNED NOT NULL,
  `member_id` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `req_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `sub_code` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `added_by` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mem_code` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fam_code` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_type` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updated_at` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `sub_code`, `added_by`, `mem_code`, `fam_code`, `email`, `password`, `first_name`, `last_name`, `user_type`, `created_at`, `updated_at`) VALUES
(38, '', NULL, '9330919298', '', 'admin@gmail.com', '$2b$10$IM3oIBuqNJ1uyIHJSSMNA.QVnjE.Ce8ZVtP1hjW.yK3bpIX2lbH72', 'admin', 'admin', 'cl', '', ''),
(84, '9837657904', NULL, NULL, NULL, 'samithy1@gmail.com', '$2b$10$iS3B.dqkA0Jl2W7Im/Kik.RMymNfdFwyyoJk2LEx0TYy1W72v6OwC', 'samithy1', 's', 'subad', NULL, NULL),
(85, '3445855564', NULL, NULL, NULL, 'samithy2@gmail.com', '$2b$10$PHYSpXrh5SsDOhRIu47MauX/4CmaIS3OXOEO0lP7fJUNc8R2MPCLi', 'samithy2', 's2', 'subad', NULL, NULL),
(87, NULL, '9837657904', '2928731118', NULL, 'member1@gmail.com', '$2b$10$amJ/.dMyFbi2m1/ox8JrBe9Kmz2r5GiU4c2cizPVGCWti2lOCBrdm', 'member1', 'member1', 'm', NULL, NULL),
(88, NULL, '9837657904', '5426184241', NULL, 'member2@gmail.com', '$2b$10$.iBgZENbFc.U/RkXeNYqXeIuMa.CSRNSO/MYxxkB/VNfFC.ScxJEG', 'member2', 'member2', 'm', NULL, NULL),
(89, NULL, '3445855564', '4511923970', NULL, 'member3@gmail.com', '$2b$10$O41YDjq/gc0nL4tKVqnXtuhoYbF1b6m4lZ/xme5TC5rSxOUiGiuvm', 'member3', 'member3', 'm', NULL, NULL),
(90, NULL, '3445855564', '7176052600', NULL, 'member4@gmail.com', '$2b$10$KoHugrxBHofXimrhCukBkeuibRia/4CB.RepKEdhnfYtaPWBru4X6', 'member4', 'member4', 'm', NULL, NULL),
(91, '8983065197', '3445855564', NULL, '7176052600', 'fam1@gmail.com', '$2b$10$ZzJtUOoFXDHgMcI9.0R8uOKbiC/3xlrlgajrJSMUBIxs92F.gFnaW', 'fam1', 'fam1', 'f', NULL, NULL),
(92, '7991580542', NULL, NULL, NULL, 'samithy@gmail.com', '$2b$10$UKIljK28pbXt2TR4PUnrAuGe45t4Uqq/iHGMp8pE0MjiUoheSP1Mq', 'samithy', 'samithy', 'subad', NULL, NULL),
(93, NULL, '7991580542', '0492297054', NULL, 'anjana@gmail.com', '$2b$10$R1.6gJk7gL4zE.i8dVb/Be7PWMWcJmZi0oR/Ff1unfKpmr9.JKsye', 'anjana', 'anjana', 'm', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `uv_id` int(50) NOT NULL,
  `u_id` int(50) NOT NULL,
  `sub_code` varchar(30) DEFAULT NULL,
  `mem_code` varchar(50) DEFAULT NULL,
  `fam_code` varchar(50) DEFAULT NULL,
  `address` varchar(100) NOT NULL,
  `dob` varchar(25) DEFAULT NULL,
  `pno` varchar(150) DEFAULT NULL,
  `gender` varchar(11) DEFAULT NULL,
  `ward` varchar(11) NOT NULL,
  `pan` varchar(50) DEFAULT NULL,
  `taluk` varchar(50) NOT NULL,
  `dis` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `pin` int(11) NOT NULL,
  `bankno` varchar(50) DEFAULT NULL,
  `bankholdername` varchar(50) DEFAULT NULL,
  `bankifsc` varchar(50) DEFAULT NULL,
  `bankdetails` varchar(100) DEFAULT NULL,
  `user` varchar(50) DEFAULT NULL,
  `cpass` varchar(100) DEFAULT NULL,
  `googlepay` varchar(50) DEFAULT NULL,
  `phonepe` varchar(50) DEFAULT NULL,
  `paytm` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`uv_id`, `u_id`, `sub_code`, `mem_code`, `fam_code`, `address`, `dob`, `pno`, `gender`, `ward`, `pan`, `taluk`, `dis`, `state`, `pin`, `bankno`, `bankholdername`, `bankifsc`, `bankdetails`, `user`, `cpass`, `googlepay`, `phonepe`, `paytm`) VALUES
(8, 38, '0', '9330919298', '', 'admin', '1986-02-05', '2147483647', 'Male', '11', 'panchayath', 'taluk', '8', '1', 688768, 'ee12', 'admin', 'ifsc', 'details', '', '', NULL, NULL, NULL),
(41, 84, '9837657904', NULL, NULL, 'samithy1', '2008-06-26', '1234567890', 'Male', '1', 'one', 'kasargod', '1', '1', 123, '1234', 'samithy1', 'samithy1', 'kasargod', NULL, NULL, NULL, NULL, NULL),
(42, 85, '3445855564', NULL, NULL, 'samithy2', '1999-09-23', '5555555555', 'Male', '2', 's2', 'kannur', '2', '1', 22222, '3456', 'samithy2', 'samithy2', 'kannur', NULL, NULL, NULL, NULL, NULL),
(44, 87, NULL, '2928731118', NULL, 'member1', '2021-09-14', '9876543456', 'Male', '1', 'member1', 'member1', '1', '1', 6666777, '2222', 'member1', 'member1', 'kasargod', NULL, NULL, NULL, NULL, NULL),
(45, 88, NULL, '5426184241', NULL, 'member2', '2021-09-03', '999999999', 'Female', '3', 'member2', 'member2', '1', '1', 77777, '777', 'member2', 'member2', 'kasargod', NULL, NULL, NULL, NULL, NULL),
(46, 89, NULL, '4511923970', NULL, 'member3', '2018-06-12', '79034567765', 'Male', '3', 'member3', 'member3', '2', '1', 33333, '101', 'member3', 'member3', 'kannur', NULL, NULL, NULL, NULL, NULL),
(47, 90, NULL, '7176052600', NULL, 'member4', '2021-09-15', '7865454545', 'Female', '4', 'member4', 'member4', '2', '1', 680987, '102', 'member4', 'member4', 'kannur', NULL, NULL, NULL, NULL, NULL),
(48, 91, '8983065197', NULL, NULL, 'fam1', '2021-09-22', '777777', 'Male', '2', 'fam1', 'fam1', '1', '1', 8888, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(49, 92, '7991580542', NULL, NULL, 'samithy', '2021-09-10', '44446666', 'Male', '22', 'samithy', 'samithy', '1', '1', 444, '333', 'samithy', 'samithy44', 'samithy', NULL, NULL, NULL, NULL, NULL),
(50, 93, NULL, '0492297054', NULL, 'vvvv', '2021-09-23', '444444', 'Female', '444', '2222', 'vvv', '1', '1', 7777, '5555', 'anjana', '666', 'nnn', NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `aloted_request`
--
ALTER TABLE `aloted_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `approval`
--
ALTER TABLE `approval`
  ADD PRIMARY KEY (`id`),
  ADD KEY `r_id` (`r_id`);

--
-- Indexes for table `family_members`
--
ALTER TABLE `family_members`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `fund_statement`
--
ALTER TABLE `fund_statement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fund_transfer`
--
ALTER TABLE `fund_transfer`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `gp_members`
--
ALTER TABLE `gp_members`
  ADD PRIMARY KEY (`sno`);

--
-- Indexes for table `group_form`
--
ALTER TABLE `group_form`
  ADD PRIMARY KEY (`gp_id`),
  ADD UNIQUE KEY `gp_id` (`gp_id`);

--
-- Indexes for table `inter_communication`
--
ALTER TABLE `inter_communication`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `proof_photos`
--
ALTER TABLE `proof_photos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registration`
--
ALTER TABLE `registration`
  ADD PRIMARY KEY (`r_id`);

--
-- Indexes for table `request_photos`
--
ALTER TABLE `request_photos`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `req_need`
--
ALTER TABLE `req_need`
  ADD PRIMARY KEY (`r_id`);

--
-- Indexes for table `special_request`
--
ALTER TABLE `special_request`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`uv_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `aloted_request`
--
ALTER TABLE `aloted_request`
  MODIFY `id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `approval`
--
ALTER TABLE `approval`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `family_members`
--
ALTER TABLE `family_members`
  MODIFY `id` int(9) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fund_statement`
--
ALTER TABLE `fund_statement`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `fund_transfer`
--
ALTER TABLE `fund_transfer`
  MODIFY `id` int(9) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gp_members`
--
ALTER TABLE `gp_members`
  MODIFY `sno` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `group_form`
--
ALTER TABLE `group_form`
  MODIFY `gp_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inter_communication`
--
ALTER TABLE `inter_communication`
  MODIFY `id` int(9) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `proof_photos`
--
ALTER TABLE `proof_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `registration`
--
ALTER TABLE `registration`
  MODIFY `r_id` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `request_photos`
--
ALTER TABLE `request_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `req_need`
--
ALTER TABLE `req_need`
  MODIFY `r_id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `special_request`
--
ALTER TABLE `special_request`
  MODIFY `id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `uv_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
