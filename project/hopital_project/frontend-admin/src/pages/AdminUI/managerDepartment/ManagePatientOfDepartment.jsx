import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./ManagePatientOfDepartment.module.css";
import LeftMenu from "../../../components/department/LeftMenuDepartmentInfor";
export default function ManagePatientOfDepartment()
{
    // component hiển thị bảng danh sách các bệnh nhân
    // nút xóa
/*
    hiển thị bảng với tối đa 10 bệnh nhân mỗi trang table, nếu
    có nhiều hơn 10 bệnh nhân thì phân trang để xem các bệnh nhân tiếp theo
    */

    // 1. khai báo state để chứa danh sách bệnh nhân và id của department
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [departmentIdInput, setDepartmentIdInput] = useState("");
    // 1.1 state để theo dõi trang hiện tại
    const [indexCurrentPage, setIndexCurrentPage] = useState(0); // trang hiện tại, mặc định là trang 0
    const patientsPerPage = 10; // số bệnh nhân mỗi trang
    // 2. hàm gọi API lấy danh sách bệnh nhân từ server
    const fetchPatients = async()=>
    {
        //dùng trong lúc đợi kết quả từ server (giả định 1.5 giây) thì hiển thị loading
        setLoading(true);
        try
        {
            // giả lập server xử lý 1.5 giây dùng setTimeout
            await new Promise((resolve) => setTimeout (resolve, 1500)); 
            // gọi API
            /*const res = await fetch(`http://localhost:8080/api/departments/${departmentIdInput}/patients/`,{
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });*/

            setLoading(false);
           /* // kiểm tra kết quả trả về
            if(!res.ok)
            {
                console.error("Lỗi khi lấy danh sách bệnh nhân");
                
                return;
            }
            // nếu oke thì đọc dữ liệu
            const data = await res.json();
            setPatients(data);*/
          
        }
        catch (error){
            console.error("Lỗi khi lấy danh sách bệnh nhân", error);
            setLoading(false);
        }
    };

    // 3.1 hàm lọc patient hiển thị theo id, giới tính, name
    const [searchId, setSearchId] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchGender, setSearchGender] = useState("");
    const filteredPatients = patients.filter((patient) => {
        return (
            patient.id.toString().includes(searchId) &&
            patient.name.toLowerCase().includes(searchName.toLowerCase()) &&
            (searchGender === "" || patient.gender === searchGender)
        );
    });

    // 3.2 hàm lấy patient theo department id
    const clickSearchByIdDepartment = () => {
        if(departmentIdInput.trim() === "")
        {
            alert("Please enter Department ID!");
            return;
        }

        // Reset trang về 1
        setIndexCurrentPage(0);
        fetchPatients();
    }

    
    
    //4 phân trang 
    // tính toán để chia danh sách ra hiển thị
    const indexOfFirstPatient = indexCurrentPage * patientsPerPage; // index bệnh nhân đầu tiên của trang hiện tại
    const listPatientsCurrentPage = filteredPatients.slice(indexOfFirstPatient, indexOfFirstPatient + patientsPerPage); // danh sách bệnh nhân của trang hiện tại mảng lấy ra là [,....) (ko lấy phần tử cuối)
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage); // tổng số trang hiển thị danh sách bệnh nhân (làm tròn lên)

    // hàm xử lý khi người dùng bấm sang trang tiếp theo
    // giả sử có 4 trang(0,1,2,3) đang ở index = 2, bấm sang trang 3 (trang cuối) thì cho chuyển sang trang 3 đồng thời ko cho sang nữa
    const handleNextPage = () =>{
        if(indexCurrentPage + 1 <= totalPages - 1) // 2+1 = 4-1 => trang cuối
        {
            setIndexCurrentPage(indexCurrentPage + 1);
        }
        
    };
    //  hàm xử lý khi người dùng bấm lùi về trang trước đó
    const handlePreviousPage = () => {
        if(indexCurrentPage > 0) {
            setIndexCurrentPage(indexCurrentPage - 1);
        }
    };

    // hàm xử lý khi user bấm xóa patient
    const handleDeletePatient = async (id) => {

        /* gọi api xóa
        try {
            const res = await fetch(`http://localhost:8080/api/patients/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Delete failed");
            }

            // xoá ở UI sau khi xoá server thành công
            setPatients(prev => prev.filter(p => p.id !== id));
            console.log("Delete success");

        } 
        catch (err) {
            console.error(err);
        }*/

    }

    const navigate = useNavigate();
  
    
    // hiển thị danh sách bệnh nhân với phân trang
    return(
        <div className={styles.container}>
            {/* bên trên */}
            <div className = {styles.divTop}>
                <button 
                    className= {styles.backButton}
                    onClick = {()=> navigate(-1)}
                    >  
                    ⬅ Back
                </button>

                <h2 className = {styles.titleh2}> Manage Patient Of Department </h2>
            </div>

            {/* bên dưới*/}
            <div className={styles.divBottom}>
                {/*left*/}
                <div className={styles.leftMenu}>
                    <LeftMenu/>
                </div>

                {/* right */}
                <div className={styles.rightResult}>
                    
                    {/* 1 input tìm kiếm danh sách patient theo department name và button xác nhận*/}
                    <div className = {styles.divInput}>
                        <input
                            type="text"
                            placeholder="🔍 Enter Department ID"
                            value={departmentIdInput}
                            onChange={(e) => setDepartmentIdInput(e.target.value)}
                        />
                        <button onClick={clickSearchByIdDepartment}>Confirm</button>
                    </div>
                    
                    {/* 2 lọc kết quả theo id patient (điền), giới tính (chọn), tên (điền*/}
                    <div className={styles.searchFilters}>

                        <select
                            value={searchGender}
                            onChange={(e) => setSearchGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <input 
                            type="text"
                            placeholder="Search by ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Search by Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />


                    </div>

                    {/* 3 bảng kết quả*/}
                    {loading && <p>Loading...</p>}

                    {!loading && (
                    <div className={styles.tablePatientInHopital}>
                        <h2> List of Patients in the Hospital </h2>

                        <table>
                            <thead>
                                <tr>
                                    <th> STT </th>
                                    <th> ID Patient </th>
                                    <th> Patient Name </th>
                                    <th> Gender </th>
                                    <th> Address </th>
                                    <th> Phone Number </th>
                                    <th> Delete </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* hiển thị danh sách bệnh nhân của trang hiện tại: listPatientsCurrentPage ko phải patients */}
                                {listPatientsCurrentPage.map((patient, index) => (
                                    <tr key={patient.id}>
                                        <td>{index + 1}</td>
                                        <td>{patient.id}</td>
                                        <td>{patient.name}</td>
                                        <td>{patient.gender}</td>
                                        <td>{patient.address}</td>
                                        <td>{patient.phoneNumber}</td>
                                        <td>
                                            <button 
                                            className={styles.deleteBtn}
                                            onClick={() => handleDeletePatient(patient.id)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* xử lý phân trang */}
                        <div className={styles.pagination}>
                            <button onClick={handlePreviousPage} disabled={indexCurrentPage === 0}> &lt; </button>
                            <span> Trang {indexCurrentPage + 1} / {totalPages} </span>
                            <button onClick={handleNextPage} disabled={indexCurrentPage + 1 === totalPages}> &gt; </button>
                        </div>
                    </div>)}

                </div>
                
            </div>
            
        </div>
        
    )
}