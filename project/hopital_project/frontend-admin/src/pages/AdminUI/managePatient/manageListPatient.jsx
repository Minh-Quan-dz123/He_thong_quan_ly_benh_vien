import { useEffect, useState } from "react";
import styles from "./manageListPatient.module.css";

export default function ManagerListPatient() {

    // 1 state quản lý danh sách patient
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // page hiện tại
    const patientsPerPage = 10; // tối đa dài 10 dòng

    const [search, setSearch] = useState({
        name: "",
        phone: "",
        id: "",
        cccd: "",
        gender: "",
        departmentId: "",
    });

    //  2 các hàm
    // 2.1 gọi api lấy list patient
    const fetchPatients = async () => {
        try 
        {
        const res = await fetch("/api/patients");
        const data = await res.json();
        setPatients(data); // lưu vào data
        setFilteredPatients(data);
        } 
        catch (err) {
        console.error("Lỗi fetch patients:", err);
        }
    };

    // 2.2 useEffect khi mới render
    useEffect(() => {
        fetchPatients();
    }, []);

    // 2.3 search 
    const handleSearch = (field, value) => {
        const newSearch = { ...search, [field]: value };
        setSearch(newSearch);

        const filtered = patients.filter((p) => {
            return (
                (!newSearch.name || p.name.toLowerCase().includes(newSearch.name.toLowerCase())) &&
                (!newSearch.phone || p.phone.toString().includes(newSearch.phone)) &&
                (!newSearch.id || p.id.toString().includes(newSearch.id)) &&
                (!newSearch.cccd || p.cccd.toString().includes(newSearch.cccd)) &&
                (!newSearch.gender || p.gender.toLowerCase() === newSearch.gender.toLowerCase()) &&
                (!newSearch.departmentId || p.departmentId.toString() === newSearch.departmentId.toString())
            );
        });

        setFilteredPatients(filtered);
        setCurrentPage(0);
    };

  // khu vực chuyển tiếp trang
  const indexOfFirstPatient = currentPage * patientsPerPage;
  const listPatientsCurrentPage = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfFirstPatient + patientsPerPage
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // 2.4 hàm mở trang tiếp
  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) setCurrentPage(currentPage + 1);
  };

  // 2.5 hàm lùi trang
  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={styles.pageContainer}>
        
        {/* 1 header */}
        <h2 className={styles.pageTitle}>Quản lý bệnh nhân</h2>

        {/* 2 khu vực lọc */}
        <div className={styles.searchContainer}>
            {/* 2.1 lọc 1 */}
            <div className={styles.searchRow}>
                <select
                    value={search.gender}
                    onChange={(e) => handleSearch("gender", e.target.value)}
                >
                    <option value="">Giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                </select>
                <input
                    type="text"
                    placeholder="Tìm theo ID"
                    value={search.id}
                    onChange={(e) => handleSearch("id", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tìm theo tên"
                    value={search.name}
                    onChange={(e) => handleSearch("name", e.target.value)}
                />
            </div>

            {/* 2.2 lọc 2*/}
            <div className={styles.searchRow}>
                <input
                    type="number"
                    placeholder="Tìm theo số điện thoại"
                    value={search.phone}
                    onChange={(e) => handleSearch("phone", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Tìm theo CCCD"
                    value={search.cccd}
                    onChange={(e) => handleSearch("cccd", e.target.value)}
                />
                <input
                    type="text"
                    placeholder="ID khoa"
                    value={search.departmentId}
                    onChange={(e) => handleSearch("departmentId", e.target.value)}
                />
            </div>
        </div>

        {/* 3 kết quả*/}
        <div className={styles.tableContainer}>
            {/* 3.1 table */}
            <table className={styles.patientTable}>
                <thead>
                    <tr>
                    <th>STT</th>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Giới tính</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {listPatientsCurrentPage.map((p, idx) => (
                    <tr key={p.id}>
                        <td>{idx + 1 + currentPage*patientsPerPage}</td>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.gender}</td>
                        <td>{p.address}</td>
                        <td>{p.phone}</td>
                        <td>{p.status}</td>
                    </tr>
                    ))}
                    {listPatientsCurrentPage.length === 0 && (
                    <tr>
                        <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
                            Không có bệnh nhân nào
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>

            {/* 3.2 chuyển trang */}
            <div className={styles.pagination}>
            <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                &lt;
            </button>
            <span>
                Trang {currentPage + 1} / {totalPages || 1}
            </span>
            <button onClick={handleNextPage} disabled={currentPage + 1 === totalPages}>
                &gt;
            </button>
            </div>
        </div>
    </div>
  );
}
