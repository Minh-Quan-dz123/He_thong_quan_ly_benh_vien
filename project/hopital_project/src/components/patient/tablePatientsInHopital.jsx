import { useState, useEffect } from "react";
import styles from "./tabelPatientsInHopital.module.css";
export default function TablePatientsInHopital()
{
    // component hiển thị bảng danh sách các bệnh nhân
    /* thông tin 1 bệnh nhân gồm:
    // id của bệnh nhân
    // tên bệnh nhân
    // giới tính
    // khoa đang ở

    hiển thị bảng với tối đa 10 bệnh nhân mỗi trang table, nếu
    có nhiều hơn 10 bệnh nhân thì phân trang để xem các bệnh nhân tiếp theo
    */

    // 1. khai báo state để chứa danh sách bệnh nhân
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    // 1.1 state để theo dõi trang hiện tại
    const [indexCurrentPage, setIndexCurrentPage] = useState(0); // trang hiện tại, mặc định là trang 0
    const patientsPerPage = 10; // số bệnh nhân mỗi trang
    // 2. hàm gọi API lấy danh sách bệnh nhân từ server
    const fetchPatients = async()=>
    {
        //dùng trong lúc đợi kết quả từ server (giả định 1.5 giây) thì hiển thị loading
        try
        {
            // giả lập server xử lý 1.5 giây dùng setTimeout
            setLoading(true);
            await new Promise((resolve) => setTimeout (resolve, 1500)); 
            // gọi API
            const res = await fetch("http://localhost:8080/api/patients",{
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // kiểm tra kết quả trả về
            if(!res.ok)
            {
                console.error("Lỗi khi lấy danh sách bệnh nhân");
                setLoading(false);
                return;
            }
            // nếu oke thì đọc dữ liệu
            const data = await res.json();
            setPatients(data);
            setLoading(false);
        }
        catch (error){
            console.error("Lỗi khi lấy danh sách bệnh nhân", error);
            setLoading(false);
        }
    };


    // 3. tự động gọi hàm fetchPatients khi component được load lần đầu 
    useEffect(() => {
        fetchPatients();
    }, []);
    
    
    //4 phân trang 
    // tính toán để chia danh sách ra hiển thị
    const indexOfFirstPatient = indexCurrentPage * patientsPerPage; // index bệnh nhân đầu tiên của trang hiện tại
    const listPatientsCurrentPage = patients.slice(indexOfFirstPatient, indexOfFirstPatient + patientsPerPage); // danh sách bệnh nhân của trang hiện tại mảng lấy ra là [,....) (ko lấy phần tử cuối)
    const totalPages = Math.ceil(patients.length / patientsPerPage); // tổng số trang hiển thị danh sách bệnh nhân (làm tròn lên)

    // hàm xử lý khi người dùng bấm sang trang tiếp theo
    // giả sử có 4 trang(0,1,2,3) đang ở index = 2, bấm sang trang 3 (trang cuối) thì cho chuyển sang trang 3 đồng thời ko cho sang nữa
    const handleNextPage = () =>{
        if(indexCurrentPage + 1 <= totalPages - 1) // 2+1 = 4-1 => trang cuối
        {
            setIndexCurrentPage(indexCurrentPage + 1);
        }
        
    };

    // hàm xử lý khi người dùng bấm lùi về trang trước đó
    const handlePreviousPage = () => {
        if(indexCurrentPage > 0) {
            setIndexCurrentPage(indexCurrentPage - 1);
        }
    };

    //4.1 nếu đang loading UI 
    if(loading){ // loading = true <=> đang ở trạng thái loading
        return <div> Loading... </div>;
    }  

    // 4.2 hiển thị danh sách bệnh nhân với phân trang
    return(
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
        </div>
    )


}