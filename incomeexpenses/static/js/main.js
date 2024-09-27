const usernameField = document.querySelector('#usernameField');
const feedbackArea = document.querySelector('.usernameFeedbackArea');
const emailField = document.querySelector('#emailField');
const emailFeedbackArea = document.querySelector('.emailFeedbackArea');
const submitBtn = document.querySelector('#submitBtn');
const usernameSuccessOutput = document.querySelector('.usernameSuccessOutput');
const showPasswordToggle = document.querySelector('.showPasswordToggle');
const passwordField = document.querySelector('#passwordField');
const applyFilterExpenses = document.getElementById('apply-filter-expenses');
const categoryDropDownButton = document.getElementById('categoryDropDownMenu');
const dropDownCategoryItem = document.getElementById('dropDownCategoryItem');



const handToggleInput = (e) => {
    let visibilityIconSrc = document.getElementById('visibleIcon');
    console.log(visibilityIconSrc.src)
    if(showPasswordToggle.value === "visible"){
        passwordField.setAttribute("type", "text");
        showPasswordToggle.value = "hide";
        visibilityIconSrc.setAttribute("src", `/static/icons/hide.png`)
        visibilityIconSrc.setAttribute("alt", "hide")
        
    } else{
        passwordField.setAttribute("type", "password");
        showPasswordToggle.value = "visible";
        visibilityIconSrc.setAttribute("src", `/static/icons/visible.png`)
        visibilityIconSrc.setAttribute("alt", "visible")
    }
};

//showPasswordToggle.addEventListener("click", handToggleInput);

// usernameField.addEventListener("keyup", (e) => {
//     console.log("skjbkjb", 7777);
//     const usernameVal = e.target.value;

//     usernameSuccessOutput.style.display = "block";

//     usernameSuccessOutput.textContent = `Checking ${usernameVal}`;

    

//     usernameField.classList.remove("is-invalid");
//     feedbackArea.style.display = 'none';

    

//     if(usernameVal.length > 0){
//         fetch("/authentication/validate-username",{
//             body: JSON.stringify({username: usernameVal}),
//             method: "POST",
//         })
//         .then((res) => res.json())
//         .then((data) => {
//             console.log("data", data);

//             usernameSuccessOutput.style.display = "none";

//             if(data.username_error){
//                 submitBtn.setAttribute("disabled", "true");
//                 usernameField.classList.add("is-invalid");
//                 feedbackArea.style.display = 'block';
//                 feedbackArea.innerHTML = `<p>${data.username_error}</p>`;
//             }
//             else{
//                 submitBtn.removeAttribute("disabled");;
//             }
//         });
//     }
// });



// emailField.addEventListener("keyup", (e) => {
//     const emailVal = e.target.value;
//     emailField.classList.remove("is-invalid");
//     emailFeedbackArea.style.display = 'none';

//     if(emailVal.length > 0){
//         fetch("/authentication/validate-email",{
//             body: JSON.stringify({email: emailVal}),
//             method: "POST",
//         })
//         .then((res) => res.json())
//         .then((data) => {
//             if(data.email_error){
//                 submitBtn.setAttribute("disabled", "true");
//                 emailField.classList.add("is-invalid");
//                 emailFeedbackArea.style.display = "block";
//                 emailFeedbackArea.innerHTML = `<p>${data.email_error}</p>`;
//             }else{
//                 submitBtn.removeAttribute("disabled");
//             }
//         });
//     }
// });


categoryDropDownButton.addEventListener('click', function(event){
    const parent = document.getElementById('categoryDropDownMenuParent')
    this.toggleAttribute('aria-expanded')
    document.getElementById('categoryMenu').classList.toggle('show')
    parent.classList.toggle('show')
});



// dropDownCategoryItem.addEventListener('click', function(event){
//     console.log('working!')
//     event.target.childNodes[0].checked = true
// })


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


applyFilterExpenses.addEventListener('submit', function(event) {
    event.preventDefault();  
    data = {}
    // Get form data
    const formData = new FormData(event.target);
    const expenseFilterTags = document.getElementById('expensesFilterTags')   
    expenseFilterTags.innerHTML = '';     
    if(formData.get('f_gt_amount') != ''){
    data['f_gt_amount'] = (parseFloat(formData.get('f_gt_amount')))
    expenseFilterTags.innerHTML += `<div class="d-inline border border-2 mx-1 p-1 position-relative small"><span class="me-3">Amount > ${data['f_gt_amount']}</span><button type="button"  onclick="closeFilterTag(event, 'f_gt_amount')" class="btn-close position-absolute end-0" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_lt_amount') != ''){
    data['f_lt_amount'] = (parseFloat(formData.get('f_lt_amount')))
    expenseFilterTags.innerHTML += `<div class="d-inline border border-2 mx-1 p-1 position-relative small"><span class="me-3">Amount < ${data['f_lt_amount']}</span><button type="button"  onclick="closeFilterTag(event, 'f_lt_amount')" class="btn-close position-absolute end-0" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_description') != null && formData.get('f_description') != ''){
    data['f_description'] = (formData.get('f_description'))
    expenseFilterTags.innerHTML += `<div class="d-inline border border-2 mx-1 p-1 position-relative small"><span class="me-3">Description: ${data['f_description']}</span><button type="button"  onclick="closeFilterTag(event, 'f_description')" class="btn-close position-absolute end-0" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_gt_date') != ''){
    data['f_gt_date'] = (formData.get('f_gt_date'))
    expenseFilterTags.innerHTML += `<div class="d-inline border border-2 mx-1 p-1 position-relative small"><span class="me-3">From Date: ${data['f_gt_date']}</span><button type="button"  onclick="closeFilterTag(event, 'f_gt_date')" class="btn-close position-absolute end-0" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    if(formData.get('f_lt_date') != ''){
    data['f_lt_date'] = (formData.get('f_gt_date'))
    expenseFilterTags.innerHTML += `<div class="d-inline border border-2 mx-1 p-1 position-relative small"><span class="me-3">To Date: ${data['f_lt_date']}</span><button type="button"  onclick="closeFilterTag(event, 'f_lt_date')" class="btn-close position-absolute end-0" style="height:5px;width:5px" aria-label="Close"></button></div>`
    }
    
    const categoryMenu = document.getElementById('categoryMenu')    
    
    
    for(var child=categoryMenu.children[0]; child!==null; child=child.nextElementSibling) {
        input = child.children[0]
        
        if(input.checked){            
            console.log(input.id)
            data[input.id] = input.checked
            expenseFilterTags.innerHTML += `<div class="border border-2 mx-1 p-1 position-relative"><span class="me-3 fw-bold">Category: ${input.id.slice(5)}</span><button type="button" onclick="closeFilterTag(event, ${input.id})" class="btn-close position-absolute top-50 end-0 translate-middle-y" style="height:5px;width:5px" aria-label="Close"></button></div>`
        }
    }

    console.log(data)
    // Send AJAX request using Fetch API
    fetch("/filter-expense/", {
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


function closeFilterTag(event, id){
    event.target.parentElement.remove()
    console.log("id: ", id)
    try{
        document.getElementById(id).setAttribute('value', '')    
    }
    catch{
        document.getElementById(id).toggleAttribute('checked')
    }
    //HTMLFormElement.prototype.submit.call(applyFilterExpenses);
}