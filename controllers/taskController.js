import Task from '../models/Task.js'; 


const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


const getTaskById = async (req, res) => {
    try {
      const taskId = req.params.id;
      console.log(`Fetching task with ID: ${taskId}`);
  
      // Find the task by ID
      const task = await Task.findById(taskId);
      console.log('Task found:', task);
  
      // Check if the task exists and belongs to the user
      if (!task) {
        console.log('Task not found');
        return res.status(404).json({ msg: 'Task not found' });
      }
  
      if (task.userId.toString() !== req.user.id) {
        console.log('Unauthorized attempt to access task');
        return res.status(403).json({ msg: 'Not authorized to access this task' });
      }
  
      res.json(task);
    } catch (err) {
      console.error('Error in getTaskById:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  };

// **createTask** 
const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  console.log(req.user);
  try {
    const newTask = new Task({
      title,
      description,
      status,
      userId: req.user.id,
    });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' , err});
  }
};

// **updateTask** 
const updateTask = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Task not found or not authorized' });
    }

    // Update properties only if provided in the request body
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' , "error": err});
  }
};

// **deleteTask** 
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Task not found or not authorized' });
    }

    await Task.deleteOne({ _id: req.params.id });
    console.log('Task deleted successfully');
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' , error:err});
  }
};

// Export all controller functions as an object
export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
