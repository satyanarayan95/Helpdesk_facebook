import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function GuestGuard({ children }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to={"/dashboard"} />;
    }

    return <>{children}</>;
}
