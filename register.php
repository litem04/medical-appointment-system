<?php
// register.php

// Kiểm tra xem dữ liệu có được gửi bằng phương thức POST không
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Lấy dữ liệu từ form
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    // --- Xác thực cơ bản phía máy chủ ---
    
    // Kiểm tra xem có trường nào bị bỏ trống không
    if (empty($username) || empty($email) || empty($password)) {
        // Chuyển hướng về trang đăng ký với thông báo lỗi
        header('Location: register.html?status=error&message=Vui lòng điền đầy đủ thông tin.');
        exit;
    }

    // Kiểm tra mật khẩu có khớp không
    if ($password !== $confirm_password) {
        // Chuyển hướng về trang đăng ký với thông báo lỗi
        header('Location: register.html?status=error&message=Mật khẩu không khớp.');
        exit;
    }

    // --- CẢNH BÁO BẢO MẬT RẤT QUAN TRỌNG ---
    // TRONG MỘT ỨNG DỤNG THỰC TẾ, BẠN KHÔNG BAO GIỜ ĐƯỢC LƯU MẬT KHẨU Ở DẠNG VĂN BẢN THƯỜNG.
    // Bạn phải sử dụng hàm password_hash() để mã hóa mật khẩu.
    // $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    // Tôi đang làm theo yêu cầu lưu vào file text, nhưng đây là một rủi ro bảo mật lớn.

    // Tạo nội dung để ghi vào file
    // Định dạng: Tên đăng nhập,Email,Mật khẩu (mỗi tài khoản 1 dòng)
    $file_content = "$username,$email,$password\n";
    $file_name = "Database.text";

    // Ghi dữ liệu vào file (sử dụng FILE_APPEND để nối vào cuối file)
    if (file_put_contents($file_name, $file_content, FILE_APPEND | LOCK_EX) !== false) {
        // Ghi thành công, chuyển hướng về trang đăng ký với thông báo thành công
        header('Location: register.html?status=success');
        exit;
    } else {
        // Ghi thất bại, chuyển hướng về trang đăng ký với thông báo lỗi
        header('Location: register.html?status=error&message=Không thể ghi vào cơ sở dữ liệu.');
        exit;
    }

} else {
    // Nếu ai đó cố truy cập trực tiếp file này, chuyển họ về trang chủ
    header('Location: index.html');
    exit;
}
?>