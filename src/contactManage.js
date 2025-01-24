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

function addContact()
{
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();

    let tmp = 
    {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phone,
      emailAddress: email,
      userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/AddContacts." + ext;

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
        <td class="border-2 border-gray-700 px-4 py-2">${firstName}</td>
        <td class="border-2 border-gray-700 px-4 py-2">${lastName}</td>
        <td class="border-2 border-gray-700 px-4 py-2">${email}</td>
        <td class="border-2 border-gray-700 px-4 py-2">${phone}</td>
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


  
