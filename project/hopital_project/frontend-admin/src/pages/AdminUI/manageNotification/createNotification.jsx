import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './createNotification.module.css'

export default function CreateNotification()
{
    // 1 state
    // 1.1 nội dung thông báo
    const [notification, setNotification] = useState({
        type: "Notification",
        startTime: "",
        endTime: "",
        content: "",
    })
    const navigate = useNavigate();

    // 1.2 chọn người nhận
    // - chọn theo department Id + role 
    // - chọn nhóm người cụ thể từ input
    // danh sách sẽ được nhận thông báo
    const [receiver, setReceiver] = useState([]);
    const [role, setRole] = useState("doctor"); 
    const [selectGroup, setSelectGroup] = useState("");

    // danh sách gửi vê từ server để chọn
    const [listReceiver, setListReceiver] = useState([]);
    
    const [allDoctors, setAllDoctors] = useState([]);
    const [allPatients, setAllPatients] = useState([]);
 
    // hàm xử lý khi chọn selectGroup
    
    
    useEffect(() => {
        const fetchListReceiver = async () => {
            try {
                const [docRes, patRes] = await Promise.all([
                    fetch("http://localhost:8080/api/doctors"),
                    fetch("http://localhost:8080/api/patients"),
                ]);

                if (!docRes.ok || !patRes.ok) throw new Error("Fetch failed");

                const doctors = await docRes.json();
                const patients = await patRes.json();

                setAllDoctors(doctors);
                setAllPatients(patients);
            } catch (err) {
                console.error(err);
            }
        };
        fetchListReceiver();
    }, []);

    
    /*  Đổi role => đổi data trong RA*/
    useEffect(() => {
        const data = role === "doctor" ? allDoctors : allPatients;
        setListReceiver(data);
        setReceiver(data);
        resetSearch();
    }, [role, allDoctors, allPatients]);

    //1.3 lọc
    const [search, setSearch] = useState({
        departmentId: "",
        phone: "",
        id: "",
        name:""
    })

    const resetSearch = () => {
        setSearch({
            id: "",
            name: "",
            departmentId: "",
            phone: "",
        });
    };


    const handleSearch = (field, value) => {
        // 1 Cập nhật state search
        const newSearch = { ...search, [field]: value };
        setSearch(newSearch);

        // 2 Lọc theo các trường, bỏ qua nếu rỗng
        const filtered = listReceiver.filter((d) => {
            return (
                (!newSearch.name || d.name.toLowerCase().includes(newSearch.name.toLowerCase())) &&
                (!newSearch.phone || d.phone.toString().includes(newSearch.phone)) &&
                (!newSearch.id || d.id.toString().includes(newSearch.id)) &&
                (!newSearch.departmentId || d.departmentId.toString().includes(newSearch.departmentId))
            );
        });
    
        //3 Cập nhật danh sách filtered
        setReceiver(filtered);
    };

    //2 viết notificaion
    // 2.1 type
    const handleNotificationChange = (field, value) => {
        // 2.1 Cập nhật type cho notification
        const newNotification = {...notification, [field]: value};
        setNotification(newNotification);
    }

    // 3 submid
    const handleSubmit = async () => {
        return;// tạm thời
        if (!notification.content.trim()) {
            alert("bạn chưa điền nội dung");
            return;
        }

        if (!notification.startTime || !notification.endTime) {
            alert("start time và End time chưa điền");
            return;
        }

        // 2. Xác định danh sách người nhận
        let receiverIds = [];

        if (selectGroup === "*") {
            // gửi tất cả theo role
            receiverIds = listReceiver.map(r => r.id);
        } 
        else if (selectGroup === "Other") 
        {
            if (receiver.length === 0) 
            {
                alert("bạn chưa chọn người nhận");
                return;
            }
            receiverIds = receiver.map(r => r.id);
        } 
        else 
        {
            alert("hãy chọn người nhận");
            return;
        }

        // 3. Payload gửi backend
        const payload = {
            ...notification,
            role,               // doctor | patient
            receiverIds,        // danh sách ID
        };

        try {
            const res = await fetch("http://localhost:8080/api/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Create notification failed");

            alert("Notification đã gửi thành công");
            
        } 
        catch (err) 
        {
            console.error(err);
            alert("Error sending notification");
        }
    };




    return(
        <div className = {styles.container}>
            

            <div className={styles.divBottom}>
                {/* 1 chọn người nhận */}
                <div className={styles.divSelectReceiver}>
                    {/* 1.1 chọn role */}
                    <select value = {role} onChange={(e) => {setRole(e.target.value);}}> 
                        <option value = "doctor">Bác sĩ </option>
                        <option value = "patient"> Bệnh nhân </option>
                    </select>

                    {/* 1.2 chọn nhóm người nhận */}
                    <select value = {selectGroup} onChange={(e) => {setSelectGroup(e.target.value)}}> 
                        <option value = ""> Chọn người nhận</option>
                        <option value = "*"> Tất cả</option>
                        <option value = "Other"> Khác </option>
                    </select>

                    {/* những người nhận cụ thể */}
                    {(selectGroup === "Other") && (
                        <div> 
                            {/* lọc và tìm kiếm */}
                            <div>
                                <input 
                                type="text"
                                placeholder="Tìm theo ID"
                                value={search.id}
                                onChange={(e) => handleSearch("id", e.target.value)}
                                />
                                <input 
                                type="text"
                                placeholder="Tìm theo tên"
                                value={search.name}
                                onChange={(e) => handleSearch("name", e.target.value)}
                                />
                                <input 
                                type="text"
                                placeholder="Tìm theo Id của khoa"
                                value={search.departmentId}
                                onChange={(e) => handleSearch("departmentId", e.target.value)}
                                />
                                <input 
                                type="number"
                                placeholder="Tìm theo số điện thoại"
                                value={search.phone}
                                onChange={(e) => handleSearch("phone", e.target.value)}
                                />
                            </div>

                            {/* kết quả */} 
                            <table>
                                <thead>
                                    <tr>
                                        <th> STT </th>
                                        <th> ID</th>
                                        <th> Tên </th>
                                        <th> Giới tính </th>
                                        <th> Số điện thoại </th>
                                        <th> Trạng trái</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* hiển thị danh sách patient của trang hiện tại: listPatientsCurrentPage ko phải patients */}
                                    {receiver.map((recei, index) => (
                                        <tr key={recei.id}>
                                            <td>{index + 1}</td>
                                            <td>{recei.id}</td>
                                            <td>{recei.name}</td>
                                            <td>{recei.gender}</td>
                                            <td>{recei.phone}</td>
                                            <td>{recei.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(selectGroup === "*") && (
                        <div className ={styles.divSelectReceiver}>
                            <p> <strong> Gửi tới tất cả {role}s trong bệnh viện</strong></p>
                        </div>
                    )}


                </div>

                {/* 2 viết nội dung gửi */}
                <div className={styles.divSend}>
                    <select value = {notification.type} onChange={(e) => {handleNotificationChange("type", e.target.value)}}> 
                        <option value = "Notification"> Thông báo </option>
                        <option value = "Appointment"> Lịch hẹn </option>
                        <option value = "Result"> Kết quả </option>
                    </select>

                    <label>
                        Thời gian bắt đầu
                        <input
                        type="datetime-local"
                        value={notification.startTime}
                        onChange={(e) => handleNotificationChange("startTime", e.target.value)}
                        />
                    </label>

                    <label>
                        Thời gian kết thúc
                        <input
                        type="datetime-local"
                        value={notification.endTime}
                        onChange={(e) => handleNotificationChange("endTime", e.target.value)}
                        />
                    </label>
                    <label>
                        Nội dung
                        <textarea
                            className={styles.textareaContent}
                            value={notification.content}
                            onChange={(e) => handleNotificationChange("content", e.target.value)}
                            rows={6}
                            placeholder="Nhập nội dung..."
                        />
                    </label>

                </div>

                <button className = {styles.buttonSubmit}
                onClick={handleSubmit}
                > Xác nhận </button>

            </div>
        </div>
    )

}