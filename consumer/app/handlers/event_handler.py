import json
from datetime import datetime

from app.db.mongo import audit_logs_collection


def handle_task_event(message_body: bytes) -> None:
    message = json.loads(message_body.decode("utf-8"))

    audit_document = {
        "event": message.get("event"),
        "payload": message.get("payload", {}),
        "timestamp": message.get("timestamp"),
        "processed_at": datetime.utcnow().isoformat(),
    }

    audit_logs_collection.insert_one(audit_document)

    print(f"Audit log saved: {audit_document}", flush=True)