import "./App.css";

import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { useTasks } from "./hooks/useTasks";
import type { Task } from "./types/task";

function App() {
  const {
    tasks,
    isLoading,
    errorMessage,
    addTask,
    editTask,
    removeTask,
  } = useTasks();

  async function handleToggleStatus(task: Task) {
    await editTask(task.id, {
      status: task.status === "pending" ? "completed" : "pending",
    });
  }

  return (
    <main>
      <header>
        <h1>To-Do</h1>
        <p>FastAPI, React, RabbitMQ and MongoDB.</p>
        <hr className="margin-bottom"/>
      </header>

      {errorMessage && <p className="color-red margin-bottom">{errorMessage}</p>}

      <section>
        <TaskForm onCreateTask={addTask} />

        {isLoading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onDeleteTask={removeTask}
          />
        )}
      </section>
    </main>
  );
}

export default App;