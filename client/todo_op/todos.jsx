import { useState, useEffect } from "react";
import axios from "axios";
import AddTodo from "./addTodo";
import UpdateTodo from "./updateTodo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, Routes,Route, Link, useNavigate } from "react-router-dom";
const URL = import.meta.env.VITE_BACKEND_URL;
function Todo() {
  const navigate = useNavigate();
  const [addTodoButton, setAddTodoButton] = useState(false);
  const [updateTodo, setupdateTodo] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [editTodo, setEditTodo] = useState(false);
  const [keyValue, setKey] = useState(null);
  const updateTodoHandler = () => {
    setupdateTodo((prevStatus) => !prevStatus);
  };
  function deleteHandler(keyValue) {
    axios
      .delete(`${URL}/deleteTodo/${keyValue}`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Todo deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          setupdateTodo((prevStatus) => !prevStatus);
        } else {
          toast.error("Failed to delete Todo", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
        toast.error("Unable to delete Todo", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  }
  
  const fetchTodo = () => {
    axios
      .get(`${URL}/getAllTodo`, { withCredentials: true })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setTodoList(response.data.data);
          toast.success("Todos updated!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          throw new Error("Unexpected response format");
        }
      })
      .catch((err) => {
        console.error("Error fetching todos:", err);
        toast.error("Unable to fetch Todos", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };
  useEffect(() => {
    fetchTodo();
  }, [updateTodo]);
  const addTodoHandler = () => {
    setAddTodoButton((prevStatus) => !prevStatus);
  };
  const editTodoHandler = () => {
    setEditTodo((prevStatus) => !prevStatus);
  };
  function logoutHandler(){
    axios.get(`${URL}/logout`,{withCredentials:true})
    .then((response)=>{
      toast.success("User successfully Loged Out", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate('/');
    })
    .catch((err)=>{
      toast.error("Unable to Logout", {
        position: "top-right",
        autoClose: 3000,
      });
    })
  }
  return (
    <div>
      <button type="button" onClick={logoutHandler}>Logout</button>
      <button type="button" onClick={() => addTodoHandler(true)}>
        Add Todo
      </button>
      {addTodoButton && (
        <AddTodo
          addTodoListing={addTodoHandler}
          updateTodoListing={updateTodoHandler}
        />
      )}
      <div>
        <table border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todoList.map((todo) => (
              <tr key={todo._id}>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.status}</td>
                <td>{todo.dueDate}</td>
                <td>
                  <button
                    onClick={() => {
                      editTodoHandler(true);
                      setKey(todo._id);
                    }}
                  >
                    Update
                  </button>
                  <button onClick={() => deleteHandler(todo._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editTodo && <UpdateTodo todoByID={keyValue} saveEditTodo={editTodoHandler} updateTodoListing={updateTodoHandler}/>}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Todo;
