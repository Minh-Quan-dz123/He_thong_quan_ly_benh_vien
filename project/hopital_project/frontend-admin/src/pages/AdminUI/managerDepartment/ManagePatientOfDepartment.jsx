import { useState } from "react";
import styles from "./ManagePatientOfDepartment.module.css";

export default function ManagePatientOfDepartment() {
  // 1. state
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchDeptName, setSearchDeptName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [indexCurrentPage, setIndexCurrentPage] = useState(0);
  const patientsPerPage = 10;

  // cache departments
  const cachedDepartments = JSON.parse(localStorage.getItem("departmentsCache") || "[]");

  // 2. Lọc bệnh nhân theo search
  const filteredPatients = patients.filter((p) => {
    return (
      p.id.toString().includes(searchId) &&
      p.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchGender === "" || p.gender === searchGender)
    );
  });

  // 3. Pagination
  const indexOfFirstPatient = indexCurrentPage*patientsPerPage;
  const listPatientsCurrentPage = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfFirstPatient + patientsPerPage
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handleNextPage = () => {
    if (indexCurrentPage+1<totalPages) setIndexCurrentPage(indexCurrentPage + 1);
  };
  const handlePreviousPage = () => {
    if (indexCurrentPage > 0) setIndexCurrentPage(indexCurrentPage - 1);
  };

  // 4. Chọn khoa từ cache -> lấy danh sách bệnh nhân
  const handleSelectDepartment = async (dept) => {
    setSelectedDepartment(dept);
    setSearchDeptName(dept.name);
    setLoading(true);
    setIndexCurrentPage(0);

    try {
      const res = await fetch(`http://127.0.0.1:3000/departments/${dept.id}/patients`);
      if (!res.ok) throw new Error("Lấy danh sách bệnh nhân thất bại");
      const data = await res.json();
      setPatients(data);
    } 
    catch (err) {
      alert(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  // 5. Xóa bệnh nhân -> truyền departmentId + patientId
  const handleDeletePatient = async (patientId) => {
    if (!selectedDepartment) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa bệnh nhân này khỏi khoa?")) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://127.0.0.1:3000/departments/${selectedDepartment.id}/patients/${patientId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Xóa bệnh nhân thất bại");
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
    } 
    catch (err) {
      alert(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.managePatientDept}>
      <div className={styles.managePatientDept__top}>
        <h2 className={styles.managePatientDept__title}>Quản lý bệnh nhân</h2>
      </div>

      <div className={styles.managePatientDept__bottom}>
        <div className={styles.managePatientDept__right}>
          {/* 1. search khoa theo tên */}
          <div className={styles.managePatientDept__input}>
            <input
              type="text"
              placeholder="🔍 Tìm khoa theo tên"
              value={searchDeptName}
              onChange={(e) => setSearchDeptName(e.target.value)}
            />
            {searchDeptName && (
              <div className={styles.managePatientDept__suggestions}>
                {cachedDepartments
                  .filter((d) => d.name.toLowerCase().includes(searchDeptName.toLowerCase()))
                  .slice(0, 5)
                  .map((dept) => (
                    <div
                      key={dept.id}
                      className={styles.managePatientDept__suggestionItem}
                      onClick={() => handleSelectDepartment(dept)}
                    >
                      {dept.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* 2. lọc */}
          <div className={styles.managePatientDept__filters}>
            <select value={searchGender} onChange={(e) => setSearchGender(e.target.value)}>
              <option value="">Giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
            <input
              type="text"
              placeholder="Tìm theo ID bệnh nhân"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tìm theo tên bệnh nhân"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          {/* 3. Table */}
          {loading && <p className={styles.managePatientDept__status}>Loading...</p>}

          {!loading && selectedDepartment && (
            <div className={styles.managePatientDept__tableCard}>
              <h2>Danh sách bệnh nhân của {selectedDepartment.name}</h2>
              <table className={styles.managePatientDept__table}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>ID bệnh nhân</th>
                    <th>Tên bệnh nhân</th>
                    <th>Giới tính</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {listPatientsCurrentPage.map((p, idx) => (
                    <tr key={p.id}>
                      <td>{idx + 1}</td>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.gender}</td>
                      <td>{p.address}</td>
                      <td>{p.phoneNumber}</td>
                      <td>
                        <button
                          className={styles.managePatientDept__deleteBtn}
                          onClick={() => handleDeletePatient(p.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* chuyển sang */}
              <div className={styles.managePatientDept__pagination}>
                <button onClick={handlePreviousPage} disabled={indexCurrentPage === 0}>
                  &lt;
                </button>
                <span>
                  Trang {indexCurrentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={indexCurrentPage + 1 === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
