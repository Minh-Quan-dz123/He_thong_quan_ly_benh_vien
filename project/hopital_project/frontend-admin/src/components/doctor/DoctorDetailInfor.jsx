import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import styles from "./DoctorDetailInfor.module.css";
export default function DoctorDetailInfor()
{
    // component hiển thị thông tin chi tiết của 1 bác sĩ
    /* gồm
    1 id của bác sĩ
    2 tài khoản đăng nhập của bác sĩ
    3 mật khẩu đăng nhập của bác sĩ

    4 address
    5 email
    6 phone number

    7 name
    8 date of birth
    9 gender
    10 weight
    11 height
    12 số căn cước công dân

    13 specialization (chuyên khoa)
    14 position (vị trí/chức danh)
    15 qualification (tr̀nh độ)
    16 start_date (ngày bắt đầu làm việc)
    17 status (trạng thái làm việc: đang làm việc / đã nghỉ việc)

     */

    // 1. lấy id bác sĩ từ tham số URL
    const {doctorId} = useParams();
    console.log("Doctor ID từ URL: ", doctorId);

    // 2. khai báo state để chứa thông tin bác sĩ
    const [doctorInfo, setDoctorInfo] = useState (null);
    // 2.1 state để theo dõi trạng thái loading
    const [loading, setLoading] = useState(true);
    // 3. hàm gọi API lấy thông tin bác sĩ từ server
    const fetchDoctorInfo = async()=>
    {
        try{
            setLoading (true); // bắt đầu loading
            // giả lập server xử lý 1.5 giây dùng setTimeout
            await new Promise((resolve) => setTimeout (resolve, 1500));
            // gọi API
            const res = await fetch(`http://localhost:8080/api/doctors/${doctorId}`,{
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // kiểm tra kết quả trả về
            if(!res.ok)
            {
                console.error("Lỗi khi lấy thông tin bác sĩ");
                setLoading(false);
                return;
            }
            // nếu oke thì đọc dữ liệu
            const data = await res.json();
            setDoctorInfo(data);
            setLoading(false);
        }
        catch(error)
        {
            console.error("Lỗi khi gọi API: ", error);
            setLoading(false);
        }
    }
    // 4. tự động gọi hàm fetchDoctorInfo khi component được load lần đầu hoặc thay đổi doctorId
    useEffect(() => {
        fetchDoctorInfo();
    }, [doctorId]);

    // 4.1 nếu đang loading UI
    if(loading){ // loading = true <=> đang ở trạng thái loading
        return(
            <div className={styles.divDoctorDetailInfor}>
                <p>Loading...</p>
            </div>
        );
    }
    // 5. hiển thị thông tin chi tiết của bác sĩ
    return(
        <div>
            {/* ở trên là thông tin tài khoản và thông tin liên hệ của bác sĩ */}
            <div>
                <div className={styles.divDoctorAccoutInfor}>
                    <h4> Account Information </h4>
                    <p> Id of Doctor: {doctorInfo.id} </p>
                    <p> Username: {doctorInfo.username} </p>
                    <p> Password: {doctorInfo.password} </p>
                </div>

                <div className = {styles.divDoctorContactInfor}>
                    <h4> Contact Information </h4>
                    <p> Address: {doctorInfo.address} </p>
                    <p> Email: {doctorInfo.email} </p>
                    <p> Phone Number: {doctorInfo.phoneNumber} </p>

                </div>
            </div>
            
            {/* ở dưới là thông tin nhận diện và thông tin công việc của bác sĩ */}
            <div>
                <div className={styles.divDoctorIdentificationInfor}>
                    <h4> Identification Information </h4>
                    <p> Name: {doctorInfo.name} </p>
                    <p> Date of Birth: {doctorInfo.dateOfBirth} </p>
                    <p> Gender: {doctorInfo.gender} </p>
                    <p> Weight: {doctorInfo.weight} kg </p>
                    <p> Height: {doctorInfo.height} cm </p>
                    <p> Citizen ID: {doctorInfo.citizenId} </p>
                </div>
            

                <div className = {styles.divDoctorWorkInfor}>
                    <h4> Work Information </h4>
                    <p> Specialization: {doctorInfo.specialization} </p>
                    <p> Position: {doctorInfo.position} </p>
                    <p> Qualification: {doctorInfo.qualification} </p>
                    <p> Start Date: {doctorInfo.startDate} </p>
                    <p> Status: {doctorInfo.status} </p>
                </div>
            </div>
            
            <div><button> Confirm </button></div>
        </div>
        
    );
}