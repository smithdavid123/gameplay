-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2023-07-03 07:48:18
-- 服务器版本： 5.7.29-log
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
-- 表的结构 `activity_conf`
--

CREATE TABLE IF NOT EXISTS `activity_conf` (
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
  `isChaseSub` int(11) NOT NULL DEFAULT '0',
  `activityId` int(11) DEFAULT NULL COMMENT '活动ID',
  `update_date` date GENERATED ALWAYS AS (cast(`updateTime` as date)) VIRTUAL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `book_616`
--

CREATE TABLE IF NOT EXISTS `book_616` (
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
  `value` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `mark` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desp` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isNumb` int(11) NOT NULL DEFAULT '1',
  `message` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '扩展记录',
  `info` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `variableName` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '变量名'
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(47, 'APP下载地址', '0', '2023-03-28 08:31:24', 'download', 0, 'https://ukk.xiaolai.top/download/qdqdqdq.html', NULL, 1, '', '', ''),
(48, 'APP下载地址', '1', '2023-03-28 09:11:54', 'download', 0, 'https://store.my-app.download/apps/wwqq', NULL, 1, '', '', ''),
(49, 'wageMaxPoint', '10.5', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1, '', '', ''),
(50, 'l23yl.com', '1', '2023-05-25 15:43:20', 'onlineUrls', 0, 'http://www.xinlong002.com', NULL, 1, '', '', ''),
(51, 'l23yl.com', '1', '2023-05-25 15:43:26', 'onlineUrls', 0, 'http://www.xinlong003.com', NULL, 1, '', '', ''),
(52, 'l23yl.com', '1', '2023-05-25 15:43:31', 'onlineUrls', 0, 'http://www.xinlong004.com', NULL, 1, '', '', ''),
(53, 'l23yl.com', '1', '2023-05-25 15:43:40', 'onlineUrls', 0, 'http://www.xinlong005.com', NULL, 1, '', '', ''),
(54, 'l23yl.com', '1', '2023-05-25 15:43:45', 'onlineUrls', 0, 'http://www.xinlong006.com', NULL, 1, '', '', ''),
(55, 'l23yl.com', '1', '2023-05-25 15:45:21', 'onlineUrls', 0, 'http://xinlong006.com', NULL, 1, '', '', ''),
(56, 'feeRate', '0.1', '2023-02-24 05:33:47', 'other', 1, '', NULL, 1, '', '', ''),
(57, '53kf', '0', '2023-05-25 09:33:32', 'serviceUrl', 0, 'https://tb.53kf.com/code/client/wwqwq/1', NULL, 1, '', '', ''),
(58, '53kf', '1', '2023-05-25 09:33:03', 'serviceUrl', 0, 'https://tb.53kf.com/code/app/qdqwd/1', NULL, 1, '', '', ''),
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
(80, 'percLimitWithdraw', '30', '2023-05-02 18:03:45', 'other', 1, '用户提款限制(换算成小数), 例如： 30，单位%', NULL, 1, '', '', 'DRAWINF_LIMIT_PERCENT'),
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
(96, 'zlypay', 'http://www.sss2r.cn/Pay_Index.html', '2023-06-16 06:46:30', 'paySource', 0, '四方ZFB-ALIPAY-999|网关-WXPAY-964|复制转卡-UNIONPAY-1004|好友等卡-WXPAY-941', 'https://www.l1877.cn/', 0, 'http://d.xinlong006.com/moneyNotice', 'http://d.xinlong006.com/moneyNotice', ''),
(97, 'sysDrawWater', '0', '2023-05-27 11:08:14', 'other', 1, '平台派奖抽水（单位%）', NULL, 1, '', '', 'PLATFORM_DRAW_WATER'),
(98, 'maxBonusOnce', '20000', '2023-05-02 17:08:00', 'other', 1, '单挑最高奖金', NULL, 1, '', '', 'MAX_BONUS_ONCE'),
(99, 'maxBonusIssue', '200000', '2023-05-02 17:08:00', 'other', 1, '单期最高奖金', NULL, 1, '', '', 'MAX_BONUS_ISSUE'),
(100, 'rootSysAccount', 'xinlong01', '2023-05-04 14:48:21', 'other', 1, '系统抽水账户，请勿随意更改，请勿使用此账户投注', NULL, 0, '', '', 'ROOT_SYS_ACCOUNT'),
(101, 'gameConfigTime', '2023-06-04 02:41:00', '2023-06-03 18:51:16', 'other', 1, '彩种配置最新变动时间', NULL, 0, '', '', ''),
(102, 'appVersion', '199', '2023-05-28 02:29:57', 'other', 1, '版本', NULL, 2, '', '', ''),
(103, 'zbpay', 'https://api.zhbipay.vip/zbpay_exapi/v2/order/createOrder', '2023-06-17 06:47:24', 'paySource', 1, '支付宝扫码-ALIPAY-AliPay|微信扫码-WXPAY-WechatPay|支付宝H5-ALIPAYH5-AliPay_H5|支付宝转银行卡-UNIONPAY-AlipayBankcard|支付宝账号转账-ALIPAYWEB-AliPayTransfer', 'https://saas.zhbipay.vip/', 0, 'http://d.xinlong001.com/moneyNotice', 'http://d.xinlong001.com/moneyNotice', '');

-- --------------------------------------------------------

--
-- 表的结构 `consume_limit`
--

CREATE TABLE IF NOT EXISTS `consume_limit` (
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
  `ruleId` int(11) DEFAULT NULL,
  `userGroup` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户组',
  `runDate` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `isFixed` int(11) NOT NULL DEFAULT '0' COMMENT '固定日分红'
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `dividend_admin`
--

INSERT INTO `dividend_admin` (`id`, `name`, `status`, `dayCount`, `updateTime`, `totalConsume`, `totalLoss`, `consumeAmount`, `consumeDays`, `pointLimit1`, `lossAmount`, `lossDays`, `pointLimit2`, `isDefault`, `ruleId`, `userGroup`, `runDate`, `isFixed`) VALUES
(7, '半月分红', 1, 15, '2023-06-05 19:26:10', 0, 0, 1000, 7, 1994, 0, 0, 1994, 1, 24, 'Business', '27,12', 0),
(10, '日分红股东', 1, 1, '2023-06-12 18:05:32', 0, 0, 0, 0, 2000, 0, 0, 2000, 0, 25, 'Shareholder', 'day', 1),
(11, '日分红老板', 1, 1, '2023-06-12 18:05:39', 0, 0, 0, 0, 1998, 0, 0, 1998, 0, 27, 'Boss', 'day', 1),
(12, '日分红主管', 1, 1, '2023-06-12 18:05:50', 0, 0, 0, 0, 1996, 0, 0, 1996, 0, 29, 'Manage', 'day', 1);

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
  `isRoot` int(11) NOT NULL DEFAULT '0',
  `withPlatform` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '和平台签约',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `dividend_config`
--

INSERT INTO `dividend_config` (`id`, `accountFrom`, `accountTo`, `activeUser`, `scalePoint`, `extraRules`, `uSecond`, `isRoot`, `withPlatform`, `createTime`) VALUES
(24, 0, 0, 0, 0, '[{"totalConsume": 10, "totalLoss": 0, "activeUser": 1, "scalePoint": 5}, {"totalConsume": 30, "totalLoss": 0, "activeUser": "3", "scalePoint": 10}, {"totalConsume": 100, "totalLoss": 0, "activeUser": 8, "scalePoint": 15}, {"totalConsume": 200, "totalLoss": 0, "activeUser": 10, "scalePoint": 18}, {"totalConsume": 500, "totalLoss": 0, "activeUser": 15, "scalePoint": 20}, {"totalConsume": 1000, "totalLoss": 0, "activeUser": 20, "scalePoint": 25}, {"totalConsume": 2000, "scalePoint": 30, "activeUser": 30, "totalLoss": 0}, {"totalConsume": 4000, "scalePoint": 35, "activeUser": 50, "totalLoss": 10}, {"totalConsume": 5000, "scalePoint": 40, "activeUser": 80, "totalLoss": 20}]', 'common', 0, '1', '2023-04-11 18:02:30'),
(25, 0, 0, 0, 1, '[{"totalConsume": 0, "scalePoint": "1.5", "activeUser": 0, "totalLoss": 30}]', 'common', 0, '1', '2023-04-11 18:02:30'),
(27, 0, 0, 0, 0.5, '[{"totalConsume": 0, "scalePoint": 1, "activeUser": 0, "totalLoss": 15}]', 'common', 0, '1', '2023-04-11 18:02:30'),
(29, 0, 0, 0, 0.5, '[]', 'common', 0, '1', '2023-04-11 18:02:30'),
(49, 0, 0, 1, 1, '[{"totalConsume": "50", "scalePoint": "2", "activeUser": "1", "totalLoss": 0}, {"totalConsume": "100", "scalePoint": "3", "activeUser": "1", "totalLoss": 0}, {"totalConsume": "300", "scalePoint": "4", "activeUser": "1", "totalLoss": 0}, {"totalConsume": "500", "scalePoint": "5", "activeUser": "1", "totalLoss": 0}]', 'common', 0, '1', '2023-04-11 18:02:30'),
(70, 5441, 5450, 1, 30, '[{"totalConsume": 0, "scalePoint": 0, "activeUser": 0, "totalLoss": 0}]', 'zxy145', 0, '0', '2023-05-27 15:12:25'),
(71, 7100, 7189, 3, 2, '[{"totalConsume": 12.0, "scalePoint": 2.0, "activeUser": 3.0, "totalLoss": 5000.0}]', 'll6888', 0, '0', '2023-05-27 22:33:20'),
(72, 7366, 7367, 1, 3, '[{"totalConsume": 20.0, "scalePoint": 5.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 80.0, "scalePoint": 8.0, "activeUser": 3.0, "totalLoss": 0.0}, {"totalConsume": 160.0, "scalePoint": 10.0, "activeUser": 6.0, "totalLoss": 0.0}, {"totalConsume": 360.0, "scalePoint": 15.0, "activeUser": 12.0, "totalLoss": 0.0}, {"totalConsume": 500.0, "scalePoint": 20.0, "activeUser": 18.0, "totalLoss": 0.0}]', 'A456678', 0, '0', '2023-05-28 07:53:30'),
(73, 4201, 4398, 0, 0, '[{"totalConsume": 20.0, "totalLoss": 1.0, "activeUser": 3.0, "scalePoint": 5.0}, {"totalConsume": 50.0, "totalLoss": 1.0, "activeUser": 8.0, "scalePoint": 8.0}, {"totalConsume": 100.0, "totalLoss": 1.0, "activeUser": 10.0, "scalePoint": 12.0}, {"totalConsume": 300.0, "totalLoss": 1.0, "activeUser": 15.0, "scalePoint": 15.0}, {"totalConsume": 600.0, "totalLoss": 1.0, "activeUser": 25.0, "scalePoint": 20.0}, {"totalConsume": 1200.0, "totalLoss": 1.0, "activeUser": 35.0, "scalePoint": 25.0}, {"totalConsume": 2000.0, "scalePoint": 30.0, "activeUser": 50.0, "totalLoss": 1.0}]', 'xcf666', 0, '0', '2023-05-28 09:38:11'),
(74, 4398, 4410, 0, 0, '[{"totalConsume": 20.0, "scalePoint": 3.0, "activeUser": 3.0, "totalLoss": 0.0}, {"totalConsume": 50.0, "scalePoint": 6.0, "activeUser": 8.0, "totalLoss": 0.0}, {"totalConsume": 100.0, "scalePoint": 10.0, "activeUser": 10.0, "totalLoss": 0.0}, {"totalConsume": 300.0, "scalePoint": 13.0, "activeUser": 15.0, "totalLoss": 0.0}, {"totalConsume": 600.0, "scalePoint": 18.0, "activeUser": 25.0, "totalLoss": 0.0}, {"totalConsume": 1200.0, "scalePoint": 23.0, "activeUser": 35.0, "totalLoss": 0.0}, {"totalConsume": 2000.0, "scalePoint": 28.0, "activeUser": 50.0, "totalLoss": 0.0}]', 'lw6666', 0, '0', '2023-05-28 09:48:51'),
(75, 6723, 6732, 1, 30, '[{"totalConsume": 1.0, "scalePoint": 30.0, "activeUser": 1.0, "totalLoss": 1.0}]', 'cxb4322', 0, '0', '2023-05-28 14:55:17'),
(76, 7366, 8912, 0, 3, '[{"totalConsume": 20.0, "scalePoint": 5.0, "activeUser": 0.0, "totalLoss": 0.0}, {"totalConsume": 60.0, "scalePoint": 8.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 120.0, "scalePoint": 10.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 150.0, "scalePoint": 15.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 300.0, "scalePoint": 20.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 600.0, "scalePoint": 25.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 1000.0, "scalePoint": 30.0, "activeUser": 10.0, "totalLoss": 0.0}]', 'qq1953', 0, '0', '2023-05-29 23:46:21'),
(77, 8195, 8320, 1, 5, '[{"totalConsume": 0, "scalePoint": 0, "activeUser": 0, "totalLoss": 0}]', 'f901003', 0, '0', '2023-05-30 14:37:28'),
(78, 5054, 9373, 10, 20, '[{"totalConsume": 12.0, "scalePoint": 5.0, "activeUser": 4.0, "totalLoss": 0.0}, {"totalConsume": 30.0, "scalePoint": 10.0, "activeUser": 8.0, "totalLoss": 0.0}, {"totalConsume": 80.0, "scalePoint": 15.0, "activeUser": 15.0, "totalLoss": 0.0}, {"totalConsume": 200.0, "scalePoint": 20.0, "activeUser": 20.0, "totalLoss": 0.0}, {"totalConsume": 500.0, "scalePoint": 28.0, "activeUser": 30.0, "totalLoss": 0.0}]', 'zhf168', 0, '0', '2023-05-31 20:27:47'),
(79, 10447, 11063, 1, 5, '[{"totalConsume": 0, "scalePoint": 0, "activeUser": 0, "totalLoss": 0}]', 'tyx521365', 0, '0', '2023-06-05 16:13:39'),
(80, 11132, 11166, 1, 3, '[{"totalConsume": 20.0, "scalePoint": 5.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 40.0, "scalePoint": 8.0, "activeUser": 3.0, "totalLoss": 1.0}, {"totalConsume": 100.0, "scalePoint": 10.0, "activeUser": 6.0, "totalLoss": 10.0}]', 'gzh131419', 0, '0', '2023-06-05 21:45:08'),
(81, 8854, 8975, 1, 0, '[{"totalConsume": 10.0, "scalePoint": 5.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 30.0, "scalePoint": 10.0, "activeUser": 3.0, "totalLoss": 0.0}, {"totalConsume": 100.0, "scalePoint": 15.0, "activeUser": 8.0, "totalLoss": 0.0}, {"totalConsume": 200.0, "scalePoint": 18.0, "activeUser": 15.0, "totalLoss": 0.0}, {"totalConsume": 500.0, "scalePoint": 20.0, "activeUser": 20.0, "totalLoss": 0.0}, {"totalConsume": 1000.0, "scalePoint": 25.0, "activeUser": 30.0, "totalLoss": 0.0}]', 'lmy6688', 0, '0', '2023-06-06 01:10:04'),
(82, 4747, 11236, 20, 20, '[{"totalConsume": 10.0, "scalePoint": 5.0, "activeUser": 2.0, "totalLoss": 0.0}, {"totalConsume": 30.0, "scalePoint": 10.0, "activeUser": 5.0, "totalLoss": 0.0}, {"totalConsume": 100.0, "scalePoint": 15.0, "activeUser": 10.0, "totalLoss": 0.0}, {"totalConsume": 200.0, "scalePoint": 18.0, "activeUser": 15.0, "totalLoss": 0.0}, {"totalConsume": 500.0, "scalePoint": 20.0, "activeUser": 20.0, "totalLoss": 0.0}]', 'wjy518518', 0, '0', '2023-06-06 12:10:25'),
(83, 11132, 11147, 0, 3, '[{"totalConsume": 10.0, "scalePoint": 3.0, "activeUser": 1.0, "totalLoss": 1.0}]', 'xm6662', 0, '0', '2023-06-09 16:39:14'),
(84, 11166, 12065, 1, 3, '[{"totalConsume": 20.0, "scalePoint": 5.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 40.0, "scalePoint": 8.0, "activeUser": 6.0, "totalLoss": 1.0}, {"totalConsume": 100.0, "scalePoint": 10.0, "activeUser": 10.0, "totalLoss": 10.0}]', 'cw131419', 0, '0', '2023-06-09 16:55:27'),
(85, 12065, 12109, 1, 3, '[{"totalConsume": 20.0, "scalePoint": 5.0, "activeUser": 1.0, "totalLoss": 0.0}, {"totalConsume": 40.0, "scalePoint": 8.0, "activeUser": 3.0, "totalLoss": 1.0}, {"totalConsume": 100.0, "scalePoint": 10.0, "activeUser": 6.0, "totalLoss": 10.0}]', 'woohyuk', 0, '0', '2023-06-09 16:58:37'),
(86, 11564, 11573, 1, 3, '[{"totalConsume": 10.0, "scalePoint": 5.0, "activeUser": 1.0, "totalLoss": 1.0}, {"totalConsume": 30.0, "scalePoint": 10.0, "activeUser": 3.0, "totalLoss": 2.0}, {"totalConsume": 100.0, "scalePoint": 15.0, "activeUser": 8.0, "totalLoss": 5.0}]', 'yp6666', 0, '0', '2023-06-09 17:34:16'),
(87, 11564, 12135, 1, 3, '[{"totalConsume": 10.0, "scalePoint": 5.0, "activeUser": 1.0, "totalLoss": 1.0}, {"totalConsume": 30.0, "scalePoint": 10.0, "activeUser": 3.0, "totalLoss": 2.0}]', 'sl1111', 0, '0', '2023-06-09 17:38:55'),
(88, 12135, 12139, 1, 3, '[{"totalConsume": 10.0, "scalePoint": 5.0, "activeUser": 1.0, "totalLoss": 1.0}]', 'sl0000', 0, '0', '2023-06-09 17:41:19'),
(89, 12191, 12194, 1, 4, '[{"totalConsume": 0, "scalePoint": 0, "activeUser": 0, "totalLoss": 0}]', 'hn0057', 0, '0', '2023-06-09 21:19:46'),
(90, 11573, 12112, 2, 10, '[{"totalConsume": 10.0, "scalePoint": 10.0, "activeUser": 2.0, "totalLoss": 1.0}]', 'mm520', 0, '0', '2023-06-09 21:44:46'),
(91, 10434, 12334, 20, 10, '[{"totalConsume": 0, "scalePoint": 0, "activeUser": 0, "totalLoss": 0}]', 'ft1122', 0, '0', '2023-06-10 13:29:39');

-- --------------------------------------------------------

--
-- 表的结构 `dividend_log`
--

CREATE TABLE IF NOT EXISTS `dividend_log` (
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

CREATE TABLE IF NOT EXISTS `forbid_user` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `rebate` float NOT NULL DEFAULT '0.1' COMMENT '基本返点',
  `hitRate` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '命中率',
  `oooNums` int(11) NOT NULL,
  `oooBonus` int(11) NOT NULL,
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `game_method_limit`
--

CREATE TABLE IF NOT EXISTS `game_method_limit` (
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

CREATE TABLE IF NOT EXISTS `links` (
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
-- 表的结构 `message`
--

CREATE TABLE IF NOT EXISTS `message` (
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

-- --------------------------------------------------------

--
-- 表的结构 `money_out`
--

CREATE TABLE IF NOT EXISTS `money_out` (
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

CREATE TABLE IF NOT EXISTS `money_out_limit` (
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

CREATE TABLE IF NOT EXISTS `notice` (
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
) ENGINE=InnoDB AUTO_INCREMENT=1295618 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `open_code`
--

INSERT INTO `open_code` (`id`, `name`, `issue`, `openCode`, `type`, `openTime`, `oldCode`, `status`, `dayTime`, `createTime`, `stopTime`, `clearTime`) VALUES
(1295605, 'sgssc', '3473747', '0,7,3,5,8', 0, '2023-05-10 00:00:01', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 15:59:25', '2023-05-09 23:59:55', NULL),
(1295609, 'sgkl8', '3473747', '14,16,17,22,23,28,31,32,36,38,41,46,51,52,60,61,66,68,72,76', 0, '2023-05-10 00:00:01', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 15:59:42', '2023-05-10 00:00:10', NULL),
(1295610, 't1s180a', '20200509-0480', '0,4,8,0,0', 0, '2023-05-10 00:00:00', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 16:00:02', '2023-05-10 00:00:30', NULL),
(1295611, 't1s60', '20200509-1440', '7,2,3,5,1', 0, '2023-05-10 00:00:01', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 16:00:03', '2023-05-10 00:00:30', NULL),
(1295612, 't6s180', '20200509-0480', '10,04,09,06,01,03,05,08,07,02', 0, '2023-05-10 00:00:01', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 16:00:04', '2023-05-10 00:00:30', NULL),
(1295613, 't1s30', '20200509-2880', '3,0,6,3,3', 0, '2023-05-10 00:00:01', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 16:00:05', '2023-05-10 00:00:30', NULL),
(1295614, 't1s90b', '20200509-0960', '8,5,4,8,7', 0, '2023-05-10 00:00:01', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 16:00:06', '2023-05-10 00:00:30', NULL),
(1295615, 't1s90a', '20200509-0960', '9,4,5,5,3', 0, '2023-05-10 00:00:01', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 16:00:07', '2023-05-10 00:00:30', NULL),
(1295616, 't3s90', '20200509-0960', '2,3,6', 0, '2023-05-10 00:00:01', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 16:00:08', '2023-05-10 00:00:30', NULL),
(1295617, 't2s30', '20200509-2880', '08,01,02,06,10', 0, '2023-05-10 00:00:01', NULL, 0, '2023-05-09 00:00:00', '2023-05-09 16:00:09', '2023-05-10 00:00:30', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `operation`
--

CREATE TABLE IF NOT EXISTS `operation` (
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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `pay_method`
--

INSERT INTO `pay_method` (`id`, `type`, `method`, `minUnitRecharge`, `maxUnitRecharge`, `feeRate`, `status`, `image`, `name`, `code`, `link`, `isDefault`, `isTransfer`, `uuid`, `timesDay`, `autoMoney`, `bindHost`, `secretKey`, `pubKey`, `appId`, `gateway`, `payUserId`, `outMoneyHost`, `platform`, `paySource`, `payMethod`, `payMethodName`, `remark`, `showName`, `showIndex`, `forUsers`) VALUES
(50, 2, 'BANK_DIRECT', 0, 49999, 0, 0, '', '银行卡转账', NULL, NULL, 0, 1, NULL, 0, 1, '', '', '', '', '', '', '', 0, '', '转卡-BANK_DIRECT-205', '银行卡转账', '', '', 0, 'B,C,D,E,F,G,H'),
(53, 1, 'WAPAY', 100, 49999, 0.5, 1, '', '在处理中xzf转卡支付02(手续费0.5%）', NULL, NULL, 1, 0, NULL, 0, 1, '', '6ulsc26bljne1pwp3d8l2qvp6vfdxfv3', NULL, '200548655', '', '', '', 0, 'zlypay', '好友等卡-WXPAY-941', '微信转卡', '', '讯·好友等卡', 0, 'A,B,C,D,E,F,G,H'),
(57, 1, 'UNIONPAY', 300, 30000, 0.5, 1, '', 'xzf在线网银支付(手续费0.5%）', NULL, NULL, 1, 0, NULL, 0, 1, '', '6ulsc26bljne1pwp3d8l2qvp6vfdxfv3', NULL, '200548655', '', '', '', 0, 'zlypay', '网关-WXPAY-964', '网关支付', '', '讯·网关支付', 0, 'A,B,C,D,E,F,G,H'),
(58, 1, 'UNIONPAY', 100, 49999, 0.5, 0, '', 'xzf转卡支付01(手续费0.5%)', NULL, NULL, 1, 0, NULL, 0, 1, '', '6ulsc26bljne1pwp3d8l2qvp6vfdxfv3', NULL, '200548655', '', '', '', 0, 'zlypay', '复制转卡-UNIONPAY-1004', '复制转卡', '', '讯·复制转卡', 0, 'A,B,C,D,E,F,G,H'),
(59, 1, 'ALIPAY', 500, 3000, 1, 1, '', 'xzf-zfb扫码(手续费1%）', NULL, NULL, 0, 0, NULL, 0, 1, '', '6ulsc26bljne1pwp3d8l2qvp6vfdxfv3', '', '200548655', '', '', '', 0, 'zlypay', '支付宝扫码-ALIPAY-201', '支付宝扫码', '', '', 0, 'A,B,C,D,E,F,G,H'),
(61, 1, 'ALIPAY', 500, 3000, 1, 1, '', 'zbzf-支付宝扫码(手续费1%）', NULL, NULL, 0, 0, NULL, 0, 1, '', '8dd35ad79f7e7d0ae594261359ea1be4', '', 'fc7a929c5c849dc6377ac42714cee867', '', '', '', 0, 'zbpay', '支付宝扫码-ALIPAY-AliPay', '支付宝扫码', '', '', 0, 'A,B,C,D,E,F,G,H');

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
-- 表的结构 `summary_hours`
--

CREATE TABLE IF NOT EXISTS `summary_hours` (
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
) ENGINE=InnoDB AUTO_INCREMENT=3949 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `level`, `sex`, `regIp`, `regSource`, `registTime`, `updateTime`, `balance`, `balanceDeposit`, `type`, `point`, `parentName`, `parents`, `loginTime`, `loginClient`, `onlineStatus`, `nickname`, `status`, `lockTime`, `bindStatus`, `isDel`, `baccaratBalance`, `withdrawPassword`, `realName`, `securityStatus`, `blockedBalance`, `moneyReadyOut`, `lastIP`, `dailyDividendStatus`, `dividendStatus`, `salaryStatus`, `allowEqualCode`, `contractId`, `allowTransfer`, `allowWithdraw`, `allowDividend`, `avatar`, `moneyRebateOut`, `vipLevel`, `balanceThird`, `dividendGroup`, `markPerson`, `markTeam`, `allowOrder`, `allowAgent`, `abnormal`, `allowTeamLogin`, `allowTeamWithdraw`, `allowTeamTransfer`, `tel`, `weixin`, `email`, `agentPercent`, `userLevel`) VALUES
(85, 'xinyong', '888888', 6, NULL, NULL, 0, '2023-01-05 15:27:18', NULL, 100000, 0, '6', 10, NULL, '', '2023-06-11 21:57:29', NULL, 0, 'admin', 0, NULL, 0, 0, 0, 'a123456', 'AD', 1, 0, 0, '8.210.35.92', NULL, NULL, NULL, 0, NULL, 1, 1, 1, '0', 0, 0, 0, 'Bttr', '', '', 1, 1, 0, 1, 1, 1, '123456789', '', '', 0, ''),
(1532, 'test004', '888888', 0, NULL, '203.8.2.63', 0, '2023-03-28 01:39:45', NULL, 9874.49, 0, '1', 9.9, 'xinyong', 'xinyong', '2023-05-27 17:10:24', NULL, 0, 'test004', 1, '2023-06-29 22:59:36', 1, 0, 0, '888888', '李三', NULL, 434.333, 1834, '20.5.8.46', NULL, 1, NULL, 0, NULL, 1, 0, 0, '0', 0, 0, 0, 'Business', '测试号', '冻结05/27', 1, 1, 0, 1, 1, 1, '18282822882', 'ceshi', '12345678@qq.com', 5, '2'),
(1533, 'xinyong01', '11111111', 6, NULL, '19.207.16.92', 0, '2023-01-05 15:27:18', NULL, 100000.25999999997, 0, '1', 10, NULL, '', '2023-05-26 01:46:01', NULL, 0, 'admin', 0, NULL, 0, 0, 0, 'a123456', NULL, 1, 0, 0, '117.139.227.85', NULL, NULL, NULL, 0, NULL, 1, 1, 1, '0', 0, 0, 0, 'Root', '平台总号', '', 1, 1, 0, 1, 1, 1, '', '', '', 0, ''),
(3506, 'sj7777', 'AAaa888888', 0, NULL, '71.10.11.66', 0, '2023-04-01 00:08:18', NULL, 4040.7739999999994, 0, '1', 10, 'xinyong', 'xinyong', '2023-06-11 20:39:21', NULL, 0, 'sj7777', 1, '2023-06-29 22:59:36', 1, 0, 0, '888888', '123', 1, 38126, 38126, '11.9.101.68', NULL, NULL, NULL, 0, NULL, 0, 0, 0, '0', 0, 0, 0, 'Root', ':Error', '', 0, 0, 1, 0, 0, 0, '', '', '', 0, ''),
(3945, 'test1994', '111111', 0, NULL, NULL, 0, '2023-05-21 18:41:09', NULL, 804.9519999999998, 0.074, '1', 9.7, 'xinyong', 'xinyong', '2023-06-10 01:09:44', NULL, 0, 'test1994', 1, '2023-06-29 22:59:36', 1, 0, 0, '888888', '小商', 1, 101, 6301, '11.176.19.32', NULL, NULL, NULL, 0, NULL, 1, 0, 0, '0', 0, 0, 0, 'Agent', ':Error', '测试--封号', 1, 0, 1, 0, 0, 0, '', '', '', 0, ''),
(3948, 'abc12345', 'a123456', 0, NULL, '11.17.19.9', 0, '2023-05-22 11:33:55', NULL, 0, 0, '1', 9.6, 'sj7777', 'xinyong>sj7777', '2023-05-28 17:54:52', NULL, 0, 'abc12345', 1, '2023-06-29 22:59:36', 0, 0, 0, NULL, NULL, NULL, 0, 0, '11.15.25.12', NULL, NULL, NULL, 0, NULL, 1, 1, 1, '0', 0, 0, 0, 'Agent', '', '', 1, 1, 0, 1, 1, 1, '', '', '', 0, '');
-- --------------------------------------------------------

--
-- 表的结构 `user2`
--

CREATE TABLE IF NOT EXISTS `user2` (
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

CREATE TABLE IF NOT EXISTS `user_group` (
  `id` int(11) NOT NULL,
  `code` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一编码',
  `name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户组名称',
  `level` int(11) NOT NULL COMMENT '级别',
  `pointLimit1` int(11) NOT NULL COMMENT '最低奖级',
  `pointLimit2` int(11) NOT NULL COMMENT '最高奖级',
  `agent` int(11) NOT NULL DEFAULT '-1',
  `allowEqualCode` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `user_group`
--

INSERT INTO `user_group` (`id`, `code`, `name`, `level`, `pointLimit1`, `pointLimit2`, `agent`, `allowEqualCode`) VALUES
(1, 'Agent', '代理', 8, 1802, 1994, -1, 1),
(2, 'Manage', '主管', 6, 1996, 1996, -1, 1),
(5, 'Business', '招商', 7, 1994, 1994, 10000, 1),
(6, 'Root', '总号', 1, 2000, 2000, -1, 1),
(7, 'Line', '线路', 3, 2000, 2000, -1, 1),
(8, 'Boss', '老板', 5, 1998, 1998, -1, 1),
(9, 'Member', '会员', 9, 1802, 1994, -1, 0),
(10, 'Shareholder', '内部股东', 4, 2000, 2000, -1, 1),
(11, 'Bttr', '平台总号', 0, 2000, 2000, -1, 1),
(13, 'Ttrr', '大线路', 2, 2000, 2000, -1, 1);

-- --------------------------------------------------------

--
-- 表的结构 `_card`
--

CREATE TABLE IF NOT EXISTS `_card` (
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
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `activity_conf`
--
ALTER TABLE `activity_conf`
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
  ADD KEY `updateTime` (`updateTime`),
  ADD KEY `amount_2` (`amount`,`type`),
  ADD KEY `updateTime_2` (`updateTime`,`status`),
  ADD KEY `status_2` (`status`,`updateTime`),
  ADD KEY `account_2` (`account`,`updateTime`),
  ADD KEY `update_date` (`update_date`),
  ADD KEY `status_3` (`status`,`update_date`);

--
-- Indexes for table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bankCardId` (`bankCardId`),
  ADD KEY `user` (`user`),
  ADD KEY `isDefault` (`isDefault`),
  ADD KEY `user_2` (`user`,`isDefault`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `consume_limit`
--
ALTER TABLE `consume_limit`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

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
  ADD UNIQUE KEY `username_2` (`username`,`issue`) USING BTREE,
  ADD KEY `username` (`username`),
  ADD KEY `issue` (`issue`);

--
-- Indexes for table `forbid_user`
--
ALTER TABLE `forbid_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`,`thirdParty`,`lottery`,`method`);

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
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lottery` (`lottery`,`method`);

--
-- Indexes for table `game_order`
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
-- Indexes for table `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`) USING BTREE,
  ADD KEY `accountId` (`accountId`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `createTime` (`createTime`),
  ADD KEY `user_2` (`user`,`createTime`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `money_out_limit`
--
ALTER TABLE `money_out_limit`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `summary_hours`
--
ALTER TABLE `summary_hours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `beginTime` (`beginTime`);

--
-- Indexes for table `sys_log`
--
ALTER TABLE `sys_log`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_3` (`category`,`lastTime`,`configId`),
  ADD UNIQUE KEY `category` (`category`,`issue`),
  ADD KEY `configId` (`configId`),
  ADD KEY `runTime` (`runTime`),
  ADD KEY `category_2` (`category`);

--
-- Indexes for table `user`
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
-- Indexes for table `user2`
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
-- Indexes for table `user_group`
--
ALTER TABLE `user_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `_card`
--
ALTER TABLE `_card`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bankCardId` (`bankCardId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity`
--
ALTER TABLE `activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `activity_conf`
--
ALTER TABLE `activity_conf`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=104;
--
-- AUTO_INCREMENT for table `consume_limit`
--
ALTER TABLE `consume_limit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=92;
--
-- AUTO_INCREMENT for table `dividend_log`
--
ALTER TABLE `dividend_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `forbid_user`
--
ALTER TABLE `forbid_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_chase`
--
ALTER TABLE `game_chase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_config`
--
ALTER TABLE `game_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_method`
--
ALTER TABLE `game_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_method_limit`
--
ALTER TABLE `game_method_limit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `game_order`
--
ALTER TABLE `game_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `links`
--
ALTER TABLE `links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `money_out_limit`
--
ALTER TABLE `money_out_limit`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1295618;
--
-- AUTO_INCREMENT for table `operation`
--
ALTER TABLE `operation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pay_method`
--
ALTER TABLE `pay_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=62;
--
-- AUTO_INCREMENT for table `pay_transfer`
--
ALTER TABLE `pay_transfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
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
-- AUTO_INCREMENT for table `summary_hours`
--
ALTER TABLE `summary_hours`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3949;
--
-- AUTO_INCREMENT for table `user2`
--
ALTER TABLE `user2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user_group`
--
ALTER TABLE `user_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `_card`
--
ALTER TABLE `_card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
