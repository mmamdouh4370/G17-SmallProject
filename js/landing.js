document.addEventListener("DOMContentLoaded", function () {
  const getStartedButton = document.querySelector(
    "a[href='./loginSignUp.html']"
  );
  const navbarAuthButton = document.querySelector(
    "a[href='./loginSignUp.html']"
  );

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
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    let [name, value] = cookie.trim().split("=");
    if (name === "userId" && value) {
      return true;
    }
  }
  return false;
}

function logoutUser() {
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "firstName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "./index.html";
}
