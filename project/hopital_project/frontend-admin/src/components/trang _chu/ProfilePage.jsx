import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import styles from "./ProfilePage.module.css";
import { jwtDecode } from "jwt-decode";

// nhận thông tin admin, hàm  để quay lại dashboard, hàm lưu thông tin 
export default function ProfilePage({ admin, onBack, onUpdateAdmin }) {

  // 1 khai báo biến
  // 1.1 state user
  const [user, setUser] = useState({
    id: admin?.sub || "",
    fullName: admin?.fullName || "",
    email: admin?.email || "",
    phone: admin?.phone || "",
  });

  // 1.2 state  các trường dữ liệu thay đổi
  const [editField, setEditField] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);// costhay đổi mật khẩu ko
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 1.3 thông báo lỗi email,password
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  // 2 khai báo hàm
  // 2.1 effect khi render thì lấy thông tin
  useEffect(() => {
    if (admin) {
      setUser({
        id: admin.sub || "",
        fullName: admin.fullName || "",
        email: admin.email || "",
        phone: admin.phone || "",
      });
    }
  }, [admin]);

  // 2.2 hàm thay đổi dữ liệu người dùng cập nhật thông tin xong
  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    if (field === "email") setErrorEmail("");// set lại lỗi email
  };


  // 2.3 hàm lưu thay đổi
  const handleSaveChanges = async () => {
    setErrorEmail("");
    setErrorPassword("");

    // nếu có thay đổi mật khẩu nhưng mật khẩu cũ và mới rỗng
    if (isChangingPassword && (!oldPassword || !newPassword)) {
      setErrorPassword("Vui lòng nhập đủ mật khẩu cũ và mới");
      return;
    }

    // nếu oke thì gọi api đổi thông tin
    try {
      const token = localStorage.getItem("token");

      const body = {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      };

      if (isChangingPassword) {
        body.oldPassword = oldPassword;
        body.newPassword = newPassword;
      }


      const res = await fetch(
        `http://127.0.0.1:3000/admins`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) 
      {
        // nếu mỗi bao gồm có email
        if (data.message?.includes("email")) 
        {
          setErrorEmail("Email đã được sử dụng");
        } 
        // nếu mỗi là có mật khẩu cũ
        else if (data.message?.includes("Mật khẩu cũ")) {
          setErrorPassword("Mật khẩu cũ không đúng");
        } 
        // nếu lỗi khác
        else alert(data.message || "Có lỗi xảy ra");
        return;
      }

      // thành công thì set lại
      alert("Cập nhật thành công!");
      setEditField("");
      setIsChangingPassword(false);
      setOldPassword("");
      setNewPassword("");

      // Cập nhật token mới nếu server trả
      if (data.access_token) 
      {
        localStorage.setItem("token", data.access_token);
        const decoded = jwtDecode(data.access_token);
        onUpdateAdmin(decoded);
      } 
      else 
      {
        onUpdateAdmin({...user, sub:admin.sub});
      }
      onBack();
    } 
    catch (err) {
      console.error(err);
      alert("Lỗi mạng");
    }
  };

  // 2.4 render ra từng label + dữ liệu + lỗi cho edit đó
  const renderInput = (label, field, error) => (
    // 1 div cha
    <div className={styles.formGroup}>
      
      {/* 1.1 tên label */}
      <label>{label}</label>

      {/* 1.2 div chứa input */}
      <div className={styles.inputContainer}>
        <input
          value={user[field]}
          disabled={editField !== field}
          onChange={(e) => handleChange(field, e.target.value)}
          className={editField === field ? styles.editing : ""}
        />
        {/* icon edit, click vào để edit  */}
        <FiEdit2 
          className={styles.editIcon}
          onClick={() =>
            setEditField(editField === field ? "" : field)
          }
        />
      </div>
      {/* 1.3 lỗi*/}
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );

  return (
    <div className={styles.profileRoot}>
      <h2>Hồ sơ</h2>

      <div className={styles.formGroup}>
        <label>ID</label>
        <input value={user.id} disabled />
      </div>

      {renderInput("Tên", "fullName","")}
      {renderInput("Email", "email", errorEmail)}
      {renderInput("Số điện thoại", "phone","")}

      <div className={styles.formGroup}>
        <button
          type="button"
          className={styles.changePasswordBtn}
          onClick={() => setIsChangingPassword(!isChangingPassword)}
        >
          {isChangingPassword ? "Hủy đổi mật khẩu" : "Đổi mật khẩu"}
        </button>
      </div>

      {isChangingPassword && (
        <>
          <div className={styles.formGroup}>
            <label>Mật khẩu cũ</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrorPassword("");
              }}
            />
            {errorPassword && (
              <div className={styles.errorText}>{errorPassword}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </>
      )}

      <div className={styles.buttonGroup}>
        <button onClick={onBack} className={styles.backButton}>
          Quay lại
        </button>
        <button className={styles.saveButton} onClick={handleSaveChanges}>
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
