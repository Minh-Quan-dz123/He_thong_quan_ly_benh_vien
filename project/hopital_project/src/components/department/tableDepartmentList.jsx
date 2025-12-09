import {useState, useEffect} from "react";
import styles from "./ManageDepartmentList.module.css";
export default function tableDepartmentsList()
{
    // component hiển thị bảng danh sách các khoa trong bệnh viện
    // thông tin 1 danh sách các khoa gồm: 
    // id của khoa, 
    // tên khoa
    // id của trưởng khoa (cũng là 1 doctor)
    // name của trưởng khoa
    // email khoa
    // số điện thoại khoa

    // 1. khai báo state để chứa danh sách khoa
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. hàm gọi API lấy danh sách khoa từ server
    const fetchDepartments = async()=>
    {
        //dùng trong lúc đợi kết quả từ server (giả định 1.5 giây) thì hiển thị loading
        try
        {
            // giả lập server xử lý 1.5 giây dùng setTimeout
            setLoading(true);
            await new Promise((resolve) => setTimeout (resolve, 1500));

            // gọi API
            const res = await fetch("http://localhost:8080/api/departments",{
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // kiểm tra kết quả trả về
            if(!res.ok)
            {
                console.error("Lỗi khi lấy danh sách khoa");
                setLoading(false);
                return;
            }

            // nếu oke thì đọc dữ liệu
            const data = await res.json();
            setDepartments(data);
            setLoading(false);
        }
        catch (error){
            console.error("Lỗi khi lấy danh sách khoa", error);
            setLoading(false);
        }
    };
    // 3. tự động gọi hàm fetchDepartments khi component được load lần đầu hoặc thay đổi
    useEffect(() => {
        fetchDepartments();
    }, []);

    //3.1 nếu đang loading UI 
    if(loading){ // loading = true <=> đang ở trạng thái loadin
        return(
            <div>
                <p> Loading... </p>
            </div>
        );
    }

    if(departments.length === 0){
        return (
            <div>
                <p> No departments found in the hospital </p>
            </div>
        );
    }
    // 3.3 hiển thị danh sách khoa
    return(
        <div>   
            <h2> List of Departments in the Hospital </h2>
            <table className={styles.departmentTable}>
                <thead>
                    <tr>
                        <th> STT </th>
                        <th> ID Department </th>
                        <th> Department Name </th>
                        <th> ID Head of Department </th>
                        <th> Head of Department Name </th>
                        <th> Department Email </th>
                        <th> Department Phone Number </th>
                    </tr>
                </thead>

                <tbody>{
                        departments.map((dept,index) => (
                            <tr key={dept.id}>
                                <td>{index + 1}</td>
                                <td>{dept.id}</td>
                                <td>{dept.name}</td>
                                <td>{dept.headId}</td>
                                <td>{dept.headName}</td>
                                <td>{dept.email}</td>
                                <td>{dept.phoneNumber}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )

}