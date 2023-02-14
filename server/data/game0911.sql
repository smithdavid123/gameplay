-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2023-09-11 18:19:58
-- 服务器版本： 5.7.31
-- PHP 版本： 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `game`
--

-- --------------------------------------------------------

--
-- 表的结构 `activity`
--

CREATE TABLE `activity` (
  `id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `label` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(10240) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `activity`
--

INSERT INTO `activity` (`id`, `status`, `label`, `content`, `category`, `updateTime`) VALUES
(1, 0, '', '[{\"base\":100,\"additional\":5},{\"base\":\"1000\",\"additional\":50},{\"base\":0,\"additional\":0}]', 'money', '2023-12-19 23:06:08');

-- --------------------------------------------------------

--
-- 表的结构 `activity_conf`
--

CREATE TABLE `activity_conf` (
  `id` int(11) NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '活动名称',
  `aType` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '活动类型',
  `content` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '内容',
  `status` int(11) NOT NULL DEFAULT '0',
  `beginTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `optUser` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `bank`
--

CREATE TABLE `bank` (
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

CREATE TABLE `book` (
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
  `isChaseSub` int(11) NOT NULL DEFAULT '0',
  `activityId` int(11) DEFAULT NULL COMMENT '活动ID',
  `update_date` date GENERATED ALWAYS AS (cast(`updateTime` as date)) VIRTUAL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `book_616`
--

CREATE TABLE `book_616` (
  `id` int(11) NOT NULL DEFAULT '0',
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
  `isChaseSub` int(11) NOT NULL DEFAULT '0',
  `activityId` int(11) DEFAULT NULL COMMENT '活动ID',
  `update_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `card`
--

CREATE TABLE `card` (
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

--
-- 转存表中的数据 `card`
--

INSERT INTO `card` (`id`, `user`, `bankCardName`, `bankCardId`, `bankId`, `bankBranch`, `password`, `addTime`, `mark`, `cardStatus`, `isDel`, `isDefault`, `lockTime`, `bankName`) VALUES
(28, 'ceshi007', '刘龙', '6227761940158434446', '3', '青海省大通', NULL, '2023-09-11 16:41:47', NULL, 0, 0, 0, NULL, '中国农业银行'),
(29, 'ceshi009', '李逵', '6222222222222222222', '1', '不知道', NULL, '2023-09-11 17:49:09', NULL, 0, 0, 0, NULL, '中国工商银行');

-- --------------------------------------------------------

--
-- 表的结构 `config`
--

CREATE TABLE `config` (
  `id` int(11) NOT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `mark` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desp` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isNumb` int(11) NOT NULL DEFAULT '1',
  `message` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '扩展记录',
  `info` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `variableName` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '变量名'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `config`
--

INSERT INTO `config` (`id`, `name`, `value`, `updateTime`, `category`, `status`, `mark`, `desp`, `isNumb`, `message`, `info`, `variableName`) VALUES
(1, 'maxBonus', '100', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1, '', '', ''),
(2, 'wageRatio', '0.1', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1, '', '', ''),
(30, 'ratio', '16.6', '2023-03-10 10:46:37', 'dividend', 0, '', NULL, 1, '', '', ''),
(31, 'days', '15', '2023-03-11 18:58:57', 'dividend', 0, '', NULL, 1, '', '', ''),
(32, 'point', '1994', '2023-02-12 21:01:45', 'dividend', 1, '', NULL, 1, '', '', ''),
(33, 'number', '15', '2023-02-13 14:46:55', 'dividend', 0, '', NULL, 1, '', '', ''),
(34, 'consume', '200', '2023-03-10 11:45:21', 'dividend', 1, '', NULL, 1, '', '', ''),
(35, 'deficit', '100', '2023-03-10 11:45:21', 'dividend', 1, '', NULL, 1, '', '', ''),
(36, 'perDeficit', '10', '2023-03-10 12:03:42', 'dividend', 0, '', NULL, 1, '', '', ''),
(37, 'perConsume', '200', '2023-03-10 12:03:33', 'dividend', 0, '', NULL, 1, '', '', ''),
(38, 'activeUser', '1', '2023-03-10 14:04:15', 'dividend', 1, '', NULL, 1, '', '', ''),
(39, 'activeUserAfterIP', '1', '2023-03-10 14:04:24', 'dividend', 0, '', NULL, 1, '', '', ''),
(40, 'perDeficit2', '15', '2023-03-10 14:23:43', 'dividend', 1, '', NULL, 1, '', '', ''),
(41, 'deficitUser', '2', '2023-03-10 14:25:36', 'dividend', 1, '', NULL, 1, '', '', ''),
(42, 'consumeUser', '1', '2023-03-10 14:25:08', 'dividend', 1, '', NULL, 1, '', '', ''),
(43, 'perConsume2', '2', '2023-03-10 11:45:22', 'dividend', 1, '', NULL, 1, '', '', ''),
(44, 'pointConsume', '0', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1, '', '', ''),
(45, 'maxLevelDiff', '200', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1, '', '', ''),
(46, 'maxBetting', '999', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1, '', '', ''),
(47, 'APP下载地址', '0', '2023-03-28 08:31:24', 'download', 0, 'https://ukk.xiaoyanguolai.top/download/5e7effdb9e6d4.html', NULL, 1, '', '', ''),
(48, 'APP下载地址', '1', '2023-03-28 09:11:54', 'download', 0, 'https://store.my-app.download/apps/e9c5aff3019f8e56', NULL, 1, '', '', ''),
(49, 'wageMaxPoint', '10.5', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1, '', '', ''),
(50, 'l23yl.com', '1', '2023-08-27 13:08:37', 'onlineUrls', 0, 'http://www.yisanyule1000.com', NULL, 1, '', '', ''),
(51, 'l23yl.com', '1', '2023-08-27 13:08:45', 'onlineUrls', 0, 'http://www.yisanyule1001.com', NULL, 1, '', '', ''),
(52, 'l23yl.com', '1', '2023-08-27 13:08:53', 'onlineUrls', 0, 'http://www.yisanyule1002.com', NULL, 1, '', '', ''),
(53, 'l23yl.com', '1', '2023-08-27 13:10:21', 'onlineUrls', 0, 'http://www.yisanyule1003.com', NULL, 1, '', '', ''),
(54, 'l23yl.com', '1', '2023-08-27 13:10:31', 'onlineUrls', 0, 'http://www.yisanyule1004.com', NULL, 1, '', '', ''),
(55, 'l23yl.com', '1', '2023-08-27 13:10:40', 'onlineUrls', 0, 'http://www.yisanyule1005.com', NULL, 1, '', '', ''),
(56, 'feeRate', '0.1', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1, '', '', ''),
(57, '53kf', '0', '2023-08-28 10:26:59', 'serviceUrl', 0, 'https://win1.pop800.com/chat/802507', NULL, 1, '', '', ''),
(58, '53kf', '1', '2023-08-28 10:27:21', 'serviceUrl', 0, 'https://win1.pop800.com/chat/802507', NULL, 1, '', '', ''),
(59, 'secretKey', '2CE592D13D9CC2BF98568A1020AC8B60', '2023-03-22 11:38:16', 'thirdPay', 1, '密钥', NULL, 0, '', '', ''),
(60, 'appId', '5e5352d7af6cbe62e12b0bb1', '2023-03-22 11:38:19', 'thirdPay', 1, '商户id', NULL, 0, '', '', ''),
(61, 'gateway', '139.217.239.245', '2023-03-22 11:38:26', 'thirdPay', 1, '网关', NULL, 0, '', '', ''),
(62, 'payServer', 'https://su-pay.co', '2023-04-06 15:44:49', 'thirdPay', 1, '支付提交地址 ', NULL, 0, '', '', ''),
(63, 'payUrl', '/b/recharge', '2023-03-22 11:38:43', 'thirdPay', 1, '支付下单地址', NULL, 0, '', '', ''),
(64, 'notifyUrl', 'http://d.jinhua101.com/moneyNotice', '2023-03-22 11:38:47', 'thirdPay', 1, '我方服务器回调地址', NULL, 0, '', '', ''),
(65, 'payDesp', 'test', '2023-03-22 11:39:06', 'thirdPay', 1, '支付文字描述|永信娱乐会员充值', NULL, 0, '', '', ''),
(66, 'percWithdraw', '1', '2023-02-24 05:33:47', 'other', 1, '', '盈利余额允许提现比例', 1, '', '', ''),
(67, 'payUserId', 'jinhua104', '2023-03-22 11:39:08', 'thirdPay', 1, '商户用户ID', NULL, 0, '', '', ''),
(68, 'allowBetMax', '1996', '2023-03-24 03:17:03', 'other', 1, '', '允许投注最高级别', 2, '', '', ''),
(69, 'returnUrl', 'http://d.jinhua101.com/moneyNotice', '2023-03-22 11:39:11', 'thirdPay', 1, '充值成功后跳转地址', NULL, 0, '', '', ''),
(70, 'thepay', 'https://thepay.vip/api/pay', '2023-03-25 09:16:58', 'paySource', 1, '支付宝扫码-ALIPAY-201|支付宝H5-ALIPAYH5-202|支付宝固码-ALIPAY-203|转卡-BANK_DIRECT-205', 'https://thepay.vip/', 0, 'http://d.xinyong002.com/moneyNotice', '', ''),
(71, 'supay', 'https://su-pay.info/b/recharge', '2023-03-29 11:55:18', 'paySource', 0, '支付宝-ALIPAY-alipay|云闪付-YUNSHANFU-ysf|银行卡-UNIONPAY-bank|微信-WXPAY-wechat', 'https://su-pay.info', 0, 'http://d.jinhua101.com/moneyNotice', '', ''),
(72, 'sysCode', '1996', '2023-03-24 03:16:36', 'other', 1, '', '系统最高级别', 2, '', '', ''),
(73, 'sysCodeMax', '1992', '2023-03-24 03:16:39', 'other', 1, '', '彩票最高级别', 2, '', '', ''),
(74, 'sysCodeMin', '1800', '2023-03-24 03:16:49', 'other', 1, '', '彩票最高级别', 2, '', '', ''),
(75, 'sysPoint', '9.8', '2023-03-24 03:03:06', 'other', 1, '', '系统最高点', 1, '', '', ''),
(76, 'sysUnitMoney', '1', '2023-05-02 17:42:33', 'other', 1, '', '投注单位', 2, '', '', ''),
(77, 'userLevelConf', 'A:0|B:1000|C:5000|D:10000|E:50000|F:100000|G:500000|H:1000000', '2023-05-02 17:42:37', 'other', 1, '用户级别配置', NULL, 0, '', '', 'USER_VIP_LEVEL'),
(78, 'userRechargeConf', '100', '2023-05-21 06:47:03', 'other', 1, '最小充值金额', NULL, 1, '', '', 'RECHARGE_CASH_MIN'),
(79, 'maxRebates', '1994', '2023-05-25 01:56:33', 'other', 1, '平台最高投注(例如1994)', NULL, 2, '', '', 'PLATFORM_REBATES_MAX'),
(80, 'percLimitWithdraw', '50', '2023-09-11 14:33:57', 'other', 1, '用户提款限制(换算成小数), 例如： 30，单位%', NULL, 1, '', '', 'DRAWINF_LIMIT_PERCENT'),
(81, 'flagNickname', '-1', '2023-05-02 16:28:24', 'other', 1, '会员昵称是否必填标识(-1：否，1：是)', NULL, 2, '', '', 'NICKNAME_FLAG'),
(82, 'rechargeBeginTime', '', '2023-05-02 07:39:48', 'other', 1, '充值服务开始时间，不限制则设为空', NULL, 0, '', '', 'RECHARGE_BEGIN_TIME'),
(83, 'rechargeEndTime', '', '2023-05-02 07:39:48', 'other', 1, '充值服务结束时间，不限制则设为空', NULL, 0, '', '', 'RECHARGE_END_TIME'),
(84, 'withdrawEndTime', '2:00', '2023-05-02 08:43:19', 'other', 1, '提现服务结束时间，不限制则设为空', NULL, 0, '', '', 'WITHDRAW_END_TIME'),
(85, 'withdrawBeginTime', '9:00', '2023-05-02 08:41:57', 'other', 1, '提现服务开始时间，不限制则设为空', NULL, 0, '', '', 'WITHDRAW_BEGIN_TIME'),
(86, 'withdrawTime', '10:00~2:00', '2023-05-04 14:48:21', 'other', 1, '提现服务时间（例如 09:00~02:00），不限制则设为空', NULL, 0, '', '', 'WITHDRAW_TIME'),
(87, 'rechargeTime', '00:00~23:59', '2023-05-04 15:05:25', 'other', 1, '充值服务时间（例如 09:00~02:00），不限制则设为空', NULL, 0, '', '', 'RECHARGE_TIME'),
(88, 'maxDailyCount', '10', '2023-06-22 13:43:44', 'other', 1, '提现每天最大次数', NULL, 2, '', '', 'WITHDRAW_MAX_COUNT'),
(89, 'freeDailyCount', '5', '2023-05-02 17:08:00', 'other', 1, '提现每天免手续费次数', NULL, 2, '', '', 'WITHDRAW_FREE_COUNT'),
(90, 'maxDailyAmount', '500000', '2023-05-02 17:08:00', 'other', 1, '提现每天最高总额', NULL, 1, '', '', 'WITHDRAW_MAX_AMOUNT_DAILY'),
(91, 'maxUnitAmount', '49999', '2023-05-02 17:08:00', 'other', 1, '提现单笔最高金额', NULL, 1, '', '', 'WITHDRAW_MAX_AMOUNT_UNIT'),
(92, 'minUnitAmount', '100', '2023-05-21 08:35:18', 'other', 1, '提现单笔最低金额', NULL, 1, '', '', 'WITHDRAW_MIN_AMOUNT_UNIT'),
(93, 'maxFee', '25', '2023-05-04 04:35:45', 'other', 1, '提现每天手续费最高收取总额', NULL, 2, '', '', 'WITHDRAW_MAX_FREE'),
(94, 'minRebates', '1800', '2023-05-25 01:56:59', 'other', 1, '平台最低投注点位（例如1800)', NULL, 2, '', '', 'PLATFORM_REBATES_MIN'),
(95, 'userRechargeConfMax', '49999', '2023-05-04 15:06:05', 'other', 1, '单笔最高充值金额', NULL, 1, '', '', 'RECHARGE_CASH_MAX'),
(96, 'zlypay', 'http://www.sss2r.cn/Pay_Index.html', '2023-09-03 14:12:29', 'paySource', 0, '四方ZFB-ALIPAY-999|网关-WXPAY-964|复制转卡-UNIONPAY-1004|好友等卡-WXPAY-941', 'https://www.l1877.cn/', 0, 'http://d.yisanyule1002.com/moneyNotice', 'http://d.yisanyule1002.com/moneyNotice', ''),
(97, 'sysDrawWater', '0', '2023-05-27 11:08:14', 'other', 1, '平台派奖抽水（单位%）', NULL, 1, '', '', 'PLATFORM_DRAW_WATER'),
(98, 'maxBonusOnce', '20000', '2023-05-02 17:08:00', 'other', 1, '单挑最高奖金', NULL, 1, '', '', 'MAX_BONUS_ONCE'),
(99, 'maxBonusIssue', '200000', '2023-05-02 17:08:00', 'other', 1, '单期最高奖金', NULL, 1, '', '', 'MAX_BONUS_ISSUE'),
(100, 'rootSysAccount', 'xinlong01', '2023-05-04 14:48:21', 'other', 1, '系统抽水账户，请勿随意更改，请勿使用此账户投注', NULL, 0, '', '', 'ROOT_SYS_ACCOUNT'),
(101, 'gameConfigTime', '2023-09-07 00:00:00', '2023-09-06 16:42:15', 'other', 1, '彩种配置最新变动时间', NULL, 0, '', '', ''),
(102, 'appVersion', '199', '2023-05-28 02:29:57', 'other', 1, '版本', NULL, 2, '', '', ''),
(103, 'zbpay', 'https://api.zhbipay.vip/zbpay_exapi/v2/order/createOrder', '2023-09-03 14:11:23', 'paySource', 1, '支付宝扫码-ALIPAY-AliPay|微信扫码-WXPAY-WechatPay|支付宝H5-ALIPAYH5-AliPay_H5|支付宝转银行卡-UNIONPAY-AlipayBankcard|支付宝账号转账-ALIPAYWEB-AliPayTransfer', 'https://saas.zhbipay.vip/', 0, 'http://d.yisanyule1002.com/moneyNotice', 'http://d.yisanyule1002.com/moneyNotice', ''),
(104, 'lrpay', 'http://www.hh999999999.com/payapi/payapi/index', '2023-09-11 16:00:35', 'paySource', 0, '支付宝收款码-ALIPAY-alipay|支付宝转银行-ALIPAYWEB-cardpay|微信-WXPAY-weixin|微信转卡-QUICK_PAY-wxgroup|手机银行转卡-UNIONPAY-unionpay', 'http://www.hh999999999.com/payapi/payapi/index\r\n', 0, 'http://d.yisanyule1002.com/moneyNotice', 'http://d.yisanyule1002.com/moneyNotice', '');

-- --------------------------------------------------------

--
-- 表的结构 `consume_limit`
--

CREATE TABLE `consume_limit` (
  `id` int(11) NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` float NOT NULL,
  `beginTime` datetime NOT NULL COMMENT '开始时间',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `optUser` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作人员'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `contract`
--

CREATE TABLE `contract` (
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

CREATE TABLE `dividend` (
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

CREATE TABLE `dividend_admin` (
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
  `ruleId` int(11) DEFAULT NULL,
  `userGroup` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户组',
  `runDate` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `isFixed` int(11) NOT NULL DEFAULT '0' COMMENT '固定日分红'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `dividend_admin`
--

INSERT INTO `dividend_admin` (`id`, `name`, `status`, `dayCount`, `updateTime`, `totalConsume`, `totalLoss`, `consumeAmount`, `consumeDays`, `pointLimit1`, `lossAmount`, `lossDays`, `pointLimit2`, `isDefault`, `ruleId`, `userGroup`, `runDate`, `isFixed`) VALUES
(7, '半月分红', 1, 15, '2023-09-11 07:15:55', 0, 0, 1000, 7, 1994, 0, 0, 1994, 1, 24, 'Business', '11,26', 0),
(10, '日分红股东', 1, 1, '2023-06-12 18:05:32', 0, 0, 0, 0, 2000, 0, 0, 2000, 0, 25, 'Shareholder', 'day', 1),
(11, '日分红老板', 1, 1, '2023-06-12 18:05:39', 0, 0, 0, 0, 1998, 0, 0, 1998, 0, 27, 'Boss', 'day', 1),
(12, '日分红主管', 1, 1, '2023-06-12 18:05:50', 0, 0, 0, 0, 1996, 0, 0, 1996, 0, 29, 'Manage', 'day', 1);

-- --------------------------------------------------------

--
-- 表的结构 `dividend_config`
--

CREATE TABLE `dividend_config` (
  `id` int(11) NOT NULL,
  `accountFrom` int(11) NOT NULL,
  `accountTo` int(11) NOT NULL,
  `activeUser` int(11) NOT NULL DEFAULT '0',
  `scalePoint` float NOT NULL DEFAULT '0',
  `extraRules` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uSecond` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRoot` int(11) NOT NULL DEFAULT '0',
  `withPlatform` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '和平台签约',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `dividend_config`
--

INSERT INTO `dividend_config` (`id`, `accountFrom`, `accountTo`, `activeUser`, `scalePoint`, `extraRules`, `uSecond`, `isRoot`, `withPlatform`, `createTime`) VALUES
(24, 0, 0, 1, 0, '[{\"totalConsume\": 10, \"totalLoss\": 0, \"activeUser\": 1, \"scalePoint\": 6}, {\"totalConsume\": 30, \"totalLoss\": 0, \"activeUser\": \"3\", \"scalePoint\": 10}, {\"totalConsume\": 100, \"totalLoss\": 0, \"activeUser\": 5, \"scalePoint\": 15}, {\"totalConsume\": 300, \"totalLoss\": 0, \"activeUser\": 10, \"scalePoint\": 20}, {\"totalConsume\": 500, \"totalLoss\": 0, \"activeUser\": 20, \"scalePoint\": 25}, {\"totalConsume\": 1000, \"totalLoss\": 0, \"activeUser\": 30, \"scalePoint\": 30}, {\"totalConsume\": 2000, \"scalePoint\": \"\", \"activeUser\": 30, \"totalLoss\": 0}, {\"totalConsume\": 4000, \"scalePoint\": \"\", \"activeUser\": 50, \"totalLoss\": 10}, {\"totalConsume\": 5000, \"scalePoint\": \"\", \"activeUser\": 80, \"totalLoss\": 20}]', 'common', 0, '1', '2023-04-11 18:02:30'),
(25, 0, 0, 0, 1, '[{\"totalConsume\": 0, \"scalePoint\": \"1.5\", \"activeUser\": 0, \"totalLoss\": 30}]', 'common', 0, '1', '2023-04-11 18:02:30'),
(27, 0, 0, 0, 0.5, '[{\"totalConsume\": 0, \"scalePoint\": 1, \"activeUser\": 0, \"totalLoss\": 15}]', 'common', 0, '1', '2023-04-11 18:02:30'),
(29, 0, 0, 0, 0.5, '[]', 'common', 0, '1', '2023-04-11 18:02:30'),
(49, 0, 0, 1, 1, '[{\"totalConsume\": \"50\", \"scalePoint\": \"2\", \"activeUser\": \"1\", \"totalLoss\": 0}, {\"totalConsume\": \"100\", \"scalePoint\": \"3\", \"activeUser\": \"1\", \"totalLoss\": 0}, {\"totalConsume\": \"300\", \"scalePoint\": \"4\", \"activeUser\": \"1\", \"totalLoss\": 0}, {\"totalConsume\": \"500\", \"scalePoint\": \"5\", \"activeUser\": \"1\", \"totalLoss\": 0}]', 'common', 0, '1', '2023-04-11 18:02:30'),
(70, 5441, 5450, 1, 30, '[{\"totalConsume\": 0, \"scalePoint\": 0, \"activeUser\": 0, \"totalLoss\": 0}]', 'zxy145', 0, '0', '2023-05-27 15:12:25'),
(71, 7100, 7189, 3, 2, '[{\"totalConsume\": 12.0, \"scalePoint\": 2.0, \"activeUser\": 3.0, \"totalLoss\": 5000.0}]', 'll6888', 0, '0', '2023-05-27 22:33:20'),
(72, 7366, 7367, 1, 3, '[{\"totalConsume\": 20.0, \"scalePoint\": 5.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 80.0, \"scalePoint\": 8.0, \"activeUser\": 3.0, \"totalLoss\": 0.0}, {\"totalConsume\": 160.0, \"scalePoint\": 10.0, \"activeUser\": 6.0, \"totalLoss\": 0.0}, {\"totalConsume\": 360.0, \"scalePoint\": 15.0, \"activeUser\": 12.0, \"totalLoss\": 0.0}, {\"totalConsume\": 500.0, \"scalePoint\": 20.0, \"activeUser\": 18.0, \"totalLoss\": 0.0}]', 'A456678', 0, '0', '2023-05-28 07:53:30'),
(73, 4201, 4398, 0, 0, '[{\"totalConsume\": 20.0, \"totalLoss\": 1.0, \"activeUser\": 3.0, \"scalePoint\": 5.0}, {\"totalConsume\": 50.0, \"totalLoss\": 1.0, \"activeUser\": 8.0, \"scalePoint\": 8.0}, {\"totalConsume\": 100.0, \"totalLoss\": 1.0, \"activeUser\": 10.0, \"scalePoint\": 12.0}, {\"totalConsume\": 300.0, \"totalLoss\": 1.0, \"activeUser\": 15.0, \"scalePoint\": 15.0}, {\"totalConsume\": 600.0, \"totalLoss\": 1.0, \"activeUser\": 25.0, \"scalePoint\": 20.0}, {\"totalConsume\": 1200.0, \"totalLoss\": 1.0, \"activeUser\": 35.0, \"scalePoint\": 25.0}, {\"totalConsume\": 2000.0, \"scalePoint\": 30.0, \"activeUser\": 50.0, \"totalLoss\": 1.0}]', 'xcf666', 0, '0', '2023-05-28 09:38:11'),
(74, 4398, 4410, 0, 0, '[{\"totalConsume\": 20.0, \"scalePoint\": 3.0, \"activeUser\": 3.0, \"totalLoss\": 0.0}, {\"totalConsume\": 50.0, \"scalePoint\": 6.0, \"activeUser\": 8.0, \"totalLoss\": 0.0}, {\"totalConsume\": 100.0, \"scalePoint\": 10.0, \"activeUser\": 10.0, \"totalLoss\": 0.0}, {\"totalConsume\": 300.0, \"scalePoint\": 13.0, \"activeUser\": 15.0, \"totalLoss\": 0.0}, {\"totalConsume\": 600.0, \"scalePoint\": 18.0, \"activeUser\": 25.0, \"totalLoss\": 0.0}, {\"totalConsume\": 1200.0, \"scalePoint\": 23.0, \"activeUser\": 35.0, \"totalLoss\": 0.0}, {\"totalConsume\": 2000.0, \"scalePoint\": 28.0, \"activeUser\": 50.0, \"totalLoss\": 0.0}]', 'lw6666', 0, '0', '2023-05-28 09:48:51'),
(75, 6723, 6732, 1, 30, '[{\"totalConsume\": 1.0, \"scalePoint\": 30.0, \"activeUser\": 1.0, \"totalLoss\": 1.0}]', 'cxb4322', 0, '0', '2023-05-28 14:55:17'),
(76, 7366, 8912, 0, 3, '[{\"totalConsume\": 20.0, \"scalePoint\": 5.0, \"activeUser\": 0.0, \"totalLoss\": 0.0}, {\"totalConsume\": 60.0, \"scalePoint\": 8.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 120.0, \"scalePoint\": 10.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 150.0, \"scalePoint\": 15.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 300.0, \"scalePoint\": 20.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 600.0, \"scalePoint\": 25.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 1000.0, \"scalePoint\": 30.0, \"activeUser\": 10.0, \"totalLoss\": 0.0}]', 'qq1953', 0, '0', '2023-05-29 23:46:21'),
(77, 8195, 8320, 1, 5, '[{\"totalConsume\": 0, \"scalePoint\": 0, \"activeUser\": 0, \"totalLoss\": 0}]', 'f901003', 0, '0', '2023-05-30 14:37:28'),
(78, 5054, 9373, 10, 20, '[{\"totalConsume\": 12.0, \"scalePoint\": 5.0, \"activeUser\": 4.0, \"totalLoss\": 0.0}, {\"totalConsume\": 30.0, \"scalePoint\": 10.0, \"activeUser\": 8.0, \"totalLoss\": 0.0}, {\"totalConsume\": 80.0, \"scalePoint\": 15.0, \"activeUser\": 15.0, \"totalLoss\": 0.0}, {\"totalConsume\": 200.0, \"scalePoint\": 20.0, \"activeUser\": 20.0, \"totalLoss\": 0.0}, {\"totalConsume\": 500.0, \"scalePoint\": 28.0, \"activeUser\": 30.0, \"totalLoss\": 0.0}]', 'zhf168', 0, '0', '2023-05-31 20:27:47'),
(79, 10447, 11063, 1, 5, '[{\"totalConsume\": 0, \"scalePoint\": 0, \"activeUser\": 0, \"totalLoss\": 0}]', 'tyx521365', 0, '0', '2023-06-05 16:13:39'),
(80, 11132, 11166, 1, 3, '[{\"totalConsume\": 20.0, \"scalePoint\": 5.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 40.0, \"scalePoint\": 8.0, \"activeUser\": 3.0, \"totalLoss\": 1.0}, {\"totalConsume\": 100.0, \"scalePoint\": 10.0, \"activeUser\": 6.0, \"totalLoss\": 10.0}]', 'gzh131419', 0, '0', '2023-06-05 21:45:08'),
(81, 8854, 8975, 1, 0, '[{\"totalConsume\": 10.0, \"scalePoint\": 5.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 30.0, \"scalePoint\": 10.0, \"activeUser\": 3.0, \"totalLoss\": 0.0}, {\"totalConsume\": 100.0, \"scalePoint\": 15.0, \"activeUser\": 8.0, \"totalLoss\": 0.0}, {\"totalConsume\": 200.0, \"scalePoint\": 18.0, \"activeUser\": 15.0, \"totalLoss\": 0.0}, {\"totalConsume\": 500.0, \"scalePoint\": 20.0, \"activeUser\": 20.0, \"totalLoss\": 0.0}, {\"totalConsume\": 1000.0, \"scalePoint\": 25.0, \"activeUser\": 30.0, \"totalLoss\": 0.0}]', 'lmy6688', 0, '0', '2023-06-06 01:10:04'),
(82, 4747, 11236, 20, 20, '[{\"totalConsume\": 10.0, \"scalePoint\": 5.0, \"activeUser\": 2.0, \"totalLoss\": 0.0}, {\"totalConsume\": 30.0, \"scalePoint\": 10.0, \"activeUser\": 5.0, \"totalLoss\": 0.0}, {\"totalConsume\": 100.0, \"scalePoint\": 15.0, \"activeUser\": 10.0, \"totalLoss\": 0.0}, {\"totalConsume\": 200.0, \"scalePoint\": 18.0, \"activeUser\": 15.0, \"totalLoss\": 0.0}, {\"totalConsume\": 500.0, \"scalePoint\": 20.0, \"activeUser\": 20.0, \"totalLoss\": 0.0}]', 'wjy518518', 0, '0', '2023-06-06 12:10:25'),
(83, 11132, 11147, 0, 3, '[{\"totalConsume\": 10.0, \"scalePoint\": 3.0, \"activeUser\": 1.0, \"totalLoss\": 1.0}]', 'xm6662', 0, '0', '2023-06-09 16:39:14'),
(84, 11166, 12065, 1, 3, '[{\"totalConsume\": 20.0, \"scalePoint\": 5.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 40.0, \"scalePoint\": 8.0, \"activeUser\": 6.0, \"totalLoss\": 1.0}, {\"totalConsume\": 100.0, \"scalePoint\": 10.0, \"activeUser\": 10.0, \"totalLoss\": 10.0}]', 'cw131419', 0, '0', '2023-06-09 16:55:27'),
(85, 12065, 12109, 1, 3, '[{\"totalConsume\": 20.0, \"scalePoint\": 5.0, \"activeUser\": 1.0, \"totalLoss\": 0.0}, {\"totalConsume\": 40.0, \"scalePoint\": 8.0, \"activeUser\": 3.0, \"totalLoss\": 1.0}, {\"totalConsume\": 100.0, \"scalePoint\": 10.0, \"activeUser\": 6.0, \"totalLoss\": 10.0}]', 'woohyuk', 0, '0', '2023-06-09 16:58:37'),
(86, 11564, 11573, 1, 3, '[{\"totalConsume\": 10.0, \"scalePoint\": 5.0, \"activeUser\": 1.0, \"totalLoss\": 1.0}, {\"totalConsume\": 30.0, \"scalePoint\": 10.0, \"activeUser\": 3.0, \"totalLoss\": 2.0}, {\"totalConsume\": 100.0, \"scalePoint\": 15.0, \"activeUser\": 8.0, \"totalLoss\": 5.0}]', 'yp6666', 0, '0', '2023-06-09 17:34:16'),
(87, 11564, 12135, 1, 3, '[{\"totalConsume\": 10.0, \"scalePoint\": 5.0, \"activeUser\": 1.0, \"totalLoss\": 1.0}, {\"totalConsume\": 30.0, \"scalePoint\": 10.0, \"activeUser\": 3.0, \"totalLoss\": 2.0}]', 'sl1111', 0, '0', '2023-06-09 17:38:55'),
(88, 12135, 12139, 1, 3, '[{\"totalConsume\": 10.0, \"scalePoint\": 5.0, \"activeUser\": 1.0, \"totalLoss\": 1.0}]', 'sl0000', 0, '0', '2023-06-09 17:41:19'),
(89, 12191, 12194, 1, 4, '[{\"totalConsume\": 0, \"scalePoint\": 0, \"activeUser\": 0, \"totalLoss\": 0}]', 'hn0057', 0, '0', '2023-06-09 21:19:46'),
(90, 11573, 12112, 2, 10, '[{\"totalConsume\": 10.0, \"scalePoint\": 10.0, \"activeUser\": 2.0, \"totalLoss\": 1.0}]', 'mm520', 0, '0', '2023-06-09 21:44:46'),
(91, 10434, 12334, 20, 10, '[{\"totalConsume\": 0, \"scalePoint\": 0, \"activeUser\": 0, \"totalLoss\": 0}]', 'ft1122', 0, '0', '2023-06-10 13:29:39');

-- --------------------------------------------------------

--
-- 表的结构 `dividend_log`
--

CREATE TABLE `dividend_log` (
  `id` int(11) NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalConsume` float NOT NULL,
  `totalLoss` float NOT NULL,
  `totalRecharge` float NOT NULL DEFAULT '0',
  `activeUser` int(11) NOT NULL,
  `amount` float NOT NULL,
  `scalePoint` float NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `applyTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `issueTime` datetime DEFAULT NULL COMMENT '分红期',
  `issue` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `drawTime` datetime DEFAULT NULL,
  `parent` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '上级',
  `paySource` int(11) NOT NULL DEFAULT '0' COMMENT '发放来源',
  `configId` int(11) DEFAULT NULL COMMENT '活动配置id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `forbid_user`
--

CREATE TABLE `forbid_user` (
  `id` int(11) NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thirdParty` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '第三方',
  `thirdPartyName` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '三方名称',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lottery` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '子类',
  `method` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '玩法',
  `type` int(11) DEFAULT NULL COMMENT '玩法与彩种类型'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `game_chase`
--

CREATE TABLE `game_chase` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `game_config`
--

CREATE TABLE `game_config` (
  `id` int(11) NOT NULL,
  `lottery` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `showName` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequency` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(11) NOT NULL,
  `showType` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '类型关键字',
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
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `shortName` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `openMode` int(11) NOT NULL DEFAULT '0',
  `apiStatus` int(11) NOT NULL DEFAULT '0',
  `apiSrc` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `apiUrl` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `selfOpenEnable` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1 自营 2 平台',
  `isShow` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1 上架 -1 下架',
  `killNumberEnable` int(11) NOT NULL DEFAULT '1' COMMENT '是否杀号',
  `killRate` float NOT NULL DEFAULT '0' COMMENT '杀号百分比'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `game_config`
--

INSERT INTO `game_config` (`id`, `lottery`, `showName`, `frequency`, `type`, `showType`, `times`, `stopDelay`, `downCode`, `fenDownCode`, `liDownCode`, `floatBonus`, `maxBonus`, `sort`, `status`, `description`, `mark`, `updateTime`, `shortName`, `openMode`, `apiStatus`, `apiSrc`, `apiUrl`, `selfOpenEnable`, `isShow`, `killNumberEnable`, `killRate`) VALUES
(1, 't1s30', '新加坡30秒彩', 'self', 1, 'gpc', 2880, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：30秒一期，每日期数：2880期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, -1, 0, 0.12),
(2, 't1s60', '美国一分彩', 'self', 1, 'gpc', 1440, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：60秒一期，每日期数：1440期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, -1, 0, 0),
(3, 't1s90', '韩国1.5分彩', 'self', 1, 'gpc', 960, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(4, 't1s90a', '新德里1.5分彩', 'self', 1, 'gpc', 960, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(5, 't1s90b', '俄罗斯1.5分彩', 'self', 1, 'gpc', 960, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(6, 't1s90c', '印度1.5分彩', 'self', 1, 'gpc', 960, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(7, 't1s90d', '东京1.5分彩', 'high', 1, 'gpc', 960, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(8, 't1s180', '缅甸三分彩', 'self', 1, 'gpc', 480, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：180秒一期，每日期数：480期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(9, 't1s600', '幸运十分彩', 'self', 1, 'ssc', 144, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：十分钟一期，每日期数：144期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(10, 't1s300', '河内5分彩', 'self', 1, 'ssc', 288, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：5分钟一期，每日期数：288期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=hn5fc&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(11, 't1s300a', '幸运5分彩', 'high', 1, 'ssc', 288, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：5分钟一期，每日期数：288期。', NULL, '2023-09-07 16:00:00', NULL, 1, 0, '', '', 1, 1, 0, 0),
(12, 't1s120', '快乐2分彩', 'self', 1, 'ssc', 720, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：2分钟一期，每日期数：720期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(13, 't1s60a', '幸运分分彩', 'self', 1, 'ssc', 1440, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(14, 't1s180a', '幸运三分彩', 'self', 1, 'ssc', 480, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：0点至24点，开奖频率：3分钟一期，每日期数：480期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(21, 't2s30', '纽约11选5', 'self', 2, 'x511', 2880, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：30秒一期，每日期数：2880期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(22, 't2s90', '加拿大11选5', 'self', 2, 'x511', 960, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(31, 't3s90', '吉隆坡快3', 'self', 3, 'k3', 960, 0, 0, 0, 0, 0, 100000, 0, 1, '开奖时间：0点至24点，开奖频率：90秒一期，每日期数：960期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(32, 't3s120', '新西兰快3', 'self', 3, 'k3', 720, 0, 0, 0, 0, 0, 100000, 0, 1, '开奖时间：0点至24点，开奖频率：120秒一期，每日期数：720期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(61, 't6s120', '英国120秒赛车', 'self', 6, 'pk10', 720, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：120秒一期，每日期数：720期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(62, 't6s180', '英国180秒赛车', 'high', 6, 'pk10', 480, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：180秒一期，每日期数：480期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(63, 't6s300', '168飞艇', 'self', 6, 'pk10', 288, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：0点至24点，开奖频率：5分钟一期，每日期数：288期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=168xyft&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(101, 'cqssc', '重庆时时彩', 'high', 1, 'ssc', 59, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：7点10分至凌晨3点10分，开奖频率：20分钟一期，每日期数：59期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=cqssc&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(102, 'tjssc', '天津时时彩', 'high', 1, 'ssc', 42, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：9点至23点，开奖频率：20分钟一期，每日期数：42期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=tjssc&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(103, 'xjssc', '新疆时时彩', 'high', 1, 'ssc', 48, 0, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：9点59分至凌晨1点59分，开奖频率：20分钟一期，每日期数：48期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=xjssc&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(104, 'bjssc', '北京时时彩', 'high', 1, 'ssc', 179, 180, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：9点至24点，开奖频率：5分钟一期，每日期数：179期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(105, 'hgssc', '韩国时时彩', 'high', 1, 'ssc', 880, 5, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：凌晨0点至5点，7点至24点，开奖频率：90秒一期，凌晨200期，7点后680期，每日期数：880期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(106, 'twssc', '台湾时时彩', 'high', 1, 'ssc', 203, 100, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：7点至24点，开奖频率：5分钟一期，每日期数：203期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(107, 'jpssc', '东京时时彩', 'high', 1, 'ssc', 920, 10, 0, 0, 0, 0, 200000, 0, 1, '开奖时间：凌晨0点到7点，8点至24点，开奖频率：90秒一期，凌晨320期，8点后600期，每日期数：920期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(108, 'sgssc', '新加坡2分彩', 'high', 1, 'ssc', 660, 35, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(109, 'qumin', '奇趣分分彩', 'high', 1, 'ssc', 1440, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=txffc&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(110, 'qu5fen', '奇趣5分彩', 'high', 1, 'ssc', 288, 7, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：5分钟一期，每日期数：288期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=tx5fc&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(111, 'qu10fen', '奇趣十分彩', 'high', 1, 'ssc', 144, 7, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：10分钟一期，每日期数：144期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.81p.vip/api?p=json&t=tx10fc&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(201, 'gd11x5', '广东11选5', 'high', 2, 'x511', 42, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：9点10分至23点10分，20分钟一期，每日期数：42期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=gd115&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(202, 'jx11x5', '江西11选5', 'high', 2, 'x511', 42, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：9点10分至23点10分，20分钟一期，每日期数：42期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=jx115&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(203, 'ah11x5', '安徽11选5', 'high', 2, 'x511', 40, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：8点40分至22点，开奖频率：20分钟一期，每日期数：40期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(204, 'sh11x5', '上海11选5', 'high', 2, 'x511', 45, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：9点至0点，20分钟一期，每日期数：45', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(205, 'sd11x5', '山东11选5', 'high', 2, 'x511', 43, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：8点40分至23点00分，20分钟一期，每日期数：43', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=sd115&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(206, 'ln11x5', '辽宁11选5', 'high', 2, 'x511', 41, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：8点49分至22点29分，开奖频率：20分钟一期，每日期数：41期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=ln115&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(301, 'jsk3', '江苏快3', 'high', 3, 'k3', 41, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：8点30分至22点10分，开奖频率：20分钟一期，每日期数：41期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(302, 'ahk3', '安徽快3', 'high', 3, 'k3', 40, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：8点40分至22点，开奖频率：20分钟一期，每日期数：40期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(303, 'hbk3', '湖北快3', 'high', 3, 'k3', 39, 0, 0, 0, 0, 0, 100000, 0, 1, '开奖时间：9点至22点，开奖频率：20分钟一期，每日期数：39期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(304, 'jlk3', '吉林快3', 'high', 3, 'k3', 41, 0, 0, 0, 0, 0, 100000, 0, 1, '开奖时间：8点20分至22点，开奖频率：20分钟一期，每日期数：41期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(401, 'fc3d', '福彩3D', 'low', 4, 'dpc', 1, -2400, 1920, 1880, 1860, 0, 100000, 0, 0, '开奖时间：20点30分，开奖频率：一天一期，每日期数：1期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(402, 'pl3', '排列三', 'low', 4, 'dpc', 1, -2700, 1920, 1880, 1860, 0, 100000, 0, 0, '开奖时间：20点30分，开奖频率：一天一期，每日期数：1期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(501, 'bjkl8', '北京快乐8', 'high', 5, 'klc', 179, 130, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：9点至24点，开奖频率：5分钟一期，每日期数：179期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(502, 'hgkl8', '韩国快乐8', 'high', 5, 'klc', 880, 0, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：凌晨0点至5点，7点至24点，开奖频率：90秒一期，凌晨200期，7点后680期，每日期数：880期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(503, 'twkl8', '台湾快乐8', 'high', 5, 'klc', 203, 90, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：7点至24点，开奖频率：5分钟一期，每日期数：203期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(504, 'jpkl8', '东京快乐8', 'high', 5, 'klc', 920, 15, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：凌晨0点到7点，8点至24点，开奖频率：90秒一期，凌晨320期，8点后600期，每日期数：920期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(505, 'sgkl8', '新加坡快乐8', 'high', 5, 'klc', 660, 20, 0, 0, 0, 0, 100000, 0, 0, '开奖时间：凌晨0点到6点，8点至24点，开奖频率：2分钟一期，凌晨180期，8点后480期，每日期数：660期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(601, 'bjpk10', '北京PK拾', 'high', 6, 'pk10', 44, 0, 0, 0, 0, 0, 100000, 0, 1, '开奖时间：9点10分至23点50分，20分钟一期，每日期数：44', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=bjpk10&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(602, 'qqmin', '腾讯分分彩', 'high', 1, 'ssc', 1440, 7, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0),
(603, 't1s60h', '河内分分彩', 'self', 1, 'ssc', 1440, 0, 0, 0, 0, 0, 200000, 0, 0, '开奖时间：0点至24点，开奖频率：1分钟一期，每日期数：1440期。', NULL, '2023-09-07 16:00:00', NULL, 0, 1, 'b1cp', 'http://api.b1api.com/api?p=json&t=hn1fc&token=CACF6A3A06EDFE4A&limit=5', 1, 1, 0, 0),
(604, 'pcdd', 'PC蛋蛋', 'low', 4, 'dpc', 179, 0, 1920, 1920, 1920, 0, 100000, 20, 1, '开奖时间：每日9点05分到23点55分，开奖频率：5分钟一期，每日期数：179期。', NULL, '2023-09-07 16:00:00', NULL, 0, 0, '', '', 1, 1, 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `game_method`
--

CREATE TABLE `game_method` (
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
  `rebate` float NOT NULL DEFAULT '0.1' COMMENT '基本返点',
  `hitRate` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '命中率',
  `oooNums` int(11) NOT NULL,
  `oooBonus` int(11) NOT NULL,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `game_method`
--

INSERT INTO `game_method` (`id`, `type`, `groupName`, `name`, `methodName`, `minRecord`, `maxRecord`, `totalRecord`, `sort`, `status`, `bonus`, `rebate`, `hitRate`, `oooNums`, `oooBonus`, `updateTime`) VALUES
(1, 1, '五星', '直选复式', 'wxzhixfs', 1, 8001, 100000, 0, 1, '0.01', 0.1, '', 10000, 20000, '2023-09-09 13:26:02'),
(2, 1, '五星', '直选单式', 'wxzhixds', 1, 8001, 100000, 0, 1, '0.01', 0.1, '', 10000, 20000, '2023-01-09 18:34:49'),
(3, 1, '五星', '直选组合', 'wxzhixzh', 0, 780, 0, 0, 1, '0.01', 0.1, '', 0, 0, '2023-03-20 01:55:54'),
(4, 1, '五星', '组选120', 'wxzux120', 0, 801, 0, 0, 1, '1.20', 0.1, '', 25, 20000, '2023-04-25 09:42:15'),
(5, 1, '五星', '组选60', 'wxzux60', 0, 0, 0, 0, 1, '0.60', 0.1, '', 84, 20000, '2023-01-09 17:30:17'),
(6, 1, '五星', '组选30', 'wxzux30', 0, 0, 0, 0, 1, '0.30', 0.1, '', 36, 20000, '2023-01-09 17:30:36'),
(7, 1, '五星', '组选20', 'wxzux20', 0, 20, 0, 0, 1, '0.20', 0.1, '', 360, 20000, '2023-04-27 18:15:43'),
(8, 1, '五星', '组选10', 'wxzux10', 0, 0, 0, 0, 1, '0.10', 0.1, '', 90, 20000, '2023-02-24 15:36:18'),
(9, 1, '五星', '组选5', 'wxzux5', 0, 0, 0, 0, 1, '0.05', 0.1, '', 90, 20000, '2023-02-24 15:36:18'),
(10, 1, '后四星', '直选复式', 'sixzhixfsh', 1, 8001, 0, 0, 0, '0.10', 0.1, '', 1000, 20000, '2023-09-11 03:13:30'),
(11, 1, '后四星', '直选单式', 'sixzhixdsh', 1, 8001, 0, 0, 1, '0.10', 0.1, '', 1000, 20000, '2023-01-09 17:30:24'),
(12, 1, '后四星', '直选组合', 'sixzhixzhh', 0, 0, 0, 0, 1, '0.10', 0.1, '', 0, 0, '2023-01-09 17:30:25'),
(13, 1, '后四星', '组选24', 'sixzux24h', 0, 0, 0, 0, 0, '2.40', 0.1, '', 21, 20000, '2023-02-24 15:36:29'),
(14, 1, '后四星', '组选12', 'sixzux12h', 0, 0, 0, 0, 0, '1.20', 0.1, '', 36, 20000, '2023-02-24 15:36:28'),
(15, 1, '后四星', '组选6', 'sixzux6h', 0, 0, 0, 0, 0, '0.60', 0.1, '', 45, 20000, '2023-02-24 15:36:27'),
(16, 1, '后四星', '组选4', 'sixzux4h', 0, 0, 0, 0, 0, '0.40', 0.1, '', 90, 20000, '2023-02-24 15:36:31'),
(17, 1, '前四星', '直选复式', 'sixzhixfsq', 0, 8000, 0, 0, -1, '0.10', 0.1, '', 1000, 20000, '2023-03-03 13:59:41'),
(18, 1, '前四星', '直选单式', 'sixzhixdsq', 0, 8000, 0, 0, -1, '0.10', 0.1, '', 1000, 20000, '2023-03-03 13:59:42'),
(19, 1, '前四星', '直选组合', 'sixzhixzhq', 0, 0, 0, 0, 1, '0.10', 0.1, '', 0, 0, '2023-12-31 12:02:03'),
(20, 1, '前四星', '组选24', 'sixzux24q', 0, 0, 0, 0, 1, '2.40', 0.1, '', 21, 20000, '2023-05-27 04:32:04'),
(21, 1, '前四星', '组选12', 'sixzux12q', 0, 0, 0, 0, 1, '1.20', 0.1, '', 36, 20000, '2023-05-27 04:32:07'),
(22, 1, '前四星', '组选6', 'sixzux6q', 0, 0, 0, 0, 1, '0.60', 0.1, '', 45, 20000, '2023-05-27 04:32:11'),
(23, 1, '前四星', '组选4', 'sixzux4q', 0, 0, 0, 0, 1, '0.40', 0.1, '', 90, 20000, '2023-05-27 04:32:16'),
(24, 1, '后三码', '直选复式', 'sxzhixfsh', 1, 801, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-05-24 03:08:21'),
(25, 1, '后三码', '直选单式', 'sxzhixdsh', 1, 801, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-05-24 03:08:26'),
(26, 1, '后三码', '直选和值', 'sxzhixhzh', 1, 801, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-05-27 04:30:53'),
(27, 1, '后三码', '组三', 'sxzuxzsh', 0, 73, 0, 0, 0, '3.00', 0.1, '', 9, 20000, '2023-06-05 05:00:44'),
(28, 1, '后三码', '组六', 'sxzuxzlh', 0, 85, 0, 0, 0, '6.00', 0.1, '', 12, 20000, '2023-06-05 04:59:53'),
(29, 1, '后三码', '混合组选', 'sxhhzxh', 0, 0, 0, 0, 0, '6.00', 0.1, '', 21, 20000, '2023-03-03 13:59:54'),
(30, 1, '中三码', '直选复式', 'sxzhixfsz', 1, 801, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-05-24 03:10:55'),
(31, 1, '中三码', '直选单式', 'sxzhixdsz', 1, 801, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-05-24 03:10:59'),
(32, 1, '中三码', '直选和值', 'sxzhixhzz', 1, 801, 0, 0, 1, '1.00', 0.1, '', 100, 20000, '2023-09-18 14:27:13'),
(33, 1, '中三码', '组三', 'sxzuxzsz', 0, 73, 0, 0, 0, '3.00', 0.1, '', 9, 20000, '2023-05-27 04:37:11'),
(34, 1, '中三码', '组六', 'sxzuxzlz', 0, 85, 0, 0, 0, '6.00', 0.1, '', 12, 20000, '2023-05-27 04:37:20'),
(35, 1, '中三码', '混合组选', 'sxhhzxz', 0, 0, 0, 0, 0, '6.00', 0.1, '', 21, 20000, '2023-03-03 14:00:00'),
(36, 1, '前三码', '直选复式', 'sxzhixfsq', 1, 800, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-03-03 14:00:01'),
(37, 1, '前三码', '直选单式', 'sxzhixdsq', 1, 800, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-03-03 14:00:02'),
(38, 1, '前三码', '直选和值', 'sxzhixhzq', 1, 800, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-05-27 04:32:39'),
(39, 1, '前三码', '组三', 'sxzuxzsq', 0, 72, 0, 0, 0, '3.00', 0.1, '', 9, 20000, '2023-05-27 04:33:37'),
(40, 1, '前三码', '组六', 'sxzuxzlq', 0, 84, 0, 0, 0, '6.00', 0.1, '', 12, 20000, '2023-05-27 04:33:50'),
(41, 1, '前三码', '混合组选', 'sxhhzxq', 0, 0, 0, 0, 0, '6.00', 0.1, '', 21, 20000, '2023-03-03 14:00:07'),
(42, 1, '后二星', '直选复式', 'exzhixfsh', 1, 81, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-05-24 03:17:33'),
(43, 1, '后二星', '直选单式', 'exzhixdsh', 1, 81, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-05-24 03:17:38'),
(44, 1, '后二星', '直选和值', 'exzhixhzh', 1, 81, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-05-24 03:17:43'),
(45, 1, '后二星', '大小单双', 'dxdsh', 0, 0, 0, 0, 0, '250.00', 0.1, '', 0, 0, '2023-03-03 14:00:11'),
(46, 1, '后二星', '组选复式', 'exzuxfsh', 0, 29, 0, 0, 0, '20.00', 0.1, '', 4, 20000, '2023-05-23 15:18:51'),
(47, 1, '后二星', '组选单式', 'exzuxdsh', 0, 29, 0, 0, 0, '20.00', 0.1, '', 4, 20000, '2023-05-24 02:39:06'),
(48, 1, '前二星', '直选复式', 'exzhixfsq', 1, 80, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-03-03 14:00:14'),
(49, 1, '前二星', '直选单式', 'exzhixdsq', 1, 80, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-03-03 14:00:15'),
(50, 1, '前二星', '直选和值', 'exzhixhzq', 1, 80, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-03-03 14:00:16'),
(51, 1, '前二星', '大小单双', 'dxdsq', 0, 50, 0, 0, 0, '250.00', 0.1, '', 0, 0, '2023-05-24 03:18:40'),
(52, 1, '前二星', '组选复式', 'exzuxfsq', 0, 29, 0, 0, 0, '20.00', 0.1, '', 4, 20000, '2023-05-24 02:38:46'),
(53, 1, '前二星', '组选单式', 'exzuxdsq', 0, 29, 0, 0, 0, '20.00', 0.1, '', 4, 20000, '2023-05-24 02:38:57'),
(54, 1, '定位胆', '定位胆', 'dw', 0, 40, 0, 0, 0, '100.00', 0.1, '', 1, 20000, '2023-05-28 04:36:50'),
(55, 1, '不定胆', '后三一码', 'bdw1mh', 0, 0, 0, 0, 0, '271.00', 0.1, '', 0, 0, '2023-03-03 14:00:22'),
(56, 1, '不定胆', '中三一码', 'bdw1mz', 0, 0, 0, 0, 0, '271.00', 0.1, '', 0, 0, '2023-03-03 14:00:23'),
(57, 1, '不定胆', '前三一码', 'bdw1mq', 0, 0, 0, 0, 0, '271.00', 0.1, '', 0, 0, '2023-03-03 14:00:24'),
(58, 1, '不定胆', '后三二码', 'bdw2mh', 0, 46, 0, 0, 0, '54.00', 0.1, '', 0, 0, '2023-05-24 03:23:18'),
(59, 1, '不定胆', '中三二码', 'bdw2mz', 0, 46, 0, 0, 0, '54.00', 0.1, '', 0, 0, '2023-05-24 03:23:24'),
(60, 1, '不定胆', '前三二码', 'bdw2mq', 0, 46, 0, 0, 0, '54.00', 0.1, '', 0, 0, '2023-05-24 03:23:30'),
(61, 1, '任选', '任二直选复式', 'rx2fs', 0, 1001, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-05-24 03:25:33'),
(62, 1, '任选', '任三直选复式', 'rx3fs', 0, 801, 0, 0, 1, '1.00', 0.1, '', 100, 20000, '2023-09-11 14:40:29'),
(63, 1, '任选', '任四直选复式', 'rx4fs', 0, 0, 0, 0, 1, '0.10', 0.1, '', 1000, 20000, '2023-09-11 14:36:35'),
(64, 1, '任选', '任二直选单式', 'rx2ds', 0, 0, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-05-27 04:38:21'),
(65, 1, '任选', '任三直选单式', 'rx3ds', 0, 0, 0, 0, 1, '1.00', 0.1, '', 100, 20000, '2023-09-11 14:37:39'),
(66, 1, '任选', '任四直选单式', 'rx4ds', 0, 80001, 0, 0, 1, '0.10', 0.1, '', 1000, 20000, '2023-09-11 14:41:37'),
(67, 1, '任选', '任三组三', 'rx3z3', 0, 0, 0, 0, 0, '3.00', 0.1, '', 9, 20000, '2023-05-27 04:39:34'),
(68, 1, '任选', '任三组六', 'rx3z6', 0, 0, 0, 0, 0, '6.00', 0.1, '', 12, 20000, '2023-05-27 04:39:39'),
(69, 1, '任选', '任二组选', 'rx2zx', 0, 46, 0, 0, 0, '20.00', 0.1, '', 4, 20000, '2023-05-27 04:40:03'),
(70, 1, '趣味', '一帆风顺', 'qwyffs', 0, 9, 0, 0, 0, '409.50', 0.1, '', 0, 0, '2023-09-11 12:03:41'),
(71, 1, '趣味', '好事成双', 'qwhscs', 0, 0, 0, 0, 0, '81.45', 0.1, '', 2, 20000, '2023-03-03 14:00:39'),
(72, 1, '趣味', '三星报喜', 'qwsxbx', 0, 0, 0, 0, 0, '8.56', 0.1, '', 10, 20000, '2023-03-03 14:00:40'),
(73, 1, '趣味', '四季发财', 'qwsjfc', 0, 8, 0, 0, 1, '0.46', 0.1, '', 10, 20000, '2023-09-13 01:29:50'),
(74, 2, '三码', '前三直选复式', 'sanmzhixfsq', 1, 801, 0, 0, 0, '1.01', 0.1, '', 99, 20000, '2023-05-24 03:31:37'),
(75, 2, '三码', '前三直选单式', 'sanmzhixdsq', 1, 801, 0, 0, 0, '1.01', 0.1, '', 99, 20000, '2023-05-24 03:31:42'),
(76, 2, '三码', '前三组选复式', 'sanmzuxfsq', 0, 801, 0, 0, 0, '6.06', 0.1, '', 17, 20000, '2023-05-24 03:36:00'),
(77, 2, '三码', '前三组选单式', 'sanmzuxdsq', 0, 1000, 0, 0, 0, '6.06', 0.1, '', 17, 20000, '2023-05-24 03:36:46'),
(78, 2, '二码', '前二直选复式', 'ermzhixfsq', 0, 29, 0, 0, 0, '9.09', 0.1, '', 11, 20000, '2023-05-24 03:37:09'),
(79, 2, '二码', '前二直选单式', 'ermzhixdsq', 0, 0, 0, 0, 0, '9.09', 0.1, '', 11, 20000, '2023-05-24 03:56:34'),
(80, 2, '二码', '前二组选复式', 'ermzuxfsq', 0, 29, 0, 0, 0, '18.182', 0.1, '', 6, 20000, '2023-05-24 03:38:35'),
(81, 2, '二码', '前二组选单式', 'ermzuxdsq', 0, 29, 0, 0, 0, '18.182', 0.1, '', 6, 20000, '2023-05-24 03:38:42'),
(82, 2, '不定胆', '前三位', 'bdw', 0, 100, 0, 0, 0, '272.73', 0.1, '', 0, 0, '2023-05-24 03:41:06'),
(83, 2, '定位胆', '定位胆', 'dwd', 0, 46, 0, 0, 0, '90.91', 0.1, '', 0, 0, '2023-05-24 04:02:59'),
(84, 2, '趣味', '定单双', 'dds', 0, 0, 0, 0, 0, '13.00,162.30,433.62,325.04,64.95,2.165', 0.1, '', 0, 0, '2023-03-03 14:00:53'),
(85, 2, '趣味', '猜中位', 'czw', 0, 0, 0, 0, 0, '60.61,136.40,194.84,216.58', 0.1, '', 0, 0, '2023-03-03 14:00:54'),
(86, 2, '任选', '一中一复式', 'rx1fs', 0, 0, 0, 0, 0, '454.55', 0.1, '', 0, 0, '2023-03-03 14:00:56'),
(87, 2, '任选', '一中一单式', 'rx1ds', 0, 0, 0, 0, 0, '454.55', 0.1, '', 0, 0, '2023-03-03 14:00:57'),
(88, 2, '任选', '二中二复式', 'rx2fs', 0, 0, 0, 0, 0, '181.82', 0.1, '', 0, 0, '2023-03-03 14:00:58'),
(89, 2, '任选', '二中二单式', 'rx2ds', 0, 0, 0, 0, 0, '181.82', 0.1, '', 0, 0, '2023-03-03 14:00:59'),
(90, 2, '任选', '三中三复式', 'rx3fs', 0, 0, 0, 0, 0, '60.60', 0.1, '', 10, 20000, '2023-03-03 14:01:00'),
(91, 2, '任选', '三中三单式', 'rx3ds', 0, 0, 0, 0, 0, '60.60', 0.1, '', 10, 20000, '2023-03-03 14:01:01'),
(92, 2, '任选', '四中四复式', 'rx4fs', 0, 0, 0, 0, 0, '15.15', 0.1, '', 5, 20000, '2023-09-10 01:49:52'),
(93, 2, '任选', '四中四单式', 'rx4ds', 0, 0, 0, 0, 0, '15.15', 0.1, '', 5, 20000, '2023-03-03 14:01:03'),
(94, 2, '任选', '五中五复式', 'rx5fs', 0, 0, 0, 0, 0, '2.182', 0.1, '', 21, 20000, '2023-09-10 01:49:22'),
(95, 2, '任选', '五中五单式', 'rx5ds', 0, 0, 0, 0, 0, '2.182', 0.1, '', 21, 20000, '2023-09-10 01:49:53'),
(96, 2, '任选', '六中五复式', 'rx6fs', 0, 0, 0, 0, 0, '12.99', 0.1, '', 7, 20000, '2023-09-10 01:49:48'),
(97, 2, '任选', '六中五单式', 'rx6ds', 0, 0, 0, 0, 0, '12.99', 0.1, '', 7, 20000, '2023-03-03 14:01:07'),
(98, 2, '任选', '七中五复式', 'rx7fs', 0, 0, 0, 0, 0, '45.455', 0.1, '', 1, 20000, '2023-09-10 01:49:48'),
(99, 2, '任选', '七中五单式', 'rx7ds', 0, 0, 0, 0, 0, '45.455', 0.1, '', 1, 20000, '2023-03-03 14:01:09'),
(100, 2, '任选', '八中五复式', 'rx8fs', 0, 0, 0, 0, 0, '121.22', 0.1, '', 0, 0, '2023-03-03 14:01:10'),
(101, 2, '任选', '八中五单式', 'rx8ds', 0, 0, 0, 0, 0, '121.22', 0.1, '', 0, 0, '2023-03-03 14:01:11'),
(102, 3, '二不同号', '标准选号', 'ebthdx', 0, 0, 0, 0, 0, '175.00', 0.1, '', 0, 100000, '2023-03-03 14:01:13'),
(103, 3, '二不同号', '手动选号', 'ebthds', 0, 0, 0, 0, 0, '175.00', 0.1, '', 0, 100000, '2023-03-03 14:01:14'),
(104, 3, '二不同号', '胆施选号', 'ebthdt', 0, 0, 0, 0, 0, '175.00', 0.1, '', 0, 100000, '2023-03-03 14:01:15'),
(105, 3, '二同号', '标准选号', 'ethdx', 0, 0, 0, 0, 0, '19.30', 0.1, '', 0, 100000, '2023-03-03 14:01:16'),
(106, 3, '二同号', '手动选号', 'ethds', 0, 0, 0, 0, 0, '19.30', 0.1, '', 0, 100000, '2023-03-03 14:01:17'),
(107, 3, '二同号', '二同号复选', 'ethfx', 0, 0, 0, 0, 0, '96.50', 0.1, '', 0, 100000, '2023-03-03 14:01:18'),
(108, 3, '三不同号', '标准选号', 'sbthdx', 0, 0, 0, 0, 0, '38.6', 0.1, '', 0, 100000, '2023-03-03 14:01:19'),
(109, 3, '三不同号', '手动选号', 'sbthds', 0, 0, 0, 0, 0, '38.6', 0.1, '', 0, 100000, '2023-03-03 14:01:20'),
(110, 3, '三同号', '单选', 'sthdx', 0, 0, 0, 0, 0, '6.00', 0.1, '', 0, 100000, '2023-03-03 14:01:21'),
(111, 3, '三同号', '通选', 'sthtx', 0, 0, 0, 0, 0, '38.60', 0.1, '', 0, 100000, '2023-03-03 14:01:22'),
(112, 3, '三连号', '通选', 'slhtx', 0, 0, 0, 0, 0, '148.00', 0.1, '', 0, 100000, '2023-03-03 14:01:23'),
(113, 3, '和值', '和值', 'hezhi', 0, 0, 0, 0, 0, '6.00,17.6,35.00,64.00,96.50,133.00,148.5,168.00', 0.1, '', 0, 100000, '2023-03-03 14:01:24'),
(114, 4, '三码', '直选复式', 'sanxzhixfs', 0, 800, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-09-09 13:21:58'),
(115, 4, '三码', '直选单式', 'sanxzhixds', 0, 800, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-09-09 13:21:51'),
(116, 4, '三码', '直选和值', 'sanxzhixhz', 0, 800, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-10-17 08:34:52'),
(117, 4, '三码', '组三', 'sanxzs', 0, 0, 0, 0, 0, '3.00', 0.1, '', 9, 20000, '2023-03-03 14:01:29'),
(118, 4, '三码', '组六', 'sanxzl', 0, 0, 0, 0, 0, '6.00', 0.1, '', 12, 20000, '2023-03-03 14:01:30'),
(119, 4, '三码', '混合组选', 'sanxhhzx', 0, 0, 0, 0, 0, '6.00', 0.1, '', 21, 20000, '2023-03-03 14:01:32'),
(120, 4, '后二码', '直选复式', 'exzhixfsh', 0, 80, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-03-03 14:01:33'),
(121, 4, '后二码', '直选单式', 'exzhixdsh', 0, 80, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-03-03 14:01:34'),
(122, 4, '后二码', '直选和值', 'exzhixhzh', 0, 80, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-09-09 04:30:02'),
(123, 4, '后二码', '组选复式', 'exzuxfsh', 0, 29, 0, 0, 0, '20.00', 0.1, '', 4, 20000, '2023-06-05 04:58:26'),
(124, 4, '后二码', '组选单式', 'exzuxdsh', 0, 29, 0, 0, 0, '20.00', 0.1, '', 4, 20000, '2023-06-05 04:58:21'),
(125, 4, '前二码', '直选复式', 'exzhixfsq', 0, 81, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-06-05 04:58:16'),
(126, 4, '前二码', '直选单式', 'exzhixdsq', 0, 81, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-06-05 04:58:10'),
(127, 4, '前二码', '直选和值', 'exzhixhzq', 0, 81, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-06-05 04:58:05'),
(128, 4, '前二码', '组选复式', 'exzuxfsq', 0, 29, 0, 0, 0, '20.00', 0.1, '', 4, 20000, '2023-06-05 04:57:59'),
(129, 4, '前二码', '组选单式', 'exzuxdsq', 0, 29, 0, 0, 0, '20.00', 0.1, '', 4, 20000, '2023-06-05 04:57:54'),
(130, 4, '定位胆', '定位胆', 'dwd', 0, 8, 0, 0, 0, '100.00', 0.1, '', 1, 20000, '2023-03-03 14:01:43'),
(131, 4, '不定胆', '一码不定胆', 'yimabdw', 0, 0, 0, 0, 0, '271.00', 0.1, '', 0, 0, '2023-03-03 14:01:44'),
(132, 5, '趣味', '和值单双', 'hezhids', 0, 0, 0, 0, 1, '567.00', 0.1, '', 0, 100000, '2023-12-31 11:55:56'),
(133, 5, '趣味', '和值大小', 'hezhidx', 0, 0, 0, 0, 1, '567.00,9.65,567.00', 0.1, '', 0, 100000, '2023-12-31 11:56:44'),
(134, 5, '趣味', '奇偶盘', 'jopan', 0, 0, 0, 0, 0, '567.00,225.00,567.00', 0.1, '', 0, 100000, '2023-03-03 14:01:47'),
(135, 5, '趣味', '上下盘', 'sxpan', 0, 0, 0, 0, 0, '567.00,225.00,567.00', 0.1, '', 0, 100000, '2023-03-03 14:01:48'),
(136, 5, '趣味', '和值大小盘', 'hzdxds', 0, 0, 0, 0, 0, '284.00', 0.1, '', 0, 100000, '2023-03-03 14:01:49'),
(137, 5, '任选', '任选1', 'rx1', 0, 0, 0, 0, 0, '300.00', 0.1, '', 0, 100000, '2023-03-03 14:01:51'),
(138, 5, '任选', '任选2', 'rx2', 0, 0, 0, 0, 0, '77.00', 0.1, '', 0, 100000, '2023-03-03 14:01:51'),
(139, 5, '任选', '任选3', 'rx3', 0, 0, 0, 0, 0, '48.00', 0.1, '', 0, 100000, '2023-03-03 14:01:53'),
(140, 5, '任选', '任选4', 'rx4', 0, 0, 0, 0, 0, '17.50', 0.1, '', 0, 100000, '2023-03-03 14:01:54'),
(141, 5, '任选', '任选5', 'rx5', 0, 0, 0, 0, 0, '3.20', 0.1, '', 0, 100000, '2023-03-03 14:01:55'),
(142, 5, '任选', '任选6', 'rx6', 0, 0, 0, 0, 0, '1.93', 0.1, '', 0, 100000, '2023-03-03 14:01:56'),
(143, 5, '任选', '任选7', 'rx7', 0, 0, 0, 0, 0, '0.193', 0.1, '', 0, 100000, '2023-03-03 14:01:57'),
(144, 5, '五行', '五行', 'hezhiwx', 0, 0, 0, 0, 0, '224.00,438.00,840.00,438.00,224.00', 0.1, '', 0, 100000, '2023-03-03 14:01:58'),
(145, 6, '前一', '前一', 'qianyi', 0, 8, 0, 0, 0, '100.00', 0.1, '', 1, 20000, '2023-03-03 14:01:59'),
(146, 6, '前二', '前二复式', 'qianerzxfs', 0, 72, 0, 0, 0, '11.12', 0.1, '', 9, 20000, '2023-03-03 14:02:00'),
(147, 6, '前二', '前二单式', 'qianerzxds', 0, 72, 0, 0, 0, '11.12', 0.1, '', 9, 20000, '2023-03-03 14:02:01'),
(148, 6, '前三', '前三复式', 'qiansanzxfs', 0, 576, 0, 0, 0, '1.389', 0.1, '', 72, 20000, '2023-03-03 14:02:03'),
(149, 6, '前三', '前三单式', 'qiansanzxds', 0, 576, 0, 0, 0, '1.389', 0.1, '', 72, 20000, '2023-03-03 14:02:04'),
(150, 6, '定位胆', '定位胆', 'dingweidan', 0, 8, 0, 0, 0, '100.00', 0.1, '', 1, 20000, '2023-05-23 03:53:37'),
(151, 6, '定位胆', '第1~5名', 'dwqian', 0, 0, 0, 0, 0, '100.00', 0.1, '', 1, 20000, '2023-03-03 14:02:06'),
(152, 6, '定位胆', '第6~10名', 'dwhou', 0, 0, 0, 0, 0, '100.00', 0.1, '', 1, 20000, '2023-03-03 14:02:07'),
(153, 6, '大小', '第一名', 'dxd1', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 100000, '2023-03-03 14:02:08'),
(154, 6, '大小', '第二名', 'dxd2', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 100000, '2023-03-03 14:02:09'),
(155, 6, '大小', '第三名', 'dxd3', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 100000, '2023-03-03 14:02:10'),
(156, 6, '单双', '第一名', 'dsd1', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 100000, '2023-03-03 14:02:11'),
(157, 6, '单双', '第二名', 'dsd2', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 100000, '2023-03-03 14:02:13'),
(158, 6, '单双', '第三名', 'dsd3', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 100000, '2023-03-03 14:02:14'),
(159, 1, '龙虎', '万千', 'lhwq', 0, 0, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:29:02'),
(160, 1, '龙虎', '万百', 'lhwb', 0, 0, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:30:52'),
(161, 1, '龙虎', '万个', 'lhwg', 0, 0, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:30:52'),
(162, 1, '龙虎', '万十', 'lhws', 0, 3, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:30:52'),
(163, 1, '龙虎', '千百', 'lhqb', 0, 0, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:30:52'),
(164, 1, '龙虎', '千个', 'lhqg', 0, 0, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:30:52'),
(165, 1, '龙虎', '千十', 'lhqs', 0, 0, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:30:52'),
(166, 1, '龙虎', '百十', 'lhbs', 0, 0, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:30:52'),
(167, 1, '龙虎', '百个', 'lhbg', 0, 0, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:30:52'),
(168, 1, '龙虎', '十个', 'lhsg', 0, 0, 0, 0, 0, '450,105.26,450', 0.1, '', 0, 0, '2023-09-11 04:30:52'),
(169, 1, '跨度', '前三跨度', 'kdqs', 0, 800, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-03-03 14:02:25'),
(170, 1, '跨度', '中三跨度', 'kdzs', 0, 800, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-03-03 14:02:26'),
(171, 1, '跨度', '后三跨度', 'kdhs', 0, 800, 0, 0, 0, '1.00', 0.1, '', 100, 20000, '2023-03-03 14:02:27'),
(172, 1, '跨度', '前二跨度', 'kdqe', 0, 80, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-03-03 14:02:29'),
(173, 1, '跨度', '后二跨度', 'kdhe', 0, 80, 0, 0, 0, '10.00', 0.1, '', 10, 20000, '2023-03-03 14:02:30'),
(174, 1, '任选', '任三混合', 'rx3hh', 0, 0, 0, 0, 0, '6.0', 0.1, '', 21, 20000, '2023-03-03 14:02:31'),
(175, 1, '五星', '不定位1码', 'wxbdw1m', 0, 0, 0, 0, 0, '409.50', 0.1, '', 0, 0, '2023-05-27 04:27:53'),
(176, 1, '五星', '不定位2码', 'wxbdw2m', 0, 0, 0, 0, 0, '146.70', 0.1, '', 4, 20000, '2023-05-27 04:28:12'),
(177, 1, '五星', '不定位3码', 'wxbdw3m', 0, 0, 0, 0, 1, '43.50', 0.1, '', 12, 20000, '2023-09-09 05:49:24'),
(178, 1, '五星', '和值大小单双', 'wxhzdxds', 0, 0, 0, 0, 1, '500.00', 0.1, '', 0, 0, '2023-09-09 08:41:36'),
(179, 6, '大小', '第四名', 'dxd4', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:36'),
(181, 6, '大小', '第五名', 'dxd5', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:37'),
(183, 6, '大小', '第六名', 'dxd6', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:38'),
(185, 6, '大小', '第七名', 'dxd7', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:40'),
(187, 6, '大小', '第八名', 'dxd8', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:40'),
(189, 6, '大小', '第九名', 'dxd9', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:42'),
(191, 6, '大小', '第十名', 'dxd10', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:43'),
(193, 6, '单双', '第四名', 'dsd4', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:44'),
(195, 6, '单双', '第五名', 'dsd5', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:45'),
(197, 6, '单双', '第六名', 'dsd6', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:46'),
(199, 6, '单双', '第七名', 'dsd7', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:47'),
(201, 6, '单双', '第八名', 'dsd8', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:48'),
(203, 6, '单双', '第九名', 'dsd9', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:49'),
(205, 6, '单双', '第十名', 'dsd10', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:50'),
(207, 6, '龙虎', '第一名', 'lhd1', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:51'),
(209, 6, '龙虎', '第二名', 'lhd2', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:52'),
(211, 6, '龙虎', '第三名', 'lhd3', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:53'),
(213, 6, '龙虎', '第四名', 'lhd4', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:54'),
(215, 6, '龙虎', '第五名', 'lhd5', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 200000, '2023-03-03 14:02:55'),
(217, 6, '前二', '前二和值', 'qianerhz', 0, 0, 0, 0, 0, '11.12', 0.1, '', 4, 20000, '2023-03-03 14:02:56'),
(219, 6, '前三', '前三和值', 'qiansanhz', 0, 0, 0, 0, 0, '1.389', 0.1, '', 10, 30000, '2023-03-03 14:02:57'),
(221, 6, '前四', '前四单式', 'qiansizxds', 0, 4032, 0, 0, 0, '0.198', 0.1, '', 100, 30000, '2023-05-23 03:54:01'),
(223, 6, '前四', '前四复式', 'qiansizxfs', 0, 4032, 0, 0, 0, '0.198', 0.1, '', 100, 30000, '2023-05-23 03:54:02'),
(225, 6, '前五', '前五单式', 'qianwuzxds', 0, 24192, 0, 0, 0, '0.033', 0.1, '', 1000, 30000, '2023-05-23 03:54:02'),
(227, 6, '前五', '前五复式', 'qianwuzxfs', 0, 24192, 0, 0, 0, '0.033', 0.1, '', 1000, 30000, '2023-05-23 03:54:03'),
(229, 1, '新龙虎', '百个', 'xlhbg', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:07'),
(231, 1, '新龙虎', '百十', 'xlhbs', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:10'),
(233, 1, '新龙虎', '千百', 'xlhqb', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:11'),
(235, 1, '新龙虎', '千个', 'xlhqg', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:13'),
(237, 1, '新龙虎', '千十', 'xlhqs', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:14'),
(239, 1, '新龙虎', '十个', 'xlhsg', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:16'),
(241, 1, '新龙虎', '万百', 'xlhwb', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:17'),
(243, 1, '新龙虎', '万个', 'xlhwg', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:19'),
(245, 1, '新龙虎', '万千', 'xlhwq', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:20'),
(247, 1, '新龙虎', '万十', 'xlhws', 0, 0, 0, 0, 0, '500', 0.1, '', 0, 0, '2023-05-10 15:06:22');

-- --------------------------------------------------------

--
-- 表的结构 `game_method_limit`
--

CREATE TABLE `game_method_limit` (
  `id` int(11) NOT NULL,
  `lottery` varchar(16) NOT NULL,
  `method` varchar(16) NOT NULL,
  `type` int(11) NOT NULL,
  `bonus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '赔率',
  `rebate` float NOT NULL DEFAULT '0.1' COMMENT '基本返点',
  `hitRate` float DEFAULT NULL COMMENT '命中率',
  `showOrder` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '0-取消，1-生效',
  `bonusDiff` int(11) NOT NULL DEFAULT '0' COMMENT '赔率相对于通用规则，是否有变动',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='玩法限制，暂时使用黑名单模式';

--
-- 转存表中的数据 `game_method_limit`
--

INSERT INTO `game_method_limit` (`id`, `lottery`, `method`, `type`, `bonus`, `rebate`, `hitRate`, `showOrder`, `status`, `bonusDiff`, `updateTime`, `user`) VALUES
(1, 't6s300', 'qianyi', 6, '102', 0.1, NULL, 0, 0, 1, '2023-02-25 12:15:25', 'sys'),
(2, 't6s300', 'qianerzxfs', 6, '11.12', 0.1, NULL, 0, 0, 1, '2023-02-25 12:15:25', 'sys'),
(3, 't6s300', 'qianerzxds', 6, '11.12', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(4, 't6s300', 'qianerhz', 6, '11.12', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(5, 't6s300', 'qiansanzxfs', 6, '1.389', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(6, 't6s300', 'qiansanzxds', 6, '1.389', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(7, 't6s300', 'qiansanhz', 6, '1.389', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(8, 't6s300', 'qiansizxfs', 6, '0.198', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(9, 't6s300', 'qiansizxds', 6, '0.198', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(10, 't6s300', 'qianwuzxfs', 6, '0.033', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(11, 't6s300', 'qianwuzxds', 6, '0.033', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(22, 't6s300', 'dxd1', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(23, 't6s300', 'dxd2', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(24, 't6s300', 'dxd3', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(25, 't6s300', 'dxd4', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(26, 't6s300', 'dxd5', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(27, 't6s300', 'dxd6', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(28, 't6s300', 'dxd7', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(29, 't6s300', 'dxd8', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(30, 't6s300', 'dxd9', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(31, 't6s300', 'dxd10', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(32, 't6s300', 'dsd1', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(33, 't6s300', 'dsd2', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(34, 't6s300', 'dsd3', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(35, 't6s300', 'dsd4', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(46, 't6s300', 'dsd5', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(47, 't6s300', 'dsd6', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(48, 't6s300', 'dsd7', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(49, 't6s300', 'dsd8', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(50, 't6s300', 'dsd9', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(51, 't6s300', 'dsd10', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:15:25', 'sys'),
(52, 't6s300', 'lhd1', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:17:18', 'sys'),
(53, 't6s300', 'lhd2', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:17:18', 'sys'),
(54, 't6s300', 'lhd3', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:17:18', 'sys'),
(55, 't6s300', 'lhd4', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:17:18', 'sys'),
(56, 't6s300', 'lhd5', 6, '500', 0.1, NULL, 0, 0, 0, '2023-02-25 12:17:18', 'sys'),
(57, 'cqssc', 'wxzhixfs', 1, '0.3', 0.1, NULL, 0, 0, 0, '2023-04-17 02:48:10', 'sys'),
(58, 't1s30', 'sixzux12h', 1, '1.2', 0.1, NULL, 1, 0, 0, '2023-04-17 03:42:52', ''),
(59, 't1s30', 'sixzhixfsh', 1, '0.2', 0.1, NULL, 0, 0, 1, '2023-04-18 13:40:19', ''),
(60, 't1s30', 'sixzhixdsh', 1, '0.10', 0.1, NULL, 0, 0, 0, '2023-04-23 20:46:55', 'admin'),
(62, 't1s30', 'sixzux6h', 1, '0.60', 0.1, NULL, 0, 0, 0, '2023-04-25 17:50:54', 'admin'),
(63, 't1s30', 'xlhbg', 1, '111', 0.1, NULL, 0, 0, 0, '2023-04-25 17:52:50', 'admin'),
(64, 't1s30', 'qwsxbx', 1, '8.56', 0.1, NULL, 0, 0, 0, '2023-04-28 00:11:15', 'yong'),
(65, 't1s60', 'sxzuxzsh', 1, '666', 0.1, NULL, 0, 0, 0, '2023-04-28 00:13:24', 'yong'),
(66, 't1s30', 'xlhqb', 1, '500', 0.1, NULL, 0, 0, 0, '2023-04-28 02:12:36', 'yong'),
(67, 't1s30', 'xlhqg', 1, '500', 0.1, NULL, 0, 0, 0, '2023-04-28 02:12:47', 'yong'),
(71, 't1s30', 'dw', 1, '100.00', 0.1, NULL, 0, 0, 0, '2023-05-02 16:50:12', 'yong'),
(72, 't1s30', 'wxzux60', 1, '0.60', 0.1, NULL, 0, 0, 0, '2023-05-03 02:10:13', 'yong'),
(74, 'qumin', 'sixzux4h', 1, '0.40', 0.1, NULL, 0, 0, 0, '2023-09-08 11:36:12', 'system'),
(75, 'qumin', 'lhwq', 1, '450,105.26,450', 0.1, NULL, 0, 0, 0, '2023-09-08 11:36:12', 'system');

-- --------------------------------------------------------

--
-- 表的结构 `game_order`
--

CREATE TABLE `game_order` (
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
  `openCode` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

CREATE TABLE `links` (
  `id` int(11) NOT NULL,
  `code` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `point` float NOT NULL,
  `expireTime` datetime DEFAULT NULL,
  `amount` int(11) NOT NULL DEFAULT '0' COMMENT '注册数量',
  `visited` int(11) NOT NULL DEFAULT '0' COMMENT '访问数量',
  `account` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '状态，0-正常',
  `isDel` int(11) NOT NULL DEFAULT '0' COMMENT '是否已删除',
  `mark` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '推广代理会员备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `user` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `style` int(11) NOT NULL DEFAULT '0',
  `address` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `logs`
--

INSERT INTO `logs` (`id`, `user`, `ip`, `createTime`, `style`, `address`, `client`) VALUES
(645, 'jia123', '127.0.0.1', '2023-09-11 04:01:59', 0, 'CN-河南-信仰', 'pc');
INSERT INTO `logs` (`id`, `user`, `ip`, `createTime`, `style`, `address`, `client`) VALUES
(1279, 'Hp5566', '127.0.0.1', '2023-09-11 11:40:29', 0, 'CN-四川-信仰', 'app');
INSERT INTO `logs` (`id`, `user`, `ip`, `createTime`, `style`, `address`, `client`) VALUES
(1280, 'Hp5566', '127.0.0.1', '2023-09-11 11:40:49', 1, 'CN-四川-安康', NULL),
(1444, 'yibai888', '127.0.0.1', '2023-09-11 18:03:14', 1, 'CN-贵州-安康', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `title` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `fromUser` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `toUser` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isSys` int(11) NOT NULL DEFAULT '0' COMMENT '是否为系统邮件',
  `content` varchar(10240) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `userCount` int(11) NOT NULL DEFAULT '1',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `readStatus` int(11) NOT NULL DEFAULT '0',
  `isDel` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `money_in`
--

CREATE TABLE `money_in` (
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
  `mark` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `method` int(11) NOT NULL DEFAULT '1',
  `balanceAfter` double DEFAULT '0',
  `readIt` int(11) NOT NULL DEFAULT '0',
  `userInfo` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddr` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `offLine` int(11) NOT NULL DEFAULT '0' COMMENT '是否线下转卡',
  `bankName` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目标银行',
  `bankCardId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目标银行卡',
  `transforMethod` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '线下转账方式',
  `refuseReason` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '拒绝原因',
  `isSys` int(11) NOT NULL DEFAULT '0' COMMENT '人工转入转出'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `money_in`
--

INSERT INTO `money_in` (`billno`, `createTime`, `account`, `amount`, `billTime`, `actualAmount`, `feeRate`, `feeAmount`, `payTime`, `payAction`, `confirmTime`, `confirmUser`, `status`, `pid`, `payType`, `mark`, `method`, `balanceAfter`, `readIt`, `userInfo`, `url`, `ipAddr`, `offLine`, `bankName`, `bankCardId`, `transforMethod`, `refuseReason`, `isSys`) VALUES
('20200912015657392214', '2023-09-11 17:56:57', 'xiao8889', 100, '2023-09-12 01:56:57', 99, 1, 1, NULL, 0, '2023-09-12 01:59:35', 'sys', 2, 64, 'ALIPAYWEB', '113387', 1, 99, 0, '', 'http://www.hh999999999.com/payapi/payapi/index?mchid=18942&mchno=20200912015657392214&tradetype=cardpay&totalfee=10000&descrip=yisanyule&attach=yibai&clientip=110.189.46.139&notifyurl=http://d.yisanyule1002.com/moneyNotice&returnurl=&sign=C176A6567CD5CE62DEEC09A673B95111', '10.89.46.13', 0, NULL, NULL, '', '', 0);

-- --------------------------------------------------------

--
-- 表的结构 `money_out`
--

CREATE TABLE `money_out` (
  `billno` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  `confirmReason` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '财务审核原因-含拒绝',
  `cardId` int(11) DEFAULT NULL,
  `payType` int(11) NOT NULL DEFAULT '0',
  `balanceAfter` float DEFAULT '0',
  `mVirtual` float NOT NULL DEFAULT '0' COMMENT '虚拟账户',
  `mDeposit` float NOT NULL DEFAULT '0' COMMENT '充值账户',
  `payCardId` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `mark` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankCardId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `readIt` int(11) NOT NULL DEFAULT '0',
  `checkStatus` tinyint(4) DEFAULT '0' COMMENT '0 待处理 -1 风控拒绝 1 风控通过 2 财务通过 -2 财务拒绝 3 提现完成',
  `checkUser` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '出款审核人',
  `checkTime` datetime DEFAULT NULL COMMENT '出款操作时间',
  `refuseReason` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '拒绝原因',
  `lockUser` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '锁定人',
  `finishTime` datetime DEFAULT NULL COMMENT '完成时间',
  `userInfo` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `isSys` int(11) NOT NULL DEFAULT '0' COMMENT '管理员操作标识'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `money_out_limit`
--

CREATE TABLE `money_out_limit` (
  `id` int(11) NOT NULL,
  `username` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maxDailyAmount` int(11) NOT NULL COMMENT '每日上限',
  `minUnitAmount` int(11) NOT NULL COMMENT '单笔最小金额',
  `maxUnitAmount` int(11) NOT NULL COMMENT '单笔最大金额',
  `maxDailyCount` int(11) NOT NULL COMMENT '每次最高次数',
  `feeRate` float NOT NULL DEFAULT '0',
  `feeCalcType` int(11) DEFAULT '0' COMMENT '内扣-外扣',
  `feeUnit` int(11) NOT NULL DEFAULT '0' COMMENT '0 - 元，2- 百分比',
  `newCardTime` int(11) NOT NULL DEFAULT '-1' COMMENT '以天为单位'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `notice`
--

CREATE TABLE `notice` (
  `id` int(11) NOT NULL,
  `title` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(10240) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '0',
  `type` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `power` int(11) NOT NULL DEFAULT '0',
  `username` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updateTime` datetime NOT NULL,
  `isTop` int(11) NOT NULL DEFAULT '0',
  `showOrder` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `notice`
--

INSERT INTO `notice` (`id`, `title`, `content`, `mark`, `createTime`, `status`, `type`, `power`, `username`, `updateTime`, `isTop`, `showOrder`) VALUES
(2, '投注事项公告', '<p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); color: rgb(96, 98, 102); font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif; font-size: 12px; white-space: normal; background-color: rgb(255, 255, 255);\"><span style=\"font-size: 16px;\">尊敬的用户：&nbsp;&nbsp;&nbsp;<br style=\"margin: 0px; padding: 0px; outline: none;\"/></span></p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); color: rgb(96, 98, 102); font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif; font-size: 12px; white-space: normal; background-color: rgb(255, 255, 255);\"><span style=\"font-size: 16px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 你们好!<br style=\"margin: 0px; padding: 0px; outline: none;\"/>&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;<span style=\"font-size: 16px; margin: 0px; padding: 0px; outline: none;\">平台内任何彩种禁止投注（拆分投注合并计算)中奖概率大于等于80%，或是恶意对打、同一ip套打、逃避赔率&nbsp;<span style=\"font-size: 16px; margin: 0px; padding: 0px; outline: none;\">、</span>&nbsp;套取红利及活动等，套利行为一经发现，账户和资金永久冻结，并保留一切有争议事项及最后的决策权。&nbsp;</span></span></p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); color: rgb(96, 98, 102); font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif; font-size: 12px; white-space: normal; background-color: rgb(255, 255, 255);\"><span style=\"font-size: 16px;\">&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"font-size: 16px; margin: 0px; padding: 0px; outline: none;\">最后，诚挚的祝福您能好运常伴,大奖不断!&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span></span></p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); color: rgb(96, 98, 102); font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif; font-size: 12px; white-space: normal; background-color: rgb(255, 255, 255);\"><span style=\"margin: 0px; padding: 0px; outline: none; font-size: 16px;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;壹佰娱乐运营部</span></p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); color: rgb(96, 98, 102); font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif; font-size: 12px; white-space: normal; background-color: rgb(255, 255, 255);\"><span style=\"margin: 0px; padding: 0px; outline: none; font-size: 16px;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;2020年9月11号</span></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<br/></p>', '', '2023-09-07 18:30:06', 0, '', 0, 'system', '2023-09-11 15:44:53', 0, 1),
(3, '平台单挑公告！', '<h1 data-v-dd33c784=\"\" id=\"cont-body-right-title\" style=\"margin: 0px; padding: 0px; outline: none; font-weight: 400; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-size: 22px; height: 62px; line-height: 62px; text-align: center; color: rgb(22, 161, 254); font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, Tahoma, Arial, sans-serif; white-space: normal; background-color: rgb(255, 255, 255);\">平台单挑公告！</h1><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">尊敬的用户：</p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><br style=\"margin: 0px; padding: 0px; outline: none;\"/></p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">&nbsp; &nbsp; &nbsp; 您们好!&nbsp;</p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">&nbsp; &nbsp; &nbsp; 为了给玩家朋友们提供一个更加公平、稳定的游戏环境。&nbsp;</p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">&nbsp; &nbsp; &nbsp; 所有彩种单挑模式每期中奖利润最高20,000元，超出奖金部分系统将自动扣除。</p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">&nbsp; &nbsp; &nbsp; 特别注意：龙虎玩法不可以同等金额投注，组三组六必须杀一码。</p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">&nbsp; &nbsp; &nbsp;平台会始终秉承着信誉、稳定、安全为宗旨，致力于为广大玩家提供高效、优质的娱乐购彩环境！</p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">&nbsp; &nbsp; &nbsp; 一路走来，感谢有您！&nbsp;</p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 壹佰娱乐运营部</p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2020年9月11号</p><p style=\"margin-top: 0px; margin-bottom: 0px; padding: 0px; outline: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\">&nbsp;&nbsp;</p><p><br/></p>', '', '2023-09-11 07:52:57', 0, '', 0, 'system', '2023-09-11 15:52:57', 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `open_code`
--

CREATE TABLE `open_code` (
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

CREATE TABLE `operation` (
  `id` int(11) NOT NULL,
  `user` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` varchar(4999) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rfTable` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rfField` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `srcValue` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tarValue` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `operation`
--

INSERT INTO `operation` (`id`, `user`, `username`, `createTime`, `content`, `rfTable`, `rfField`, `mark`, `srcValue`, `tarValue`) VALUES
(1, 'system', 'test002', '2023-08-27 10:44:47', NULL, 'delete user', 'remove', NULL, '', 'all'),
(384, 'abb4561', 'abb4561', '2023-09-11 07:42:11', NULL, 'user', 'withdrawPassword', NULL, '', 'W198699w'),
(385, 'system', '1', '2023-09-11 07:44:32', NULL, 'notice', NULL, NULL, NULL, NULL);
INSERT INTO `operation` (`id`, `user`, `username`, `createTime`, `content`, `rfTable`, `rfField`, `mark`, `srcValue`, `tarValue`) VALUES
(386, 'system', NULL, '2023-09-11 07:44:53', NULL, 'notice', 'content', NULL, NULL, NULL),
(534, 'sys', NULL, '2023-09-11 18:17:06', '50.5,2023-09-11 16:04:23', 'consume_limit', '', NULL, NULL, 'ceshi009');

-- --------------------------------------------------------

--
-- 表的结构 `pay_method`
--

CREATE TABLE `pay_method` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1',
  `method` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `minUnitRecharge` float NOT NULL,
  `maxUnitRecharge` float NOT NULL,
  `feeRate` float NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `image` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `name` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDefault` int(11) DEFAULT '0',
  `isTransfer` int(11) NOT NULL DEFAULT '0',
  `uuid` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timesDay` int(11) NOT NULL DEFAULT '0' COMMENT '每日笔数，0-不限制',
  `autoMoney` int(11) NOT NULL DEFAULT '1' COMMENT '是否自动出款',
  `bindHost` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '绑定域名',
  `secretKey` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '加密私钥',
  `pubKey` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '加密公钥',
  `appId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商户ID',
  `gateway` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '网关',
  `payUserId` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商户用户ID',
  `outMoneyHost` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '出款域名',
  `platform` int(11) NOT NULL DEFAULT '0' COMMENT '显示平台，0-所有',
  `paySource` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '支付源',
  `payMethod` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '支付接口',
  `payMethodName` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '支付接口名称',
  `remark` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '备注',
  `showName` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `showIndex` int(11) NOT NULL DEFAULT '0' COMMENT '显示序号',
  `forUsers` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `pay_method`
--

INSERT INTO `pay_method` (`id`, `type`, `method`, `minUnitRecharge`, `maxUnitRecharge`, `feeRate`, `status`, `image`, `name`, `code`, `link`, `isDefault`, `isTransfer`, `uuid`, `timesDay`, `autoMoney`, `bindHost`, `secretKey`, `pubKey`, `appId`, `gateway`, `payUserId`, `outMoneyHost`, `platform`, `paySource`, `payMethod`, `payMethodName`, `remark`, `showName`, `showIndex`, `forUsers`) VALUES
(50, 2, 'BANK_DIRECT', 0, 49999, 0, 1, '', '银行卡转账', NULL, NULL, 0, 1, NULL, 0, 1, '', '', '', '', '', '', '', 0, '', '转卡-BANK_DIRECT-205', '银行卡转账', '', '', 0, 'B,C,D,E,F,G,H'),
(53, 1, 'WAPAY', 100, 49999, 0.5, 1, '', '在处理中xzf转卡支付02(手续费0.5%）', NULL, NULL, 1, 0, NULL, 0, 1, '', 'b4t4wrlnz9tqfhjxi6yw5djydkknxy5v', NULL, '200908462', '', '', '', 0, 'zlypay', '好友等卡-WXPAY-941', '微信转卡', '', '讯·好友等卡', 0, 'A,B,C,D,E,F,G,H'),
(57, 1, 'WXPAY', 300, 30000, 0.5, 1, '', 'xzf在线网银不可用(手续费0.5%）', NULL, NULL, 1, 0, NULL, 0, 1, '', 'b4t4wrlnz9tqfhjxi6yw5djydkknxy5v', NULL, '200908462', '', '', '', 0, 'zlypay', '网关-WXPAY-964', '网关支付', '', '讯·网关支付', 0, 'A,B,C,D,E,F,G,H'),
(58, 1, 'UNIONPAY', 100, 49999, 0.5, 1, '', 'xzf转卡不可用(手续费0.5%)', NULL, NULL, 1, 0, NULL, 0, 1, '', 'b4t4wrlnz9tqfhjxi6yw5djydkknxy5v', NULL, '200908462', '', '', '', 0, 'zlypay', '复制转卡-UNIONPAY-1004', '复制转卡', '', '讯·复制转卡', 0, 'A,B,C,D,E,F,G,H'),
(59, 1, 'ALIPAY', 500, 3000, 1, 1, '', 'xzf-不可用(手续费1%）', NULL, NULL, 0, 0, NULL, 0, 1, '', 'b4t4wrlnz9tqfhjxi6yw5djydkknxy5v', '', '200908462', '', '', '', 0, 'zlypay', '支付宝扫码-ALIPAY-201', '支付宝扫码', '', '', 0, 'A,B,C,D,E,F,G,H'),
(61, 1, 'ALIPAY', 500, 3000, 1, 1, '', 'zbzf-支付宝扫码(手续费1%）', NULL, NULL, 0, 0, NULL, 0, 1, '', '8dd35ad79f7e7d0ae594261359ea1be4', '', 'fc7a929c5c849dc6377ac42714cee867', '', '', '', 0, 'zbpay', '支付宝扫码-ALIPAY-AliPay', '支付宝扫码', '', '', 0, 'A,B,C,D,E,F,G,H'),
(62, 1, 'UNIONPAY', 100, 20000, 1, 1, '', '网银充值', NULL, NULL, 1, 0, NULL, 0, 1, '', '3223b5ff46060114c0076f447831a35c', NULL, '18942', '', '', '', 0, 'lrpay', '手机银行转卡-UNIONPAY-unionpay', '手机银行转卡', 'yisanyule', '手机银行转卡', 0, 'A,B,C,D,E,F,G,H'),
(63, 1, 'ALIPAY', 300, 10000, 1.5, 1, '', '支付宝扫码', NULL, NULL, 1, 0, NULL, 0, 1, '', '3223b5ff46060114c0076f447831a35c', NULL, '18942', '', '', '', 0, 'lrpay', '支付宝收款码-ALIPAY-alipay', '支付宝收款码', 'yisanyule', '支付宝收款码', 0, 'A,B,C,D,E,F,G,H'),
(64, 1, 'ALIPAYWEB', 100, 20000, 1, 1, '', '支付宝转卡', NULL, NULL, 0, 0, NULL, 0, 1, '', '3223b5ff46060114c0076f447831a35c', '', '18942', '', '', '', 0, 'lrpay', '支付宝转卡-ALIPAYWEB-cardpay', '支付宝转卡', 'yisanyule', '支付宝转卡', 0, 'A,B,C,D,E,F,G,H');

-- --------------------------------------------------------

--
-- 表的结构 `pay_transfer`
--

CREATE TABLE `pay_transfer` (
  `id` int(11) NOT NULL,
  `bankName` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankBranch` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankCardName` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bankCardId` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mark` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uuid` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `forUsers` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '会员分类',
  `fee` float NOT NULL DEFAULT '0' COMMENT '手续费率',
  `platform` int(11) NOT NULL DEFAULT '0' COMMENT '平台显示',
  `payType` int(11) NOT NULL DEFAULT '0' COMMENT '渠道类型',
  `bankId` int(11) DEFAULT NULL COMMENT '银行ID',
  `isStop` int(11) NOT NULL DEFAULT '0' COMMENT '状态，0-正常'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `mark` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `relation`
--

CREATE TABLE `relation` (
  `id` int(11) NOT NULL,
  `parent` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `child` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `_createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- 表的结构 `security`
--

CREATE TABLE `security` (
  `id` int(11) NOT NULL,
  `question` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idx` int(11) DEFAULT NULL,
  `answer` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `security`
--

-- --------------------------------------------------------

--
-- 表的结构 `summary_hours`
--

CREATE TABLE `summary_hours` (
  `id` int(11) NOT NULL,
  `hour` datetime DEFAULT NULL,
  `balance` float NOT NULL,
  `balanceDeposit` float NOT NULL,
  `balanceThird` float NOT NULL,
  `balanceBlocked` float NOT NULL,
  `login` int(11) NOT NULL,
  `active` int(11) NOT NULL,
  `reg` int(11) NOT NULL,
  `online` int(11) NOT NULL,
  `moneyIn` float NOT NULL,
  `moneyOut` float NOT NULL,
  `consume` float NOT NULL,
  `consumeReal` float NOT NULL,
  `bonus` float NOT NULL,
  `commission` float NOT NULL COMMENT '活动抽佣',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `beginTime` datetime NOT NULL,
  `endTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `sys_log`
--

CREATE TABLE `sys_log` (
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

--
-- 转存表中的数据 `sys_log`
--

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'a123456',
  `level` int(4) NOT NULL DEFAULT '0',
  `sex` int(4) DEFAULT NULL,
  `regIp` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `regSource` int(11) NOT NULL DEFAULT '0',
  `registTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime DEFAULT NULL,
  `balance` double NOT NULL DEFAULT '0',
  `balanceDeposit` float NOT NULL DEFAULT '0' COMMENT '充值',
  `type` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '类型',
  `point` double DEFAULT '0',
  `parentName` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parents` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loginTime` datetime DEFAULT NULL,
  `loginClient` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录客户端',
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
  `allowTransfer` tinyint(1) NOT NULL DEFAULT '1',
  `allowWithdraw` int(11) NOT NULL DEFAULT '1',
  `allowDividend` int(11) NOT NULL DEFAULT '1' COMMENT '分红锁定',
  `avatar` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `moneyRebateOut` float NOT NULL DEFAULT '0' COMMENT '已提现金额',
  `vipLevel` int(11) NOT NULL DEFAULT '0',
  `balanceThird` float NOT NULL DEFAULT '0',
  `dividendGroup` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '分红工资组',
  `markPerson` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '个人注释',
  `markTeam` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '团队注释',
  `allowOrder` int(11) NOT NULL DEFAULT '1' COMMENT '允许下注',
  `allowAgent` int(11) NOT NULL DEFAULT '1' COMMENT '允许代理',
  `abnormal` int(11) NOT NULL DEFAULT '0' COMMENT '是否异常',
  `allowTeamLogin` int(11) NOT NULL DEFAULT '1' COMMENT '允许团队登陆',
  `allowTeamWithdraw` int(11) NOT NULL DEFAULT '1' COMMENT '允许团队提现',
  `allowTeamTransfer` int(11) NOT NULL DEFAULT '1' COMMENT '允许团队转账',
  `tel` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `weixin` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `agentPercent` float NOT NULL DEFAULT '0',
  `userLevel` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `level`, `sex`, `regIp`, `regSource`, `registTime`, `updateTime`, `balance`, `balanceDeposit`, `type`, `point`, `parentName`, `parents`, `loginTime`, `loginClient`, `onlineStatus`, `nickname`, `status`, `lockTime`, `bindStatus`, `isDel`, `baccaratBalance`, `withdrawPassword`, `realName`, `securityStatus`, `blockedBalance`, `moneyReadyOut`, `lastIP`, `dailyDividendStatus`, `dividendStatus`, `salaryStatus`, `allowEqualCode`, `contractId`, `allowTransfer`, `allowWithdraw`, `allowDividend`, `avatar`, `moneyRebateOut`, `vipLevel`, `balanceThird`, `dividendGroup`, `markPerson`, `markTeam`, `allowOrder`, `allowAgent`, `abnormal`, `allowTeamLogin`, `allowTeamWithdraw`, `allowTeamTransfer`, `tel`, `weixin`, `email`, `agentPercent`, `userLevel`) VALUES
(85, 'system', '12345678', 6, NULL, NULL, 0, '2023-01-05 15:27:18', NULL, 0, 0, '6', 10, NULL, '', '2023-09-12 00:04:11', 'pc', 0, 'admin', 0, NULL, 0, 0, 0, 'a123456', 'AD', 1, 0, 0, '143.92.61.112', NULL, NULL, NULL, 0, NULL, 1, 1, 1, '0', 0, 0, 0, 'Root', '', '', 1, 1, 0, 1, 1, 1, '123456789', '', '', 0, '');

-- --------------------------------------------------------

--
-- 表的结构 `user2`
--

CREATE TABLE `user2` (
  `id` int(11) NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'a123456',
  `level` int(4) NOT NULL DEFAULT '0',
  `sex` int(4) DEFAULT NULL,
  `regIp` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `regSource` int(11) NOT NULL DEFAULT '0',
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
  `allowTransfer` tinyint(1) NOT NULL DEFAULT '1',
  `allowWithdraw` int(11) NOT NULL DEFAULT '1',
  `allowDividend` int(11) NOT NULL DEFAULT '1' COMMENT '分红锁定',
  `avatar` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `moneyRebateOut` float NOT NULL DEFAULT '0' COMMENT '已提现金额',
  `vipLevel` int(11) NOT NULL DEFAULT '0',
  `balanceThird` float NOT NULL DEFAULT '0',
  `dividendGroup` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '分红工资组',
  `markPerson` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '个人注释',
  `markTeam` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '团队注释',
  `allowOrder` int(11) NOT NULL DEFAULT '1' COMMENT '允许下注',
  `allowAgent` int(11) NOT NULL DEFAULT '1' COMMENT '允许代理',
  `abnormal` int(11) NOT NULL DEFAULT '0' COMMENT '是否异常',
  `allowTeamLogin` int(11) NOT NULL DEFAULT '1' COMMENT '允许团队登陆',
  `allowTeamWithdraw` int(11) NOT NULL DEFAULT '1' COMMENT '允许团队提现',
  `allowTeamTransfer` int(11) NOT NULL DEFAULT '1' COMMENT '允许团队转账',
  `tel` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `weixin` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `agentPercent` float NOT NULL DEFAULT '0',
  `userLevel` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `user_group`
--

CREATE TABLE `user_group` (
  `id` int(11) NOT NULL,
  `code` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一编码',
  `name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户组名称',
  `level` int(11) NOT NULL COMMENT '级别',
  `pointLimit1` int(11) NOT NULL COMMENT '最低奖级',
  `pointLimit2` int(11) NOT NULL COMMENT '最高奖级',
  `agent` int(11) NOT NULL DEFAULT '-1',
  `allowEqualCode` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `user_group`
--

INSERT INTO `user_group` (`id`, `code`, `name`, `level`, `pointLimit1`, `pointLimit2`, `agent`, `allowEqualCode`) VALUES
(1, 'Agent', '代理', 8, 1802, 1994, -1, 1),
(2, 'Manage', '主管', 6, 1996, 1996, 0, 1),
(5, 'Business', '招商', 7, 1994, 1994, 0, 1),
(6, 'Root', '总号', 1, 2000, 2000, 0, 1),
(7, 'Line', '线路', 3, 2000, 2000, 0, 1),
(8, 'Boss', '老板', 5, 1998, 1998, 0, 1),
(9, 'Member', '会员', 9, 1802, 1994, -1, 1),
(10, 'Shareholder', '内部股东', 4, 2000, 2000, 0, 1),
(13, 'Ttrr', '大线路', 2, 2000, 2000, 0, 1);

-- --------------------------------------------------------

--
-- 表的结构 `_card`
--

CREATE TABLE `_card` (
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

--
-- 转储表的索引
--

--
-- 表的索引 `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `activity_conf`
--
ALTER TABLE `activity_conf`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `book`
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
  ADD KEY `updateTime` (`updateTime`),
  ADD KEY `amount_2` (`amount`,`type`),
  ADD KEY `updateTime_2` (`updateTime`,`status`),
  ADD KEY `status_2` (`status`,`updateTime`),
  ADD KEY `account_2` (`account`,`updateTime`),
  ADD KEY `update_date` (`update_date`),
  ADD KEY `status_3` (`status`,`update_date`);

--
-- 表的索引 `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bankCardId` (`bankCardId`),
  ADD KEY `user` (`user`),
  ADD KEY `isDefault` (`isDefault`),
  ADD KEY `user_2` (`user`,`isDefault`);

--
-- 表的索引 `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `consume_limit`
--
ALTER TABLE `consume_limit`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- 表的索引 `contract`
--
ALTER TABLE `contract`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `dividend`
--
ALTER TABLE `dividend`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `dividend_admin`
--
ALTER TABLE `dividend_admin`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `dividend_config`
--
ALTER TABLE `dividend_config`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `dividend_log`
--
ALTER TABLE `dividend_log`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username_2` (`username`,`issue`) USING BTREE,
  ADD KEY `username` (`username`),
  ADD KEY `issue` (`issue`);

--
-- 表的索引 `forbid_user`
--
ALTER TABLE `forbid_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`,`thirdParty`,`lottery`,`method`);

--
-- 表的索引 `game_chase`
--
ALTER TABLE `game_chase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `issue` (`startIssue`),
  ADD KEY `account` (`account`);

--
-- 表的索引 `game_config`
--
ALTER TABLE `game_config`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `game_method`
--
ALTER TABLE `game_method`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `game_method_limit`
--
ALTER TABLE `game_method_limit`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lottery` (`lottery`,`method`);

--
-- 表的索引 `game_order`
--
ALTER TABLE `game_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `issue` (`issue`),
  ADD KEY `isChase` (`isChase`),
  ADD KEY `account` (`account`),
  ADD KEY `chaseId` (`chaseId`),
  ADD KEY `createTime` (`createTime`),
  ADD KEY `lottery` (`lottery`),
  ADD KEY `lottery_2` (`lottery`,`method`),
  ADD KEY `status_2` (`status`,`createTime`);

--
-- 表的索引 `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`) USING BTREE,
  ADD KEY `accountId` (`accountId`);

--
-- 表的索引 `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `createTime` (`createTime`),
  ADD KEY `user_2` (`user`,`createTime`);

--
-- 表的索引 `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `money_in`
--
ALTER TABLE `money_in`
  ADD PRIMARY KEY (`billno`),
  ADD KEY `account` (`account`);

--
-- 表的索引 `money_out`
--
ALTER TABLE `money_out`
  ADD PRIMARY KEY (`billno`),
  ADD KEY `account` (`account`);

--
-- 表的索引 `money_out_limit`
--
ALTER TABLE `money_out_limit`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `notice`
--
ALTER TABLE `notice`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `open_code`
--
ALTER TABLE `open_code`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`,`issue`),
  ADD KEY `issue` (`issue`),
  ADD KEY `openTime` (`openTime`),
  ADD KEY `status` (`status`),
  ADD KEY `dayTime` (`dayTime`);

--
-- 表的索引 `operation`
--
ALTER TABLE `operation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `username` (`username`);

--
-- 表的索引 `pay_method`
--
ALTER TABLE `pay_method`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `pay_transfer`
--
ALTER TABLE `pay_transfer`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `relation`
--
ALTER TABLE `relation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent` (`parent`),
  ADD KEY `child` (`child`);

--
-- 表的索引 `security`
--
ALTER TABLE `security`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- 表的索引 `summary_hours`
--
ALTER TABLE `summary_hours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `beginTime` (`beginTime`);

--
-- 表的索引 `sys_log`
--
ALTER TABLE `sys_log`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_3` (`category`,`lastTime`,`configId`),
  ADD UNIQUE KEY `category` (`category`,`issue`),
  ADD KEY `configId` (`configId`),
  ADD KEY `runTime` (`runTime`),
  ADD KEY `category_2` (`category`);

--
-- 表的索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `parentName` (`parentName`),
  ADD KEY `parentName_2` (`parentName`),
  ADD KEY `type` (`type`),
  ADD KEY `loginTime` (`loginTime`),
  ADD KEY `registTime` (`registTime`),
  ADD KEY `onlineStatus` (`onlineStatus`),
  ADD KEY `status` (`status`),
  ADD KEY `dividendGroup` (`dividendGroup`),
  ADD KEY `dividendStatus` (`dividendStatus`),
  ADD KEY `allowDividend` (`allowDividend`);

--
-- 表的索引 `user2`
--
ALTER TABLE `user2`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `parentName` (`parentName`),
  ADD KEY `parentName_2` (`parentName`),
  ADD KEY `type` (`type`),
  ADD KEY `loginTime` (`loginTime`),
  ADD KEY `registTime` (`registTime`),
  ADD KEY `onlineStatus` (`onlineStatus`),
  ADD KEY `status` (`status`);

--
-- 表的索引 `user_group`
--
ALTER TABLE `user_group`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `_card`
--
ALTER TABLE `_card`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bankCardId` (`bankCardId`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `activity`
--
ALTER TABLE `activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `activity_conf`
--
ALTER TABLE `activity_conf`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `book`
--
ALTER TABLE `book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1542;

--
-- 使用表AUTO_INCREMENT `card`
--
ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- 使用表AUTO_INCREMENT `config`
--
ALTER TABLE `config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- 使用表AUTO_INCREMENT `consume_limit`
--
ALTER TABLE `consume_limit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- 使用表AUTO_INCREMENT `contract`
--
ALTER TABLE `contract`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `dividend`
--
ALTER TABLE `dividend`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `dividend_admin`
--
ALTER TABLE `dividend_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- 使用表AUTO_INCREMENT `dividend_config`
--
ALTER TABLE `dividend_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- 使用表AUTO_INCREMENT `dividend_log`
--
ALTER TABLE `dividend_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `forbid_user`
--
ALTER TABLE `forbid_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `game_chase`
--
ALTER TABLE `game_chase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `game_config`
--
ALTER TABLE `game_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=605;

--
-- 使用表AUTO_INCREMENT `game_method`
--
ALTER TABLE `game_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=248;

--
-- 使用表AUTO_INCREMENT `game_method_limit`
--
ALTER TABLE `game_method_limit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- 使用表AUTO_INCREMENT `game_order`
--
ALTER TABLE `game_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=517;

--
-- 使用表AUTO_INCREMENT `links`
--
ALTER TABLE `links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1445;

--
-- 使用表AUTO_INCREMENT `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `money_out_limit`
--
ALTER TABLE `money_out_limit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `notice`
--
ALTER TABLE `notice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `open_code`
--
ALTER TABLE `open_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1528296;

--
-- 使用表AUTO_INCREMENT `operation`
--
ALTER TABLE `operation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=535;

--
-- 使用表AUTO_INCREMENT `pay_method`
--
ALTER TABLE `pay_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- 使用表AUTO_INCREMENT `pay_transfer`
--
ALTER TABLE `pay_transfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `relation`
--
ALTER TABLE `relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1503;

--
-- 使用表AUTO_INCREMENT `security`
--
ALTER TABLE `security`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- 使用表AUTO_INCREMENT `summary_hours`
--
ALTER TABLE `summary_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `sys_log`
--
ALTER TABLE `sys_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=958;

--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4254;

--
-- 使用表AUTO_INCREMENT `user2`
--
ALTER TABLE `user2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `user_group`
--
ALTER TABLE `user_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- 使用表AUTO_INCREMENT `_card`
--
ALTER TABLE `_card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
