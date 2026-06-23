import { useCallback, useEffect, useState } from "react";

import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from "../api/tasksApi";

import type { Task, TaskCreate, TaskUpdate } from "../types/task";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const data = await getTasks();
            setTasks(data);
        } catch {
            setErrorMessage("No se pudieron cargar las tareas.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const addTask = useCallback(async (taskData: TaskCreate) => {
        try {
            setErrorMessage(null);

            const createdTask = await createTask(taskData);

            setTasks((currentTasks) => [...currentTasks, createdTask]);
        } catch {
            setErrorMessage("No se pudo crear la tarea.");
        }
    }, []);

    const editTask = useCallback(async (taskId: number, taskData: TaskUpdate) => {
        try {
            setErrorMessage(null);

            const updatedTask = await updateTask(taskId, taskData);

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === taskId ? updatedTask : task
                )
            );
        } catch {
            setErrorMessage("No se pudo actualizar la tarea.");
        }
    }, []);

    const removeTask = useCallback(async (taskId: number) => {
        try {
            setErrorMessage(null);

            await deleteTask(taskId);

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== taskId)
            );
        } catch {
            setErrorMessage("No se pudo eliminar la tarea.");
        }
    }, []);

    return {
        tasks,
        isLoading,
        errorMessage,
        addTask,
        editTask,
        removeTask,
    };
}