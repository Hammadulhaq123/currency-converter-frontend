import React from 'react';
import type {ReactNode} from "react"
import Navbar from '../components/common/Navbar';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
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
