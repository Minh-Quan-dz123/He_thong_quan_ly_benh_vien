import {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import styles from "./DepartmentDetailPage.module.css";
import LeftMenu from "../../../components/department/LeftMenuDepartmentInfor";


export default function DepartmentDetailPage() {
  
  // 0 khai báo các object 
  const navigate = useNavigate();
  const location = useLocation();
  const depId = location.state?.depId;

  // 1 khai báo state
  const [searchId, setSearchId] = useState(depId);
  const [loading, setLoading] = useState(false);
  const [departmentInfor, setDepartmentInfor] = useState(null);

  // 1.1 giữ bản edit
  const [editDepartment, setEditDepartment] = useState(null);


  

  // 2 hàm gọi api
  const fetchSearchById = async () =>{
    setLoading(true);
    setDepartmentInfor(null);
    //dùng trong lúc đợi kết quả từ server (giả định 1.5 giây) thì hiển thị loading
    try
    {
        // giả lập server xử lý 1.5 giây dùng setTimeout
        await new Promise((resolve) => setTimeout (resolve, 1500));
        /*
        // gọi API
        const res = await fetch("http://localhost:8080/api/departments/${searchId}",{
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
        setDepartmentInfor(data);*/
        setLoading(false);
    }
    catch (err){
        console.error("Lỗi khi lấy danh sách khoa", err);
        setLoading(false);
    }
  };

  //3 hàm search
  const handleSearch = ()=>{
    if(searchId === "") return;
    fetchSearchById();
  };

  // 4 lấy depid nếu có và gọi api
  useEffect(() => {
    if(depId)
    {
      setSearchId(depId)
      // nếu có thì fetch thông tin chi tiết luôn
      // gọi hàm search theo id
      handleSearch();
    }
    
  },[depId]); // chỉ chạy khi depId thay đổi

  
  // 5 confirm sửa thông tin

  const handleConfirm = async () => {
    try 
    {
      setLoading(true);

      // TODO: Gửi API thực tế
      /*
      const res = await fetch(`http://localhost:8080/api/departments/${editDepartment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDepartment),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      */

      // Giả lập server update
      const updated = { ...editDepartment };
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDepartmentInfor(updated);
      setEditDepartment(updated);
      setLoading(false);
      alert("Update successful");
    } 
    catch (err) 
    {
      console.error(err);
      setLoading(false);
      alert("Update failed");
    }
  };


  // 6 hoàn tác sửa
  const handleBack = () => {
    setEditDepartment(departmentInfor);
  };

   // Xóa department
  const handleDelete = async () => {
    if (!window.confirm("Are you sure to delete this department?")) return;
    try 
    {
      setLoading(true);

      // TODO: Gọi API DELETE thực tế
      /*
      const res = await fetch(`http://localhost:8080/api/departments/${editDepartment.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      */

      await new Promise((resolve) => setTimeout(resolve, 1000)); // giả lập

      setLoading(false);
      alert("Department deleted");
      navigate(-1); // quay về trang trước
    } 
    catch (err) 
    {
      console.error(err);
      setLoading(false);
      alert("Delete failed");
    }
  }

  

  return (
    <div className={styles.pageContainer}>

      {/* phần div trên */}
      <div className={styles.divTop}>
        <button 
          className= {styles.backButton}
          onClick = {()=> navigate(-1)}
          >  
              ⬅ Back 
        </button>

        <h2 className = {styles.titleh2}> Quản lý thông tin khoa </h2>
      </div>

      {/* phần div dưới */}
      <div className={styles.divBottom}>

        {/* Div  left */}
        <div className={styles.leftMenu}>
          <LeftMenu/>
        </div>

        {/* Div right */}
        <div className={styles.rightContent}>

          <div className={styles.searchDiv}>
            <input
              type="text"
              placeholder="🔍 Enter Department ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}>Confirm</button>
          </div>

          {loading && <p>Loading...</p>}

          {!loading && editDepartment &&(
            <div className={styles.resultBox}>
              <div className={styles.infoGroup1}>
                <label>
                  Department ID:
                  <input
                    type="text"
                    value={editDepartment.id}
                    disabled
                  />
                </label>

                <label>
                  Department Name:
                  <input
                    type="text"
                    value={editDepartment.name}
                    onChange={(e) =>
                      setEditDepartment({ ...editDepartment, name: e.target.value })
                    }
                  />
                </label>

                <label>
                  Email:
                  <input
                    type="email"
                    value={editDepartment.email}
                    onChange={(e) =>
                      setEditDepartment({ ...editDepartment, email: e.target.value })
                    }
                  />
                </label>

                <label>
                  Phone Number:
                  <input
                    type="text"
                    value={editDepartment.phoneNumber}
                    onChange={(e) =>
                      setEditDepartment({ ...editDepartment, phoneNumber: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className={styles.infoGroup2}>
                <label>
                  Doctor Number: <span>{editDepartment.doctorCount}</span>
                </label>

                <label>
                  Patient Number: <span>{editDepartment.patientCount}</span>
                </label>
              </div>

              {/* Buttons */}
              <div className={styles.buttonGroup}>
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={handleBack}>Back</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            </div>
          )}
        </div>

      </div>
      
    </div>
  );
}
