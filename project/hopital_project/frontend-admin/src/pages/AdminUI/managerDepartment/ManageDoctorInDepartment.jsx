import { useState } from "react";
import styles from "./ManageDoctorInDepartment.module.css";

export default function ManageDoctorInDepartment() {
  // 1 khai báo state
  // 1.1 doctor
  const [doctors, setDoctors] = useState([]);
  const [departmentIdInput, setDepartmentIdInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 1.2 state trang
  const [indexCurrentPage, setIndexCurrentPage] = useState(0);
  const doctorsPerPage = 10;

  // 1.3 tìm kiếm theo...
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [searchPosition, setSearchPosition] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  // 2 các hàm
  // 2.1 lọc doctor
  const filteredDoctors = doctors.filter((doctor) => {
    return (
      doctor.id.toString().includes(searchId) &&
      doctor.name.toLowerCase().includes(searchName.toLowerCase()) &&
      doctor.phone.toString().includes(searchPhone) &&
      doctor.position.toLowerCase().includes(searchPosition.toLowerCase()) &&
      (searchGender === "" || doctor.gender === searchGender)
    );
  });

  // 2.2 gọi api lấy danh sách doctor
  const fetchDoctors = async () => {
    if (!departmentIdInput.trim()) {
      alert("Hãy nhập ID khoa");
      return;
    }

    setLoading(true);
    setIndexCurrentPage(0);

    // gọi api
    try {
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2.3 quản lý trang
  const indexOfFirst = indexCurrentPage*doctorsPerPage;
  const listDoctorsCurrentPage = filteredDoctors.slice(
    indexOfFirst,
    indexOfFirst + doctorsPerPage
  );

  const totalPages = Math.ceil(filteredDoctors.length/doctorsPerPage);

  // 2.3.1 sang trang
  const handleNextPage = () => {
    if (indexCurrentPage+1<totalPages) setIndexCurrentPage(indexCurrentPage + 1);
  };
  // 2.3.1 lùi trang
  const handlePreviousPage = () => {
    if (indexCurrentPage > 0) setIndexCurrentPage(indexCurrentPage - 1);
  };

  // 2.4 api xóa doctor khỏi department
  const handleDeleteDoctor = (id) => {
    console.log("Delete doctor:", id);
  };

  return (
    <div className={styles.manageDoctorDept}>
      {/* header */}
      <div className={styles.manageDoctorDept__header}>
        <h3 className={styles.manageDoctorDept__title}>Quản lý danh sách bác sĩ</h3>
        <div className={styles.manageDoctorDept__departmentSearch}>
          <input
            placeholder="Nhập ID khoa"
            value={departmentIdInput}
            onChange={(e) => setDepartmentIdInput(e.target.value)}
          />
          <button onClick={fetchDoctors}>Xác nhận</button>
        </div>
      </div>

      {/* lọc */}
      <div className={styles.manageDoctorDept__filters}>
        <select value={searchGender} onChange={(e) => setSearchGender(e.target.value)}>
          <option value="">Giới tính</option>
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
        </select>
        <input placeholder="ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <input placeholder="Tên" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <input placeholder="SĐT" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} />
        <input placeholder="Vị trí" value={searchPosition} onChange={(e) => setSearchPosition(e.target.value)} />
      </div>

      {/* table */}
      {loading ? (
        <p className={styles.manageDoctorDept__status}>Đang tải danh sách bác sĩ...</p>
      ) : (
        <div className={styles.manageDoctorDept__tableCard}>
          <table className={styles.manageDoctorDept__table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>ID</th>
                <th>Tên</th>
                <th>Giới tính</th>
                <th>Địa chỉ</th>
                <th>SĐT</th>
                <th>Vị trí</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {listDoctorsCurrentPage.map((doctor, index) => (
                <tr key={doctor.id}>
                  <td>{index + 1}</td>
                  <td>{doctor.id}</td>
                  <td className={styles.manageDoctorDept__name}>{doctor.name}</td>
                  <td>{doctor.gender}</td>
                  <td>{doctor.address}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.position}</td>
                  <td>
                    <button
                      className={styles.manageDoctorDept__deleteBtn}
                      onClick={() => handleDeleteDoctor(doctor.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* chỗ sang trang */}
          {totalPages > 1 && (
            <div className={styles.manageDoctorDept__pagination}>
              <button onClick={handlePreviousPage} disabled={indexCurrentPage === 0}>
                &lt;
              </button>
              <span>
                Trang {indexCurrentPage + 1} / {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={indexCurrentPage + 1 === totalPages}>
                &gt;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
