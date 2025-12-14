import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./LeftMenuDepartmentInfor.module.css";

export default function LeftMenu() {
    const navigate = useNavigate();
    const location = useLocation(); // Lấy URL hiện tại
    const [activeIndex, setActiveIndex] = useState(-1);// vị trí nut được chọn

    // Các nút menu cố định
    const menuItems = [
        { label: "Home", to: "/HomeAdmin" },
        { label: "Department List", to: "/HomeAdmin/ManagerDepartment" },
        { label: "Add Department", to: "/HomeAdmin/CreateDepartment" },
        { label: "Department Information Management", to: "/HomeAdmin/ManagerDepartmentInfor" },
        { label: "Patient Management Department", to: "/HomeAdmin/ManagePatientOfDepartment" },
        { label: "Doctor Management Department", to: "/HomeAdmin/ManageDoctorInDepartment" },
    ];

    // Khi URL thay đổi, set nút active
    useEffect(() => {
        // index của nút hiện tại = index có điều kiện sau
        const currentIndex = menuItems.findIndex(
        (item) => item.to && item.to === location.pathname
        );
        setActiveIndex(currentIndex);

    }, [location.pathname]);

    // Xử lý click nút
    const handleClick = (item, index) => {
        setActiveIndex(index); // highlight nút vừa click
        navigate(item.to); // chuyển trang
    };

  // xử lý khi đóng mở true = đóng, false = mở
    const [buttonClose, setButtonClose] = useState(true);
    const handleClickButtonClose = () =>{
        if(buttonClose == true) // đang đóng
        {
            setButtonClose(false);// mở
        }
        else setButtonClose(true);
    };

  return (
    <div className = {`${styles.container} ${buttonClose === true ? styles.divClose: styles.divOpen}`}>
        <button
            key = "close"
            className = {styles.buttonClose}
            onClick={()=>handleClickButtonClose()}
        >
            {buttonClose === true ? ">":"<"}
        </button>

        <div className={styles.leftMenu}>

            {menuItems.map((item, index) => (
            <button
            key={index}
            className={index === activeIndex ? styles.activeButton : ""}
            onClick={() => handleClick(item, index)}
            >
            {item.label}
            </button>
        ))}
        </div>
    </div>
    
  );
}
