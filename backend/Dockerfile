FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

# Install dependencies including scikit-learn for predictions
# If scikit-learn is not in requirements.txt, we add it here manually or ensure it's in the file
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir scikit-learn numpy

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
