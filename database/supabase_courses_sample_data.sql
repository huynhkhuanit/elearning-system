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
-- 5. ENROLLMENTS (Sample enrollments)
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

