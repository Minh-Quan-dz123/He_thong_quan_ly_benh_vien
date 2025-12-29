import styles from "./ManageDepartmentList.module.css";

// prop là danh sách departments và chọn id
export default function TableDepartmentsList({ departments, onSelect }) {
  if (!departments || departments.length === 0) {
    return <p>Chưa có khoa nào</p>;
  }

  return (
    <table className={styles.departmentTable}>
      <thead>
        <tr>
          <th>STT</th>
          <th>ID</th>
          <th>Tên khoa</th>
          <th>Trưởng khoa</th>
          <th>Email</th>
          <th>SĐT</th>
        </tr>
      </thead>

      <tbody>
        {departments.map((dept, index) => (
          <tr
            key={dept.id}
            onClick={() => onSelect(dept.id)}
            className={styles.row}
          >
            <td>{index + 1}</td>
            <td>{dept.id}</td>
            <td className={styles.name}>{dept.name}</td>
            <td>{dept.headName || "---"}</td>
            <td>{dept.email}</td>
            <td>{dept.phoneNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
