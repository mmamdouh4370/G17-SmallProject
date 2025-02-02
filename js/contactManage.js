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
                console.log("API Response:", response);
                console.log("In addContact method, Contact ID: " + contactId);
                if (firstName !== "" && lastName !== "" && email !== "" && phone !== "") 
                    {
                      // Create a new row
                      const tableBody = document.getElementById("tBody");
                      const newRow = document.createElement("tr");
                      newRow.id = "row" + contactId;
                      newRow.innerHTML = `
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 firstName">${firstName}</td>
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 lastName">${lastName}</td>
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 email">${email}</td>
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 phone">${phone}</td>
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">
        <button id="editBtn${contactId}" class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2" onclick="editContact(${contactId})">Edit</button>
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
                    console.log("In loadcontacts method, Contact ID: " + contact.id);
                    newRow.id = "row" + contact.id; // Assuming 'id' is the unique identifier
                    newRow.innerHTML = `
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 firstName">${firstName}</td>
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 lastName">${lastName}</td>
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 email">${email}</td>
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 phone">${phone}</td>
    <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">
        <button id="editBtn${contact.id}" class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2" onclick="editContact(${contact.id})">Edit</button>
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

function searchContacts() {
    const searchQuery = document.getElementById("searchInput").value.trim(); // Get the search query from the input field

    let tmp = {
        search: searchQuery,
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

                // Clear existing rows in the table
                const tableBody = document.getElementById("tBody");
                tableBody.innerHTML = ''; // Clear previous rows

                // Add new rows based on the search results
                jsonObject.results.forEach(contact => {
                    const newRow = document.createElement("tr");
                    newRow.id = "row" + contact.id;
                    newRow.innerHTML = `
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 firstName">${contact.FirstName}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 lastName">${contact.LastName}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 email">${contact.Email}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2 phone">${contact.Phone}</td>
                        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">
                            <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2" onclick="editContact(${contact.id})">Edit</button>
                            <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded" onclick="deleteContact(${contact.id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(newRow); // Append the new row to the table
                });
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function editContact(contactId) {
    console.log("Editing contact with ID:", contactId);
    let row = document.getElementById("row" + contactId);
    let firstNameCell = row.querySelector(".firstName");
    let lastNameCell = row.querySelector(".lastName");
    let emailCell = row.querySelector(".email");
    let phoneCell = row.querySelector(".phone");
    let editButton = document.getElementById("editBtn" + contactId);

    if (!row.classList.contains("editing")) 
    {
        // Enter edit mode
        row.classList.add("editing", "bg-blue-200"); // Apply Tailwind light blue background

        // Replace text with input fields
        firstNameCell.innerHTML = `<input type="text" value="${firstNameCell.textContent}" id="firstName${contactId}" class="border rounded px-2 py-1">`;
        lastNameCell.innerHTML = `<input type="text" value="${lastNameCell.textContent}" id="lastName${contactId}" class="border rounded px-2 py-1">`;
        emailCell.innerHTML = `<input type="email" value="${emailCell.textContent}" id="email${contactId}" class="border rounded px-2 py-1">`;
        phoneCell.innerHTML = `<input type="text" value="${phoneCell.textContent}" id="phone${contactId}" class="border rounded px-2 py-1">`;

        // Change edit button to a save button (Check mark)
        editButton.innerHTML = "✔";
        editButton.classList.remove("bg-green-500"); // Remove edit button color
        editButton.classList.add("bg-green-500", "hover:bg-green-600"); // Apply Tailwind green background
        editButton.onclick = function() {
            saveContact(contactId);
        };
    }
}

function saveContact(contactId) {
    if (!contactId) {
        console.error("Invalid contact ID:", contactId);
        return;
    }
    
    let row = document.getElementById("row" + contactId);
    let firstName = document.getElementById("firstName" + contactId).value;
    let lastName = document.getElementById("lastName" + contactId).value;
    let email = document.getElementById("email" + contactId).value;
    let phone = document.getElementById("phone" + contactId).value;
    let editButton = document.getElementById("editBtn" + contactId);

    let tmp = {
        contactId: Number(contactId),
        newFirstName: firstName,
        newLastName: lastName,
        newPhoneNumber: phone,
        newEmail: email
    };

    console.log("tmp being sent:", tmp);

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Update.' + ext;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                console.log("Response:", xhr.responseText);
                let response = JSON.parse(xhr.responseText);
                console.log("Update API Response:", response);
                // Exit edit mode
                row.classList.remove("editing", "bg-blue-200");

                // Replace input fields with new text
                row.querySelector(".firstName").innerHTML = firstName;
                row.querySelector(".lastName").innerHTML = lastName;
                row.querySelector(".email").innerHTML = email;
                row.querySelector(".phone").innerHTML = phone;

                // Change save button back to edit button
                editButton.innerHTML = "Edit";
                editButton.classList.remove("bg-green-500", "hover:bg-green-600");
                editButton.classList.add("bg-blue-500", "hover:bg-blue-600");

                
                editButton.onclick = function () {
                    editContact(contactId);
                };
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

