"use client";

import { useState, useEffect } from "react";
import { t } from "@/components/translations";
import { useDispatch, useSelector } from "react-redux";
import {
  get_tasks,
  set_task,
  update_task,
  delete_task,
  messageClear,
} from "@/store/task";
import {
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaRegCircle,
  FaCalendarDay,
} from "react-icons/fa";
import useUserFromSession from "@/lib/useUserFromSession";
import toast from "react-hot-toast";

// --- Utility Function to format Date (YYYY-MM-DD) ---
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const DailyTaskPage = () => {
  const dispatch = useDispatch();
  const { tasks, errorMessage, successMessage, successTag } = useSelector(
    (state) => state.task
  );
  const user = useUserFromSession();
  const today = formatDate(new Date());
  const [newTask, setNewTask] = useState({
    text: "",
    completed: false,
    userId: user?.id,
    date: today,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(get_tasks(newTask.date));
    setIsLoading(false);
  }, [newTask.date]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(get_tasks(newTask.date));
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      dispatch(get_tasks(newTask.date));
    }
  }, [errorMessage, successMessage, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.text.trim() === "") return;

    setNewTask({
      ...newTask,
      userId: user?.id,
    });

    dispatch(set_task({ object: newTask }));
  };

  const toggleTask = (taskId) => {
    dispatch(update_task({ object: { task_id: taskId } }));
  };

  const deleteTask = (taskId) => {
    dispatch(delete_task({ object: { task_id: taskId } }));
  };

  const getHeaderText = () => {
    if (newTask.date === today) return t("today_tasks");

    const dateObj = new Date(newTask.date);
    // Format as "Fri, Oct 4, 2025"
    return (
      dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        // year: 'numeric',
        month: "short",
        day: "numeric",
      }) + "th" + " " + t("tasks")
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-medium text-green-600">
          {t("loading")}
        </div>
      </div>
    );
  }

  // RENDER UI
  return (
    <div className="flex justify-center items-start bg-gray-100 p-4">
      <div className="w-full bg-white shadow-2xl rounded-xl p-6 md:p-8">
        {/* Date Selector */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <label
            htmlFor="task-date"
            className="text-gray-600 font-medium mb-2 md:mb-0"
          >
            {t("schedule_date")}:
          </label>
          <input
            type="date"
            id="task-date"
            name="date"
            value={newTask.date}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 w-full md:w-auto"
          />
        </div>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center mb-6 border-b pb-3">
          <FaCalendarDay className="text-green-500 mr-3" />
          {getHeaderText()}
        </h1>

        {/* Task Input Form */}
        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <input
            type="text"
            name="text"
            value={newTask.text}
            onChange={handleChange}
            placeholder={t("addNewTask")}
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
          <button
            type="submit"
            disabled={!newTask.text.trim()}
            className="flex items-center justify-center bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-150 disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            <FaPlus className="mr-1" /> {t("add")}
          </button>
        </form>

        {/* Task List */}
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`flex items-center justify-between p-4 rounded-lg transition duration-200 ${
                task.completed
                  ? "bg-green-50 border-l-4 border-green-500 text-gray-400"
                  : "bg-gray-50 hover:bg-gray-100 border-l-4 border-transparent"
              }`}
            >
              {/* Toggle/Text Section */}
              <div
                className="flex items-center flex-grow cursor-pointer"
                onClick={() => toggleTask(task._id)}
              >
                <span className="mr-3 text-lg">
                  {task.completed ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaRegCircle className="text-gray-400 hover:text-green-500" />
                  )}
                </span>
                <span
                  className={`text-base flex-grow ${
                    task.completed ? "line-through" : "text-gray-800"
                  }`}
                >
                  {task.task}
                </span>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteTask(task._id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full transition duration-150"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>

        {/* No Tasks Message */}
        {tasks.length === 0 && (
          <p className="no-tasks mt-8 text-center text-gray-500 italic p-4 bg-yellow-50 rounded-lg">
            No tasks scheduled for {getHeaderText()}.
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyTaskPage;
