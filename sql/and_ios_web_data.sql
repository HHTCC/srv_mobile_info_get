/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : and_ios_web_data

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 05/01/2020 21:40:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_admins
-- ----------------------------
DROP TABLE IF EXISTS `t_admins`;
CREATE TABLE `t_admins`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `nick_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `password` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'token',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_base_numbers
-- ----------------------------
DROP TABLE IF EXISTS `t_base_numbers`;
CREATE TABLE `t_base_numbers`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `_code` int(11) NOT NULL COMMENT '邀请码',
  `_mobile` bigint(20) NOT NULL COMMENT '手机号',
  `_longitude` float(11, 4) NOT NULL COMMENT '经度',
  `_latitude` float(11, 4) NOT NULL COMMENT '纬度',
  `_phone_numbers_json_array` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL COMMENT 'json通讯录 [{手机号,名称,经,纬},{名称,手机号,经,纬},]',
  `_message_list_json_array` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL COMMENT 'json通讯录 [{手机号,消息内容},{手机号,消息内容},]',
  `_time` datetime(3) NOT NULL COMMENT '收录时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `m`(`_mobile`) USING BTREE,
  INDEX `t`(`_time`) USING BTREE,
  INDEX `c`(`_code`, `_mobile`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 7115 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_ios_enable
-- ----------------------------
DROP TABLE IF EXISTS `t_ios_enable`;
CREATE TABLE `t_ios_enable`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `ios_enable` int(10) NULL DEFAULT NULL COMMENT 'enable',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Fixed;

SET FOREIGN_KEY_CHECKS = 1;
