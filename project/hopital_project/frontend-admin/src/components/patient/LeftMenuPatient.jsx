import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LeftMenuPatient.module.css";
import { FiMenu, FiHome } from "react-icons/fi";

export default function LeftMenuDoctor({ activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { key: "CreatePatient", label: "Thêm bệnh nhân" },
    { key: "ManageListPatient", label: "Quản lý danh sách bệnh nhân" },
  ];

  return (
    <div className={`${styles.container} ${collapsed ? styles.collapsed : ""}`}>
      {/* ===== MENU TOGGLE ===== */}
      <button
        className={styles.menuToggle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FiMenu />
        {!collapsed && <span>Menu</span>}
      </button>

      {/* ===== HOME ===== */}
      <button
        className={styles.homeButton}
        onClick={() => navigate("/HomeAdmin")}
      >
        <FiHome className={styles.homeIcon} />
        {!collapsed && <span>Trang chủ</span>}
      </button>

      <div className={styles.divider}></div>

      {/* ===== DOCTOR MENU ===== */}
      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`${styles.menuItem} ${
              activeTab === item.key ? styles.activeMenuItem : ""
            }`}
            onClick={() => onTabChange(item.key)}
          >
            {!collapsed && item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
