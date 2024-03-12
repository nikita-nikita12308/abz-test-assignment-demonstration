document.getElementById("getTokenBtn").addEventListener("click", async () => {
  try {
    // Make an Axios request to your server to get the token
    const response = await axios.get(
      "https://handsome-eel-pantsuit.cyclic.app/api/v1/token"
    );
    const token = response.data.token; // Adjust based on your server response

    // Display the token next to the button
    localStorage.setItem("accessToken", token);
    document.getElementById("tokenMessage").innerText = `Token: ${token}`;
    document.getElementById("tokenMessage").style.color = "black";
  } catch (error) {
    document.getElementById(
      "tokenMessage"
    ).innerText = `Error getting token: ${error.message}`;
    document.getElementById("tokenMessage").style.color = "red";
  }
});

let currentPage = 1;
const usersPerPage = 6;

// Function to fetch and display user data
async function fetchUsers(page) {
  try {
    const response = await fetch(
      `https://handsome-eel-pantsuit.cyclic.app/api/v1/users?page=${page}&count=${usersPerPage}`
    );
    const data = await response.json();

    if (data.success) {
      // Get the user-list container
      const userListContainer = document.getElementById("user-list");

      // Clear existing content if it's the first page
      if (page === 1) {
        userListContainer.innerHTML = "";
      }

      // Iterate through each user and create a card for them
      data.users.forEach((user) => {
        const card = document.createElement("div");
        card.className = "card mb-2";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const idText = document.createElement("p");
        idText.className = "card-text";
        idText.innerText = `ID: ${user.id}`;

        const cardTitle = document.createElement("h5");
        cardTitle.className = "card-title";
        cardTitle.innerText = user.name;

        const emailText = document.createElement("p");
        emailText.className = "card-text";
        emailText.innerText = `Email: ${user.email}`;

        const phoneText = document.createElement("p");
        phoneText.className = "card-text";
        phoneText.innerText = `Phone: ${user.phone}`;

        const positionText = document.createElement("p");
        positionText.className = "card-text";
        positionText.innerText = `Position: ${user.position}`;

        const tmpText = document.createElement("p");
        tmpText.className = "card-text";
        tmpText.innerText = `registration_timestamp: ${user.registration_timestamp}`;

        const userPhoto = document.createElement("img");
        userPhoto.src = `https://handsome-eel-pantsuit.cyclic.app/${user.photo}`;
        userPhoto.alt = "User Photo";
        userPhoto.className = "card-img-top mb-2";
        userPhoto.style.maxWidth = "100px";

        cardBody.appendChild(idText);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(emailText);
        cardBody.appendChild(phoneText);
        cardBody.appendChild(positionText);
        cardBody.appendChild(tmpText);
        cardBody.appendChild(userPhoto);

        card.appendChild(cardBody);
        userListContainer.appendChild(card);
      });
    } else {
      // Display error message in red if the API response indicates failure
      const errorMessage = document.createElement("p");
      errorMessage.innerText = `Error fetching users: ${
        data.error || "Unknown error"
      }`;
      errorMessage.style.color = "red";

      // Get the user-list container and append the error message
      const userListContainer = document.getElementById("user-list");
      userListContainer.innerHTML = "";
      userListContainer.appendChild(errorMessage);
    }
  } catch (error) {
    console.error("Error fetching users:", error.message);

    // Display error message in red
    const errorMessage = document.createElement("p");
    errorMessage.innerText = `Error fetching users: ${error.message}`;
    errorMessage.style.color = "red";

    // Get the user-list container and append the error message
    const userListContainer = document.getElementById("user-list");
    userListContainer.innerHTML = "";
    userListContainer.appendChild(errorMessage);
  }
}

// Function to handle "Show More" button click
function handleShowMoreClick() {
  currentPage++;
  fetchUsers(currentPage);
}

// Function to handle "Reset" button click
function handleResetClick() {
  currentPage = 1;
  fetchUsers(currentPage);
}

// Add event listeners to the buttons
document
  .getElementById("showMoreBtn")
  .addEventListener("click", handleShowMoreClick);
document.getElementById("resetBtn").addEventListener("click", handleResetClick);

// Call the function to fetch and display users for the first page
fetchUsers(currentPage);

async function submitForm() {
  event.preventDefault();
  const form = document.getElementById("addUserForm");
  const formData = new FormData(form);
  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      "https://handsome-eel-pantsuit.cyclic.app/api/v1/users",
      {
        method: "POST",
        headers: {
          Token: token,
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log("data: ", data);
    clearErrorMessages();
    if (data.success) {
      alert("User added successfully!");
      // Optionally, you can reset the form after successful submission
      form.reset();
    } else {
      displayErrorMessages(data, response.status);
    }
  } catch (error) {
    console.error("Error adding user:", error.message);

    displayErrorMessage(error.message);
  }
}

function clearErrorMessages() {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.innerHTML = ""; // Clear the content of the error container
}

function displayErrorMessages(data, errorCode) {
  const errorContainer = document.getElementById("errorContainer");
  clearErrorMessages();

  if (data && data.fails) {
    // Handle validation errors
    Object.keys(data.fails).forEach((fieldName) => {
      const errorMessage = data.fails[fieldName][0]; // Assuming there's only one error message per field

      const errorElement = document.createElement("p");
      errorElement.style.color = "red";
      errorElement.innerText = `Code: ${errorCode}, ${fieldName}: ${errorMessage}`;

      errorContainer.appendChild(errorElement);
    });
  } else {
    // Handle other error messages
    const errorMessage = data.message || "Unknown error";
    const errorElement = document.createElement("p");
    errorElement.style.color = "red";
    errorElement.innerText = `Code: ${errorCode}, ${errorMessage}`;

    errorContainer.appendChild(errorElement);
  }
}

function displayErrorMessage(message) {
  const errorContainer = document.getElementById("errorContainer");

  const errorElement = document.createElement("p");
  errorElement.className = "error-message";
  errorElement.style.color = "red";
  errorElement.innerText = message;

  errorContainer.appendChild(errorElement);
}
