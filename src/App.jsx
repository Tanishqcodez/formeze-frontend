import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Landing from "./components/landing";
import Documentation from "./components/documentation";
import Navbar from "./components/navbar";
import Help from "./components/help";
import Support from "./components/contact";
import Login from "./components/auth/login";
import Verification from "./components/auth/verification";
import Verify from "./components/auth/verify";
import ForgotPassword from "./components/auth/forgotPassword";
import ResetPassword from "./components/auth/resetPassword";
import Dashboard from "./components/dashboard";
import NotFound from "./components/notfound";
import NotVerified from "./components/auth/notVerified";
import PrivacyPage from "./components/privacy";
import TermsPage from "./components/terms";
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
         <Route path="/notverified" element={<NotVerified />} />
         <Route path="/privacy" element={<PrivacyPage />} />
         <Route path="/terms" element={<TermsPage />} />
         <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
