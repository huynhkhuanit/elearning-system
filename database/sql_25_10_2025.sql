CREATE DATABASE  IF NOT EXISTS `learning_platform_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `learning_platform_db`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: learning_platform_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('31823a07-9f77-11f0-ad43-a036bc320b36','Web Development','web-development','Learn modern web development',NULL,0,1,'2025-10-02 17:04:32'),('31828d8d-9f77-11f0-ad43-a036bc320b36','Mobile Development','mobile-development','Build mobile apps',NULL,0,1,'2025-10-02 17:04:32'),('318292e1-9f77-11f0-ad43-a036bc320b36','Data Science','data-science','Data analysis and ML',NULL,0,1,'2025-10-02 17:04:32'),('318294a1-9f77-11f0-ad43-a036bc320b36','DevOps','devops','Deployment and infrastructure',NULL,0,1,'2025-10-02 17:04:32'),('a1b2c3d4-1234-5678-9abc-def012345678','Programming Languages','programming-languages','Master programming languages',NULL,0,1,'2025-10-12 04:38:33');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapters` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `course_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL,
  `is_published` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`,`sort_order`),
  CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES ('008a6473-036a-4f99-9688-5edf50a48368','c4444444-4444-4444-4444-444444444444','Dự án thực tế 2','Dự án phức tạp với nhiều tính năng',6,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('15ab01f4-2a50-4e7a-8829-ffe4429f5cba','c3333333-3333-3333-3333-333333333333','DevOps và Cloud','Deploy và quản lý ứng dụng trên cloud',8,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('161ab352-776b-4fb1-830d-1d00cf4ccde1','c2222222-2222-2222-2222-222222222222','Dự án thực tế 2','Dự án phức tạp với nhiều tính năng',6,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('1821b63c-0cf6-4ef0-9a15-7c09413a7f0e','c4444444-4444-4444-4444-444444444444','Dự án tốt nghiệp','Xây dựng dự án cá nhân hoàn chỉnh',9,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('1c2a5e2a-398d-4f24-b1fb-eaec3e564ad1','c3333333-3333-3333-3333-333333333333','Lập trình nâng cao','Các kỹ thuật và patterns nâng cao',3,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('2584b48e-6ea7-4a84-8362-1f69f037cdf2','c4444444-4444-4444-4444-444444444444','Kiến thức nền tảng','Các khái niệm cơ bản và cú pháp cần thiết',2,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('2a3cf8f7-6c60-40a3-8e26-943b43f6ff62','c4444444-4444-4444-4444-444444444444','DevOps và Cloud','Deploy và quản lý ứng dụng trên cloud',8,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('3443aa98-fa3d-4e79-9ce9-63e30e9d5414','c4444444-4444-4444-4444-444444444444','Microservices Architecture','Kiến trúc hệ thống quy mô lớn',7,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('4331821a-5296-485d-91e4-a7f2b5dd8e6f','c2222222-2222-2222-2222-222222222222','Bonus: Career Development','Chuẩn bị cho sự nghiệp lập trình viên',10,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('486e88e6-e5ae-486e-be55-94ed3f943bfc','c3333333-3333-3333-3333-333333333333','Giới thiệu khóa học','Tổng quan về khóa học và chuẩn bị môi trường học tập',1,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('5142c12e-1d25-4c22-85b0-d0e5435ca235','c2222222-2222-2222-2222-222222222222','DevOps và Cloud','Deploy và quản lý ứng dụng trên cloud',8,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('542e68d8-939e-4071-a25c-59bf70fac24e','c5555555-5555-5555-5555-555555555555','Dự án thực tế 1','Xây dựng ứng dụng hoàn chỉnh từ đầu đến cuối',4,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('54e63972-81ef-4232-b218-9495af172951','c1111111-1111-1111-1111-111111111111','Kiến thức nâng cao','Performance, Security và Best Practices',5,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('552c1786-4e74-4c37-898a-3a197dc7f662','c5555555-5555-5555-5555-555555555555','Lập trình nâng cao','Các kỹ thuật và patterns nâng cao',3,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('582537a1-42c0-469c-b0ff-5bda6bba35f8','c1111111-1111-1111-1111-111111111111','Microservices Architecture','Kiến trúc hệ thống quy mô lớn',7,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('5a36a4e3-a7ab-11f0-860a-a036bc320b36','c1111111-1111-1111-1111-111111111111','Giới thiệu khóa học','Tổng quan về khóa học và chuẩn bị môi trường học tập',1,1,'2025-10-13 03:38:04','2025-10-13 03:38:04'),('5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e','c4444444-4444-4444-4444-444444444444','Dự án thực tế 1','Xây dựng ứng dụng hoàn chỉnh từ đầu đến cuối',4,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('69eba7b4-7b51-4704-bc5a-4b090f63d00d','c3333333-3333-3333-3333-333333333333','Bonus: Career Development','Chuẩn bị cho sự nghiệp lập trình viên',10,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('6b27693b-2b72-40d1-be86-8fddf5d260d1','c5555555-5555-5555-5555-555555555555','Microservices Architecture','Kiến trúc hệ thống quy mô lớn',7,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('6cffc324-663e-4c5c-8e9c-642a0d4065be','c1111111-1111-1111-1111-111111111111','Bonus: Career Development','Chuẩn bị cho sự nghiệp lập trình viên',10,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('757c5041-08bc-448a-a770-0b8bd7fd7ff6','c1111111-1111-1111-1111-111111111111','DevOps và Cloud','Deploy và quản lý ứng dụng trên cloud',8,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('76d7395f-b884-4216-97a2-5de3e2ac4a3c','c3333333-3333-3333-3333-333333333333','Dự án tốt nghiệp','Xây dựng dự án cá nhân hoàn chỉnh',9,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('7b74c851-504d-46c5-bbed-51a9fe375007','c3333333-3333-3333-3333-333333333333','Kiến thức nâng cao','Performance, Security và Best Practices',5,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('7cadc65f-69c0-41d4-88e5-e4dc940e8664','c4444444-4444-4444-4444-444444444444','Lập trình nâng cao','Các kỹ thuật và patterns nâng cao',3,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('7f3f2717-bd76-44c2-9b96-a1616b928913','c5555555-5555-5555-5555-555555555555','Bonus: Career Development','Chuẩn bị cho sự nghiệp lập trình viên',10,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('8aa05cc3-06d6-43f2-babf-cef8a21c6818','c5555555-5555-5555-5555-555555555555','Dự án tốt nghiệp','Xây dựng dự án cá nhân hoàn chỉnh',9,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('9163e4b4-aa52-4869-a6fe-5ee057d3d3e8','c2222222-2222-2222-2222-222222222222','Kiến thức nâng cao','Performance, Security và Best Practices',5,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('98165aa9-8806-49dd-ab80-3f56766bc299','c4444444-4444-4444-4444-444444444444','Kiến thức nâng cao','Performance, Security và Best Practices',5,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('98e74469-b6b0-4a13-8713-67171f9bcb57','c2222222-2222-2222-2222-222222222222','Dự án tốt nghiệp','Xây dựng dự án cá nhân hoàn chỉnh',9,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('a502fa48-a069-433a-b6ba-a0b0f7893831','c1111111-1111-1111-1111-111111111111','Dự án thực tế 2','Dự án phức tạp với nhiều tính năng',6,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('aef1160f-824e-4d89-9ffa-bd75ab63bcac','c5555555-5555-5555-5555-555555555555','Kiến thức nền tảng','Các khái niệm cơ bản và cú pháp cần thiết',2,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('b02b6a63-a7ab-11f0-860a-a036bc320b36','c1111111-1111-1111-1111-111111111111','Giới thiệu khóa học','Tổng quan về khóa học và chuẩn bị môi trường học tập',1,1,'2025-10-13 03:40:28','2025-10-13 03:40:28'),('b04a782c-5491-4e55-96bf-abebdb71aa79','c5555555-5555-5555-5555-555555555555','Giới thiệu khóa học','Tổng quan về khóa học và chuẩn bị môi trường học tập',1,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('b1658481-fcdf-4a72-871f-27489c6460d9','c5555555-5555-5555-5555-555555555555','Kiến thức nâng cao','Performance, Security và Best Practices',5,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('b76f42a9-f5d8-4b64-b96e-c0ade97f0e44','c2222222-2222-2222-2222-222222222222','Lập trình nâng cao','Các kỹ thuật và patterns nâng cao',3,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('bda7c7bb-6881-40fd-98c3-83f7725d2251','c2222222-2222-2222-2222-222222222222','Microservices Architecture','Kiến trúc hệ thống quy mô lớn',7,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('c2e518dc-f77b-41d7-a9bc-f6a1f33db331','c1111111-1111-1111-1111-111111111111','Dự án thực tế 1','Xây dựng ứng dụng hoàn chỉnh từ đầu đến cuối',4,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('c6e36667-6731-4e49-a8e3-5262615d850a','c1111111-1111-1111-1111-111111111111','Dự án tốt nghiệp','Xây dựng dự án cá nhân hoàn chỉnh',9,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('ce20ab2d-638d-4a11-a4ea-2ff8a9fe7858','c3333333-3333-3333-3333-333333333333','Microservices Architecture','Kiến trúc hệ thống quy mô lớn',7,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('cf4b90bb-4624-41de-8e3f-357a9552c980','c2222222-2222-2222-2222-222222222222','Kiến thức nền tảng','Các khái niệm cơ bản và cú pháp cần thiết',2,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('cffde1b1-e3ac-46a7-8b7b-f953841588c3','c4444444-4444-4444-4444-444444444444','Giới thiệu khóa học','Tổng quan về khóa học và chuẩn bị môi trường học tập',1,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('ch2-01','c2222222-2222-2222-2222-222222222222','C++ Introduction','Giới thiệu C++, setup environment',1,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch2-02','c2222222-2222-2222-2222-222222222222','Basic Syntax','Variables, data types, operators',2,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch2-03','c2222222-2222-2222-2222-222222222222','Control Flow','if-else, loops, switch statements',3,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch2-04','c2222222-2222-2222-2222-222222222222','Functions','Function declaration, parameters, recursion',4,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch2-05','c2222222-2222-2222-2222-222222222222','Arrays & Pointers','Arrays, pointers, memory management',5,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch2-06','c2222222-2222-2222-2222-222222222222','Object-Oriented Programming','Classes, objects, constructors, destructors',6,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch2-07','c2222222-2222-2222-2222-222222222222','Inheritance & Polymorphism','Inheritance, virtual functions, overriding',7,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch2-08','c2222222-2222-2222-2222-222222222222','STL & Templates','Standard Template Library, templates basics',8,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch2-09','c2222222-2222-2222-2222-222222222222','File I/O','Reading and writing files',9,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch2-10','c2222222-2222-2222-2222-222222222222','Projects & Best Practices','Real-world projects, coding standards',10,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-01','c3333333-3333-3333-3333-333333333333','HTML Fundamentals','Học các thẻ HTML cơ bản và tạo trang web đơn giản',1,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-02','c3333333-3333-3333-3333-333333333333','HTML Forms','Tạo và xử lý biểu mẫu trong HTML',2,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-03','c3333333-3333-3333-3333-333333333333','CSS Basics','CSS cơ bản - tạo kiểu cho HTML',3,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-04','c3333333-3333-3333-3333-333333333333','CSS Layout','Flexbox và CSS Grid',4,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-05','c3333333-3333-3333-3333-333333333333','Responsive Design','Mobile-first approach và media queries',5,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-06','c3333333-3333-3333-3333-333333333333','CSS Animations','Transitions và keyframe animations',6,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-07','c3333333-3333-3333-3333-333333333333','Modern CSS','CSS Variables, calc(), clamp(), aspect-ratio',7,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-08','c3333333-3333-3333-3333-333333333333','CSS Frameworks','Giới thiệu Tailwind CSS',8,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-09','c3333333-3333-3333-3333-333333333333','Web Accessibility','ARIA, Semantic HTML, WCAG guidelines',9,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch3-10','c3333333-3333-3333-3333-333333333333','Projects & Performance','Build projects, optimize CSS performance',10,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-01','c5555555-5555-5555-5555-555555555555','JavaScript Fundamentals','Cú pháp cơ bản và setup environment',1,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-02','c5555555-5555-5555-5555-555555555555','Variables & Data Types','let, const, var và các kiểu dữ liệu',2,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-03','c5555555-5555-5555-5555-555555555555','Operators & Control Flow','Operators, if-else, switch, loops',3,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-04','c5555555-5555-5555-5555-555555555555','Functions','Function declaration, arrow functions, scope',4,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-05','c5555555-5555-5555-5555-555555555555','Arrays','Array methods, iteration, manipulation',5,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-06','c5555555-5555-5555-5555-555555555555','Objects','Object creation, properties, methods',6,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-07','c5555555-5555-5555-5555-555555555555','DOM Manipulation','Selecting elements, modifying DOM',7,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-08','c5555555-5555-5555-5555-555555555555','Events','Event listeners, event handling, bubbling',8,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-09','c5555555-5555-5555-5555-555555555555','Async JavaScript','Promises, async/await basics',9,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('ch5-10','c5555555-5555-5555-5555-555555555555','Projects & Best Practices','Mini projects, debugging, code style',10,1,'2025-10-24 15:10:43','2025-10-24 15:10:43'),('d1e2940e-c499-48b1-94ea-fdd6199de7b2','c3333333-3333-3333-3333-333333333333','Dự án thực tế 2','Dự án phức tạp với nhiều tính năng',6,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('d55c98b0-8852-4dc6-8e40-37e224ba0a05','c5555555-5555-5555-5555-555555555555','DevOps và Cloud','Deploy và quản lý ứng dụng trên cloud',8,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('e73bcafa-d309-49ca-9281-8522a3f3a22d','c3333333-3333-3333-3333-333333333333','Kiến thức nền tảng','Các khái niệm cơ bản và cú pháp cần thiết',2,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('e88f62a2-4e5d-45ab-9a3d-84b0dac88876','c4444444-4444-4444-4444-444444444444','Bonus: Career Development','Chuẩn bị cho sự nghiệp lập trình viên',10,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('f117a365-6dc2-4787-b255-0ae9e4ffe00f','c1111111-1111-1111-1111-111111111111','Lập trình nâng cao','Các kỹ thuật và patterns nâng cao',3,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('f3d94b5a-2690-46a2-a5b4-d96b7c27c844','c1111111-1111-1111-1111-111111111111','Kiến thức nền tảng','Các khái niệm cơ bản và cú pháp cần thiết',2,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('f48cf941-063c-4b20-b1d8-40aa08234942','c5555555-5555-5555-5555-555555555555','Dự án thực tế 2','Dự án phức tạp với nhiều tính năng',6,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('fa57c3f5-cc57-4b1a-88e5-01314758a3c9','c2222222-2222-2222-2222-222222222222','Dự án thực tế 1','Xây dựng ứng dụng hoàn chỉnh từ đầu đến cuối',4,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('fb0abe9f-e89d-4de4-89b6-2183c4162730','c1111111-1111-1111-1111-111111111111','Giới thiệu khóa học','Tổng quan về khóa học và chuẩn bị môi trường học tập',1,1,'2025-10-13 03:41:26','2025-10-13 03:41:26'),('fd40dc40-cda6-4a58-a22c-a1523da4c2af','c3333333-3333-3333-3333-333333333333','Dự án thực tế 1','Xây dựng ứng dụng hoàn chỉnh từ đầu đến cuối',4,1,'2025-10-13 03:41:27','2025-10-13 03:41:27'),('feb7314f-cc94-428e-8cf9-097314ca5049','c2222222-2222-2222-2222-222222222222','Giới thiệu khóa học','Tổng quan về khóa học và chuẩn bị môi trường học tập',1,1,'2025-10-13 03:41:26','2025-10-13 03:41:26');
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_likes`
--

DROP TABLE IF EXISTS `comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_likes` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`user_id`,`comment_id`),
  KEY `idx_comment` (`comment_id`),
  CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_likes`
--

LOCK TABLES `comment_likes` WRITE;
/*!40000 ALTER TABLE `comment_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_timestamp` int DEFAULT NULL,
  `likes_count` int DEFAULT '0',
  `is_pinned` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_lesson` (`lesson_id`,`created_at` DESC),
  KEY `idx_user` (`user_id`),
  KEY `idx_parent` (`parent_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `short_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instructor_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` enum('BEGINNER','INTERMEDIATE','ADVANCED') COLLATE utf8mb4_unicode_ci DEFAULT 'BEGINNER',
  `price` decimal(10,2) DEFAULT '0.00',
  `is_free` tinyint(1) DEFAULT '1',
  `is_published` tinyint(1) DEFAULT '0',
  `estimated_duration` int DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `total_students` int DEFAULT '0',
  `total_lessons` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_instructor` (`instructor_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_published` (`is_published`),
  KEY `idx_rating` (`rating` DESC),
  KEY `idx_slug` (`slug`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES ('c1111111-1111-1111-1111-111111111111','Lập trình JavaScript Nâng Cao','lap-trinh-javascript-nang-cao','Khóa học JavaScript nâng cao dành cho developer muốn nâng cấp kỹ năng lên một tầm cao mới. Bạn sẽ học về ES6+, Async/Await, Promises, Design Patterns, Performance Optimization, Testing, và nhiều hơn nữa. Khóa học này sẽ giúp bạn trở thành một JavaScript Developer chuyên nghiệp.\r\n\r\n**Nội dung khóa học:**\r\n- ES6+ Features: Arrow functions, Destructuring, Spread/Rest operators\r\n- Advanced Functions: Closures, Higher-order functions, Currying\r\n- Asynchronous JavaScript: Callbacks, Promises, Async/Await\r\n- Object-Oriented Programming: Classes, Inheritance, Prototypes\r\n- Functional Programming: Pure functions, Immutability, Composition\r\n- Design Patterns: Singleton, Factory, Observer, Module patterns\r\n- Performance Optimization: Debouncing, Throttling, Memoization\r\n- Testing: Unit testing with Jest, Integration testing\r\n- Modern Tools: Webpack, Babel, ESLint\r\n- Real-world Projects: Build scalable applications\r\n\r\n**Yêu cầu:**\r\n- Đã biết JavaScript cơ bản\r\n- Hiểu về HTML, CSS\r\n- Có kiến thức về lập trình hướng đối tượng\r\n\r\n**Bạn sẽ nhận được:**\r\n- 45 giờ video chất lượng cao\r\n- 50+ bài tập thực hành\r\n- 5 dự án thực tế\r\n- Certificate sau khi hoàn thành\r\n- Hỗ trợ trực tiếp từ giảng viên\r\n- Cộng đồng học viên chất lượng','JavaScript nâng cao cho developer: ES6+, Async, Patterns, Testing & Real Projects',NULL,'2396a721-a1e4-11f0-864b-a036bc320b36','31823a07-9f77-11f0-ad43-a036bc320b36','ADVANCED',1399000.00,0,1,2730,4.90,1254,60,'2025-10-12 04:38:33','2025-10-13 03:41:26'),('c2222222-2222-2222-2222-222222222222','Lập trình C++ Cơ Bản Đến Nâng Cao','lap-trinh-cpp-co-ban-den-nang-cao','Khóa học C++ toàn diện từ cơ bản đến nâng cao. Bạn sẽ học mọi thứ từ syntax cơ bản, OOP, STL, cho đến các kỹ thuật nâng cao như Templates, Smart Pointers, và Modern C++ (C++11/14/17/20).\r\n\r\n**Nội dung khóa học:**\r\n- C++ Basics: Variables, Data types, Operators, Control flow\r\n- Functions: Parameters, Return values, Overloading, Recursion\r\n- Arrays and Strings: 1D/2D arrays, String manipulation\r\n- Pointers and References: Memory management, Dynamic allocation\r\n- Object-Oriented Programming: Classes, Objects, Inheritance, Polymorphism\r\n- STL (Standard Template Library): Vectors, Maps, Sets, Algorithms\r\n- Templates: Function templates, Class templates\r\n- Exception Handling: Try-catch, Custom exceptions\r\n- File I/O: Reading and writing files\r\n- Modern C++: Smart pointers, Lambda expressions, Move semantics\r\n- Data Structures: Linked lists, Stacks, Queues, Trees\r\n- Algorithms: Sorting, Searching, Graph algorithms\r\n- Best Practices: Code organization, Documentation\r\n\r\n**Yêu cầu:**\r\n- Chỉ cần biết sử dụng máy tính\r\n- Không yêu cầu kiến thức lập trình trước đó\r\n- Đam mê học lập trình\r\n\r\n**Bạn sẽ nhận được:**\r\n- 32 giờ video chi tiết\r\n- 100+ bài tập thực hành\r\n- Source code mẫu\r\n- Quiz sau mỗi chương\r\n- Flashcards ôn tập\r\n- Community support','C++ từ zero đến hero: Syntax, OOP, STL, Templates & Modern C++',NULL,'2396a721-a1e4-11f0-864b-a036bc320b36','a1b2c3d4-1234-5678-9abc-def012345678','BEGINNER',0.00,1,1,1965,4.80,25894,60,'2025-10-12 04:38:33','2025-10-24 14:32:32'),('c3333333-3333-3333-3333-333333333333','HTML CSS Cơ Bản Đến Nâng Cao','html-css-co-ban-den-nang-cao','Khóa học HTML & CSS toàn diện, giúp bạn xây dựng website đẹp và responsive. Từ những thẻ HTML cơ bản đến CSS Grid, Flexbox, và responsive design với media queries.\r\n\r\n**Nội dung khóa học:**\r\n- HTML Fundamentals: Tags, Attributes, Semantic HTML\r\n- HTML Forms: Input types, Validation, Accessibility\r\n- CSS Basics: Selectors, Properties, Box model\r\n- CSS Layout: Flexbox, Grid, Positioning\r\n- Responsive Design: Media queries, Mobile-first approach\r\n- CSS Animations: Transitions, Transforms, Keyframes\r\n- Modern CSS: Variables, calc(), clamp()\r\n- CSS Frameworks: Introduction to Tailwind CSS\r\n- Web Accessibility: ARIA, Semantic HTML, Best practices\r\n- Performance: Optimizing CSS, Critical CSS\r\n- Real Projects: Build 10+ responsive websites\r\n- Portfolio Website: Build your own portfolio\r\n- Best Practices: BEM methodology, CSS architecture\r\n\r\n**Yêu cầu:**\r\n- Chỉ cần biết sử dụng máy tính\r\n- Không cần kinh nghiệm lập trình\r\n- Có tinh thần học hỏi\r\n\r\n**Bạn sẽ nhận được:**\r\n- 28 giờ video hướng dẫn\r\n- 50+ bài tập thực hành\r\n- 10 dự án thực tế\r\n- Source code đầy đủ\r\n- Hỗ trợ từ cộng đồng\r\n- Certificate khi hoàn thành','HTML & CSS complete: Semantic HTML, Flexbox, Grid & Responsive Design',NULL,'2396a721-a1e4-11f0-864b-a036bc320b36','31823a07-9f77-11f0-ad43-a036bc320b36','BEGINNER',0.00,1,1,1700,4.90,45234,60,'2025-10-12 04:38:33','2025-10-13 03:41:27'),('c4444444-4444-4444-4444-444444444444','Cấu Trúc Dữ Liệu Và Giải Thuật','cau-truc-du-lieu-va-giai-thuat','Khóa học về Cấu trúc dữ liệu và Giải thuật (Data Structures & Algorithms) - nền tảng quan trọng nhất của lập trình. Học cách tư duy thuật toán, phân tích độ phức tạp, và giải quyết vấn đề hiệu quả.\r\n\r\n**Nội dung khóa học:**\r\n- Algorithm Analysis: Big O notation, Time & Space complexity\r\n- Arrays & Strings: Manipulation, Two pointers technique\r\n- Linked Lists: Singly, Doubly, Circular linked lists\r\n- Stacks & Queues: Implementation, Applications\r\n- Hash Tables: Hash functions, Collision handling\r\n- Trees: Binary trees, BST, AVL, Red-Black trees\r\n- Heaps: Min heap, Max heap, Priority queue\r\n- Graphs: Representation, BFS, DFS, Shortest paths\r\n- Sorting Algorithms: Bubble, Selection, Insertion, Merge, Quick sort\r\n- Searching Algorithms: Linear, Binary, Interpolation search\r\n- Dynamic Programming: Memoization, Tabulation\r\n- Greedy Algorithms: Activity selection, Huffman coding\r\n- Backtracking: N-Queens, Sudoku solver\r\n- Divide and Conquer: Merge sort, Quick sort\r\n- Problem Solving: LeetCode-style problems\r\n\r\n**Yêu cầu:**\r\n- Biết ít nhất 1 ngôn ngữ lập trình (C++, Java, Python)\r\n- Hiểu về biến, vòng lặp, hàm\r\n- Tư duy logic tốt\r\n\r\n**Bạn sẽ nhận được:**\r\n- 35 giờ video chi tiết\r\n- 200+ bài tập từ dễ đến khó\r\n- Visual animations cho mỗi thuật toán\r\n- Interview preparation materials\r\n- LeetCode problem sets\r\n- Certificate sau khi hoàn thành','Master DSA: Arrays, Trees, Graphs, DP & Problem Solving',NULL,'2396a721-a1e4-11f0-864b-a036bc320b36','a1b2c3d4-1234-5678-9abc-def012345678','ADVANCED',0.00,1,1,2115,4.70,18954,60,'2025-10-12 04:38:33','2025-10-24 14:32:36'),('c5555555-5555-5555-5555-555555555555','Lập trình JavaScript Cơ Bản','lap-trinh-javascript-co-ban','Khóa học JavaScript cơ bản dành cho người mới bắt đầu. Bạn sẽ học mọi thứ từ cú pháp cơ bản, DOM manipulation, đến xây dựng các web application đơn giản.\r\n\r\n**Nội dung khóa học:**\r\n- JavaScript Introduction: History, Setup, First program\r\n- Variables & Data Types: let, const, var, Numbers, Strings, Booleans\r\n- Operators: Arithmetic, Comparison, Logical operators\r\n- Control Flow: if-else, switch, ternary operator\r\n- Loops: for, while, do-while, forEach\r\n- Functions: Declaration, Expression, Arrow functions\r\n- Arrays: Methods, Iteration, Manipulation\r\n- Objects: Properties, Methods, this keyword\r\n- DOM Manipulation: Selecting elements, Event listeners\r\n- Events: Click, Submit, Keyboard events\r\n- Forms: Input handling, Validation\r\n- Browser APIs: LocalStorage, Fetch API\r\n- ES6 Basics: Template literals, Destructuring\r\n- Mini Projects: Calculator, Todo List, Weather App\r\n- Best Practices: Code style, Debugging\r\n\r\n**Yêu cầu:**\r\n- Biết HTML & CSS cơ bản\r\n- Không cần kinh nghiệm JavaScript\r\n- Có laptop và text editor\r\n\r\n**Bạn sẽ nhận được:**\r\n- 18 giờ video từng bước\r\n- 60+ bài tập code\r\n- 5 mini projects\r\n- Source code đầy đủ\r\n- Community support\r\n- Certificate khi hoàn thành','JavaScript basics: Syntax, DOM, Events & Build Real Projects',NULL,'2396a721-a1e4-11f0-864b-a036bc320b36','31823a07-9f77-11f0-ad43-a036bc320b36','BEGINNER',0.00,1,1,1110,4.80,32184,60,'2025-10-12 04:38:33','2025-10-13 03:41:27');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrolled_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `completed_at` datetime DEFAULT NULL,
  `progress_percentage` decimal(5,2) DEFAULT '0.00',
  `last_lesson_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_watch_time` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment` (`user_id`,`course_id`),
  KEY `last_lesson_id` (`last_lesson_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_active` (`user_id`,`is_active`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`last_lesson_id`) REFERENCES `lessons` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES ('07a7f57b-a6f2-11f0-8077-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','c3333333-3333-3333-3333-333333333333','2025-10-12 05:31:28',NULL,0.00,NULL,0,1),('090a2670-a6f2-11f0-8077-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','c4444444-4444-4444-4444-444444444444','2025-10-12 05:31:31',NULL,0.00,NULL,0,1),('0991680e-a6f2-11f0-8077-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','c5555555-5555-5555-5555-555555555555','2025-10-12 05:31:32',NULL,0.00,NULL,0,1),('09d593a9-a6f2-11f0-8077-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','c2222222-2222-2222-2222-222222222222','2025-10-12 05:31:32',NULL,0.00,NULL,0,1),('346847c9-a6f0-11f0-8077-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','c1111111-1111-1111-1111-111111111111','2025-10-12 05:18:25',NULL,23.33,'530696be-9403-47df-accd-1d122b79d3ff',0,1),('9a79765f-b0ab-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','c2222222-2222-2222-2222-222222222222','2025-10-24 14:32:32',NULL,47.78,'a9d59695-1cd4-4a1a-a348-e6e424f59f23',0,1),('9cbbd682-b0ab-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','c4444444-4444-4444-4444-444444444444','2025-10-24 14:32:36',NULL,0.00,NULL,0,1),('c15e4d13-a6ef-11f0-8077-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','c3333333-3333-3333-3333-333333333333','2025-10-12 05:15:11',NULL,7.96,'les3-01-04',0,1),('d543b058-a6ef-11f0-8077-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','c1111111-1111-1111-1111-111111111111','2025-10-12 05:15:45',NULL,21.67,'4539b74e-aaa5-4ebc-8fb5-78fb57484d67',0,1),('f3e036e4-a6ef-11f0-8077-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','c5555555-5555-5555-5555-555555555555','2025-10-12 05:16:36',NULL,0.00,NULL,0,1);
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flashcard_sessions`
--

DROP TABLE IF EXISTS `flashcard_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flashcard_sessions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flashcard_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `practiced_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_flashcard` (`flashcard_id`),
  CONSTRAINT `flashcard_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `flashcard_sessions_ibfk_2` FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashcard_sessions`
--

LOCK TABLES `flashcard_sessions` WRITE;
/*!40000 ALTER TABLE `flashcard_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `flashcard_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flashcards`
--

DROP TABLE IF EXISTS `flashcards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flashcards` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `chapter_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `hint` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chapter` (`chapter_id`),
  CONSTRAINT `flashcards_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashcards`
--

LOCK TABLES `flashcards` WRITE;
/*!40000 ALTER TABLE `flashcards` DISABLE KEYS */;
/*!40000 ALTER TABLE `flashcards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_categories`
--

DROP TABLE IF EXISTS `forum_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_categories` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_categories`
--

LOCK TABLES `forum_categories` WRITE;
/*!40000 ALTER TABLE `forum_categories` DISABLE KEYS */;
INSERT INTO `forum_categories` VALUES ('3183ecfc-9f77-11f0-ad43-a036bc320b36','General Discussion','general','General programming discussions',NULL,0,1,'2025-10-02 17:04:32'),('3183f322-9f77-11f0-ad43-a036bc320b36','Help & Support','help-support','Get help with your problems',NULL,0,1,'2025-10-02 17:04:32'),('3183f4d7-9f77-11f0-ad43-a036bc320b36','Project Showcase','showcase','Share your projects',NULL,0,1,'2025-10-02 17:04:32'),('3183f664-9f77-11f0-ad43-a036bc320b36','Career Advice','career','Career guidance and jobs',NULL,0,1,'2025-10-02 17:04:32');
/*!40000 ALTER TABLE `forum_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_replies`
--

DROP TABLE IF EXISTS `forum_replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_replies` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `topic_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_solution` tinyint(1) DEFAULT '0',
  `likes_count` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_topic` (`topic_id`,`created_at`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `forum_replies_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `forum_topics` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_replies_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_replies`
--

LOCK TABLES `forum_replies` WRITE;
/*!40000 ALTER TABLE `forum_replies` DISABLE KEYS */;
/*!40000 ALTER TABLE `forum_replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_topics`
--

DROP TABLE IF EXISTS `forum_topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_topics` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `category_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_pinned` tinyint(1) DEFAULT '0',
  `is_locked` tinyint(1) DEFAULT '0',
  `views_count` int DEFAULT '0',
  `replies_count` int DEFAULT '0',
  `last_reply_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category_id`,`created_at` DESC),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `forum_topics_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `forum_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_topics_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_topics`
--

LOCK TABLES `forum_topics` WRITE;
/*!40000 ALTER TABLE `forum_topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `forum_topics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_activities`
--

DROP TABLE IF EXISTS `learning_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning_activities` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activity_date` date NOT NULL,
  `lessons_completed` int DEFAULT '0',
  `quizzes_completed` int DEFAULT '0',
  `study_time` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_activity` (`user_id`,`activity_date`),
  KEY `idx_user_date` (`user_id`,`activity_date` DESC),
  CONSTRAINT `learning_activities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_activities`
--

LOCK TABLES `learning_activities` WRITE;
/*!40000 ALTER TABLE `learning_activities` DISABLE KEYS */;
INSERT INTO `learning_activities` VALUES ('06b34fc8-a7ad-11f0-860a-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','2025-10-12',2,0,0,'2025-10-13 03:50:03'),('3e41acf0-b0b4-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','2025-10-24',56,0,0,'2025-10-24 15:34:23'),('55c89202-ab2c-11f0-883e-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','2025-10-17',26,0,0,'2025-10-17 14:38:55'),('e7d64b8b-ab22-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','2025-10-17',22,0,0,'2025-10-17 13:31:25'),('eff329c2-a7ac-11f0-860a-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','2025-10-12',5,0,0,'2025-10-13 03:49:25');
/*!40000 ALTER TABLE `learning_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_progress`
--

DROP TABLE IF EXISTS `lesson_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_progress` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `watch_time` int DEFAULT '0',
  `is_completed` tinyint(1) DEFAULT '0',
  `last_position` int DEFAULT '0',
  `completed_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_progress` (`user_id`,`lesson_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_lesson` (`lesson_id`),
  KEY `idx_completed` (`user_id`,`is_completed`),
  CONSTRAINT `lesson_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lesson_progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_progress`
--

LOCK TABLES `lesson_progress` WRITE;
/*!40000 ALTER TABLE `lesson_progress` DISABLE KEYS */;
INSERT INTO `lesson_progress` VALUES ('06b1ba10-a7ad-11f0-860a-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','6696f4eb-d1d7-4e11-bc7a-18d0157068d6',0,1,0,'2025-10-17 14:35:32','2025-10-17 14:35:32'),('0a9b5a4f-a7af-11f0-860a-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','3159d76f-2197-45c7-bdbe-0625ab52a5e6',0,1,0,'2025-10-13 04:04:28','2025-10-13 04:04:28'),('0dd8ada1-a7af-11f0-860a-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','6a4bd60c-d4af-4e99-ae59-0c43681367ad',0,1,0,'2025-10-13 04:04:34','2025-10-13 04:04:34'),('31967b59-a7b1-11f0-860a-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','2053f4c4-0f26-40fa-8a75-d4585c4665ea',0,1,0,'2025-10-17 14:39:02','2025-10-17 14:39:02'),('3695bfce-b0b8-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les3-01-04',0,1,0,'2025-10-24 16:02:48','2025-10-24 16:02:48'),('386133b9-ab98-11f0-9113-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','530696be-9403-47df-accd-1d122b79d3ff',0,1,0,'2025-10-18 03:58:45','2025-10-18 03:58:45'),('3e3f75df-b0b4-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','9ae8dd55-4691-4480-bf0b-9450d5b1cf32',0,1,0,'2025-10-24 15:43:55','2025-10-24 15:43:55'),('55c71659-ab2c-11f0-883e-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','b1ec5eb1-fc63-40dd-a71e-961211288f6d',0,1,0,'2025-10-17 15:18:59','2025-10-17 15:18:59'),('59bf7d0d-b0b8-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-01-01',0,1,0,'2025-10-24 16:03:47','2025-10-24 16:03:47'),('5ab1bea0-ab2c-11f0-883e-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','4539b74e-aaa5-4ebc-8fb5-78fb57484d67',0,1,0,'2025-10-18 05:08:07','2025-10-18 05:08:07'),('77477b49-ab26-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','fc9be07b-d848-4933-bfb5-ce9698439f9c',0,1,0,'2025-10-17 13:56:54','2025-10-17 13:56:54'),('7ca14098-ab2f-11f0-883e-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','db42961e-d785-4faa-a898-49787d40147a',0,1,0,'2025-10-17 15:01:29','2025-10-17 15:01:29'),('90bfdbd7-b0b5-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','7325a78e-0378-4673-a092-710f1d7e10fa',0,1,0,'2025-10-24 15:43:56','2025-10-24 15:43:56'),('94011b71-b0b5-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','daba95f0-3871-4ffc-9915-34033c950eaa',0,1,0,'2025-10-24 15:43:56','2025-10-24 15:43:56'),('947ef13f-b0b5-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','35fc6cf1-f8b5-4c2e-87fa-9b1e45884199',0,1,0,'2025-10-24 15:43:57','2025-10-24 15:43:57'),('97403d43-b0b5-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les3-01-01',0,1,0,'2025-10-24 15:44:02','2025-10-24 15:44:02'),('97b6ab68-b0b5-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les3-01-02',0,1,0,'2025-10-24 15:44:02','2025-10-24 15:44:02'),('983f58fd-b0b5-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les3-01-03',0,1,0,'2025-10-24 15:44:03','2025-10-24 15:44:03'),('9a56e3d0-a7b5-11f0-860a-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','530696be-9403-47df-accd-1d122b79d3ff',0,1,0,'2025-10-17 17:01:03','2025-10-17 17:01:03'),('9bce003e-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-01-02',0,1,0,'2025-10-24 16:48:35','2025-10-24 16:48:35'),('9d757e84-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-01-03',0,1,0,'2025-10-24 16:48:38','2025-10-24 16:48:38'),('a0fac5c0-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-01-05',0,1,0,'2025-10-24 16:48:43','2025-10-24 16:48:43'),('a1e5fe16-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-01-06',0,1,0,'2025-10-24 16:48:45','2025-10-24 16:48:45'),('a2947d2e-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','d83dbe5f-5681-4ec7-90ae-7ad0f0ff6f12',0,1,0,'2025-10-24 16:48:46','2025-10-24 16:48:46'),('a2f2ac15-b0b5-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les3-10-03',0,1,0,'2025-10-24 15:44:21','2025-10-24 15:44:21'),('a40a49e5-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','c1c4e4db-9933-4495-8c6b-b4986e9279a3',0,1,0,'2025-10-24 16:48:49','2025-10-24 16:48:49'),('a4fcf8a1-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','4422cb76-9806-48d5-9412-3ac064f651a1',0,1,0,'2025-10-24 16:48:50','2025-10-24 16:48:50'),('a80bd7be-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-01-04',0,1,0,'2025-10-24 16:48:55','2025-10-24 16:48:55'),('ab5e5b7b-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','ce42d975-94ad-487d-b725-a1fe833aa6fc',0,1,0,'2025-10-24 16:49:01','2025-10-24 16:49:01'),('ac40831a-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','c7f434f9-d498-4740-b98f-0b31d83ce38f',0,1,0,'2025-10-24 16:49:02','2025-10-24 16:49:02'),('ad90b4a2-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','831e7639-7e57-43fa-b993-a7bd1f12e0e1',0,1,0,'2025-10-24 16:49:05','2025-10-24 16:49:05'),('ae261c2c-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','258277e0-b30a-4500-8912-8b88527fdded',0,1,0,'2025-10-24 16:49:06','2025-10-24 16:49:06'),('aeb2e0c5-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','6528cc79-bba9-4a4c-ab54-02f01b21c02c',0,1,0,'2025-10-24 16:49:06','2025-10-24 16:49:06'),('af376535-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','959997eb-2055-4590-a5da-1b644b9bc474',0,1,0,'2025-10-24 16:49:07','2025-10-24 16:49:07'),('afb134be-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','fd3ef3e0-ca86-4f6b-8a31-bfdfc68efbce',0,1,0,'2025-10-24 16:49:08','2025-10-24 16:49:08'),('b0393add-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-02-01',0,1,0,'2025-10-24 16:49:09','2025-10-24 16:49:09'),('b2396b03-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-02-02',0,1,0,'2025-10-24 16:49:12','2025-10-24 16:49:12'),('ba7c562b-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-02-03',0,1,0,'2025-10-24 16:49:26','2025-10-24 16:49:26'),('bb39a75a-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-02-04',0,1,0,'2025-10-24 16:49:27','2025-10-24 16:49:27'),('bbcf7f41-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-02-05',0,1,0,'2025-10-24 16:49:28','2025-10-24 16:49:28'),('bc4d0116-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-02-06',0,1,0,'2025-10-24 16:49:29','2025-10-24 16:49:29'),('bcbaf9f6-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','1f5866f1-05eb-470a-82cd-a1f440657c00',0,1,0,'2025-10-24 16:49:30','2025-10-24 16:49:30'),('bd36dbbd-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','27535d0c-e36c-48cb-8915-08e3ed2dd620',0,1,0,'2025-10-24 16:49:31','2025-10-24 16:49:31'),('bda036e0-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','910bedfa-677d-494d-8c13-b22b46097e95',0,1,0,'2025-10-24 16:49:32','2025-10-24 16:49:32'),('be01a1aa-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','8a1b23dc-eaf5-4a9d-a489-acbd7b18d0fb',0,1,0,'2025-10-24 16:49:32','2025-10-24 16:49:32'),('be5ee9cc-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','aa359e92-2ae7-4726-adc1-f6da0b341e03',0,1,0,'2025-10-24 16:49:33','2025-10-24 16:49:33'),('beb6b112-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-03-01',0,1,0,'2025-10-24 16:49:33','2025-10-24 16:49:33'),('bf15a725-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-03-02',0,1,0,'2025-10-24 16:49:34','2025-10-24 16:49:34'),('bfe9d3d8-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-03-03',0,1,0,'2025-10-24 16:49:35','2025-10-24 16:49:35'),('c047fc91-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-03-04',0,1,0,'2025-10-24 16:49:36','2025-10-24 16:49:36'),('c0ae09b4-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-03-05',0,1,0,'2025-10-24 16:49:37','2025-10-24 16:49:37'),('c1477440-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-03-06',0,1,0,'2025-10-24 16:49:38','2025-10-24 16:49:38'),('c19704bc-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','les2-04-01',0,1,0,'2025-10-24 16:49:38','2025-10-24 16:49:38'),('c566b641-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','125489ca-7aec-4fdb-a0d3-8fa65b80e3a6',0,1,0,'2025-10-24 16:49:45','2025-10-24 16:49:45'),('c62b3053-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','8be23bcb-36ef-4bb1-993c-3937082f4a68',0,1,0,'2025-10-24 16:49:46','2025-10-24 16:49:46'),('c7a6ccc2-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','b00d03ab-021d-4cc3-bdfe-816485ac21c7',0,1,0,'2025-10-24 16:49:48','2025-10-24 16:49:48'),('ce392f9e-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','e57c3e1d-b708-490f-a005-f1c1eef6a056',0,1,0,'2025-10-24 16:49:59','2025-10-24 16:49:59'),('cf0bd7a4-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','e4769353-02ff-4855-8ceb-5e2e00c2875c',0,1,0,'2025-10-24 16:50:01','2025-10-24 16:50:01'),('cfa5a631-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','fd20d4cd-ef54-4c8d-ae3f-947ee699241b',0,1,0,'2025-10-24 16:50:02','2025-10-24 16:50:02'),('d137d1da-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','8aed4fd8-66b7-4aab-8db6-52d57706b45f',0,1,0,'2025-10-24 16:50:04','2025-10-24 16:50:04'),('d1bf80bd-ab2b-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','df5031fc-8dcd-49cd-8a87-987b5d928ad9',0,1,0,'2025-10-17 14:35:15','2025-10-17 14:35:15'),('d2768a93-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','15e2b1b1-53c6-42de-8cd7-504e1a22b9c7',0,1,0,'2025-10-24 16:50:06','2025-10-24 16:50:06'),('d3544107-ab2b-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','64436a89-5450-40fe-8138-00059acf2382',0,1,0,'2025-10-17 14:35:16','2025-10-17 14:35:16'),('d96c9a6c-ab2b-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','539f9a06-8b4c-4e5c-88e4-52c40c7cdb5b',0,1,0,'2025-10-17 14:35:33','2025-10-17 14:35:33'),('d9ac315a-b0be-11f0-9742-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','a9d59695-1cd4-4a1a-a348-e6e424f59f23',0,1,0,'2025-10-24 16:50:19','2025-10-24 16:50:19'),('da2d44fd-ab2b-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','b1ec5eb1-fc63-40dd-a71e-961211288f6d',0,1,0,'2025-10-17 14:35:34','2025-10-17 14:35:34'),('dac7ef45-ab2b-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','2053f4c4-0f26-40fa-8a75-d4585c4665ea',0,1,0,'2025-10-17 14:35:29','2025-10-17 14:35:29'),('db3e47e0-ab2b-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','4539b74e-aaa5-4ebc-8fb5-78fb57484d67',0,1,0,'2025-10-17 14:35:30','2025-10-17 14:35:30'),('dbd1b133-ab2b-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','db42961e-d785-4faa-a898-49787d40147a',0,1,0,'2025-10-17 14:35:31','2025-10-17 14:35:31'),('de356931-ab2f-11f0-883e-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','458c78aa-e5fd-4620-af3f-abe9cffde68f',0,1,0,'2025-10-17 15:04:12','2025-10-17 15:04:12'),('e7d2d3b8-ab22-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','12a5807a-8689-4f4c-bc01-ff3833bea87a',0,1,0,'2025-10-17 13:31:25','2025-10-17 13:31:25'),('e9b867cc-ab31-11f0-883e-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','e843180e-7d4e-48d6-b11f-29f7c32e71b0',0,1,0,'2025-10-17 15:18:51','2025-10-17 15:18:51'),('ea709f3f-ab31-11f0-883e-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','ef57a6e4-eeff-44ea-af77-360ca8407bff',0,1,0,'2025-10-17 15:18:52','2025-10-17 15:18:52'),('eb119156-ab31-11f0-883e-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','680a0d27-1575-4ddb-b163-4a4e94b6b41c',0,1,0,'2025-10-17 15:18:53','2025-10-17 15:18:53'),('eb1bd997-ab22-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','d9f90b4b-1f0d-4b63-856a-1f8f5498e219',0,1,0,'2025-10-17 13:31:31','2025-10-17 13:31:31'),('ec906644-ab22-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','99cda385-7904-4b72-bb6d-2a21b467bb7a',0,1,0,'2025-10-17 13:31:33','2025-10-17 13:31:33'),('ed5b1141-ab22-11f0-883e-a036bc320b36','3d4ada88-a4f1-11f0-8481-a036bc320b36','3c304ed3-b9ca-4400-820b-369ac10a86d8',0,1,0,'2025-10-17 13:31:34','2025-10-17 13:31:34'),('eff16fe2-a7ac-11f0-860a-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','6696f4eb-d1d7-4e11-bc7a-18d0157068d6',0,1,0,'2025-10-17 15:18:58','2025-10-17 15:18:58'),('f2acd86e-a7ac-11f0-860a-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','539f9a06-8b4c-4e5c-88e4-52c40c7cdb5b',0,1,0,'2025-10-17 15:18:58','2025-10-17 15:18:58');
/*!40000 ALTER TABLE `lesson_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `chapter_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `video_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_duration` int DEFAULT NULL,
  `sort_order` int NOT NULL,
  `is_preview` tinyint(1) DEFAULT '0',
  `is_published` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chapter` (`chapter_id`,`sort_order`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES ('00cd116a-e627-443f-8fdb-05adf3c83844','7b74c851-504d-46c5-bbed-51a9fe375007','Code Review và Refactoring',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('0151798f-64ee-458f-9dd2-7f60d18ca4e6','b04a782c-5491-4e55-96bf-abebdb71aa79','Cài đặt môi trường làm việc',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,1,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('01c7fe94-64fe-4f08-aff8-8087c46668c8','2a3cf8f7-6c60-40a3-8e26-943b43f6ff62','CI/CD Pipeline',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('026bd099-0a78-4b2f-827f-e2f36e191f0d','5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e','Tối ưu và hoàn thiện',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('02934add-0580-4ccb-adf7-e415cb689130','7f3f2717-bd76-44c2-9b96-a1616b928913','Interview Skills',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('03526089-cc82-4e6c-a4d7-4b3b02cbc829','552c1786-4e74-4c37-898a-3a197dc7f662','Error Handling',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('046d3d00-442f-452b-a443-cdc56eb894d7','6b27693b-2b72-40d1-be86-8fddf5d260d1','Message Queue',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('04c319e8-d3f6-49b8-8540-4b9728bd32db','9163e4b4-aa52-4869-a6fe-5ee057d3d3e8','Testing Strategies',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('05b6b534-4403-434a-b114-200cd1a48644','3443aa98-fa3d-4e79-9ce9-63e30e9d5414','Service Discovery',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('060bef00-d831-40c9-a248-521a91b1a022','d55c98b0-8852-4dc6-8e40-37e224ba0a05','Docker fundamentals',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('063746a1-ec04-47df-8cb9-3b072f5baec3','fd40dc40-cda6-4a58-a22c-a1523da4c2af','Phân tích yêu cầu dự án',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('07a13e12-651d-4c4b-8bef-89bc064096e0','2a3cf8f7-6c60-40a3-8e26-943b43f6ff62','Monitoring và Logging',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('085802ce-677a-4cdb-b1b5-5743de7caf7c','008a6473-036a-4f99-9688-5edf50a48368','Email và Notifications',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,7,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('0a54216c-fec1-40af-b86a-98eda9356b74','008a6473-036a-4f99-9688-5edf50a48368','Tích hợp Payment Gateway',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('0c0860e5-c747-4b0b-90c6-b6c63c398644','008a6473-036a-4f99-9688-5edf50a48368','Xây dựng API Backend',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('0e929389-adce-4b0a-b5a1-95462011e9f6','9163e4b4-aa52-4869-a6fe-5ee057d3d3e8','Performance Optimization',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('0f5f24e6-f5d3-48c1-894f-108f25f9b3c9','7b74c851-504d-46c5-bbed-51a9fe375007','Security Best Practices',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('0f6e0f94-ba99-4e83-80e0-1f0f259305bb','8aa05cc3-06d6-43f2-babf-cef8a21c6818','Planning và Documentation',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('10911341-ceaf-4d34-a0ac-6dd947cf77c7','7b74c851-504d-46c5-bbed-51a9fe375007','Testing Strategies',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('10cf1040-95bc-4dbb-b502-1340ef8e5037','757c5041-08bc-448a-a770-0b8bd7fd7ff6','AWS/Azure/GCP overview',NULL,'https://www.youtube.com/watch?v=3hLmDS179YE',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('10f14eed-a7f4-403c-baba-b638e655aeda','e88f62a2-4e5d-45ab-9a3d-84b0dac88876','Resume và Portfolio',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('12210965-aaaf-4739-be35-38071e6d2a8a','2a3cf8f7-6c60-40a3-8e26-943b43f6ff62','Docker fundamentals',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('125489ca-7aec-4fdb-a0d3-8fa65b80e3a6','161ab352-776b-4fb1-830d-1d00cf4ccde1','Tổng quan dự án e-commerce',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('126a0bd5-946e-4dd1-8883-cd9e18184587','f48cf941-063c-4b20-b1d8-40aa08234942','Admin Dashboard',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('12a5807a-8689-4f4c-bc01-ff3833bea87a','54e63972-81ef-4232-b218-9495af172951','Performance Optimization',NULL,'https://www.youtube.com/watch?v=B4PSP-xF3dQ',600,1,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('12b3e872-9f58-4801-9d9f-1e8d05e8d1a2','a502fa48-a069-433a-b6ba-a0b0f7893831','Email và Notifications',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,7,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('15e2b1b1-53c6-42de-8cd7-504e1a22b9c7','161ab352-776b-4fb1-830d-1d00cf4ccde1','Deploy và CI/CD',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,8,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('16c48422-e379-48ec-a771-60ea02ffa3fd','757c5041-08bc-448a-a770-0b8bd7fd7ff6','Docker fundamentals',NULL,'https://www.youtube.com/watch?v=fqMOX6JJhGo',600,1,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('19d8d435-922c-4a52-9818-3ba6dff9fb8b','69eba7b4-7b51-4704-bc5a-4b090f63d00d','Interview Skills',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('1b2400ff-383e-4bac-8918-de7ae1390352','cffde1b1-e3ac-46a7-8b7b-f953841588c3','Tài liệu và nguồn học tập',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('1cf90a67-7e51-4e0c-8ab0-9cf839cf8c97','b1658481-fcdf-4a72-871f-27489c6460d9','Quiz tổng hợp',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('1d8305ae-4331-406f-8ea6-1fbbcf0649ae','6cffc324-663e-4c5c-8e9c-642a0d4065be','Freelancing và Side Projects',NULL,'https://www.youtube.com/watch?v=SuGzzZywzB0',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('1e675b0f-1c5a-4a29-9df6-1b09f58eb0fe','582537a1-42c0-469c-b0ff-5bda6bba35f8','Giới thiệu Microservices',NULL,'https://www.youtube.com/watch?v=zOjov-2OZ0E',600,1,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('1f32b0a5-cbe0-48d9-950b-93ac5f05fb67','4331821a-5296-485d-91e4-a7f2b5dd8e6f','Interview Skills',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('1f5866f1-05eb-470a-82cd-a1f440657c00','b76f42a9-f5d8-4b64-b96e-c0ade97f0e44','Functions và Methods',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('1fd53c87-c270-451e-8de1-3f7f17b27d59','f117a365-6dc2-4787-b255-0ae9e4ffe00f','Design Patterns',NULL,'https://www.youtube.com/watch?v=tv-_1er1mWI',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('2053f4c4-0f26-40fa-8a75-d4585c4665ea','fb0abe9f-e89d-4de4-89b6-2183c4162730','Cách học hiệu quả nhất',NULL,'https://www.youtube.com/watch?v=EC33hbdVG-Q',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('207d7dd2-c8ce-47e2-aef6-608aeffe75de','3443aa98-fa3d-4e79-9ce9-63e30e9d5414','Message Queue',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('216f6dde-8895-4cc7-9d44-44aab4083091','b1658481-fcdf-4a72-871f-27489c6460d9','Security Best Practices',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('223965be-9055-476e-a559-eaa591086d96','e88f62a2-4e5d-45ab-9a3d-84b0dac88876','Networking và Personal Branding',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('2259537c-d54e-43f5-9788-c788eddb984b','98165aa9-8806-49dd-ab80-3f56766bc299','Code Review và Refactoring',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('22a2e2d7-9aee-4b17-adc8-23e3b9e7601a','582537a1-42c0-469c-b0ff-5bda6bba35f8','Service Discovery',NULL,'https://www.youtube.com/watch?v=GboiMJm6WlA',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('2435fd34-64ef-4879-aeb6-655275023856','98e74469-b6b0-4a13-8713-67171f9bcb57','Chọn ý tưởng dự án',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('25145da3-6731-4757-9333-d70d9b43074a','b1658481-fcdf-4a72-871f-27489c6460d9','Testing Strategies',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('2574f497-e9a5-421a-ae28-72798ecd8c7c','9163e4b4-aa52-4869-a6fe-5ee057d3d3e8','Code Review và Refactoring',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('258277e0-b30a-4500-8912-8b88527fdded','cf4b90bb-4624-41de-8e3f-357a9552c980','Biến và kiểu dữ liệu',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('27535d0c-e36c-48cb-8915-08e3ed2dd620','b76f42a9-f5d8-4b64-b96e-c0ade97f0e44','Object-Oriented Programming',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('27fba794-78ba-4e30-a72e-59fc02ca6aaf','15ab01f4-2a50-4e7a-8829-ffe4429f5cba','Monitoring và Logging',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('283ba627-63b9-42b0-84e5-b8e900222284','d1e2940e-c499-48b1-94ea-fdd6199de7b2','Admin Dashboard',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('290ef5a4-cd7f-4d85-8a4f-bb6750cfcca3','15ab01f4-2a50-4e7a-8829-ffe4429f5cba','Kubernetes basics',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('29da0711-f761-437f-be43-e736f8fb7f9e','b04a782c-5491-4e55-96bf-abebdb71aa79','Cách học hiệu quả nhất',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('2b053069-2fe6-40d2-90d1-640d63135f8b','552c1786-4e74-4c37-898a-3a197dc7f662','Asynchronous Programming',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('2b348f65-1e7e-4fbf-ba5c-c9cf68dab88f','76d7395f-b884-4216-97a2-5de3e2ac4a3c','Implementation Phase 1',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('2bc68aa4-3370-4d0f-b873-cc6554df6807','fd40dc40-cda6-4a58-a22c-a1523da4c2af','Deploy lên production',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,8,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('2ca52e4e-255a-4a1f-a929-3601706008b1','c6e36667-6731-4e49-a8e3-5262615d850a','Planning và Documentation',NULL,'https://www.youtube.com/watch?v=fgTGADljAeg',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('2cb2bb30-316d-4b51-97ea-fc3a664b6298','7f3f2717-bd76-44c2-9b96-a1616b928913','Networking và Personal Branding',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('2d138ac3-892c-468a-97ad-44251581c29a','69eba7b4-7b51-4704-bc5a-4b090f63d00d','Freelancing và Side Projects',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('2e4741e7-0ac2-49f7-a5bf-fbc32294138b','008a6473-036a-4f99-9688-5edf50a48368','Shopping Cart và Checkout',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('2eea5ffd-19a8-4097-beeb-1b217c1b382b','4331821a-5296-485d-91e4-a7f2b5dd8e6f','Coding Interview Prep',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('2f80d905-c41d-4194-a0b4-5897f9538af7','5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e','Deploy lên production',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,8,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('3021b85c-405d-4f5c-b20f-b6d8839c4f4a','3443aa98-fa3d-4e79-9ce9-63e30e9d5414','Service Communication',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('3159d76f-2197-45c7-bdbe-0625ab52a5e6','a502fa48-a069-433a-b6ba-a0b0f7893831','Tổng quan dự án e-commerce','- Xin chào\n    - Danh sách 2\n\n1. Số 1\n2. Số 2\n','https://www.youtube.com/watch?v=lkIFF4maKMU',600,1,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('31ee0832-41aa-4926-a0a6-6c106edce2da','2584b48e-6ea7-4a84-8362-1f69f037cdf2','Cú pháp và quy tắc',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('3217d193-c7f4-4e7d-a09f-ff67437638eb','2584b48e-6ea7-4a84-8362-1f69f037cdf2','Toán tử và biểu thức',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('35fc6cf1-f8b5-4c2e-87fa-9b1e45884199','486e88e6-e5ae-486e-be55-94ed3f943bfc','Cách học hiệu quả nhất',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('373dba85-b319-4f82-801a-0d0c3788186e','bda7c7bb-6881-40fd-98c3-83f7725d2251','API Gateway',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('3794da73-bb67-4659-b731-29e179499179','1821b63c-0cf6-4ef0-9a15-7c09413a7f0e','Implementation Phase 2',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('38ea4215-faa8-4347-9904-8a756075e7ad','c2e518dc-f77b-41d7-a9bc-f6a1f33db331','Testing và Debugging',NULL,'https://www.youtube.com/watch?v=r9HdHUE0COE',600,7,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('3c304ed3-b9ca-4400-820b-369ac10a86d8','c2e518dc-f77b-41d7-a9bc-f6a1f33db331','Thiết kế giao diện',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('3cf7e6e4-676d-492f-82d3-d449cbe45c98','7cadc65f-69c0-41d4-88e5-e4dc940e8664','Design Patterns',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('3d506ea2-ccc9-4efa-adc7-1e96fc5ca822','6b27693b-2b72-40d1-be86-8fddf5d260d1','Service Communication',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('3ea0d1fc-a71e-41a4-97c0-36cbb844dffd','6cffc324-663e-4c5c-8e9c-642a0d4065be','Networking và Personal Branding',NULL,'https://www.youtube.com/watch?v=EihTZzb3yXE',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('3f19561b-1247-4f30-a0ce-e833a524c173','2584b48e-6ea7-4a84-8362-1f69f037cdf2','Các khái niệm cơ bản',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('3f8d4dc9-c672-4be0-9797-66d4e2923753','b04a782c-5491-4e55-96bf-abebdb71aa79','Chào mừng bạn đến với khóa học',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,1,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('3fbaa179-9b44-4838-9e5d-214c1d5678d7','69eba7b4-7b51-4704-bc5a-4b090f63d00d','Networking và Personal Branding',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('41bf3c3a-48db-40ae-9cd9-527868e986b3','1c2a5e2a-398d-4f24-b1fb-eaec3e564ad1','Asynchronous Programming',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('4253aa8b-0fe9-4e34-ab63-aa00121dac4d','b1658481-fcdf-4a72-871f-27489c6460d9','Code Review và Refactoring',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('4257cee4-0220-4de2-a4ac-c79bc616fca4','e88f62a2-4e5d-45ab-9a3d-84b0dac88876','Interview Skills',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('436044c1-ba89-472b-bf1a-2a7d42ec57ab','6cffc324-663e-4c5c-8e9c-642a0d4065be','Coding Interview Prep',NULL,'https://www.youtube.com/watch?v=1qw5ITr3k9E',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('43684397-1938-48e7-95d8-acbc5725bb77','fd40dc40-cda6-4a58-a22c-a1523da4c2af','Tối ưu và hoàn thiện',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('4422cb76-9806-48d5-9412-3ac064f651a1','feb7314f-cc94-428e-8cf9-097314ca5049','Tài liệu và nguồn học tập',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('446d7772-49ca-41db-8ba2-82d57e42695c','1c2a5e2a-398d-4f24-b1fb-eaec3e564ad1','Design Patterns',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('44bb61cb-7042-49b4-b0c6-72a96f95dbdf','ce20ab2d-638d-4a11-a4ea-2ff8a9fe7858','Service Communication',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('4539b74e-aaa5-4ebc-8fb5-78fb57484d67','f3d94b5a-2690-46a2-a5b4-d96b7c27c844','Các khái niệm cơ bản','# Bài học 1, các khái niệm cơ bản\n# 12312313123123\n# Bài học 1, các khái niệm cơ bản\n# 12312313123123\n\n![image](https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg)','/videos/4539b74e-aaa5-4ebc-8fb5-78fb57484d67-1760736884878.mp4',NULL,1,0,1,'2025-10-13 03:41:26','2025-10-21 21:16:46'),('458c78aa-e5fd-4620-af3f-abe9cffde68f','f3d94b5a-2690-46a2-a5b4-d96b7c27c844','Biến và kiểu dữ liệu',NULL,'https://www.youtube.com/watch?v=JNMy969SjyU',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('478a30a2-fdeb-449d-b5de-baa8d4bd8a76','1821b63c-0cf6-4ef0-9a15-7c09413a7f0e','Chọn ý tưởng dự án',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('47ac98b6-1c06-4f2b-8cce-7995d1cc37a6','1c2a5e2a-398d-4f24-b1fb-eaec3e564ad1','Object-Oriented Programming',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('4dffb4b8-e2bc-4406-88b3-c33dde686658','54e63972-81ef-4232-b218-9495af172951','Caching Strategies',NULL,'https://www.youtube.com/watch?v=U3RkDLtS7uY',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('4efe90db-c20e-4900-bfc1-09fd908e8164','e73bcafa-d309-49ca-9281-8522a3f3a22d','Biến và kiểu dữ liệu',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('4f3f23bd-1c2e-4a78-a96b-20f86d054872','542e68d8-939e-4071-a25c-59bf70fac24e','Thiết kế database',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('4f8055b1-fea6-4206-8fce-eb171fba931b','cffde1b1-e3ac-46a7-8b7b-f953841588c3','Cài đặt môi trường làm việc',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,1,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('4f824995-eedf-43d0-8dbd-4076fcdd1b30','6b27693b-2b72-40d1-be86-8fddf5d260d1','Distributed Tracing',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('4febd2e0-36a4-44f4-b08f-875f78587886','582537a1-42c0-469c-b0ff-5bda6bba35f8','Distributed Tracing',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,6,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('514cfb95-98a7-4ec4-9108-971993ea68eb','b04a782c-5491-4e55-96bf-abebdb71aa79','Tài liệu và nguồn học tập',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('51ccdcd4-0263-4ebf-bae0-f8835a292cf5','2a3cf8f7-6c60-40a3-8e26-943b43f6ff62','Infrastructure as Code',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('522b3a7c-37ae-426a-bf3a-286d41e7eee4','ce20ab2d-638d-4a11-a4ea-2ff8a9fe7858','Giới thiệu Microservices',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('5235a894-d96a-4717-9419-62656b7f85cd','c2e518dc-f77b-41d7-a9bc-f6a1f33db331','Deploy lên production',NULL,'https://www.youtube.com/watch?v=oykl1Ih9pMg',600,8,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('5254e9c2-4541-47a5-bc62-acc439ebff59','8aa05cc3-06d6-43f2-babf-cef8a21c6818','Chọn ý tưởng dự án',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('52f3fa11-f8be-48db-a7d6-45fac872388f','98165aa9-8806-49dd-ab80-3f56766bc299','Security Best Practices',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('530696be-9403-47df-accd-1d122b79d3ff','f117a365-6dc2-4787-b255-0ae9e4ffe00f','Functions và Methods',NULL,'https://res.cloudinary.com/dhztqlkxo/video/upload/v1760734546/dhvlearnx/videos/530696be-9403-47df-accd-1d122b79d3ff-1760734542919.mp4',3,1,0,1,'2025-10-13 03:41:26','2025-10-18 03:55:46'),('539f9a06-8b4c-4e5c-88e4-52c40c7cdb5b','fb0abe9f-e89d-4de4-89b6-2183c4162730','Cài đặt môi trường làm việc',NULL,'https://www.youtube.com/watch?v=gqOEOvLI6wo',600,2,1,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('54067ae4-8640-475c-b2ec-dae2eb4ce108','8aa05cc3-06d6-43f2-babf-cef8a21c6818','Implementation Phase 2',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('56eaa7ae-3341-4ad1-84a4-50a7e281b7ce','98165aa9-8806-49dd-ab80-3f56766bc299','Caching Strategies',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('57254da5-5425-46a7-80ef-30f6083fcee5','b1658481-fcdf-4a72-871f-27489c6460d9','Performance Optimization',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('59e036cb-f139-40be-9ed4-222e366caa86','008a6473-036a-4f99-9688-5edf50a48368','Tổng quan dự án e-commerce',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('5a8196af-e34b-487b-8c99-d33daa8b802e','d1e2940e-c499-48b1-94ea-fdd6199de7b2','Xây dựng API Backend',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('5ac79956-f5fd-4b89-b1a8-17ae3757407d','6b27693b-2b72-40d1-be86-8fddf5d260d1','Giới thiệu Microservices',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('5b7828d8-9ec4-45ea-97c5-590a389b6fa7','a502fa48-a069-433a-b6ba-a0b0f7893831','Shopping Cart và Checkout',NULL,'https://www.youtube.com/watch?v=Y-jzdXllf1E',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('5c0f161c-489b-412d-b97d-1a874fe17fe8','15ab01f4-2a50-4e7a-8829-ffe4429f5cba','Infrastructure as Code',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('5d1b4e8e-dc49-445f-8cb0-f5dc05f872b9','5142c12e-1d25-4c22-85b0-d0e5435ca235','Infrastructure as Code',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('5d87a5e5-85bc-4e4b-a97f-067d86fb6cf4','98e74469-b6b0-4a13-8713-67171f9bcb57','Testing và Bug Fixes',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('5eb953f2-fede-44f1-9407-cd07f1c68770','582537a1-42c0-469c-b0ff-5bda6bba35f8','API Gateway',NULL,'https://www.youtube.com/watch?v=1vjOv_f9L8I',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('5ebdea1f-0931-4215-ac87-fbe19e9953f3','69eba7b4-7b51-4704-bc5a-4b090f63d00d','Coding Interview Prep',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('5faa307c-969a-4678-bdb7-11c5c6005d1b','542e68d8-939e-4071-a25c-59bf70fac24e','Thiết kế giao diện',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('5fc2a44d-60cd-4c3a-8574-f6888a1bcb84','4331821a-5296-485d-91e4-a7f2b5dd8e6f','Freelancing và Side Projects',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('5fcd8a55-e46b-4faf-825f-7b3f89596f98','a502fa48-a069-433a-b6ba-a0b0f7893831','Admin Dashboard',NULL,'https://www.youtube.com/watch?v=jCY6DH8F4oc',600,6,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('607477d9-9e95-4d82-b8a4-566f750d00f0','76d7395f-b884-4216-97a2-5de3e2ac4a3c','Planning và Documentation',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('6077ec28-0918-4b48-bcbd-0572ce0d99e5','aef1160f-824e-4d89-9ffa-bd75ab63bcac','Toán tử và biểu thức',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('6122928d-17f0-4821-87aa-f54603f41ffa','aef1160f-824e-4d89-9ffa-bd75ab63bcac','Bài tập thực hành',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('61f94465-1148-4daf-a825-861bdd6e0f99','5142c12e-1d25-4c22-85b0-d0e5435ca235','AWS/Azure/GCP overview',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('62fceafd-99ac-4112-9d9b-0cb22f44b046','76d7395f-b884-4216-97a2-5de3e2ac4a3c','Chọn ý tưởng dự án',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('64436a89-5450-40fe-8138-00059acf2382','c2e518dc-f77b-41d7-a9bc-f6a1f33db331','Tối ưu và hoàn thiện',NULL,'https://www.youtube.com/watch?v=B4PSP-xF3dQ',600,6,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('6528cc79-bba9-4a4c-ab54-02f01b21c02c','cf4b90bb-4624-41de-8e3f-357a9552c980','Toán tử và biểu thức',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('6595c0d9-610a-464e-ad66-a3f4e6278aa7','582537a1-42c0-469c-b0ff-5bda6bba35f8','Service Communication',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('65c792bb-52e6-42fd-8a70-b062c3916b85','7b74c851-504d-46c5-bbed-51a9fe375007','Performance Optimization',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('6636ca56-0666-4127-92c3-f3d0cff22e73','f48cf941-063c-4b20-b1d8-40aa08234942','Email và Notifications',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,7,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('6696f4eb-d1d7-4e11-bc7a-18d0157068d6','fb0abe9f-e89d-4de4-89b6-2183c4162730','Chào mừng bạn đến với khóa học',NULL,'https://www.youtube.com/watch?v=zOjov-2OZ0E',600,1,1,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('680a0d27-1575-4ddb-b163-4a4e94b6b41c','f3d94b5a-2690-46a2-a5b4-d96b7c27c844','Best Practices cơ bản',NULL,'https://www.youtube.com/watch?v=HZJxjlvBbVw',600,6,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('694a1118-1cd4-4496-b98e-69d9a98f6cf0','aef1160f-824e-4d89-9ffa-bd75ab63bcac','Cú pháp và quy tắc',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('698fc493-9dc4-406e-8fc7-05f7bcb231e6','4331821a-5296-485d-91e4-a7f2b5dd8e6f','Networking và Personal Branding',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('6a4bd60c-d4af-4e99-ae59-0c43681367ad','a502fa48-a069-433a-b6ba-a0b0f7893831','Xây dựng API Backend',NULL,'https://www.youtube.com/watch?v=GK4Pl-GmPHk',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('6bfe8308-76f3-45ec-8b5e-fbf22da432da','cffde1b1-e3ac-46a7-8b7b-f953841588c3','Chào mừng bạn đến với khóa học',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,1,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('6d467743-cb9f-42a6-872e-62d8608a6f58','cffde1b1-e3ac-46a7-8b7b-f953841588c3','Cách học hiệu quả nhất',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('6d51e5ca-fb6e-43f8-b69d-86d2e92087a7','fa57c3f5-cc57-4b1a-88e5-01314758a3c9','Deploy lên production',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,8,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('6ea25cef-36a0-46c0-953e-e4b128f0bae9','f48cf941-063c-4b20-b1d8-40aa08234942','Setup project và dependencies',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('6f4f4096-6870-41b3-9e3f-2105d0f63db6','d55c98b0-8852-4dc6-8e40-37e224ba0a05','Infrastructure as Code',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('6ff57f63-06c2-4d92-91d6-b62ed3ad6990','d1e2940e-c499-48b1-94ea-fdd6199de7b2','Email và Notifications',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,7,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('70f4eff3-90e4-4d2c-b199-4fd7f67eaebf','5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e','Thiết kế giao diện',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('72ba39b5-dcd2-446c-adaf-eda385935df8','ce20ab2d-638d-4a11-a4ea-2ff8a9fe7858','API Gateway',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('7325a78e-0378-4673-a092-710f1d7e10fa','486e88e6-e5ae-486e-be55-94ed3f943bfc','Cài đặt môi trường làm việc',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,1,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('736d6f5d-b376-4169-8e01-81b373cfd226','9163e4b4-aa52-4869-a6fe-5ee057d3d3e8','Quiz tổng hợp',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('740f88a1-9407-4aa0-aa6f-d904f679b273','fa57c3f5-cc57-4b1a-88e5-01314758a3c9','Phân tích yêu cầu dự án',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('74563062-925e-43f4-a155-f6374a1fea8c','7f3f2717-bd76-44c2-9b96-a1616b928913','Resume và Portfolio',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('74595333-f5e0-4e7f-9906-2454cebe0520','fa57c3f5-cc57-4b1a-88e5-01314758a3c9','Thiết kế giao diện',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('76f718d2-6bdf-4684-b8d9-dd86356d3e6e','1821b63c-0cf6-4ef0-9a15-7c09413a7f0e','Planning và Documentation',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('7c3a3a53-4f64-45a9-8cf8-47614463a4c4','c6e36667-6731-4e49-a8e3-5262615d850a','Testing và Bug Fixes',NULL,'https://www.youtube.com/watch?v=r9HdHUE0COE',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('7c7c37e3-359a-4262-ab6c-f40fc2597d83','fa57c3f5-cc57-4b1a-88e5-01314758a3c9','Testing và Debugging',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,7,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('7d5044d1-2c28-44a0-920d-c526760810bf','d1e2940e-c499-48b1-94ea-fdd6199de7b2','Tích hợp Payment Gateway',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('7d67a394-ba8b-481c-9882-12171287c066','8aa05cc3-06d6-43f2-babf-cef8a21c6818','Deployment và Presentation',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('7f989b7a-44a7-4dbd-b1c1-27206b339f06','98e74469-b6b0-4a13-8713-67171f9bcb57','Implementation Phase 2',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('7fc85171-c706-4eac-a5ff-3986db372f70','008a6473-036a-4f99-9688-5edf50a48368','Admin Dashboard',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('802362d8-ed64-451a-adee-2c71e0781b64','fa57c3f5-cc57-4b1a-88e5-01314758a3c9','Xây dựng tính năng Authentication',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('80e75606-c7cc-44c3-8f1a-988c174c6b0b','5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e','Phân tích yêu cầu dự án',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('80eacf4e-3f4f-405c-9fc2-e1d7b98d28f8','542e68d8-939e-4071-a25c-59bf70fac24e','Deploy lên production',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,8,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('821bf4f9-3b32-43d0-a010-d9d535b03b55','fd40dc40-cda6-4a58-a22c-a1523da4c2af','Thiết kế giao diện',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('82602a10-695b-49df-9011-0af2e863e411','fd40dc40-cda6-4a58-a22c-a1523da4c2af','Xây dựng tính năng Authentication',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('82d1d554-c1c7-432d-ac2c-420237d65447','ce20ab2d-638d-4a11-a4ea-2ff8a9fe7858','Distributed Tracing',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('82dfd0ca-7a69-453f-aef6-0e9c4237d6b9','a502fa48-a069-433a-b6ba-a0b0f7893831','Setup project và dependencies',NULL,'https://www.youtube.com/watch?v=gqOEOvLI6wo',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('830855fa-0448-48d4-bf96-d0bc6acc12ed','6b27693b-2b72-40d1-be86-8fddf5d260d1','API Gateway',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('831e7639-7e57-43fa-b993-a7bd1f12e0e1','cf4b90bb-4624-41de-8e3f-357a9552c980','Cú pháp và quy tắc',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('8438750b-5860-496b-9af0-cbfa66535505','7f3f2717-bd76-44c2-9b96-a1616b928913','Coding Interview Prep',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('84863453-f924-42f0-9ef0-ad63769996d2','5142c12e-1d25-4c22-85b0-d0e5435ca235','Docker fundamentals',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('85484d17-53b2-4beb-add4-d819073ec6b0','bda7c7bb-6881-40fd-98c3-83f7725d2251','Service Discovery',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('85b5ef19-6a6a-4060-9f73-2624baf4d265','5142c12e-1d25-4c22-85b0-d0e5435ca235','Kubernetes basics',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('872ad4b6-f43e-462b-b9ad-018e9357a6e1','2584b48e-6ea7-4a84-8362-1f69f037cdf2','Best Practices cơ bản',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('872fdc08-2afe-4ad4-92d0-a9aade6723b0','e73bcafa-d309-49ca-9281-8522a3f3a22d','Toán tử và biểu thức',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('87439517-ac32-4cd9-b500-2c0152529299','bda7c7bb-6881-40fd-98c3-83f7725d2251','Distributed Tracing',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('8a1b23dc-eaf5-4a9d-a489-acbd7b18d0fb','b76f42a9-f5d8-4b64-b96e-c0ade97f0e44','Asynchronous Programming',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('8ac9efac-53e7-4034-b6ba-da256f56c620','f48cf941-063c-4b20-b1d8-40aa08234942','Tổng quan dự án e-commerce',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('8aed4fd8-66b7-4aab-8db6-52d57706b45f','161ab352-776b-4fb1-830d-1d00cf4ccde1','Email và Notifications',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,7,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('8bc5917d-2788-4b9f-b2ab-b2e6e8fb38fa','2a3cf8f7-6c60-40a3-8e26-943b43f6ff62','Kubernetes basics',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('8be23bcb-36ef-4bb1-993c-3937082f4a68','161ab352-776b-4fb1-830d-1d00cf4ccde1','Setup project và dependencies',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('8e444e01-d15b-406d-8e2a-378329401ab4','fd40dc40-cda6-4a58-a22c-a1523da4c2af','Xây dựng tính năng chính',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('8fa75b2c-59a0-4fa6-ae57-2f31fed7f1e7','d1e2940e-c499-48b1-94ea-fdd6199de7b2','Tổng quan dự án e-commerce',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('910bedfa-677d-494d-8c13-b22b46097e95','b76f42a9-f5d8-4b64-b96e-c0ade97f0e44','Error Handling',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('92c002a2-8df5-4396-9f90-eb51d957c1bd','fa57c3f5-cc57-4b1a-88e5-01314758a3c9','Xây dựng tính năng chính',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('93c51d53-012b-4730-8483-58da54ffa3fb','1821b63c-0cf6-4ef0-9a15-7c09413a7f0e','Testing và Bug Fixes',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('9486b43c-b5f7-43bd-8293-e6242d2c1c57','3443aa98-fa3d-4e79-9ce9-63e30e9d5414','Giới thiệu Microservices',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('9530c04e-bf46-4c6f-a0d1-c897f997466a','e88f62a2-4e5d-45ab-9a3d-84b0dac88876','Freelancing và Side Projects',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('959997eb-2055-4590-a5da-1b644b9bc474','cf4b90bb-4624-41de-8e3f-357a9552c980','Bài tập thực hành',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('95af3ca9-aeb6-4f8a-8bca-d3b046c9b2ae','1821b63c-0cf6-4ef0-9a15-7c09413a7f0e','Deployment và Presentation',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('95b7af15-b69a-4a7f-9e66-b7633bd9394f','5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e','Xây dựng tính năng Authentication',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('99a93b45-ba25-44fa-b20c-2f3d8c18f1ef','d1e2940e-c499-48b1-94ea-fdd6199de7b2','Setup project và dependencies',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('99cda385-7904-4b72-bb6d-2a21b467bb7a','c2e518dc-f77b-41d7-a9bc-f6a1f33db331','Thiết kế database',NULL,'https://www.youtube.com/watch?v=HXV3zeQKqGY',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('9a39119f-689e-4107-af28-c2601bda8863','98165aa9-8806-49dd-ab80-3f56766bc299','Performance Optimization',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('9a42a900-7ee0-4a09-bda6-4658bcc1d50a','7b74c851-504d-46c5-bbed-51a9fe375007','Quiz tổng hợp',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('9ab752bf-edcc-4c9f-ae9a-d3092f847974','fa57c3f5-cc57-4b1a-88e5-01314758a3c9','Tối ưu và hoàn thiện',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('9ae8dd55-4691-4480-bf0b-9450d5b1cf32','486e88e6-e5ae-486e-be55-94ed3f943bfc','Chào mừng bạn đến với khóa học',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,1,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('9b3477c3-ecc2-48a3-8238-9c1f05919cd7','c6e36667-6731-4e49-a8e3-5262615d850a','Deployment và Presentation',NULL,'https://www.youtube.com/watch?v=oykl1Ih9pMg',600,6,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('9cb80410-0e30-4c68-82e9-0d4a9be0339f','c6e36667-6731-4e49-a8e3-5262615d850a','Implementation Phase 1',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('9d52563f-bba5-45d4-bedb-ebc0183329e2','9163e4b4-aa52-4869-a6fe-5ee057d3d3e8','Caching Strategies',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a00e8687-cac4-4ae5-8e56-b4191299a38a','6cffc324-663e-4c5c-8e9c-642a0d4065be','Resume và Portfolio',NULL,'https://www.youtube.com/watch?v=Tt08KmFfIYQ',600,1,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('a120a796-8c25-4d9d-8ecb-704c4e1b8628','76d7395f-b884-4216-97a2-5de3e2ac4a3c','Testing và Bug Fixes',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a16b2776-053c-4675-b274-31b9332eb2ce','542e68d8-939e-4071-a25c-59bf70fac24e','Tối ưu và hoàn thiện',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a2877bce-de0f-4cac-b9a2-b4500480a68b','fa57c3f5-cc57-4b1a-88e5-01314758a3c9','Thiết kế database',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a2d1ea26-3064-4492-b2b8-170046b08e82','15ab01f4-2a50-4e7a-8829-ffe4429f5cba','Docker fundamentals',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a31d5f25-1672-447d-b5b1-d0b9c719123b','54e63972-81ef-4232-b218-9495af172951','Quiz tổng hợp',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,6,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('a44d15eb-4ce5-430f-acdf-e54711a552ba','aef1160f-824e-4d89-9ffa-bd75ab63bcac','Các khái niệm cơ bản',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a52b56d9-4f2a-4d49-aac8-5774786c9878','8aa05cc3-06d6-43f2-babf-cef8a21c6818','Testing và Bug Fixes',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('a5fb6b44-f73f-41de-b0ea-ba04df480b61','3443aa98-fa3d-4e79-9ce9-63e30e9d5414','API Gateway',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a608541b-ea8f-42df-b97e-fafe199a20bf','f48cf941-063c-4b20-b1d8-40aa08234942','Deploy và CI/CD',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,8,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('a6949944-c22c-4033-988a-d15ec22ecef2','3443aa98-fa3d-4e79-9ce9-63e30e9d5414','Distributed Tracing',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a700778d-b38a-4c3d-a711-e7f35a153759','c6e36667-6731-4e49-a8e3-5262615d850a','Chọn ý tưởng dự án',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,1,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('a7811cc3-aa29-4879-8966-fdc65629f09c','ce20ab2d-638d-4a11-a4ea-2ff8a9fe7858','Message Queue',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a812f731-8bb5-4e40-9107-2872086a88ca','542e68d8-939e-4071-a25c-59bf70fac24e','Xây dựng tính năng chính',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('a9803297-ac91-4542-a8ee-75cac32b5540','d55c98b0-8852-4dc6-8e40-37e224ba0a05','Monitoring và Logging',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('a9d59695-1cd4-4a1a-a348-e6e424f59f23','bda7c7bb-6881-40fd-98c3-83f7725d2251','Giới thiệu Microservices',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('aa359e92-2ae7-4726-adc1-f6da0b341e03','b76f42a9-f5d8-4b64-b96e-c0ade97f0e44','Design Patterns',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:36'),('ab964583-b6af-4808-a599-0a538203233f','ce20ab2d-638d-4a11-a4ea-2ff8a9fe7858','Service Discovery',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('ac8a8f2b-ae17-49be-a4f5-8cf984cbdb7a','7cadc65f-69c0-41d4-88e5-e4dc940e8664','Functions và Methods',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('ad5ac736-6d4f-4a0d-bc1a-79dc9373636e','6b27693b-2b72-40d1-be86-8fddf5d260d1','Service Discovery',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('ad9061a3-14eb-4c63-8761-47241936089f','b1658481-fcdf-4a72-871f-27489c6460d9','Caching Strategies',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('adb1bbd7-0af2-44b7-a700-6ee80d5e74b8','76d7395f-b884-4216-97a2-5de3e2ac4a3c','Deployment và Presentation',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('ae73256a-b684-42cd-9156-8de1e39471c0','69eba7b4-7b51-4704-bc5a-4b090f63d00d','Resume và Portfolio',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('aeec3723-0472-4611-9768-4e7d16398476','e73bcafa-d309-49ca-9281-8522a3f3a22d','Các khái niệm cơ bản',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('af43c5e0-77af-423c-8187-1bb670120743','5142c12e-1d25-4c22-85b0-d0e5435ca235','Monitoring và Logging',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('b00d03ab-021d-4cc3-bdfe-816485ac21c7','161ab352-776b-4fb1-830d-1d00cf4ccde1','Xây dựng API Backend',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('b04c00d9-c055-4fb5-8b40-3889446d92ce','7cadc65f-69c0-41d4-88e5-e4dc940e8664','Asynchronous Programming',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('b0e15c4a-8849-4c7d-a04c-2b4fae5e1382','4331821a-5296-485d-91e4-a7f2b5dd8e6f','Resume và Portfolio',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('b1ec5eb1-fc63-40dd-a71e-961211288f6d','fb0abe9f-e89d-4de4-89b6-2183c4162730','Tài liệu và nguồn học tập',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('b49de0c6-4507-4a0f-8cd9-9e97e3987677','54e63972-81ef-4232-b218-9495af172951','Testing Strategies',NULL,'https://www.youtube.com/watch?v=r9HdHUE0COE',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('b6f82e8c-ab92-4b0a-9d63-54c8cce879f4','6cffc324-663e-4c5c-8e9c-642a0d4065be','Interview Skills',NULL,'https://www.youtube.com/watch?v=1qw5ITr3k9E',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('b9930e20-d4a9-4b57-9a06-b3e9119fddf1','15ab01f4-2a50-4e7a-8829-ffe4429f5cba','CI/CD Pipeline',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('bcb6033e-c5b4-4998-838a-55cb2280eda2','54e63972-81ef-4232-b218-9495af172951','Code Review và Refactoring',NULL,'https://www.youtube.com/watch?v=XDOaLUq_hL0',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('be868ef6-52e9-495d-8787-5fd5de10e9bf','5142c12e-1d25-4c22-85b0-d0e5435ca235','CI/CD Pipeline',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('beb95c75-3c25-4764-beb2-5ae461fd5ba4','d1e2940e-c499-48b1-94ea-fdd6199de7b2','Deploy và CI/CD',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,8,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('bedf55d8-5595-4046-aad2-c5ec30322cc7','5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e','Thiết kế database',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('bf461e75-79c7-473b-8783-d28c622179fc','1821b63c-0cf6-4ef0-9a15-7c09413a7f0e','Implementation Phase 1',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('bf6557f3-4481-4854-bdce-a028fc3db9a7','542e68d8-939e-4071-a25c-59bf70fac24e','Testing và Debugging',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,7,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('c0795c6d-6caa-48af-8ea3-770f6c5ef844','1c2a5e2a-398d-4f24-b1fb-eaec3e564ad1','Functions và Methods',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('c16c939b-8078-434a-a01d-65772a287581','fd40dc40-cda6-4a58-a22c-a1523da4c2af','Testing và Debugging',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,7,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('c1c4e4db-9933-4495-8c6b-b4986e9279a3','feb7314f-cc94-428e-8cf9-097314ca5049','Cài đặt môi trường làm việc',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,1,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('c200e368-f8d1-482b-bcdb-7ff7d129efca','8aa05cc3-06d6-43f2-babf-cef8a21c6818','Implementation Phase 1',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('c332a7a6-c050-494f-bf14-d767e6c70f2a','e73bcafa-d309-49ca-9281-8522a3f3a22d','Best Practices cơ bản',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('c414e9b0-3a3d-48ca-8f87-b2de99aa03f0','552c1786-4e74-4c37-898a-3a197dc7f662','Object-Oriented Programming',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('c45abaab-b648-464e-b052-32d3c40910e3','e88f62a2-4e5d-45ab-9a3d-84b0dac88876','Coding Interview Prep',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('c53c9ec6-2efd-47f6-bb15-fe86956e5458','54e63972-81ef-4232-b218-9495af172951','Security Best Practices',NULL,'https://www.youtube.com/watch?v=HZJxjlvBbVw',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('c5a2feb3-08c7-4b78-b8e2-275edcd07fb2','a502fa48-a069-433a-b6ba-a0b0f7893831','Tích hợp Payment Gateway',NULL,'https://www.youtube.com/watch?v=1vjOv_f9L8I',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('c6625907-4c3b-4c45-8bf0-54e96184c1ca','7cadc65f-69c0-41d4-88e5-e4dc940e8664','Object-Oriented Programming',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('c76f868f-ebb9-4711-9b69-67c3fbd26033','552c1786-4e74-4c37-898a-3a197dc7f662','Functions và Methods','# Xin chào\n- Đây là bài số 1\n- Đây là bài số 2\n\nĐoạn code mẫu `Xin chào`\n\n- 123\n- 123\n\n1. \n\n```\n-\n```\n \n\n| Header | Header |\n|--------|--------|\n| Cell | Cell |\n| Cell | Cell |\n| Cell | Cell |\n\n','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('c7f434f9-d498-4740-b98f-0b31d83ce38f','cf4b90bb-4624-41de-8e3f-357a9552c980','Các khái niệm cơ bản',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('c88d931e-ca1e-4d53-9534-09d94dc14ba7','aef1160f-824e-4d89-9ffa-bd75ab63bcac','Biến và kiểu dữ liệu',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('c8b00894-6a8a-48d9-9e51-e0c7c7e54395','f117a365-6dc2-4787-b255-0ae9e4ffe00f','Object-Oriented Programming',NULL,'https://www.youtube.com/watch?v=pTB0EiLXUC8',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('cb619b74-0b35-467c-bf12-6ba70d4232c3','008a6473-036a-4f99-9688-5edf50a48368','Deploy và CI/CD',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,8,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('cb669f3a-92e2-4530-b6af-772b4830c9ed','f48cf941-063c-4b20-b1d8-40aa08234942','Shopping Cart và Checkout',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('cbab583c-2991-4527-bb93-4410c19c731e','2a3cf8f7-6c60-40a3-8e26-943b43f6ff62','AWS/Azure/GCP overview',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('cdf7af47-cf74-4069-a5a6-a98ca70b3da3','008a6473-036a-4f99-9688-5edf50a48368','Setup project và dependencies',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('ce42d975-94ad-487d-b725-a1fe833aa6fc','feb7314f-cc94-428e-8cf9-097314ca5049','Cách học hiệu quả nhất',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('ce5ba60b-7d73-4e92-a62f-f538a11ccec7','d1e2940e-c499-48b1-94ea-fdd6199de7b2','Shopping Cart và Checkout',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('cfa09fad-e644-4761-9cea-baf4db532f09','98e74469-b6b0-4a13-8713-67171f9bcb57','Planning và Documentation',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('d0cc7854-7757-4f27-83d8-c45c8c2a6019','542e68d8-939e-4071-a25c-59bf70fac24e','Phân tích yêu cầu dự án',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('d10ab586-639c-4e0d-b523-23ca06a283ce','7b74c851-504d-46c5-bbed-51a9fe375007','Caching Strategies',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('d1feb433-e007-4bae-9c03-246c0413e72f','7f3f2717-bd76-44c2-9b96-a1616b928913','Freelancing và Side Projects',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('d62c2eb0-713e-4971-9d53-d04369d0b7bc','582537a1-42c0-469c-b0ff-5bda6bba35f8','Message Queue',NULL,'https://www.youtube.com/watch?v=oUJbuFMyBDk',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('d6622b64-1e3f-4a22-9ca8-445a20bdaf20','d55c98b0-8852-4dc6-8e40-37e224ba0a05','CI/CD Pipeline',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('d742e2b0-8e7c-4043-b720-eb784b82e935','76d7395f-b884-4216-97a2-5de3e2ac4a3c','Implementation Phase 2',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('d791c307-11a1-4b0d-8aab-4e2477a9c433','e73bcafa-d309-49ca-9281-8522a3f3a22d','Cú pháp và quy tắc',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('d83dbe5f-5681-4ec7-90ae-7ad0f0ff6f12','feb7314f-cc94-428e-8cf9-097314ca5049','Chào mừng bạn đến với khóa học',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,1,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('d886343a-0eb0-4c71-aa8d-aa644e9aa154','98165aa9-8806-49dd-ab80-3f56766bc299','Testing Strategies',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('d9f90b4b-1f0d-4b63-856a-1f8f5498e219','c2e518dc-f77b-41d7-a9bc-f6a1f33db331','Phân tích yêu cầu dự án',NULL,'https://www.youtube.com/watch?v=fgTGADljAeg',600,1,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('da036688-7b79-4ec4-9087-3b9f914acf1c','d55c98b0-8852-4dc6-8e40-37e224ba0a05','AWS/Azure/GCP overview',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('daba95f0-3871-4ffc-9915-34033c950eaa','486e88e6-e5ae-486e-be55-94ed3f943bfc','Tài liệu và nguồn học tập',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('db42961e-d785-4faa-a898-49787d40147a','f3d94b5a-2690-46a2-a5b4-d96b7c27c844','Cú pháp và quy tắc',NULL,'/videos/db42961e-d785-4faa-a898-49787d40147a-1760738871407.mp4',NULL,2,0,1,'2025-10-13 03:41:26','2025-10-18 05:07:55'),('dc89fdd4-3af2-422e-9a66-cd4021f6801e','1c2a5e2a-398d-4f24-b1fb-eaec3e564ad1','Error Handling',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('dc8d0826-263e-411e-a21e-c8856c1a61ef','bda7c7bb-6881-40fd-98c3-83f7725d2251','Service Communication',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('dcf94206-f751-449b-bc19-55f16b88f40e','e73bcafa-d309-49ca-9281-8522a3f3a22d','Bài tập thực hành',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('dd430da8-a885-4025-8296-2f719d30cdbc','757c5041-08bc-448a-a770-0b8bd7fd7ff6','CI/CD Pipeline',NULL,'https://www.youtube.com/watch?v=scEDHsr3APg',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('dd80b576-170c-4c49-b1c0-0a1a215453b9','98e74469-b6b0-4a13-8713-67171f9bcb57','Deployment và Presentation',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('df5031fc-8dcd-49cd-8a87-987b5d928ad9','c2e518dc-f77b-41d7-a9bc-f6a1f33db331','Xây dựng tính năng chính',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('dfcb1a4a-028b-4c50-b687-bf7531b63122','552c1786-4e74-4c37-898a-3a197dc7f662','Design Patterns',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('e260db1b-6361-497e-ab75-987051d0b7aa','7cadc65f-69c0-41d4-88e5-e4dc940e8664','Error Handling',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('e37ee1ae-442c-4bb6-b1a5-273630747eec','542e68d8-939e-4071-a25c-59bf70fac24e','Xây dựng tính năng Authentication',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('e426474c-eaae-4b86-8b16-33e90c4a1fa2','f117a365-6dc2-4787-b255-0ae9e4ffe00f','Error Handling',NULL,'https://www.youtube.com/watch?v=ZVug42fYkqk',600,3,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('e4769353-02ff-4855-8ceb-5e2e00c2875c','161ab352-776b-4fb1-830d-1d00cf4ccde1','Shopping Cart và Checkout',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('e57c3e1d-b708-490f-a005-f1c1eef6a056','161ab352-776b-4fb1-830d-1d00cf4ccde1','Tích hợp Payment Gateway',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('e5e1af64-2705-42c1-b3c9-4f8eed1c64f5','aef1160f-824e-4d89-9ffa-bd75ab63bcac','Best Practices cơ bản',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('e6c051a5-9529-4305-9c60-72bae467ec7f','f48cf941-063c-4b20-b1d8-40aa08234942','Tích hợp Payment Gateway',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('e843180e-7d4e-48d6-b11f-29f7c32e71b0','f3d94b5a-2690-46a2-a5b4-d96b7c27c844','Toán tử và biểu thức',NULL,'https://www.youtube.com/watch?v=VqEECTjkPBc',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('e85e7400-5507-4b6a-b5a5-72d24d992591','757c5041-08bc-448a-a770-0b8bd7fd7ff6','Kubernetes basics',NULL,'https://www.youtube.com/watch?v=X48VuDVv0do',600,2,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('e8cb4a1a-d5a0-4863-83d1-ec4400a0b67d','98e74469-b6b0-4a13-8713-67171f9bcb57','Implementation Phase 1',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('ead2ff30-5eb0-4503-a96c-f56137e2f687','d55c98b0-8852-4dc6-8e40-37e224ba0a05','Kubernetes basics',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('eafaf30a-14bf-45b6-950f-5ed114a5d0fb','fd40dc40-cda6-4a58-a22c-a1523da4c2af','Thiết kế database',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('ed6140f9-da81-492e-9a46-8814d10c2f5c','757c5041-08bc-448a-a770-0b8bd7fd7ff6','Infrastructure as Code',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,6,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('eeb6af82-8554-4165-916c-37116e2214f5','a502fa48-a069-433a-b6ba-a0b0f7893831','Deploy và CI/CD',NULL,'https://www.youtube.com/watch?v=oykl1Ih9pMg',600,8,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('ef57a6e4-eeff-44ea-af77-360ca8407bff','f3d94b5a-2690-46a2-a5b4-d96b7c27c844','Bài tập thực hành',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('ef7639c3-bd20-46dc-ba62-d16ccfff4610','2584b48e-6ea7-4a84-8362-1f69f037cdf2','Bài tập thực hành',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('efe3e9fd-0846-40e1-b791-ad4581b479ac','5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e','Testing và Debugging',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,7,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('f148f325-c43e-4374-815f-b4fbbaa27906','2584b48e-6ea7-4a84-8362-1f69f037cdf2','Biến và kiểu dữ liệu',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('f1a1429d-7df9-48a2-92ab-9a60e57ae24f','15ab01f4-2a50-4e7a-8829-ffe4429f5cba','AWS/Azure/GCP overview',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('f54f37f1-7077-4969-9d8e-cf87c7f2cfbd','f117a365-6dc2-4787-b255-0ae9e4ffe00f','Asynchronous Programming',NULL,'https://www.youtube.com/watch?v=V_Kr9OSfDeU',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('f7a850f4-2959-4648-b6bc-d849101edb2a','9163e4b4-aa52-4869-a6fe-5ee057d3d3e8','Security Best Practices',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('f9e6f2e2-62fd-4f0f-9910-f773106e3f4d','98165aa9-8806-49dd-ab80-3f56766bc299','Quiz tổng hợp',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('fc9be07b-d848-4933-bfb5-ce9698439f9c','c2e518dc-f77b-41d7-a9bc-f6a1f33db331','Xây dựng tính năng Authentication',NULL,'https://www.youtube.com/watch?v=mbsmsi7l3r4',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('fc9e9daa-a052-4aa8-90ae-62de201806cf','757c5041-08bc-448a-a770-0b8bd7fd7ff6','Monitoring và Logging',NULL,'https://www.youtube.com/watch?v=Lub4IJvPjyk',600,5,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('fd20d4cd-ef54-4c8d-ae3f-947ee699241b','161ab352-776b-4fb1-830d-1d00cf4ccde1','Admin Dashboard',NULL,'https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('fd30ac1b-9465-4b47-bf6b-ecf403ad348a','5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e','Xây dựng tính năng chính',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('fd3ef3e0-ca86-4f6b-8a31-bfdfc68efbce','cf4b90bb-4624-41de-8e3f-357a9552c980','Best Practices cơ bản',NULL,'https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-13 03:41:26','2025-10-24 16:02:36'),('fe656b46-9f3e-4344-8bde-7d589ca63d48','f48cf941-063c-4b20-b1d8-40aa08234942','Xây dựng API Backend',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:38'),('ff37104b-5216-4d55-bff5-7cfdba2e9756','bda7c7bb-6881-40fd-98c3-83f7725d2251','Message Queue',NULL,'https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-13 03:41:27','2025-10-24 16:02:37'),('ff893ca0-99e6-4288-af47-cc6059472cb5','c6e36667-6731-4e49-a8e3-5262615d850a','Implementation Phase 2',NULL,'https://www.youtube.com/watch?v=ok-plXXHlWw',600,4,0,1,'2025-10-13 03:41:26','2025-10-24 16:38:17'),('les2-01-01','ch2-01','C++ History & Overview','C++ là gì, lịch sử, ứng dụng.\n\nC++ là ngôn ngữ lập trình','/videos/les2-01-01-1761296605571.mp4',NULL,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:03:25'),('les2-01-02','ch2-01','Setting up Compiler','Cài đặt g++, Code::Blocks, hoặc Visual Studio.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-01-03','ch2-01','Your First Program','Hello World program, compiling, running.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-01-04','ch2-01','Includes & Namespaces','#include, using namespace std.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-01-05','ch2-01','Input & Output','cout, cin, basic I/O operations.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-01-06','ch2-01','Comments & Debugging','Code comments, debugging basics.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-02-01','ch2-02','Variables & Constants','Declaring variables, const keyword, types.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-02-02','ch2-02','Data Types','int, float, double, char, bool, string.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-02-03','ch2-02','Operators','Arithmetic, comparison, logical, assignment.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-02-04','ch2-02','Type Casting','Implicit, explicit casting, static_cast.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-02-05','ch2-02','String Operations','String concatenation, methods, manipulation.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-02-06','ch2-02','Practice: Calculator','Mini project: Simple calculator program.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-03-01','ch2-03','if-else Statements','Single if, if-else, nested conditions.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-03-02','ch2-03','switch Statements','Switch cases, break, default case.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-03-03','ch2-03','for Loops','Traditional for loop, range-based for.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-03-04','ch2-03','while & do-while','While loops, do-while loops, break, continue.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:36'),('les2-03-05','ch2-03','Nested Loops','Loops inside loops, pattern programs.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-03-06','ch2-03','Practice: Loops','Bài tập: Tạo các pattern với loops.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-04-01','ch2-04','Function Basics','Function declaration, definition, calling.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-04-02','ch2-04','Parameters & Return','Pass by value, return values, return types.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-04-03','ch2-04','Pass by Reference','References, pass by reference, modify variables.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-04-04','ch2-04','Function Overloading','Multiple functions with same name.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-04-05','ch2-04','Recursion','Recursive functions, base case, examples.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-04-06','ch2-04','Practice: Functions','Bài tập: Viết và sử dụng functions.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-05-01','ch2-05','Array Basics','Khai báo array, accessing elements.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-05-02','ch2-05','2D Arrays','Multi-dimensional arrays, matrix operations.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-05-03','ch2-05','Pointers','Pointer declaration, dereferencing, &, *.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-05-04','ch2-05','Dynamic Memory','new, delete, memory allocation, deallocation.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-05-05','ch2-05','Strings','C-style strings, std::string, string methods.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les2-05-06','ch2-05','Practice: Arrays & Pointers','Bài tập: Array, pointer operations.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-01-01','ch3-01','Giới thiệu HTML','HTML là viết tắt của HyperText Markup Language. Đây là ngôn ngữ markup dùng để tạo trang web.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,1,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-01-02','ch3-01','Cấu trúc cơ bản của HTML','Mỗi trang HTML bao gồm DOCTYPE, html, head, và body tag.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-01-03','ch3-01','Các thẻ text phổ biến','Học các thẻ h1-h6, p, strong, em và các thẻ text khác.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-01-04','ch3-01','Links và Navigation','Cách tạo hyperlinks bằng thẻ <a> và tổ chức navigation.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-01-05','ch3-01','Images và Media','Chèn hình ảnh, video, audio vào trang web.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-01-06','ch3-01','Lists và Tables','Tạo danh sách (ul, ol, li) và bảng dữ liệu (table).','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-01-07','ch3-01','HTML Semantic','Sử dụng semantic HTML5 tags: header, nav, main, article, footer...','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,7,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-02-01','ch3-02','Form Elements','Giới thiệu form tag và các input types cơ bản.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-02-02','ch3-02','Input Types','Text, password, email, number, checkbox, radio, file...','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-02-03','ch3-02','Form Validation','Validation attributes và xử lý form submission.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-02-04','ch3-02','Accessibility trong Forms','Label, legend, fieldset và ARIA attributes.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-02-05','ch3-02','Form Best Practices','UX tốt cho forms, layout, error handling...','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-02-06','ch3-02','Thực hành: Tạo Contact Form','Bài tập: Xây dựng form liên hệ hoàn chỉnh.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-03-01','ch3-03','Giới thiệu CSS','CSS là viết tắt của Cascading Style Sheets.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-03-02','ch3-03','CSS Selectors','Element, class, id, attribute selectors và combinations.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-03-03','ch3-03','Box Model','Content, padding, border, margin - cách tính toán.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-03-04','ch3-03','Colors và Fonts','RGB, HEX, HSL colors. Font-family, font-size, font-weight...','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-03-05','ch3-03','Text Styling','Text-align, line-height, letter-spacing, text-decoration...','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-03-06','ch3-03','Background và Borders','Background-color, background-image, border properties...','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-03-07','ch3-03','Thực hành: Styled Card','Bài tập: Tạo card component với CSS.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,7,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-04-01','ch3-04','Display Properties','block, inline, inline-block, none.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-04-02','ch3-04','Positioning','static, relative, absolute, fixed, sticky positioning.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-04-03','ch3-04','Flexbox Basics','Flex container, flex items, flex direction, justify-content...','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-04-04','ch3-04','Flexbox Advanced','Flex-wrap, align-items, flex-grow, flex-shrink, gap...','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-04-05','ch3-04','CSS Grid Basics','Grid container, grid items, rows, columns, gaps.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-04-06','ch3-04','CSS Grid Advanced','Grid-template, auto-fit, minmax, grid-auto-flow...','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-04-07','ch3-04','Thực hành: Responsive Layout','Bài tập: Tạo layout responsive với Flexbox/Grid.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,7,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-05-01','ch3-05','Viewport Meta Tag','Cấu hình viewport cho responsive design.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-05-02','ch3-05','Media Queries','Cú pháp media queries và breakpoints.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-05-03','ch3-05','Mobile-first Approach','Thiết kế cho mobile trước, sau đó scale up.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-05-04','ch3-05','Responsive Images','srcset, sizes, picture element, responsive sizing.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-05-05','ch3-05','Responsive Typography','Font-size, line-height responsive.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-05-06','ch3-05','Thực hành: Responsive Website','Bài tập: Xây dựng trang web responsive.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-06-01','ch3-06','Transitions','CSS transitions, timing functions, delays.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-06-02','ch3-06','Transforms','2D transforms: translate, rotate, scale, skew.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-06-03','ch3-06','3D Transforms','Perspective, rotateX, rotateY, rotateZ.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-06-04','ch3-06','Keyframe Animations','Tạo animations phức tạp với @keyframes.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-06-05','ch3-06','Animation Properties','animation-duration, delay, timing-function, iteration-count...','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-06-06','ch3-06','Thực hành: Animations','Bài tập: Tạo các animations đẹp.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-07-01','ch3-07','CSS Variables','Định nghĩa và sử dụng CSS custom properties.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-07-02','ch3-07','calc() Function','Tính toán giá trị CSS động.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-07-03','ch3-07','clamp() Function','Responsive sizing với clamp.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-07-04','ch3-07','Grid & Flex Updates','CSS Grid subgrid, gap trong Flexbox...','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-07-05','ch3-07','Aspect Ratio','aspect-ratio property cho responsive images.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-08-01','ch3-08','Tailwind CSS Basics','Giới thiệu Tailwind và utility-first CSS.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-08-02','ch3-08','Tailwind Components','Xây dựng components với Tailwind.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-08-03','ch3-08','Tailwind Configuration','Customize Tailwind cho project.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-09-01','ch3-09','Web Accessibility Basics','WCAG guidelines, semantic HTML.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-09-02','ch3-09','ARIA Attributes','role, aria-label, aria-describedby...','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-09-03','ch3-09','Keyboard Navigation','Tab order, focus management.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-10-01','ch3-10','Portfolio Website Project','Xây dựng portfolio site hoàn chỉnh.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-10-02','ch3-10','Performance Optimization','Tối ưu CSS, critical CSS, minification.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les3-10-03','ch3-10','CSS Best Practices','BEM, naming conventions, maintainability.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-01-01','ch5-01','Giới thiệu JavaScript','JavaScript là gì, history, cách sử dụng.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,1,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-01-02','ch5-01','Setup Environment','Cài đặt text editor, browser console, Node.js.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-01-03','ch5-01','First JavaScript Program','Console.log, alert, document.write.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-01-04','ch5-01','Comments & Best Practices','Single-line, multi-line comments, code style.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-01-05','ch5-01','Debugging Basics','Using browser DevTools, debugging techniques.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-01-06','ch5-01','JavaScript Execution','Hoisting, temporal dead zone, execution context.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-02-01','ch5-02','var vs let vs const','Sự khác biệt và khi nào dùng cái nào.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-02-02','ch5-02','Numbers','Integer, float, operations, isNaN, typeof.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-02-03','ch5-02','Strings','String concatenation, template literals, methods.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-02-04','ch5-02','Booleans','True, false, truthy, falsy values.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-02-05','ch5-02','null vs undefined','Phân biệt null và undefined.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-02-06','ch5-02','Type Coercion','Automatic type conversion, explicit conversion.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-03-01','ch5-03','Arithmetic Operators','+, -, *, /, %, ** operators.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-03-02','ch5-03','Comparison Operators','==, ===, !=, !==, <, >, <=, >=.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-03-03','ch5-03','Logical Operators','&&, ||, ! operators, short-circuit evaluation.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-03-04','ch5-03','Assignment Operators','=, +=, -=, *=, /=...','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-03-05','ch5-03','if-else Statements','Conditional logic, nested if-else.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-03-06','ch5-03','Ternary Operator','condition ? value1 : value2.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-03-07','ch5-03','switch Statement','Switch cases, break, default.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,7,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-04-01','ch5-04','Function Declaration','Cú pháp khai báo hàm, parameters, return.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-04-02','ch5-04','Function Expression','Anonymous functions, named function expressions.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-04-03','ch5-04','Arrow Functions','Cú pháp arrow function, implicit return.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-04-04','ch5-04','Default Parameters','Tham số mặc định, rest parameters.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-04-05','ch5-04','Scope & this','Global, local, function, block scope, this keyword.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-05-01','ch5-05','Array Basics','Tạo array, accessing elements, length property.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,1,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-05-02','ch5-05','Array Methods - Mutating','push, pop, shift, unshift, splice, reverse.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,2,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-05-03','ch5-05','Array Methods - Iterating','forEach, map, filter, reduce.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,3,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-05-04','ch5-05','Array Methods - Finding','find, findIndex, indexOf, includes.','https://www.youtube.com/watch?v=cOnqkZ7QtXE',600,4,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-05-05','ch5-05','Array Methods - Advanced','sort, flat, flatMap, some, every.','https://www.youtube.com/watch?v=PkZNo7MFNFg',600,5,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37'),('les5-05-06','ch5-05','Destructuring Arrays','Array destructuring, rest elements.','https://www.youtube.com/watch?v=DHvZLI7Aq8E',600,6,0,1,'2025-10-24 15:10:43','2025-10-24 16:02:37');
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_timestamp` int DEFAULT NULL,
  `is_highlight` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lesson_id` (`lesson_id`),
  KEY `idx_user_lesson` (`user_id`,`lesson_id`),
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'VND',
  `payment_method` enum('STRIPE','PAYPAL','MOMO','VNPAY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `payment_type` enum('COURSE','SUBSCRIPTION') COLLATE utf8mb4_unicode_ci DEFAULT 'COURSE',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_transaction` (`transaction_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_attempts`
--

DROP TABLE IF EXISTS `quiz_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_attempts` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quiz_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `total_questions` int NOT NULL,
  `correct_answers` int NOT NULL,
  `time_taken` int DEFAULT NULL,
  `is_passed` tinyint(1) DEFAULT '0',
  `answers` json DEFAULT NULL,
  `completed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_quiz` (`quiz_id`),
  CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_attempts`
--

LOCK TABLES `quiz_attempts` WRITE;
/*!40000 ALTER TABLE `quiz_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_questions`
--

DROP TABLE IF EXISTS `quiz_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_questions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `quiz_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_type` enum('MULTIPLE_CHOICE','TRUE_FALSE','CODE') COLLATE utf8mb4_unicode_ci DEFAULT 'MULTIPLE_CHOICE',
  `options` json DEFAULT NULL,
  `correct_answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `explanation` text COLLATE utf8mb4_unicode_ci,
  `points` int DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quiz` (`quiz_id`,`sort_order`),
  CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_questions`
--

LOCK TABLES `quiz_questions` WRITE;
/*!40000 ALTER TABLE `quiz_questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `chapter_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `time_limit` int DEFAULT NULL,
  `passing_score` decimal(5,2) DEFAULT '70.00',
  `max_attempts` int DEFAULT '3',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chapter` (`chapter_id`),
  CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roadmap_courses`
--

DROP TABLE IF EXISTS `roadmap_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roadmap_courses` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `roadmap_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL,
  `is_required` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_roadmap_course` (`roadmap_id`,`course_id`),
  KEY `course_id` (`course_id`),
  KEY `idx_roadmap` (`roadmap_id`,`sort_order`),
  CONSTRAINT `roadmap_courses_ibfk_1` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps` (`id`) ON DELETE CASCADE,
  CONSTRAINT `roadmap_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roadmap_courses`
--

LOCK TABLES `roadmap_courses` WRITE;
/*!40000 ALTER TABLE `roadmap_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `roadmap_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roadmaps`
--

DROP TABLE IF EXISTS `roadmaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roadmaps` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `level` enum('BEGINNER','INTERMEDIATE','ADVANCED') COLLATE utf8mb4_unicode_ci DEFAULT 'BEGINNER',
  `estimated_weeks` int DEFAULT NULL,
  `is_template` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roadmaps`
--

LOCK TABLES `roadmaps` WRITE;
/*!40000 ALTER TABLE `roadmaps` DISABLE KEYS */;
INSERT INTO `roadmaps` VALUES ('31834073-9f77-11f0-ad43-a036bc320b36','Full Stack Developer','Complete full stack web development roadmap','BEGINNER',24,1,'2025-10-02 17:04:32'),('3183454f-9f77-11f0-ad43-a036bc320b36','Frontend Developer','Frontend specialization roadmap','BEGINNER',16,1,'2025-10-02 17:04:32'),('31834669-9f77-11f0-ad43-a036bc320b36','Backend Developer','Backend development roadmap','INTERMEDIATE',20,1,'2025-10-02 17:04:32');
/*!40000 ALTER TABLE `roadmaps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_metadata`
--

DROP TABLE IF EXISTS `user_metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_metadata` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_value` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_meta` (`user_id`,`meta_key`),
  KEY `idx_user_key` (`user_id`,`meta_key`),
  CONSTRAINT `user_metadata_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_metadata`
--

LOCK TABLES `user_metadata` WRITE;
/*!40000 ALTER TABLE `user_metadata` DISABLE KEYS */;
INSERT INTO `user_metadata` VALUES ('e5d7dfb3-a4fd-11f0-8481-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','social_github','https://github.com/huynhkhuanit','2025-10-09 17:51:23','2025-10-12 05:46:15'),('e5d81749-a4fd-11f0-8481-a036bc320b36','2396a721-a1e4-11f0-864b-a036bc320b36','social_facebook','https://www.facebook.com/Khuan.Lucas/','2025-10-09 17:51:23','2025-10-12 05:46:15');
/*!40000 ALTER TABLE `user_metadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roadmaps`
--

DROP TABLE IF EXISTS `user_roadmaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roadmaps` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roadmap_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress_percentage` decimal(5,2) DEFAULT '0.00',
  `started_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_roadmap` (`user_id`,`roadmap_id`),
  KEY `roadmap_id` (`roadmap_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `user_roadmaps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roadmaps_ibfk_2` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roadmaps`
--

LOCK TABLES `user_roadmaps` WRITE;
/*!40000 ALTER TABLE `user_roadmaps` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_roadmaps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `membership_type` enum('FREE','PRO') COLLATE utf8mb4_unicode_ci DEFAULT 'FREE',
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'USER',
  `membership_expires_at` datetime DEFAULT NULL,
  `learning_streak` int DEFAULT '0',
  `total_study_time` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `is_verified` tinyint(1) DEFAULT '0',
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_membership` (`membership_type`,`membership_expires_at`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('11dc6060-9f7e-11f0-ad43-a036bc320b36','huynhkhuanit@gmail.com','$2b$10$eVw2seuMmBSFuVU/3eUXQ.QLNucS51H8r0MD3K7IhiaWGGashgRQS','huynhkhuan','Huynh Van Khuan',NULL,NULL,NULL,'FREE','ADMIN',NULL,0,0,1,0,'2025-10-17 17:11:53','2025-10-02 17:53:46','2025-10-17 17:11:53'),('2396a721-a1e4-11f0-864b-a036bc320b36','huynhkhuan777@gmail.com','$2b$10$YrqH5qV3fjLhmCqU5BaznehpHicnOZ6y791xvmEq1gvdheteTkS3C','huynhkhuanit','Huỳnh Khuân','https://res.cloudinary.com/dhztqlkxo/image/upload/v1760213654/dhvlearnx/avatars/user_2396a721-a1e4-11f0-864b-a036bc320b36.jpg',NULL,'Mình là Khuân, mình sinh viên năm 4 ngành Công Nghệ Phần Mềm Mình là Khuân, mình sinh viên năm 4 ngành Công Nghệ Phần MềmMình là Khuân, mình sinh viên năm 4 ngành Công Nghệ Phần MềmMình là Khuân, mình sinh viên năm 4 ngành Công Nghệ Phần Mềm','PRO','TEACHER','2026-10-12 05:15:45',0,0,1,0,'2025-10-25 14:48:52','2025-10-05 19:09:27','2025-10-25 14:48:52'),('3d4ada88-a4f1-11f0-8481-a036bc320b36','minhun@gmail.com','$2b$10$pxjY3ZdI6J1QTbKxacHF6.kQ9s/TsWRQ2AxCgEIzpwvcmOtnHJfyq','minHun','Do Nguyen Minh Huong','',NULL,'Min Hun 123','PRO','USER','2026-10-12 05:18:25',0,0,1,0,'2025-10-17 17:11:42','2025-10-09 16:20:47','2025-10-17 17:11:42');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-25 15:20:03
