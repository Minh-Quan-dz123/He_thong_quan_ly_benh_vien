import { useState } from "react";
import styles from "./createDoctor.module.css";

export default function CreateDoctor() {
  const [doctor, setDoctor] = useState({
    account: "",
    password: "",
    name: "",
    birthDate: "",
    gender: "",
    weight: "",
    height: "",
    cccd: "",
    address: "",
    phone: "",
    email: "",
    specialty: "",
    position: "",
    departmentId: "",
    qualification: "",
    startDate: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setDoctor({ ...doctor, [field]: value });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "name",
      "birthDate",
      "gender",
      "cccd",
      "phone",
      "specialty",
      "position",
      "account",
      "password",
    ];
    for (let field of requiredFields) {
      if (!doctor[field]) {
        alert(`Vui lòng điền: ${field}`);
        return;
      }
    }

    // gọi api tạo doctor
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Tạo bác sĩ thành công!");
      setLoading(false);
    } 
    catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.createDoctor}>
      <h2 className={styles.createDoctor__title}>Thêm bác sĩ mới</h2>

      <div className={styles.createDoctor__form}>
        {/* Thông tin định danh */}
        <div className={styles.createDoctor__section}>
          <h3 className={styles.createDoctor__sectionTitle}>Thông tin định danh</h3>
          <label className={styles.createDoctor__label}>
            Họ và Tên*:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Ngày sinh*:
            <input
              className={styles.createDoctor__input}
              type="date"
              value={doctor.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Giới tính*:
            <select
              className={styles.createDoctor__input}
              value={doctor.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </label>
          <label className={styles.createDoctor__label}>
            Cân nặng:
            <input
              className={styles.createDoctor__input}
              type="number"
              value={doctor.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Chiều cao:
            <input
              className={styles.createDoctor__input}
              type="number"
              value={doctor.height}
              onChange={(e) => handleChange("height", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            CCCD*:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.cccd}
              onChange={(e) => handleChange("cccd", e.target.value)}
            />
          </label>
        </div>

        {/* Thông tin liên lạc */}
        <div className={styles.createDoctor__section}>
          <h3 className={styles.createDoctor__sectionTitle}>Thông tin liên lạc</h3>
          <label className={styles.createDoctor__label}>
            Địa chỉ:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Số điện thoại*:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Email:
            <input
              className={styles.createDoctor__input}
              type="email"
              value={doctor.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </label>
        </div>

        {/* Thông tin nghề nghiệp */}
        <div className={styles.createDoctor__section}>
          <h3 className={styles.createDoctor__sectionTitle}>Thông tin nghề nghiệp</h3>
          <label className={styles.createDoctor__label}>
            Chuyên khoa*:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.specialty}
              onChange={(e) => handleChange("specialty", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Vị trí*:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.position}
              onChange={(e) => handleChange("position", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            ID Khoa:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.departmentId}
              onChange={(e) => handleChange("departmentId", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Chứng chỉ:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.qualification}
              onChange={(e) => handleChange("qualification", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Ngày bắt đầu làm:
            <input
              className={styles.createDoctor__input}
              type="date"
              value={doctor.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Trạng thái:
            <select
              className={styles.createDoctor__input}
              value={doctor.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="On leave">On leave</option>
              <option value="Retired">Retired</option>
            </select>
          </label>
        </div>

        {/* Tài khoản */}
        <div className={styles.createDoctor__section}>
          <h3 className={styles.createDoctor__sectionTitle}>Tài khoản</h3>
          <label className={styles.createDoctor__label}>
            Tài khoản*:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.account}
              onChange={(e) => handleChange("account", e.target.value)}
            />
          </label>
          <label className={styles.createDoctor__label}>
            Mật khẩu*:
            <input
              className={styles.createDoctor__input}
              type="text"
              value={doctor.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </label>
        </div>

        <div className={styles.createDoctor__buttonGroup}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
