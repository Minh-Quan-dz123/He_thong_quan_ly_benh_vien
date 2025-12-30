import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomeAdmin.module.css";
import { FaUserCircle } from "react-icons/fa";
import  {jwtDecode}  from "jwt-decode";

// Components
import ProfilePage from "../../components/trang _chu/ProfilePage";
import Dashboard from "../../components/trang _chu/Dashboard";

export default function HomeAdmin() {
    const navigate = useNavigate();

    // token admin
    // 1️⃣ State quản lý admin
    const [adminData, setAdminData] = useState(() => {
        const token = localStorage.getItem("token");
        return token ? jwtDecode(token) : null;
    });

    // states
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const [showMenuSidebar, setShowMenuSidebar] = useState(false);
    const [currentContent, setCurrentContent] = useState("dashboard"); // dashboard / profile
    const [activeMenuItem, setActiveMenuItem] = useState("");

    const menuItems = [
        { name: "Quản lý khoa", path: "DepartmentPage" },
        { name: "Quản lý bác sĩ", path: "DoctorPage" },
        { name: "Quản lý bệnh nhân", path: "PatientPage" },
       // { name: "Quản lý lịch hẹn", path: "ManageAppointment" },
        { name: "Quản lý thông báo", path: "Notification" }
    ];
    // menu click
    const handleMenuClick = (item) => {
        setActiveMenuItem(item.name);
        setShowMenuSidebar(false);
        navigate(`/HomeAdmin/${item.path}`);
    };

    // profile
    const openProfile = () => {
        setCurrentContent("profile");
        setShowAccountPopup(false);
    };
    const closeProfile = () => {
        setCurrentContent("dashboard");
    };

    // logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // nếu token hết thì tự thoát ra
    useEffect(() => {
        if (!adminData) {
            navigate("/login");
        }
    }, [adminData, navigate]);

    return (
        <div className={styles.rootHomeAdmin}>
            {/* ---------------- Topbar ---------------- */}
            <div className={styles.topBar}>
                {/* Left: Menu */}
                <div className={styles.topLeft}>
                    <button onClick={() => setShowMenuSidebar(!showMenuSidebar)}>
                        Menu
                    </button>
                </div>

                {/* Center: Web name */}
                <div className={styles.topCenter}>
                    <h2>MediHealth</h2>
                </div>

                {/* Right: Account */}
                <div className={styles.topRight}>
                    <button
                        onClick={() => setShowAccountPopup(!showAccountPopup)}
                        className={styles.accountButton}
                    >
                        <FaUserCircle size={26} />
                        <span>{adminData?.fullName}</span>
                    </button>
                    {showAccountPopup && (
                        <div className={styles.accountPopup}>
                            <p>{adminData?.fullName || "Unknown"}</p>
                            <p>{adminData?.email || "No email"}</p>
                            <button onClick={openProfile}>Hồ sơ</button>
                            <button onClick={handleLogout}>Đăng xuất</button>
                        </div>
                    )}
                </div>
            </div>

            {/* ---------------- Sidebar ---------------- */}
            {showMenuSidebar && (
                <div className={styles.menuSidebar}>
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            className={`${styles.menuSidebarItem} ${activeMenuItem === item.name ? styles.activeMenuItem : ""}`}
                            onClick={() => handleMenuClick(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            )}

            {/* ---------------- Main Content ---------------- */}
            <div className={styles.mainContent}>
                {currentContent === "dashboard" && <Dashboard />}
                {currentContent === "profile" && (
                    <ProfilePage
                        admin={adminData}
                        onBack={closeProfile}
                        onUpdateAdmin={(updatedAdmin) => setAdminData(updatedAdmin)} // callback
                    />
                )}
            </div>
        </div>
    );
}
