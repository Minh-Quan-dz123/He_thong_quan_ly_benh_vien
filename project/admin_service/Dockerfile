FROM python:3.11-slim

# Không tạo file .pyc, log thẳng ra stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Cài dependency trước
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ source
COPY . .

# Expose port (trùng với uvicorn)
EXPOSE 8002

# Start app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
