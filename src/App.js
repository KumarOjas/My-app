import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Firebase config
import { collection, getDocs, addDoc } from "firebase/firestore";

// Function to fetch tasks
const fetchTasks = async () => {
  try {
    const tasksSnapshot = await getDocs(collection(db, "tasks"));
    return tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// React Component
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState(""); // State for new task input

  // Fetch tasks on component mount
  useEffect(() => {
    const getTasks = async () => {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks || []);
      setLoading(false);
    };
    getTasks();
  }, []);

  // Function to add a new task
  const addTask = async () => {
    if (!newTask.trim()) return; // Prevent empty task submissions

    try {
      const docRef = await addDoc(collection(db, "tasks"), { name: newTask });
      setTasks(prevTasks => [...prevTasks, { id: docRef.id, name: newTask }]); // Update state
      setNewTask(""); // Clear input field
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <h1>Task List</h1>
      {/* Add Task Form */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>{task.name || "Unnamed Task"}</li>
          ))}
        </ul>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default TaskList;
