-- =====================================================
-- SUPABASE SAMPLE DATA FOR COURSES
-- PostgreSQL/Supabase compatible SQL
-- Converted from MySQL to PostgreSQL
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CATEGORIES (Must be inserted first)
-- =====================================================

INSERT INTO categories (id, name, slug, description, icon_url, sort_order, is_active, created_at) VALUES
('31823a07-9f77-11f0-ad43-a036bc320b36', 'Web Development', 'web-development', 'Learn modern web development', NULL, 0, true, '2025-10-02 17:04:32'),
('31828d8d-9f77-11f0-ad43-a036bc320b36', 'Mobile Development', 'mobile-development', 'Build mobile apps', NULL, 0, true, '2025-10-02 17:04:32'),
('318292e1-9f77-11f0-ad43-a036bc320b36', 'Data Science', 'data-science', 'Data analysis and ML', NULL, 0, true, '2025-10-02 17:04:32'),
('318294a1-9f77-11f0-ad43-a036bc320b36', 'DevOps', 'devops', 'Deployment and infrastructure', NULL, 0, true, '2025-10-02 17:04:32'),
('a1b2c3d4-1234-5678-9abc-def012345678', 'Programming Languages', 'programming-languages', 'Master programming languages', NULL, 0, true, '2025-10-12 04:38:33')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. USERS (Instructors - Must exist before courses)
-- =====================================================

-- Note: Password hash is for 'Aa123456' - Default password for all users
-- Password: Aa123456
INSERT INTO users (id, email, password_hash, username, full_name, avatar_url, phone, bio, membership_type, role, membership_expires_at, learning_streak, total_study_time, is_active, is_verified, last_login, created_at, updated_at) VALUES
('2396a721-a1e4-11f0-864b-a036bc320b36', 'huynhkhuan777@gmail.com', '$2b$10$nVTTyLS7rTg4FqIJFrHTWu2aF7uHUePdyB9bbZ1P0LXxPO6HQJ/B2', 'huynhkhuan777', 'Huỳnh Khuân', 'https://res.cloudinary.com/dhztqlkxo/image/upload/v1760213654/dhvlearnx/avatars/user_2396a721-a1e4-11f0-864b-a036bc320b36.jpg', NULL, 'Mình là Khuân, mình sinh viên năm 4 ngành Công Nghệ Phần Mềm', 'PRO', 'TEACHER', '2026-10-12 05:15:45', 0, 0, true, false, '2025-11-03 02:02:04', '2025-10-05 19:09:27', '2025-11-03 02:02:04'),
('3d4ada88-a4f1-11f0-8481-a036bc320b36', 'minhun@gmail.com', '$2b$10$nVTTyLS7rTg4FqIJFrHTWu2aF7uHUePdyB9bbZ1P0LXxPO6HQJ/B2', 'minHun', 'Do Nguyen Minh Huong', '', NULL, 'Min Hun 123', 'PRO', 'USER', '2026-10-12 05:18:25', 0, 0, true, false, '2025-10-26 18:58:40', '2025-10-09 16:20:47', '2025-10-26 18:58:40')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. COURSES
-- =====================================================

INSERT INTO courses (
    id, 
    title, 
    slug, 
    description, 
    short_description, 
    thumbnail_url, 
    instructor_id, 
    category_id, 
    level, 
    price, 
    is_free, 
    is_published, 
    estimated_duration, 
    rating, 
    total_students, 
    total_lessons, 
    created_at, 
    updated_at
) VALUES
(
    'c1111111-1111-1111-1111-111111111111',
    'Lập trình JavaScript Nâng Cao',
    'lap-trinh-javascript-nang-cao',
    'Khóa học JavaScript nâng cao dành cho developer muốn nâng cấp kỹ năng lên một tầm cao mới. Bạn sẽ học về ES6+, Async/Await, Promises, Design Patterns, Performance Optimization, Testing, và nhiều hơn nữa. Khóa học này sẽ giúp bạn trở thành một JavaScript Developer chuyên nghiệp.

**Nội dung khóa học:**
- ES6+ Features: Arrow functions, Destructuring, Spread/Rest operators
- Advanced Functions: Closures, Higher-order functions, Currying
- Asynchronous JavaScript: Callbacks, Promises, Async/Await
- Object-Oriented Programming: Classes, Inheritance, Prototypes
- Functional Programming: Pure functions, Immutability, Composition
- Design Patterns: Singleton, Factory, Observer, Module patterns
- Performance Optimization: Debouncing, Throttling, Memoization
- Testing: Unit testing with Jest, Integration testing
- Modern Tools: Webpack, Babel, ESLint
- Real-world Projects: Build scalable applications

**Yêu cầu:**
- Đã biết JavaScript cơ bản
- Hiểu về HTML, CSS
- Có kiến thức về lập trình hướng đối tượng

**Bạn sẽ nhận được:**
- 45 giờ video chất lượng cao
- 50+ bài tập thực hành
- 5 dự án thực tế
- Certificate sau khi hoàn thành
- Hỗ trợ trực tiếp từ giảng viên
- Cộng đồng học viên chất lượng',
    'JavaScript nâng cao cho developer: ES6+, Async, Patterns, Testing & Real Projects',
    NULL,
    '2396a721-a1e4-11f0-864b-a036bc320b36',
    '31823a07-9f77-11f0-ad43-a036bc320b36',
    'ADVANCED',
    1399000.00,
    false,
    true,
    2730,
    4.90,
    1254,
    60,
    '2025-10-12 04:38:33',
    '2025-10-13 03:41:26'
),
(
    'c2222222-2222-2222-2222-222222222222',
    'Lập trình C++ Cơ Bản Đến Nâng Cao',
    'lap-trinh-cpp-co-ban-den-nang-cao',
    'Khóa học C++ toàn diện từ cơ bản đến nâng cao. Bạn sẽ học mọi thứ từ syntax cơ bản, OOP, STL, cho đến các kỹ thuật nâng cao như Templates, Smart Pointers, và Modern C++ (C++11/14/17/20).

**Nội dung khóa học:**
- C++ Basics: Variables, Data types, Operators, Control flow
- Functions: Parameters, Return values, Overloading, Recursion
- Arrays and Strings: 1D/2D arrays, String manipulation
- Pointers and References: Memory management, Dynamic allocation
- Object-Oriented Programming: Classes, Objects, Inheritance, Polymorphism
- STL (Standard Template Library): Vectors, Maps, Sets, Algorithms
- Templates: Function templates, Class templates
- Exception Handling: Try-catch, Custom exceptions
- File I/O: Reading and writing files
- Modern C++: Smart pointers, Lambda expressions, Move semantics
- Data Structures: Linked lists, Stacks, Queues, Trees
- Algorithms: Sorting, Searching, Graph algorithms
- Best Practices: Code organization, Documentation

**Yêu cầu:**
- Chỉ cần biết sử dụng máy tính
- Không yêu cầu kiến thức lập trình trước đó
- Đam mê học lập trình

**Bạn sẽ nhận được:**
- 32 giờ video chi tiết
- 100+ bài tập thực hành
- Source code mẫu
- Quiz sau mỗi chương
- Flashcards ôn tập
- Community support',
    'C++ từ zero đến hero: Syntax, OOP, STL, Templates & Modern C++',
    NULL,
    '2396a721-a1e4-11f0-864b-a036bc320b36',
    'a1b2c3d4-1234-5678-9abc-def012345678',
    'BEGINNER',
    0.00,
    true,
    true,
    1965,
    4.80,
    25894,
    60,
    '2025-10-12 04:38:33',
    '2025-10-24 14:32:32'
),
(
    'c3333333-3333-3333-3333-333333333333',
    'HTML CSS Cơ Bản Đến Nâng Cao',
    'html-css-co-ban-den-nang-cao',
    'Khóa học HTML & CSS toàn diện, giúp bạn xây dựng website đẹp và responsive. Từ những thẻ HTML cơ bản đến CSS Grid, Flexbox, và responsive design với media queries.

**Nội dung khóa học:**
- HTML Fundamentals: Tags, Attributes, Semantic HTML
- HTML Forms: Input types, Validation, Accessibility
- CSS Basics: Selectors, Properties, Box model
- CSS Layout: Flexbox, Grid, Positioning
- Responsive Design: Media queries, Mobile-first approach
- CSS Animations: Transitions, Transforms, Keyframes
- Modern CSS: Variables, calc(), clamp()
- CSS Frameworks: Introduction to Tailwind CSS
- Web Accessibility: ARIA, Semantic HTML, Best practices
- Performance: Optimizing CSS, Critical CSS
- Real Projects: Build 10+ responsive websites
- Portfolio Website: Build your own portfolio
- Best Practices: BEM methodology, CSS architecture

**Yêu cầu:**
- Chỉ cần biết sử dụng máy tính
- Không cần kinh nghiệm lập trình
- Có tinh thần học hỏi

**Bạn sẽ nhận được:**
- 28 giờ video hướng dẫn
- 50+ bài tập thực hành
- 10 dự án thực tế
- Source code đầy đủ
- Hỗ trợ từ cộng đồng
- Certificate khi hoàn thành',
    'HTML & CSS complete: Semantic HTML, Flexbox, Grid & Responsive Design',
    NULL,
    '2396a721-a1e4-11f0-864b-a036bc320b36',
    '31823a07-9f77-11f0-ad43-a036bc320b36',
    'BEGINNER',
    0.00,
    true,
    true,
    1700,
    4.90,
    45234,
    60,
    '2025-10-12 04:38:33',
    '2025-10-13 03:41:27'
),
(
    'c4444444-4444-4444-4444-444444444444',
    'Cấu Trúc Dữ Liệu Và Giải Thuật',
    'cau-truc-du-lieu-va-giai-thuat',
    'Khóa học về Cấu trúc dữ liệu và Giải thuật (Data Structures & Algorithms) - nền tảng quan trọng nhất của lập trình. Học cách tư duy thuật toán, phân tích độ phức tạp, và giải quyết vấn đề hiệu quả.

**Nội dung khóa học:**
- Algorithm Analysis: Big O notation, Time & Space complexity
- Arrays & Strings: Manipulation, Two pointers technique
- Linked Lists: Singly, Doubly, Circular linked lists
- Stacks & Queues: Implementation, Applications
- Hash Tables: Hash functions, Collision handling
- Trees: Binary trees, BST, AVL, Red-Black trees
- Heaps: Min heap, Max heap, Priority queue
- Graphs: Representation, BFS, DFS, Shortest paths
- Sorting Algorithms: Bubble, Selection, Insertion, Merge, Quick sort
- Searching Algorithms: Linear, Binary, Interpolation search
- Dynamic Programming: Memoization, Tabulation
- Greedy Algorithms: Activity selection, Huffman coding
- Backtracking: N-Queens, Sudoku solver
- Divide and Conquer: Merge sort, Quick sort
- Problem Solving: LeetCode-style problems

**Yêu cầu:**
- Biết ít nhất 1 ngôn ngữ lập trình (C++, Java, Python)
- Hiểu về biến, vòng lặp, hàm
- Tư duy logic tốt

**Bạn sẽ nhận được:**
- 35 giờ video chi tiết
- 200+ bài tập từ dễ đến khó
- Visual animations cho mỗi thuật toán
- Interview preparation materials
- LeetCode problem sets
- Certificate sau khi hoàn thành',
    'Master DSA: Arrays, Trees, Graphs, DP & Problem Solving',
    NULL,
    '2396a721-a1e4-11f0-864b-a036bc320b36',
    'a1b2c3d4-1234-5678-9abc-def012345678',
    'ADVANCED',
    0.00,
    true,
    true,
    2115,
    4.70,
    18954,
    60,
    '2025-10-12 04:38:33',
    '2025-10-24 14:32:36'
),
(
    'c5555555-5555-5555-5555-555555555555',
    'Lập trình JavaScript Cơ Bản',
    'lap-trinh-javascript-co-ban',
    'Khóa học JavaScript cơ bản dành cho người mới bắt đầu. Bạn sẽ học mọi thứ từ cú pháp cơ bản, DOM manipulation, đến xây dựng các web application đơn giản.

**Nội dung khóa học:**
- JavaScript Introduction: History, Setup, First program
- Variables & Data Types: let, const, var, Numbers, Strings, Booleans
- Operators: Arithmetic, Comparison, Logical operators
- Control Flow: if-else, switch, ternary operator
- Loops: for, while, do-while, forEach
- Functions: Declaration, Expression, Arrow functions
- Arrays: Methods, Iteration, Manipulation
- Objects: Properties, Methods, this keyword
- DOM Manipulation: Selecting elements, Event listeners
- Events: Click, Submit, Keyboard events
- Forms: Input handling, Validation
- Browser APIs: LocalStorage, Fetch API
- ES6 Basics: Template literals, Destructuring
- Mini Projects: Calculator, Todo List, Weather App
- Best Practices: Code style, Debugging

**Yêu cầu:**
- Biết HTML & CSS cơ bản
- Không cần kinh nghiệm JavaScript
- Có laptop và text editor

**Bạn sẽ nhận được:**
- 18 giờ video từng bước
- 60+ bài tập code
- 5 mini projects
- Source code đầy đủ
- Community support
- Certificate khi hoàn thành',
    'JavaScript basics: Syntax, DOM, Events & Build Real Projects',
    NULL,
    '2396a721-a1e4-11f0-864b-a036bc320b36',
    '31823a07-9f77-11f0-ad43-a036bc320b36',
    'BEGINNER',
    0.00,
    true,
    true,
    1110,
    4.80,
    32184,
    60,
    '2025-10-12 04:38:33',
    '2025-10-13 03:41:27'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    short_description = EXCLUDED.short_description,
    thumbnail_url = EXCLUDED.thumbnail_url,
    instructor_id = EXCLUDED.instructor_id,
    category_id = EXCLUDED.category_id,
    level = EXCLUDED.level,
    price = EXCLUDED.price,
    is_free = EXCLUDED.is_free,
    is_published = EXCLUDED.is_published,
    estimated_duration = EXCLUDED.estimated_duration,
    rating = EXCLUDED.rating,
    total_students = EXCLUDED.total_students,
    total_lessons = EXCLUDED.total_lessons,
    updated_at = EXCLUDED.updated_at;

-- =====================================================
-- 4. CHAPTERS (Sample chapters for each course)
-- =====================================================

-- Chapters for Course 1: JavaScript Nâng Cao (c1111111...)
INSERT INTO chapters (id, course_id, title, description, sort_order, is_published, created_at, updated_at) VALUES
('5a36a4e3-a7ab-11f0-860a-a036bc320b36', 'c1111111-1111-1111-1111-111111111111', 'Giới thiệu khóa học', 'Tổng quan về khóa học và chuẩn bị môi trường học tập', 1, true, '2025-10-13 03:38:04', '2025-10-13 03:38:04'),
('f3d94b5a-2690-46a2-a5b4-d96b7c27c844', 'c1111111-1111-1111-1111-111111111111', 'Kiến thức nền tảng', 'Các khái niệm cơ bản và cú pháp cần thiết', 2, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('f117a365-6dc2-4787-b255-0ae9e4ffe00f', 'c1111111-1111-1111-1111-111111111111', 'Lập trình nâng cao', 'Các kỹ thuật và patterns nâng cao', 3, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('c2e518dc-f77b-41d7-a9bc-f6a1f33db331', 'c1111111-1111-1111-1111-111111111111', 'Dự án thực tế 1', 'Xây dựng ứng dụng hoàn chỉnh từ đầu đến cuối', 4, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('54e63972-81ef-4232-b218-9495af172951', 'c1111111-1111-1111-1111-111111111111', 'Kiến thức nâng cao', 'Performance, Security và Best Practices', 5, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26')
ON CONFLICT (id) DO NOTHING;

-- Chapters for Course 2: C++ (c2222222...)
INSERT INTO chapters (id, course_id, title, description, sort_order, is_published, created_at, updated_at) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'c2222222-2222-2222-2222-222222222222', 'C++ Introduction', 'Giới thiệu C++, setup environment', 1, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a1b2c3d4-0001-4000-8000-000000000002', 'c2222222-2222-2222-2222-222222222222', 'Basic Syntax', 'Variables, data types, operators', 2, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a1b2c3d4-0001-4000-8000-000000000003', 'c2222222-2222-2222-2222-222222222222', 'Control Flow', 'if-else, loops, switch statements', 3, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a1b2c3d4-0001-4000-8000-000000000004', 'c2222222-2222-2222-2222-222222222222', 'Functions', 'Function declaration, parameters, recursion', 4, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a1b2c3d4-0001-4000-8000-000000000005', 'c2222222-2222-2222-2222-222222222222', 'Arrays & Pointers', 'Arrays, pointers, memory management', 5, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43')
ON CONFLICT (id) DO NOTHING;

-- Chapters for Course 3: HTML CSS (c3333333...)
INSERT INTO chapters (id, course_id, title, description, sort_order, is_published, created_at, updated_at) VALUES
('b1b2c3d4-0002-4000-8000-000000000001', 'c3333333-3333-3333-3333-333333333333', 'HTML Fundamentals', 'Học các thẻ HTML cơ bản và tạo trang web đơn giản', 1, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('b1b2c3d4-0002-4000-8000-000000000002', 'c3333333-3333-3333-3333-333333333333', 'HTML Forms', 'Tạo và xử lý biểu mẫu trong HTML', 2, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('b1b2c3d4-0002-4000-8000-000000000003', 'c3333333-3333-3333-3333-333333333333', 'CSS Basics', 'CSS cơ bản - tạo kiểu cho HTML', 3, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('b1b2c3d4-0002-4000-8000-000000000004', 'c3333333-3333-3333-3333-333333333333', 'CSS Layout', 'Flexbox và CSS Grid', 4, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('b1b2c3d4-0002-4000-8000-000000000005', 'c3333333-3333-3333-3333-333333333333', 'Responsive Design', 'Mobile-first approach và media queries', 5, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43')
ON CONFLICT (id) DO NOTHING;

-- Chapters for Course 4: DSA (c4444444...)
INSERT INTO chapters (id, course_id, title, description, sort_order, is_published, created_at, updated_at) VALUES
('2584b48e-6ea7-4a84-8362-1f69f037cdf2', 'c4444444-4444-4444-4444-444444444444', 'Kiến thức nền tảng', 'Các khái niệm cơ bản và cú pháp cần thiết', 2, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('7cadc65f-69c0-41d4-88e5-e4dc940e8664', 'c4444444-4444-4444-4444-444444444444', 'Lập trình nâng cao', 'Các kỹ thuật và patterns nâng cao', 3, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e', 'c4444444-4444-4444-4444-444444444444', 'Dự án thực tế 1', 'Xây dựng ứng dụng hoàn chỉnh từ đầu đến cuối', 4, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('98165aa9-8806-49dd-ab80-3f56766bc299', 'c4444444-4444-4444-4444-444444444444', 'Kiến thức nâng cao', 'Performance, Security và Best Practices', 5, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27')
ON CONFLICT (id) DO NOTHING;

-- Chapters for Course 5: JavaScript Cơ Bản (c5555555...)
INSERT INTO chapters (id, course_id, title, description, sort_order, is_published, created_at, updated_at) VALUES
('c1b2c3d4-0005-4000-8000-000000000001', 'c5555555-5555-5555-5555-555555555555', 'JavaScript Fundamentals', 'Cú pháp cơ bản và setup environment', 1, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('c1b2c3d4-0005-4000-8000-000000000002', 'c5555555-5555-5555-5555-555555555555', 'Variables & Data Types', 'let, const, var và các kiểu dữ liệu', 2, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('c1b2c3d4-0005-4000-8000-000000000003', 'c5555555-5555-5555-5555-555555555555', 'Operators & Control Flow', 'Operators, if-else, switch, loops', 3, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('c1b2c3d4-0005-4000-8000-000000000004', 'c5555555-5555-5555-5555-555555555555', 'Functions', 'Function declaration, arrow functions, scope', 4, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('c1b2c3d4-0005-4000-8000-000000000005', 'c5555555-5555-5555-5555-555555555555', 'Arrays', 'Array methods, iteration, manipulation', 5, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. LESSONS (Sample lessons for each chapter)
-- =====================================================

-- Lessons for Course 1: JavaScript Nâng Cao - Chapter 1: Giới thiệu khóa học
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a1111111-1111-4111-8111-111111111111', '5a36a4e3-a7ab-11f0-860a-a036bc320b36', 'Chào mừng đến với khóa học', 'Giới thiệu tổng quan về khóa học JavaScript nâng cao và những gì bạn sẽ học được.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 600, 1, true, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a1111111-1111-4111-8111-111111111112', '5a36a4e3-a7ab-11f0-860a-a036bc320b36', 'Cài đặt môi trường làm việc', 'Hướng dẫn cài đặt Node.js, npm, và các công cụ cần thiết cho khóa học.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 900, 2, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a1111111-1111-4111-8111-111111111113', '5a36a4e3-a7ab-11f0-860a-a036bc320b36', 'Cấu trúc khóa học và tài liệu', 'Tìm hiểu về cấu trúc khóa học, cách học hiệu quả và các tài liệu hỗ trợ.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 600, 3, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27');

-- Lessons for Course 1: JavaScript Nâng Cao - Chapter 2: Kiến thức nền tảng
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a1111111-1111-4111-8111-111111111121', 'f3d94b5a-2690-46a2-a5b4-d96b7c27c844', 'Các khái niệm cơ bản', 'Ôn lại các khái niệm JavaScript cơ bản: variables, functions, objects.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 1, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111122', 'f3d94b5a-2690-46a2-a5b4-d96b7c27c844', 'Biến và kiểu dữ liệu', 'Tìm hiểu về let, const, var và các kiểu dữ liệu trong JavaScript.', 'https://www.youtube.com/watch?v=JNMy969SjyU', 900, 2, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111123', 'f3d94b5a-2690-46a2-a5b4-d96b7c27c844', 'Cú pháp và quy tắc', 'Các quy tắc cú pháp và coding conventions trong JavaScript.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 600, 3, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111124', 'f3d94b5a-2690-46a2-a5b4-d96b7c27c844', 'Toán tử và biểu thức', 'Các toán tử trong JavaScript và cách sử dụng chúng.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 4, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111125', 'f3d94b5a-2690-46a2-a5b4-d96b7c27c844', 'Best Practices cơ bản', 'Các best practices khi viết code JavaScript.', 'https://www.youtube.com/watch?v=HZJxjlvBbVw', 1200, 5, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26');

-- Lessons for Course 1: JavaScript Nâng Cao - Chapter 3: Lập trình nâng cao
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a1111111-1111-4111-8111-111111111131', 'f117a365-6dc2-4787-b255-0ae9e4ffe00f', 'Functions và Methods', 'Tìm hiểu về functions, methods và cách sử dụng chúng hiệu quả.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 1, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111132', 'f117a365-6dc2-4787-b255-0ae9e4ffe00f', 'Object-Oriented Programming', 'Lập trình hướng đối tượng trong JavaScript: classes, inheritance, polymorphism.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1500, 2, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111133', 'f117a365-6dc2-4787-b255-0ae9e4ffe00f', 'Error Handling', 'Xử lý lỗi trong JavaScript: try-catch, throw, và error objects.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 900, 3, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111134', 'f117a365-6dc2-4787-b255-0ae9e4ffe00f', 'Asynchronous Programming', 'Lập trình bất đồng bộ: Promises, async/await, và callbacks.', 'https://www.youtube.com/watch?v=V_Kr9OSfDeU', 1800, 4, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111135', 'f117a365-6dc2-4787-b255-0ae9e4ffe00f', 'Design Patterns', 'Các design patterns phổ biến trong JavaScript: Singleton, Factory, Observer.', 'https://www.youtube.com/watch?v=tv-_1er1mWI', 1500, 5, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26');

-- Lessons for Course 1: JavaScript Nâng Cao - Chapter 4: Dự án thực tế 1
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a1111111-1111-4111-8111-111111111141', 'c2e518dc-f77b-41d7-a9bc-f6a1f33db331', 'Phân tích yêu cầu dự án', 'Phân tích và lập kế hoạch cho dự án thực tế đầu tiên.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 1, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111142', 'c2e518dc-f77b-41d7-a9bc-f6a1f33db331', 'Thiết kế database', 'Thiết kế cơ sở dữ liệu cho dự án.', 'https://www.youtube.com/watch?v=HXV3zeQKqGY', 1200, 2, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111143', 'c2e518dc-f77b-41d7-a9bc-f6a1f33db331', 'Thiết kế giao diện', 'Thiết kế UI/UX cho ứng dụng.', 'https://www.youtube.com/watch?v=ok-plXXHlWw', 1200, 3, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111144', 'c2e518dc-f77b-41d7-a9bc-f6a1f33db331', 'Xây dựng tính năng Authentication', 'Xây dựng hệ thống xác thực người dùng.', 'https://www.youtube.com/watch?v=mbsmsi7l3r4', 1800, 4, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111145', 'c2e518dc-f77b-41d7-a9bc-f6a1f33db331', 'Xây dựng tính năng chính', 'Phát triển các tính năng core của ứng dụng.', 'https://www.youtube.com/watch?v=ok-plXXHlWw', 2400, 5, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111146', 'c2e518dc-f77b-41d7-a9bc-f6a1f33db331', 'Testing và Debugging', 'Kiểm thử và debug ứng dụng.', 'https://www.youtube.com/watch?v=r9HdHUE0COE', 1500, 6, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111147', 'c2e518dc-f77b-41d7-a9bc-f6a1f33db331', 'Tối ưu và hoàn thiện', 'Tối ưu hiệu suất và hoàn thiện ứng dụng.', 'https://www.youtube.com/watch?v=B4PSP-xF3dQ', 1200, 7, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111148', 'c2e518dc-f77b-41d7-a9bc-f6a1f33db331', 'Deploy lên production', 'Triển khai ứng dụng lên môi trường production.', 'https://www.youtube.com/watch?v=oykl1Ih9pMg', 1800, 8, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26');

-- Lessons for Course 1: JavaScript Nâng Cao - Chapter 5: Kiến thức nâng cao
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a1111111-1111-4111-8111-111111111151', '54e63972-81ef-4232-b218-9495af172951', 'Performance Optimization', 'Tối ưu hiệu suất JavaScript: debouncing, throttling, memoization.', 'https://www.youtube.com/watch?v=B4PSP-xF3dQ', 1500, 1, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111152', '54e63972-81ef-4232-b218-9495af172951', 'Caching Strategies', 'Các chiến lược caching trong JavaScript.', 'https://www.youtube.com/watch?v=U3RkDLtS7uY', 1200, 2, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111153', '54e63972-81ef-4232-b218-9495af172951', 'Security Best Practices', 'Bảo mật trong JavaScript: XSS, CSRF, và các best practices.', 'https://www.youtube.com/watch?v=HZJxjlvBbVw', 1500, 3, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111154', '54e63972-81ef-4232-b218-9495af172951', 'Testing Strategies', 'Chiến lược testing: unit tests, integration tests, e2e tests.', 'https://www.youtube.com/watch?v=r9HdHUE0COE', 1800, 4, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111155', '54e63972-81ef-4232-b218-9495af172951', 'Code Review và Refactoring', 'Kỹ thuật code review và refactoring code JavaScript.', 'https://www.youtube.com/watch?v=XDOaLUq_hL0', 1200, 5, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26'),
('a1111111-1111-4111-8111-111111111156', '54e63972-81ef-4232-b218-9495af172951', 'Quiz tổng hợp', 'Bài quiz tổng hợp kiến thức đã học.', 'https://www.youtube.com/watch?v=ok-plXXHlWw', 600, 6, false, true, '2025-10-13 03:41:26', '2025-10-13 03:41:26');

-- Lessons for Course 2: C++ - Chapter 1: C++ Introduction
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a2222222-2222-4222-8222-222222222221', 'a1b2c3d4-0001-4000-8000-000000000001', 'C++ History & Overview', 'C++ là gì, lịch sử phát triển và ứng dụng của C++.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 900, 1, true, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222222', 'a1b2c3d4-0001-4000-8000-000000000001', 'Setting up Compiler', 'Cài đặt g++, Code::Blocks, hoặc Visual Studio.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222223', 'a1b2c3d4-0001-4000-8000-000000000001', 'Your First Program', 'Viết chương trình Hello World đầu tiên, compile và chạy.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 900, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222224', 'a1b2c3d4-0001-4000-8000-000000000001', 'Includes & Namespaces', 'Tìm hiểu về #include và using namespace std.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 600, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222225', 'a1b2c3d4-0001-4000-8000-000000000001', 'Input & Output', 'Sử dụng cout và cin cho input/output cơ bản.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222226', 'a1b2c3d4-0001-4000-8000-000000000001', 'Comments & Debugging', 'Cách viết comments và debugging cơ bản.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 600, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 2: C++ - Chapter 2: Basic Syntax
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a2222222-2222-4222-8222-222222222231', 'a1b2c3d4-0001-4000-8000-000000000002', 'Variables & Constants', 'Khai báo biến và hằng số với từ khóa const.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222232', 'a1b2c3d4-0001-4000-8000-000000000002', 'Data Types', 'Các kiểu dữ liệu: int, float, double, char, bool, string.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222233', 'a1b2c3d4-0001-4000-8000-000000000002', 'Operators', 'Các toán tử: arithmetic, comparison, logical, assignment.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222234', 'a1b2c3d4-0001-4000-8000-000000000002', 'Type Casting', 'Ép kiểu: implicit, explicit casting, static_cast.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222235', 'a1b2c3d4-0001-4000-8000-000000000002', 'String Operations', 'Thao tác với string: concatenation, methods, manipulation.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222236', 'a1b2c3d4-0001-4000-8000-000000000002', 'Practice: Calculator', 'Bài tập thực hành: Xây dựng chương trình máy tính đơn giản.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 2: C++ - Chapter 3: Control Flow
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a2222222-2222-4222-8222-222222222241', 'a1b2c3d4-0001-4000-8000-000000000003', 'if-else Statements', 'Câu lệnh điều kiện: if, if-else, nested conditions.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 900, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222242', 'a1b2c3d4-0001-4000-8000-000000000003', 'switch Statements', 'Câu lệnh switch: cases, break, default.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222243', 'a1b2c3d4-0001-4000-8000-000000000003', 'for Loops', 'Vòng lặp for: traditional for loop, range-based for.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222244', 'a1b2c3d4-0001-4000-8000-000000000003', 'while & do-while', 'Vòng lặp while và do-while, break, continue.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222245', 'a1b2c3d4-0001-4000-8000-000000000003', 'Nested Loops', 'Vòng lặp lồng nhau và các bài tập pattern.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222246', 'a1b2c3d4-0001-4000-8000-000000000003', 'Practice: Loops', 'Bài tập thực hành: Tạo các pattern với loops.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 2: C++ - Chapter 4: Functions
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a2222222-2222-4222-8222-222222222251', 'a1b2c3d4-0001-4000-8000-000000000004', 'Function Basics', 'Cơ bản về hàm: declaration, definition, calling.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222252', 'a1b2c3d4-0001-4000-8000-000000000004', 'Parameters & Return', 'Tham số và giá trị trả về: pass by value, return types.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222253', 'a1b2c3d4-0001-4000-8000-000000000004', 'Pass by Reference', 'Truyền tham chiếu và cách sửa đổi biến.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1500, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222254', 'a1b2c3d4-0001-4000-8000-000000000004', 'Function Overloading', 'Nạp chồng hàm: nhiều hàm cùng tên với tham số khác nhau.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222255', 'a1b2c3d4-0001-4000-8000-000000000004', 'Recursion', 'Đệ quy: recursive functions, base case, examples.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222256', 'a1b2c3d4-0001-4000-8000-000000000004', 'Practice: Functions', 'Bài tập thực hành: Viết và sử dụng functions.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 2: C++ - Chapter 5: Arrays & Pointers
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a2222222-2222-4222-8222-222222222261', 'a1b2c3d4-0001-4000-8000-000000000005', 'Array Basics', 'Cơ bản về mảng: khai báo, truy cập phần tử.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222262', 'a1b2c3d4-0001-4000-8000-000000000005', '2D Arrays', 'Mảng đa chiều và các thao tác ma trận.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222263', 'a1b2c3d4-0001-4000-8000-000000000005', 'Pointers', 'Con trỏ: declaration, dereferencing, &, *.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1800, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222264', 'a1b2c3d4-0001-4000-8000-000000000005', 'Dynamic Memory', 'Cấp phát động: new, delete, memory management.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222265', 'a1b2c3d4-0001-4000-8000-000000000005', 'Strings', 'Xử lý chuỗi: C-style strings, std::string, string methods.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a2222222-2222-4222-8222-222222222266', 'a1b2c3d4-0001-4000-8000-000000000005', 'Practice: Arrays & Pointers', 'Bài tập thực hành: Thao tác với arrays và pointers.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 2100, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 3: HTML CSS - Chapter 1: HTML Fundamentals
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a3333333-3333-4333-8333-333333333331', 'b1b2c3d4-0002-4000-8000-000000000001', 'Giới thiệu HTML', 'HTML là viết tắt của HyperText Markup Language. Đây là ngôn ngữ markup dùng để tạo trang web.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 900, 1, true, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333332', 'b1b2c3d4-0002-4000-8000-000000000001', 'Cấu trúc cơ bản của HTML', 'Mỗi trang HTML bao gồm DOCTYPE, html, head, và body tag.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 900, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333333', 'b1b2c3d4-0002-4000-8000-000000000001', 'Các thẻ text phổ biến', 'Học các thẻ h1-h6, p, strong, em và các thẻ text khác.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333334', 'b1b2c3d4-0002-4000-8000-000000000001', 'Links và Navigation', 'Cách tạo hyperlinks bằng thẻ <a> và tổ chức navigation.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 900, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333335', 'b1b2c3d4-0002-4000-8000-000000000001', 'Images và Media', 'Chèn hình ảnh, video, audio vào trang web.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333336', 'b1b2c3d4-0002-4000-8000-000000000001', 'Lists và Tables', 'Tạo danh sách (ul, ol, li) và bảng dữ liệu (table).', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333337', 'b1b2c3d4-0002-4000-8000-000000000001', 'HTML Semantic', 'Sử dụng semantic HTML5 tags: header, nav, main, article, footer.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1500, 7, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 3: HTML CSS - Chapter 2: HTML Forms
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a3333333-3333-4333-8333-333333333341', 'b1b2c3d4-0002-4000-8000-000000000002', 'Form Elements', 'Giới thiệu form tag và các input types cơ bản.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333342', 'b1b2c3d4-0002-4000-8000-000000000002', 'Input Types', 'Các loại input: text, password, email, number, checkbox, radio, file.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333343', 'b1b2c3d4-0002-4000-8000-000000000002', 'Form Validation', 'Validation attributes và xử lý form submission.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333344', 'b1b2c3d4-0002-4000-8000-000000000002', 'Accessibility trong Forms', 'Label, legend, fieldset và ARIA attributes.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333345', 'b1b2c3d4-0002-4000-8000-000000000002', 'Form Best Practices', 'UX tốt cho forms, layout, error handling.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333346', 'b1b2c3d4-0002-4000-8000-000000000002', 'Thực hành: Tạo Contact Form', 'Bài tập: Xây dựng form liên hệ hoàn chỉnh.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 3: HTML CSS - Chapter 3: CSS Basics
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a3333333-3333-4333-8333-333333333351', 'b1b2c3d4-0002-4000-8000-000000000003', 'Giới thiệu CSS', 'CSS là viết tắt của Cascading Style Sheets.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 900, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333352', 'b1b2c3d4-0002-4000-8000-000000000003', 'CSS Selectors', 'Element, class, id, attribute selectors và combinations.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333353', 'b1b2c3d4-0002-4000-8000-000000000003', 'Box Model', 'Content, padding, border, margin - cách tính toán.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333354', 'b1b2c3d4-0002-4000-8000-000000000003', 'Colors và Fonts', 'RGB, HEX, HSL colors. Font-family, font-size, font-weight.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333355', 'b1b2c3d4-0002-4000-8000-000000000003', 'Text Styling', 'Text-align, line-height, letter-spacing, text-decoration.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333356', 'b1b2c3d4-0002-4000-8000-000000000003', 'Background và Borders', 'Background-color, background-image, border properties.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333357', 'b1b2c3d4-0002-4000-8000-000000000003', 'Thực hành: Styled Card', 'Bài tập: Tạo card component với CSS.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 7, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 3: HTML CSS - Chapter 4: CSS Layout
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a3333333-3333-4333-8333-333333333361', 'b1b2c3d4-0002-4000-8000-000000000004', 'Display Properties', 'block, inline, inline-block, none.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 900, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333362', 'b1b2c3d4-0002-4000-8000-000000000004', 'Positioning', 'static, relative, absolute, fixed, sticky positioning.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333363', 'b1b2c3d4-0002-4000-8000-000000000004', 'Flexbox Basics', 'Flex container, flex items, flex direction, justify-content.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333364', 'b1b2c3d4-0002-4000-8000-000000000004', 'Flexbox Advanced', 'Flex-wrap, align-items, flex-grow, flex-shrink, gap.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333365', 'b1b2c3d4-0002-4000-8000-000000000004', 'CSS Grid Basics', 'Grid container, grid items, rows, columns, gaps.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1800, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333366', 'b1b2c3d4-0002-4000-8000-000000000004', 'CSS Grid Advanced', 'Grid-template, auto-fit, minmax, grid-auto-flow.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333367', 'b1b2c3d4-0002-4000-8000-000000000004', 'Thực hành: Responsive Layout', 'Bài tập: Tạo layout responsive với Flexbox/Grid.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 2400, 7, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 3: HTML CSS - Chapter 5: Responsive Design
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a3333333-3333-4333-8333-333333333371', 'b1b2c3d4-0002-4000-8000-000000000005', 'Viewport Meta Tag', 'Cấu hình viewport cho responsive design.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 600, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333372', 'b1b2c3d4-0002-4000-8000-000000000005', 'Media Queries', 'Cú pháp media queries và breakpoints.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333373', 'b1b2c3d4-0002-4000-8000-000000000005', 'Mobile-first Approach', 'Thiết kế cho mobile trước, sau đó scale up.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333374', 'b1b2c3d4-0002-4000-8000-000000000005', 'Responsive Images', 'srcset, sizes, picture element, responsive sizing.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333375', 'b1b2c3d4-0002-4000-8000-000000000005', 'Responsive Typography', 'Font-size, line-height responsive.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a3333333-3333-4333-8333-333333333376', 'b1b2c3d4-0002-4000-8000-000000000005', 'Thực hành: Responsive Website', 'Bài tập: Xây dựng trang web responsive.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 2400, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 4: DSA - Chapter 1: Kiến thức nền tảng
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a4444444-4444-4444-8444-444444444441', '2584b48e-6ea7-4a84-8362-1f69f037cdf2', 'Các khái niệm cơ bản', 'Giới thiệu về cấu trúc dữ liệu và giải thuật.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 1, true, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444442', '2584b48e-6ea7-4a84-8362-1f69f037cdf2', 'Cú pháp và quy tắc', 'Cú pháp cơ bản và quy tắc khi làm việc với DSA.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 900, 2, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444443', '2584b48e-6ea7-4a84-8362-1f69f037cdf2', 'Biến và kiểu dữ liệu', 'Các kiểu dữ liệu cơ bản trong DSA.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 3, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444444', '2584b48e-6ea7-4a84-8362-1f69f037cdf2', 'Toán tử và biểu thức', 'Các toán tử và cách tính toán độ phức tạp.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 4, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444445', '2584b48e-6ea7-4a84-8362-1f69f037cdf2', 'Bài tập thực hành', 'Bài tập thực hành về các khái niệm cơ bản.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 5, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444446', '2584b48e-6ea7-4a84-8362-1f69f037cdf2', 'Best Practices cơ bản', 'Các best practices khi học và thực hành DSA.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 6, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27');

-- Lessons for Course 4: DSA - Chapter 2: Lập trình nâng cao
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a4444444-4444-4444-8444-444444444451', '7cadc65f-69c0-41d4-88e5-e4dc940e8664', 'Functions và Methods', 'Các hàm và phương thức trong DSA.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 1, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444452', '7cadc65f-69c0-41d4-88e5-e4dc940e8664', 'Object-Oriented Programming', 'OOP trong DSA: classes, objects, inheritance.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 2, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444453', '7cadc65f-69c0-41d4-88e5-e4dc940e8664', 'Error Handling', 'Xử lý lỗi trong các thuật toán.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 3, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444454', '7cadc65f-69c0-41d4-88e5-e4dc940e8664', 'Asynchronous Programming', 'Lập trình bất đồng bộ trong DSA.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 4, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444455', '7cadc65f-69c0-41d4-88e5-e4dc940e8664', 'Design Patterns', 'Các design patterns trong DSA.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 5, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27');

-- Lessons for Course 4: DSA - Chapter 3: Dự án thực tế 1
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a4444444-4444-4444-8444-444444444461', '5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e', 'Phân tích yêu cầu dự án', 'Phân tích và lập kế hoạch cho dự án DSA.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 1, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444462', '5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e', 'Thiết kế database', 'Thiết kế cấu trúc dữ liệu cho dự án.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1500, 2, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444463', '5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e', 'Thiết kế giao diện', 'Thiết kế UI cho ứng dụng DSA.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 3, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444464', '5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e', 'Xây dựng tính năng Authentication', 'Xây dựng hệ thống xác thực.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1800, 4, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444465', '5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e', 'Xây dựng tính năng chính', 'Phát triển các tính năng core với DSA.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 2400, 5, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444466', '5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e', 'Testing và Debugging', 'Kiểm thử và debug các thuật toán.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 6, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444467', '5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e', 'Tối ưu và hoàn thiện', 'Tối ưu thuật toán và hoàn thiện dự án.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1800, 7, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444468', '5b8a6cd1-54cb-4e34-9e60-90d67cd0ac0e', 'Deploy lên production', 'Triển khai ứng dụng DSA lên production.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 8, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27');

-- Lessons for Course 4: DSA - Chapter 4: Kiến thức nâng cao
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a4444444-4444-4444-8444-444444444471', '98165aa9-8806-49dd-ab80-3f56766bc299', 'Performance Optimization', 'Tối ưu hiệu suất các thuật toán.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 1, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444472', '98165aa9-8806-49dd-ab80-3f56766bc299', 'Caching Strategies', 'Các chiến lược caching trong DSA.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 2, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444473', '98165aa9-8806-49dd-ab80-3f56766bc299', 'Security Best Practices', 'Bảo mật trong các thuật toán.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1500, 3, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444474', '98165aa9-8806-49dd-ab80-3f56766bc299', 'Testing Strategies', 'Chiến lược testing cho DSA.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1800, 4, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444475', '98165aa9-8806-49dd-ab80-3f56766bc299', 'Code Review và Refactoring', 'Code review và refactoring các thuật toán.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 5, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27'),
('a4444444-4444-4444-8444-444444444476', '98165aa9-8806-49dd-ab80-3f56766bc299', 'Quiz tổng hợp', 'Bài quiz tổng hợp kiến thức DSA.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 600, 6, false, true, '2025-10-13 03:41:27', '2025-10-13 03:41:27');

-- Lessons for Course 5: JavaScript Cơ Bản - Chapter 1: JavaScript Fundamentals
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a5555555-5555-5555-8555-555555555551', 'c1b2c3d4-0005-4000-8000-000000000001', 'Giới thiệu JavaScript', 'JavaScript là gì, history, cách sử dụng.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 900, 1, true, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555552', 'c1b2c3d4-0005-4000-8000-000000000001', 'Setup Environment', 'Cài đặt text editor, browser console, Node.js.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555553', 'c1b2c3d4-0005-4000-8000-000000000001', 'First JavaScript Program', 'Console.log, alert, document.write.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555554', 'c1b2c3d4-0005-4000-8000-000000000001', 'Comments & Best Practices', 'Single-line, multi-line comments, code style.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 600, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555555', 'c1b2c3d4-0005-4000-8000-000000000001', 'Debugging Basics', 'Using browser DevTools, debugging techniques.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555556', 'c1b2c3d4-0005-4000-8000-000000000001', 'JavaScript Execution', 'Hoisting, temporal dead zone, execution context.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 5: JavaScript Cơ Bản - Chapter 2: Variables & Data Types
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a5555555-5555-5555-8555-555555555561', 'c1b2c3d4-0005-4000-8000-000000000002', 'var vs let vs const', 'Sự khác biệt và khi nào dùng cái nào.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1500, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555562', 'c1b2c3d4-0005-4000-8000-000000000002', 'Numbers', 'Integer, float, operations, isNaN, typeof.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555563', 'c1b2c3d4-0005-4000-8000-000000000002', 'Strings', 'String concatenation, template literals, methods.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555564', 'c1b2c3d4-0005-4000-8000-000000000002', 'Booleans', 'True, false, truthy, falsy values.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 900, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555565', 'c1b2c3d4-0005-4000-8000-000000000002', 'null vs undefined', 'Phân biệt null và undefined.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 900, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555566', 'c1b2c3d4-0005-4000-8000-000000000002', 'Type Coercion', 'Automatic type conversion, explicit conversion.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 5: JavaScript Cơ Bản - Chapter 3: Operators & Control Flow
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a5555555-5555-5555-8555-555555555571', 'c1b2c3d4-0005-4000-8000-000000000003', 'Arithmetic Operators', '+, -, *, /, %, ** operators.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555572', 'c1b2c3d4-0005-4000-8000-000000000003', 'Comparison Operators', '==, ===, !=, !==, <, >, <=, >=.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555573', 'c1b2c3d4-0005-4000-8000-000000000003', 'Logical Operators', '&&, ||, ! operators, short-circuit evaluation.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555574', 'c1b2c3d4-0005-4000-8000-000000000003', 'Assignment Operators', '=, +=, -=, *=, /=.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 900, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555575', 'c1b2c3d4-0005-4000-8000-000000000003', 'if-else Statements', 'Conditional logic, nested if-else.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1500, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555576', 'c1b2c3d4-0005-4000-8000-000000000003', 'Ternary Operator', 'condition ? value1 : value2.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 900, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555577', 'c1b2c3d4-0005-4000-8000-000000000003', 'switch Statement', 'Switch cases, break, default.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 7, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 5: JavaScript Cơ Bản - Chapter 4: Functions
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a5555555-5555-5555-8555-555555555581', 'c1b2c3d4-0005-4000-8000-000000000004', 'Function Declaration', 'Cú pháp khai báo hàm, parameters, return.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555582', 'c1b2c3d4-0005-4000-8000-000000000004', 'Function Expression', 'Anonymous functions, named function expressions.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555583', 'c1b2c3d4-0005-4000-8000-000000000004', 'Arrow Functions', 'Cú pháp arrow function, implicit return.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1500, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555584', 'c1b2c3d4-0005-4000-8000-000000000004', 'Default Parameters', 'Tham số mặc định, rest parameters.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1200, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555585', 'c1b2c3d4-0005-4000-8000-000000000004', 'Scope & this', 'Global, local, function, block scope, this keyword.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43');

-- Lessons for Course 5: JavaScript Cơ Bản - Chapter 5: Arrays
INSERT INTO lessons (id, chapter_id, title, content, video_url, video_duration, sort_order, is_preview, is_published, created_at, updated_at) VALUES
('a5555555-5555-5555-8555-555555555591', 'c1b2c3d4-0005-4000-8000-000000000005', 'Array Basics', 'Tạo array, accessing elements, length property.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 1, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555592', 'c1b2c3d4-0005-4000-8000-000000000005', 'Array Methods - Mutating', 'push, pop, shift, unshift, splice, reverse.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 2, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555593', 'c1b2c3d4-0005-4000-8000-000000000005', 'Array Methods - Iterating', 'forEach, map, filter, reduce.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1800, 3, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555594', 'c1b2c3d4-0005-4000-8000-000000000005', 'Array Methods - Finding', 'find, findIndex, indexOf, includes.', 'https://www.youtube.com/watch?v=cOnqkZ7QtXE', 1200, 4, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555595', 'c1b2c3d4-0005-4000-8000-000000000005', 'Array Methods - Advanced', 'sort, flat, flatMap, some, every.', 'https://www.youtube.com/watch?v=PkZNo7MFNFg', 1500, 5, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43'),
('a5555555-5555-5555-8555-555555555596', 'c1b2c3d4-0005-4000-8000-000000000005', 'Destructuring Arrays', 'Array destructuring, rest elements.', 'https://www.youtube.com/watch?v=DHvZLI7Aq8E', 1200, 6, false, true, '2025-10-24 15:10:43', '2025-10-24 15:10:43')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 6. ENROLLMENTS (Sample enrollments)
-- =====================================================

INSERT INTO enrollments (
    id,
    user_id,
    course_id,
    enrolled_at,
    completed_at,
    progress_percentage,
    last_lesson_id,
    total_watch_time,
    is_active
) VALUES
('346847c9-a6f0-11f0-8077-a036bc320b36', '3d4ada88-a4f1-11f0-8481-a036bc320b36', 'c1111111-1111-1111-1111-111111111111', '2025-10-12 05:18:25', NULL, 23.33, NULL, 0, true),
('9a79765f-b0ab-11f0-9742-a036bc320b36', '2396a721-a1e4-11f0-864b-a036bc320b36', 'c2222222-2222-2222-2222-222222222222', '2025-10-24 14:32:32', NULL, 47.78, NULL, 0, true),
('c15e4d13-a6ef-11f0-8077-a036bc320b36', '2396a721-a1e4-11f0-864b-a036bc320b36', 'c3333333-3333-3333-3333-333333333333', '2025-10-12 05:15:11', NULL, 7.96, NULL, 0, true),
('d543b058-a6ef-11f0-8077-a036bc320b36', '2396a721-a1e4-11f0-864b-a036bc320b36', 'c1111111-1111-1111-1111-111111111111', '2025-10-12 05:15:45', NULL, 21.67, NULL, 0, true),
('f3e036e4-a6ef-11f0-8077-a036bc320b36', '2396a721-a1e4-11f0-864b-a036bc320b36', 'c5555555-5555-5555-5555-555555555555', '2025-10-12 05:16:36', NULL, 0.00, NULL, 0, true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- NOTES FOR SUPABASE
-- =====================================================

/*
IMPORTANT NOTES:

1. UUID FORMAT:
   - PostgreSQL uses UUID type, not CHAR(36)
   - Use gen_random_uuid() or uuid_generate_v4() for new UUIDs
   - Existing UUIDs from MySQL are preserved

2. BOOLEAN VALUES:
   - MySQL: tinyint(1) with 0/1
   - PostgreSQL: boolean with true/false
   - Already converted in this file

3. TIMESTAMPS:
   - MySQL: datetime DEFAULT CURRENT_TIMESTAMP
   - PostgreSQL: timestamp DEFAULT CURRENT_TIMESTAMP
   - Already converted in this file

4. ENUM TYPES:
   - Both MySQL and PostgreSQL support ENUM
   - Values are preserved as-is

5. DECIMAL:
   - Both MySQL and PostgreSQL support DECIMAL
   - Values are preserved as-is

6. FOREIGN KEYS:
   - Ensure tables exist before inserting
   - Order: categories -> users -> courses -> chapters -> enrollments

7. ON CONFLICT:
   - Uses PostgreSQL's ON CONFLICT DO NOTHING/UPDATE
   - Prevents duplicate key errors

8. TRIGGERS:
   - MySQL triggers need to be recreated as PostgreSQL functions/triggers
   - See separate migration file for triggers

9. EXECUTION ORDER:
   - Run this file AFTER creating tables
   - Tables should already exist in Supabase

10. TESTING:
    - Test with a small subset first
    - Verify foreign key constraints
    - Check data types match your schema
*/

