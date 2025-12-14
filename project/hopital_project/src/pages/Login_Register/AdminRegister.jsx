import { useState } from "react";
import {useNavigate} from "react-router-dom"; // cần thiết để chuyển hướng
// nhúng file css
import styles from "./AdminRegister.module.css";

// admin bệnh viện đăng ký tài khoản cho bản thân
// 1 admin điền thông tin vào form đăng ký
// 2 admin gửi form đăng ký
// 3 hệ thống tiến hành tạo tài khoản admin mới
// 4 thông báo kết quả đăng ký (thanh công / thất bại)
// 5 nếu đăng ký thành công, admin có thể đăng nhập vào hệ thống

export default function AdminRegister()
{
    // 1 khai báo trạng thái
    const [formdata, setFormdata] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
    }); // các thông tin cần thiết để đăng ký tài khoản admin mới
    

    // State để hiện thị thông báo kết quả đăng ký
    const [registerStatus, setRegisterStatus] = useState(null); // null | "success" | "error"

    // 2 hàm xử lý khi người dùng thay đổi dữ liệu trong form
    const handleChange = (e) =>
    {
        setFormdata({
            ...formdata, // "..." là copy toàn bộ dữ liệu cũ
            [e.target.name]: e.target.value // chỉ cập nhật trường dữ liệu đang thay đổi
        });
    };

    // 3 hàm xử lý khi người dùng gửi form đăng ký 
    const handleSubmit = async (e) =>
    {
        e.preventDefault(); // chặn hành vi gửi form mặc định của trình duyệt
        console.log("Dữ liệu form đăng ký: ", formdata);

        // 3.1 gọi API để gửi dữ liệu đăng ký tới server
        try{
            const res = await fetch("http://localhost:8080/api/admin/register",{ // tạm thời dùng localhost
                method: "POST",
                headers: {
                    "Content-Type": "application/json",// gửi dữ liệu là JSON
                },
                body: JSON.stringify(formdata), // chuyển đổi dữ liệu form thành JSON
                
            });

            if(!res.ok)// nếu trạng thái trả về ko phải 2xx
            {
                setRegisterStatus("error");
                return;
            }

            // nếu đến đây có nghĩa là đăng ký thành công
            const data = await res.json(); // đọc dữ liệu phản hồi từ server
            console.log("Kết quả đăng ký: ", data);
            setRegisterStatus("success");

        }
        catch(error)
        {
            console.error("Lỗi khi đăng ký tài khoản admin: ", error);
            setRegisterStatus("error");
        }
    };

    // 4 thêm button quay lại trang trước
    const navigate = useNavigate();


    return (
        <div className = {styles.containerAdminRegister}>
            <button  className = {styles.backButton} onClick = {() => navigate(-1)}> ⬅ Back </button>
            <h2 className = {styles.header}>Đăng ký tài khoản admin quản lý bệnh viện</h2>
            <form className = {styles.form} onSubmit = {handleSubmit}> {/* gọi hàm xử lý khi gửi form */}
                <div>
                    <label>Full Name:</label>
                    <input
                        name = "fullName"
                        type = "text"
                        value = {formdata.fullName}// liên kết giá trị với state
                        onChange = {handleChange} // gọi hàm xử lý khi người dùng thay đổi dữ liệu
                        required// bắt buộc phải nhập
                        placeholder = "Nhập họ tên của bạn"
                    />
                </div>
                
                <div>
                    <label>Email:</label>
                    <input
                        name = "email"
                        type = "email"
                        value = {formdata.email}
                        onChange = {handleChange}
                        required
                        placeholder = "Nhập email của bạn"
                    />
                </div>
                
                <div>
                    <label>Password:</label>
                    <input
                        name = "password"
                        type = "password"
                        value = {formdata.password}
                        onChange = {handleChange}
                        required
                        placeholder = "Nhập mật khẩu của bạn"
                    />
                </div>
                
                <div>
                    <label>Phone:</label>
                    <input
                        name = "phone"
                        type = "text"
                        value = {formdata.phone}
                        onChange = {handleChange}
                        required
                        placeholder = "Nhập số điện thoại của bạn"
                    />
                </div>
        
                <button className = {styles.submitButton} type = "submit"> Submit </button>

            </form>
            

        </div>
    )
}