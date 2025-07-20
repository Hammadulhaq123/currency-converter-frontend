import { signInWithPopup} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import type { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import axios from "../axios"
import { ErrorToast } from "../components/common/Toaster";

// Firebase
import { auth, googleProvider } from "../firebase/firebase"; // Adjust import as needed
import type React from "react";
import { useState } from "react";

const Login = () => {


// Types
interface FirebaseAuthResult {
  user: FirebaseUser;
}
interface AppUser {
  _id: string;
  name?: string;
  email: string;
  profilePicture?: string;
  signUpRecord?: string;
  uid?: string;
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthResponse {
  data: {
    data: {
      user: AppUser;
      token: string;
    };
  };
  status: number;
}

const [googleLoading, setGoogleLoading] = useState<boolean>(false)
const navigate = useNavigate()
const handleGoogleLogin = async (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
): Promise<void> => {
  e.preventDefault();

  try {
    setGoogleLoading(true);

    const result: FirebaseAuthResult = await signInWithPopup(auth, googleProvider);

    if (result?.user) {
      const token = await result.user.getIdToken();

      if (token) {
        try {
          const response: AxiosResponse<AuthResponse["data"]> = await axios.post("/auth/social-login", {
            role: "user",
            idToken: token,
          });

          if (response.status === 200 || response.status === 201) {
            const user = response.data.data.user;
            const appToken = response.data.data.token;

            Cookies.set("user", JSON.stringify(user), { expires: 60 });
            Cookies.set("token", appToken, { expires: 60 });
            Cookies.set("firebaseUser", JSON.stringify(result.user), { expires: 60 });
            navigate("/currencies");
          }
        } catch (error: any) {
          ErrorToast(error?.response?.data?.message || "Something went wrong");
        }
      }
    }
  } catch (err: any) {

    ErrorToast(err?.message || "Unknown error occurred");
  } finally {
    setGoogleLoading(false);
  }
};


    return (
        <main className="w-full flex">
            <div className="relative flex-1 hidden items-center justify-center h-screen bg-white lg:flex">
                <div className="relative z-10 w-full max-w-md">
                    <img src="/logo.png" width={150} />
                    <div className=" mt-16 space-y-3">
                        <h3 className="text-black text-3xl font-bold">Convert currencies and get precise converion rates.</h3>
                        <p className="text-gray-600">
                            Create an account and start converting currencies in just one tap.
                        </p>
                        <div className="flex items-center -space-x-2 overflow-hidden">
                            <img src="https://randomuser.me/api/portraits/women/79.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f" className="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e" className="w-10 h-10 rounded-full border-2 border-white" />
                            <p className="text-sm text-gray-600 font-medium translate-x-5">
                                Join 5.000+ users
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute inset-0 my-auto h-[500px]"
                    style={{
                        background:
                        "linear-gradient(180.92deg, rgba(132, 252, 192, 0.2) 4.54%, rgba(121, 249, 154, 0.26) 34.2%, rgba(132, 252, 192, 0.1) 45.55%)",
                        filter: "blur(118px)",
                    }}
                    ></div>

            </div>
            <div className="flex-1 flex items-center justify-center h-screen">
                <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
                    <div className="">
                        <img src="https://floatui.com/logo.svg" width={150} className="lg:hidden" />
                        <div className="mt-5 space-y-2">
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in</h3>
                            <p className="">Simply tap Login with google to continue? </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-3">
                        <button disabled={googleLoading} type="button" onClick={handleGoogleLogin} className="flex items-center gap-x-3 justify-center py-2.5 border rounded-lg  hover:bg-gray-50 duration-150 disabled:bg-gray-200 active:bg-gray-100">
                            <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_17_40)">
                                    <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                                    <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                                    <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                                    <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_17_40">
                                        <rect width="48" height="48" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="text-sm text-gray-800 font-medium ">
                                Login with google
                            </span>
                        </button>
                       
                    </div>
                    {/* <div className="relative">
                        <span className="block w-full h-px bg-gray-300"></span>
                        <p className="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto">Or continue with</p>
                    </div>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="space-y-5"
                    >
                        <div>
                            <label className="font-medium">
                                Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <button
                            className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                        >
                            Create account
                        </button>
                    </form> */}
                </div>
            </div>
        </main>
    )
}

export default Login