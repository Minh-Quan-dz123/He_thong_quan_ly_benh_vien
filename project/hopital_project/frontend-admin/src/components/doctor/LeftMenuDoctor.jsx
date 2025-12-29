import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LeftMenuDoctor.module.css";
import { FiMenu, FiHome } from "react-icons/fi";

export default function LeftMenuDoctor({ activeTab, onTabChange }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { key: "ManageDoctors", label: "Danh sách bác sĩ" },
    { key: "CreateDoctor", label: "Thêm bác sĩ" },
    { key: "ManageDoctorInfor", label: "Quản lý thông tin bác sĩ" },
  ];

  return (
    // 1 container
    <div className={`${styles.container} ${!open ? styles.open : ""}`}>
      
      {/* 1.1 button menu */}
      <button
        className={styles.menuToggle}
        onClick={() => setOpen(!open)}
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

        {/* 1.3 thanh sang*/}
      <div className={styles.divider}></div>

      {/* 1.4 các button lựa chọn*/}
      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`${styles.menuItem} ${
              activeTab === item.key ? styles.activeMenuItem : ""
            }`}
            onClick={() => onTabChange(item.key)}
          >
            {open && item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
