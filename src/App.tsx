import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AuthGate from "./components/AuthGate";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/Auth";

function Protected({ children }: { children: React.ReactNode }) {
  // Optional wrapper if you want a shared layout around protected pages
  return <AuthGate>{children}</AuthGate>;
}

export default function App() {
  const loc = useLocation();
  return (

      <div className="flex-1 min-w-0">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to={loc?.state?.from ?? "/"} />} />
        </Routes>
      </div>
  );
}
