import axios from "axios";
import { useState, useEffect } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./updateTodo.css";
function UpdateTodo(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const id = props.todoByID;
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(`${URL}/getTodo/${id}`, {
          withCredentials: true,
        });
        const todo = response.data.todo;
        setTitle(todo.title);
        setDescription(todo.description);
        setStatus(todo.status);
        setDueDate(todo.dueDate);
      } catch (error) {
        console.error("Error fetching todo:", error);
      }
    };

    fetchTodo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${URL}/updateTodo`,
        { id:id, title:title, description:description, status:status, dueDate:dueDate },
        { withCredentials: true }
      );
      toast.success("Todos updated!", {
        position: "top-right",
        autoClose: 3000,
      });
      props.saveEditTodo(true);
      props.updateTodoListing((prevStatus) => !prevStatus);
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div>
        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <button type="submit">Save Changes</button>
    </form>
  );
}

export default UpdateTodo;
