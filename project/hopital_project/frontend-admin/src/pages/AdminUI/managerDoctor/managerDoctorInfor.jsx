import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./managerDoctorInfor.module.css";
import LeftMenu from "../../../components/doctor/LeftMenuDoctor";

export default function EditDoctor() {
  const navigate = useNavigate();

  // 1 danh sách bác sĩ để search
  const [doctorList, setDoctorList] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 2 doctor hiện tại đang edit
  const [doctor, setDoctor] = useState({
    id: "",
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
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  // 3 khi vào page thì load danh sách bác sĩ từ server
  useEffect(() => {
    const fetchDoctors = async()=>{
      try 
      {
        const res = await fetch("http://localhost:8080/api/doctors"); // API lấy danh sách
        if (!res.ok) throw new Error("Cannot fetch doctors");
        const data = await res.json();
        setDoctorList(data);
      } 
      catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  // 4 xử lý gợi ý khi nhập searchId
  useEffect(() => {
    if (searchId === "") 
    {
      setSuggestions([]);
      return;
    }
    const filtered = doctorList.filter((d) => d.id.includes(searchId));
    setSuggestions(filtered);
  }, [searchId, doctorList]);

  // 5 khi chọn suggestion
  const handleSelectSuggestion = (selectedDoctor) => {
    setDoctor(selectedDoctor);
    setSearchId(selectedDoctor.id);
    setSuggestions([]);
  };

  // 6 tìm bác sĩ theo id khi bấm nút confirm
  const handleConfirmSearch = () => {
    const found = doctorList.find((d) => d.id === searchId);
    if (found) setDoctor(found);
    else {
      alert("Doctor not found");
      setDoctor({
        id: "",
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
        status: "Active",
      });
    }
  };

  // 7 helper để update field
  const handleChange = (field, value) => {
    setDoctor({ ...doctor, [field]: value });
  };

  // 8 submit chỉnh sửa
  const handleSubmit = async () => {
    if (!doctor.id) {
      alert("Please select a doctor first");
      return;
    }
    setLoading(true); //loading
    try 
    {
      const res = await fetch(`http://localhost:8080/api/doctors/${doctor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      });

      if (!res.ok) throw new Error("Update failed");
      setLoading(false);
      alert("Doctor updated successfully");
      navigate(-1);
    } 
    catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 9 delete doctor
  const handleDelete = async () => {
    if (!doctor.id) {
      alert("Please select a doctor first");
      return;
    }

    if(!window.confirm("Are you sure you want to delete this doctor?")) return;
    setLoading(true);
    try 
    {
      const res = await fetch(`http://localhost:8080/api/doctors/${doctor.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setLoading(false);
      alert("Doctor deleted successfully");
    } 
    catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/*1 trên */}
      <div className={styles.divTop}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
        <h2 className={styles.titleh2}>Edit Doctor Information</h2>
      </div>


      {/* 2 form chỉnh sửa */}
      <div className={styles.duoi}>

        {/* 2.1 */}
        <div className={styles.left}>
          <LeftMenu />
        </div>

        {/* 2.2 */}
        <div className={styles.divBottom}>
            {/* 2.2.1 tìm bác sĩ */}
            <div className={styles.searchSection}>
                <div className={styles.conSearch}> 
                    <input
                    type="text"
                    placeholder="Search doctor by ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    />

                    <button onClick={handleConfirmSearch}>Confirm</button>
                </div>
                
                <div className={styles.suggestions}>
                    {suggestions.map((d) => (
                        <div
                        key={d.id}
                        className={styles.suggestionItem}
                        onClick={() => handleSelectSuggestion(d)}
                        >
                        {d.id} - {d.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2.2.2 */}
            <div className={styles.parenFormGroup}>

            
                <div className={styles.formGroup}>
                    <div className={styles.con}>
                        <h3>Identification</h3>

                        <label>
                            Name*:
                            <input
                            required
                            type="text"
                            value={doctor.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            />
                        </label>

                        <label>
                            Birth Date*:
                            <input
                            required
                            type="date"
                            value={doctor.birthDate}
                            onChange={(e) => handleChange("birthDate", e.target.value)}
                            />
                        </label>

                        <label>
                            Gender*:
                            <select
                            required
                            value={doctor.gender}
                            onChange={(e) => handleChange("gender", e.target.value)}
                            >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            </select>
                        </label>

                        <label>
                            Weight:
                            <input
                            type="number"
                            value={doctor.weight}
                            onChange={(e) => handleChange("weight", e.target.value)}
                            />
                        </label>

                        <label>
                            Height:
                            <input
                            type="number"
                            value={doctor.height}
                            onChange={(e) => handleChange("height", e.target.value)}
                            />
                        </label>

                        <label>
                            CCCD*:
                            <input
                            required
                            type="text"
                            value={doctor.cccd}
                            onChange={(e) => handleChange("cccd", e.target.value)}
                            />
                        </label>
                    </div>

                    <div className={styles.con}>
                        <h3>Contact</h3>

                        <label>
                            Address:
                            <input
                            type="text"
                            value={doctor.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            />
                        </label>

                        <label>
                            Phone*:
                            <input
                            required
                            type="number"
                            value={doctor.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            />
                        </label>

                        <label>
                            Email:
                            <input
                            type="email"
                            value={doctor.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            />
                        </label>
                    </div>
                </div>
            
            
                {/* 2.2.3 */}
            
                <div className={styles.formGroup}>
                    <div className={styles.con}>
                        <h3>Profession</h3>

                        <label>
                            Specialty*:
                            <input
                            required
                            type="text"
                            value={doctor.specialty}
                            onChange={(e) => handleChange("specialty", e.target.value)}
                            />
                        </label>

                        <label>
                            Position*:
                            <input
                            required
                            type="text"
                            value={doctor.position}
                            onChange={(e) => handleChange("position", e.target.value)}
                            />
                        </label>

                        <label>
                            Department ID:
                            <input
                            type="text"
                            value={doctor.departmentId}
                            onChange={(e) => handleChange("departmentId", e.target.value)}
                            />
                        </label>

                        <label>
                            Qualification:
                            <input
                            type="text"
                            value={doctor.qualification}
                            onChange={(e) => handleChange("qualification", e.target.value)}
                            />
                        </label>

                        <label>
                            Start Date:
                            <input
                            type="date"
                            value={doctor.startDate}
                            onChange={(e) => handleChange("startDate", e.target.value)}
                            />
                        </label>

                        <label>
                            Status:
                            <select
                            value={doctor.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                            >
                            <option value="Active">Active</option>
                            <option value="On leave">On leave</option>
                            <option value="Retired">Retired</option>
                            </select>
                        </label>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Updating..." : "Update"}
                        </button>
                        <button onClick={handleDelete} disabled={loading}>
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
           </div>

        </div>
      </div>
    </div>
  );
}
