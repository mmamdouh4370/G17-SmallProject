const urlBase = "http://159.223.165.192/G17-SmallProject/LAMPAPI";
const ext = "php";

function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return null;
}

// Get userId from cookies
let userId = getCookie("userId");

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
                console.log("Contact has been added");
                // Clear input fields in form 
                document.getElementById("addContactForm").reset();
                // reload contacts table and switch view to show
                // loadContacts();
                // showTable();
            }
        };
        xhr.send(jsonPayload);
    } 
    catch (err) 
    {
        console.log(err.message);
    }


    if (firstName !== "" && lastName !== "" && email !== "" && phone !== "") 
    {
      // Create a new row
      const tableBody = document.getElementById("tBody");
      const newRow = document.createElement("tr");

      newRow.innerHTML = `
        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">${firstName}</td>
        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">${lastName}</td>
        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">${email}</td>
        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2">${phone}</td>
        <td class="border-2 border-secondary bg-primary text-secondary px-4 py-2"></td>
      `;

      // Append the new row
      tableBody.appendChild(newRow);

    // Clear the input fields after adding the contact
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    } 
    else 
    {
      alert("All fields are required!");
    }
}


//Work in progress
function loadContacts() 
{
  let tmp = 
  {
      search: "",
      userId: userId
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/SearchContacts.' + ext;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try 
  {
    xhr.onreadystatechange = function () 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            let jsonObject = JSON.parse(xhr.responseText);
            if (jsonObject.error) 
            {
                console.log(jsonObject.error);
                return;
            }
            let text = "<table border='1'>"
            for (let i = 0; i < jsonObject.results.length; i++) 
            {
                ids[i] = jsonObject.results[i].ID
                text += "<tr id='row" + i + "'>"
                text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                text += "<td id='email" + i + "'><span>" + jsonObject.results[i].EmailAddress + "</span></td>";
                text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].PhoneNumber + "</span></td>";
                // text += "<td>" +
                //     "<button type='button' id='edit_button" + i + "' class='w3-button w3-circle w3-lime' onclick='edit_row(" + i + ")'>" + "<span class='glyphicon glyphicon-edit'></span>" + "</button>" +
                //     "<button type='button' id='save_button" + i + "' value='Save' class='w3-button w3-circle w3-lime' onclick='save_row(" + i + ")' style='display: none'>" + "<span class='glyphicon glyphicon-saved'></span>" + "</button>" +
                //     "<button type='button' onclick='delete_row(" + i + ")' class='w3-button w3-circle w3-amber'>" + "<span class='glyphicon glyphicon-trash'></span> " + "</button>" + "</td>";
                // text += "<tr/>"
            }
            text += "</table>"
            document.getElementById("tBody").innerHTML = text;
        }
    };
    xhr.send(jsonPayload);
  } 
  catch (err) 
  {
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


  
