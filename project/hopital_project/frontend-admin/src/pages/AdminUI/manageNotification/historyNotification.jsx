import { useEffect, useState } from "react";
import styles from "./HistoryNotification.module.css";

export default function HistoryNotification() {

    // 1 khai báo state
    const [notifications, setNotifications] = useState([]);
    const [search, setSearch] = useState({ // state tìm kiếm
        type: "",
        receiverName: "",
        role: ""
    });

    // 2 lấy danh sách notifications từ server
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/notifications");
                if (!res.ok) throw new Error("Fetch failed");
                const data = await res.json();
                setNotifications(data);
            } 
            catch (err) 
            {
                console.error(err);
            }
        };
        fetchNotifications();
    }, []);

    // 3 các hàm
    // 3.1 Search/filter notifications theo các trường dữ liệu
    const handleSearch = (field, value) => {
        setSearch({ ...search, [field]: value });
    };

    // 3.2 lọc thông báo dựa trên tìm kiếm
    const filteredNotifications = notifications.filter((n) => {
        return (
        (!search.type || n.type.toLowerCase().includes(search.type.toLowerCase())) &&
        (!search.receiverName || n.receiverName.toLowerCase().includes(search.receiverName.toLowerCase())) &&
        (!search.role || n.role.toLowerCase() === search.role.toLowerCase())
        );
    });

    return (
        <div className={styles.container}>
            {/* 1 div chứa header */}
            <div className={styles.header}>
                <h2 className={styles.title}>Lịch sử thông báo</h2>
            </div>

            {/* 2  div chứa tìm kiếm + table */}
            <div className={styles.searchPanel}>
                {/* 2.1 lọc */}
                <input
                type="text"
                placeholder="Tìm theo loại thông báo"
                value={search.type}
                onChange={(e) => handleSearch("type", e.target.value)}
                />
                <input
                type="text"
                placeholder="Tìm theo tên người nhận"
                value={search.receiverName}
                onChange={(e) => handleSearch("receiverName", e.target.value)}
                />
                <select value={search.role} onChange={(e) => handleSearch("role", e.target.value)}>
                <option value="">Tất cả</option>
                <option value="doctor">Bác sĩ</option>
                <option value="patient">Bệnh nhân</option>
                </select>
            </div>

            {/* 2.2 bảng */}
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                        <th>STT</th>
                        <th>Loại thông báo</th>
                        <th>Người nhận</th>
                        <th>Role</th>
                        <th>Thời gian bắt đầu</th>
                        <th>Thời gian kết thúc</th>
                        <th>Nội dung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 2.2.1 nếu bảng rỗng */}
                        {filteredNotifications.length === 0 ? (
                        <tr>
                            <td colSpan="7" className={styles.noData}>Không có thông báo nào</td>
                        </tr>
                        ) : (
                        filteredNotifications.map((n, index) => (
                            <tr key={n.id}>
                            <td>{index + 1}</td>
                            <td>{n.type}</td>
                            <td>{n.receiverName}</td>
                            <td>{n.role}</td>
                            <td>{new Date(n.startTime).toLocaleString()}</td>
                            <td>{new Date(n.endTime).toLocaleString()}</td>
                            <td>{n.content}</td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
