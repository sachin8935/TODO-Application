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
    const fetchTodos = async () => {
      try {
        const todos = await todo.find({ _id: { $in: foundUser.todo } });
        res.status(200).json({
          success: true,
          message: "User details fetched successfully.",
          id: userId,
          data:todos
        });
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch todos.",
    });
  }
};
const getTodoById = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You need to login to access this todo.",
      });
    }

    const decodedToken = jwt.verify(token, key);
    const userId = decodedToken.id;
    const todoId = req.params.id // Assuming the ID is passed as a URL parameter

    const foundTodo = await todo.findOne({ _id: todoId, userId });

    if (!foundTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or you do not have permission to access it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo fetched successfully.",
      todo: foundTodo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the todo.",
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
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You need to login before deleting the todo",
      });
    }

    const decodedToken = jwt.verify(token, key);
    const userId = decodedToken.id;
    const todoId = req.params.id;

    // Find the todo and verify ownership
    const foundTodo = await todo.findOne({ _id: todoId, userId });

    if (!foundTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or you do not have permission to delete it.",
      });
    }

    // Delete the todo from the database
    await todo.findByIdAndDelete(todoId);

    // Remove the todo ID from the user's todos array
    const userUpdateResult = await user.findByIdAndUpdate(
      userId,
      { $pull: { todo: todoId } }, // Make sure 'todo' matches the field in your user schema
      { new: true } // Return the updated user document
    );

    if (!userUpdateResult) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user's todo list",
      });
    }

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
const isTokenValid = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }
    const decodedToken = jwt.verify(token, key);
    const validUser = await user.findById(decodedToken.id); 
    if (validUser) {
      return res.status(200).json({
        success: true,
        message: "Token is valid. User is logged in.",
        valid: true, // Add this to indicate the token's validity
      });
    }
    return res.status(404).json({
      success: false,
      message: "Token is invalid or user does not exist",
      valid: false,
    });
  } catch (err) {
    console.error("Error validating token:", err);
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
      valid: false,
    });
  }
};
const logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
  });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


module.exports = { addTodo, getAllTodo, updateTodo, deleteTodo,getTodoById,isTokenValid,logOut };
