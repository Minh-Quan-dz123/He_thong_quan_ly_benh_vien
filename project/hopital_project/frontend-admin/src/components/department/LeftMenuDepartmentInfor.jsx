import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LeftMenuDepartmentInfor.module.css";
import { FiMenu, FiHome } from "react-icons/fi";

// nhận đầu vào là 3 tham số {page đang mở, setActiveTab, dùng hay ko dùng}
export default function LeftMenu({ activeTab, onTabChange, isDepartmentMenu }) {
  
  // 1 khai báo state, biến
  //1.1
  const [open, setOpen] = useState(true); // menu đang mơ (true)

  // 1.2 navigate chuyển hướng về home
  const navigate = useNavigate();

  // nếu prop isDepartmentMenu là false, thì compnent này ko render gì cả
  if (!isDepartmentMenu) return null;

  // 1.3 dnah sách option
  const menuItems = [
    { key: "ManageDepartment", label: "Danh sách khoa" },
    { key: "CreateDepartment", label: "Thêm khoa" },
    { key: "DepartmentDetail", label: "Quản lý thông tin khoa" },
    { key: "ManagePatientOfDepartment", label: "Quản lý bệnh nhân của khoa" },
    { key: "ManageDoctorInDepartment", label: "Quản lý bác sĩ của khoa" },
  ];

  return (
    // 1 ----container----
    <div className={`${styles.container} ${!open ? styles.open : ""}`}>{/* nếu open = true <=> mở => "" */}
      {/* 1.1 button menu */}
      <button
        className={styles.menuToggle}
        onClick={() => setOpen(!open)}// đảo trạng thái khi click
      >
        <FiMenu />
        {open && <span>Menu</span>}
      </button>

      {/* 1.2 button home */}
      <button
        className={styles.homeButton}
        onClick={() => navigate("/HomeAdmin")}
      >
        <FiHome className={styles.homeIcon} />
        {open && <span>Trang chủ</span>}
      </button>

      {/* 1.3 thanh ngang */}
      <div className={styles.divider}></div>

      {/* 1.4 các button lựa chọn*/}
      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`${styles.menuItem} ${activeTab === item.key ? styles.activeMenuItem : ""}`}
            onClick={() => onTabChange(item.key)} // gọi onTabChange để set activeTab
          >
            {open && item.label} {/* nếu mở thì hiển thị tên tab*/}
          </button>
        ))}
      </div>
    </div>
  );
}
