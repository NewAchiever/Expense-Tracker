from django.shortcuts import render, redirect
from django.views import View
import json
from django.http import JsonResponse
from django.contrib.auth.models import User
from userpreferences.models import UserPreference
from validate_email import validate_email
from django.contrib import messages
from django.core.mail import EmailMessage
from django.urls import reverse
from django.utils.encoding import force_bytes, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from .utils import account_activation_token
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse_lazy
from django.contrib import auth


# Create your views here.
class RegistrationView(View):
    def get(self, request):
        return render(request, 'authentication/registration.html')
    def post(self, request):
        #messages.success(request, 'Success whatsapp');
        #return render(request, 'authentication/registration.html')
        #-----------------
        # get user data
        # validate
        # create a user account

        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        context = {
            'fieldValues': request.POST
        }

        if not User.objects.filter(username=username).exists():
            if not User.objects.filter(email=email).exists():
                if len(password) < 6:
                    messages.error(request, 'Password to short')
                    return render(request, 'authentication/registration.html', context)
                user = User.objects.create_user(username=username, email=email)
                user.set_password(password)

                user.is_active = False
                user.save()
                UserPreference.objects.create(user=user)

                # path_to_view
                # - getting domain we are on
                # - relative url to verification
                # - encode uid
                # - token 

                uidb64 = urlsafe_base64_encode(force_bytes((user.pk)))
        
                domain = get_current_site(request).domain
                link = reverse('activate', kwargs={'uidb64':uidb64, 'token':account_activation_token.make_token(user)})

                activate_url = 'http://'+domain+link

                email_subject = 'Activate your account'
                email_body = 'Hi '+user.username + '\n\nPlease use this link to verify your account\n' + activate_url
                email_obj = EmailMessage(
                    email_subject,
                    email_body,
                    "fortestingonly090@gmail.com",
                    [email]
                )
                email_obj.send(fail_silently = False)
                messages.success(request, 'Account successfully created')
                return render(request, 'authentication/registration.html')
        messages.error(request, 'Account already exists')
        return render(request, 'authentication/registration.html')


class VerificationView(View):
    def get(self, request, uidb64, token):
        try:
            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=id)
            if not account_activation_token.check_token(user, token):
                return redirect('login'+'?message='+'User already activated')
            if user.is_active:
                return redirect('login')
            user.is_active = True
            user.save() 
            messages.success(request, 'Account activated successful')
            return redirect('login')
        except Exception as ex:
            pass
        return redirect('login')


class LoginView(View):
    def get(self, request):
        if request.COOKIES.get('user_id') != None:
            print("cookie" + request.COOKIES.get('user_id'))
            user = User.objects.get(id=request.COOKIES.get('user_id'))
            auth.login(request, user)
            context={
                'user': user
            }
            response = redirect('expenses', context)
            messages.success(request, 'Welcome back, '+ user.username)
            return response
        return render(request, 'authentication/login.html')
    
    def post(self, request):
        username = request.POST['username']
        password = request.POST['password']
        user = None
        
        if request.COOKIES.get('user_id') != None:
            user = User.objects.get(id=request.COOKIES.get('user_id'))
            auth.login(request, user)
            response = redirect('expenses')
            messages.success(request, 'Welcome back, '+ user.username)
            return response
        
        if username and password: 
            if  User.objects.filter(username=username).exists():
                user = User.objects.get(username=username)
                if not user.check_password(password):
                    messages.error(request, 'Invalid credentials. Try again.')
                    return render(request, 'authentication/login.html')         
            if user:
                if user.is_active:
                    auth.login(request, user)
                    response = redirect('expenses')
                    if 'remember' in request.POST:
                        response.set_cookie(key='user_id', value=user.id)
                    messages.success(request, 'Welcome, '+ user.username + ' You are now logged in.')
                    return response
                messages.error(request, 'Account is not active, please check your email.')
                return render(request, 'authentication/login.html')
            messages.error(request, 'Invalid credentials. Try again.')
            return render(request, 'authentication/login.html')
        
class UsernameValidationView(View):
    def post(self, request):
        data = json.loads(request.body)
        username = data['username']
        if not str(username).isalnum():
            return JsonResponse({'username_error': 'username shpould only contain alphanumeric characters'}, status=400)
        #if User.objects.filter(username=username).exists():
        #    return JsonResponse({'username_error': 'username already exists. Choose another one.'}, status=409)
        return JsonResponse({'username_valid': True})
    
        
class EmailValidationView(View):
    def post(self, request):
        data = json.loads(request.body)
        email = data['email']

        if not validate_email(email):
            return JsonResponse({'email_error': 'Email is invalid'}, status=400)
        
        #if User.objects.filter(email=email).exists():
        #    return JsonResponse({'email_error': 'email already exists. Choose another one.'}, status=409)
        return JsonResponse({'email_valid': True})
    
class LogoutView(View):
    def post(self, request):
        auth.logout(request)
        del request.session
        response = redirect('login')
        response.delete_cookie(key='user_id')
        messages.success(request, 'You have been logged out.')
        return response

class ResetPasswordView(View):
    def get(self, request):
        response = render(request, 'authentication/email-reset-password-link.html')
        return response
    
    def post(self, request):
        email = request.POST['email']
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            token = account_activation_token.make_token(user)
            # Generate the password reset URL
            uidb64 = urlsafe_base64_encode(force_bytes((user.pk)))
            link = reverse('confirm-reset-password', kwargs={'uidb64': uidb64, 'token': token})

            domain = get_current_site(request).domain
            
            activate_url = 'http://'+domain+link

            email_subject = 'Reset your Password'
            email_body = 'Hi '+ user.username + '\n\nPlease use this link to reset your password\n' + activate_url
            email_obj = EmailMessage(
                email_subject,
                email_body,
                "fortestingonly090@gmail.com",
                [email]
            )
            email_obj.send(fail_silently = False)            
            messages.success(request, 'Password reset link has been sent to ' + email + '.')
            response = render(request, 'authentication/email-reset-password-link.html')
            return response
        else:
            messages.error(request, 'Unfortunately, ' + email + ' is not registered with us.')
            response = render(request, 'authentication/email-reset-password-link.html')
            return response
        
class ConfirmResetPasswordView(View):
    def get(self, request, uidb64, token):
        try:
            pk_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=pk_id)
            if not account_activation_token.check_token(user, token):
                messages.error(request, "The link is either expired or broken, Try again.")
                return redirect('reset-password')
            request.session["user"] = user.pk
            return render(request, 'authentication/set-newpassword.html')
        except Exception as ex:
             messages.error(request, ex)
             return redirect('reset-password')

class ChangePassword(View):
    def post(self, request):
        password = request.POST['password']
        try:
            user_id = request.session['user']
            user = User.objects.get(pk=user_id)
            user.set_password(password)
            user.save()
            del request.session['user']
            messages.success(request, 'Password changed successfully!')
            return redirect('login')
        except:
            messages.success(request, 'Password didn\'t changed successfully!')
            return redirect('login')

        