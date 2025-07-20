import React, { useEffect } from 'react';
import type {ReactNode} from "react"
import Navbar from '../components/common/Navbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  useEffect(()=>{
      if(!Cookies.get("token")){
        Cookies.remove("user")
        Cookies.remove("token")
          navigate("/login")
      }
  },[])
  return (
    <div className="w-full h-screen flex flex-col justify-start items-start">
      <Navbar />
      <div className="w-full h-[calc(100%-4rem)]">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
