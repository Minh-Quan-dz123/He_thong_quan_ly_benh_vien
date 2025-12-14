import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./manageListPatient.module.css";
import LeftMenu from "../../../components/patient/LeftMenuPatient";


export default function ManagerListPatient() 
{
    // khai báo state
    const [patients, setPatients] = useState([]);// 1 danh sách lấy từ api

    const [filteredPatients, setFilteredPatients] = useState([]); // thông tin đang cần lọc
    
    const [currentPage, setCurrentPage] = useState(0); // trang page hiện tại
    const patientsPerPage = 10;

    
    // thông tin nhập để lọc
    const [search, setSearch] = useState({
        name: "",
        phone: "",
        id: "",
        cccd: "",
        gender: "",
        departmentId: "",
    });


    const navigate = useNavigate();

    // 1 khai báo API
    const fetchPatients = async () => {
        try 
        {
            const response = await fetch("/api/patients"); 
            const data = await response.json();
            setPatients(data);
            setFilteredPatients(data);
        } 
        catch (error) 
        {
            console.error("lỗi fetch Patients:", error);
        }
    };
    // gọi api luôn
    useEffect(() => {
        fetchPatients();
    }, []);

    

    // 2 hàm xử lý search theo tên, phone, id, cccd , ...
    const handleSearch = (field, value) => {
        // 2.1 Cập nhật state search
        const newSearch = { ...search, [field]: value };
        setSearch(newSearch);

        // 2.2 Lọc patient theo các trường, bỏ qua nếu rỗng
        const filtered = patients.filter((d) => {
            return (
            (!newSearch.name || d.name.toLowerCase().includes(newSearch.name.toLowerCase())) &&
            (!newSearch.phone || d.phone.toString().includes(newSearch.phone.toLowerCase())) &&
            (!newSearch.id || d.id.toString().includes(newSearch.id)) &&
            (!newSearch.cccd || d.cccd.toString().includes(newSearch.cccd.toLowerCase())) &&
            (!newSearch.gender || d.gender.toLowerCase() === newSearch.gender.toLowerCase()) &&
            (!newSearch.departmentId || d.departmentId.toString() === newSearch.departmentId.toString())
            );
        });
    
        // 2.3 Cập nhật danh sách filtered và reset page
        setFilteredPatients(filtered);
        setCurrentPage(0);
    };


    //3 phân trang 
    // tính toán để chia danh sách ra hiển thị
    const indexOfFirstPatient = currentPage * patientsPerPage; // index patient đầu tiên của trang hiện tại
    const listPatientsCurrentPage = filteredPatients.slice(indexOfFirstPatient, indexOfFirstPatient+ patientsPerPage); // danh sách patient của trang hiện tại mảng lấy ra là [,....) (ko lấy phần tử cuối)
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage); // tổng số trang hiển thị danh sách patient (làm tròn lên)

    // hàm xử lý khi người dùng bấm sang trang tiếp theo
    // giả sử có 4 trang(0,1,2,3) đang ở index = 2, bấm sang trang 3 (trang cuối) thì cho chuyển sang trang 3 đồng thời ko cho sang nữa
    const handleNextPage = () =>{
        if(currentPage + 1 <= totalPages - 1) // 2+1 = 4-1 => trang cuối
        {
            setCurrentPage(currentPage + 1);
        }
        
    };
    //  hàm xử lý khi người dùng bấm lùi về trang trước đó
    const handlePreviousPage = () => {
        if(currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };


    
    return (
        <div className={styles.container}>
            <div className={styles.divTop}>
                 {/*1 phần header */}
                <button 
                    className= {styles.backButton}
                    onClick = {()=> navigate(-1)}
                    >  
                        ⬅ Back 
                </button>

                <h2 className={styles.tilteListPatients}>List Patients</h2>

            </div>

            <div className={styles.divBottom}>
                <div className={styles.left}>
                    <LeftMenu/>
                </div>

                <div className={styles.right}>
                    {/*2 phần lọc danh sách bệnh nhân*/}
                    <div className={styles.searchFilters}>

                        <div className={styles.searchFilters1}>
                            <select
                            value={search.gender}
                            onChange={(e) => handleSearch("gender",e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>

                            <input 
                                type="text"
                                placeholder="Search by ID"
                                value={search.id}
                                onChange={(e) => handleSearch("id", e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Search by Name"
                                value={search.name}
                                onChange={(e) => handleSearch("name", e.target.value)}
                            />
                        </div>
                        
                        <div className={styles.searchFilters2}>
                            <input
                            type="number"
                            placeholder="Search by Phone Number"
                            value={search.phone}
                            onChange={(e) => handleSearch("phone", e.target.value)}
                            />
                            <input
                            type="number"
                            placeholder="Search by CCCD"
                            value={search.cccd}
                            onChange={(e) => handleSearch("cccd", e.target.value)}
                            />
                            <input
                            type="text"
                            placeholder="Search by Department Id"
                            value={search.departmentId}
                            onChange={(e) => handleSearch("departmentId", e.target.value)}
                            />
                            
                        </div>
                        
                    </div>

                    {/* table chứa danh sách bệnh nhân*/}
                    <div className={styles.tablePatientInHopital}>
                        <h2 className={styles.titleTablePatientInHopital}> List of Patients in the Hospital </h2>

                        <table>
                            <thead>
                                <tr>
                                    <th> STT </th>
                                    <th> ID</th>
                                    <th> Name </th>
                                    <th> Gender </th>
                                    <th> Address </th>
                                    <th> Phone Number </th>
                                    <th> Status</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {/* hiển thị danh sách patient của trang hiện tại: listPatientsCurrentPage ko phải patients */}
                                {listPatientsCurrentPage.map((patient, index) => (
                                    <tr key={patient.id}>
                                        <td>{index + 1}</td>
                                        <td>{patient.id}</td>
                                        <td>{patient.name}</td>
                                        <td>{patient.gender}</td>
                                        <td>{patient.address}</td>
                                        <td>{patient.phone}</td>
                                        <td>{patient.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* xử lý phân trang */}
                        <div className={styles.pagination}>
                            <button onClick={handlePreviousPage} disabled={currentPage === 0}> &lt; </button>
                            <span> Page{currentPage + 1} / {totalPages} </span>
                            <button onClick={handleNextPage} disabled={currentPage + 1 === totalPages}> &gt; </button>
                        </div>
                    </div>

                </div>
                
            </div>


        </div>
    );
}
