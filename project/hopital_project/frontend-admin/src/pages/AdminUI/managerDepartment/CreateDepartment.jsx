import { useState } from "react";
import styles from "./CreateDepartment.module.css";

export default function CreateDepartment() {

  // 1 khai báo state tạo department mới
  const [departmentName, setDepartmentName] = useState("");
  const [departmentEmail, setDepartmentEmail] = useState("");
  const [departmentPhone, setDepartmentPhone] = useState("");
  const [headDoctorId, setHeadDoctorId] = useState("");
  const [headDoctorName, setHeadDoctorName] = useState("");

  // 1.2 show bảng table doctor để chọn head cho department
  const [showDoctorTable, setShowDoctorTable] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);// thêm load

  // 2 các hàmm

  // 2.1 gọi api lấy danh sách doctor và lưu vào doctorList
  const fetchDoctors = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setDoctorList([
      { id: "001", name: "Nguyen Van A", gender: "Nam", phone: "0123456789", specialty: "Tim mạch" },
      { id: "002", name: "Tran Thi B", gender: "Nữ", phone: "0987654321", specialty: "Thần kinh" },
      { id: "003", name: "Le Van C", gender: "Nam", phone: "0112233445", specialty: "Nhi khoa" },
    ]);
    setLoading(false);
  };

  // 2.2 hàm submit
  const handleSubmit = async () => {
    if (!departmentName || !departmentEmail || !departmentPhone) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // gọi api
    const payload = {
      name: departmentName,
      email: departmentEmail,
      phone: departmentPhone,
      headId: headDoctorId || undefined,
      headName: headDoctorName || undefined,
    };

    try 
    {
      setLoading(true);

      const res = await fetch("http://localhost:3000/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) 
      {
        throw new Error(data.message || "Tạo khoa thất bại");
      }

      alert("Tạo khoa mới thành công!");

    } 
    catch (err) 
    {
      alert(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createDeptWrapper}>
      {/* 1 header */}
      <h2 className={styles.createDeptTitle}>Tạo khoa mới</h2>

      {/* 2 div tạo khoa */}
      <div className={styles.createDeptForm}>
        <label className={styles.createDeptLabel}>
          Tên khoa
          <input
            className={styles.createDeptInput}
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
        </label>

        <label className={styles.createDeptLabel}>
          Email
          <input
            className={styles.createDeptInput}
            type="email"
            value={departmentEmail}
            onChange={(e) => setDepartmentEmail(e.target.value)}
          />
        </label>

        <label className={styles.createDeptLabel}>
          Số điện thoại
          <input
            className={styles.createDeptInput}
            value={departmentPhone}
            onChange={(e) => setDepartmentPhone(e.target.value)}
          />
        </label>

        <label className={styles.createDeptLabel}>
          Trưởng khoa
          <div className={styles.createDeptHeadDoctor}>
            {headDoctorName ? `${headDoctorName} (${headDoctorId})` : "Chưa chọn"}
          </div>
        </label>

        {/* button chọn doctor */}
        <button
          className={styles.createDeptPickBtn}
          onClick={() => {
            fetchDoctors();// khi bấm bọn doctor cái là lấy danh sách
            setShowDoctorTable(true);
          }}
        >
          Chọn bác sĩ trưởng khoa
        </button>
        {/* show doctor table lên */}
        {showDoctorTable && (
          <div className={styles.createDeptDoctorTable}>
            {loading ? (
              <p className={styles.createDeptLoading}>Đang tải...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Giới tính</th>
                    <th>SĐT</th>
                    <th>Chuyên khoa</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorList.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => {
                        setHeadDoctorId(doc.id);
                        setHeadDoctorName(doc.name);
                        setShowDoctorTable(false);
                      }}
                    >
                      <td>{doc.id}</td>
                      <td>{doc.name}</td>
                      <td>{doc.gender}</td>
                      <td>{doc.phone}</td>
                      <td>{doc.specialty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <div className={styles.createDeptActions}>
          <button
            className={styles.createDeptSubmitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}
