import time

import pika

from app.core.config import settings
from app.handlers.event_handler import handle_task_event


def connect_to_rabbitmq():
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=settings.rabbitmq_host,
                    port=settings.rabbitmq_port,
                )
            )
            return connection
        except pika.exceptions.AMQPConnectionError:
            print("RabbitMQ not ready yet. Retrying in 5 seconds...", flush=True)
            time.sleep(5)


def callback(channel, method, properties, body):
    try:
        handle_task_event(body)
        channel.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as error:
        print(f"Error processing message: {error}", flush=True)
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=True)


def main():
    connection = connect_to_rabbitmq()
    channel = connection.channel()

    channel.queue_declare(queue=settings.rabbitmq_queue, durable=True)

    channel.basic_qos(prefetch_count=1)

    channel.basic_consume(
        queue=settings.rabbitmq_queue,
        on_message_callback=callback,
    )

    print("Consumer started. Waiting for messages...", flush=True)
    channel.start_consuming()


if __name__ == "__main__":
    main()