import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateDepartment.module.css";
import LeftMenu from "../../../components/department/LeftMenuDepartmentInfor";

export default function CreateDepartment() {
  const navigate = useNavigate();

  // 1 state
  const [departmentName, setDepartmentName] = useState("");
  const [departmentEmail, setDepartmentEmail] = useState("");
  const [departmentPhone, setDepartmentPhone] = useState("");
  const [headDoctorId, setHeadDoctorId] = useState("");

  // 2 table hiện bác sĩ và chọn
  const [showDoctorTable, setShowDoctorTable] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 3 gọi api
  const fetchDoctors = async()=>{
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Dữ liệu giả lập
    const data = [
      { id: "D001", name: "Nguyen Van A", gender: "Male", phone: "0123456789", position: "Senior", specialty: "Cardiology" },
      { id: "D002", name: "Tran Thi B", gender: "Female", phone: "0987654321", position: "Junior", specialty: "Neurology" },
      { id: "D003", name: "Le Van C", gender: "Male", phone: "0112233445", position: "Senior", specialty: "Pediatrics" },
    ];
    setDoctorList(data);
    setLoading(false);
  };

  // 4 mở table bác sĩ
  const handleOpenDoctorTable=()=>{
    fetchDoctors();
    setShowDoctorTable(true);
  };

  // 5 chọn bác sĩ
  const handleSelectDoctor = (doctorId)=>{
    setHeadDoctorId(doctorId);
    setShowDoctorTable(false);
  };

  // 6 gửi thông tin
  const handleSubmit = async ()=>{
    if (!departmentName || !departmentEmail || !departmentPhone || !headDoctorId) {
      alert("Please fill all fields and select Head Doctor");
      return;
    }

    setLoading(true);

    try {
      // TODO: Gửi API thực tế
      /*
      const res = await fetch("http://localhost:8080/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: departmentName,
          email: departmentEmail,
          phoneNumber: departmentPhone,
          headDoctorId: headDoctorId
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const result = await res.json();
      */

      await new Promise((resolve) => setTimeout(resolve, 1000)); // giả lập

      setLoading(false);
      alert("Department created successfully!");
    
    } 
    catch (err) {
      console.error(err);
      setLoading(false);
    
    }
  };

  return (
    <div className={styles.pageContainer}>
        {/* phần trên cùng */}
        <div className={styles.divTop}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>⬅ Back</button>
            <h2 className={styles.titleh2}>Create New Department</h2>
        </div>

        <div className={styles.duoi}>
            <div className={styles.left}>
                <LeftMenu/>
            </div>

            {/* phần hiển thị thông tin để input*/}
            <div className={styles.divBottom}>
                <div className={styles.formGroup}>
                    <label>
                        Department Name:
                        <input type="text" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
                    </label>
                    <label>
                        Email:
                        <input type="email" value={departmentEmail} onChange={(e) => setDepartmentEmail(e.target.value)} />
                    </label>
                    <label>
                        Phone:
                        <input type="text" value={departmentPhone} onChange={(e) => setDepartmentPhone(e.target.value)} />
                    </label>

                    {/* chọn bác sĩ */}
                    <label>
                        Head Doctor ID: <span>{headDoctorId}</span>
                    </label>
                    <button onClick={handleOpenDoctorTable}>Select Head Doctor</button>

                    {/*hiển thị thông tin */}
                    {showDoctorTable && (
                        <div className={styles.doctorTable}>
                        {loading ? (
                            <p>Loading doctors...</p>
                        ) : (
                            <table>
                            <thead>
                                <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Position</th>
                                <th>Specialty</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctorList.map((doc) => (
                                <tr key={doc.id}>
                                    <td>{doc.id}</td>
                                    <td>{doc.name}</td>
                                    <td>{doc.gender}</td>
                                    <td>{doc.phone}</td>
                                    <td>{doc.position}</td>
                                    <td>{doc.specialty}</td>
                                    <td>
                                    <button onClick={() => handleSelectDoctor(doc.id)}>Select</button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Submit */}
                <div className={styles.buttonGroup}>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
                </div>
            </div>
        </div>

    </div>
  );
}
