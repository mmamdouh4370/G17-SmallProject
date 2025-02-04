document.addEventListener("DOMContentLoaded", function () {
    const getStartedButton = document.getElementById("getStart");
    const navbarAuthButton = document.getElementById("loginSignUpButton");
  
    if (isUserLoggedIn()) {
      navbarAuthButton.textContent = "Logout";
      navbarAuthButton.addEventListener("click", function (event) {
        event.preventDefault();
        logoutUser();
      });
    }
  
    getStartedButton.addEventListener("click", function (event) {
      if (isUserLoggedIn()) {
        event.preventDefault();
        window.location.href = "./contacts.html";
      }
    });
  });
  
  function isUserLoggedIn() {
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
      return true;
    } else {
      return false;
    }
  }
  
  function logoutUser() {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "firstName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "./index.html";
  }
  