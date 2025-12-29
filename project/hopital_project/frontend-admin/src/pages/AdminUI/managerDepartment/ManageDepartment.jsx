import { useState, useEffect } from "react";
import styles from "./ManageDepartment.module.css";
import TableDepartmentsList from "../../../components/department/tableDepartmentList";

export default function ManageDepartment({ onSelectDepartment }) {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      await new Promise((r) => setTimeout(r, 400));

      const res = await fetch("http://127.0.0.1:3000/departments", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không lấy được danh sách khoa");

      const data = await res.json();
      setDepartments(data);
      localStorage.setItem("departmentsCache", JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.manageDepartment}>
      {/* 1 header */}
      <div className={styles.manageDepartment__header}>
        <h3 className={styles.manageDepartment__title}>Danh sách khoa</h3>
        <input
          className={styles.manageDepartment__searchInput}
          placeholder="🔍 Tìm theo tên khoa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 2 content */}
      <div className={styles.manageDepartment__content}>
        {loading && (
          <p className={styles.manageDepartment__status}>Đang tải dữ liệu...</p>
        )}
        {error && <p className={styles.manageDepartment__error}>{error}</p>}

        {!loading && !error && (
          <TableDepartmentsList
            departments={filteredDepartments}
            onSelect={onSelectDepartment}
          />
        )}
      </div>
    </div>
  );
}
