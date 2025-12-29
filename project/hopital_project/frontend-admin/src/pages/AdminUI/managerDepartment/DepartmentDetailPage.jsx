import { useState, useEffect } from "react";
import styles from "./DepartmentDetailPage.module.css";
import {API} from "../../../config/appConfig";

export default function DepartmentDetailPage({ depId }) {

  // 1 state
  const [searchText, setSearchText] = useState("");// search
  const [loading, setLoading] = useState(false);   // loading
  const [department, setDepartment] = useState(null); // data
  const [editDepartment, setEditDepartment] = useState(null); // edit
  const [suggestions, setSuggestions] = useState([]); // gợi ý

  const [showDoctorTable, setShowDoctorTable] = useState(false); // có show ra table hay ko
  const [doctorList, setDoctorList] = useState([]); // danh sách bác sĩ

  // 2 các hàm

  // 2.1 lấy danh sách department hiện có (department manager lưu trong cache)
  const fetchById = async (id) => {
    if (!id) return;

    setLoading(true);
    setDepartment(null);
    setEditDepartment(null);

    try {
      const raw = localStorage.getItem("departmentsCache");
      if (!raw) return;

      const list = JSON.parse(raw);
      const found = list.find((d) => String(d.id) === String(id));

      // nếu tìm thấy
      if (found) {
        const normalized = {
          id: found.id,
          name: found.name || "",
          email: found.email || "",
          phone: found.phoneNumber || "",
          head_id: found.headId || "",
          head_name: found.headName || "",
          doctorCount: found.doctorCount ?? 0,
          patientCount: found.patientCount ?? 0,
        };

        setDepartment(normalized);
        setEditDepartment(normalized);
        setSearchText(found.name || "");
      }
    } 
    catch (err) {
      console.error("Fetch department error:", err);
    } 
    finally {
      setLoading(false);
    }
  };

  // 2.2 cập nhật gợi ý theo text từ input
  const handleSearchInput = (text) => {
    setSearchText(text);

    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    const raw = localStorage.getItem("departmentsCache");
    if (!raw) return;

    const list = JSON.parse(raw);
    const filtered = list.filter((d) =>
      d.name?.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 3)); // hiển thị đối đa 3 dòng
  };

  // 2.3 set gợi ý
  const handleSelectSuggestion = (dep) => {
    setSuggestions([]);
    fetchById(dep.id);
  };

  // 2.4 xử lý bảng doctor = gọi api
  const handleOpenDoctorTable = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API.DOCTOR}/doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Lấy danh sách bác sĩ thất bại");
      const data = await res.json();

      setDoctorList(data);               // lưu vào state
      localStorage.setItem("doctorsCache", JSON.stringify(data)); // lưu vào cache 

      setShowDoctorTable(true);
    } 
    catch (err) {
      alert(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  // 2.5 xử lý  khi chọn doctor = cập nhật id và name của head
  const handleSelectDoctor = (doctor) => {
    setEditDepartment((prev) => ({
      ...prev,
      head_id: doctor.id,
      head_name: doctor.name,
    }));
    setShowDoctorTable(false);
  };

  // 2.6 gọi api cập nhật thông tin
  const handleConfirm = async () => {
    if (!editDepartment) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lỗi mạng");
      return;
    }

    const payload = {
      name: editDepartment.name,
      email: editDepartment.email,
      phone: editDepartment.phone,
      headId: editDepartment.head_id || null,
      headName: editDepartment.head_name || null,
    };

    try {
      setLoading(true);

      const res = await fetch(
        `${API.ADMIN}/departments/${editDepartment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cập nhật khoa thất bại");

      setDepartment(editDepartment);

      // Update cache
      const raw = localStorage.getItem("departmentsCache");
      if (raw) {
        const list = JSON.parse(raw);
        const newList = list.map((d) =>
          d.id === editDepartment.id
            ? {
                ...d,
                name: payload.name,
                email: payload.email,
                phoneNumber: payload.phone,
                headId: payload.headId,
                headName: payload.headName,
              }
            : d
        );
        localStorage.setItem("departmentsCache", JSON.stringify(newList));
      }

      alert("Cập nhật khoa thành công!");
    } 
    catch (err) {
      alert(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  //2.7 nút back, quay lại bước trước
  const handleBack = () => {
    setEditDepartment(department);// edit = department chính hiện tại
  };

  // 2.8 api gọi hàm xóa
  const handleDelete = async () => {
    if (!editDepartment) return;

    if (!window.confirm("Bạn có chắc chắn muốn xóa khoa này?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lỗi xác thực");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API.ADMIN}/departments/${editDepartment.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xóa khoa thất bại");

      // xóa khỏi cache
      const raw = localStorage.getItem("departmentsCache");
      if (raw) {
        const list = JSON.parse(raw);
        const newList = list.filter((d) => d.id !== editDepartment.id);
        localStorage.setItem("departmentsCache", JSON.stringify(newList));
      }

      setDepartment(null);
      setEditDepartment(null);
      setSearchText("");
      setSuggestions([]);

      alert("Xóa khoa thành công!");
    } 
    catch (err) {
      alert(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  // vừa vào đã tìm theo id nếu có
  useEffect(() => {
    if (depId) fetchById(depId);
  }, [depId]);

  return (
    <div className={styles.department_container}>
      {/* 1 phần header */}
      <div className={styles.department_header}>
        {/* 1.1 header */}
        <h3>Chi tiết khoa</h3>

        {/* 1.2 search */}
        <div className={styles.department_searchBox}>
          {/* 1.2.1 thanh tìmkieems */}
          <input
            placeholder="Tìm khoa theo tên"
            value={searchText}
            onChange={(e) => handleSearchInput(e.target.value)}
          />

          {/* 1.2.2 gợi ý */}
          {suggestions.length > 0 && (
            <div className={styles.department_suggestions}>
              {suggestions.map((dep) => (
                <div
                  key={dep.id}
                  className={styles.department_suggestionItem}
                  onClick={() => handleSelectSuggestion(dep)}
                >
                  {dep.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2 loading */}
      {loading && <p>Loading...</p>}

      {/* 2 loading */}
      {!loading && editDepartment && (
        <>
          {/* 2 kết quả sau loading */}
          <div className={styles.department_card}>

            {/* 2.1 kết quả */}
            <div className={styles.department_grid}>
              <div>
                <label>ID khoa</label>
                <input value={editDepartment.id} disabled />
              </div>
              <div>
                <label>Tên khoa</label>
                <input
                  value={editDepartment.name}
                  onChange={(e) =>
                    setEditDepartment({ ...editDepartment, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  value={editDepartment.email}
                  onChange={(e) =>
                    setEditDepartment({ ...editDepartment, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Số điện thoại</label>
                <input
                  value={editDepartment.phone}
                  onChange={(e) =>
                    setEditDepartment({ ...editDepartment, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className={styles.department_card}>
            <div className={styles.department_headRow}>
              <div>
                <strong>{editDepartment.head_name || "Chưa cập nhật"}</strong>
                <p>ID: {editDepartment.head_id || "---"}</p>
              </div>
              <button
                className={styles.department_primaryBtn}
                onClick={handleOpenDoctorTable}
              >
                Chọn bác sĩ
              </button>
            </div>

            {showDoctorTable && (
              <table className={styles.department_table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Chuyên khoa</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorList.map((doc) => (
                    <tr key={doc.id} onClick={() => handleSelectDoctor(doc)}>
                      <td>{doc.id}</td>
                      <td>{doc.name}</td>
                      <td>{doc.specialty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className={styles.department_stats}>
            <div>
              <span>Số bác sĩ</span>
              <strong>{editDepartment.doctorCount}</strong>
            </div>
            <div>
              <span>Số bệnh nhân</span>
              <strong>{editDepartment.patientCount}</strong>
            </div>
          </div>

          <div className={styles.department_actions}>
            <button
              className={styles.department_primaryBtn}
              onClick={handleConfirm}
            >
              Lưu
            </button>
            <button
              className={styles.department_secondaryBtn}
              onClick={handleBack}
            >
              Hoàn tác
            </button>
            <button
              className={styles.department_dangerBtn}
              onClick={handleDelete}
            >
              Xóa
            </button>
          </div>
        </>
      )}
    </div>
  );
}
