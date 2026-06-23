import { useState } from "react";
import type { FormEvent } from "react";

import type { TaskCreate } from "../types/task";

interface TaskFormProps {
    onCreateTask: (task: TaskCreate) => Promise<void>;
}

export function TaskForm({ onCreateTask }: TaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evita que el navegador recargue la página al enviar el formulario

        if (!title.trim()) {
            return;
        }

        try {
            setIsSubmitting(true);

            await onCreateTask({
                title: title.trim(),
                description: description.trim() || null,
                status: "pending",
            });

            setTitle("");
            setDescription("");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="margin-bottom">
            <h2>Create task</h2>

            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    placeholder="Task title"
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    placeholder="Task description"
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            <button type="submit" disabled={isSubmitting || !title.trim()}>
                {isSubmitting ? "Creating..." : "Create task"}
            </button>
        </form>
    );
}

