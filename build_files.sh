#!/bin/bash
sudo apt-get update
sudo apt-get install libpq-dev python3-dev gcc

python3 -m venv django-app
source django-app/bin/activate
echo "🎉 Django virtual environment 'django-app' activated! 🎉"
python3 -m pip install --upgrade pip
pip install -r requirements.txt

python3 manage.py collectstatic --noinput
python3 manage.py runserver

