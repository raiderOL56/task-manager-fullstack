import type { Task } from "../types/task";

interface TaskListProps {
    tasks: Task[];
    onToggleStatus: (task: Task) => Promise<void>;
    onDeleteTask: (taskId: number) => Promise<void>;
}

export function TaskList({ tasks, onToggleStatus, onDeleteTask }: TaskListProps) {
    if (tasks.length === 0) {
        return <p>No tasks found.</p>;
    }

    return (
        <section>
            <h2>Tasks</h2>

            {tasks.map((task) => (
                <article key={task.id}>
                    <div>
                        <p>{task.title}</p>

                        {task.description && <p>{task.description}</p>}

                        <span>{task.status}</span>
                    </div>

                    <div className="margin-bottom">
                        <button type="button" onClick={() => onToggleStatus(task)}>
                            {task.status === "pending" ? "Complete" : "Mark pending"}
                        </button>

                        <button type="button" onClick={() => onDeleteTask(task.id)}>
                            Delete
                        </button>
                    </div>
                </article>
            ))}
        </section>
    );
}