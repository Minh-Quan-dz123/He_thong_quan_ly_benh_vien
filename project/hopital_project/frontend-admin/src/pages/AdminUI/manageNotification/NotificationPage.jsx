import { useState } from "react";
import styles from "./NotificationPage.module.css";
import LeftMenu from "../../../components/Notification/LeftMenuNotification.jsx";

// Tabs
import CreateNotification from "./createNotification.jsx";
import HistoryNotification from "./historyNotification.jsx"


export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState("CreateNotification");

  return (
    <div className={styles.departmentRoot}>
        {/* 1 div ở trên top */}
        <div className={styles.topBar}>

            {/* 1.1 chứa tên web và trang */}
            <div className={styles.topLeft}>
                <h2>MediHealth</h2>
            </div>

            <div className={styles.topCenter}>
                <span>Quản lý thông báo</span>
            </div>

            {/* 1.2 chưa dùng */}
            <div className={styles.topRight} />
        </div>

      {/* 2 body */}
        <div className={styles.body}>
            <LeftMenu
            activeTab={activeTab}
            onTabChange={setActiveTab}
            />

            {/* 2.2  hiển thị các page con*/}
            <div className={styles.content}> 
                {activeTab === "CreateNotification" && <CreateNotification/>}
                {activeTab === "HistoryNotification" && <HistoryNotification/>}
            </div>
        </div>
    </div>
  );
}
