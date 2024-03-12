import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function DashboardLayout() {
    const { isFacebookLinked } = useSelector((state) => state.fb);
    const navigate = useNavigate();
    useEffect(()=> {
        if(!isFacebookLinked) navigate('/connect-fb');
    },[])

    return (
        <div className="h-full w-full flex">
            <Sidebar />
            <Outlet />
        </div>
    )
}
