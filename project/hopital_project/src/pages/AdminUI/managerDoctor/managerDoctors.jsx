import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./managerDoctors.module.css";
import LeftMenu from "../../../components/doctor/LeftMenuDoctor";


export default function ManagerDoctor() 
{
    // khai báo state
    const [doctors, setDoctors] = useState([]);// 1 danh sách lấy từ api

    const [filteredDoctors, setFilteredDoctors] = useState([]); // thông tin đang cần lọc
    
    const [currentPage, setCurrentPage] = useState(0); // trang page hiện tại
    const doctorsPerPage = 10;

    
    // thông tin nhập để lọc
    const [search, setSearch] = useState({
        name: "",
        phone: "",
        id: "",
        cccd: "",
        gender: "",
        position: "",
        specialty: "",
    });


    const navigate = useNavigate();

    // 1 khai báo API
    const fetchDoctors = async () => {
        try 
        {
            const response = await fetch("/api/doctors"); 
            const data = await response.json();
            setDoctors(data);
            setFilteredDoctors(data);
        } 
        catch (error) 
        {
            console.error("lỗi fetch Doctors:", error);
        }
    };
    // gọi api luôn
    useEffect(() => {
        fetchDoctors();
    }, []);

    

    // 2 hàm xử lý search theo tên, phone, id, cccd , ...
    const handleSearch = (field, value) => {
        // 2.1 Cập nhật state search
        const newSearch = { ...search, [field]: value };
        setSearch(newSearch);

        // 2.2 Lọc bác sĩ theo các trường, bỏ qua nếu rỗng
        const filtered = doctors.filter((d) => {
            return (
            (!newSearch.name || d.name.toLowerCase().includes(newSearch.name.toLowerCase())) &&
            (!newSearch.phone || d.phone.toString().includes(newSearch.phone.toLowerCase())) &&
            (!newSearch.id || d.id.toString().includes(newSearch.id)) &&
            (!newSearch.cccd || d.cccd.toLowerCase().includes(newSearch.cccd.toLowerCase())) &&
            (!newSearch.gender || d.gender.toLowerCase() === newSearch.gender.toLowerCase()) &&
            (!newSearch.position || d.position.toLowerCase().includes(newSearch.position.toLowerCase())) &&
            (!newSearch.specialty || d.specialty.toLowerCase().includes(newSearch.specialty.toLowerCase()))
            );
        });
    
        // 2.3 Cập nhật danh sách filtered và reset page
        setFilteredDoctors(filtered);
        setCurrentPage(0);
    };

    // 3 nút bấm vào để edit
    const handleSelectDoctor = (doctorId) => {
        // Tìm doctor trong danh sách filteredDoctors hoặc doctors
        const doctor = filteredDoctors.find(d => d.id.toString() === doctorId.toString());
        if (doctor) 
        {
            // goi api xóa doctorId
            // nếu thành công thì setCurrentPage(0) và doctors
        }
    };


    //3 phân trang 
    // tính toán để chia danh sách ra hiển thị
    const indexOfFirstDoctor = currentPage * doctorsPerPage; // index doctor đầu tiên của trang hiện tại
    const listDoctorsCurrentPage = filteredDoctors.slice(indexOfFirstDoctor, indexOfFirstDoctor + doctorsPerPage); // danh sách doctor của trang hiện tại mảng lấy ra là [,....) (ko lấy phần tử cuối)
    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage); // tổng số trang hiển thị danh sách doctor (làm tròn lên)

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

                <h2 className={styles.tilteListDoctors}>List Doctors</h2>

            </div>

            <div className={styles.divBottom}>
                <div className={styles.left}>
                    <LeftMenu/>
                </div>

                <div className={styles.right}>
                    {/*2 phần lọc danh sách bác sĩ*/}
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
                                type="text"
                                placeholder="Search by Position"
                                value={search.position}
                                onChange={(e) => handleSearch("position", e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Search by Specialty"
                                value={search.specialty}
                                onChange={(e) => handleSearch("specialty", e.target.value)}
                            />
                        </div>
                        
                    </div>

                    {/* table chứa danh sách bác sĩ*/}
                    <div className={styles.tableDoctorInHopital}>
                        <h2 className={styles.titleTableDoctorInHopital}> List of Doctors in the Hospital </h2>

                        <table>
                            <thead>
                                <tr>
                                    <th> STT </th>
                                    <th> ID</th>
                                    <th> Name </th>
                                    <th> Gender </th>
                                    <th> Address </th>
                                    <th> Phone Number </th>
                                    <th> Position </th>
                                    <th> Specialty </th>
                                    <th> Delete </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* hiển thị danh sách doctor của trang hiện tại: listDoctorsCurrentPage ko phải Doctors */}
                                {listDoctorsCurrentPage.map((doctor, index) => (
                                    <tr key={doctor.id}>
                                        <td>{index + 1}</td>
                                        <td>{doctor.id}</td>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.gender}</td>
                                        <td>{doctor.address}</td>
                                        <td>{doctor.phone}</td>
                                        <td>{doctor.position}</td>
                                        <td>{doctor.specialty}</td>
                                        <td>
                                            <button 
                                            className={styles.editBtn}
                                            onClick={() => handleSelectDoctor(doctor.id)}
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
