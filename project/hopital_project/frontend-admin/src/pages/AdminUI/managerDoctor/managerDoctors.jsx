import { useEffect, useState } from "react";
import styles from "./managerDoctors.module.css";

export default function ManagerDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const doctorsPerPage = 10;

  const [search, setSearch] = useState({
    name: "",
    phone: "",
    id: "",
    cccd: "",
    gender: "",
    position: "",
    specialty: "",
  });

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error("Lỗi fetch Doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = (field, value) => {
    const newSearch = { ...search, [field]: value };
    setSearch(newSearch);

    const filtered = doctors.filter((d) => {
      return (
        (!newSearch.name || d.name.toLowerCase().includes(newSearch.name.toLowerCase())) &&
        (!newSearch.phone || d.phone.toString().includes(newSearch.phone)) &&
        (!newSearch.id || d.id.toString().includes(newSearch.id)) &&
        (!newSearch.cccd || (d.cccd && d.cccd.toLowerCase().includes(newSearch.cccd.toLowerCase()))) &&
        (!newSearch.gender || d.gender.toLowerCase() === newSearch.gender.toLowerCase()) &&
        (!newSearch.position || d.position.toLowerCase().includes(newSearch.position.toLowerCase())) &&
        (!newSearch.specialty || d.specialty.toLowerCase().includes(newSearch.specialty.toLowerCase()))
      );
    });

    setFilteredDoctors(filtered);
    setCurrentPage(0);
  };

  const handleDeleteDoctor = (doctorId) => {
    // TODO: gọi API xóa
    const updatedDoctors = filteredDoctors.filter(d => d.id !== doctorId);
    setFilteredDoctors(updatedDoctors);
  };

  const indexOfFirstDoctor = currentPage * doctorsPerPage;
  const listDoctorsCurrentPage = filteredDoctors.slice(indexOfFirstDoctor, indexOfFirstDoctor + doctorsPerPage);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Danh sách bác sĩ</h2>

      {/* ===== FILTERS ===== */}
      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <select value={search.gender} onChange={(e) => handleSearch("gender", e.target.value)}>
            <option value="">Giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
          <input type="text" placeholder="Tìm theo ID" value={search.id} onChange={(e) => handleSearch("id", e.target.value)} />
          <input type="text" placeholder="Tìm theo tên" value={search.name} onChange={(e) => handleSearch("name", e.target.value)} />
        </div>
        <div className={styles.filterRow}>
          <input type="text" placeholder="Số điện thoại" value={search.phone} onChange={(e) => handleSearch("phone", e.target.value)} />
          <input type="text" placeholder="Vị trí" value={search.position} onChange={(e) => handleSearch("position", e.target.value)} />
          <input type="text" placeholder="Chuyên khoa" value={search.specialty} onChange={(e) => handleSearch("specialty", e.target.value)} />
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className={styles.tableWrapper}>
        <table className={styles.doctorTable}>
          <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th>Tên</th>
              <th>Giới tính</th>
              <th>Địa chỉ</th>
              <th>SĐT</th>
              <th>Vị trí</th>
              <th>Chuyên khoa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {listDoctorsCurrentPage.map((doctor, index) => (
              <tr key={doctor.id}>
                <td>{indexOfFirstDoctor + index + 1}</td>
                <td>{doctor.id}</td>
                <td>{doctor.name}</td>
                <td>{doctor.gender}</td>
                <td>{doctor.address}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.position}</td>
                <td>{doctor.specialty}</td>
                <td>
                  <button className={styles.deleteBtn} onClick={() => handleDeleteDoctor(doctor.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== PAGINATION ===== */}
        <div className={styles.pagination}>
          <button onClick={handlePreviousPage} disabled={currentPage === 0}>&lt;</button>
          <span>Trang {currentPage + 1} / {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage + 1 === totalPages}>&gt;</button>
        </div>
      </div>
    </div>
  );
}
