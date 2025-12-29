import styles from "./Dashboard.module.css";
import { Doughnut, Bar } from "react-chartjs-2"; // import các component chart: Doughnut (bánh) và Bar (cột)
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";

// đăng ký các plugin và elements cho chart

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

export default function Dashboard({ totalPatients = 1, totalDoctors = 1, totalDepartments = 1, patientStatus = [1, 1], patientTrend = [1,1,1,1,1,1,1] }) {

    // 1 khởi tạo data
    // 1.1 chart data cho status
    const patientStatusData = {
        labels: ["Đã nhập viện", "Đã xuất viện"],
        datasets: [
            {
                label: "Bệnh nhân",
                data: patientStatus, // [Admitted, Discharged]
                backgroundColor: ["#2563eb", "#34d399"],
            },
        ],
    };

    // 1.2 đồ thị 
    const patientTrendData = {
        labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
        datasets: [
            {
                label: "Bệnh nhân mới",
                data: patientTrend, // số lượng nhập viện từng ngày
                backgroundColor: "#2563eb",
            },
        ],
    };

    return (
        // 1 bảng gốc
        <div className={styles.dashboardRoot}>
            {/* 1 thẻ  */}
            <div className={styles.cardContainer}>
                <div className={styles.card}>
                    <h3>Bệnh nhân</h3>
                    <p>{totalPatients}</p>
                </div>
                <div className={styles.card}>
                    <h3>Bác sĩ</h3>
                    <p>{totalDoctors}</p>
                </div>
                <div className={styles.card}>
                    <h3>Khoa</h3>
                    <p>{totalDepartments}</p>
                </div>
            </div>

            {/* 2 đồ thị  */}
            <div className={styles.chartsContainer}>
                <div className={styles.chartBox}>
                    <h4>Trạng thái bệnh nhân</h4>
                    <Doughnut data={patientStatusData} />
                </div>
                
                <div className={styles.chartBox}>
                    <h4>Xu hướng bệnh nhân tuần này</h4>
                    <Bar data={patientTrendData} />
                </div>
            </div>
        </div>
    );
}
