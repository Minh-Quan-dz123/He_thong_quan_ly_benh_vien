import {useState} from "react";
import {useNavigate} from "react-router-dom"; // cần thiết để chuyển hướng
import styles from "./LoginPage.module.css";

export default function LoginPage()
{
    // 0---new-- thêm token----
    
    // 1 khai báo state
    const [formLogin, setFormLogin] = useState({
        email: "",
        password: "",
        role: "admin", // giá trị mặc định là admin (có doctor, patient và admin)
    });

    // 1.1 state để hiện thị kết quả đăng nhập
    const [loginStatus, setLoginStatus] = useState(null); // null, "success", "error"

    // 1.2 khởi tạo đối tượng navigate
    const navigateLogin = useNavigate(); // khởi tạo đối tượng navigate

    // hàm xử lý khi người dùng thay đổi dữ liệu trong form
    const handleChange = (e) =>
    {
        setFormLogin({
            ...formLogin,
            [e.target.name]: e.target.value, // cập nhật giá trị dữ liệu dựa trên name của input
        });
    };

    // 2 hàm xử lý khi người dùng gửi form đăng nhập
    const handleLogin = async (e) =>
    {
        //2.1
        e.preventDefault(); // ngăn chặn hành vi mặc định của form (tải lại trang)
        console.log("Dữ liệu form đăng nhập: ", formLogin);
        
        try{
            
            const res = await fetch("http://127.0.0.1:3000/auth/login",{
                method: "POST",
                headers: 
                {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formLogin),
            });

            
            if(!res.ok)// nếu trạng thái trả về ko phải 2xx
            {
                // đọc lỗi
                alert("Login failed");
                let errMes = "Đăng nhập thất bại";
                try{
                    const errData = await res.json();
                    errMes = errData.message || errMes;
                }
                catch{}

                setLoginStatus("error");
                console.error("Lỗi đăng nhập:", errData.message);
                return;
            }


            // 2.2 nếu thành công (server trả về token từ auth thì phải lưu)
            setLoginStatus("success");
            // lấy data/ token phản hồi từ server
            const data = await res.json();
            console.log("Kết quả đăng nhập: ", data);
           

            // lưu token vào localStorage để dùng cho các lần gọi API sau
            localStorage.setItem("token", data.access_token);

            // 2.3 chuyển hướng người dùng đến trang giao diện chính của user đó tùy vào admin hay doctor hay patient
            if(formLogin.role == "admin")
            {
                navigateLogin("/HomeAdmin"); // chuyển hướng đến trang dashboard admin
            }
            else if(formLogin.role == "doctor")
            {
                //navigateLogin("/doctor/dashboard"); // chuyển hướng đến trang dashboard doctor
            }  
            else if(formLogin.role == "patient")
            {
                //navigateLogin("/patient/dashboard"); // chuyển hướng đến trang dashboard patient  
            }
        }

        catch(error)
        {
            setLoginStatus("error");
            console.error("Lỗi khi đăng nhập: ", error);
        }
    };


    // 3. hàm xử lý bấm nút đăng ký nếu chưa có tài khoản
    const handleRegisterRedirect = (e) =>
    {
        e.preventDefault();
        // chuyển hướng đến trang đăng ký tài khoản admin
        navigateLogin("/Register");
    }

    // 4. tạo hiệu ứng với button chọn role
    const handleRoleSelect = (role) =>
    {
        setFormLogin({
            ...formLogin,
            role: role,
        });

        console.log("đã chọn: " + role);
    }
    return (
        <div className={styles.Root_LoginPage}>

            {/* Phần chào mừng và đăng nhập */}
            <div className = {styles.welcome_section}>
                <h2 className = {styles.welcome_header}> Chào mừng trở lại với Nhóm 20 Công nghệ Web </h2>
                <p className = {styles.welcome_content}> Hãy truy cập hệ thống cá nhân của bạn</p>
            </div>

            {/* Phần form đăng nhập */}
            <div className = {styles.form_section}>
                <h2>Đăng nhập</h2>
                <p>Vui lòng nhập thông tin của bạn để tiếp tục</p>
                <form className={styles.formLogin} onSubmit = {handleLogin}>
                    <div className = {styles.roleSelection}>

                        {/* nếu đúng thì để nguyên, sai thì gọi hiệu ứng mờ đi */}
                        <button
                            type = "button"
                            className = {formLogin.role === "admin" ? styles.selectedRoleButton : styles.NotSelectedRoleButton}
                            onClick={() => handleRoleSelect("admin")}
                        > Quản trị bệnh viện</button>
                        <button
                            type = "button"
                            className = {formLogin.role === "doctor" ? styles.selectedRoleButton : styles.NotSelectedRoleButton}
                            onClick={() => handleRoleSelect("doctor")}
                        > Bác sĩ </button>
                        <button
                            type = "button"
                            className = {formLogin.role === "patient" ? styles.selectedRoleButton : styles.NotSelectedRoleButton}
                            onClick={() => handleRoleSelect("patient")}
                        > Bệnh nhân </button>
                    </div>
                    
                    <div className = {styles.inputGroup}>
                        <label>Email:</label>
                        <input
                            name = "email"
                            type = "email"
                            value = {formLogin.email}
                            onChange = {handleChange}
                            required
                            placeholder = "Nhập email của bạn"
                        />
                    </div>
                    <div className = {styles.inputGroup}>
                        <label>Mật khẩu:</label>
                        <input
                            name = "password"
                            type = "password"
                            value = {formLogin.password}
                            onChange = {handleChange}
                            required
                            placeholder = "Nhập mật khẩu của bạn"
                        />
                    </div>
                    <button className={styles.forgotPassword} type = "button"> Quên mật khẩu? </button>  {/*------- thêm chức năng này sau ----------*/}
                    <button className={styles.loginButton} type = "submit" > Đăng nhập </button>
                </form>
                <button className={styles.registerButton} onClick = {handleRegisterRedirect}> Chưa có tài khoản? Đăng ký ngay </button>
            </div>
            
        </div>
    )

    
}