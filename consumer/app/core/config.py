from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    rabbitmq_host: str = "rabbitmq"
    rabbitmq_port: int = 5672
    rabbitmq_queue: str = "task_events"

    mongodb_url: str = "mongodb://mongodb:27017"
    mongodb_database: str = "task_manager_logs"
    mongodb_collection: str = "audit_logs"


settings = Settings()