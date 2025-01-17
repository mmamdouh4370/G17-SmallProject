
  document.getElementById("addContactButton").addEventListener("click", function () 
  {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
  
    if (firstName !== "" && lastName !== "" && email !== "" && phone !== "") 
    {
      // Create a new row
      const tableBody = document.getElementById("contactTableBody");
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
  });
