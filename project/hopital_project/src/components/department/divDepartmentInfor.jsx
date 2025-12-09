import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";// lấy tham số từ URL
import styles from "./divDepartmentInfor.module.css";

export default function divDepartmentInfor()
{
    // component hiển thị thông tin chi tiết của 1 khoa
    // thông tin của khoa gồm:
    // id của khoa, 
    // id của trưởng khoa (cũng là 1 doctor)
    // tên khoa
    // email khoa
    // số điện thoại khoa

    // tiếp theo là thông tin trưởng khoa (tên, giới tính, email, số điện thoại, date_birth, position), số bác sĩ, số bệnh nhân hiện tại của khoa
    // 1. lấy id khoa từ tham số URL
    const {departmentId} = useParams(); // lấy tham số departmentId từ URL
    console.log("Department ID từ URL: ", departmentId);
    // 2. khai báo state để chứa thông tin khoa
    const [departmentInfo, setDepartmentInfo] = useState(null);
    // 2.1 state để theo dõi trạng thái loading
    const [loading, setLoading] = useState(true);

    // 3. hàm gọi API lấy thông tin khoa từ server
    const fetchDepartmentInfo = async()=>
    {
        try
        {
            setLoading (true); // bắt đầu loading
            // giả lập server xử lý 1.5 giây dùng setTimeout
            await new Promise((resolve) => setTimeout (resolve, 1500));
            // gọi API
            const res = await fetch(`http://localhost:8080/api/departments/${departmentId}`,{
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            // kiểm tra kết quả trả về
            if(!res.ok)
            {
                console.error("Lỗi khi lấy thông tin khoa");
                setLoading(false);
                return;
            }
            // nếu oke thì đọc dữ liệu
            const data = await res.json();
            setDepartmentInfo(data);
            setLoading(false);
        }
        catch (error){
            console.error("Lỗi khi lấy thông tin khoa", error);
            setLoading(false);
        }
    };
    // 4. tự động gọi hàm fetchDepartmentInfo khi component được load lần đầu hoặc thay đổi departmentId
    useEffect(() => {
        fetchDepartmentInfo();
    }, [departmentId]);
    // 4.1 nếu đang loading UI
    if(loading){ // loading = true <=> đang ở trạng thái loading
        return(
            <div className={styles.divDepartmentInfor}>
                <p>Loading...</p>
            </div>
        );
    }
    /* 5. hiển thị thông tin khoa
    ở trên là thông tin cơ bản của khoa
    ở dưới là thông tin chi tiết của trưởng khoa, số bác sĩ, số bệnh nhân hiện tại của khoa
    */
    return(
        <div>
            {/* Hiển thị thông tin cơ bản của khoa */}
            <div className={styles.divDepartmentInfor}>
                <h2> Department Information: {departmentInfo.name} </h2>
                <p> Department ID: {departmentInfo.id} </p>
                <p> Department Email: {departmentInfo.email} </p>
                <p> Department Phone: {departmentInfo.phone} </p>
            </div>

            {/* Hiển thị thông tin chi tiết của trưởng khoa, số bác sĩ, số bệnh nhân hiện tại của khoa */}
            <div className={styles.divDepartmentDetailInfor}>
                <h3> Head Doctor Information </h3>
                <p> Head Doctor Name: {departmentInfo.headDoctor.name} </p>
                <p> Gender: {departmentInfo.headDoctor.gender} </p>
                <p> Email: {departmentInfo.headDoctor.email} </p>
                <p> Phone: {departmentInfo.headDoctor.phone} </p>
                <p> Date of Birth: {departmentInfo.headDoctor.dateOfBirth} </p>
                <p> Position: {departmentInfo.headDoctor.position} </p>

        </div>

        </div>
    );
    
}
