from datetime import datetime

from pydantic import BaseModel, Field


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    status: str = Field(default="pending", max_length=20)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: str | None = Field(default=None, min_length=1, max_lenght=100)
    description: str | None = Field(default=None, max_lenght=500)
    status: str | None = Field(default=None, max_lenght=20)

class TaskResponse(TaskBase):
    id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }