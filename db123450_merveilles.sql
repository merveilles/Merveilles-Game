-- MySQL dump 10.16  Distrib 10.1.31-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: db123450_merveilles
-- ------------------------------------------------------
-- Server version	10.1.31-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `xiv_merveilles`
--

DROP TABLE IF EXISTS `xiv_merveilles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xiv_merveilles` (
  `mv_name` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mv_password` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `x` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '27',
  `y` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '41',
  `floor` int(11) DEFAULT '1',
  `max_floor` int(11) DEFAULT '10',
  `xp` int(11) DEFAULT '0',
  `hp` int(11) DEFAULT '30',
  `mp` int(11) DEFAULT '30',
  `kill` tinyint(1) DEFAULT '0',
  `save` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message_timestamp` datetime DEFAULT NULL,
  `avatar_head` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_body` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warp1` int(11) DEFAULT '0',
  `warp2` int(11) DEFAULT '0',
  `warp3` int(11) DEFAULT '0',
  `warp4` int(11) DEFAULT '0',
  `mv_time` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `xiv_merveilles_monsters`
--

DROP TABLE IF EXISTS `xiv_merveilles_monsters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xiv_merveilles_monsters` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `health` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `xiv_merveilles_special`
--

DROP TABLE IF EXISTS `xiv_merveilles_special`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xiv_merveilles_special` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `message` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_floor` int(11) DEFAULT NULL,
  `to_x` int(11) DEFAULT NULL,
  `to_y` int(11) DEFAULT NULL,
  `image` int(11) DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-10  1:44:22
