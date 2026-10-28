import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types/task';
import { loadTasksFromStorage, saveTasksToStorage } from '../storage/taskStorage';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  getTaskById: (id: string) => Task | undefined;
  addTask: (taskData: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (taskData: Task) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  toggleTaskStatus: (taskId: string) => Promise<boolean>;
  deleteCompletedTasks: () => Promise<number>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Đọc dữ liệu khi mở app
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const loadedTasks = await loadTasksFromStorage();
        if (isMounted) {
          setTasks(loadedTasks);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshTasks = async () => {
    setIsLoading(true);
    const loaded = await loadTasksFromStorage();
    setTasks(loaded);
    setIsLoading(false);
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(t => t.id === id);
  };

  const addTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const nextTasks = [newTask, ...tasks];
    setTasks(nextTasks);
    await saveTasksToStorage(nextTasks);
    return newTask;
  };

  const updateTask = async (taskData: Task): Promise<boolean> => {
    const nextTasks = tasks.map(t => (t.id === taskData.id ? { ...taskData } : t));
    setTasks(nextTasks);
    await saveTasksToStorage(nextTasks);
    return true;
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    const nextTasks = tasks.filter(t => t.id !== taskId);
    setTasks(nextTasks);
    await saveTasksToStorage(nextTasks);
    return true;
  };

  const toggleTaskStatus = async (taskId: string): Promise<boolean> => {
    const nextTasks = tasks.map(t =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    setTasks(nextTasks);
    await saveTasksToStorage(nextTasks);
    return true;
  };

  const deleteCompletedTasks = async (): Promise<number> => {
    const completedCount = tasks.filter(t => t.done).length;
    const nextTasks = tasks.filter(t => !t.done);
    setTasks(nextTasks);
    await saveTasksToStorage(nextTasks);
    return completedCount;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        getTaskById,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        deleteCompletedTasks,
        refreshTasks,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
