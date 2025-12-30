import { useState, useEffect } from "react";
import styles from "./managerDoctorInfor.module.css";

export default function EditDoctor() {
  // 1 state
  const [doctorList, setDoctorList] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [doctor, setDoctor] = useState({
    id: "",
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

  // 2 lấy danh sách doctor luôn khi render
  useEffect(() => {
    const fetchDoctors = async () => {
      try 
      {
        const res = await fetch("/api/doctors");
        if (!res.ok) throw new Error("Cannot fetch doctors");
        const data = await res.json();
        setDoctorList(data);
      } 
      catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  // 3 set gợi ý luôn khi searchId , doctor list thay đổi
  useEffect(() => {
    if (!searchId) {
      setSuggestions([]);
      return;
    }
    const filtered = doctorList.filter((d) => d.id.includes(searchId));
    setSuggestions(filtered);
  }, [searchId, doctorList]);

  // 4 hàm set khi chọn doctor
  const handleSelectSuggestion = (selectedDoctor) => {
    setDoctor(selectedDoctor);
    setSearchId(selectedDoctor.id);
    setSuggestions([]); // chọn rồi thì gợi ý = rỗng
  };

  // 6 hàm thay đổi dữ liệu 
  const handleChange = (field, value) => {
    setDoctor({ ...doctor, [field]: value });
  };

  // 7 gọi api cập nhật thông tin doctor
  const handleSubmit = async () => {
    if (!doctor.id) { alert("Chọn bác sĩ trước!"); return; }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Cập nhật thành công!");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 8 gọi api xóa bác sĩ này
  const handleDelete = async () => {
    if (!doctor.id) { alert("Chọn bác sĩ trước!"); return; }
    if (!window.confirm("Bạn có chắc muốn xóa bác sĩ này?")) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Xóa thành công!");
      setDoctor({
        id: "",
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
      setSearchId("");
      setSuggestions([]);
      setLoading(false);
    } 
    catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.editDoctor}>
      <h2 className={styles.editDoctor__title}>Chỉnh sửa bác sĩ</h2>

      {/* 1 search */}
      <div className={styles.editDoctor__search}>
        <input
          className={styles.editDoctor__searchInput}
          type="text"
          placeholder="Nhập ID bác sĩ"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          className={styles.editDoctor__searchBtn}
          onClick={() => {
            const found = doctorList.find(d => d.id === searchId);
            if (found) setDoctor(found);
            else alert("Không tìm thấy bác sĩ");
          }}
        >
          Xác nhận
        </button>

        <div className={styles.editDoctor__suggestions}>
          {suggestions.map(d => (
            <div
              key={d.id}
              className={styles.editDoctor__suggestionItem}
              onClick={() => handleSelectSuggestion(d)}
            >
              {d.id} - {d.name}
            </div>
          ))}
        </div>
      </div>

      {/* 2 form */}
      <div className={styles.editDoctor__form}>
        <div className={styles.editDoctor__section}>
          <h3 className={styles.editDoctor__sectionTitle}>Thông tin định danh</h3>
          <label className={styles.editDoctor__label}>
            Tên*:
            <input
              className={styles.editDoctor__input}
              type="text"
              value={doctor.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            Ngày sinh*:
            <input
              className={styles.editDoctor__input}
              type="date"
              value={doctor.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            Giới tính*:
            <select
              className={styles.editDoctor__input}
              value={doctor.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </label>
          <label className={styles.editDoctor__label}>
            Cân nặng:
            <input
              className={styles.editDoctor__input}
              type="number"
              value={doctor.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            Chiều cao:
            <input
              className={styles.editDoctor__input}
              type="number"
              value={doctor.height}
              onChange={(e) => handleChange("height", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            CCCD*:
            <input
              className={styles.editDoctor__input}
              type="text"
              value={doctor.cccd}
              onChange={(e) => handleChange("cccd", e.target.value)}
            />
          </label>
        </div>

        <div className={styles.editDoctor__section}>
          <h3 className={styles.editDoctor__sectionTitle}>Liên lạc</h3>
          <label className={styles.editDoctor__label}>
            Địa chỉ:
            <input
              className={styles.editDoctor__input}
              type="text"
              value={doctor.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            Số điện thoại*:
            <input
              className={styles.editDoctor__input}
              type="number"
              value={doctor.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            Email:
            <input
              className={styles.editDoctor__input}
              type="email"
              value={doctor.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </label>
        </div>

        <div className={styles.editDoctor__section}>
          <h3 className={styles.editDoctor__sectionTitle}>Nghề nghiệp</h3>
          <label className={styles.editDoctor__label}>
            Chuyên khoa*:
            <input
              className={styles.editDoctor__input}
              type="text"
              value={doctor.specialty}
              onChange={(e) => handleChange("specialty", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            Vị trí*:
            <input
              className={styles.editDoctor__input}
              type="text"
              value={doctor.position}
              onChange={(e) => handleChange("position", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            ID Khoa:
            <input
              className={styles.editDoctor__input}
              type="text"
              value={doctor.departmentId}
              onChange={(e) => handleChange("departmentId", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            Chứng chỉ:
            <input
              className={styles.editDoctor__input}
              type="text"
              value={doctor.qualification}
              onChange={(e) => handleChange("qualification", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            Ngày bắt đầu làm:
            <input
              className={styles.editDoctor__input}
              type="date"
              value={doctor.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </label>
          <label className={styles.editDoctor__label}>
            Trạng thái:
            <select
              className={styles.editDoctor__input}
              value={doctor.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="Active">Đang làm</option>
              <option value="On leave">Đã nghỉ</option>
              <option value="Retired">Nghỉ hưu</option>
            </select>
          </label>
        </div>
      </div>

      <div className={styles.editDoctor__buttonGroup}>
        <button onClick={handleSubmit} disabled={loading}>{loading ? "Updating..." : "Update"}</button>
        <button onClick={handleDelete} disabled={loading}>{loading ? "Deleting..." : "Delete"}</button>
      </div>
    </div>
  );
}
