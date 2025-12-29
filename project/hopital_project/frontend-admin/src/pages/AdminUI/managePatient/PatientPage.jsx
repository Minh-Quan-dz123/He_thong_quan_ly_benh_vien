import { useState } from "react";
import styles from "./PatientPage.module.css";
import LeftMenu from "../../../components/patient/LeftMenuPatient.jsx";

// Tabs
import CreatePatient from "./createPatient.jsx";
import ManageListPatient from "./manageListPatient.jsx";


export default function PatientPage() {
    const [activeTab, setActiveTab] = useState("ManageListPatient");

    return (
        <div className={styles.departmentRoot}>
        {/* 1 top bar */}
        <div className={styles.topBar}>
            <div className={styles.topLeft}>
            <h2>MediHealth</h2>
            </div>

            <div className={styles.topCenter}>
            <span>Quản lý bệnh nhân</span>
            </div>

            <div className={styles.topRight} />
        </div>

        {/* 2 body */}
        <div className={styles.body}>
            <LeftMenu
            activeTab={activeTab}
            onTabChange={setActiveTab}
            />

            <div className={styles.content}>
            
            {activeTab === "CreatePatient" && <CreatePatient/>}
            {activeTab === "ManageListPatient" && <ManageListPatient/>}
            </div>
        </div>
        </div>
    );
}
