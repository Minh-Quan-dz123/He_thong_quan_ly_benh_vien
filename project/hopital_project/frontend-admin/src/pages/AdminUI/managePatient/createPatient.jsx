import { useState } from "react";
import styles from "./createPatient.module.css";

export default function CreatePatient() {
    // 1 khai báo state
    // 1.1 patient
    const [patient, setPatient] = useState({
        name: "",
        birthDate: "",
        gender: "",
        cccd: "",
        address: "",
        phone: "",
        email: "",
        insuranceNumber: "",
        status: "Active",
        account: "",
        password: ""
    });

    // 1.2 có đang load hay o
    const [loading, setLoading] = useState(false);

    // 2 khai báo hàm

    // 2.1 thay đổi dữ liệu trong patient
    const handleChange = (field, value) => {
        setPatient({ ...patient, [field]: value });
    };

    // 2.2 gọi api tạo patient mới
    const handleSubmit = async () => {
        // các trường bắt buộc
        const requiredFields = ["name", "birthDate", "gender", "cccd", "phone", "account", "password"];

        // kiểm tra
        for (let field of requiredFields) 
        {
            if (!patient[field]) 
            {
                alert(`Vui lòng điền trường bắt buộc: ${field}`);
                return;
            }
        }
    
        // set bằng true và giả lập đợi
        setLoading(true);
        // ======== gọi api ====
        try {
            await new Promise((resolve) => setTimeout(resolve, 500)); // giả lập API
            setLoading(false);
            alert("Tạo bệnh nhân thành công!");
        } 
        catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

  return (
    <div className={styles.pageContainer}>
        {/* 1 header */}
        <div className={styles.header}>
            <h2>Thêm bệnh nhân mới</h2>
        </div>

        {/* 2 form */}
        <div className={styles.formContainer}>
            {/* 2.1 section: Thông tin định danh */}
            <div className={styles.section}>
                {/* 2.1.1 header */}
                <h3>Thông tin định danh</h3>

                {/* 2.1.2 các div nhập dữ liệu */}
                <div className={styles.fieldGroup}>
                    <label>Họ tên*</label>
                    <input type="text" value={patient.name} onChange={(e) => handleChange("name", e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                    <label>Ngày sinh*</label>
                    <input type="date" value={patient.birthDate} onChange={(e) => handleChange("birthDate", e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                    <label>Giới tính*</label>
                    <select value={patient.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                    </select>
                </div>
                <div className={styles.fieldGroup}>
                    <label>CCCD*</label>
                    <input type="text" value={patient.cccd} onChange={(e) => handleChange("cccd", e.target.value)} />
                </div>
            </div>

            {/* 2.2 section: Thông tin liên hệ */}
            <div className={styles.section}>
                <h3>Thông tin liên hệ</h3>
                <div className={styles.fieldGroup}>
                    <label>Địa chỉ</label>
                    <input type="text" value={patient.address} onChange={(e) => handleChange("address", e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                    <label>Số điện thoại*</label>
                    <input type="text" value={patient.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                    <label>Email</label>
                    <input type="email" value={patient.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
            </div>

            {/* 2.3 section: Thông tin khác */}
            <div className={styles.section}>
                <h3>Thông tin khác</h3>
                <div className={styles.fieldGroup}>
                    <label>Số bảo hiểm y tế</label>
                    <input type="text" value={patient.insuranceNumber} onChange={(e) => handleChange("insuranceNumber", e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                    <label>Trạng thái</label>
                    <select value={patient.status} onChange={(e) => handleChange("status", e.target.value)}>
                    <option value="Active">Đang điều trị</option>
                    <option value="Discharge">Đã xuất viện</option>
                    <option value="Deceased">Đã tử vong</option>
                    </select>
                </div>
            </div>

            {/* 2.4 section: Thông tin tài khoản */}
            <div className={styles.section}>
                <h3>Thông tin tài khoản</h3>
                <div className={styles.fieldGroup}>
                    <label>Tài khoản*</label>
                    <input type="text" value={patient.account} onChange={(e) => handleChange("account", e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                    <label>Mật khẩu*</label>
                    <input type="text" value={patient.password} onChange={(e) => handleChange("password", e.target.value)} />
                </div>
            </div>

            {/* 5 nút submit với disabled dựa vào loading */}
            <div className={styles.submitContainer}>
            <button onClick={handleSubmit} disabled={loading}> 
                {loading ? "Đang tạo..." : "Tạo bệnh nhân"}
            </button>
            </div>
        </div>
    </div>
  );
}
