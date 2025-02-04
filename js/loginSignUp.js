const urlBase = "http://159.223.165.192/LAMPAPI";
const ext = "php";

document.addEventListener("DOMContentLoaded", () => {
  console.log(1);
  checkLoginStatus();
});

function checkLoginStatus() {
  let cookies = document.cookie.split("; ");
  let firstName = null;
  console.log(cookies);

  cookies.forEach((cookie) => {
    if (cookie.startsWith("firstName=")) {
      firstName = cookie.split("=")[1];
    }
  });

  console.log(firstName);

  if (firstName) {
    window.location.href = "contacts.html";
  }
}

function toggleForm() {
  const createAccountForm = document.getElementById("create-account-form");
  const loginForm = document.getElementById("login-form");
  const toggleButton = document.getElementById("toggle-button");
  const formContainer = document.getElementById("form-container");
  if (createAccountForm.classList.contains("active")) {
    createAccountForm.classList.remove("active");
    createAccountForm.classList.add("hidden");

    loginForm.classList.remove("hidden");
    loginForm.classList.add("active");

    toggleButton.innerText = "Don't have an account? Create one";

    formContainer.classList.remove("h-[42rem]");
    formContainer.classList.add("h-[32rem]");

    formContainer.classList.remove("-mt-[3rem]");
    formContainer.classList.add("-mt-[13rem]");
  } else {
    loginForm.classList.remove("active");
    loginForm.classList.add("hidden");

    createAccountForm.classList.remove("hidden");
    createAccountForm.classList.add("active");

    toggleButton.innerText = "Already have an account? Login";

    formContainer.classList.remove("h-[32rem]");
    formContainer.classList.add("h-[42rem]");

    formContainer.classList.remove("-mt-[13rem]");
    formContainer.classList.add("-mt-[3rem]");
  }
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.innerText = message;
  errorElement.classList.remove("hidden");

  const inputElement = errorElement.previousElementSibling;
  inputElement.classList.add("border-red-500");
  inputElement.setAttribute("aria-invalid", "true");
}

function clearErrors() {
  const errorElements = document.querySelectorAll("[id$='Error']");
  errorElements.forEach((element) => {
    element.classList.add("hidden");
    const inputElement = element.previousElementSibling;
    inputElement.classList.remove("border-red-500");
    inputElement.setAttribute("aria-invalid", "false");
  });
}

function validateLoginForm() {
  let isValid = true;
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();

  if (!username) {
    showError("loginUserError", "Please enter a valid username.");
    isValid = false;
  }
  if (!password) {
    showError("loginPassError", "Please enter a valid password.");
    isValid = false;
  }

  return isValid;
}

function validateRegistrationForm() {
  let isValid = true;
  const firstName = document.getElementById("regFName").value.trim();
  const lastName = document.getElementById("regLName").value.trim();
  const username = document.getElementById("regUser").value.trim();
  const password = document.getElementById("regPass").value.trim();

  if (!firstName) {
    showError("regFNameError", "Please enter your first name.");
    isValid = false;
  }
  if (!lastName) {
    showError("regLNameError", "Please enter your last name.");
    isValid = false;
  }
  if (!username) {
    showError("regUserError", "Please choose a username.");
    isValid = false;
  }
  if (!password) {
    showError("regPassError", "Please create a password.");
    isValid = false;
  }

  return isValid;
}

function login(event) {
  event.preventDefault();
  clearErrors();

  if (!validateLoginForm()) {
    return;
  }

  let fullUrl = urlBase + "/Login." + ext;
  let login = document.getElementById("loginUser").value;
  let pass = document.getElementById("loginPass").value;

  let preJson = {login: login, password: pass};
  let jsonPayload = JSON.stringify(preJson);

  fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: jsonPayload,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login Incorrect");
      }
      return response.json();
    })
    .then((jsonObject) => {
      let userId = jsonObject.id;

      if (userId < 1) {
        document.getElementById("loginFormError").classList.remove("hidden");
        return;
      }

      let firstName = jsonObject.firstName;
      let lastName = jsonObject.lastName;

      let minutes = 20;
      let date = new Date();
      date.setTime(date.getTime() + minutes * 60 * 1000);

      document.cookie =
        "firstName=" +
        firstName +
        ",lastName=" +
        lastName +
        ",userId=" +
        userId +
        ";expires=" +
        date.toGMTString();

      window.location.href = "contacts.html";
    })
    .catch((error) => {
      console.log(error.message);
      document.getElementById("loginFormError").classList.remove("hidden");
    });
}

function register(event) {
  event.preventDefault();
  clearErrors();

  if (!validateRegistrationForm()) {
    return;
  }

  let fullUrl = urlBase + "/Register." + ext;

  let firstName = document.getElementById("regFName").value;
  let lastName = document.getElementById("regLName").value;
  let login = document.getElementById("regUser").value;
  let pass = document.getElementById("regPass").value;

  let preJson = {
    firstName: firstName,
    lastName: lastName,
    login: login,
    password: pass,
  };
  let jsonPayload = JSON.stringify(preJson);

  fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: jsonPayload,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Registration Failed");
      }
      return response.json();
    })
    .then((jsonObject) => {
      let userId = jsonObject.id;

      let minutes = 20;
      let date = new Date();
      date.setTime(date.getTime() + minutes * 60 * 1000);

      document.cookie =
        "firstName=" +
        firstName +
        ",lastName=" +
        lastName +
        ",userId=" +
        userId +
        ";expires=" +
        date.toGMTString();
      console.log("Cookies:", document.cookie);

      loginUserAfterRegister(login, pass, firstName, lastName);
      //window.location.href = "contacts.html";
    })
    .catch((error) => {
      console.log(error.message);
      document.getElementById("registerFormError").classList.remove("hidden");
    });
}

function loginUserAfterRegister(login, pass, firstName, lastName) {
  let fullUrl = urlBase + "/Login." + ext;

  let preJson = {login: login, password: pass};
  let jsonPayload = JSON.stringify(preJson);

  fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: jsonPayload,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed after registration");
      }
      return response.json();
    })
    .then((jsonObject) => {
      let userId = jsonObject.id;

      if (userId < 1) {
        document.getElementById("registerFormError").classList.remove("hidden");
        return;
      }

      let minutes = 20;
      let date = new Date();
      date.setTime(date.getTime() + minutes * 60 * 1000);

      document.cookie =
        "firstName=" +
        firstName +
        ",lastName=" +
        lastName +
        ",userId=" +
        userId +
        ";expires=" +
        date.toGMTString();

      console.log("Cookies:", document.cookie);
      window.location.href = "contacts.html";
    })
    .catch((error) => {
      console.log(error.message);
      document.getElementById("registerFormError").classList.remove("hidden");
    });
}
