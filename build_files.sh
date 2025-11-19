#!/bin/bash
python3 -m venv django-app
source django-app/bin/activate
echo "🎉 Django virtual environment 'django-app' activated! 🎉"
python3 -m pip install --upgrade pip
pip install -r requirements.txt

python3 manage.py collectstatic --noinput
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver

