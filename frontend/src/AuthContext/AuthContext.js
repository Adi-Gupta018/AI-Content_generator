import { createContext, useContext, useEffect, useState } from "react";
import { checkUserAuthStatusApi } from "../apis/user/usersApi";
import { useQuery } from "react-query"; //* it is use to make a query to a end point

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  //make request using react query
  const { isError, isLoading, data, isSuccess } = useQuery({
    queryFn: checkUserAuthStatusApi,
    queryKey: ["checkAuth"],
  });
  //update the user since we have the data
  useEffect(() => {
    if (isSuccess) {
        setIsAuthenticated(data);
    }
}, [data,isSuccess]);

  //update the user auth after login
  const login = () => {
    setIsAuthenticated(true);
  };
  //for logout
  const logout = () => {
    setIsAuthenticated(false);
    
  };

  return (
    <AuthContext.Provider
        value={{ isAuthenticated, isError, isLoading, isSuccess, login, logout }}
    >
        {children}
    </AuthContext.Provider>
);

};


//custom hook to destructure easily

export const useAuth = () => {
    return useContext(AuthContext);
}
