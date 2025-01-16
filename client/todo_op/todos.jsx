import { useState } from "react";
import axios from "axios";
import AddTodo from "./addTodo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const URL = import.meta.env.VITE_BACKEND_URL;
function Todo(){
    const [addTodoButton,setAddTodoButton]=useState(false);
    const [todoList,setTodoList]=useState([]);
    function addTodoHandler(){
        setAddTodoButton((prevStatus)=>!prevStatus);
    }
    axios.get(`${URL}/getAllTodo`, {
        withCredentials: true,
    })
    .then((response) => {
        toast.success("Todos fetched successfully", {
            position: "top-right",
            autoClose: 3000,
        });
        setTodoList(response.data);
    })
    .catch((err) => {
        console.error("Error fetching todos:", err);
        toast.error("Unable to fetch Todos", {
            position: "top-right",
            autoClose: 3000,
        });
    });    
    return (
        <div>
            <button type="submit" onClick={addTodoHandler}>Add Todo</button>
            {addTodoButton && <AddTodo addTodoListing={addTodoHandler}/>}
            <div>
                <table>
                    <tr>
                        <th>title</th>
                        <th>Description</th>
                        <th>status</th>
                    </tr>
                    {todoList.map((it)=>{
                        <tr key={it.id}>
                            <th>it.data[0].title</th>
                            <th>it.data[0].description</th>
                            <th>it.data[0].status</th>
                        </tr>
                    })}
                </table>
            </div>
        </div>
    )
}
export default Todo;