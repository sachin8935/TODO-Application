import { useState, useEffect } from "react";
import axios from "axios";
import AddTodo from "./addTodo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const URL = import.meta.env.VITE_BACKEND_URL;

function Todo() {
  const [addTodoButton, setAddTodoButton] = useState(false);
  const [todoList, setTodoList] = useState([]);
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

  // Initial Fetch
  useEffect(() => {
    fetchTodo();
  }, []);

  // Toggle AddTodo Component and Re-fetch Todos on Close
  const addTodoHandler = (status) => {
    setAddTodoButton((prevStatus) => !prevStatus);
    }
  return (
    <div>
      <button type="button" onClick={() => addTodoHandler(true)}>
        Add Todo
      </button>
      {addTodoButton && <AddTodo addTodoListing={addTodoHandler} />}
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
                  <button>Update</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Todo;
