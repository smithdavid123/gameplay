-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2023-02-29 11:39:06
-- 服务器版本： 5.7.29
-- PHP Version: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `game`
--

-- --------------------------------------------------------

--
-- 表的结构 `activity`
--

CREATE TABLE IF NOT EXISTS `activity` (
  `id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `label` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(10240) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `activity`
--

INSERT INTO `activity` (`id`, `status`, `label`, `content`, `category`, `updateTime`) VALUES
(1, 0, '', '[{"base":100,"additional":5},{"base":"1000","additional":50},{"base":0,"additional":0}]', 'money', '2023-12-19 23:06:08');

-- --------------------------------------------------------

--
-- 表的结构 `bank`
--

CREATE TABLE IF NOT EXISTS `bank` (
  `id` int(11) NOT NULL,
  `name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `allowBindCard` int(11) NOT NULL DEFAULT '1',
  `withdrawStatus` int(11) NOT NULL DEFAULT '0',
  `withdrawMessage` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `bank`
--

INSERT INTO `bank` (`id`, `name`, `code`, `url`, `allowBindCard`, `withdrawStatus`, `withdrawMessage`, `mark`) VALUES
(1, '中国工商银行', 'ICBC', 'http://www.icbc.com.cn', 1, 0, NULL, NULL),
(2, '中国建设银行', 'CBC', 'http://www.ccb.com', 1, 0, NULL, NULL),
(3, '中国农业银行', 'ABC', 'http://www.abchina.com', 1, 0, NULL, NULL),
(4, '招商银行', 'CMB', 'http://www.cmbchina.com', 1, 0, NULL, NULL),
(5, '中国银行', 'BOC', 'http://www.boc.cn', 1, 0, NULL, NULL),
(6, '交通银行', 'BOCOM', 'http://www.bankcomm.com', 1, 0, NULL, NULL),
(7, '浦发银行', 'SPDB', 'http://www.spdb.com.cn', 1, 0, NULL, NULL),
(8, '兴业银行', 'CIB', 'http://www.cib.com.cn', 1, 0, NULL, NULL),
(9, '中信银行', 'CCB', 'http://bank.ecitic.com', 1, 0, NULL, NULL),
(10, '宁波银行', 'NBCB', 'http://www.nbcb.com.cn', 1, 0, NULL, NULL),
(11, '上海银行', 'BOS', 'http://www.bankofshanghai.com', 1, 0, NULL, NULL),
(12, '杭州银行', 'BOHZ', 'http://www.hzbank.com.cn', 1, 0, NULL, NULL),
(13, '渤海银行', 'CBHB', 'http://www.cbhb.com.cn', 1, 0, NULL, NULL),
(14, '浙商银行', 'CZB', 'http://www.czbank.com', 1, 0, NULL, NULL),
(15, '广发银行', 'GDB', 'http://www.cgbchina.com.cn', 1, 0, NULL, NULL),
(16, '中国邮政储蓄银行', 'PSBC', 'http://www.psbc.com', 1, 0, NULL, NULL),
(17, '深圳发展银行', 'SDB', 'http://www.bank.pingan.com', 1, 0, NULL, NULL),
(18, '中国民生银行', 'CMBC', 'http://www.cmbc.com.cn', 1, 0, NULL, NULL),
(19, '中国光大银行', 'CEB', 'http://www.cebbank.com', 1, 0, NULL, NULL),
(20, '华夏银行', 'HXBC', 'http://www.hxb.com.cn', 1, 0, NULL, NULL),
(21, '北京银行', 'BOBJ', 'http://www.bankofbeijing.com.cn', 1, 0, NULL, NULL),
(22, '南京银行', 'NJCB', 'http://www.njcb.com.cn', 1, 0, NULL, NULL),
(23, '平安银行', 'PAB', 'http://www.bank.pingan.com', 1, 0, NULL, NULL),
(24, '北京农村商业银行', 'BJRCB', 'http://www.bjrcb.com', 1, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `book`
--

CREATE TABLE IF NOT EXISTS `book` (
  `id` int(11) NOT NULL,
  `account` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accountType` int(11) DEFAULT NULL,
  `remarks` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `mDeposit` float DEFAULT '0',
  `mVirtual` float DEFAULT '0',
  `amount_chase` float NOT NULL DEFAULT '0',
  `type` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `balanceBefore` double NOT NULL,
  `balanceAfter` double NOT NULL,
  `information` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '盈利账户前后,充值账户前后',
  `billno` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `method` int(11) NOT NULL DEFAULT '1',
  `status` int(11) DEFAULT '1' COMMENT '是否入账',
  `actualAmount` double DEFAULT NULL,
  `cardId` int(11) DEFAULT NULL,
  `bankCardId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isChase` int(11) NOT NULL DEFAULT '0' COMMENT '追号记录填补不显示明细',
  `isChaseSub` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `card`
--

CREATE TABLE IF NOT EXISTS `card` (
  `id` int(11) NOT NULL,
  `user` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankCardName` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankCardId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankBranch` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cardStatus` int(11) NOT NULL DEFAULT '0',
  `isDel` int(11) NOT NULL DEFAULT '0',
  `isDefault` int(11) DEFAULT '0',
  `lockTime` datetime DEFAULT NULL,
  `bankName` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `config`
--

CREATE TABLE IF NOT EXISTS `config` (
  `id` int(11) NOT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `mark` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desp` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isNumb` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `config`
--

INSERT INTO `config` (`id`, `name`, `value`, `updateTime`, `category`, `status`, `mark`, `desp`, `isNumb`) VALUES
(1, 'maxBonus', '100', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1),
(2, 'wageRatio', '0.1', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1),
(30, 'ratio', '16.6', '2023-03-10 10:46:37', 'dividend', 0, '', NULL, 1),
(31, 'days', '15', '2023-03-11 18:58:57', 'dividend', 0, '', NULL, 1),
(32, 'point', '1994', '2023-02-12 21:01:45', 'dividend', 1, '', NULL, 1),
(33, 'number', '15', '2023-02-13 14:46:55', 'dividend', 0, '', NULL, 1),
(34, 'consume', '200', '2023-03-10 11:45:21', 'dividend', 1, '', NULL, 1),
(35, 'deficit', '100', '2023-03-10 11:45:21', 'dividend', 1, '', NULL, 1),
(36, 'perDeficit', '10', '2023-03-10 12:03:42', 'dividend', 0, '', NULL, 1),
(37, 'perConsume', '200', '2023-03-10 12:03:33', 'dividend', 0, '', NULL, 1),
(38, 'activeUser', '1', '2023-03-10 14:04:15', 'dividend', 1, '', NULL, 1),
(39, 'activeUserAfterIP', '1', '2023-03-10 14:04:24', 'dividend', 0, '', NULL, 1),
(40, 'perDeficit2', '15', '2023-03-10 14:23:43', 'dividend', 1, '', NULL, 1),
(41, 'deficitUser', '2', '2023-03-10 14:25:36', 'dividend', 1, '', NULL, 1),
(42, 'consumeUser', '1', '2023-03-10 14:25:08', 'dividend', 1, '', NULL, 1),
(43, 'perConsume2', '2', '2023-03-10 11:45:22', 'dividend', 1, '', NULL, 1),
(44, 'pointConsume', '0', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1),
(45, 'maxLevelDiff', '200', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1),
(46, 'maxBetting', '999', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1),
(47, 'APP下载地址', '0', '2023-02-22 11:04:08', 'download', 0, 'http://a.jinhua101.com/', NULL, 1),
(48, 'APP下载地址', '1', '2023-02-22 11:04:15', 'download', 0, 'http://a.jinhua102.com/', NULL, 1),
(49, 'wageMaxPoint', '10.5', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1),
(50, 'l23yl.com', '1', '2023-02-22 11:05:06', 'onlineUrls', 0, 'http://www.jinhua101.com', NULL, 1),
(51, 'l23yl.com', '1', '2023-02-22 11:05:12', 'onlineUrls', 0, 'http://www.jinhua102.com', NULL, 1),
(52, 'l23yl.com', '1', '2023-02-22 11:05:16', 'onlineUrls', 0, 'http://www.jinhua103.com', NULL, 1),
(53, 'l23yl.com', '1', '2023-02-22 11:06:46', 'onlineUrls', 0, 'http://www.jinhua104.com', NULL, 1),
(54, 'l23yl.com', '1', '2023-02-22 11:06:50', 'onlineUrls', 0, 'http://www.jinhua105.com', NULL, 1),
(55, 'l23yl.com', '1', '2023-02-22 11:06:55', 'onlineUrls', 0, 'http://www.jinhua106.com', NULL, 1),
(56, 'feeRate', '0.1', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1),
(57, '53kf', '0', '2023-02-22 14:45:51', 'serviceUrl', 0, 'https://tb.53kf.com/code/client/1', NULL, 1),
(58, '53kf', '1', '2023-02-22 14:46:18', 'serviceUrl', 0, 'https://tb.53kf.com/code/app/1', NULL, 1),
(59, 'secretKey', '2CE592D13D9CC2BF98568A1020AC8B60', '2023-02-24 05:33:47', 'other', 1, '密钥', NULL, 0),
(60, 'appId', '5e5352d7af6cbe62e12b0bb1', '2023-02-24 05:33:47', 'other', 1, '商户id', NULL, 0),
(61, 'gateway', '139.217.239.245', '2023-02-24 05:33:47', 'other', 1, '网关', NULL, 0),
(62, 'payServer', 'https://su-pay.info', '2023-02-24 05:33:47', 'other', 1, '支付提交地址 ', NULL, 0),
(63, 'payUrl', '/b/recharge', '2023-02-24 05:33:47', 'other', 1, '支付下单地址', NULL, 0),
(64, 'notifyUrl', 'http://d.jinhua101.com/moneyNotice', '2023-02-24 05:33:47', 'other', 1, '我方服务器回调地址', NULL, 0),
(65, 'payDesp', 'test', '2023-02-24 05:33:47', 'other', 1, '支付文字描述|金华娱乐会员充值', NULL, 0),
(66, 'percWithdraw', '1', '2023-02-24 05:33:47', 'other', 1, '', '盈利余额允许提现比例', 1),
(67, 'payUserId', 'jinhua104', '2023-02-24 05:33:47', 'other', 1, '商户用户ID', NULL, 0),
(68, 'allowBetMax', '1996', '2023-02-24 18:02:08', 'other', 1, '', '允许投注最高级别', 1);

-- --------------------------------------------------------

--
-- 表的结构 `contract`
--

CREATE TABLE IF NOT EXISTS `contract` (
  `id` int(11) NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activeUser` int(11) NOT NULL DEFAULT '3',
  `scalePoint` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '0',
  `accountFrom` int(11) NOT NULL,
  `accountTo` int(11) NOT NULL,
  `isBase` int(11) NOT NULL DEFAULT '0',
  `totalConsume` float DEFAULT NULL,
  `totalLoss` float DEFAULT NULL,
  `dailyLoss` float DEFAULT NULL,
  `lossDay` int(11) DEFAULT NULL,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `dividend`
--

CREATE TABLE IF NOT EXISTS `dividend` (
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` float NOT NULL,
  `id` int(11) NOT NULL,
  `scalePoint` int(11) NOT NULL,
  `startDate` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `totalConsume` float NOT NULL DEFAULT '0',
  `totalLoss` float NOT NULL DEFAULT '0',
  `endDate` datetime NOT NULL,
  `activeUser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `dividend_admin`
--

CREATE TABLE IF NOT EXISTS `dividend_admin` (
  `id` int(11) NOT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `dayCount` int(11) NOT NULL,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `totalConsume` float NOT NULL DEFAULT '0',
  `totalLoss` float DEFAULT '0',
  `consumeAmount` float NOT NULL DEFAULT '0',
  `consumeDays` int(11) NOT NULL DEFAULT '0',
  `pointLimit1` int(11) NOT NULL,
  `lossAmount` float NOT NULL DEFAULT '0',
  `lossDays` int(11) NOT NULL DEFAULT '0',
  `pointLimit2` float NOT NULL,
  `isDefault` int(11) NOT NULL DEFAULT '0',
  `ruleId` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `dividend_admin`
--

INSERT INTO `dividend_admin` (`id`, `name`, `status`, `dayCount`, `updateTime`, `totalConsume`, `totalLoss`, `consumeAmount`, `consumeDays`, `pointLimit1`, `lossAmount`, `lossDays`, `pointLimit2`, `isDefault`, `ruleId`) VALUES
(7, '半月分红', 1, 15, '2023-02-24 05:52:27', 0, 0, 0, 1, 1996, 0, 0, 1996, 1, 27),
(10, '配置1', 1, 1, '2023-02-24 05:51:40', 0, 0, 0, 0, 2000, 0, 0, 2000, 0, 24),
(11, '配置', 1, 7, '2023-02-24 05:54:32', 0, 0, 100, 0, 1998, 500, 0, 1998, 0, 25),
(12, '配置', 0, 30, '2023-02-24 05:51:40', 0, 0, 100, 2, 2000, 100, 1, 2000, 0, 29);

-- --------------------------------------------------------

--
-- 表的结构 `dividend_config`
--

CREATE TABLE IF NOT EXISTS `dividend_config` (
  `id` int(11) NOT NULL,
  `accountFrom` int(11) NOT NULL,
  `accountTo` int(11) NOT NULL,
  `activeUser` int(11) NOT NULL DEFAULT '0',
  `scalePoint` float NOT NULL DEFAULT '0',
  `extraRules` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uSecond` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRoot` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `dividend_config`
--

INSERT INTO `dividend_config` (`id`, `accountFrom`, `accountTo`, `activeUser`, `scalePoint`, `extraRules`, `uSecond`, `isRoot`) VALUES
(24, 0, 0, 0, 3, '[{"totalConsume": 0, "scalePoint": "4", "activeUser": 0, "totalLoss": "3"}, {"totalConsume": 0, "scalePoint": "5", "activeUser": 0, "totalLoss": "5"}, {"totalConsume": 0, "scalePoint": "7", "activeUser": 0, "totalLoss": "10"}]', 'common', 0),
(25, 0, 0, 0, 0.5, '[{"totalConsume": "0", "totalLoss": "1", "activeUser": "0", "scalePoint": "1"}, {"totalConsume": 0, "scalePoint": "1.5", "activeUser": 0, "totalLoss": "3"}]', 'common', 0),
(27, 0, 0, 3, 5, '[{"totalConsume": "100", "scalePoint": "10", "activeUser": "3", "totalLoss": "5"}, {"totalConsume": "250", "scalePoint": "15", "activeUser": "3", "totalLoss": "12"}, {"totalConsume": "600", "scalePoint": "22", "activeUser": "5", "totalLoss": "30"}, {"totalConsume": "1200", "scalePoint": "28", "activeUser": "8", "totalLoss": "55"}, {"totalConsume": "2500", "scalePoint": "35", "activeUser": "12", "totalLoss": "95"}, {"totalConsume": "3500", "scalePoint": "40", "activeUser": "20", "totalLoss": "200"}]', 'common', 0),
(29, 0, 0, 1, 20, '[]', 'common', 0),
(49, 0, 0, 1, 1, '[{"totalConsume": "50", "scalePoint": "2", "activeUser": "1", "totalLoss": 0}, {"totalConsume": "100", "scalePoint": "3", "activeUser": "1", "totalLoss": 0}, {"totalConsume": "300", "scalePoint": "4", "activeUser": "1", "totalLoss": 0}, {"totalConsume": "500", "scalePoint": "5", "activeUser": "1", "totalLoss": 0}]', 'common', 0),
(50, 17, 76, 1, 20, '[]', 'qwe1133', 0);

-- --------------------------------------------------------

--
-- 表的结构 `dividend_log`
--

CREATE TABLE IF NOT EXISTS `dividend_log` (
  `id` int(11) NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalConsume` float NOT NULL,
  `totalLoss` float NOT NULL,
  `activeUser` int(11) NOT NULL,
  `amount` float NOT NULL,
  `scalePoint` float NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `issue` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `drawTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `game_chase`
--

CREATE TABLE IF NOT EXISTS `game_chase` (
  `id` int(11) NOT NULL,
  `lottery` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startIssue` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endIssue` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(1280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `method` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` double NOT NULL,
  `compress` tinyint(1) NOT NULL,
  `billno` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `point` double NOT NULL,
  `bonus` float NOT NULL,
  `nums` int(11) DEFAULT NULL,
  `money` float NOT NULL,
  `orderTime` datetime DEFAULT NULL,
  `planList` varchar(3096) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cancel` int(11) NOT NULL DEFAULT '0',
  `totalCount` int(11) NOT NULL,
  `isWinStop` int(11) NOT NULL,
  `totalMoney` float NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `game_chase`
--

INSERT INTO `game_chase` (`id`, `lottery`, `account`, `startIssue`, `endIssue`, `content`, `status`, `createTime`, `method`, `model`, `code`, `compress`, `billno`, `point`, `bonus`, `nums`, `money`, `orderTime`, `planList`, `cancel`, `totalCount`, `isWinStop`, `totalMoney`) VALUES
(1, 'qumin', 'dvid', '20200223-0990', '20200223-0990', '0,1', 0, '2023-02-23 08:29:15', 'exzuxfsh', 'li', 2002, 0, '202002231629152391098301861261', 10.1, 0.05, 1, 0.001, '2023-02-23 16:29:15', '[{"multiple": 1, "issue": "20200223-0990"}]', 0, 1, 1, 0.001);

-- --------------------------------------------------------

--
-- 表的结构 `game_config`
--

CREATE TABLE IF NOT EXISTS `game_config` (
  `id` int(11) NOT NULL,
  `lottery` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `showName` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequency` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(11) NOT NULL,
  `times` int(11) NOT NULL,
  `stopDelay` int(11) NOT NULL,
  `downCode` int(11) NOT NULL,
  `fenDownCode` int(11) NOT NULL,
  `liDownCode` int(11) NOT NULL,
  `floatBonus` int(11) NOT NULL,
  `maxBonus` int(11) NOT NULL,
  `sort` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `description` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `shortName` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `openMode` int(11) NOT NULL DEFAULT '0',
  `apiStatus` int(11) NOT NULL DEFAULT '0',
  `apiSrc` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `apiUrl` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT ''
) ENGINE=InnoDB AUTO_INCREMENT=605 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `game_config`
--

INSERT INTO `game_config` (`id`, `lottery`, `showName`, `frequency`, `type`, `times`, `stopDelay`, `downCode`, `fenDownCode`, `liDownCode`, `floatBonus`, `maxBonus`, `sort`, `status`, `description`, `mark`, `updateTime`, `shortName`, `openMode`, `apiStatus`, `apiSrc`, `apiUrl`) VALUES
(1, 't1s30', '新加坡30秒彩', 'self', 1, 2880, 0, 0, 0, 0, -40, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：30秒一期，每日期数：2880期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(2, 't1s60', '美国一分彩', 'self', 1, 1440, 0, 0, 0, 0, -40, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：60秒一期，每日期数：1440期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(3, 't1s90', '韩国1.5分彩', 'self', 1, 960, 0, 0, 0, 0, -40, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(4, 't1s90a', '新德里1.5分彩', 'self', 1, 960, 0, 0, 0, 0, -40, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(5, 't1s90b', '俄罗斯1.5分彩', 'self', 1, 960, 0, 0, 0, 0, -40, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(6, 't1s90c', '印度1.5分彩', 'self', 1, 960, 0, 0, 0, 0, -40, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(7, 't1s90d', '东京1.5分彩', 'self', 1, 960, 0, 0, 0, 0, -40, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(8, 't1s180', '缅甸三分彩', 'self', 1, 480, 0, 0, 0, 0, -40, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：180秒一期，每日期数：480期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(9, 't1s600', '幸运十分彩', 'self', 1, 144, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：十分钟一期，每日期数：144期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(10, 't1s300', '河内5分彩', 'self', 1, 288, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：5分钟一期，每日期数：288期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(11, 't1s300a', '幸运5分彩', 'self', 1, 288, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：5分钟一期，每日期数：288期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(12, 't1s120', '快乐2分彩', 'self', 1, 720, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：2分钟一期，每日期数：720期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(13, 't1s60a', '幸运分分彩', 'self', 1, 1440, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(14, 't1s180a', '幸运三分彩', 'self', 1, 480, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：3分钟一期，每日期数：480期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(21, 't2s30', '纽约11选5', 'self', 2, 2880, 0, 0, 0, 0, -70, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：30秒一期，每日期数：2880期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(22, 't2s90', '加拿大11选5', 'self', 2, 960, 0, 0, 0, 0, -70, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(31, 't3s90', '吉隆坡快3', 'self', 3, 960, 0, 0, 0, 0, -70, 100000, 0, 1, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(32, 't3s120', '新西兰快3', 'self', 3, 720, 0, 0, 0, 0, -70, 100000, 0, 1, '开奖时间：0点至24点，开奖频率：120秒一期，每日期数：720期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(61, 't6s120', '英国120秒赛车', 'self', 6, 720, 0, 0, 0, 0, -70, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：120秒一期，每日期数：720期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(62, 't6s180', '英国180秒赛车', 'self', 6, 480, 0, 0, 0, 0, -70, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：180秒一期，每日期数：480期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(63, 't6s300', '幸运飞艇', 'self', 6, 288, 0, 0, 0, 0, -10, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：5分钟一期，每日期数：288期。', NULL, '2023-02-24 23:23:28', NULL, 0, 1, 'b1cp', 'http://api.81p.net/api?p=json&t=xyft&token=CACF6A3A06EDFE4A&limit=5'),
(101, 'cqssc', '重庆时时彩', 'high', 1, 59, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：7点10分至凌晨3点10分，开奖频率：20分钟一期，每日期数：59期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(102, 'tjssc', '天津时时彩', 'high', 1, 42, 0, 0, 0, 0, -100, 200000, 0, 1, '开奖时间：9点至23点，开奖频率：20分钟一期，每日期数：42期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(103, 'xjssc', '新疆时时彩', 'high', 1, 48, 0, 0, 0, 0, -100, 200000, 0, 0, '开奖时间：9点59分至凌晨1点59分，开奖频率：20分钟一期，每日期数：48期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(104, 'bjssc', '北京时时彩', 'high', 1, 179, 180, 0, 0, 0, -100, 200000, 0, 1, '开奖时间：9点至24点，开奖频率：5分钟一期，每日期数：179期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(105, 'hgssc', '韩国时时彩', 'high', 1, 880, 5, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：凌晨0点至5点，7点至24点，开奖频率：90秒一期，凌晨200期，7点后680期，每日期数：880期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(106, 'twssc', '台湾时时彩', 'high', 1, 203, 100, 0, 0, 0, -100, 200000, 0, 1, '开奖时间：7点至24点，开奖频率：5分钟一期，每日期数：203期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(107, 'jpssc', '东京时时彩', 'high', 1, 920, 10, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：凌晨0点到7点，8点至24点，开奖频率：90秒一期，凌晨320期，8点后600期，每日期数：920期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(108, 'sgssc', '新加坡2分彩', 'high', 1, 660, 35, 0, 0, 0, -40, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(109, 'qumin', '奇趣分分彩', 'high', 1, 1440, 7, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-02-25 05:35:51', NULL, 0, 0, '', ''),
(110, 'qu5fen', '奇趣5分彩', 'high', 1, 288, 7, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：5分钟一期，每日期数：288期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(111, 'qu10fen', '奇趣十分彩', 'high', 1, 144, 7, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：10分钟一期，每日期数：144期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(201, 'gd11x5', '广东11选5', 'high', 2, 42, 0, 0, 0, 0, -70, 100000, 0, 0, '开奖时间：9点10分至23点10分，20分钟一期，每日期数：42期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(202, 'jx11x5', '江西11选5', 'high', 2, 42, 0, 0, 0, 0, -70, 100000, 0, 1, '开奖时间：9点10分至23点10分，20分钟一期，每日期数：42期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(203, 'ah11x5', '安徽11选5', 'high', 2, 40, 0, 0, 0, 0, -70, 100000, 0, 0, '开奖时间：8点40分至22点，开奖频率：20分钟一期，每日期数：40期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(204, 'sh11x5', '上海11选5', 'high', 2, 45, 0, 0, 0, 0, -70, 100000, 0, 1, '开奖时间：9点至0点，20分钟一期，每日期数：45', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(205, 'sd11x5', '山东11选5', 'high', 2, 43, 0, 0, 0, 0, -70, 100000, 0, 1, '开奖时间：8点40分至23点00分，20分钟一期，每日期数：43', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(206, 'ln11x5', '辽宁11选5', 'high', 2, 41, 0, 0, 0, 0, -70, 100000, 0, 1, '开奖时间：8点49分至22点29分，开奖频率：20分钟一期，每日期数：41期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(301, 'jsk3', '江苏快3', 'high', 3, 41, 0, 0, 0, 0, -70, 100000, 0, 0, '开奖时间：8点30分至22点10分，开奖频率：20分钟一期，每日期数：41期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(302, 'ahk3', '安徽快3', 'high', 3, 40, 0, 0, 0, 0, -70, 100000, 0, 0, '开奖时间：8点40分至22点，开奖频率：20分钟一期，每日期数：40期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(303, 'hbk3', '湖北快3', 'high', 3, 39, 0, 0, 0, 0, -70, 100000, 0, 1, '开奖时间：9点至22点，开奖频率：20分钟一期，每日期数：39期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(304, 'jlk3', '吉林快3', 'high', 3, 41, 0, 0, 0, 0, -70, 100000, 0, 1, '开奖时间：8点20分至22点，开奖频率：20分钟一期，每日期数：41期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(401, 'fc3d', '福彩3D', 'low', 4, 1, -2400, 1920, 1880, 1860, -70, 100000, 0, 0, '开奖时间：20点30分，开奖频率：一天一期，每日期数：1期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(402, 'pl3', '排列三', 'low', 4, 1, -2700, 1920, 1880, 1860, -70, 100000, 0, 0, '开奖时间：20点30分，开奖频率：一天一期，每日期数：1期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', ''),
(501, 'bjkl8', '北京快乐8', 'high', 5, 179, 130, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：9点至24点，开奖频率：5分钟一期，每日期数：179期。', NULL, '2023-02-24 15:54:43', NULL, 0, 0, '', ''),
(502, 'hgkl8', '韩国快乐8', 'high', 5, 880, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：凌晨0点至5点，7点至24点，开奖频率：90秒一期，凌晨200期，7点后680期，每日期数：880期。', NULL, '2023-02-24 15:54:42', NULL, 0, 0, '', ''),
(503, 'twkl8', '台湾快乐8', 'high', 5, 203, 90, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：7点至24点，开奖频率：5分钟一期，每日期数：203期。', NULL, '2023-02-24 15:54:41', NULL, 0, 0, '', ''),
(504, 'jpkl8', '东京快乐8', 'high', 5, 920, 15, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：凌晨0点到7点，8点至24点，开奖频率：90秒一期，凌晨320期，8点后600期，每日期数：920期。', NULL, '2023-02-24 15:54:39', NULL, 0, 0, '', ''),
(505, 'sgkl8', '新加坡快乐8', 'high', 5, 660, 20, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：凌晨0点到6点，8点至24点，开奖频率：2分钟一期，凌晨180期，8点后480期，每日期数：660期。', NULL, '2023-02-24 15:54:36', NULL, 0, 0, '', ''),
(601, 'bjpk10', '北京PK拾', 'high', 6, 44, 0, 0, 0, 0, -10, 100000, 0, 0, '开奖时间：9点10分至23点50分，20分钟一期，每日期数：44', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(602, 'qqmin', '腾讯分分彩', 'high', 1, 1440, 7, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-02-24 21:06:33', NULL, 1, 0, '', ''),
(603, 't1s60h', '河内分分彩', 'self', 1, 1440, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-02-24 21:06:33', NULL, 0, 0, '', ''),
(604, 'pcdd', 'PC蛋蛋', 'low', 4, 179, 0, 1920, 1920, 1920, -70, 100000, 0, 0, '开奖时间：每日9点05分到23点55分，开奖频率：5分钟一期，每日期数：179期。', NULL, '2023-02-24 21:06:10', NULL, 0, 0, '', '');

-- --------------------------------------------------------

--
-- 表的结构 `game_method`
--

CREATE TABLE IF NOT EXISTS `game_method` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `groupName` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `methodName` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `minRecord` int(11) NOT NULL,
  `maxRecord` int(11) NOT NULL,
  `totalRecord` int(11) NOT NULL,
  `sort` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `bonus` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oooNums` int(11) NOT NULL,
  `oooBonus` int(11) NOT NULL,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `game_method`
--

INSERT INTO `game_method` (`id`, `type`, `groupName`, `name`, `methodName`, `minRecord`, `maxRecord`, `totalRecord`, `sort`, `status`, `bonus`, `oooNums`, `oooBonus`, `updateTime`) VALUES
(1, 1, '五星', '直选复式', 'wxzhixfs', 1, 8001, 100000, 0, 1, '0.01', 10000, 20000, '2023-02-24 15:17:37'),
(2, 1, '五星', '直选单式', 'wxzhixds', 1, 8001, 100000, 0, 1, '0.01', 10000, 20000, '2023-01-09 18:34:49'),
(3, 1, '五星', '直选组合', 'wxzhixzh', 0, 0, 0, 0, 1, '0.01', 0, 0, '2023-01-09 18:34:54'),
(4, 1, '五星', '组选120', 'wxzux120', 0, 0, 0, 0, 1, '1.20', 25, 20000, '2023-01-09 18:34:56'),
(5, 1, '五星', '组选60', 'wxzux60', 0, 0, 0, 0, 1, '0.60', 84, 20000, '2023-01-09 17:30:17'),
(6, 1, '五星', '组选30', 'wxzux30', 0, 0, 0, 0, 1, '0.30', 36, 20000, '2023-01-09 17:30:36'),
(7, 1, '五星', '组选20', 'wxzux20', 0, 0, 0, 0, 1, '0.20', 360, 20000, '2023-02-24 15:36:17'),
(8, 1, '五星', '组选10', 'wxzux10', 0, 0, 0, 0, 1, '0.10', 90, 20000, '2023-02-24 15:36:18'),
(9, 1, '五星', '组选5', 'wxzux5', 0, 0, 0, 0, 1, '0.05', 90, 20000, '2023-02-24 15:36:18'),
(10, 1, '后四星', '直选复式', 'sixzhixfsh', 1, 8001, 0, 0, 1, '0.10', 1000, 20000, '2023-02-24 15:36:22'),
(11, 1, '后四星', '直选单式', 'sixzhixdsh', 1, 8001, 0, 0, 1, '0.10', 1000, 20000, '2023-01-09 17:30:24'),
(12, 1, '后四星', '直选组合', 'sixzhixzhh', 0, 0, 0, 0, 1, '0.10', 0, 0, '2023-01-09 17:30:25'),
(13, 1, '后四星', '组选24', 'sixzux24h', 0, 0, 0, 0, 0, '2.40', 21, 20000, '2023-02-24 15:36:29'),
(14, 1, '后四星', '组选12', 'sixzux12h', 0, 0, 0, 0, 0, '1.20', 36, 20000, '2023-02-24 15:36:28'),
(15, 1, '后四星', '组选6', 'sixzux6h', 0, 0, 0, 0, 0, '0.60', 45, 20000, '2023-02-24 15:36:27'),
(16, 1, '后四星', '组选4', 'sixzux4h', 0, 0, 0, 0, 0, '0.40', 90, 20000, '2023-02-24 15:36:31'),
(17, 1, '前四星', '直选复式', 'sixzhixfsq', 0, 8000, 0, 0, -1, '0.10', 1000, 20000, '2023-03-03 13:59:41'),
(18, 1, '前四星', '直选单式', 'sixzhixdsq', 0, 8000, 0, 0, -1, '0.10', 1000, 20000, '2023-03-03 13:59:42'),
(19, 1, '前四星', '直选组合', 'sixzhixzhq', 0, 0, 0, 0, 1, '0.10', 0, 0, '2023-12-31 12:02:03'),
(20, 1, '前四星', '组选24', 'sixzux24q', 0, 0, 0, 0, 1, '2.40', 21, 20000, '2023-09-11 13:28:10'),
(21, 1, '前四星', '组选12', 'sixzux12q', 0, 0, 0, 0, 1, '1.20', 36, 20000, '2023-09-11 13:28:13'),
(22, 1, '前四星', '组选6', 'sixzux6q', 0, 0, 0, 0, 1, '0.60', 45, 20000, '2023-09-11 13:28:13'),
(23, 1, '前四星', '组选4', 'sixzux4q', 0, 0, 0, 0, 1, '0.40', 90, 20000, '2023-09-11 13:28:14'),
(24, 1, '后三码', '直选复式', 'sxzhixfsh', 1, 801, 0, 0, 0, '1.00', 100, 20000, '2023-05-24 03:08:21'),
(25, 1, '后三码', '直选单式', 'sxzhixdsh', 1, 801, 0, 0, 0, '1.00', 100, 20000, '2023-05-24 03:08:26'),
(26, 1, '后三码', '直选和值', 'sxzhixhzh', 1, 801, 0, 0, 1, '1.00', 100, 20000, '2023-02-24 15:37:18'),
(27, 1, '后三码', '组三', 'sxzuxzsh', 0, 73, 0, 0, 0, '3.00', 9, 20000, '2023-06-05 05:00:44'),
(28, 1, '后三码', '组六', 'sxzuxzlh', 0, 85, 0, 0, 0, '6.00', 12, 20000, '2023-06-05 04:59:53'),
(29, 1, '后三码', '混合组选', 'sxhhzxh', 0, 0, 0, 0, 0, '6.00', 21, 20000, '2023-03-03 13:59:54'),
(30, 1, '中三码', '直选复式', 'sxzhixfsz', 1, 801, 0, 0, 0, '1.00', 100, 20000, '2023-05-24 03:10:55'),
(31, 1, '中三码', '直选单式', 'sxzhixdsz', 1, 801, 0, 0, 0, '1.00', 100, 20000, '2023-05-24 03:10:59'),
(32, 1, '中三码', '直选和值', 'sxzhixhzz', 1, 801, 0, 0, 1, '1.00', 100, 20000, '2023-09-18 14:27:13'),
(33, 1, '中三码', '组三', 'sxzuxzsz', 0, 57, 0, 0, 0, '3.00', 9, 20000, '2023-05-24 03:12:45'),
(34, 1, '中三码', '组六', 'sxzuxzlz', 0, 57, 0, 0, 0, '6.00', 12, 20000, '2023-05-24 03:12:10'),
(35, 1, '中三码', '混合组选', 'sxhhzxz', 0, 0, 0, 0, 0, '6.00', 21, 20000, '2023-03-03 14:00:00'),
(36, 1, '前三码', '直选复式', 'sxzhixfsq', 1, 800, 0, 0, 0, '1.00', 100, 20000, '2023-03-03 14:00:01'),
(37, 1, '前三码', '直选单式', 'sxzhixdsq', 1, 800, 0, 0, 0, '1.00', 100, 20000, '2023-03-03 14:00:02'),
(38, 1, '前三码', '直选和值', 'sxzhixhzq', 1, 800, 0, 0, 1, '1.00', 100, 20000, '2023-09-18 14:26:12'),
(39, 1, '前三码', '组三', 'sxzuxzsq', 0, 57, 0, 0, 0, '3.00', 9, 20000, '2023-05-24 03:16:16'),
(40, 1, '前三码', '组六', 'sxzuxzlq', 0, 57, 0, 0, 0, '6.00', 12, 20000, '2023-05-24 03:16:26'),
(41, 1, '前三码', '混合组选', 'sxhhzxq', 0, 0, 0, 0, 0, '6.00', 21, 20000, '2023-03-03 14:00:07'),
(42, 1, '后二星', '直选复式', 'exzhixfsh', 1, 81, 0, 0, 0, '10.00', 10, 20000, '2023-05-24 03:17:33'),
(43, 1, '后二星', '直选单式', 'exzhixdsh', 1, 81, 0, 0, 0, '10.00', 10, 20000, '2023-05-24 03:17:38'),
(44, 1, '后二星', '直选和值', 'exzhixhzh', 1, 81, 0, 0, 0, '10.00', 10, 20000, '2023-05-24 03:17:43'),
(45, 1, '后二星', '大小单双', 'dxdsh', 0, 0, 0, 0, 0, '250.00', 0, 0, '2023-03-03 14:00:11'),
(46, 1, '后二星', '组选复式', 'exzuxfsh', 0, 29, 0, 0, 0, '20.00', 4, 20000, '2023-05-23 15:18:51'),
(47, 1, '后二星', '组选单式', 'exzuxdsh', 0, 29, 0, 0, 0, '20.00', 4, 20000, '2023-05-24 02:39:06'),
(48, 1, '前二星', '直选复式', 'exzhixfsq', 1, 80, 0, 0, 0, '10.00', 10, 20000, '2023-03-03 14:00:14'),
(49, 1, '前二星', '直选单式', 'exzhixdsq', 1, 80, 0, 0, 0, '10.00', 10, 20000, '2023-03-03 14:00:15'),
(50, 1, '前二星', '直选和值', 'exzhixhzq', 1, 80, 0, 0, 0, '10.00', 10, 20000, '2023-03-03 14:00:16'),
(51, 1, '前二星', '大小单双', 'dxdsq', 0, 50, 0, 0, 0, '250.00', 0, 0, '2023-05-24 03:18:40'),
(52, 1, '前二星', '组选复式', 'exzuxfsq', 0, 29, 0, 0, 0, '20.00', 4, 20000, '2023-05-24 02:38:46'),
(53, 1, '前二星', '组选单式', 'exzuxdsq', 0, 29, 0, 0, 0, '20.00', 4, 20000, '2023-05-24 02:38:57'),
(54, 1, '定位胆', '定位胆', 'dw', 0, 46, 0, 0, 0, '100.00', 1, 20000, '2023-05-24 04:00:27'),
(55, 1, '不定胆', '后三一码', 'bdw1mh', 0, 0, 0, 0, 0, '271.00', 0, 0, '2023-03-03 14:00:22'),
(56, 1, '不定胆', '中三一码', 'bdw1mz', 0, 0, 0, 0, 0, '271.00', 0, 0, '2023-03-03 14:00:23'),
(57, 1, '不定胆', '前三一码', 'bdw1mq', 0, 0, 0, 0, 0, '271.00', 0, 0, '2023-03-03 14:00:24'),
(58, 1, '不定胆', '后三二码', 'bdw2mh', 0, 46, 0, 0, 0, '54.00', 0, 0, '2023-05-24 03:23:18'),
(59, 1, '不定胆', '中三二码', 'bdw2mz', 0, 46, 0, 0, 0, '54.00', 0, 0, '2023-05-24 03:23:24'),
(60, 1, '不定胆', '前三二码', 'bdw2mq', 0, 46, 0, 0, 0, '54.00', 0, 0, '2023-05-24 03:23:30'),
(61, 1, '任选', '任二直选复式', 'rx2fs', 0, 1001, 0, 0, 0, '10.00', 10, 20000, '2023-05-24 03:25:33'),
(62, 1, '任选', '任三直选复式', 'rx3fs', 0, 801, 0, 0, 1, '1.00', 100, 20000, '2023-09-11 14:40:29'),
(63, 1, '任选', '任四直选复式', 'rx4fs', 0, 0, 0, 0, 1, '0.10', 1000, 20000, '2023-09-11 14:36:35'),
(64, 1, '任选', '任二直选单式', 'rx2ds', 0, 0, 0, 0, 1, '10.00', 10, 20000, '2023-09-11 14:37:06'),
(65, 1, '任选', '任三直选单式', 'rx3ds', 0, 0, 0, 0, 1, '1.00', 100, 20000, '2023-09-11 14:37:39'),
(66, 1, '任选', '任四直选单式', 'rx4ds', 0, 80001, 0, 0, 1, '0.10', 1000, 20000, '2023-09-11 14:41:37'),
(67, 1, '任选', '任三组三', 'rx3z3', 0, 0, 0, 0, 1, '3.00', 9, 20000, '2023-09-11 14:37:45'),
(68, 1, '任选', '任三组六', 'rx3z6', 0, 0, 0, 0, 1, '6.00', 12, 20000, '2023-09-11 14:37:51'),
(69, 1, '任选', '任二组选', 'rx2zx', 0, 46, 0, 0, 1, '20.00', 4, 20000, '2023-09-19 04:14:49'),
(70, 1, '趣味', '一帆风顺', 'qwyffs', 0, 9, 0, 0, 0, '409.50', 0, 0, '2023-09-11 12:03:41'),
(71, 1, '趣味', '好事成双', 'qwhscs', 0, 0, 0, 0, 0, '81.45', 2, 20000, '2023-03-03 14:00:39'),
(72, 1, '趣味', '三星报喜', 'qwsxbx', 0, 0, 0, 0, 0, '8.56', 10, 20000, '2023-03-03 14:00:40'),
(73, 1, '趣味', '四季发财', 'qwsjfc', 0, 8, 0, 0, 1, '0.46', 10, 20000, '2023-09-13 01:29:50'),
(74, 2, '三码', '前三直选复式', 'sanmzhixfsq', 1, 801, 0, 0, 0, '1.01', 99, 20000, '2023-05-24 03:31:37'),
(75, 2, '三码', '前三直选单式', 'sanmzhixdsq', 1, 801, 0, 0, 0, '1.01', 99, 20000, '2023-05-24 03:31:42'),
(76, 2, '三码', '前三组选复式', 'sanmzuxfsq', 0, 801, 0, 0, 0, '6.06', 17, 20000, '2023-05-24 03:36:00'),
(77, 2, '三码', '前三组选单式', 'sanmzuxdsq', 0, 1000, 0, 0, 0, '6.06', 17, 20000, '2023-05-24 03:36:46'),
(78, 2, '二码', '前二直选复式', 'ermzhixfsq', 0, 29, 0, 0, 0, '9.09', 11, 20000, '2023-05-24 03:37:09'),
(79, 2, '二码', '前二直选单式', 'ermzhixdsq', 0, 0, 0, 0, 0, '9.09', 11, 20000, '2023-05-24 03:56:34'),
(80, 2, '二码', '前二组选复式', 'ermzuxfsq', 0, 29, 0, 0, 0, '18.182', 6, 20000, '2023-05-24 03:38:35'),
(81, 2, '二码', '前二组选单式', 'ermzuxdsq', 0, 29, 0, 0, 0, '18.182', 6, 20000, '2023-05-24 03:38:42'),
(82, 2, '不定胆', '前三位', 'bdw', 0, 100, 0, 0, 0, '272.73', 0, 0, '2023-05-24 03:41:06'),
(83, 2, '定位胆', '定位胆', 'dwd', 0, 46, 0, 0, 0, '90.91', 0, 0, '2023-05-24 04:02:59'),
(84, 2, '趣味', '定单双', 'dds', 0, 0, 0, 0, 0, '13.00,162.30,433.62,325.04,64.95,2.165', 0, 0, '2023-03-03 14:00:53'),
(85, 2, '趣味', '猜中位', 'czw', 0, 0, 0, 0, 0, '60.61,136.40,194.84,216.58', 0, 0, '2023-03-03 14:00:54'),
(86, 2, '任选', '一中一复式', 'rx1fs', 0, 0, 0, 0, 0, '454.55', 0, 0, '2023-03-03 14:00:56'),
(87, 2, '任选', '一中一单式', 'rx1ds', 0, 0, 0, 0, 0, '454.55', 0, 0, '2023-03-03 14:00:57'),
(88, 2, '任选', '二中二复式', 'rx2fs', 0, 0, 0, 0, 0, '181.82', 0, 0, '2023-03-03 14:00:58'),
(89, 2, '任选', '二中二单式', 'rx2ds', 0, 0, 0, 0, 0, '181.82', 0, 0, '2023-03-03 14:00:59'),
(90, 2, '任选', '三中三复式', 'rx3fs', 0, 0, 0, 0, 0, '60.60', 10, 20000, '2023-03-03 14:01:00'),
(91, 2, '任选', '三中三单式', 'rx3ds', 0, 0, 0, 0, 0, '60.60', 10, 20000, '2023-03-03 14:01:01'),
(92, 2, '任选', '四中四复式', 'rx4fs', 0, 0, 0, 0, 0, '15.15', 5, 20000, '2023-09-10 01:49:52'),
(93, 2, '任选', '四中四单式', 'rx4ds', 0, 0, 0, 0, 0, '15.15', 5, 20000, '2023-03-03 14:01:03'),
(94, 2, '任选', '五中五复式', 'rx5fs', 0, 0, 0, 0, 0, '2.182', 21, 20000, '2023-09-10 01:49:22'),
(95, 2, '任选', '五中五单式', 'rx5ds', 0, 0, 0, 0, 0, '2.182', 21, 20000, '2023-09-10 01:49:53'),
(96, 2, '任选', '六中五复式', 'rx6fs', 0, 0, 0, 0, 0, '12.99', 7, 20000, '2023-09-10 01:49:48'),
(97, 2, '任选', '六中五单式', 'rx6ds', 0, 0, 0, 0, 0, '12.99', 7, 20000, '2023-03-03 14:01:07'),
(98, 2, '任选', '七中五复式', 'rx7fs', 0, 0, 0, 0, 0, '45.455', 1, 20000, '2023-09-10 01:49:48'),
(99, 2, '任选', '七中五单式', 'rx7ds', 0, 0, 0, 0, 0, '45.455', 1, 20000, '2023-03-03 14:01:09'),
(100, 2, '任选', '八中五复式', 'rx8fs', 0, 0, 0, 0, 0, '121.22', 0, 0, '2023-03-03 14:01:10'),
(101, 2, '任选', '八中五单式', 'rx8ds', 0, 0, 0, 0, 0, '121.22', 0, 0, '2023-03-03 14:01:11'),
(102, 3, '二不同号', '标准选号', 'ebthdx', 0, 0, 0, 0, 0, '175.00', 0, 100000, '2023-03-03 14:01:13'),
(103, 3, '二不同号', '手动选号', 'ebthds', 0, 0, 0, 0, 0, '175.00', 0, 100000, '2023-03-03 14:01:14'),
(104, 3, '二不同号', '胆施选号', 'ebthdt', 0, 0, 0, 0, 0, '175.00', 0, 100000, '2023-03-03 14:01:15'),
(105, 3, '二同号', '标准选号', 'ethdx', 0, 0, 0, 0, 0, '19.30', 0, 100000, '2023-03-03 14:01:16'),
(106, 3, '二同号', '手动选号', 'ethds', 0, 0, 0, 0, 0, '19.30', 0, 100000, '2023-03-03 14:01:17'),
(107, 3, '二同号', '二同号复选', 'ethfx', 0, 0, 0, 0, 0, '96.50', 0, 100000, '2023-03-03 14:01:18'),
(108, 3, '三不同号', '标准选号', 'sbthdx', 0, 0, 0, 0, 0, '38.6', 0, 100000, '2023-03-03 14:01:19'),
(109, 3, '三不同号', '手动选号', 'sbthds', 0, 0, 0, 0, 0, '38.6', 0, 100000, '2023-03-03 14:01:20'),
(110, 3, '三同号', '单选', 'sthdx', 0, 0, 0, 0, 0, '6.00', 0, 100000, '2023-03-03 14:01:21'),
(111, 3, '三同号', '通选', 'sthtx', 0, 0, 0, 0, 0, '38.60', 0, 100000, '2023-03-03 14:01:22'),
(112, 3, '三连号', '通选', 'slhtx', 0, 0, 0, 0, 0, '148.00', 0, 100000, '2023-03-03 14:01:23'),
(113, 3, '和值', '和值', 'hezhi', 0, 0, 0, 0, 0, '6.00,17.6,35.00,64.00,96.50,133.00,148.5,168.00', 0, 100000, '2023-03-03 14:01:24'),
(114, 4, '三码', '直选复式', 'sanxzhixfs', 0, 800, 0, 0, 0, '1.00', 100, 20000, '2023-09-09 13:21:58'),
(115, 4, '三码', '直选单式', 'sanxzhixds', 0, 800, 0, 0, 0, '1.00', 100, 20000, '2023-09-09 13:21:51'),
(116, 4, '三码', '直选和值', 'sanxzhixhz', 0, 800, 0, 0, 0, '1.00', 100, 20000, '2023-10-17 08:34:52'),
(117, 4, '三码', '组三', 'sanxzs', 0, 0, 0, 0, 0, '3.00', 9, 20000, '2023-03-03 14:01:29'),
(118, 4, '三码', '组六', 'sanxzl', 0, 0, 0, 0, 0, '6.00', 12, 20000, '2023-03-03 14:01:30'),
(119, 4, '三码', '混合组选', 'sanxhhzx', 0, 0, 0, 0, 0, '6.00', 21, 20000, '2023-03-03 14:01:32'),
(120, 4, '后二码', '直选复式', 'exzhixfsh', 0, 80, 0, 0, 0, '10.00', 10, 20000, '2023-03-03 14:01:33'),
(121, 4, '后二码', '直选单式', 'exzhixdsh', 0, 80, 0, 0, 0, '10.00', 10, 20000, '2023-03-03 14:01:34'),
(122, 4, '后二码', '直选和值', 'exzhixhzh', 0, 80, 0, 0, 0, '10.00', 10, 20000, '2023-09-09 04:30:02'),
(123, 4, '后二码', '组选复式', 'exzuxfsh', 0, 29, 0, 0, 0, '20.00', 4, 20000, '2023-06-05 04:58:26'),
(124, 4, '后二码', '组选单式', 'exzuxdsh', 0, 29, 0, 0, 0, '20.00', 4, 20000, '2023-06-05 04:58:21'),
(125, 4, '前二码', '直选复式', 'exzhixfsq', 0, 81, 0, 0, 0, '10.00', 10, 20000, '2023-06-05 04:58:16'),
(126, 4, '前二码', '直选单式', 'exzhixdsq', 0, 81, 0, 0, 0, '10.00', 10, 20000, '2023-06-05 04:58:10'),
(127, 4, '前二码', '直选和值', 'exzhixhzq', 0, 81, 0, 0, 0, '10.00', 10, 20000, '2023-06-05 04:58:05'),
(128, 4, '前二码', '组选复式', 'exzuxfsq', 0, 29, 0, 0, 0, '20.00', 4, 20000, '2023-06-05 04:57:59'),
(129, 4, '前二码', '组选单式', 'exzuxdsq', 0, 29, 0, 0, 0, '20.00', 4, 20000, '2023-06-05 04:57:54'),
(130, 4, '定位胆', '定位胆', 'dwd', 0, 8, 0, 0, 0, '100.00', 1, 20000, '2023-03-03 14:01:43'),
(131, 4, '不定胆', '一码不定胆', 'yimabdw', 0, 0, 0, 0, 0, '271.00', 0, 0, '2023-03-03 14:01:44'),
(132, 5, '趣味', '和值单双', 'hezhids', 0, 0, 0, 0, 1, '567.00', 0, 100000, '2023-12-31 11:55:56'),
(133, 5, '趣味', '和值大小', 'hezhidx', 0, 0, 0, 0, 1, '567.00,9.65,567.00', 0, 100000, '2023-12-31 11:56:44'),
(134, 5, '趣味', '奇偶盘', 'jopan', 0, 0, 0, 0, 0, '567.00,225.00,567.00', 0, 100000, '2023-03-03 14:01:47'),
(135, 5, '趣味', '上下盘', 'sxpan', 0, 0, 0, 0, 0, '567.00,225.00,567.00', 0, 100000, '2023-03-03 14:01:48'),
(136, 5, '趣味', '和值大小盘', 'hzdxds', 0, 0, 0, 0, 0, '284.00', 0, 100000, '2023-03-03 14:01:49'),
(137, 5, '任选', '任选1', 'rx1', 0, 0, 0, 0, 0, '300.00', 0, 100000, '2023-03-03 14:01:51'),
(138, 5, '任选', '任选2', 'rx2', 0, 0, 0, 0, 0, '77.00', 0, 100000, '2023-03-03 14:01:51'),
(139, 5, '任选', '任选3', 'rx3', 0, 0, 0, 0, 0, '48.00', 0, 100000, '2023-03-03 14:01:53'),
(140, 5, '任选', '任选4', 'rx4', 0, 0, 0, 0, 0, '17.50', 0, 100000, '2023-03-03 14:01:54'),
(141, 5, '任选', '任选5', 'rx5', 0, 0, 0, 0, 0, '3.20', 0, 100000, '2023-03-03 14:01:55'),
(142, 5, '任选', '任选6', 'rx6', 0, 0, 0, 0, 0, '1.93', 0, 100000, '2023-03-03 14:01:56'),
(143, 5, '任选', '任选7', 'rx7', 0, 0, 0, 0, 0, '0.193', 0, 100000, '2023-03-03 14:01:57'),
(144, 5, '五行', '五行', 'hezhiwx', 0, 0, 0, 0, 0, '224.00,438.00,840.00,438.00,224.00', 0, 100000, '2023-03-03 14:01:58'),
(145, 6, '前一', '前一', 'qianyi', 0, 8, 0, 0, 0, '100.00', 1, 20000, '2023-03-03 14:01:59'),
(146, 6, '前二', '前二复式', 'qianerzxfs', 0, 72, 0, 0, 0, '11.12', 9, 20000, '2023-03-03 14:02:00'),
(147, 6, '前二', '前二单式', 'qianerzxds', 0, 72, 0, 0, 0, '11.12', 9, 20000, '2023-03-03 14:02:01'),
(148, 6, '前三', '前三复式', 'qiansanzxfs', 0, 576, 0, 0, 0, '1.389', 72, 20000, '2023-03-03 14:02:03'),
(149, 6, '前三', '前三单式', 'qiansanzxds', 0, 576, 0, 0, 0, '1.389', 72, 20000, '2023-03-03 14:02:04'),
(150, 6, '定位胆', '定位胆', 'dingweidan', 0, 8, 0, 0, 0, '100.00', 1, 20000, '2023-05-23 03:53:37'),
(151, 6, '定位胆', '第1~5名', 'dwqian', 0, 0, 0, 0, 0, '100.00', 1, 20000, '2023-03-03 14:02:06'),
(152, 6, '定位胆', '第6~10名', 'dwhou', 0, 0, 0, 0, 0, '100.00', 1, 20000, '2023-03-03 14:02:07'),
(153, 6, '大小', '第一名', 'dxd1', 0, 0, 0, 0, 0, '500', 0, 100000, '2023-03-03 14:02:08'),
(154, 6, '大小', '第二名', 'dxd2', 0, 0, 0, 0, 0, '500', 0, 100000, '2023-03-03 14:02:09'),
(155, 6, '大小', '第三名', 'dxd3', 0, 0, 0, 0, 0, '500', 0, 100000, '2023-03-03 14:02:10'),
(156, 6, '单双', '第一名', 'dsd1', 0, 0, 0, 0, 0, '500', 0, 100000, '2023-03-03 14:02:11'),
(157, 6, '单双', '第二名', 'dsd2', 0, 0, 0, 0, 0, '500', 0, 100000, '2023-03-03 14:02:13'),
(158, 6, '单双', '第三名', 'dsd3', 0, 0, 0, 0, 0, '500', 0, 100000, '2023-03-03 14:02:14'),
(159, 1, '龙虎', '万千', 'lhwq', 0, 0, 0, 0, 0, '450,100,450', 0, 0, '2023-03-03 14:02:15'),
(160, 1, '龙虎', '万百', 'lhwb', 0, 0, 0, 0, 0, '450,100,450', 0, 0, '2023-03-03 14:02:16'),
(161, 1, '龙虎', '万个', 'lhwg', 0, 0, 0, 0, 0, '450,100,450', 0, 0, '2023-03-03 14:02:17'),
(162, 1, '龙虎', '万十', 'lhws', 0, 3, 0, 0, 0, '450,100,450', 0, 0, '2023-05-23 14:58:02'),
(163, 1, '龙虎', '千百', 'lhqb', 0, 0, 0, 0, 0, '450,100,450', 0, 0, '2023-03-03 14:02:19'),
(164, 1, '龙虎', '千个', 'lhqg', 0, 0, 0, 0, 0, '450,100,450', 0, 0, '2023-03-03 14:02:20'),
(165, 1, '龙虎', '千十', 'lhqs', 0, 0, 0, 0, 0, '450,100,450', 0, 0, '2023-03-03 14:02:21'),
(166, 1, '龙虎', '百十', 'lhbs', 0, 0, 0, 0, 0, '450,100,450', 0, 0, '2023-03-03 14:02:22'),
(167, 1, '龙虎', '百个', 'lhbg', 0, 0, 0, 0, 0, '450,100,450', 0, 0, '2023-03-03 14:02:23'),
(168, 1, '龙虎', '十个', 'lhsg', 0, 0, 0, 0, 0, '450,100,450', 0, 0, '2023-03-03 14:02:24'),
(169, 1, '跨度', '前三跨度', 'kdqs', 0, 800, 0, 0, 0, '1.00', 100, 20000, '2023-03-03 14:02:25'),
(170, 1, '跨度', '中三跨度', 'kdzs', 0, 800, 0, 0, 0, '1.00', 100, 20000, '2023-03-03 14:02:26'),
(171, 1, '跨度', '后三跨度', 'kdhs', 0, 800, 0, 0, 0, '1.00', 100, 20000, '2023-03-03 14:02:27'),
(172, 1, '跨度', '前二跨度', 'kdqe', 0, 80, 0, 0, 0, '10.00', 10, 20000, '2023-03-03 14:02:29'),
(173, 1, '跨度', '后二跨度', 'kdhe', 0, 80, 0, 0, 0, '10.00', 10, 20000, '2023-03-03 14:02:30'),
(174, 1, '任选', '任三混合', 'rx3hh', 0, 0, 0, 0, 0, '6.0', 21, 20000, '2023-03-03 14:02:31'),
(175, 1, '五星', '不定位1码', 'wxbdw1m', 0, 0, 0, 0, 1, '409.50', 0, 0, '2023-09-09 05:49:19'),
(176, 1, '五星', '不定位2码', 'wxbdw2m', 0, 0, 0, 0, 1, '146.70', 4, 20000, '2023-09-09 05:49:22'),
(177, 1, '五星', '不定位3码', 'wxbdw3m', 0, 0, 0, 0, 1, '43.50', 12, 20000, '2023-09-09 05:49:24'),
(178, 1, '五星', '和值大小单双', 'wxhzdxds', 0, 0, 0, 0, 1, '500.00', 0, 0, '2023-09-09 08:41:36'),
(179, 6, '大小', '第四名', 'dxd4', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:36'),
(181, 6, '大小', '第五名', 'dxd5', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:37'),
(183, 6, '大小', '第六名', 'dxd6', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:38'),
(185, 6, '大小', '第七名', 'dxd7', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:40'),
(187, 6, '大小', '第八名', 'dxd8', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:40'),
(189, 6, '大小', '第九名', 'dxd9', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:42'),
(191, 6, '大小', '第十名', 'dxd10', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:43'),
(193, 6, '单双', '第四名', 'dsd4', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:44'),
(195, 6, '单双', '第五名', 'dsd5', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:45'),
(197, 6, '单双', '第六名', 'dsd6', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:46'),
(199, 6, '单双', '第七名', 'dsd7', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:47'),
(201, 6, '单双', '第八名', 'dsd8', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:48'),
(203, 6, '单双', '第九名', 'dsd9', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:49'),
(205, 6, '单双', '第十名', 'dsd10', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:50'),
(207, 6, '龙虎', '第一名', 'lhd1', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:51'),
(209, 6, '龙虎', '第二名', 'lhd2', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:52'),
(211, 6, '龙虎', '第三名', 'lhd3', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:53'),
(213, 6, '龙虎', '第四名', 'lhd4', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:54'),
(215, 6, '龙虎', '第五名', 'lhd5', 0, 0, 0, 0, 0, '500', 0, 200000, '2023-03-03 14:02:55'),
(217, 6, '前二', '前二和值', 'qianerhz', 0, 0, 0, 0, 0, '11.12', 4, 20000, '2023-03-03 14:02:56'),
(219, 6, '前三', '前三和值', 'qiansanhz', 0, 0, 0, 0, 0, '1.389', 10, 30000, '2023-03-03 14:02:57'),
(221, 6, '前四', '前四单式', 'qiansizxds', 0, 4032, 0, 0, 0, '0.198', 100, 30000, '2023-05-23 03:54:01'),
(223, 6, '前四', '前四复式', 'qiansizxfs', 0, 4032, 0, 0, 0, '0.198', 100, 30000, '2023-05-23 03:54:02'),
(225, 6, '前五', '前五单式', 'qianwuzxds', 0, 24192, 0, 0, 0, '0.033', 1000, 30000, '2023-05-23 03:54:02'),
(227, 6, '前五', '前五复式', 'qianwuzxfs', 0, 24192, 0, 0, 0, '0.033', 1000, 30000, '2023-05-23 03:54:03'),
(229, 1, '新龙虎', '百个', 'xlhbg', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:07'),
(231, 1, '新龙虎', '百十', 'xlhbs', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:10'),
(233, 1, '新龙虎', '千百', 'xlhqb', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:11'),
(235, 1, '新龙虎', '千个', 'xlhqg', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:13'),
(237, 1, '新龙虎', '千十', 'xlhqs', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:14'),
(239, 1, '新龙虎', '十个', 'xlhsg', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:16'),
(241, 1, '新龙虎', '万百', 'xlhwb', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:17'),
(243, 1, '新龙虎', '万个', 'xlhwg', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:19'),
(245, 1, '新龙虎', '万千', 'xlhwq', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:20'),
(247, 1, '新龙虎', '万十', 'xlhws', 0, 0, 0, 0, 0, '500', 0, 0, '2023-05-10 15:06:22');

-- --------------------------------------------------------

--
-- 表的结构 `game_method_limit`
--

CREATE TABLE IF NOT EXISTS `game_method_limit` (
  `id` int(11) NOT NULL,
  `lottery` varchar(16) NOT NULL,
  `method` varchar(16) NOT NULL,
  `rule` int(11) NOT NULL DEFAULT '0' COMMENT '0-禁止，1-允许',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '0-取消，1-生效',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8 COMMENT='玩法限制，暂时使用黑名单模式';

--
-- 转存表中的数据 `game_method_limit`
--

INSERT INTO `game_method_limit` (`id`, `lottery`, `method`, `rule`, `status`, `updateTime`, `user`) VALUES
(1, 't6s300', 'qianyi', 0, 1, '2023-02-25 12:15:25', 'sys'),
(2, 't6s300', 'qianerzxfs', 0, 1, '2023-02-25 12:15:25', 'sys'),
(3, 't6s300', 'qianerzxds', 0, 1, '2023-02-25 12:15:25', 'sys'),
(4, 't6s300', 'qianerhz', 0, 1, '2023-02-25 12:15:25', 'sys'),
(5, 't6s300', 'qiansanzxfs', 0, 1, '2023-02-25 12:15:25', 'sys'),
(6, 't6s300', 'qiansanzxds', 0, 1, '2023-02-25 12:15:25', 'sys'),
(7, 't6s300', 'qiansanhz', 0, 1, '2023-02-25 12:15:25', 'sys'),
(8, 't6s300', 'qiansizxfs', 0, 1, '2023-02-25 12:15:25', 'sys'),
(9, 't6s300', 'qiansizxds', 0, 1, '2023-02-25 12:15:25', 'sys'),
(10, 't6s300', 'qianwuzxfs', 0, 1, '2023-02-25 12:15:25', 'sys'),
(11, 't6s300', 'qianwuzxds', 0, 1, '2023-02-25 12:15:25', 'sys'),
(12, 't6s300', 'dxd1', 0, 1, '2023-02-25 12:15:25', 'sys'),
(13, 't6s300', 'dxd2', 0, 1, '2023-02-25 12:15:25', 'sys'),
(14, 't6s300', 'dxd3', 0, 1, '2023-02-25 12:15:25', 'sys'),
(15, 't6s300', 'dxd4', 0, 1, '2023-02-25 12:15:25', 'sys'),
(16, 't6s300', 'dxd5', 0, 1, '2023-02-25 12:15:25', 'sys'),
(17, 't6s300', 'dxd6', 0, 1, '2023-02-25 12:15:25', 'sys'),
(18, 't6s300', 'dxd7', 0, 1, '2023-02-25 12:15:25', 'sys'),
(19, 't6s300', 'dxd8', 0, 1, '2023-02-25 12:15:25', 'sys'),
(20, 't6s300', 'dxd9', 0, 1, '2023-02-25 12:15:25', 'sys'),
(21, 't6s300', 'dxd10', 0, 1, '2023-02-25 12:15:25', 'sys'),
(22, 't6s300', 'dxd1', 0, 1, '2023-02-25 12:15:25', 'sys'),
(23, 't6s300', 'dxd2', 0, 1, '2023-02-25 12:15:25', 'sys'),
(24, 't6s300', 'dxd3', 0, 1, '2023-02-25 12:15:25', 'sys'),
(25, 't6s300', 'dxd4', 0, 1, '2023-02-25 12:15:25', 'sys'),
(26, 't6s300', 'dxd5', 0, 1, '2023-02-25 12:15:25', 'sys'),
(27, 't6s300', 'dxd6', 0, 1, '2023-02-25 12:15:25', 'sys'),
(28, 't6s300', 'dxd7', 0, 1, '2023-02-25 12:15:25', 'sys'),
(29, 't6s300', 'dxd8', 0, 1, '2023-02-25 12:15:25', 'sys'),
(30, 't6s300', 'dxd9', 0, 1, '2023-02-25 12:15:25', 'sys'),
(31, 't6s300', 'dxd10', 0, 1, '2023-02-25 12:15:25', 'sys'),
(32, 't6s300', 'dsd1', 0, 1, '2023-02-25 12:15:25', 'sys'),
(33, 't6s300', 'dsd2', 0, 1, '2023-02-25 12:15:25', 'sys'),
(34, 't6s300', 'dsd3', 0, 1, '2023-02-25 12:15:25', 'sys'),
(35, 't6s300', 'dsd4', 0, 1, '2023-02-25 12:15:25', 'sys'),
(36, 't6s300', 'dsd5', 0, 1, '2023-02-25 12:15:25', 'sys'),
(37, 't6s300', 'dsd6', 0, 1, '2023-02-25 12:15:25', 'sys'),
(38, 't6s300', 'dsd7', 0, 1, '2023-02-25 12:15:25', 'sys'),
(39, 't6s300', 'dsd8', 0, 1, '2023-02-25 12:15:25', 'sys'),
(40, 't6s300', 'dsd9', 0, 1, '2023-02-25 12:15:25', 'sys'),
(41, 't6s300', 'dsd10', 0, 1, '2023-02-25 12:15:25', 'sys'),
(42, 't6s300', 'dsd1', 0, 1, '2023-02-25 12:15:25', 'sys'),
(43, 't6s300', 'dsd2', 0, 1, '2023-02-25 12:15:25', 'sys'),
(44, 't6s300', 'dsd3', 0, 1, '2023-02-25 12:15:25', 'sys'),
(45, 't6s300', 'dsd4', 0, 1, '2023-02-25 12:15:25', 'sys'),
(46, 't6s300', 'dsd5', 0, 1, '2023-02-25 12:15:25', 'sys'),
(47, 't6s300', 'dsd6', 0, 1, '2023-02-25 12:15:25', 'sys'),
(48, 't6s300', 'dsd7', 0, 1, '2023-02-25 12:15:25', 'sys'),
(49, 't6s300', 'dsd8', 0, 1, '2023-02-25 12:15:25', 'sys'),
(50, 't6s300', 'dsd9', 0, 1, '2023-02-25 12:15:25', 'sys'),
(51, 't6s300', 'dsd10', 0, 1, '2023-02-25 12:15:25', 'sys'),
(52, 't6s300', 'lhd1', 0, 1, '2023-02-25 12:17:18', 'sys'),
(53, 't6s300', 'lhd2', 0, 1, '2023-02-25 12:17:18', 'sys'),
(54, 't6s300', 'lhd3', 0, 1, '2023-02-25 12:17:18', 'sys'),
(55, 't6s300', 'lhd4', 0, 1, '2023-02-25 12:17:18', 'sys'),
(56, 't6s300', 'lhd5', 0, 1, '2023-02-25 12:17:18', 'sys');

-- --------------------------------------------------------

--
-- 表的结构 `game_order`
--

CREATE TABLE IF NOT EXISTS `game_order` (
  `id` int(11) NOT NULL,
  `lottery` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mVirtual` float DEFAULT '0',
  `mDeposit` float DEFAULT '0',
  `issue` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `method` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` double NOT NULL,
  `compress` tinyint(1) NOT NULL,
  `billno` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nums` int(11) DEFAULT NULL,
  `point` double NOT NULL,
  `money` double NOT NULL,
  `winMoney` double DEFAULT '0',
  `openCode` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderTime` datetime DEFAULT NULL,
  `stopTime` datetime DEFAULT NULL,
  `clearTime` datetime DEFAULT NULL,
  `multiple` int(11) NOT NULL,
  `openTime` datetime DEFAULT NULL,
  `cancel` int(11) NOT NULL DEFAULT '0',
  `bonus` float DEFAULT '0',
  `isChase` int(11) NOT NULL DEFAULT '0',
  `chaseId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `links`
--

CREATE TABLE IF NOT EXISTS `links` (
  `id` int(11) NOT NULL,
  `code` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `point` float NOT NULL,
  `expireTime` datetime DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `account` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `logs`
--

CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL,
  `user` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `style` int(11) NOT NULL DEFAULT '0',
  `address` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `money_in`
--

CREATE TABLE IF NOT EXISTS `money_in` (
  `billno` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `account` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `billTime` datetime NOT NULL,
  `actualAmount` double NOT NULL,
  `feeRate` double NOT NULL,
  `feeAmount` double NOT NULL,
  `payTime` datetime DEFAULT NULL,
  `payAction` int(11) NOT NULL DEFAULT '0',
  `confirmTime` datetime DEFAULT NULL,
  `confirmUser` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `pid` int(11) DEFAULT NULL,
  `payType` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `method` int(11) NOT NULL DEFAULT '1',
  `balanceAfter` double DEFAULT '0',
  `readIt` int(11) NOT NULL DEFAULT '0',
  `userInfo` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddr` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `money_out`
--

CREATE TABLE IF NOT EXISTS `money_out` (
  `billno` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` float NOT NULL DEFAULT '0',
  `orderTime` datetime NOT NULL,
  `actualAmount` float NOT NULL,
  `feeRate` float NOT NULL,
  `feeAmount` float DEFAULT NULL,
  `payTime` datetime DEFAULT NULL,
  `payAction` int(11) NOT NULL DEFAULT '0',
  `confirmTime` datetime DEFAULT NULL,
  `confirmUser` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cardId` int(11) NOT NULL,
  `payType` int(11) NOT NULL DEFAULT '0',
  `balanceAfter` float DEFAULT '0',
  `mVirtual` float NOT NULL DEFAULT '0' COMMENT '虚拟账户',
  `mDeposit` float NOT NULL DEFAULT '0' COMMENT '充值账户',
  `payCardId` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankCardId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `readIt` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `notice`
--

CREATE TABLE IF NOT EXISTS `notice` (
  `id` int(11) NOT NULL,
  `title` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(10240) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '0',
  `power` int(11) NOT NULL DEFAULT '0',
  `username` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updateTime` datetime NOT NULL,
  `isTop` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `open_code`
--

CREATE TABLE IF NOT EXISTS `open_code` (
  `id` int(11) NOT NULL,
  `name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `openCode` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `openTime` datetime DEFAULT NULL,
  `oldCode` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `dayTime` datetime NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `stopTime` datetime DEFAULT NULL,
  `clearTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `operation`
--

CREATE TABLE IF NOT EXISTS `operation` (
  `id` int(11) NOT NULL,
  `user` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rfTable` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rfField` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `srcValue` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tarValue` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `pay_method`
--

CREATE TABLE IF NOT EXISTS `pay_method` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1',
  `method` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `minUnitRecharge` float NOT NULL,
  `maxUnitRecharge` float NOT NULL,
  `feeRate` float NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `image` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDefault` int(11) DEFAULT '0',
  `isTransfer` int(11) NOT NULL DEFAULT '0',
  `uuid` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `pay_method`
--

INSERT INTO `pay_method` (`id`, `type`, `method`, `minUnitRecharge`, `maxUnitRecharge`, `feeRate`, `status`, `image`, `name`, `code`, `link`, `isDefault`, `isTransfer`, `uuid`) VALUES
(30, 1, 'ALIPAY', 200, 20000, 3, 0, '2019123121172334.jpg', '支付宝1', NULL, NULL, 1, 0, '82614894-d19b-11e9-adaf-fa163eebd6b0'),
(38, 1, 'WXPAY', 500, 10000, 3, 0, '2019123121171632.jpg', '微信1', NULL, NULL, 0, 0, '12ece222-06aa-11ea-a668-fa163eebd6b0'),
(39, 1, 'ALIPAY', 200, 20000, 3, 0, '2019123120101586.jpg', '支付宝2', NULL, NULL, 0, 0, '80e9751a-2bc6-11ea-b138-fa163eebd6b0'),
(40, 1, 'WXPAY', 500, 5000, 3, 0, '2019123120104456.jpg', '微信2', NULL, NULL, 0, 0, '925ce8ae-2bc6-11ea-a217-fa163eebd6b0'),
(41, 1, 'UNIONPAY', 100, 49999, 3, 0, '2020010216523957.jpg', '银联钱包', NULL, NULL, 0, 0, '3afab2ee-2d3d-11ea-99b4-fa163eebd6b0'),
(42, 2, 'OTHER', 100, 50000, 0, 1, '2020022503011364.jpg', '银行卡转账', NULL, NULL, 0, 0, '0713c388-5738-11ea-816d-525400f7883f');

-- --------------------------------------------------------

--
-- 表的结构 `pay_transfer`
--

CREATE TABLE IF NOT EXISTS `pay_transfer` (
  `id` int(11) NOT NULL,
  `bankName` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankBranch` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankCardName` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankCardId` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uuid` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `pay_transfer`
--

INSERT INTO `pay_transfer` (`id`, `bankName`, `bankBranch`, `bankCardName`, `bankCardId`, `createTime`, `mark`, `uuid`) VALUES
(1, '建设银行', '广州人民中路支行', '江振杰', '6236683320027426717', '2023-02-25 03:01:13', NULL, '0713c388-5738-11ea-816d-525400f7883f');

-- --------------------------------------------------------

--
-- 表的结构 `question`
--

CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) NOT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `relation`
--

CREATE TABLE IF NOT EXISTS `relation` (
  `id` int(11) NOT NULL,
  `parent` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `child` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `security`
--

CREATE TABLE IF NOT EXISTS `security` (
  `id` int(11) NOT NULL,
  `question` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idx` int(11) DEFAULT NULL,
  `answer` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `sys_log`
--

CREATE TABLE IF NOT EXISTS `sys_log` (
  `id` int(11) NOT NULL,
  `category` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `mark` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastTime` datetime NOT NULL,
  `money` float DEFAULT '0',
  `users` int(11) DEFAULT '0',
  `runTime` datetime NOT NULL,
  `configId` int(11) DEFAULT NULL,
  `issue` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '分红是否发放'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'a123456',
  `level` int(4) NOT NULL DEFAULT '0',
  `sex` int(4) DEFAULT NULL,
  `regIp` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL,
  `balance` double NOT NULL DEFAULT '0',
  `balanceDeposit` float NOT NULL DEFAULT '0' COMMENT '充值',
  `type` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '类型',
  `point` double DEFAULT '0',
  `parentName` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parents` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loginTime` datetime DEFAULT NULL,
  `onlineStatus` int(11) DEFAULT '0',
  `nickname` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `lockTime` datetime DEFAULT NULL,
  `bindStatus` int(11) NOT NULL DEFAULT '0',
  `isDel` int(11) NOT NULL DEFAULT '0',
  `baccaratBalance` float NOT NULL DEFAULT '0',
  `withdrawPassword` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `realName` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `securityStatus` int(11) DEFAULT NULL,
  `blockedBalance` float NOT NULL DEFAULT '0',
  `moneyReadyOut` float NOT NULL DEFAULT '0' COMMENT '提交未审批的提现',
  `lastIP` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dailyDividendStatus` int(11) DEFAULT NULL,
  `dividendStatus` int(11) DEFAULT NULL,
  `salaryStatus` int(11) DEFAULT NULL,
  `allowEqualCode` int(11) NOT NULL DEFAULT '0',
  `contractId` int(11) DEFAULT NULL,
  `allowTransfer` tinyint(1) NOT NULL DEFAULT '0',
  `allowWithdraw` int(11) NOT NULL DEFAULT '1',
  `avatar` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `moneyRebateOut` float NOT NULL DEFAULT '0' COMMENT '已提现金额'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type` (`type`),
  ADD KEY `status` (`status`),
  ADD KEY `amount` (`amount`),
  ADD KEY `createTime` (`createTime`),
  ADD KEY `reference` (`reference`),
  ADD KEY `account` (`account`),
  ADD KEY `isChaseSub` (`isChaseSub`),
  ADD KEY `isChase` (`isChase`),
  ADD KEY `updateTime` (`updateTime`);

--
-- Indexes for table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bankCardId` (`bankCardId`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contract`
--
ALTER TABLE `contract`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dividend`
--
ALTER TABLE `dividend`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dividend_admin`
--
ALTER TABLE `dividend_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dividend_config`
--
ALTER TABLE `dividend_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dividend_log`
--
ALTER TABLE `dividend_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `game_chase`
--
ALTER TABLE `game_chase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `issue` (`startIssue`),
  ADD KEY `account` (`account`);

--
-- Indexes for table `game_config`
--
ALTER TABLE `game_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_method`
--
ALTER TABLE `game_method`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_method_limit`
--
ALTER TABLE `game_method_limit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_order`
--
ALTER TABLE `game_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `issue` (`issue`),
  ADD KEY `isChase` (`isChase`),
  ADD KEY `account` (`account`),
  ADD KEY `chaseId` (`chaseId`);

--
-- Indexes for table `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accountId` (`accountId`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `money_in`
--
ALTER TABLE `money_in`
  ADD PRIMARY KEY (`billno`),
  ADD KEY `account` (`account`);

--
-- Indexes for table `money_out`
--
ALTER TABLE `money_out`
  ADD PRIMARY KEY (`billno`),
  ADD KEY `account` (`account`);

--
-- Indexes for table `notice`
--
ALTER TABLE `notice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `open_code`
--
ALTER TABLE `open_code`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`,`issue`),
  ADD KEY `issue` (`issue`),
  ADD KEY `openTime` (`openTime`),
  ADD KEY `status` (`status`),
  ADD KEY `dayTime` (`dayTime`);

--
-- Indexes for table `operation`
--
ALTER TABLE `operation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `pay_method`
--
ALTER TABLE `pay_method`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pay_transfer`
--
ALTER TABLE `pay_transfer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `relation`
--
ALTER TABLE `relation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent` (`parent`),
  ADD KEY `child` (`child`);

--
-- Indexes for table `security`
--
ALTER TABLE `security`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `sys_log`
--
ALTER TABLE `sys_log`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_3` (`category`,`lastTime`,`configId`),
  ADD UNIQUE KEY `category` (`category`,`issue`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `parentName` (`parentName`),
  ADD KEY `parentName_2` (`parentName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity`
--
ALTER TABLE `activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `card`
--
ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `config`
--
ALTER TABLE `config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=69;
--
-- AUTO_INCREMENT for table `contract`
--
ALTER TABLE `contract`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `dividend`
--
ALTER TABLE `dividend`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `dividend_admin`
--
ALTER TABLE `dividend_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `dividend_config`
--
ALTER TABLE `dividend_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT for table `dividend_log`
--
ALTER TABLE `dividend_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_chase`
--
ALTER TABLE `game_chase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `game_config`
--
ALTER TABLE `game_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=605;
--
-- AUTO_INCREMENT for table `game_method`
--
ALTER TABLE `game_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=248;
--
-- AUTO_INCREMENT for table `game_method_limit`
--
ALTER TABLE `game_method_limit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=57;
--
-- AUTO_INCREMENT for table `game_order`
--
ALTER TABLE `game_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `links`
--
ALTER TABLE `links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `notice`
--
ALTER TABLE `notice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `open_code`
--
ALTER TABLE `open_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `operation`
--
ALTER TABLE `operation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pay_method`
--
ALTER TABLE `pay_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=43;
--
-- AUTO_INCREMENT for table `pay_transfer`
--
ALTER TABLE `pay_transfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `relation`
--
ALTER TABLE `relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `security`
--
ALTER TABLE `security`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `sys_log`
--
ALTER TABLE `sys_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
