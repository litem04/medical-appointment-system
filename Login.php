<?php
// KHÔNG ĐỂ BẤT KỲ DẤU CÁCH HAY DÒNG TRỐNG NÀO TRƯỚC THẺ <?php NÀY

// Luôn bắt đầu session ở đầu tệp
session_start();

// --- HIỂN THỊ LỖI ĐỂ GỠ RỐI ---
// Các dòng này sẽ buộc PHP hiển thị lỗi thay vì trang trắng
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// ---------------------------------

// Hàm để chuyển hướng với thông báo lỗi
function redirect_with_error($message) {
    // Thêm exit; ngay sau header để đảm bảo dừng thực thi
    $error_message = urlencode($message);
    header("Location: login.html?status=error&message=$error_message");
    exit;
}

// Chỉ chạy khi người dùng gửi form (POST)
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Lấy dữ liệu từ form
    $submitted_username = trim($_POST['username']);
    $submitted_password = trim($_POST['password']);
    
    // Kiểm tra form có trống không
    if (empty($submitted_username) || empty($submitted_password)) {
        redirect_with_error("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
    }

    $file_name = "Database.text";
    $login_success = false;

    // --- Đọc file Database.text ---

    // Kiểm tra xem file có tồn tại không
    if (!file_exists($file_name)) {
        // Nếu không có file DB, chắc chắn là sai
        redirect_with_error("Tên tài khoản hoặc mật khẩu sai, xin vui lòng đăng nhập lại.");
    }

    // Mở file để đọc
    $file_handle = fopen($file_name, "r");

    if ($file_handle) {
        // Đọc từng dòng của file
        while (($line = fgets($file_handle)) !== false) {
            
            // Bỏ qua các dòng trống
            $trimmed_line = trim($line);
            if (empty($trimmed_line)) {
                continue;
            }

            // Tách dòng thành mảng [username, email, password]
            $user_data = explode(",", $trimmed_line);

            // Đảm bảo dòng dữ liệu có đủ 3 phần
            if (count($user_data) >= 3) {
                $db_username = trim($user_data[0]);
                $db_password = trim($user_data[2]); // Mật khẩu ở vị trí thứ 3 (index 2)

                // So sánh thông tin
                if ($submitted_username === $db_username && $submitted_password === $db_password) {
                    $login_success = true;
                    break; // Tìm thấy, dừng vòng lặp
                }
            }
        }
        fclose($file_handle); // Đóng file
    } else {
        // Lỗi không mở được file
        redirect_with_error("Lỗi hệ thống: Không thể truy cập cơ sở dữ liệu.");
    }

    // --- Xử lý kết quả đăng nhập ---

    if ($login_success) {
        // Đăng nhập thành công!
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $submitted_username;

        // Chuyển hướng về trang đăng nhập với thông báo thành công
        header("Location: login.html?status=success");
        exit;
    } else {
        // Đăng nhập thất bại
        redirect_with_error("Tên tài khoản hoặc mật khẩu sai, xin vui lòng đăng nhập lại.");
    }

} else {
    // Nếu ai đó cố truy cập trực tiếp file này
    header('Location: index.html');
    exit;
}
?>