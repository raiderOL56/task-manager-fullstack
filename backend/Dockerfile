FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY alembic ./alembic
COPY alembic.ini .
COPY start.sh .

RUN sed -i 's/\r$//' start.sh && chmod +x start.sh

CMD ["sh", "./start.sh"]