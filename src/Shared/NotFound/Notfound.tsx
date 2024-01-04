import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./../../Context/AuthContext";
export default function Notfound() {
  const { userRole }: any = useContext(AuthContext);
  return (
    <div className="notfound  vh-100  p-5">
      <h1 className="mt-5">Oops...</h1>
      <h2 className="notFound-title">Page Not Found</h2>
     
      {userRole == "Manager" || userRole == "Employee"? (
        <>
         <p>
         This Page doesn’t exist or was removed! We suggest you back to home.
       </p>
        <Link
          to={"/dashboard"}
          className="mt-4 btn btn-warning rounded-5 px-4 customize-link"
        >
          Back to Home
        </Link>
        </>
        
      ) : (
        <>
        <p>
        This Page doesn’t exist or was removed! We suggest you back to login.
      </p>
        <Link
        to={"/login"}
        className="mt-4 btn btn-warning rounded-5 px-4 customize-link"
      >
        Back to Login
      </Link>
      </>
      )}
    </div>
  );
}
