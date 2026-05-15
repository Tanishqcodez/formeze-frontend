import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Landing from "./components/landing";
import Documentation from "./components/documentation";
import Navbar from "./components/navbar";
import Help from "./components/help";
import Support from "./components/contact";
import Login from "./components/login";
import Verification from "./components/verification";
import Verify from "./components/verify";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword";
import Dashboard from "./components/dashboard";
import NotFound from "./components/notfound";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/help" element={<Help />} />
         <Route path="/support" element={<Support />} />
         <Route path="/login" element={<Login />} />
         <Route path="/verification" element={<Verification />} />
         <Route path="/verify/:id" element={<Verify />} />
         <Route path="/forgot" element={<ForgotPassword />} />
         <Route path="/reset/:id" element={<ResetPassword />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
