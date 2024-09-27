from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    path('', views.index, name="income"),
    path('add-income/', views.add_income, name="add-income"),    
    path('edit-income/<int:id>', views.edit_income, name="edit-income"),
    path('filter-income/', csrf_exempt(views.filter_incomes), name="filter-expense"),
    # path('delete-income/<int:id>', views.delete_expense, name="delete-expense"),    
    # path('search-income/', csrf_exempt(views.search_expenses), name="search-expenses")    
]