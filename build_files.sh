#!/bin/bash
python3 -m venv django-app
source ./django-app/Scripts/activate

python3 -m pip install --upgrade pip
pip install -r requirements.txt

python3 manage.py collectstatic --noinput
python3 manage.py runserver

