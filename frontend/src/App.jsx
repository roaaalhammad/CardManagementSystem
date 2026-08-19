import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";

import RequestsList from "./pages/comm-staff/RequestsList";
import RequestDetails from "./pages/comm-staff/RequestDetails";
import CardDesign from "./pages/comm-staff/CardDesign";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import CardRequest from "./pages/employee/CardRequest";
import EmployeeRequests from "./pages/employee/EmployeeRequests";
import EmployeeRequestDetails from "./pages/employee/EmployeeRequestDetails";
import Login from "./pages/employee/Login";

import backgroundTop from "./assets/background.png";
import backgroundBottom from "./assets/background-bottom.png";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerRequestsList from "./pages/manager/ManagerRequestsList";
import ManagerRequestDetails from "./pages/manager/ManagerRequestDetails";

/* =========================================================
   Main Layout
========================================================= */

function MainLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">

      {/* الزخرفة العلوية */}
      <img
        src={backgroundTop}
        alt=""
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          w-[600px]
          opacity-100
        "
      />

      {/* الزخرفة السفلية */}
      <img
        src={backgroundBottom}
        alt=""
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          w-[750px]
          opacity-100
        "
      />

      {/* الحاوية الرئيسية */}
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
          px-6
          py-10
        "
      >
        <div
          className="
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-lg
          "
        >

          {/* Header */}
          <Header />

          <Routes>

            {/* =================================================
                صفحات موظف الاتصالات
               ================================================= */}

            {/* الصفحة الرئيسية لموظف الاتصالات */}
            <Route
              path="/dashboard"
              element={<RequestsList />}
            />

            {/* الصفحة الرئيسية */}
            <Route
              path="/"
              element={<RequestsList />}
            />

            {/* تفاصيل طلب موظف الاتصالات */}
            <Route
              path="/requests/:id"
              element={<RequestDetails />}
            />

            {/* تصميم / طباعة البطاقة */}
            <Route
              path="/requests/:id/card"
              element={<CardDesign />}
            />


            {/* =================================================
                صفحات الموظف
               ================================================= */}

            {/* Dashboard الموظف */}
            <Route
              path="/employee/dashboard"
              element={<EmployeeDashboard />}
            />

            {/* =================================================
                واجهة إصدار البطاقة
               ================================================= */}

            <Route
              path="/card-request"
              element={<CardRequest />}
            />

            {/* =================================================
                قائمة طلبات الموظف

                الطلبات الجديدة
                الطلبات تحت الإجراء
                الطلبات السابقة
               ================================================= */}

            <Route
              path="/employee/requests"
              element={<EmployeeRequests />}
            />

            {/* =================================================
                تفاصيل طلب الموظف

                مثال:
                /employee/requests/418
               ================================================= */}

            <Route
              path="/employee/requests/:id"
              element={<EmployeeRequestDetails />}
            />

            {/* =================================================
                صفحات المدير المباشر
               ================================================= */}

            <Route
              path="/manager/dashboard"
              element={<ManagerDashboard />}
            />

            <Route
              path="/manager/requests"
              element={<ManagerRequestsList />}
            />

            <Route
              path="/manager/requests/:id"
              element={<ManagerRequestDetails />}
            />

            {/* =================================================
                المسارات غير المعروفة
               ================================================= */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>

        </div>
      </div>

    </div>
  );
}

/* =========================================================
   App
========================================================= */

export default function App() {
  return (
    <AuthProvider>

      <Routes>

        {/* =================================================
            تسجيل الدخول
           ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================================
            جميع صفحات النظام
           ================================================= */}

        <Route
          path="*"
          element={<MainLayout />}
        />

      </Routes>

    </AuthProvider>
  );
}