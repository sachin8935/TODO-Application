import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const URL = import.meta.env.VITE_BACKEND_URL;
  function submitHandler(e) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast.warning("Enter All the details!", {
        position: "top-right",
        autoClose: 3000,
      });

      return;
    }
    axios
      .post(`${URL}/signup`, {
        firstName,
        lastName,
        email,
        password,
      },{
        withCredentials:true,
      })
      .then((response) => {
        console.log(response);
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("User with this email already exists!", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>
          <label>Enter Your First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Enter Your Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Enter Your Email ID</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Enter Your Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <ToastContainer />
    </div>
  );
}
export default Signup;
