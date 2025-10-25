-- Q&A System for Lesson Pages
-- Created: 2025-10-25
-- Description: Database schema for question and answer system on lesson pages

-- Table for lesson questions
CREATE TABLE IF NOT EXISTS `lesson_questions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `lesson_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('OPEN', 'ANSWERED', 'RESOLVED') COLLATE utf8mb4_unicode_ci DEFAULT 'OPEN',
  `is_pinned` tinyint DEFAULT '0',
  `views_count` int DEFAULT '0',
  `likes_count` int DEFAULT '0',
  `answers_count` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_lesson` (`lesson_id`, `created_at` DESC),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_pinned` (`is_pinned`, `created_at` DESC),
  CONSTRAINT `lesson_questions_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lesson_questions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for answers to questions
CREATE TABLE IF NOT EXISTS `lesson_answers` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `question_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_accepted` tinyint DEFAULT '0',
  `likes_count` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_question` (`question_id`, `created_at`),
  KEY `idx_user` (`user_id`),
  KEY `idx_accepted` (`is_accepted`),
  CONSTRAINT `lesson_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `lesson_questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lesson_answers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for question likes
CREATE TABLE IF NOT EXISTS `lesson_question_likes` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `question_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_question_like` (`question_id`, `user_id`),
  KEY `idx_question` (`question_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `lesson_question_likes_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `lesson_questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lesson_question_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for answer likes
CREATE TABLE IF NOT EXISTS `lesson_answer_likes` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `answer_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_answer_like` (`answer_id`, `user_id`),
  KEY `idx_answer` (`answer_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `lesson_answer_likes_ibfk_1` FOREIGN KEY (`answer_id`) REFERENCES `lesson_answers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lesson_answer_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for better performance
CREATE INDEX idx_lesson_status ON lesson_questions(lesson_id, status, created_at DESC);
CREATE INDEX idx_question_likes_count ON lesson_questions(likes_count DESC);
CREATE INDEX idx_answer_accepted ON lesson_answers(question_id, is_accepted DESC);
