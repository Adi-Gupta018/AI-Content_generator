//* create a function that will return a promise 
//* this is what react query want
import axios from 'axios'
//!backend url
// registration
const url = "https://aicg.onrender.com";
const local = "http://localhost:8090";
export const registerApi = async(userData) =>{
    const response = await axios.post(url+'/api/v1/users/register',{
        username : userData?.username,
        email: userData?.email,
        password: userData?.password,
    },
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    return response?.data;
}

// Login

export const loginApi = async(userData) =>{
    const response = await axios.post(url+'/api/v1/users/login',{
        email: userData?.email,
        password: userData?.password,
    },
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    return response?.data;
}

// checkAuth
export const checkUserAuthStatusApi = async() =>{
    const response = await axios.get(url+'/api/v1/users/auth/check',
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    return response?.data;
}

// Logout
export const logoutApi = async() =>{
    const response = await axios.post(url+'/api/v1/users/logout',{},
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    return response?.data;
}
// Get User Profile
export const profileApi = async() =>{
    const response = await axios.get(url+'/api/v1/users/profile',
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    return response?.data;
}