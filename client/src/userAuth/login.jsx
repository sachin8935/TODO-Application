import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Todo from "../../todo_op/todos";
import { useNavigate } from "react-router-dom";
const URL = import.meta.env.VITE_BACKEND_URL;
import "./login.css";
function Login() {
  const navigate = useNavigate();
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
        if(response.status===200){
          navigate('/todo');
        }
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
  function signUpHandler(){
    navigate('/signup')
  }
  return (
    <div className="head">
  <div className="body_path">
    <div className="login_text">LOGIN</div>
    <form onSubmit={submitHandler}>
      <div>
        <label>Email ID</label>
        <input
          type="email"
          className="input_email"
          placeholder="Enter your email"
          value={email_value}
          onChange={(e) => {
            setEmail_value(e.target.value);
          }}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type={checked ? "text" : "password"}
          className="input_pass"
          placeholder="Enter your password"
          value={pass_value}
          onChange={(e) => {
            setPass_value(e.target.value);
          }}
        />
      </div>
      <div className="checkbox-container">
        <input type="checkbox" onChange={handleChange} />
        <span>Show Password</span>
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
    <div className="signup_form">
      <div className="signup_text">
      Don't have an account?
      </div>
      <button type="button" onClick={signUpHandler}>
        Signup
      </button>
    </div>
  </div>
    <ToastContainer />
</div>

  );
}
export default Login;
