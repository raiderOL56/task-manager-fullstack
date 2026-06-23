import type { Task, TaskCreate, TaskUpdate } from "../types/task";

const API_BASE_URL = "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }

    return response.json() as Promise<T>
}

async function handleEmptyResponse(response: Response): Promise<void> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}

export async function getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);

    return handleResponse<Task[]>(response);
}

export async function getTaskById(id: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);

    return handleResponse<Task>(response);
}

export async function createTask(task: TaskCreate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    return handleResponse<Task>(response);
}

export async function updateTask(id: number, task: TaskUpdate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    return handleResponse<Task>(response);
}

export async function deleteTask(taskId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });

  return handleEmptyResponse(response);
}