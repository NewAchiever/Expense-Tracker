<<<<<<< HEAD
source ./django-app/Scripts/activate
pip install -r requirements.txt
python3.11 manage.py collectstatic --noinput
=======
#!/bin/bash
python3 -m pip install --upgrade pip
pip3 install -r requirements.txt
python3 manage.py collectstatic --noinput
python3 manage.py runserver
>>>>>>> f794638fe70e505533610e788de92e87da6a4458
