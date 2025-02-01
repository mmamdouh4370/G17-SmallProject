const urlBase = "http://159.223.165.192/G17-SmallProject/LAMPAPI";
const ext = "php";

document.addEventListener("DOMContentLoaded", function() {
    loadContacts(); // Load contacts when the page is loaded
});

function getUserIdFromCookie() {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      if (cookie.includes("userId=")) {
        return cookie.split("userId=")[1].split(",")[0]; // Extract only userId
      }
    }
    return null; // Return null if not found
  }

  let userId = getUserIdFromCookie();
  console.log("Final User ID:", userId);

function isValidFirstName(firstName)
{
    const firstNameRegex = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'-]{1,49}$/;
    if(firstNameRegex.test(firstName))
    {
        return true;
    }
    return false;
}

function showError(inputId, message) {
    let inputField = document.getElementById(inputId);
    let errorElement = document.getElementById(inputId + "-error");

    if (!errorElement) {
        errorElement = document.createElement("p");
        errorElement.id = inputId + "-error";
        errorElement.className = "text-red-500 text-sm mt-1";
        inputField.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
}

function clearError(inputId) 
{
    let errorElement = document.getElementById(inputId + "-error");
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidLastName(lastName)
{
    const lastNameRegex = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'-]{1,49}$/;
    if(lastNameRegex.test(lastName))
    {
        return true;
    }
    return false;
}

function isValidEmail(email)
{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    
    if(emailRegex.test(email))
    {
        return true;
    }
    return false;
}

function isValidPhone(phone)
{
    const phoneRegex = /^\d{10}$/;
    if(phoneRegex.test(phone))
    {
        return true;
    }
    return false;
}

function isValid()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;

    let isValid = true;

    if (!isValidFirstName(firstName)) {
        showError("firstName", "First name must be 2-50 letters.");
        isValid = false;
    } else {
        clearError("firstName");
    }

    if (!isValidLastName(lastName)) {
        showError("lastName", "Last name must be 2-50 letters.");
        isValid = false;
    } else {
        clearError("lastName");
    }

    if (!isValidEmail(email)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
    } else {
        clearError("email");
    }

    if (!isValidPhone(phone)) {
        showError("phone", "Phone number must be 10 digits.");
        isValid = false;
    } else {
        clearError("phone");
    }

    if (isValid) {
        addContact();
    }

}

function addContact()
{
    console.log("Adding contact");
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;

    let tmp = 
    {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phone,
      email: email,
      userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/Add." + ext;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
    {
        xhr.onreadystatechange = function () 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let response = JSON.parse(xhr.responseText);
                let contactId = response.contactId;

                if (firstName !== "" && lastName !== "" && email !== "" && phone !== "") 
                    {
                      // Create a new row
                      const tableBody = document.getElementById("tBody");
                      const newRow = document.createElement("tr");
                      newRow.id = "row" + contactId;
                      newRow.innerHTML = `
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 firstName">${firstName}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 lastName">${lastName}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">${email}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">${phone}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">
                            <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2">Edit</button>
                            <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded" onclick="deleteContact(${contactId})">Delete</button>
                        </td>
                      `;
                
                      // Append the new row
                      tableBody.appendChild(newRow);
                
                    // Clear the input fields after adding the contact
                    document.getElementById("firstName").value = "";
                    document.getElementById("lastName").value = "";
                    document.getElementById("email").value = "";
                    document.getElementById("phone").value = "";
                    } 
                console.log("Contact has been added");
                // Clear input fields in form 
                document.getElementById("addContactForm").reset();
                // reload contacts table and switch view to show
                // loadContacts();
                // showTable();
            }
        };
        xhr.send(jsonPayload);
        console.log("tmp: " + tmp);
        console.log("Sending: " + jsonPayload);
    } 
    catch (err) 
    {
        console.log(err.message);
    }
}


//Work in progress
function loadContacts() {
    let tmp = {
        search: "", // You can modify this if you want to enable searching functionality
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + ext;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }

                // Clear existing rows
                const tableBody = document.getElementById("tBody");
                tableBody.innerHTML = ''; // Clear previous rows

                // Add new rows from the response
                jsonObject.results.forEach(contact => {
                    const newRow = document.createElement("tr");
                    newRow.id = "row" + contact.id; // Assuming 'id' is the unique identifier
                    newRow.innerHTML = `
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 firstName">${contact.FirstName}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 lastName">${contact.LastName}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">${contact.Email}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">${contact.Phone}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">
                            <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2">Edit</button>
                            <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded" onclick="deleteContact(${contact.id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(newRow); // Append the row to the table
                });
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function save_row(no) {
  var namef_val = document.getElementById("namef_text" + no).value;
  var namel_val = document.getElementById("namel_text" + no).value;
  var email_val = document.getElementById("email_text" + no).value;
  var phone_val = document.getElementById("phone_text" + no).value;
  var id_val = ids[no]

  document.getElementById("first_Name" + no).innerHTML = namef_val;
  document.getElementById("last_Name" + no).innerHTML = namel_val;
  document.getElementById("email" + no).innerHTML = email_val;
  document.getElementById("phone" + no).innerHTML = phone_val;

  // document.getElementById("edit_button" + no).style.display = "inline-block";
  // document.getElementById("save_button" + no).style.display = "none";

  let tmp = {
      phoneNumber: phone_val,
      emailAddress: email_val,
      newFirstName: namef_val,
      newLastName: namel_val,
      id: id_val
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/UpdateContacts.' + ext;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try 
  {
      xhr.onreadystatechange = function () 
      {
          if (this.readyState == 4 && this.status == 200) 
          {
              console.log("Contact has been updated");
              loadContacts();
          }
      };
      xhr.send(jsonPayload);
  } 
  catch (err) 
  {
      console.log(err.message);
  }
}

function deleteContact(contactId) {
    // Retrieve the contact details from the row (or pass them via data attributes in the button)
    const row = document.getElementById("row" + contactId);
    const firstName = row.querySelector(".firstName").textContent;
    const lastName = row.querySelector(".lastName").textContent;
    
    // Prepare the data to be sent in the request
    const data = {
        userId: userId,
        firstName: firstName,
        lastName: lastName
    };

    // Convert data to JSON
    const jsonPayload = JSON.stringify(data);

    // Create a new XMLHttpRequest to send the delete request to PHP
    let xhr = new XMLHttpRequest();
    let url = urlBase + '/Delete.' + ext;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            
            // If there's no error in the response, remove the row from the table
            if (response.error === "") {
                row.remove(); // Remove the table row from the DOM
                console.log("Contact deleted successfully.");
            } else {
                console.log("Error deleting contact:", response.error);
            }
        }
    };

    // Send the request with the contact data
    xhr.send(jsonPayload);
}


  
