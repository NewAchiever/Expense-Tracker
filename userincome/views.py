from django.shortcuts import render, redirect 
from django.contrib.auth.decorators import login_required
from .models import Source, UserIncome
from django.contrib import messages
from django.core.paginator import Paginator
import json
from userpreferences.models import UserPreference
from django.http import JsonResponse
from userpreferences.models import UserPreference
# Create your views here.

def filter_incomes(request):
    print(request.POST.dict())
    if request.method == 'POST':
        amount_start = json.loads(request.body).get('f_gt_amount')
        amount_end = json.loads(request.body).get('f_lt_amount')
        date_start = json.loads(request.body).get('f_gt_date')
        date_end = json.loads(request.body).get('f_lt_date')
        sources = [x[5:] for x in json.loads(request.body).keys() if x.startswith('f_so')]
        print(sources)
        description = request.POST.get('f_description')
        result = UserIncome.objects.filter(owner=request.user)
        
        if len(sources):
            result = UserIncome.objects.filter(source=sources[0], owner=request.user)
            for so in sources[1:]:
                result = result | UserIncome.objects.filter(source=so, owner=request.user)
                print("result : ", result)
        if amount_start is not None:
            result = result.filter(amount__gte=amount_start, owner=request.user)
        if amount_end is not None:
            result = result.filter(amount__lte=amount_end, owner=request.user)
        if date_start is not None:
            result = result.filter(date__gte=date_start, owner=request.user)
        if date_end is not None:
            result = result.filter(date__lte=date_start, owner=request.user)
        if description is not None:
            result = result.filter(description__istartswith=description, owner=request.user)    
        data = result.values()
        return JsonResponse(list(data), safe=False)


@login_required(login_url='/authentication/login')
def index(request):
    sources = Source.objects.all()
    income=UserIncome.objects.filter(owner=request.user).order_by('owner')
    paginator = Paginator(income, 10)
    page_number = request.GET.get('page')
    page_obj = Paginator.get_page(paginator, page_number)
    currency = UserPreference.objects.get(user=request.user).currency
    context = {
        'incomes': income,
        'page_obj': page_obj,
        'currency':currency,
        'sources': sources
    }
    return render(request, 'income/index.html', context)


@login_required(login_url='/authentication/login')
def add_income(request):
    sources = Source.objects.all()
    context = {
            'sources': sources,
            'values' :  request.POST
        }
    if request.method == 'GET':
        print("Hello world" + request.method)
        return render(request, 'income/add_income.html', context)    

    if request.method == "POST":
        amount = request.POST['amount']
        description = request.POST['description']
        date = request.POST['income_date']
        source = request.POST['source']
        if not amount:
            messages.error(request, 'Amount is required')
            return render(request, 'expenses/add_expense.html', context)

        if not description:
            messages.error(request, 'Description is required')
            return render(request, 'income/add_income.html', context)
        
        UserIncome.objects.create(owner=request.user, amount=amount,date=date,source=source,description=description)

        messages.success(request, 'Record saved successfully')
        return redirect('income')

def edit_income(request, id):
    income = UserIncome.objects.get(pk=id)
    sources = Source.objects.all()
    context = {
        'income': income,
        'sources': sources 
    }
    print(income)
    if request.method == 'GET':
        return render(request, 'income/edit_income.html', context)
    if request.method == 'POST':
        amount = request.POST['amount']
        description = request.POST['description']
        date = request.POST['income_date']
        source = request.POST['income_source']
        if not amount:
            messages.error(request, 'Amount is required')
            return render(request, 'income/edit_income.html', context)

        if not description:
            messages.error(request, 'Description is required')
            return render(request, 'income/edit_income.html', context)
        
        
        income.owner = request.user
        income.amount = amount
        income.date = date
        income.source = source
        income.description = description
        income.save()
        messages.success(request, 'Income updated successfully')

        return redirect('income')

# def delete_expense(request, id):
#     expense = Expense.objects.get(pk=id)
#     expense.delete()
#     messages.success(request, 'Expense removed')
#     return redirect('expenses')