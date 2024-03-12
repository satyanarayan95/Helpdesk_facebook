// import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import GuestGuard from '@/guards/GuestGuard';
import AuthGuard from '@/guards/AuthGuard';
import DashboardLayout from '@/components/DashboardLayout';
import { LoginPage } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';
import { ChatWindow } from '@/pages/ChatWindow';
import { ConnectFacebook } from '@/pages/ConnectFacebook';
import NotFoundPage from '@/pages/NotFound';


// const Loadable = (Component) => (props) => {
//   return (
//     <Suspense fallback={<h3>Loading</h3>}>
//       <Component {...props} />
//     </Suspense>
//   );
// };

// const LoginPage = Loadable(lazy(() => import('@/pages/Login')));
// const SignUp = Loadable(lazy(() => import('@/pages/SignUp')));


export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'signup',
          element: (
            <GuestGuard>
              <SignUp />
            </GuestGuard>
          ),
        }
      ],
    },

    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <ChatWindow />, index: true },
      ],
    },
    {
      path: 'connect-fb',
      element: (
        <AuthGuard>
          <ConnectFacebook />
        </AuthGuard>
      )
    },
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    { path: '*', element: <NotFoundPage /> }
  ]);
}