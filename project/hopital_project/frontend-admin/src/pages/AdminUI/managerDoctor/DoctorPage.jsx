import { useState } from "react";
import styles from "./DoctorPage.module.css";
import LeftMenu from "../../../components/doctor/LeftMenuDoctor.jsx";

// Tabs
import CreateDoctor from "./createDoctor.jsx";
import ManageDoctorInfor from "./managerDoctorInfor.jsx";
import ManageDoctors from "./managerDoctors.jsx"

export default function DoctorPage() {
  const [activeTab, setActiveTab] = useState("ManageDoctors");

  return (
    <div className={styles.departmentRoot}>
      {/* topbar */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <h2>MediHealth</h2>
        </div>

        <div className={styles.topCenter}>
          <span>Quản lý bác sĩ</span>
        </div>

        <div className={styles.topRight} />
      </div>

      {/* body */}
      <div className={styles.body}>
        <LeftMenu
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className={styles.content}>
          
          {activeTab === "CreateDoctor" && <CreateDoctor />}
          {activeTab === "ManageDoctorInfor" && <ManageDoctorInfor />}
          {activeTab === "ManageDoctors" && <ManageDoctors/>}
        </div>
      </div>
    </div>
  );
}
