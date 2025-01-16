import { useState } from "react";
function AddTodo({addTodoListing}) {
  function goBackHandler(){
    addTodoListing(true);
  }
  return (
    <div>
      <form>
        <label>Enter the title of the Todo </label>
        <input type="text" />
        <label>Enter description of the Todo</label>
            <input type="text" />
        <div>
          <input
            type="radio"
            name="status"
            value="In Progress"
            id="in-progress"
          />
          <label for="in-progress">In Progress</label>
          <input type="radio" name="status" value="Pending" id="pending" />
          <label for="pending">Pending</label>

          <input type="radio" name="status" value="Completed" id="completed" />
          <label for="completed">Completed</label>
        </div>

        <label>Due Date </label>
        <input type="date" />
        <button type="submit">ADD TODO</button>
      </form>
      <button type="button" onClick={goBackHandler}>Go Back</button>
    </div>
  );
}
export default AddTodo;
