import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Login() {
  const [email_value, setEmail_value] = useState("");
  const [pass_value, setPass_value] = useState("");
  const [checked, isChecked] = useState(false);
  const URL = import.meta.env.VITE_BACKEND_URL;
  function handleChange(e) {
    isChecked(e.target.checked);
  }
  function submitHandler(e) {
    e.preventDefault();
    if (!email_value || !pass_value) {
      toast.warning("Enter All the details!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    axios
      .post(`${URL}/login`, {
        email:email_value,
        password:pass_value
      },{
        withCredentials:true,
      })
      .then((response) => {
        console.log(response);
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 3000,
        });
        setEmail_value("");
        setPass_value("");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not login the user", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  }
  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="email"
          className="input_email"
          placeholder="Enter your email"
          value={email_value}
          onChange={(e) => {
            setEmail_value(e.target.value);
          }}
        />
        <input
          type={checked ? "text" : "password"}
          className="input_pass"
          placeholder="Enter your password"
          value={pass_value}
          onChange={(e) => {
            setPass_value(e.target.value);
          }}
        />
        <div>
          <input type="checkbox" onChange={handleChange} />
          <span>Show Password</span>
        </div>
        <button id="">Login</button>
      </form>
      <ToastContainer/>
    </div>
  );
}
export default Login;
