import Login from "./userAuth/login";
import Signup from "./userAuth/signup";
import Todo from "../todo_op/todos";
import "./App.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

const URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const navigate = useNavigate();
  const [tokenValid, setTokenValid] = useState(false);

  const fetchUser = () => {
    axios
      .get(`${URL}/isValidToken`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setTokenValid(true);
        }
      })
      .catch((err) => {
        setTokenValid(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (tokenValid) {
      navigate("/todo");
    }
  }, [tokenValid, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </div>
  );
}

export default App;
