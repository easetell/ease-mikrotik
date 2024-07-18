"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loader from '../common/Loader';
import { toast } from "react-toastify";
import { Mail, Eye, EyeOffIcon, User } from "lucide-react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <form encType="multipart/form-data">
            <div className="mb-4">
                <label htmlFor="fullName" className="mb-2.5 block font-medium text-white">
                    Full Names
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your name"
                        className="w-full rounded-lg border py-[15px] pl-6 pr-11 font-medium outline-none focus-visible:shadow-none border-dark-3 bg-dark-2 text-white focus:border-primary"
                    />
                    <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                        <User />
                    </span>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="mb-2.5 block font-medium text-white">
                    Email
                </label>
                <div className="relative">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        id="email"
                        name="email"
                        className="w-full rounded-lg border py-[15px] pl-6 pr-11 font-medium outline-none focus-visible:shadow-none border-dark-3 bg-dark-2 text-white focus:border-primary"
                    />
                    <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                        <Mail />
                    </span>
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="password" className="mb-2.5 block font-medium text-white">
                    Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        autoComplete="off"
                        className="w-full rounded-lg border py-[15px] pl-6 pr-11 font-medium outline-none focus:border-primary focus-visible:shadow-none border-dark-3 bg-dark-2 text-white"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-1 pt-1 right-0 flex items-center px-5 text-sm text-gray-600 dark:text-gray-400 focus:outline-none"
                    >
                        {showPassword ? <Eye /> : <EyeOffIcon />}
                    </button>
                </div>
            </div>
            <div className="mb-5">
                <label htmlFor="retypePassword" className="mb-2.5 block font-medium text-white">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="retypePassword"
                        name="retypePassword"
                        placeholder="Confirm your password"
                        autoComplete="off"
                        className="w-full rounded-lg border py-[15px] pl-6 pr-11 font-medium outline-none focus:border-primary focus-visible:shadow-none border-dark-3 bg-dark-2 text-white"
                    />
                    <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-1 pt-1 right-0 flex items-center px-5 text-sm text-gray-600 dark:text-gray-400 focus:outline-none"
                    >
                        {showConfirmPassword ? <Eye /> : <EyeOffIcon />}
                    </button>
                </div>
            </div>
            {/* <div className="mb-5">
                <label htmlFor="role" className="block mb-2.5 text-sm font-medium text-white">
                    Role
                </label>
                <select
                    className="appearance-none text-sm rounded-lg py-[15px] pl-6 pr-11 outline-none focus:ring-primary-600 block w-full bg-dark-2 border-gray-600 placeholder-gray-400 text-white focus:ring-primary focus:border-primary"
                    id="role"
                    name="role"
                >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                        <option key={role._id} value={role.name}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div> */}
            <div className="mb-6 flex items-center justify-between gap-2 py-2">
                <label htmlFor="remember" className="flex cursor-pointer select-none items-center font-satoshi text-base font-medium text-white">
                    <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        className="peer sr-only bg-dark-2"
                    />
                    <span
                        className="mr-2.5 inline-flex h-5.5 w-5.5 items-center justify-center rounded-md border border-stroke bg-white text-white text-opacity-0 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-opacity-100 dark:border-stroke-dark dark:bg-white/5"
                    >
                        <svg
                            width="10"
                            height="7"
                            viewBox="0 0 10 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.70692 0.292787C9.89439 0.480314 9.99971 0.734622 9.99971 0.999786C9.99971 1.26495 9.89439 1.51926 9.70692 1.70679L4.70692 6.70679C4.51939 6.89426 4.26508 6.99957 3.99992 6.99957C3.73475 6.99957 3.48045 6.89426 3.29292 6.70679L0.292919 3.70679C0.110761 3.51818 0.00996641 3.26558 0.0122448 3.00339C0.0145233 2.74119 0.119692 2.49038 0.3051 2.30497C0.490508 2.11956 0.741321 2.01439 1.00352 2.01211C1.26571 2.00983 1.51832 2.11063 1.70692 2.29279L3.99992 4.58579L8.29292 0.292787C8.48045 0.105316 8.73475 0 8.99992 0C9.26508 0 9.51939 0.105316 9.70692 0.292787Z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                    Remember me
                </label>
                <Link href="#" className="select-none font-satoshi text-base font-medium underline duration-30 text-white hover:text-primary">
                    Forgot Password?
                </Link>
            </div>
            <div className="mb-4.5">
                <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
                >
                    Login
                </button>
            </div>
        </form>
    );
}
