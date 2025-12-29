import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom"; // cần thiết để chuyển hướng
import styles from "./LoginPage.module.css";
import { GoogleLogin } from "@react-oauth/google";
import googleLogo from "../../assets/icon/google.png";
import  {jwtDecode}  from "jwt-decode";
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
                body: JSON.stringify({
                    ...formLogin,
                    role: "admin", // cố định admin
                }),
            });

            
            if (!res.ok) 
                {
                let errMes = "Đăng nhập thất bại";
                try {
                    const errData = await res.json();
                    errMes = errData.message || errMes;
                }
                catch {
                    console.error("Lỗi đăng nhập ko được đc json");
                }

                alert(errMes);
                setLoginStatus("error");
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
        }

        catch(error)
        {
            setLoginStatus("error");
            console.error("Lỗi khi đăng nhập: ", error);
        }
    };


    //2.5 đăng nhập bằng google (tạm chưa dùng)
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await fetch("http://127.0.0.1:3000/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: credentialResponse.credential,
                    role: "admin",
                }),
            });

            if (!res.ok) {
                alert("Google login failed");
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.access_token);

            navigateLogin("/HomeAdmin");
        } catch (err) {
            console.error("Google login error:", err);
        }
    };



    // 3. hàm xử lý bấm nút đăng ký nếu chưa có tài khoản
    const handleRegisterRedirect = (e) =>
    {
        e.preventDefault();
        // chuyển hướng đến trang đăng ký tài khoản admin
        navigateLogin("/Register");
    }


    // 4 nếu token còn
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) 
        {
            try 
            {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) 
                {
                    navigateLogin("/HomeAdmin");
                } 
                else 
                {
                    localStorage.removeItem("token"); // token hết hạn → xóa
                }
            } 
            catch {
                localStorage.removeItem("token"); // token invalid → xóa
            }
        }
    }, []);

 
    return (
        <div className={styles.Root_LoginPage}>

            {/* Phần chào mừng và đăng nhập */}
            <div className = {styles.welcome_section}>
                <h2 className = {styles.welcome_header}>Quản lý bệnh viện</h2>
                <p className = {styles.welcome_content}></p>
            </div>


            {/* Phần form đăng nhập */}
            <div className={styles.form_section}>
                <h2 className={styles.tilteMedi}>Đăng nhập MediHealth</h2>
                <p>Hãy điền thông tin của bạn để tiếp tục</p>

                {/* đăng nhập bằng google + facebook: xử lý sau: */}
                <div className={styles.socialLogin}>
                    <button className={styles.googleBtn} disabled>
                        <img src={googleLogo} alt="G" className={styles.iconGoogle} />
                        <span className={styles.text}>Google</span>
                    </button>

                    <button className={styles.facebookBtn} disabled>
                        <span className={styles.icon}>f</span>
                        <span className={styles.text}>Facebook</span>
                    </button>
                </div>

                {/* OR divider */}
                <div className={styles.orDivider}>
                    <span>OR</span>
                </div>


                {/* đăng nhập thường */}
                <form className={styles.formLogin} onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label>Email:</label>
                        <input
                            name="email"
                            type="email"
                            value={formLogin.email}
                            onChange={handleChange}
                            required
                            placeholder="admin@email.com"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Mật khẩu:</label>
                        <input
                            name="password"
                            type="password"
                            value={formLogin.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        className={styles.forgotPassword}
                        type="button">
                        Quên mật khẩu?
                    </button>

                    <button
                        className={styles.loginButton}
                        type="submit">
                        Đăng nhập
                    </button>
                </form>

                <button
                    className={styles.registerButton}
                    onClick={handleRegisterRedirect}
                >
                    Chưa có tài khoản? Đăng ký ngay!
                </button>
            </div>

                        
        </div>
    )

    
}