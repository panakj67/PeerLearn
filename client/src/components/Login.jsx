import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast  from 'react-hot-toast';
import axios from 'axios'

import { useNavigate } from 'react-router-dom';
import { hideLogin, setUser, userLogin } from '../features/users/userSlice';

const Login = () => {
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate  = useNavigate()
    const dispatch = useDispatch()

    // const {setShowUserLogin, setUser, axios} = useContext(AppDataContext)
    const user = useSelector((state) => state.user.user)
    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const {data} = await axios.post(`/api/user/${state}`, { name, email, password})
            if(data.success){
                toast.success(data.message)
                if(state === "register"){
                    toast.success("50 points added to your account")
                }
                // console.log(data.user);
                dispatch(setUser(data.user))
                dispatch(hideLogin())
            }
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message)
        }
        
    }
    // console.log(user);


  return (
    <div onClick={() => dispatch(hideLogin())} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
        <form onSubmit={(e) => onSubmitHandler(e)} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 sm:w-[382px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-blue-600 font-semibold">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-600" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-blue-600 cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-blue-600 cursor-pointer">click here</span>
                </p>
            )}
            <button 
             className="bg-blue-600 hover:bg-blue-700 transition-all text-white text-lg w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login