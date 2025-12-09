import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import styles from "./PatientsDetailInfor.module.css";
export default function PatientsDetailInfor()
{
    // component hiển thị thông tin chi tiết của 1 bạc sĩ
    /* gồm
    1 id của bệnh nhân
    2 id của department mà bệnh nhân đang điều trị
    3 id của doctor chịu trách nhiệm điều trị cho bệnh nhân
    4 tài khoản đăng nhập của bệnh nhân
    5 mật khẩu đăng nhập của bệnh nhân

    6 address
    7 email
    8 phone number

    9 name
    10 date of birth
    11 gender
    12 số căn cước công dân
    13 số bảo hiểm y tế
    14 trạng thái đang nằm viện, đã xuất viện, đã chết

    (nếu có)
    15 height
    16 weight
    17 nhóm máu
    18 tiền sử bệnh lý
    19 allergies (dị ứng)
    20 measurements_date (ngày đoạn đoạc chỉ số sinh tố)
    21 examinations_results (kết quả khám chữa bệnh)
    22 exam_date (ngày khám chữa bệnh)
     */

    // 1. lấy id bác sĩ từ tham số URL
    const {patientId} = useParams();
    console.log("Patient ID từ URL: ", patientId);

    // 2. khai báo state để chứa thông tin bác sĩ
    const [patientInfo, setPatientInfo] = useState (null);
    // 2.1 state để theo dõi trạng thái loading
    const [loading, setLoading] = useState(true);
    // 3. hàm gọi API lấy thông tin bệnh nhân từ server
    const fetchPatientInfo = async()=>
    {
        try{
            setLoading (true); // bắt đầu loading
            // giả lập server xử lý 1.5 giây dùng setTimeout
            await new Promise((resolve) => setTimeout (resolve, 1500));
            // gọi API
            const res = await fetch(`http://localhost:8080/api/patients/${patientId}`,{
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // kiểm tra kết quả trả về
            if(!res.ok)
            {
                console.error("Lỗi khi lấy thông tin bệnh nhân");
                setLoading(false);
                return;
            }
            // nếu oke thì đọc dữ liệu
            const data = await res.json();
            setPatientInfo(data);
            setLoading(false);
        }
        catch(error)
        {
            console.error("Lỗi khi gọi API: ", error);
            setLoading(false);
        }
    }
    // 4. tự động gọi hàm fetchPatientInfo khi component được load lần đầu hoặc thay đổi patientId
    useEffect(() => {
        fetchPatientInfo();
    }, [patientId]);

    // 4.1 nếu đang loading UI
    if(loading){ // loading = true <=> đang ở trạng thái loading
        return(
            <div className={styles.divPatientDetailInfor}>
                <p>Loading...</p>
            </div>
        );
    }
    // 5. hiển thị thông tin chi tiết của bệnh nhân
    return(
        <div>
            {/* ở trên là thông tin tài khoản và thông tin liên hệ của bệnh nhân */}
            <div>
                <div className={styles.divPatientAccoutInfor}>
                    <h4> Account Information </h4>
                    <p> Id of Patient: {patientInfo.id} </p>
                    <p> Username: {patientInfo.username} </p>
                    <p> Password: {patientInfo.password} </p>
    
                </div>

                <div className = {styles.divPatientContactInfor}>
                    <h4> Contact Information </h4>
                    <p> Address: {patientInfo.address} </p>
                    <p> Email: {patientInfo.email} </p>
                    <p> Phone Number: {patientInfo.phoneNumber} </p>
                </div>
            </div>
            
            {/* ở dưới là thông tin nhận diện và thông tin thăm khám của bệnh nhân */}
            <div>
                <div className={styles.divPatientIdentificationInfor}>
                    <h4> Identification Information </h4>
                    <p> Name: {patientInfo.name} </p>
                    <p> Date of Birth: {patientInfo.dateOfBirth} </p>
                    <p> Gender: {patientInfo.gender} </p>
                    <p> Citizen ID: {patientInfo.citizenId} </p>
                </div>
            

                <div className = {styles.divPatientHealthRecordsInfor}>
                    <h4> Health Records Information </h4>
                    <p> Height: {patientInfo.height} cm </p>
                    <p> Weight: {patientInfo.weight} kg </p>
                    <p> Blood Type: {patientInfo.bloodType} </p>
                    <p> Medical History: {patientInfo.medicalHistory} </p>
                    <p> Allergies: {patientInfo.allergies} </p>
                    <p> Measurements Date: {patientInfo.measurementsDate} </p>
                    <p> Examinations Results: {patientInfo.examinationsResults} </p>
                    <p> Exam Date: {patientInfo.examDate} </p>
                </div>
            </div>
            
            <div><button> Confirm </button></div>
        </div>
        
    );
}