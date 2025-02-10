from django.shortcuts import render, redirect 
from django.contrib.auth.decorators import login_required
from .models import Category, Expense
from django.contrib import messages
from django.core.paginator import Paginator
import json
from userpreferences.models import UserPreference
from django.http import JsonResponse
# Create your views here.


def search_expenses(request):
    if request.method == 'POST':
        search_str = json.loads(request.body).get('searchText')
        expenses = Expense.objects.filter(amount__istartswith=search_str, owner=request.user) | Expense.objects.filter(
            date__istartswith=search_str, owner=request.user)  | Expense.objects.filter(
            description__icontains=search_str, owner=request.user) | Expense.objects.filter(
            category__icontains=search_str, owner=request.user)
        data = expenses.values()
        print(data)
        return JsonResponse(list(data), safe=False)

def filter_expenses(request):
    
    if request.method == 'POST':
        amount_start = json.loads(request.body).get('f_gt_amount')
        amount_end = json.loads(request.body).get('f_lt_amount')
        date_start = json.loads(request.body).get('f_gt_date')
        date_end = json.loads(request.body).get('f_lt_date')
        categories = [x[5:] for x in json.loads(request.body).keys() if x.startswith('f_ca')]
        description = json.loads(request.body).get('f_description')
        result = Expense.objects.filter(owner=request.user)
        print(description)
        if len(categories):
            result = Expense.objects.filter(category=categories[0], owner=request.user)
            for ca in categories[1:]:
                result = result | Expense.objects.filter(category=ca, owner=request.user)
                print(result)
        if amount_start is not None:
            result = result.filter(amount__gte=amount_start, owner=request.user)
        if amount_end is not None:
            result = result.filter(amount__lte=amount_end, owner=request.user)
        if date_start is not None:
            result = result.filter(date__gte=date_start, owner=request.user)
        if date_end is not None:
            result = result.filter(date__lte=date_end, owner=request.user)
        if description is not None:
            result = result.filter(description__istartswith=description, owner=request.user)    
        data = result.values()
        return JsonResponse(list(data), safe=False)

@login_required(login_url='/authentication/login')
def index(request):
    
    categories = Category.objects.all()
    expenses=Expense.objects.filter(owner=request.user).order_by('owner')
    paginator = Paginator(expenses, 1000)
    page_number = request.GET.get('page')
    
    page_obj = Paginator.get_page(paginator, page_number)
    currency = UserPreference.objects.get(user=request.user).currency
    context = {
        'expenses': expenses,
        'page_obj': page_obj,
        'currency':currency,
        'user': request.user,
        'categories': categories,
    }
    return render(request, 'expenses/index.html', context)

def add_expense(request):
    categories = Category.objects.all()
    context = {
            'categories': categories,
            'values' :  request.POST
        }
    if request.method == 'GET':
        print("Hello world" + request.method)
        return render(request, 'expenses/add_expense.html', context)    

    if request.method == "POST":
        amount = request.POST['amount']
        description = request.POST['description']
        date = request.POST['expense_date']
        category = request.POST['category']
        if not amount:
            messages.error(request, 'Amount is required')
            return render(request, 'expenses/add_expense.html', context)
        if not description:
            messages.error(request, 'Description is required')
            return render(request, 'expenses/add_expense.html', context)
        Expense.objects.create(owner=request.user, amount=amount,date=date,category=category,description=description)
        messages.success(request, 'Expense saved successfully')
        return redirect('expenses')

def edit_expense(request, id):
    expense = Expense.objects.get(pk=id)
    categories = Category.objects.all()
    context = {
        'expense': expense,
        'values': expense,
        'categories': categories 
    }

    if request.method == 'GET':
        return render(request, 'expenses/edit_expense.html', context)
    if request.method == 'POST':
        amount = request.POST['amount']
        description = request.POST['description']
        date = request.POST['expense_date']
        category = request.POST['category']
        if not amount:
            messages.error(request, 'Amount is required')
            return render(request, 'expenses/edit_expense.html', context)

        if not description:
            messages.error(request, 'Description is required')
            return render(request, 'expenses/edit_expense.html', context)
        
        
        expense.owner = request.user
        expense.amount = amount
        expense.date = date
        expense.category = category
        expense.description = description
        expense.save()
        messages.success(request, 'Expense updated successfully')

        return redirect('expenses')

def delete_expense(request, id):
    expense = Expense.objects.get(pk=id)
    expense.delete()
    messages.success(request, 'Expense removed')
    return redirect('expenses')