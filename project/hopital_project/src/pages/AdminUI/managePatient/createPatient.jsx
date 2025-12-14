import { useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./createPatient.module.css";
import LeftMenu from "../../../components/patient/LeftMenuPatient";

export default function CreatePatient() {
    const navigate = useNavigate();

    // 1 state object duy nhất cho patient
    const [patient, setPatient] = useState({

        gender: "",
        birthDate: "",
        name: "",
        cccd: "",

        address: "",
        phone: "",
        email: "",

        insuranceNumber: "",
        status: "Active",

        account: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);



    // 2 submit
    const handleSubmit = async () => {
        // kiểm tra các trường bắt buộc
        const requiredFields = [
            "name",
            "birthDate",
            "gender",
            "cccd",
            "phone",
            "account",
            "password"
        ];
        for (let field of requiredFields) 
        {
            if (!patient[field]) 
            {
                alert(`Please fill the required field: ${field}`);
                return;
            }
        }

        setLoading(true);

        try {
            // TODO: Gửi API thực tế
            /*
            const res = await fetch("http://localhost:8080/api/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patient),
            });
            if (!res.ok) throw new Error("Create failed");
            const result = await res.json();
            */

            await new Promise((resolve) => setTimeout(resolve, 1000)); // giả lập

            setLoading(false);
            alert("patien created successfully!");


        } 
        catch (err) 
        {
            console.error(err);
            setLoading(false);
        }
    };

    

    // 3 helper để update field
    const handleChange = (field, value) => {
        setPatient({ ...patient, [field]: value });
    };

  return (
    <div className={styles.pageContainer}>
        {/*trên*/}
        <div className={styles.divTop}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>⬅ Back</button>
            <h2 className={styles.titleh2}>Create New Patient</h2>
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
                        <input required type="text" value={patient.name} onChange={(e) => handleChange("name", e.target.value)} />
                        </label>

                        <label>
                        Birth Date*:
                        <input required type="date" value={patient.birthDate} onChange={(e) => handleChange("birthDate", e.target.value)} />
                        </label>

                        <label>
                        Gender*:
                        <select required value={patient.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        </label>

                        <label>
                        CCCD*:
                        <input required type="text" value={patient.cccd} onChange={(e) => handleChange("cccd", e.target.value)} />
                        </label>
                    </div>
                    
                    {/* thông tin liên lạc */}
                    <div className={styles.con}>
                        <h3>Contact</h3>

                        <label>
                        Address:
                        <input type="text" value={patient.address} onChange={(e) => handleChange("address", e.target.value)} />
                        </label>

                        <label>
                        Phone*:
                        <input required type="text" value={patient.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                        </label>

                        <label>
                        Email:
                        <input type="email" value={patient.email} onChange={(e) => handleChange("email", e.target.value)} />
                        </label>

                    </div>
                </div>

                <div className={styles.formGroup}>
                    {/* thông tin khác */}
                    <div className={styles.con}>
                        <h3>Other</h3>

                        <label>
                        Insurance_number:
                        <input type="text" value={patient.insuranceNumber} onChange={(e) => handleChange("insuranceNumber", e.target.value)} />
                        </label>
                        
                        <label>
                        Status:
                        <select value={patient.status} onChange={(e) => handleChange("status", e.target.value)}>
                            <option value="Active">Active</option>
                            <option value="Discharge">On leave</option>
                            <option value="Deceased">Retired</option>
                        </select>
                        </label>
                    </div>

                    <div className={styles.con}>
                        <h3>Account</h3>

                        <label>
                        Account*:
                        <input required type="text" value={patient.account} onChange={(e) => handleChange("account", e.target.value)} />
                        </label>
                        
                        <label>
                        Password*:
                        <input required type="text" value={patient.password} onChange={(e) => handleChange("password", e.target.value)} />
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