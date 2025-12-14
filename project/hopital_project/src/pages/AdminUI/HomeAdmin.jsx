import { useNavigate } from "react-router-dom";
import {useState} from "react"
import styles from "./HomeAdmin.module.css";
import bgHome from "../../assets/backgroundHomeAdmin.jpg";

export default function HomeAdmin()
{
    // Trang chủ giao diện admin sau khi đăng nhập thành công   
    // nhiệm vụ của trang là điều hướng đến các chức năng qua các nút bấm
    const navigate = useNavigate();

    // khi click vào button này thì button đó sáng lên
    const [activeButtonMain, setActiveButtonMain] = useState("Home");
    const [activeButtonLeft, setActiveButtonLeft] = useState("");

    const handleClickButtonMain = (buttonMain) =>{
        setActiveButtonMain(buttonMain);// cập nhật button đang chọn
        // mở sang giao diện 
    }

    const handleClickButtonLeftMenu = (buttonLeft) =>{
        setActiveButtonLeft(buttonLeft);
        //"Department", "Doctor", "Patient", "Appointment", "Notification"
        if(buttonLeft === "Department") navigate("/HomeAdmin/ManagerDepartment");
        if(buttonLeft == "Doctor") navigate("/HomeAdmin/ManageDoctors");
        if(buttonLeft == "Patient") navigate("/HomeAdmin/ManageListPatient");
        if(buttonLeft == "Notification") navigate("/HomeAdmin/CreateNotification");
    }

    // button ☰ 
    const [buttonHiden, setButtonHiden] = useState(false)
    const handleClickButtonHiden = () =>{
        if(buttonHiden == false) // đang đóng
        {
            setButtonHiden(true);// mở
        }
        else setButtonHiden(false);
    }


    return (
        <div className ={styles.rootHomeAdmin}>

            {/* Menu bên trái với các nút bấm điều hướng đến các chức năng */}
            <div className ={`${styles.rootHomeAdminLevel2} ${buttonHiden === true ? styles.divOpen1: styles.divClose1}`}>

                {/* button để mở left */}
                <button
                    key = "hiden"
                    className={styles.toggleButton}
                    onClick={() => handleClickButtonHiden()}
                >
                    {buttonHiden === false ? ">": "<"}
                </button>

                <div className = {styles.leftMenu}>
                    <h3> Menu </h3>
                    {/* button select*/}
                    {["Department", "Doctor", "Patient", "Appointment", "Notification"].map((buttonLeftIndex) => (
                        <button
                            key = {buttonLeftIndex}
                            className= {activeButtonLeft === buttonLeftIndex? styles.activeButtonLeft: ""}
                            onClick = {() => handleClickButtonLeftMenu(buttonLeftIndex)}
                        > {buttonLeftIndex} </button>
                    ))} 
                </div>
            </div>
            

            {/* nội dung bên phải */}
            <div className = {styles.rightmainContent}>
                <h2>Trang chủ giao diện Admin</h2>
                {/* phần thống kê tổng quan các chức năng */}
                <div className = {styles.rightMenu}>
                    {["Home", "Hopital", "Setting"].map((buttonMainIndex) =>(
                        <button
                            key = {buttonMainIndex}
                            className = {`${styles.buttonRight} ${activeButtonMain === buttonMainIndex ? styles.buttonMainActive: ""}`}
                            onClick = {() => handleClickButtonMain(buttonMainIndex)}
                        > {buttonMainIndex} </button>
                    ))}
                    
                </div>

                {/* phần hiển thị chi tiết(hiện tại hiển thị hình là chính) */}
                <div>   
                    <img className={styles.imageHome} src = {bgHome} alt="Hospital Admin Home" />
                </div>
            </div>
        </div>
    )
}