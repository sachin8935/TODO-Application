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
    await user.findByIdAndUpdate(userId, { $push: { todos: savedTodo._id } });

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
      const foundUser = await user.findById(userId).populate("todo"); // Populate todos to get full details
  
      if (!foundUser) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "User details fetched successfully.",
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
module.exports = { addTodo, getAllTodo };
