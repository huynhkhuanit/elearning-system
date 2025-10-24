-- ============================================================
-- MARKDOWN CONTENT FOR FREE COURSES LESSONS
-- This provides detailed lesson content in markdown format
-- ============================================================

-- HTML CSS Course - Chapter 1: HTML Fundamentals

UPDATE lessons SET content = '
# HTML Fundamentals

## Giới thiệu HTML

HTML là viết tắt của **HyperText Markup Language**. Đây là ngôn ngữ markup cơ bản được sử dụng để tạo trang web.

### Các đặc điểm chính:
- **Markup Language**: Sử dụng các thẻ (tags) để mô tả nội dung
- **HyperText**: Hỗ trợ siêu liên kết (hyperlinks)
- **Cấu trúc**: Tạo cấu trúc cho trang web

## Lịch sử HTML
- 1989: HTML được tạo bởi Tim Berners-Lee
- 1995: HTML 2.0 - lần đầu tiên được chuẩn hóa
- 2014: HTML5 - phiên bản hiện đại nhất

## Ứng dụng
- Trang web tĩnh
- Email templates
- Progressive Web Apps (PWA)
- Mobile applications
' WHERE id = 'les3-01-01';

UPDATE lessons SET content = '
# Cấu trúc cơ bản của HTML

Mỗi trang HTML bao gồm các phần chính sau:

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <title>Tiêu đề trang</title>
  </head>
  <body>
    <h1>Xin chào</h1>
    <p>Đây là nội dung trang web</p>
  </body>
</html>
```

## Giải thích các phần:

### DOCTYPE
- `<!DOCTYPE html>` - Khai báo phiên bản HTML
- Phải là dòng đầu tiên trong file

### HTML Tag
- `<html>` - Thẻ gốc chứa toàn bộ trang
- `lang="vi"` - Xác định ngôn ngữ

### Head
- Chứa metadata và thông tin về trang
- Không hiển thị trực tiếp trên trang
- Bao gồm: title, meta tags, stylesheets, scripts

### Body
- Chứa nội dung hiển thị trên trang
- Tất cả content người dùng thấy ở đây

## Quy tắc đóng thẻ
- Hầu hết các thẻ phải được đóng: `<p>...</p>`
- Một số thẻ tự đóng: `<br />`, `<img />`, `<input />`
' WHERE id = 'les3-01-02';

UPDATE lessons SET content = '
# Các thẻ Text phổ biến

## Headings (Tiêu đề)

```html
<h1>Heading 1 - Lớn nhất</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 - Nhỏ nhất</h6>
```

**Quy tắc**: Chỉ dùng 1 h1 trên trang để tối ưu SEO

## Paragraph (Đoạn văn)

```html
<p>Đây là một đoạn văn bản. HTML sẽ tự động thêm dòng trống trước và sau paragraph.</p>
```

## Text Formatting

| Thẻ | Mục đích | Ví dụ |
|-----|---------|-------|
| `<strong>` | Văn bản quan trọng (bold) | `<strong>Quan trọng</strong>` |
| `<em>` | Nhấn mạnh (italic) | `<em>Nhấn mạnh</em>` |
| `<mark>` | Highlight văn bản | `<mark>Nổi bật</mark>` |
| `<code>` | Code inline | `<code>var x = 10;</code>` |
| `<small>` | Văn bản nhỏ | `<small>Nhỏ</small>` |
| `<del>` | Văn bản bị xóa | `<del>Xóa</del>` |
| `<ins>` | Văn bản được thêm vào | `<ins>Thêm</ins>` |

## Line Break và Horizontal Rule

```html
<!-- Xuống dòng -->
<br>

<!-- Đường phân cách -->
<hr>
```
' WHERE id = 'les3-01-03';

UPDATE lessons SET content = '
# Links và Navigation

## Tạo Hyperlinks

```html
<!-- Link cơ bản -->
<a href="https://example.com">Click đây</a>

<!-- Link tới trang khác -->
<a href="/about.html">Về chúng tôi</a>

<!-- Link tới phần trên trang -->
<a href="#top">Về đầu trang</a>

<!-- Link với title tooltip -->
<a href="/contact.html" title="Liên hệ chúng tôi">Liên hệ</a>

<!-- Link mở trong tab mới -->
<a href="https://example.com" target="_blank">Mở trong tab mới</a>
```

## Semantic Navigation

```html
<nav>
  <ul>
    <li><a href="/">Trang chủ</a></li>
    <li><a href="/about">Về chúng tôi</a></li>
    <li><a href="/services">Dịch vụ</a></li>
    <li><a href="/contact">Liên hệ</a></li>
  </ul>
</nav>
```

## Best Practices
- ✅ Dùng semantic `<nav>` cho navigation
- ✅ Giữ link text có ý nghĩa
- ✅ Dùng `target="_blank"` khi cần
- ❌ Tránh "Click here" - không thân thiện SEO
- ❌ Tránh lạm dụng links
' WHERE id = 'les3-01-04';

-- JavaScript Cơ Bản Course - Chapter 1

UPDATE lessons SET content = '
# Giới thiệu JavaScript

## JavaScript là gì?

**JavaScript** là một ngôn ngữ lập trình được chạy trực tiếp trên trình duyệt (client-side).

### Lịch sử
- 1995: Được tạo bởi Brendan Eich
- 1997: Được chuẩn hóa thành ECMAScript
- 2015: ES6 (ES2015) - bước nhảy vọt lớn
- Hiện tại: Cập nhật hàng năm

### Đặc điểm
- **Lightweight**: Nhẹ, nhanh chóng
- **Dynamic**: Kiểu dữ liệu động
- **Event-driven**: Phản ứng với sự kiện người dùng
- **Async**: Hỗ trợ các hoạt động không đồng bộ

## Môi trường chạy JavaScript

JavaScript có thể chạy ở:
- 📱 Browser (Chrome, Firefox, Safari)
- 💻 Server (Node.js)
- 🖥️ Desktop Apps (Electron)
- 📲 Mobile Apps (React Native)

## Ứng dụng
- Tương tác người dùng (validation, effects)
- Quản lý DOM
- API calls (fetch data)
- Real-time applications
- Games
' WHERE id = 'les5-01-01';

UPDATE lessons SET content = '
# Setup Environment

## 1. Text Editor / IDE

### VS Code (Recommended)
```bash
# Download từ https://code.visualstudio.com
# Install extensions:
# - ES7+ React/Redux/React-Native snippets
# - JavaScript (ES6) code snippets
# - Prettier
```

### Alternatives
- WebStorm
- Sublime Text
- Atom
- Vim/Neovim

## 2. Browser Console

Mở Developer Tools:
- **Chrome/Edge**: `F12` hoặc `Ctrl+Shift+I`
- **Firefox**: `F12` hoặc `Ctrl+Shift+K`
- **Safari**: `Cmd+Option+I`

Tab **Console** để viết JavaScript trực tiếp

## 3. Node.js (Optional)
```bash
# Download từ https://nodejs.org
# Kiểm tra cài đặt
node --version
npm --version
```

## 4. File HTML cơ bản

Tạo file `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My JavaScript</title>
</head>
<body>
    <h1>Hello JavaScript</h1>
    <script src="script.js"></script>
</body>
</html>
```

Tạo file `script.js`:
```javascript
console.log("Hello World!");
```

## 5. Chạy trên Browser
- Mở `index.html` trong trình duyệt
- Mở DevTools → Console
- Xem output
' WHERE id = 'les5-01-02';

-- C++ Course - Chapter 1

UPDATE lessons SET content = '
# C++ Introduction

## C++ là gì?

**C++** là ngôn ngữ lập trình hệ thống mạnh mẽ kết hợp:
- Hiệu suất cao (Performance)
- Lập trình hướng đối tượng (OOP)
- Quản lý bộ nhớ linh hoạt
- Chuẩn thư viện phong phú (STL)

## Lịch sử C++
- 1985: C++ được tạo bởi Bjarne Stroustrup
- 1998: ISO C++ Standard (C++98)
- 2011: C++11 - bản cập nhật lớn
- 2020: C++20 - phiên bản mới nhất

## Đặc điểm nổi bật
- ⚡ Hiệu suất cực nhanh
- 📦 Thư viện chuẩn (STL)
- 🔒 Lập trình hướng đối tượng
- 🎮 Game development
- 🖥️ System programming

## Ứng dụng thực tế
- Operating Systems
- Game Engines (Unreal, Unity)
- Databases (MySQL, MongoDB)
- Web Browsers (Chrome, Firefox)
- Embedded Systems
- High-performance applications

## Tại sao học C++?
1. Hiểu sâu về lập trình hệ thống
2. Kỹ năng quản lý bộ nhớ
3. Nền tảng cho các ngôn ngữ khác
4. Có nhu cầu cao trong công nghiệp
' WHERE id = 'les2-01-01';

UPDATE lessons SET content = '
# Your First C++ Program

## Hello World Program

Tạo file `hello.cpp`:

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

## Giải thích từng dòng

### Include
```cpp
#include <iostream>
```
- `#include` - Nhập thư viện
- `<iostream>` - Input/Output Stream

### Main Function
```cpp
int main() {
    // Code ở đây
    return 0;
}
```
- `main()` - Điểm bắt đầu chương trình
- `return 0` - Chương trình kết thúc thành công

### Output
```cpp
std::cout << "Hello, World!" << std::endl;
```
- `std::cout` - Output stream
- `<<` - Toán tử chèn dữ liệu
- `std::endl` - Xuống dòng

## Compilation

### Windows (MinGW)
```bash
g++ hello.cpp -o hello.exe
hello.exe
```

### Linux/Mac
```bash
g++ hello.cpp -o hello
./hello
```

### Output
```
Hello, World!
```

## Cấu trúc cơ bản
```cpp
#include <iostream>      // Thư viện
using namespace std;      // Namespace
                           
int main() {              // Main function
    cout << "Text";      // Output
    return 0;             // Kết thúc
}
```
' WHERE id = 'les2-01-03';

-- Update a few more lessons with content
UPDATE lessons SET content = '
# Operators

JavaScript hỗ trợ các loại operators khác nhau:

## Arithmetic Operators
```javascript
10 + 5    // = 15 (Addition)
10 - 5    // = 5 (Subtraction)
10 * 5    // = 50 (Multiplication)
10 / 5    // = 2 (Division)
10 % 3    // = 1 (Modulus)
2 ** 3    // = 8 (Exponentiation)
```

## Comparison Operators
```javascript
10 > 5    // true
10 < 5    // false
10 >= 10  // true
10 <= 5   // false
10 == "10"    // true (loose equality)
10 === "10"   // false (strict equality)
10 !== 5      // true
```

## Logical Operators
```javascript
true && false   // false (AND)
true || false   // true (OR)
!true           // false (NOT)
```

## Assignment Operators
```javascript
x = 5       // = Assignment
x += 3      // x = x + 3
x -= 2      // x = x - 2
x *= 2      // x = x * 2
x /= 2      // x = x / 2
```
' WHERE id = 'les5-03-01';

-- Set published status for all new lessons
UPDATE lessons 
SET is_published = 1, content = COALESCE(content, '')
WHERE id LIKE 'les3-%' OR id LIKE 'les5-%' OR id LIKE 'les2-%';
