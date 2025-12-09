import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./tabelDoctorInHopital.module.css";
export default function TableDoctorInHopital()
{
    // component hiển thị bảng danh sách các bác sĩ de
    /* thông tin 1 bác sĩ gồm:
    // id của bác sĩ
    // tên bác sĩ
    // giới tính
    // vị trí/chức danh
    // chuyên khoa

    hiển thị bảng với tối đa 10 bác sĩ mỗi trang table, nếu
    có nhiều hơn 10 bác sĩ thì phân trang để xem các bác sĩ tiếp theo
    */

    // 1. khai báo state để chứa danh sách bác sĩ
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    // 1.1 state để theo dõi trang hiện tại
    const [indexCurrentPage, setIndexCurrentPage] = useState(0); // trang hiện tại, mặc định là trang 0
    const doctorsPerPage = 10; // số bác sĩ mỗi trang

    // 2. hàm gọi API lấy danh sách bác sĩ từ server
    const fetchDoctors = async()=>
    {
        //dùng trong lúc đợi kết quả từ server (giả định 1.5 giây) thì hiển thị loading
        try
        {
            // giả lập server xử lý 1.5 giây dùng setTimeout
            setLoading(true);
            await new Promise((resolve) => setTimeout (resolve, 1500)); 
            // gọi API
            const res = await fetch("http://localhost:8080/api/doctors",{
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // kiểm tra kết quả trả về
            if(!res.ok)
            {
                console.error("Lỗi khi lấy danh sách bác sĩ");
                setLoading(false);
                return;
            }
            // nếu oke thì đọc dữ liệu
            const data = await res.json();
            setDoctors(data);
            setLoading(false);
        }
        catch (error){
            console.error("Lỗi khi lấy danh sách bác sĩ", error);
            setLoading(false);
        }
    };


    // 3. tự động gọi hàm fetchDoctors khi component được load lần đầu 
    useEffect(() => {
        fetchDoctors();
    }, []);
    
    
    //4 phân trang 
    // tính toán để chia danh sách ra hiển thị
    const indexOfFirstDoctor = indexCurrentPage * doctorsPerPage; // index bác sĩ đầu tiên của trang hiện tại
    const listDoctorsCurrentPage = doctors.slice(indexOfFirstDoctor, indexOfFirstDoctor + doctorsPerPage); // danh sách bác sĩ của trang hiện tại mảng lấy ra là [,....) (ko lấy phần tử cuối)
    const totalPages = Math.ceil(doctors.length / doctorsPerPage); // tổng số trang hiển thị danh sách bác sĩ (làm tròn lên)

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

    // 4.2 hiển thị danh sách bác sĩ với phân trang
    return(
        <div className={styles.tableDoctorInHopital}>
            <h2> List of Doctors in the Hospital </h2>

            <table>
                <thead>
                    <tr>
                        <th> STT </th>
                        <th> ID Doctor </th>
                        <th> Doctor Name </th>
                        <th> Gerder </th>
                        <th> Position </th>
                        <th> Specialty </th>
                    </tr>
                </thead>
                <tbody>
                    {/* hiển thị danh sách bác sĩ của trang hiện tại: listDoctorsCurrentPage ko phải doctors */}
                    {listDoctorsCurrentPage.map((doctor, index) => (
                        <tr key={doctor.id}>
                            <td>{index + 1}</td>
                            <td>{doctor.id}</td>
                            <td>{doctor.name}</td>
                            <td>{doctor.gender}</td>
                            <td>{doctor.position}</td>
                            <td>{doctor.specialty}</td>
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