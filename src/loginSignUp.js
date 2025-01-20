const urlBase = 'http://159.223.165.192/G17-SmallProject/LAMPAPI';
const ext = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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
    userId = 0;
	firstName = "";
	lastName = "";

    let fullUrl = urlBase + "/Login." + ext;
    let login = document.getElementById("loginUser").value;
	let pass = document.getElementById("loginPass").value;

    let preJson = { login: login, password: pass };
	let jsonPayload = JSON.stringify(preJson);
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", fullUrl, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function (){
            if (this.readyState == 4 && this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                console.log(jsonObject);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
                window.location.href = "contacts.html";
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function register(){

}
