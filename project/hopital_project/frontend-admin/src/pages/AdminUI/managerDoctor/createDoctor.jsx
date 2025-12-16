import { useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./createDoctor.module.css";
import LeftMenu from "../../../components/doctor/LeftMenuDoctor";

export default function CreateDoctor() {
    const navigate = useNavigate();

    // 1 state object duy nhất cho doctor
    const [doctor, setDoctor] = useState({
        account: "",
        password: "",

        name: "",
        birthDate: "",
        gender: "",
        weight: "",
        height: "",
        cccd: "",
        address: "",
        phone: "",
        email: "",
        specialty: "",
        position: "",
        departmentId: "",
        qualification: "",
        startDate: "",
        status: "Active"
    });

    const [loading, setLoading] = useState(false);



    // 2 submit
    const handleSubmit = async () => {
        // kiểm tra các trường bắt buộc
        const requiredFields = ["name", "birthDate", "gender", "cccd", "phone", "specialty", "position", "password", "account"];
        for (let field of requiredFields) 
        {
            if (!doctor[field]) 
            {
                alert(`Please fill the required field: ${field}`);
                return;
            }
        }

        setLoading(true);

        try {
        // TODO: Gửi API thực tế
        /*
        const res = await fetch("http://localhost:8080/api/doctors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(doctor),
        });
        if (!res.ok) throw new Error("Create failed");
        const result = await res.json();
        */

        await new Promise((resolve) => setTimeout(resolve, 1000)); // giả lập

        setLoading(false);
        alert("Doctor created successfully!");

        } 
        catch (err) 
        {
            console.error(err);
            setLoading(false);
        }
    };

    

    // 3 helper để update field
    const handleChange = (field, value) => {
        setDoctor({ ...doctor, [field]: value });
    };

  return (
    <div className={styles.pageContainer}>
        {/*trên*/}
        <div className={styles.divTop}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>⬅ Back</button>
            <h2 className={styles.titleh2}>Create New Doctor</h2>
        </div>

        {/* dưới */}
        <div className={styles.duoi}>

            <div className={styles.left}>
            <LeftMenu/>
            </div>

            <div className={styles.divBottom}>
                <div className={styles.formGroup}>
                    {/*thông tin định danh*/}
                    <div className = {styles.con}>
                        <h3>Identification</h3>

                        <label>
                        Name*:
                        <input required type="text" value={doctor.name} onChange={(e) => handleChange("name", e.target.value)} />
                        </label>

                        <label>
                        Birth Date*:
                        <input required type="date" value={doctor.birthDate} onChange={(e) => handleChange("birthDate", e.target.value)} />
                        </label>

                        <label>
                        Gender*:
                        <select required value={doctor.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        </label>

                        <label>
                        Weight:
                        <input type="number" value={doctor.weight} onChange={(e) => handleChange("weight", e.target.value)} />
                        </label>

                        <label>
                        Height:
                        <input type="number" value={doctor.height} onChange={(e) => handleChange("height", e.target.value)} />
                        </label>

                        <label>
                        CCCD*:
                        <input required type="text" value={doctor.cccd} onChange={(e) => handleChange("cccd", e.target.value)} />
                        </label>
                    </div>
                    
                    {/* thông tin liên lạc */}
                    <div className={styles.con}>
                        <h3>Contact</h3>

                        <label>
                        Address:
                        <input type="text" value={doctor.address} onChange={(e) => handleChange("address", e.target.value)} />
                        </label>

                        <label>
                        Phone*:
                        <input required type="text" value={doctor.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                        </label>

                        <label>
                        Email:
                        <input type="email" value={doctor.email} onChange={(e) => handleChange("email", e.target.value)} />
                        </label>

                    </div>
                </div>

                <div className={styles.formGroup}>
                    {/* thông tin nghề nghiệp */}
                    <div className={styles.con}>
                        <h3>profession</h3>

                        <label>
                        Specialty*:
                        <input required type="text" value={doctor.specialty} onChange={(e) => handleChange("specialty", e.target.value)} />
                        </label>

                        <label>
                        Position*:
                        <input required type="text" value={doctor.position} onChange={(e) => handleChange("position", e.target.value)} />
                        </label>

                        <label>
                        Department ID:
                        <input type="text" value={doctor.departmentId} onChange={(e) => handleChange("departmentId", e.target.value)} />
                        </label>

                        <label>
                        Qualification:
                        <input type="text" value={doctor.qualification} onChange={(e) => handleChange("qualification", e.target.value)} />
                        </label>

                        <label>
                        Start Date:
                        <input type="date" value={doctor.startDate} onChange={(e) => handleChange("startDate", e.target.value)} />
                        </label>
                        
                        <label>
                        Status:
                        <select value={doctor.status} onChange={(e) => handleChange("status", e.target.value)}>
                            <option value="Active">Active</option>
                            <option value="On leave">On leave</option>
                            <option value="Retired">Retired</option>
                        </select>
                        </label>
                    </div>

                    <div className={styles.con}>
                        <h3>Account</h3>

                        <label>
                        Account*:
                        <input required type="text" value={doctor.account} onChange={(e) => handleChange("account", e.target.value)} />
                        </label>

                        <label>
                        Password*:
                        <input required type="text" value={doctor.password} onChange={(e) => handleChange("password", e.target.value)} />
                        </label>
                    </div>
                    

                    <div className={styles.buttonGroup}>
                        <button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Creating..." : "Submit"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
}