const urlBase = 'http://159.223.165.192/G17-SmallProject/LAMPAPI';
const ext = 'php';

function toggleForm(){
  const createAccountForm = document.getElementById("create-account-form");
  const loginForm = document.getElementById("login-form");
  const toggleButton = document.getElementById("toggle-button");

  if (createAccountForm.classList.contains("active")){
    createAccountForm.classList.remove("active");
    createAccountForm.classList.add("hidden");

    loginForm.classList.remove("hidden");
    loginForm.classList.add("active");

    toggleButton.innerText = "Don't have an account? Create one";
  } else {
    loginForm.classList.remove("active");
    loginForm.classList.add("hidden");

    createAccountForm.classList.remove("hidden");
    createAccountForm.classList.add("active");

    toggleButton.innerText = "Already have an account? Login";
  }
}

function login(event){
    event.preventDefault();

    let fullUrl = urlBase + "/Login." + ext;
    let login = document.getElementById("loginUser").value;
	let pass = document.getElementById("loginPass").value;

    let preJson = { login: login, password: pass };
	let jsonPayload = JSON.stringify(preJson);
    

    fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonPayload,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login Incorrect');
        }
        return response.json();
    })
    .then(jsonObject => {
        let userId = jsonObject.id;
        
        if (userId < 1) {
            document.getElementById("loginResult").innerHTML = "Login Incorrect";
            return;
        }
        
        let firstName = jsonObject.firstName;
        let lastName = jsonObject.lastName;

        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
    
        document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();

        window.location.href = "contacts.html";
    })
    .catch(error => {
        console.log(error.message)
    });
}

function register(event){
    event.preventDefault();

    let fullUrl = urlBase + "/Register." + ext;
    
    let firstName = document.getElementById("regFName").value;
    let lastName = document.getElementById("regLName").value;
    let login = document.getElementById("regUser").value;
	let pass = document.getElementById("regPass").value;

    let preJson = { firstName: firstName, lastName: lastName, login: login, password: pass };
	let jsonPayload = JSON.stringify(preJson);
    

    fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonPayload,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration Failed');
        }
        console.log(response.json())
        return response.json();
    })
    .then(jsonObject => {
        let userId = jsonObject.id;
        
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
    
        document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();

        window.location.href = "contacts.html";
    })
    .catch(error => {
        console.log(error.message)
    });
}
