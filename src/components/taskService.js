import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

// Create Task
export const createTask = async (task) => {
  try {
    await addDoc(collection(db, "tasks"), task);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Get Tasks
export const fetchTasks = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update Task
export const updateTask = async (taskId, updatedTask) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, updatedTask);
};

// Delete Task
export const deleteTask = async (taskId) => {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
};
