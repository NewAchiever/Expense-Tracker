# Use the official Python runtime image
#FROM python:3.13  
FROM python:3

# Create the app directory
RUN mkdir /app

# Set the working directory inside the container
WORKDIR /app

# Set environment variables 
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1 

# Upgrade pip
RUN pip install --upgrade pip 

# Copy the Django project to the container
COPY . /app/

# Copy the Django project  and install dependencies
COPY requirements.txt  /app/

# run this command to install all dependencies 
RUN pip install -r requirements.txt

# Expose the Django port
EXPOSE 8080

# Run Django’s development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]