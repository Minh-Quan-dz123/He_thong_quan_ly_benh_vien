import { useState } from "react";
import styles from "./DepartmentPage.module.css";
import LeftMenu from "../../../components/department/LeftMenuDepartmentInfor";

// Tabs
import ManageDepartment from "./ManageDepartment.jsx";
import CreateDepartment from "./CreateDepartment.jsx";
import DepartmentDetail from "./DepartmentDetailPage.jsx";
import ManagePatientOfDepartment from "./ManagePatientOfDepartment.jsx";
import ManageDoctorInDepartment from "./ManageDoctorInDepartment.jsx";

export default function DepartmentPage() {
  const [activeTab, setActiveTab] = useState("ManageDepartment");
  const [selectedDepId, setSelectedDepId] = useState(null);

  const handleSelectDepartment = (depId) => {
    setSelectedDepId(depId);
    setActiveTab("DepartmentDetail");
  };

  return (
    <div className={styles.departmentPage}>
      {/* ===== TOP BAR ===== */}
      <div className={styles.departmentPage__topBar}>
        <div className={styles.departmentPage__topBarLeft}>
          <h2 className={styles.departmentPage__logo}>MediHealth</h2>
        </div>
        <div className={styles.departmentPage__topBarCenter}>
          <span className={styles.departmentPage__title}>Quản lý khoa</span>
        </div>
        <div className={styles.departmentPage__topBarRight}></div>
      </div>

      {/* ===== BODY ===== */}
      <div className={styles.departmentPage__body}>
        <LeftMenu
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDepartmentMenu={true}
        />

        <div className={styles.departmentPage__content}>
          {activeTab === "ManageDepartment" && (
            <ManageDepartment onSelectDepartment={handleSelectDepartment} />
          )}

          {activeTab === "DepartmentDetail" && (
            <DepartmentDetail depId={selectedDepId} />
          )}

          {activeTab === "CreateDepartment" && <CreateDepartment />}
          {activeTab === "ManagePatientOfDepartment" && (
            <ManagePatientOfDepartment />
          )}
          {activeTab === "ManageDoctorInDepartment" && (
            <ManageDoctorInDepartment />
          )}
        </div>
      </div>
    </div>
  );
}
