
const usernameField = document.querySelector('#usernameField');
const feedbackArea = document.querySelector('.usernameFeedbackArea');
const emailField = document.querySelector('#emailField');
const emailFeedbackArea = document.querySelector('.emailFeedbackArea');
const submitBtn = document.querySelector('#submitBtn');
const usernameSuccessOutput = document.querySelector('.usernameSuccessOutput');
const showPasswordToggle = document.querySelector('.showPasswordToggle');
const passwordField = document.querySelector('#passwordField');

const handToggleInput = (e) => {
    if(showPasswordToggle.textContent === "SHOW"){
        
        passwordField.setAttribute("type", "text");
        showPasswordToggle.textContent = "HIDE";
    } else{
        passwordField.setAttribute("type", "password");
        showPasswordToggle.textContent = "SHOW";
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