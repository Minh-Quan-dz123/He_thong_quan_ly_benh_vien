# Chọn base image Python nhẹ
FROM python:3.11-slim

# Tránh tạo file .pyc, log thẳng ra stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Thiết lập working directory
WORKDIR /app

# Copy requirements trước để tận dụng layer cache
COPY requirements.txt .

# Cài đặt dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ source code
COPY . .

# Expose port động Render cung cấp
EXPOSE 10000  

# Command chạy app, dùng biến môi trường PORT của Render
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8002}"]
