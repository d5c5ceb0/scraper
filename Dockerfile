# Use the official Python image as the base image
FROM python:3.11-slim

# Set environment variables to prevent Python from writing .pyc files and to buffer output
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Expose the port that the Flask app runs on
EXPOSE 5000

# Command to run the Flask app
CMD ["/bin/sh", "-c", "cd /app/api flask db upgrade && flask run --host=0.0.0.0"]
