import json
from datetime import datetime

import pika

from app.core.config import settings


def publish_task_event(event_name: str, payload: dict) -> None:
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=settings.rabbitmq_host,
            port=settings.rabbitmq_port,
        )
    )

    channel = connection.channel()

    channel.queue_declare(queue=settings.rabbitmq_queue, durable=True)

    message = {
        "event": event_name,
        "payload": payload,
        "timestamp": datetime.utcnow().isoformat(),
    }

    channel.basic_publish(
        exchange="",
        routing_key=settings.rabbitmq_queue,
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2,
        ),
    )

    connection.close()