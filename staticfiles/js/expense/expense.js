const applyFilterExpenses = document.getElementById('apply-filter-expenses');
const categoryDropDownButton = document.getElementById('categoryDropDownMenu');
const dropDownCategoryItem = document.getElementById('dropDownCategoryItem');
const categoryMenu = document.getElementById('categoryMenu');
var categoryDropDownToggle = false

document.addEventListener('click', function(event){
    
    console.log(event.target)
    if(event.target === categoryDropDownButton){
        console.log("elsewhere clicked")
        const parent = document.getElementById('categoryDropDownMenuParent')
        document.getElementById('categoryDropDownMenu').toggleAttribute('aria-expanded')
        document.getElementById('categoryMenu').classList.toggle('show')
        parent.classList.toggle('show')
        if(categoryDropDownToggle){
            categoryDropDownToggle = false
        }
        else{
            categoryDropDownToggle = true
        }
        
    }
    else if(categoryDropDownToggle && event.target !== categoryMenu && !categoryMenu.contains(event.target)){
        const parent = document.getElementById('categoryDropDownMenuParent')
        document.getElementById('categoryDropDownMenu').toggleAttribute('aria-expanded')
        document.getElementById('categoryMenu').classList.toggle('show')
        parent.classList.toggle('show')
        categoryDropDownToggle = false
        
    }
});

  


applyFilterExpenses.addEventListener('submit', function(event) {
    event.preventDefault();  
    data = {}
    // Get form data
    const formData = new FormData(event.target);
    const expenseFilterTags = document.getElementById('expensesFilterTags')   
    expenseFilterTags.innerHTML = '';     
    if(formData.get('f_gt_amount') != ''){
        data['f_gt_amount'] = (parseFloat(formData.get('f_gt_amount')))
        expenseFilterTags.innerHTML += `<div class="d-inline btn btn-success mx-1 p-1 position-relative small"><span class="me-3">Amount > ${data['f_gt_amount']}</span><button type="button"  onclick="closeFilterTag(event, 'f_gt_amount_expense')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_lt_amount') != ''){
        data['f_lt_amount'] = (parseFloat(formData.get('f_lt_amount')))
        expenseFilterTags.innerHTML += `<div class="d-inline  btn btn-success  rounded border-2 mx-1 p-1 position-relative small"><span class="me-3">Amount < ${data['f_lt_amount']}</span><button type="button"  onclick="closeFilterTag(event, 'f_lt_amount_expense')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_description') != null && formData.get('f_description') != ''){
        data['f_description'] = (formData.get('f_description'))
        expenseFilterTags.innerHTML += `<div class="d-inline  btn btn-success rounded border-2 mx-1 p-1 position-relative small"><span class="me-3">Description: ${data['f_description']}</span><button type="button"  onclick="closeFilterTag(event, 'f_description_expense')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_gt_date') != ''){
        data['f_gt_date'] = (formData.get('f_gt_date'))
        expenseFilterTags.innerHTML += `<div class="d-inline  btn btn-success  rounded border-2 mx-1 p-1 position-relative small"><span class="me-3">From Date: ${data['f_gt_date']}</span><button type="button"  onclick="closeFilterTag(event, 'f_gt_date_expense')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_lt_date') != ''){
        data['f_lt_date'] = (formData.get('f_lt_date'))
        expenseFilterTags.innerHTML += `<div class="d-inline  btn btn-success rounded border-2 mx-1 p-1 position-relative small"><span class="me-3">To Date: ${data['f_lt_date']}</span><button type="button"  onclick="closeFilterTag(event, 'f_lt_date_expense')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    
    const categoryMenu = document.getElementById('categoryMenu')

    for(var child=categoryMenu.children[0]; child!==null; child=child.nextElementSibling) {
        input = child.children[0]
        
        if(input.checked){            
            console.log(input.id)
            //input_title = input.id.slice(5)
            input_id = input.id.split(' ').join('_')
            data[input.id] = input.checked
            expenseFilterTags.innerHTML += `<div class="d-inline  btn btn-success rounded border-2 mx-1 p-1 position-relative"><span class="me-3 fw-bold">Category: ${input.id.slice(5)}</span><button type="button" onclick="closeFilterTag(event, '${input.id}')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
        }
    }

    console.log(data)
    // Send AJAX request using Fetch API
    fetch("/expense/filter-expense/", {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Hide the spinner
        //document.getElementById('loading-spinner').style.display = 'none';
        console.log(data)
        // Get the product list div
        const productListDiv = document.getElementById('expenses-table');
        productListDiv.innerHTML = '';  // Clear the current list

        // Update the product list with filtered results
        if (data.length > 0) {
            data.forEach((expense, i) => {
            console.log(expense.amount)
                productListDiv.innerHTML += `
                    <tr>
                    <td>${i+1}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>${expense.date}</td>
                    <td><a href="/edit-expense/${expense.id}" class="btn btn-primary btn-small">Edit</a></td>
                    </tr>`;
                    
            });
        } else {
            productListDiv.innerHTML = '<p>No Search found.</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
    }
    return "";
}



function closeFilterTag(event, id){
    console.log()
    event.target.parentElement.remove()
    var ele = document.getElementById(id)
    if(ele.type == 'checkbox'){
        ele.checked = false;
    }
    else{
        ele.value = '' 
    }
    
    applyFilterExpenses.dispatchEvent(new Event('submit'));
}

