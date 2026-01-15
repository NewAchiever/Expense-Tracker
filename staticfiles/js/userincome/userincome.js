const applyFilterIncomes = document.getElementById('apply-filter-incomes');
const sourceDropDownButton = document.getElementById('sourceDropDownMenu');
const sourceMenu = document.getElementById('sourceMenu');
var sourceDropDownToggle = false

document.addEventListener('click', function(event){
    
    console.log(event.target)
    if(event.target === sourceDropDownButton){
        console.log("elsewhere clicked")
        const parent = document.getElementById('sourceDropDownMenuParent')
        document.getElementById('sourceDropDownMenu').toggleAttribute('aria-expanded')
        document.getElementById('sourceMenu').classList.toggle('show')
        parent.classList.toggle('show')
        if(sourceDropDownToggle){
            sourceDropDownToggle = false
        }
        else{
            sourceDropDownToggle = true
        }
        console.log("sourceDropDownToggle",sourceDropDownToggle)
    }
    else if(sourceDropDownToggle && event.target !== sourceMenu && !sourceMenu.contains(event.target)){
        const parent = document.getElementById('sourceDropDownMenuParent')
        document.getElementById('sourceDropDownMenu').toggleAttribute('aria-expanded')
        document.getElementById('sourceMenu').classList.toggle('show')
        parent.classList.toggle('show')
        sourceDropDownToggle = false
    }
});




applyFilterIncomes.addEventListener('submit', function(event) {
    event.preventDefault();  
    data = {}
    
    console.log("Entering event listener")
    const formData = new FormData(event.target);        
    const incomesFilterTags = document.getElementById('incomesFilterTags')  
    console.log(incomesFilterTags); 
     
    incomesFilterTags.innerHTML = '';     
    if(formData.get('f_gt_amount') != ''){
        data['f_gt_amount'] = (parseFloat(formData.get('f_gt_amount')))
        incomesFilterTags.innerHTML += `<div class="d-inline btn btn-success mx-1 p-1 position-relative small"><span class="me-3">Amount > ${data['f_gt_amount']}</span><button type="button"  onclick="closeIncomeFilterTag(event, 'f_gt_amount_income')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_lt_amount') != ''){
        data['f_lt_amount'] = (parseFloat(formData.get('f_lt_amount')))
        incomesFilterTags.innerHTML += `<div class="d-inline  btn btn-success rounded border-2 mx-1 p-1 position-relative small"><span class="me-3">Amount < ${data['f_lt_amount']}</span><button type="button"  onclick="closeIncomeFilterTag(event, 'f_lt_amount_income')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_description') != null && formData.get('f_description') != ''){
        data['f_description'] = (formData.get('f_description'))
        incomesFilterTags.innerHTML += `<div class="d-inline  btn btn-success rounded border-2 mx-1 p-1 position-relative small"><span class="me-3">Description: ${data['f_description']}</span><button type="button"  onclick="closeIncomeFilterTag(event, 'f_description_income')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_gt_date') != '' && formData.get('f_gt_date') != null){
        data['f_gt_date'] = (formData.get('f_gt_date'))
        incomesFilterTags.innerHTML += `<div class="d-inline  btn btn-success  rounded border-2 mx-1 p-1 position-relative small"><span class="me-3">From Date: ${data['f_gt_date']}</span><button type="button"  onclick="closeIncomeFilterTag(event, 'f_gt_date_income')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_lt_date') != '' && formData.get('f_lt_date') != null){
        data['f_lt_date'] = (formData.get('f_lt_date'))
        incomesFilterTags.innerHTML += `<div class="d-inline  btn btn-success rounded border-2 mx-1 p-1 position-relative small"><span class="me-3">To Date: ${data['f_lt_date']}</span><button type="button"  onclick="closeIncomeFilterTag(event, 'f_lt_date_income')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    
    const sourceMenu = document.getElementById('sourceMenu')
    for(var child=sourceMenu.children[0]; child!==null; child=child.nextElementSibling) {
        input = child.children[0]
        if(input.checked){            
            console.log(input.id)
            data[input.id] = input.checked
            incomesFilterTags.innerHTML += `<div class="d-inline  btn btn-success rounded border-2 mx-1 p-1 position-relative"><span class="me-3 fw-bold">Source: ${input.id.slice(5)}</span><button type="button" onclick="closeIncomeFilterTag(event, '${input.id}')" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
        }
    }
    
    console.log("form Data: ", formData.get('f_description'))
    // Send AJAX request using Fetch API
    fetch("/filter-income/", {
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
        console.log("Response data: ",data)
        // Get the product list div
        const productListDiv = document.getElementById('incomes-table');
        productListDiv.innerHTML = '';  // Clear the current list
        console.log(productListDiv);
        // Update the product list with filtered results
        if (data.length > 0) {
            data.forEach((income, i) => {
            console.log(income.amount)
                productListDiv.innerHTML += `
                    <tr>
                    <td>${i+1}</td>
                    <td>${income.amount}</td>
                    <td>${income.source}</td>
                    <td>${income.description}</td>
                    <td>${income.date}</td>
                    <td><a href="/edit-income/${income.id}" class="btn btn-primary btn-small">Edit</a></td>
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

function closeIncomeFilterTag(event, id){
    event.target.parentElement.remove()
    console.log("close id: ", id)
    var ele = document.getElementById(id)
    if(ele.type == 'checkbox'){
        ele.checked = false;
    }
    else{
        ele.value = ''; 
    }
    applyFilterIncomes.dispatchEvent(new Event('submit')); 
}

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

