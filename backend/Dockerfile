FROM python:3.10-slim
WORKDIR /app
RUN apt update && apt install -y ffmpeg curl
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
