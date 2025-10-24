-- ============================================================
-- FREE COURSES DATA SEEDING SCRIPT
-- Adds detailed chapters and lessons for 3 FREE courses
-- Courses: HTML CSS, JavaScript Cơ Bản, C++ Cơ Bản
-- ============================================================

-- ============================================================
-- CHAPTERS FOR "HTML CSS Cơ Bản Đến Nâng Cao" (c3333333)
-- ============================================================

-- Chapter 1: HTML Fundamentals (Order 1)
INSERT IGNORE INTO `chapters` VALUES 
('ch3-01', 'c3333333-3333-3333-3333-333333333333', 'HTML Fundamentals', 'Học các thẻ HTML cơ bản và tạo trang web đơn giản', 1, 1, NOW(), NOW());

-- Lessons for Chapter 1 HTML Fundamentals
INSERT IGNORE INTO `lessons` VALUES 
('les3-01-01', 'ch3-01', 'Giới thiệu HTML', 'HTML là viết tắt của HyperText Markup Language. Đây là ngôn ngữ markup dùng để tạo trang web.', NULL, NULL, 1, 1, 1, NOW(), NOW()),
('les3-01-02', 'ch3-01', 'Cấu trúc cơ bản của HTML', 'Mỗi trang HTML bao gồm DOCTYPE, html, head, và body tag.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-01-03', 'ch3-01', 'Các thẻ text phổ biến', 'Học các thẻ h1-h6, p, strong, em và các thẻ text khác.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les3-01-04', 'ch3-01', 'Links và Navigation', 'Cách tạo hyperlinks bằng thẻ <a> và tổ chức navigation.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les3-01-05', 'ch3-01', 'Images và Media', 'Chèn hình ảnh, video, audio vào trang web.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les3-01-06', 'ch3-01', 'Lists và Tables', 'Tạo danh sách (ul, ol, li) và bảng dữ liệu (table).', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les3-01-07', 'ch3-01', 'HTML Semantic', 'Sử dụng semantic HTML5 tags: header, nav, main, article, footer...', NULL, NULL, 7, 0, 1, NOW(), NOW());

-- Chapter 2: HTML Forms (Order 2)
INSERT IGNORE INTO `chapters` VALUES 
('ch3-02', 'c3333333-3333-3333-3333-333333333333', 'HTML Forms', 'Tạo và xử lý biểu mẫu trong HTML', 2, 1, NOW(), NOW());

INSERT IGNORE INTO `lessons` VALUES 
('les3-02-01', 'ch3-02', 'Form Elements', 'Giới thiệu form tag và các input types cơ bản.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les3-02-02', 'ch3-02', 'Input Types', 'Text, password, email, number, checkbox, radio, file...', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-02-03', 'ch3-02', 'Form Validation', 'Validation attributes và xử lý form submission.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les3-02-04', 'ch3-02', 'Accessibility trong Forms', 'Label, legend, fieldset và ARIA attributes.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les3-02-05', 'ch3-02', 'Form Best Practices', 'UX tốt cho forms, layout, error handling...', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les3-02-06', 'ch3-02', 'Thực hành: Tạo Contact Form', 'Bài tập: Xây dựng form liên hệ hoàn chỉnh.', NULL, NULL, 6, 0, 1, NOW(), NOW());

-- Chapter 3: CSS Basics (Order 3)
INSERT IGNORE INTO `chapters` VALUES 
('ch3-03', 'c3333333-3333-3333-3333-333333333333', 'CSS Basics', 'CSS cơ bản - tạo kiểu cho HTML', 3, 1, NOW(), NOW());

INSERT IGNORE INTO `lessons` VALUES 
('les3-03-01', 'ch3-03', 'Giới thiệu CSS', 'CSS là viết tắt của Cascading Style Sheets.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les3-03-02', 'ch3-03', 'CSS Selectors', 'Element, class, id, attribute selectors và combinations.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-03-03', 'ch3-03', 'Box Model', 'Content, padding, border, margin - cách tính toán.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les3-03-04', 'ch3-03', 'Colors và Fonts', 'RGB, HEX, HSL colors. Font-family, font-size, font-weight...', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les3-03-05', 'ch3-03', 'Text Styling', 'Text-align, line-height, letter-spacing, text-decoration...', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les3-03-06', 'ch3-03', 'Background và Borders', 'Background-color, background-image, border properties...', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les3-03-07', 'ch3-03', 'Thực hành: Styled Card', 'Bài tập: Tạo card component với CSS.', NULL, NULL, 7, 0, 1, NOW(), NOW());

-- Chapter 4: CSS Layout (Order 4)
INSERT IGNORE INTO `chapters` VALUES 
('ch3-04', 'c3333333-3333-3333-3333-333333333333', 'CSS Layout', 'Flexbox và CSS Grid', 4, 1, NOW(), NOW());

INSERT IGNORE INTO `lessons` VALUES 
('les3-04-01', 'ch3-04', 'Display Properties', 'block, inline, inline-block, none.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les3-04-02', 'ch3-04', 'Positioning', 'static, relative, absolute, fixed, sticky positioning.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-04-03', 'ch3-04', 'Flexbox Basics', 'Flex container, flex items, flex direction, justify-content...', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les3-04-04', 'ch3-04', 'Flexbox Advanced', 'Flex-wrap, align-items, flex-grow, flex-shrink, gap...', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les3-04-05', 'ch3-04', 'CSS Grid Basics', 'Grid container, grid items, rows, columns, gaps.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les3-04-06', 'ch3-04', 'CSS Grid Advanced', 'Grid-template, auto-fit, minmax, grid-auto-flow...', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les3-04-07', 'ch3-04', 'Thực hành: Responsive Layout', 'Bài tập: Tạo layout responsive với Flexbox/Grid.', NULL, NULL, 7, 0, 1, NOW(), NOW());

-- Chapter 5: Responsive Design (Order 5)
INSERT IGNORE INTO `chapters` VALUES 
('ch3-05', 'c3333333-3333-3333-3333-333333333333', 'Responsive Design', 'Mobile-first approach và media queries', 5, 1, NOW(), NOW());

INSERT IGNORE INTO `lessons` VALUES 
('les3-05-01', 'ch3-05', 'Viewport Meta Tag', 'Cấu hình viewport cho responsive design.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les3-05-02', 'ch3-05', 'Media Queries', 'Cú pháp media queries và breakpoints.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-05-03', 'ch3-05', 'Mobile-first Approach', 'Thiết kế cho mobile trước, sau đó scale up.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les3-05-04', 'ch3-05', 'Responsive Images', 'srcset, sizes, picture element, responsive sizing.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les3-05-05', 'ch3-05', 'Responsive Typography', 'Font-size, line-height responsive.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les3-05-06', 'ch3-05', 'Thực hành: Responsive Website', 'Bài tập: Xây dựng trang web responsive.', NULL, NULL, 6, 0, 1, NOW(), NOW());

-- Chapter 6-10: More Advanced Topics
INSERT IGNORE INTO `chapters` VALUES 
('ch3-06', 'c3333333-3333-3333-3333-333333333333', 'CSS Animations', 'Transitions và keyframe animations', 6, 1, NOW(), NOW()),
('ch3-07', 'c3333333-3333-3333-3333-333333333333', 'Modern CSS', 'CSS Variables, calc(), clamp(), aspect-ratio', 7, 1, NOW(), NOW()),
('ch3-08', 'c3333333-3333-3333-3333-333333333333', 'CSS Frameworks', 'Giới thiệu Tailwind CSS', 8, 1, NOW(), NOW()),
('ch3-09', 'c3333333-3333-3333-3333-333333333333', 'Web Accessibility', 'ARIA, Semantic HTML, WCAG guidelines', 9, 1, NOW(), NOW()),
('ch3-10', 'c3333333-3333-3333-3333-333333333333', 'Projects & Performance', 'Build projects, optimize CSS performance', 10, 1, NOW(), NOW());

INSERT IGNORE INTO `lessons` VALUES 
('les3-06-01', 'ch3-06', 'Transitions', 'CSS transitions, timing functions, delays.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les3-06-02', 'ch3-06', 'Transforms', '2D transforms: translate, rotate, scale, skew.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-06-03', 'ch3-06', '3D Transforms', 'Perspective, rotateX, rotateY, rotateZ.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les3-06-04', 'ch3-06', 'Keyframe Animations', 'Tạo animations phức tạp với @keyframes.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les3-06-05', 'ch3-06', 'Animation Properties', 'animation-duration, delay, timing-function, iteration-count...', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les3-06-06', 'ch3-06', 'Thực hành: Animations', 'Bài tập: Tạo các animations đẹp.', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les3-07-01', 'ch3-07', 'CSS Variables', 'Định nghĩa và sử dụng CSS custom properties.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les3-07-02', 'ch3-07', 'calc() Function', 'Tính toán giá trị CSS động.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-07-03', 'ch3-07', 'clamp() Function', 'Responsive sizing với clamp.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les3-07-04', 'ch3-07', 'Grid & Flex Updates', 'CSS Grid subgrid, gap trong Flexbox...', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les3-07-05', 'ch3-07', 'Aspect Ratio', 'aspect-ratio property cho responsive images.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les3-08-01', 'ch3-08', 'Tailwind CSS Basics', 'Giới thiệu Tailwind và utility-first CSS.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les3-08-02', 'ch3-08', 'Tailwind Components', 'Xây dựng components với Tailwind.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-08-03', 'ch3-08', 'Tailwind Configuration', 'Customize Tailwind cho project.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les3-09-01', 'ch3-09', 'Web Accessibility Basics', 'WCAG guidelines, semantic HTML.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les3-09-02', 'ch3-09', 'ARIA Attributes', 'role, aria-label, aria-describedby...', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-09-03', 'ch3-09', 'Keyboard Navigation', 'Tab order, focus management.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les3-10-01', 'ch3-10', 'Portfolio Website Project', 'Xây dựng portfolio site hoàn chỉnh.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les3-10-02', 'ch3-10', 'Performance Optimization', 'Tối ưu CSS, critical CSS, minification.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les3-10-03', 'ch3-10', 'CSS Best Practices', 'BEM, naming conventions, maintainability.', NULL, NULL, 3, 0, 1, NOW(), NOW());

-- ============================================================
-- CHAPTERS FOR "Lập trình JavaScript Cơ Bản" (c5555555)
-- ============================================================

INSERT IGNORE INTO `chapters` VALUES 
('ch5-01', 'c5555555-5555-5555-5555-555555555555', 'JavaScript Fundamentals', 'Cú pháp cơ bản và setup environment', 1, 1, NOW(), NOW()),
('ch5-02', 'c5555555-5555-5555-5555-555555555555', 'Variables & Data Types', 'let, const, var và các kiểu dữ liệu', 2, 1, NOW(), NOW()),
('ch5-03', 'c5555555-5555-5555-5555-555555555555', 'Operators & Control Flow', 'Operators, if-else, switch, loops', 3, 1, NOW(), NOW()),
('ch5-04', 'c5555555-5555-5555-5555-555555555555', 'Functions', 'Function declaration, arrow functions, scope', 4, 1, NOW(), NOW()),
('ch5-05', 'c5555555-5555-5555-5555-555555555555', 'Arrays', 'Array methods, iteration, manipulation', 5, 1, NOW(), NOW()),
('ch5-06', 'c5555555-5555-5555-5555-555555555555', 'Objects', 'Object creation, properties, methods', 6, 1, NOW(), NOW()),
('ch5-07', 'c5555555-5555-5555-5555-555555555555', 'DOM Manipulation', 'Selecting elements, modifying DOM', 7, 1, NOW(), NOW()),
('ch5-08', 'c5555555-5555-5555-5555-555555555555', 'Events', 'Event listeners, event handling, bubbling', 8, 1, NOW(), NOW()),
('ch5-09', 'c5555555-5555-5555-5555-555555555555', 'Async JavaScript', 'Promises, async/await basics', 9, 1, NOW(), NOW()),
('ch5-10', 'c5555555-5555-5555-5555-555555555555', 'Projects & Best Practices', 'Mini projects, debugging, code style', 10, 1, NOW(), NOW());

-- Lessons for Chapter 1-5 (50 lessons total)
INSERT IGNORE INTO `lessons` VALUES 
('les5-01-01', 'ch5-01', 'Giới thiệu JavaScript', 'JavaScript là gì, history, cách sử dụng.', NULL, NULL, 1, 1, 1, NOW(), NOW()),
('les5-01-02', 'ch5-01', 'Setup Environment', 'Cài đặt text editor, browser console, Node.js.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les5-01-03', 'ch5-01', 'First JavaScript Program', 'Console.log, alert, document.write.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les5-01-04', 'ch5-01', 'Comments & Best Practices', 'Single-line, multi-line comments, code style.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les5-01-05', 'ch5-01', 'Debugging Basics', 'Using browser DevTools, debugging techniques.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les5-01-06', 'ch5-01', 'JavaScript Execution', 'Hoisting, temporal dead zone, execution context.', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les5-02-01', 'ch5-02', 'var vs let vs const', 'Sự khác biệt và khi nào dùng cái nào.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les5-02-02', 'ch5-02', 'Numbers', 'Integer, float, operations, isNaN, typeof.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les5-02-03', 'ch5-02', 'Strings', 'String concatenation, template literals, methods.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les5-02-04', 'ch5-02', 'Booleans', 'True, false, truthy, falsy values.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les5-02-05', 'ch5-02', 'null vs undefined', 'Phân biệt null và undefined.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les5-02-06', 'ch5-02', 'Type Coercion', 'Automatic type conversion, explicit conversion.', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les5-03-01', 'ch5-03', 'Arithmetic Operators', '+, -, *, /, %, ** operators.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les5-03-02', 'ch5-03', 'Comparison Operators', '==, ===, !=, !==, <, >, <=, >=.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les5-03-03', 'ch5-03', 'Logical Operators', '&&, ||, ! operators, short-circuit evaluation.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les5-03-04', 'ch5-03', 'Assignment Operators', '=, +=, -=, *=, /=...', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les5-03-05', 'ch5-03', 'if-else Statements', 'Conditional logic, nested if-else.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les5-03-06', 'ch5-03', 'Ternary Operator', 'condition ? value1 : value2.', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les5-03-07', 'ch5-03', 'switch Statement', 'Switch cases, break, default.', NULL, NULL, 7, 0, 1, NOW(), NOW()),
('les5-04-01', 'ch5-04', 'Function Declaration', 'Cú pháp khai báo hàm, parameters, return.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les5-04-02', 'ch5-04', 'Function Expression', 'Anonymous functions, named function expressions.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les5-04-03', 'ch5-04', 'Arrow Functions', 'Cú pháp arrow function, implicit return.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les5-04-04', 'ch5-04', 'Default Parameters', 'Tham số mặc định, rest parameters.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les5-04-05', 'ch5-04', 'Scope & this', 'Global, local, function, block scope, this keyword.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les5-05-01', 'ch5-05', 'Array Basics', 'Tạo array, accessing elements, length property.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les5-05-02', 'ch5-05', 'Array Methods - Mutating', 'push, pop, shift, unshift, splice, reverse.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les5-05-03', 'ch5-05', 'Array Methods - Iterating', 'forEach, map, filter, reduce.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les5-05-04', 'ch5-05', 'Array Methods - Finding', 'find, findIndex, indexOf, includes.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les5-05-05', 'ch5-05', 'Array Methods - Advanced', 'sort, flat, flatMap, some, every.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les5-05-06', 'ch5-05', 'Destructuring Arrays', 'Array destructuring, rest elements.', NULL, NULL, 6, 0, 1, NOW(), NOW());

-- ============================================================
-- CHAPTERS FOR "Lập trình C++ Cơ Bản Đến Nâng Cao" (c2222222)
-- ============================================================

INSERT IGNORE INTO `chapters` VALUES 
('ch2-01', 'c2222222-2222-2222-2222-222222222222', 'C++ Introduction', 'Giới thiệu C++, setup environment', 1, 1, NOW(), NOW()),
('ch2-02', 'c2222222-2222-2222-2222-222222222222', 'Basic Syntax', 'Variables, data types, operators', 2, 1, NOW(), NOW()),
('ch2-03', 'c2222222-2222-2222-2222-222222222222', 'Control Flow', 'if-else, loops, switch statements', 3, 1, NOW(), NOW()),
('ch2-04', 'c2222222-2222-2222-2222-222222222222', 'Functions', 'Function declaration, parameters, recursion', 4, 1, NOW(), NOW()),
('ch2-05', 'c2222222-2222-2222-2222-222222222222', 'Arrays & Pointers', 'Arrays, pointers, memory management', 5, 1, NOW(), NOW()),
('ch2-06', 'c2222222-2222-2222-2222-222222222222', 'Object-Oriented Programming', 'Classes, objects, constructors, destructors', 6, 1, NOW(), NOW()),
('ch2-07', 'c2222222-2222-2222-2222-222222222222', 'Inheritance & Polymorphism', 'Inheritance, virtual functions, overriding', 7, 1, NOW(), NOW()),
('ch2-08', 'c2222222-2222-2222-2222-222222222222', 'STL & Templates', 'Standard Template Library, templates basics', 8, 1, NOW(), NOW()),
('ch2-09', 'c2222222-2222-2222-2222-222222222222', 'File I/O', 'Reading and writing files', 9, 1, NOW(), NOW()),
('ch2-10', 'c2222222-2222-2222-2222-222222222222', 'Projects & Best Practices', 'Real-world projects, coding standards', 10, 1, NOW(), NOW());

INSERT IGNORE INTO `lessons` VALUES 
('les2-01-01', 'ch2-01', 'C++ History & Overview', 'C++ là gì, lịch sử, ứng dụng.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les2-01-02', 'ch2-01', 'Setting up Compiler', 'Cài đặt g++, Code::Blocks, hoặc Visual Studio.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les2-01-03', 'ch2-01', 'Your First Program', 'Hello World program, compiling, running.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les2-01-04', 'ch2-01', 'Includes & Namespaces', '#include, using namespace std.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les2-01-05', 'ch2-01', 'Input & Output', 'cout, cin, basic I/O operations.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les2-01-06', 'ch2-01', 'Comments & Debugging', 'Code comments, debugging basics.', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les2-02-01', 'ch2-02', 'Variables & Constants', 'Declaring variables, const keyword, types.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les2-02-02', 'ch2-02', 'Data Types', 'int, float, double, char, bool, string.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les2-02-03', 'ch2-02', 'Operators', 'Arithmetic, comparison, logical, assignment.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les2-02-04', 'ch2-02', 'Type Casting', 'Implicit, explicit casting, static_cast.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les2-02-05', 'ch2-02', 'String Operations', 'String concatenation, methods, manipulation.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les2-02-06', 'ch2-02', 'Practice: Calculator', 'Mini project: Simple calculator program.', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les2-03-01', 'ch2-03', 'if-else Statements', 'Single if, if-else, nested conditions.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les2-03-02', 'ch2-03', 'switch Statements', 'Switch cases, break, default case.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les2-03-03', 'ch2-03', 'for Loops', 'Traditional for loop, range-based for.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les2-03-04', 'ch2-03', 'while & do-while', 'While loops, do-while loops, break, continue.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les2-03-05', 'ch2-03', 'Nested Loops', 'Loops inside loops, pattern programs.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les2-03-06', 'ch2-03', 'Practice: Loops', 'Bài tập: Tạo các pattern với loops.', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les2-04-01', 'ch2-04', 'Function Basics', 'Function declaration, definition, calling.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les2-04-02', 'ch2-04', 'Parameters & Return', 'Pass by value, return values, return types.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les2-04-03', 'ch2-04', 'Pass by Reference', 'References, pass by reference, modify variables.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les2-04-04', 'ch2-04', 'Function Overloading', 'Multiple functions with same name.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les2-04-05', 'ch2-04', 'Recursion', 'Recursive functions, base case, examples.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les2-04-06', 'ch2-04', 'Practice: Functions', 'Bài tập: Viết và sử dụng functions.', NULL, NULL, 6, 0, 1, NOW(), NOW()),
('les2-05-01', 'ch2-05', 'Array Basics', 'Khai báo array, accessing elements.', NULL, NULL, 1, 0, 1, NOW(), NOW()),
('les2-05-02', 'ch2-05', '2D Arrays', 'Multi-dimensional arrays, matrix operations.', NULL, NULL, 2, 0, 1, NOW(), NOW()),
('les2-05-03', 'ch2-05', 'Pointers', 'Pointer declaration, dereferencing, &, *.', NULL, NULL, 3, 0, 1, NOW(), NOW()),
('les2-05-04', 'ch2-05', 'Dynamic Memory', 'new, delete, memory allocation, deallocation.', NULL, NULL, 4, 0, 1, NOW(), NOW()),
('les2-05-05', 'ch2-05', 'Strings', 'C-style strings, std::string, string methods.', NULL, NULL, 5, 0, 1, NOW(), NOW()),
('les2-05-06', 'ch2-05', 'Practice: Arrays & Pointers', 'Bài tập: Array, pointer operations.', NULL, NULL, 6, 0, 1, NOW(), NOW());

-- ============================================================
-- UPDATE total_lessons in courses table
-- ============================================================

UPDATE `courses` 
SET `total_lessons` = 60 
WHERE `id` IN ('c3333333-3333-3333-3333-333333333333', 'c5555555-5555-5555-5555-555555555555', 'c2222222-2222-2222-2222-222222222222');
