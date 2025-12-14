import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManageDepartment.module.css";
import TableDepartmentsList from "../../../components/department/tableDepartmentList";
import LeftMenu from "../../../components/department/LeftMenuDepartmentInfor";
export default function ManageDepartment()
{
    // Trang quản lý khoa gồm phần tìm kiếm khoa theo tên
    // bản danh sách khoa
    // 1. khai báo state
    const[departments, setDepartments] = useState([]);
    const[search,setSearch] = useState("");
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null)

    const navigate = useNavigate();

    // 2. hàm gọi API lấy danh sách khoa từ server
    const fetchDepartments = async()=>{
        setLoading(true);
        setError(true); // ko lỗi
        //dùng trong lúc đợi kết quả từ server (giả định 1.5 giây) thì hiển thị loading
        try
        {
            // giả lập server xử lý 1.5 giây dùng setTimeout
            await new Promise((resolve) => setTimeout (resolve, 1500));
            /*
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
            setDepartments(data);*/
            setLoading(false);
            setError(true);
            setDepartments([{
                                id: 1,
                                name: "Cardiology",
                                headId: 101,
                                headName: "Dr. Alice Nguyen",
                                email: "cardiology@hospital.com",
                                phoneNumber: "0123456789",
                            },
                            {
                                id: 2,
                                name: "Neurology",
                                headId: 102,
                                headName: "Dr. Bob Tran",
                                email: "neurology@hospital.com",
                                phoneNumber: "0987654321",
                            },
                            {
                                id: 3,
                                name: "Pediatrics",
                                headId: 103,
                                headName: "Dr. Cindy Le",
                                email: "pediatrics@hospital.com",
                                phoneNumber: "0112233445",
                            },
                            {
                                id: 4,
                                name: "Orthopedics",
                                headId: 104,
                                headName: "Dr. David Pham",
                                email: "orthopedics@hospital.com",
                                phoneNumber: "0223344556",
                            },
                            {
                                id: 5,
                                name: "Oncology",
                                headId: 105,
                                headName: "Dr. Emma Hoang",
                                email: "oncology@hospital.com",
                                phoneNumber: "0334455667",
                            }
                            ]);
        }
        catch (err){
            console.error("Lỗi khi lấy danh sách khoa", err);
            setLoading(false);
            setError(err.message)
        }
    };
    // 3. tự động gọi hàm fetchDepartments khi component được load lần đầu hoặc thay đổi
    useEffect(() => {
        fetchDepartments();
    }, []);

    // 4. Hàm lọc theo từ khóa trong search
    const filteredDepartments = departments.filter((dept) => 
        dept.name.toLowerCase().includes(search.toLowerCase())
    );

    // 5 render
    //5.1 nếu đang loading UI 

    return(
        <div className = {styles.container}>

            {/* phần trên */}
            <div className = {styles.divTop}>
                <button 
                className= {styles.backButton}
                onClick = {()=> navigate(-1)}
                >  
                    ⬅ Back 
                </button>

                <h2 className = {styles.titleh2}> Quản Lý Khoa </h2>

            </div>

            {/* phần dưới */}
            <div className = {styles.divBottom}>
                {/*left*/}
                <div className = {styles.leftMenu}>
                    <LeftMenu/>
                </div>
                

                {/* right*/}
                <div className={styles.tableRes}>
                    {/*input search*/}
                    <input
                        className = {styles.searchInput}
                        type = "text"
                        placeholder="🔍 Search for Department Name"
                        value = {search}
                        onChange = {(e) => setSearch(e.target.value)}
                        
                    />
                    {loading && <p>Loading...</p>}

                    {!error && <p>Error....</p>}

                    {!loading && error && (
                        <TableDepartmentsList departments = {filteredDepartments}/>
                    )}
                </div>
            </div>
        </div>
    );
}