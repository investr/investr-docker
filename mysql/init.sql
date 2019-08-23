-- MySQL dump 10.13  Distrib 5.5.62, for Linux (x86_64)
--
-- Host: localhost    Database: investr
-- ------------------------------------------------------
-- Server version	5.5.61

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
-- Create investr database
--
CREATE DATABASE IF NOT EXISTS investr;

--
-- Use investr database
--
USE investr;

--
-- Table structure for table `HISTORICAL_SCORE`
--

-- DROP TABLE IF EXISTS `HISTORICAL_SCORE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `HISTORICAL_SCORE` (
  `STOCK_ID` int(11) NOT NULL,
  `DT` text NOT NULL,
  `SCORE` double DEFAULT NULL,
  `SCORE_CHANGE` double DEFAULT NULL,
  `SCORE_HIGH` double DEFAULT NULL,
  `SCORE_LOW` double DEFAULT NULL,
  `PRICE` double DEFAULT NULL,
  `COMMENT` text,
  `ATTR1` text,
  `ATTR2` text,
  `ATTR3` text,
  `ATTR4` text,
  `ATTR5` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MASTER`
--

-- DROP TABLE IF EXISTS `MASTER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MASTER` (
  `ID` int(11) NOT NULL,
  `NAME` text NOT NULL,
  `NSE_CODE` text,
  `BSE_CODE` text,
  `PRICE` double DEFAULT NULL,
  `SECTOR` text,
  `OWNED` text,
  `MC_CODE` text,
  `MC_NAME` text,
  `MC_URL` text,
  `MC_S_OR_C` text,
  `LAST_QTR` text,
  `EARNINGS_Q1` double DEFAULT NULL,
  `EARNINGS_Q2` double DEFAULT NULL,
  `EARNINGS_Q3` double DEFAULT NULL,
  `EARNINGS_Q4` double DEFAULT NULL,
  `EARNINGS_Q5` double DEFAULT NULL,
  `EARNINGS_TTM` double DEFAULT NULL,
  `EARNINGS_Y1` double DEFAULT NULL,
  `EARNINGS_Y2` double DEFAULT NULL,
  `EARNINGS_YOY_GROWTH` double DEFAULT NULL,
  `EARNINGS_QOQ_GROWTH` double DEFAULT NULL,
  `EARNINGS_YEARLY_GROWTH` double DEFAULT NULL,
  `INTEREST_Q1` double DEFAULT NULL,
  `INTEREST_Q2` double DEFAULT NULL,
  `INTEREST_Q3` double DEFAULT NULL,
  `INTEREST_Q4` double DEFAULT NULL,
  `INTEREST_Q5` double DEFAULT NULL,
  `INTEREST_TTM` double DEFAULT NULL,
  `INTEREST_Y1` double DEFAULT NULL,
  `INTEREST_Y2` double DEFAULT NULL,
  `INTEREST_YOY_GROWTH` double DEFAULT NULL,
  `INTEREST_QOQ_GROWTH` double DEFAULT NULL,
  `INTEREST_YEARLY_GROWTH` double DEFAULT NULL,
  `INTEREST_PERCENT` double DEFAULT NULL,
  `PROFITS_Q1` double DEFAULT NULL,
  `PROFITS_Q2` double DEFAULT NULL,
  `PROFITS_Q3` double DEFAULT NULL,
  `PROFITS_Q4` double DEFAULT NULL,
  `PROFITS_Q5` double DEFAULT NULL,
  `PROFITS_TTM` double DEFAULT NULL,
  `PROFITS_Y1` double DEFAULT NULL,
  `PROFITS_Y2` double DEFAULT NULL,
  `PROFITS_YOY_GROWTH` double DEFAULT NULL,
  `PROFITS_QOQ_GROWTH` double DEFAULT NULL,
  `PROFITS_YEARLY_GROWTH` double DEFAULT NULL,
  `MARGINS_Q1` double DEFAULT NULL,
  `MARGINS_Q2` double DEFAULT NULL,
  `MARGINS_Q3` double DEFAULT NULL,
  `MARGINS_Q4` double DEFAULT NULL,
  `MARGINS_Q5` double DEFAULT NULL,
  `MARGINS_TTM` double DEFAULT NULL,
  `MARGINS_Y1` double DEFAULT NULL,
  `MARGINS_Y2` double DEFAULT NULL,
  `MARGINS_YOY_GROWTH` double DEFAULT NULL,
  `MARGINS_QOQ_GROWTH` double DEFAULT NULL,
  `MARGINS_YEARLY_GROWTH` double DEFAULT NULL,
  `EQ_SHR_CAP_Q1` double DEFAULT NULL,
  `EQ_SHR_CAP_Q2` double DEFAULT NULL,
  `EQ_SHR_CAP_Q3` double DEFAULT NULL,
  `EQ_SHR_CAP_Q4` double DEFAULT NULL,
  `EQ_SHR_CAP_Q5` double DEFAULT NULL,
  `EQ_SHR_CAP_TTM` double DEFAULT NULL,
  `EQ_SHR_CAP_Y1` double DEFAULT NULL,
  `EQ_SHR_CAP_Y2` double DEFAULT NULL,
  `FV_Q1` int(11) DEFAULT NULL,
  `FV_Q2` int(11) DEFAULT NULL,
  `FV_Q3` int(11) DEFAULT NULL,
  `FV_Q4` int(11) DEFAULT NULL,
  `FV_Q5` int(11) DEFAULT NULL,
  `FV_Y1` int(11) DEFAULT NULL,
  `FV_Y2` int(11) DEFAULT NULL,
  `EPS_Q1` double DEFAULT NULL,
  `EPS_Q2` double DEFAULT NULL,
  `EPS_Q3` double DEFAULT NULL,
  `EPS_Q4` double DEFAULT NULL,
  `EPS_Q5` double DEFAULT NULL,
  `EPS_TTM` double DEFAULT NULL,
  `EPS_Y1` double DEFAULT NULL,
  `EPS_Y2` double DEFAULT NULL,
  `EPS_YOY_GROWTH` double DEFAULT NULL,
  `EPS_QOQ_GROWTH` double DEFAULT NULL,
  `EPS_YEARLY_GROWTH` double DEFAULT NULL,
  `BV_Y1` double DEFAULT NULL,
  `BV_Y2` double DEFAULT NULL,
  `BV_GROWTH` double DEFAULT NULL,
  `DIV_Y1` double DEFAULT NULL,
  `DIV_Y2` double DEFAULT NULL,
  `DIV_GROWTH` double DEFAULT NULL,
  `PE` double DEFAULT NULL,
  `PEG` double DEFAULT NULL,
  `DIV_YIELD` double DEFAULT NULL,
  `PBV` double DEFAULT NULL,
  `YEAR_ENDS` text,
  `EARNINGS_Q6` double DEFAULT NULL,
  `EARNINGS_Q7` double DEFAULT NULL,
  `EARNINGS_Q8` double DEFAULT NULL,
  `INTEREST_Q6` double DEFAULT NULL,
  `INTEREST_Q7` double DEFAULT NULL,
  `INTEREST_Q8` double DEFAULT NULL,
  `PROFITS_Q6` double DEFAULT NULL,
  `PROFITS_Q7` double DEFAULT NULL,
  `PROFITS_Q8` double DEFAULT NULL,
  `MARGINS_Q6` double DEFAULT NULL,
  `MARGINS_Q7` double DEFAULT NULL,
  `MARGINS_Q8` double DEFAULT NULL,
  `EPS_Q6` double DEFAULT NULL,
  `EPS_Q7` double DEFAULT NULL,
  `EPS_Q8` double DEFAULT NULL,
  `EV_Y1` double DEFAULT NULL,
  `EV_Y2` double DEFAULT NULL,
  `EV_EBITDA_Y1` double DEFAULT NULL,
  `EV_EBITDA_Y2` double DEFAULT NULL,
  `ATTR1` double DEFAULT NULL,
  `ATTR2` double DEFAULT NULL,
  `ATTR3` double DEFAULT NULL,
  `ATTR4` double DEFAULT NULL,
  `ATTR5` double DEFAULT NULL,
  `ATTR6` double DEFAULT NULL,
  `ATTR7` double DEFAULT NULL,
  `ATTR8` double DEFAULT NULL,
  `ATTR9` double DEFAULT NULL,
  `ATTR10` double DEFAULT NULL,
  `ATTR11` text,
  `ATTR12` text,
  `ATTR13` text,
  `ATTR14` text,
  `ATTR15` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `NOTIFICATIONS`
--

-- DROP TABLE IF EXISTS `NOTIFICATIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `NOTIFICATIONS` (
  `NOTICE` varchar(255) DEFAULT NULL,
  `SEND_TO_USER_ID` int(11) DEFAULT NULL,
  `SENT` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PORTFOLIO_GROWTH`
--

-- DROP TABLE IF EXISTS `PORTFOLIO_GROWTH`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PORTFOLIO_GROWTH` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `DT` text,
  `PORTFOLIO_ID` int(11) DEFAULT NULL,
  `MOVE` double DEFAULT NULL,
  `CURRENT` double DEFAULT NULL,
  `NOTES` text,
  `ATTR1` text,
  `ATTR2` text,
  `ATTR3` text,
  `ATTR4` text,
  `ATTR5` text,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UNIQUE_DT_PORTFOLIO_ID` (`DT`(10),`PORTFOLIO_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3188 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PREFS`
--

-- DROP TABLE IF EXISTS `PREFS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PREFS` (
  `USER_ID` int(11) DEFAULT NULL,
  `WEIGHT_PRESET` text,
  `WEIGHTS` text,
  `VALUATIONS` text,
  `TOLERANCE` text,
  `SHOW_TOOLTIPS` text,
  `EMAIL_USER` text,
  `SUPPORT` text,
  `DONATION` text,
  `LOOK_AND_FEEL` text,
  `LOVE` text,
  `NOTES` text,
  `MESSAGE` text,
  `ATTR1` text,
  `ATTR2` text,
  `ATTR3` text,
  `ATTR4` text,
  `ATTR5` text,
  `ATTR6` text,
  `ATTR7` text,
  `ATTR8` text,
  `ATTR9` text,
  `ATTR10` text,
  UNIQUE KEY `USER_ID` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SCORE`
--

-- DROP TABLE IF EXISTS `SCORE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SCORE` (
  `ID` int(11) NOT NULL,
  `EARNINGS_YOY_GROWTH_PTS` int(11) DEFAULT NULL,
  `EARNINGS_QOQ_GROWTH_PTS` int(11) DEFAULT NULL,
  `EARNINGS_YEARLY_GROWTH_PTS` int(11) DEFAULT NULL,
  `PROFITS_YOY_GROWTH_PTS` int(11) DEFAULT NULL,
  `PROFITS_QOQ_GROWTH_PTS` int(11) DEFAULT NULL,
  `PROFITS_YEARLY_GROWTH_PTS` int(11) DEFAULT NULL,
  `EPS_YOY_GROWTH_PTS` int(11) DEFAULT NULL,
  `EPS_QOQ_GROWTH_PTS` int(11) DEFAULT NULL,
  `EPS_YEARLY_GROWTH_PTS` int(11) DEFAULT NULL,
  `MARGINS_PERCENT_PTS` int(11) DEFAULT NULL,
  `MARGINS_YEARLY_GROWTH_PTS` int(11) DEFAULT NULL,
  `INTEREST_PERCENT_PTS` int(11) DEFAULT NULL,
  `INTEREST_YEARLY_GROWTH_PTS` int(11) DEFAULT NULL,
  `PE_PTS` int(11) DEFAULT NULL,
  `PE_LOW` int(11) DEFAULT NULL,
  `PE_HIGH` int(11) DEFAULT NULL,
  `PEG_PTS` int(11) DEFAULT NULL,
  `DIV_YIELD_PTS` int(11) DEFAULT NULL,
  `DIV_GROWTH_PTS` int(11) DEFAULT NULL,
  `BV_GROWTH_PTS` int(11) DEFAULT NULL,
  `MAX_WEIGHTED_POINTS` double DEFAULT NULL,
  `SCORED_WEIGHTED_POINTS` double DEFAULT NULL,
  `PERCENTAGE_SCORED` double DEFAULT NULL,
  `PERCENTAGE_SCORED_OLD` double DEFAULT NULL,
  `STD_DEV_SCORE` double DEFAULT NULL,
  `STD_DEV_MARGINS` double DEFAULT NULL,
  `ATTR1` double DEFAULT NULL,
  `ATTR2` double DEFAULT NULL,
  `ATTR3` double DEFAULT NULL,
  `ATTR4` double DEFAULT NULL,
  `ATTR5` double DEFAULT NULL,
  `ATTR6` text,
  `ATTR7` text,
  `ATTR8` text,
  `ATTR9` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `USERS`
--

-- DROP TABLE IF EXISTS `USERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USERS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` text,
  `EMAIL` varchar(80) DEFAULT NULL,
  `IMAGE` text,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `EMAIL` (`EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=25826 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER SEND_NOTIFICATIONS AFTER INSERT ON USERS FOR EACH ROW
BEGIN
    INSERT INTO NOTIFICATIONS VALUES ('New user was added!', 1, 0);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `WATCHLIST`
--

-- DROP TABLE IF EXISTS `WATCHLIST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WATCHLIST` (
  `USER_ID` int(11) DEFAULT NULL,
  `STOCK_ID` int(11) DEFAULT NULL,
  `BUY_AT` int(11) DEFAULT NULL,
  `SELL_AT` int(11) DEFAULT NULL,
  `NOTES` text,
  `ATTR1` text,
  `ATTR2` text,
  `ATTR3` text,
  `ATTR4` text,
  `ATTR5` text,
  UNIQUE KEY `USER_ID_STOCK_ID` (`USER_ID`,`STOCK_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-07-18  9:06:45
