const todo = require("../models/todoSchema");
const user = require("../models/signupSchema");
const jwt = require("jsonwebtoken");
const key = process.env.SECRET_KEY;
const addTodo = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.id;
    const todoData = new todo({
      userId,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate,
    });
    const savedTodo = await todoData.save();
    await user.findByIdAndUpdate(userId, { $push: { todo: savedTodo._id } });

    res.status(201).json({
      success: true,
      message: "Todo added successfully",
      todo: savedTodo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the todo",
    });
  }
};
const getAllTodo = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, unauthorized.",
      });
    }
    const decodedToken = jwt.verify(token, key);
    const userId = decodedToken.id;
    const foundUser = await user.findById(userId);

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      id: userId,
      data: foundUser.todo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch todos.",
    });
  }
};
const updateTodo = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "You need to login before updating the todo",
      });
    }
    const decodedToken = jwt.verify(token, key);
    const userId = decodedToken.id;
    const todoId = req.body.id;
    const foundTodo = await todo.findOne({ _id: todoId, userId });

    if (!foundTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or you do not have permission to update it.",
      });
    }
    const updatedTodo = await todo.findByIdAndUpdate(
      todoId,
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        dueDate: req.body.dueDate,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the todo",
    });
  }
};
const deleteTodo = async (req, res) => {
  try {
    const token = req.cookies.token;
    if(!token){
        return res.status(404).json({
            success: false,
            message: "You need to login before updating the todo",
          });
    }
    const decodedToken = jwt.verify(token, key);
    const userId = decodedToken.id;
    const todoId = req.body.id;
    const foundTodo = await todo.findOne({ _id: todoId, userId });

    if (!foundTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or you do not have permission to delete it.",
      });
    }
    await todo.findByIdAndDelete(todoId);
    await user.findByIdAndUpdate(userId, { $pull: { todos: todoId } });

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the todo",
    });
  }
};
module.exports = { addTodo, getAllTodo, updateTodo,deleteTodo };
