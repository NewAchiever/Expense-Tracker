#!/bin/bash
python3 -m venv django-app
source django-app/bin/activate
echo "🎉 Django virtual environment 'django-app' activated! 🎉"
python3 -m pip install --upgrade pip
pip install -r requirements.txt

python3 manage.py collectstatic --noinput
python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput
echo "=== PROJECT STRUCTURE ON VERCEL ==="
find . -maxdepth 3 -type d
echo "=== END ==="
