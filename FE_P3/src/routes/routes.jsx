import ClientLayout from "@components/Layouts/ClientLayout/ClientLayout";
import AdminLayout from "@components/Layouts/AdminLayout/AdminLayout";
import HomePage from "@pages/Client/HomePage/HomePage";
import Dashboard from "@pages/Admin/Dashboard/Dashboard";
import Patients from "@pages/Admin/Patients/Patients";
import Doctors from "@pages/Admin/Doctors/Doctors";
import Reports from "@pages/Admin/Reports/Reports";
import Settings from "@pages/Admin/Settings/Settings";
import DoctorPage from "@pages/Client/DoctorPage/DoctorPage";
import AboutUsPage from "@pages/Client/AboutUsPage/AboutUsPage";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ProtectRoutes from "./ProtectRoutes";
import Profile from "../pages/Admin/Profile/Profile";
import DoctorDetail from "../pages/Client/DoctorPage/DoctorDetail";
import ProfilePatient from "../pages/Client/Profile/ProfilePatient";
import AdminSchedule from "../pages/Admin/Schedule/AdminSchedule";
import Specialty from "../pages/Admin/Specialty/Specialty";
import Contact from "../pages/Client/Contact/Contact";

const routes = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "doi-ngu-bac-si", element: <DoctorPage /> },
      { path: "profile", element: <ProfilePatient /> },
      { path: "ve-chung-toi", element: <AboutUsPage /> },
      { path: "lien-he", element: <Contact /> },
      { path: "dang-nhap", element: <Login /> },
      { path: "dang-ky", element: <Register /> },
      { path: "bac-si/:id", element: <DoctorDetail /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectRoutes>
        <AdminLayout />
      </ProtectRoutes>
    ),

    children: [
      { path: "bang-dieu-khien", element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "benh-nhan", element: <Patients /> },
      { path: "chuyen-khoa", element: <Specialty /> },
      { path: "bac-si", element: <Doctors /> },
      { path: "lich-lam-viec", element: <AdminSchedule /> },
      { path: "bao-cao", element: <Reports /> },
      { path: "cai-dat", element: <Settings /> },
    ],
  },
];

export default routes;
