from sqlalchemy.orm import Session

from app.models.task_model import Task
from app.schemas.task_schema import TaskCreate, TaskUpdate

from app.services.event_publisher import publish_task_event

def get_tasks(db:Session) -> list[Task]:
    return db.query(Task).order_by(Task.id).all()


def get_task_by_id(db: Session, id: int) -> Task | None:
    return db.query(Task).filter(Task.id == id).first()

def create_task(db: Session, data: TaskCreate) -> Task:
    task = Task(**data.model_dump())

    db.add(task)
    db.commit()
    db.refresh(task)

    publish_task_event(
        event_name="task_created",
        payload={
            "task_id": task.id,
            "title": task.title,
            "status": task.status
        }
    )

    return task

def update_task(db: Session, id: int, data: TaskUpdate) -> Task | None:
    currentTask = get_task_by_id(db, id)

    if currentTask is None:
        return None
    
    newData = data.model_dump(exclude_unset=True)

    for field, value in newData.items():
        setattr(currentTask, field, value)

    db.commit()
    db.refresh(currentTask)

    publish_task_event(
        event_name="task_updated",
        payload={
            "task_id": currentTask.id,
            "updated_fields": newData
        }
    )

    return currentTask

def delete_task(db: Session, id: int) -> bool:
    task = get_task_by_id(db, id)
    
    if task is None:
        return False
    
    payload = {
        "task_id": task.id,
        "title": task.title,
        "status": task.status
    }
    
    db.delete(task)
    db.commit()

    publish_task_event(
        event_name="task_deleted",
        payload=payload
    )

    return True