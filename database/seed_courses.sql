-- ===================================================
-- Seed Data for Courses and Categories
-- DHV LearnX - Course Database
-- ===================================================

-- Clear existing data (if needed)
-- DELETE FROM enrollments;
-- DELETE FROM courses;
-- DELETE FROM categories;

-- ===================================================
-- Insert Categories (already exists, but ensure data)
-- ===================================================

-- Categories should already exist from main SQL file
-- But we'll insert if not exists

INSERT IGNORE INTO categories (id, name, slug, description, icon_url, sort_order, is_active, created_at) VALUES
('31823a07-9f77-11f0-ad43-a036bc320b36', 'Web Development', 'web-development', 'Learn modern web development', NULL, 0, 1, NOW()),
('31828d8d-9f77-11f0-ad43-a036bc320b36', 'Mobile Development', 'mobile-development', 'Build mobile apps', NULL, 0, 1, NOW()),
('318292e1-9f77-11f0-ad43-a036bc320b36', 'Data Science', 'data-science', 'Data analysis and ML', NULL, 0, 1, NOW()),
('318294a1-9f77-11f0-ad43-a036bc320b36', 'DevOps', 'devops', 'Deployment and infrastructure', NULL, 0, 1, NOW()),
('a1b2c3d4-1234-5678-9abc-def012345678', 'Programming Languages', 'programming-languages', 'Master programming languages', NULL, 0, 1, NOW());

-- ===================================================
-- Insert Instructors (using existing users or create default)
-- ===================================================

-- Get the first admin/instructor user
-- We'll use huynhkhuanit user as the instructor
SET @instructor_id = '2396a721-a1e4-11f0-864b-a036bc320b36';

-- ===================================================
-- Insert 5 Courses: 1 PRO + 4 FREE
-- ===================================================

-- Course 1: JavaScript Advanced (PRO)
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
) VALUES (
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
    @instructor_id,
    '31823a07-9f77-11f0-ad43-a036bc320b36',
    'ADVANCED',
    1399000.00,
    0,
    1,
    2730, -- 45h30p = 2730 minutes
    4.9,
    1250,
    125,
    NOW(),
    NOW()
);

-- Course 2: C++ Programming (FREE)
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
) VALUES (
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
    @instructor_id,
    'a1b2c3d4-1234-5678-9abc-def012345678',
    'BEGINNER',
    0.00,
    1,
    1,
    1965, -- 32h45p = 1965 minutes
    4.8,
    25890,
    98,
    NOW(),
    NOW()
);

-- Course 3: HTML CSS (FREE)
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
) VALUES (
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
    @instructor_id,
    '31823a07-9f77-11f0-ad43-a036bc320b36',
    'BEGINNER',
    0.00,
    1,
    1,
    1700, -- 28h20p = 1700 minutes
    4.9,
    45230,
    87,
    NOW(),
    NOW()
);

-- Course 4: Data Structures & Algorithms (FREE)
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
) VALUES (
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
    @instructor_id,
    'a1b2c3d4-1234-5678-9abc-def012345678',
    'ADVANCED',
    0.00,
    1,
    1,
    2115, -- 35h15p = 2115 minutes
    4.7,
    18950,
    110,
    NOW(),
    NOW()
);

-- Course 5: JavaScript Fundamentals (FREE)
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
) VALUES (
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
    @instructor_id,
    '31823a07-9f77-11f0-ad43-a036bc320b36',
    'BEGINNER',
    0.00,
    1,
    1,
    1110, -- 18h30p = 1110 minutes
    4.8,
    32180,
    75,
    NOW(),
    NOW()
);

-- ===================================================
-- Success Message
-- ===================================================

SELECT 'Courses seeded successfully! Total courses: ' AS message, COUNT(*) AS count FROM courses;
SELECT 'Course details:' AS '';
SELECT 
    title AS 'Course Title',
    CASE 
        WHEN is_free = 1 THEN 'FREE'
        ELSE CONCAT(FORMAT(price, 0), 'đ')
    END AS 'Price',
    level AS 'Level',
    total_students AS 'Students',
    rating AS 'Rating'
FROM courses
ORDER BY 
    CASE WHEN is_free = 0 THEN 0 ELSE 1 END,
    created_at;
