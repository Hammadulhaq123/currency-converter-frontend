import  { useState } from 'react';
import Cookies from 'js-cookie';
import axios from "../../axios"
import { ErrorToast } from './Toaster';
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)
 const toggleDropdpwn = () => {
    setDropdownOpen((prev:boolean) => !prev);
  };


 const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;

    const getInitials = (user:any) => {
        const nameParts = user?.name?.trim().split(" ").filter(Boolean);
        if (!nameParts || nameParts.length === 0) return "";

        const firstInitial = nameParts[0][0];
        const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";

        return `${firstInitial}${lastInitial}`.toUpperCase();
    };

    const clearAuthCookies = (): void => {
        Cookies.remove('user');
        Cookies.remove('token');
        Cookies.remove('firebaseUser');

        // Clear from all possible paths and domains if needed
        Cookies.remove('user', { path: '/' });
        Cookies.remove('token', { path: '/' });
        Cookies.remove('firebaseUser', { path: '/' });
    };


    const [loading, setLoading] = useState(false)
    const logout = async () => {
        try {
            setLoading(true)
            const response = await axios.post('/auth/logout');
            if (response?.data) {
                clearAuthCookies();
                setDropdownOpen(false)
                navigate("/login")

            }
        } catch (error: any) {
            ErrorToast(error.message || "Something went wrong.")
        } finally{
            setLoading(false)
        }



  
};

console.log(loading)


  return (
    <nav className="w-full px-4 md:px-0 relative h-16 flex items-center justify-start bg-white  mx-auto max-w-7xl">
      <div className="w-full flex  items-center justify-between ">
          <img src="/logo.png" className="h-12" alt="Logo" />

      
        
        <div className="flex items-center md:order-2 space-x-1 md:space-x-0 rtl:space-x-reverse">
          <div className="relative">
            <button
              type="button"
                onClick={toggleDropdpwn}
              className="inline-flex gap-x-1 items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 rounded-lg cursor-pointer hover:bg-gray-100"
            >
                <span className='w-8 h-8 rounded-full bg-green-primary text-black text-md font-medium flex items-center justify-center'>
                    {user?.name ? getInitials(user) : "CC"}
                </span>
                {user?.name}
            </button>
            
           
          </div>

           {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-14 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg border border-gray-200 min-w-48">
                <ul className="py-2 font-medium" role="none">
                    <li>
                      <button
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={logout}
                      >
                        <div className="inline-flex items-center">
                         Logout
                        </div>
                      </button>
                    </li>
                </ul>
              </div>
            )}

         
        </div>
        
       
      </div>
    </nav>
  );
};

export default Navbar;