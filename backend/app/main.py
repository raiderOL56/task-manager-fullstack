from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.task_routes import router as task_router


app = FastAPI(
    title="Task Manager API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(task_router)