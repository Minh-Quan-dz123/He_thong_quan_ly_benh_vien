import { useNavigate } from "react-router-dom";
import styles from "./ManageDepartmentList.module.css";
export default function TableDepartmentsList({departments})
{
    // component hiển thị bảng danh sách các khoa trong bệnh viện
    // thông tin 1 danh sách các khoa gồm: 
    // id của khoa, 
    // tên khoa
    // id của trưởng khoa (cũng là 1 doctor)
    // name của trưởng khoa
    // email khoa
    // số điện thoại khoa
    
    //0. kiểm tra
    const navigate = useNavigate();
    if(!departments || departments.length === 0)
    {
        return <p>Hiện chưa có khoa nào</p>
    }

    //1. hàm xử lý manage
    const handleClickManage = (depId) => {
        // chuyển page và truyền id của department
        navigate("/HomeAdmin/ManagerDepartmentInfor", {state: {depId}});
    };

    return(
        
            <table className={styles.departmentTable}>
                <thead>
                    <tr>
                        <th> STT </th>
                        <th> ID </th>
                        <th> Department Name </th>
                        <th> ID Head </th>
                        <th> Head Name </th>
                        <th> Department Email </th>
                        <th> Department Phone Number </th>
                        <th> Details </th>
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
                                <td>
                                    <button
                                        className={styles.detailsButton}
                                        onClick = {() => handleClickManage(dept.id)}
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
    )
   
}