import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";

function FullPageLoader() {
  return (
    <div className="grid min-h-screen place-items-center text-sm text-slate-500">
      Loading…
    </div>
  );
}

// Pages that need a logged-in user
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}

// Login/register: logged-in users get sent into the app
export function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;
  if (user) {
    return (
      <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />
    );
  }

  return <Outlet />;
}
