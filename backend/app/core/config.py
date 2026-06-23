from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://raiderUser:raiderPass@postgres:5432/task_manager"

    rabbitmq_host: str = "rabbitmq"
    rabbitmq_port: int = 5672
    rabbitmq_queue: str = "task_events"


settings = Settings()