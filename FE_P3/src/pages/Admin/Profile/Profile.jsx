import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextFields from "@/components/ui/TextFields";
import Button from "@/components/ui/Button";
import styles from "./style.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Avatar from "@mui/material/Avatar";
import { AuthContext } from "../../../providers/AuthProvider";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(
    user?.avatarUrl || "/avatars/admin.jpg"
  );
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      id: user?.id || "",
      username: user?.username || "",
      fullName: user?.fullName || "",
      email: user?.email || "",
      userType: user?.userType || "admin",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "/avatars/admin.jpg",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullName: Yup.string().required("Vui lòng nhập họ tên"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      phone: Yup.string().required("Vui lòng nhập số điện thoại"),
    }),
    onSubmit: (values) => {
      console.log("Dữ liệu đã lưu:", values);
      if (newAvatarFile) {
        console.log("Đang tải lên ảnh mới:", newAvatarFile.name);
      }
      setEditing(false);
    },
  });

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const userInitials = formik.values.fullName?.charAt(0).toUpperCase() || "A";

  return (
    <div className={styles.adminProfileWrapper}>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <h1 className={styles.profileTitle}>Hồ Sơ Admin</h1>
          <p className={styles.profileSubtitle}>
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>
        <div className={styles.profileContent}>
          <div className={`${styles.profileCard} ${styles.profileSidebar}`}>
            <div className={styles.avatarWrapper}>
              <div className={styles.profileAvatar}>
                <Avatar
                  src={avatarPreviewUrl}
                  alt={formik.values.fullName}
                  className={styles.muiAvatarOverride}
                >
                  {!avatarPreviewUrl && userInitials}
                </Avatar>
              </div>
              {editing && (
                <label className={styles.editAvatarButton}>
                  <CameraAltIcon fontSize="small" />
                  <input
                    type="file"
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <span>Edit avatar</span>
                </label>
              )}
            </div>
            <h2 className={styles.profileName}>{formik.values.fullName}</h2>
            <p className={styles.profileEmail}>{formik.values.email}</p>
            <span className={styles.profileRole}>{formik.values.userType}</span>
            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>ID</span>
                <span className={styles.statValue}>{formik.values.id}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Username</span>
                <span className={styles.statValue}>
                  {formik.values.username}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Loại tài khoản</span>
                <span className={styles.statValue}>
                  {formik.values.userType}
                </span>
              </div>
            </div>
            <Button
              content={editing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
              onClick={() => {
                setEditing(!editing);
                if (editing) {
                  formik.resetForm();
                  setNewAvatarFile(null);
                  setAvatarPreviewUrl(user?.avatarUrl || "/avatars/admin.jpg");
                }
              }}
              variant="outlined"
            />
          </div>

          <div className={styles.profileMain}>
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>
                <AccountCircleIcon /> Thông Tin Cá Nhân
              </h3>

              {!editing ? (
                <>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Họ và Tên</span>
                      <span className={styles.infoValue}>
                        {formik.values.fullName}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Email</span>
                      <span className={styles.infoValue}>
                        {formik.values.email}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Số Điện Thoại</span>
                      <span className={styles.infoValue}>
                        {formik.values.phone}
                      </span>
                    </div>
                  </div>
                  <div className={styles.bioWrapper}>
                    <span className={styles.infoLabel}>Giới Thiệu</span>
                    <p className={styles.infoValue}>
                      {formik.values.bio || "---"}
                    </p>
                  </div>
                </>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <TextFields
                        label="Họ và Tên"
                        name="fullName"
                        formik={formik}
                      />
                    </div>
                    <div className={styles.infoItem}>
                      <TextFields label="Email" name="email" formik={formik} />
                    </div>
                    <div className={styles.infoItem}>
                      <TextFields
                        label="Số Điện Thoại"
                        name="phone"
                        formik={formik}
                      />
                    </div>
                    <div className={styles.infoItem}>
                      <TextFields
                        label="Địa Chỉ"
                        name="address"
                        formik={formik}
                      />
                    </div>
                  </div>
                  <div className={styles.bioWrapper}>
                    <TextFields
                      label="Giới Thiệu (Bio)"
                      name="bio"
                      formik={formik}
                      multiline
                      rows={4}
                    />
                  </div>
                  <div className={styles.actions}>
                    <Button content="Lưu thay đổi" type="submit" />
                    <Button
                      content="Hủy"
                      variant="outlined"
                      onClick={() => setEditing(false)}
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
