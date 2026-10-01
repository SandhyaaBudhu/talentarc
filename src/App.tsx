import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./store";
import Shell from "./components/Shell";
import { CandidateDrawer, Toast } from "./components/UI";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Pipeline from "./pages/Pipeline";
import Jobs from "./pages/Jobs";
import Interviews from "./pages/Interviews";
import Messages from "./pages/Messages";
export default function App() {
  return (
    <AppProvider>
      <Shell>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Shell>
      <CandidateDrawer />
      <Toast />
    </AppProvider>
  );
}
