const usernameField = document.querySelector('#usernameField');
const feedbackArea = document.querySelector('.usernameFeedbackArea');
const emailField = document.querySelector('#emailField');
const emailFeedbackArea = document.querySelector('.emailFeedbackArea');
const submitBtn = document.querySelector('#submitBtn');
const usernameSuccessOutput = document.querySelector('.usernameSuccessOutput');
const showPasswordToggle = document.querySelector('.showPasswordToggle');
const passwordField = document.querySelector('#passwordField');

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

showPasswordToggle.addEventListener("click", handToggleInput);

usernameField.addEventListener("keyup", (e) => {
    console.log("skjbkjb", 7777);
    const usernameVal = e.target.value;

    usernameSuccessOutput.style.display = "block";

    usernameSuccessOutput.textContent = `Checking ${usernameVal}`;

    

    usernameField.classList.remove("is-invalid");
    feedbackArea.style.display = 'none';

    

    if(usernameVal.length > 0){
        fetch("/authentication/validate-username",{
            body: JSON.stringify({username: usernameVal}),
            method: "POST",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data);

            usernameSuccessOutput.style.display = "none";

            if(data.username_error){
                submitBtn.setAttribute("disabled", "true");
                usernameField.classList.add("is-invalid");
                feedbackArea.style.display = 'block';
                feedbackArea.innerHTML = `<p>${data.username_error}</p>`;
            }
            else{
                submitBtn.removeAttribute("disabled");;
            }
        });
    }
});



emailField.addEventListener("keyup", (e) => {
    const emailVal = e.target.value;
    emailField.classList.remove("is-invalid");
    emailFeedbackArea.style.display = 'none';

    if(emailVal.length > 0){
        fetch("/authentication/validate-email",{
            body: JSON.stringify({email: emailVal}),
            method: "POST",
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.email_error){
                submitBtn.setAttribute("disabled", "true");
                emailField.classList.add("is-invalid");
                emailFeedbackArea.style.display = "block";
                emailFeedbackArea.innerHTML = `<p>${data.email_error}</p>`;
            }else{
                submitBtn.removeAttribute("disabled");
            }
        });
    }
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

  
  
  document.getElementById('apply-filter').addEventListener('submit', function(event) {
    event.preventDefault();  
     data = {}
     // Get form data
     const formData = new FormData(event.target);        
     if(formData.get('f_gt_amount') != ''){
       data['f_gt_amount'] = (parseFloat(formData.get('f_gt_amount')))
     }
     if(formData.get('f_lt_amount') != ''){
       data['f_lt_amount'] = (parseFloat(formData.get('f_lt_amount')))

     }
     if(formData.get('f_description') != null){
       
       data['f_description'] = (formData.get('description'))
     }
     if(formData.get('f_gt_date') != ''){
       data['f_gt_date'] = (formData.get('f_gt_date'))
     }
     if(formData.get('f_lt_date') != ''){
       data['f_lt_date'] = (formData.get('f_gt_date'))
     }

     console.log(data)
     

     // Send AJAX request using Fetch API
     fetch("{% url 'filter-expense' %}", {
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