import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const URL = import.meta.env.VITE_BACKEND_URL;
function AddTodo({ addTodoListing,updateTodoListing }) {
  const [titleVal, setTitle] = useState("");
  const [descriptionVal, setDescription] = useState("");
  const [dueDateVal, setDueDate] = useState("");
  const [statusVal, setStatus] = useState("");
  function goBackHandler() {
    addTodoListing(true);
  }
  function updateList(){
    updateTodoListing((prevStatus) => !prevStatus);
  }
  async function submitHandler(e) {
    e.preventDefault();
    const strDate= dueDateVal.toString();
    try {
      const response = await axios.post(`${URL}/addTodo`, {
        title: titleVal,
        description: descriptionVal,
        status: statusVal,
        dueDate: strDate,
      },{
        withCredentials:true,
      });

      if (response.status === 201) {
        updateList();
        toast.success("Todo added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Unable to add Todo", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="title">Enter the title of the Todo </label>
        <input
          id="title"
          type="text"
          value={titleVal}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="description">Enter description of the Todo</label>
        <input
          id="description"
          type="text"
          value={descriptionVal}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <input
            type="radio"
            name="status"
            value="In Progress"
            id="in-progress"
            onChange={(e) => setStatus(e.target.value)}
          />
          <label htmlFor="in-progress">In Progress</label>
          <input
            type="radio"
            name="status"
            value="Pending"
            id="pending"
            onChange={(e) => setStatus(e.target.value)}
          />
          <label htmlFor="pending">Pending</label>
          <input
            type="radio"
            name="status"
            value="Completed"
            id="completed"
            onChange={(e) => setStatus(e.target.value)}
          />
          <label htmlFor="completed">Completed</label>
        </div>
        <label htmlFor="due-date">Due Date </label>
        <input
          id="due-date"
          type="date"
          value={dueDateVal}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">ADD TODO</button>
      </form>
      <button type="button" onClick={goBackHandler}>
        Go Back
      </button>
    </div>
  );
}

export default AddTodo;
