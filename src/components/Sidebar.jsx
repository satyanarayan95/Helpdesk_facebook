import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { InboxIcon, LineChartIcon, LogOut, Users } from "lucide-react";
import { useDispatch } from "react-redux";

import Logo from "../assets/logo.png";
import DefaultUserImage from "../assets/user.png";
import { logout } from "@/features/auth/authSlice";

export const Sidebar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { pathname } = location;
    const [selectedItem, setselectedItem] = useState(0);
    const sideItems = [
        {
            name: "chats",
            link: "/dashboard",
            icon: <InboxIcon className={selectedItem.id === 1 ? "text-blue"  : "text-white"} />,
            id: 1
        },
        {
            name: "integrations",
            link: "/connect-fb",
            icon: <Users className={selectedItem.id === 2 ? "text-blue"  : "text-white"} />,
            id: 2
        },
        {
            name: "analysis",
            link: "/dashboard/analysis",
            icon: <LineChartIcon className={selectedItem.id === 3 ? "text-blue"  : "text-white"} />,
            id: 3
        }
    ];
    console.log({pathname, selectedItem});

    useEffect(() => {
        const id = sideItems.filter(item => item.link === pathname);
        setselectedItem(id[0])
    }, [pathname])

    return (
        <div className="flex flex-col items-center gap-6 h-full max-h-[100%] pb-4 bg-sky-800">
            <div className="flex items-center justify-center p-3">
                <img src={Logo} className="h-8 w-8" />
            </div>

            {sideItems?.map((op) => (
                <div className={`flex items-center justify-center gap-8 flex-col p-1 aspect-square w-full ${selectedItem.id === op.id ? "bg-white" : 'bg-transparent'}`}>
                    <Link to={op?.link} key={op?.name}>
                        {op.icon}
                    </Link>
                </div>
            ))}

            <div className="flex flex-col gap-5 items-center mt-auto">
                <LogOut
                    color="white"
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                        dispatch(logout());
                    }}
                />
                <div className="relative">
                    <img src={DefaultUserImage} alt="user" className="w-8" />
                    <div className="h-3 w-3 bg-lime-500 rounded-full absolute right-0 -bottom-[2px]"></div>
                </div>
            </div>
        </div>
    );
};
