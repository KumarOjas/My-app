import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Firebase config file
import { collection, getDocs, addDoc } from "firebase/firestore";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const tasksSnapshot = await getDocs(collection(db, "tasks"));
      const tasksList = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    };
    fetchTasks();
  }, []);

  // Add a new task to Firestore
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "tasks"), { name: newTask });
      setTasks(prevTasks => [...prevTasks, { id: docRef.id, name: newTask }]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
