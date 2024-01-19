import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../AuthContext/AuthContext";
import AuthCheckingComponent from "../../Alert/AlertCheckingCmponent";

const AuthRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isError } = useAuth();
  if (isLoading) {
    return <AuthCheckingComponent />
  }
  if (isError || isAuthenticated === false) {
    console.log("not navigating");
    return <Navigate to="/login" state={{ from: location }} />; //*useLocation is use to resend the user to its last location
  }
  return children;
};

export default AuthRoute;

/* //! The replace prop in <Navigate> is set to true.
This means that the current entry in the navigation 
history will be replaced by the new entry. 
In other words, the current page won't be saved in the history stack. 
This is often used when you don't want the user to go back to the previous page after navigating away.

///!  The state prop is used to pass the current location (from: location), 
which can be used for redirecting the user back to the intended page after login. */
