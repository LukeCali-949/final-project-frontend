const mode = 1;

const host_local = "http://localhost:3000";
const host_remote = "https://final-project-backend-2-latest.onrender.com";

function getHost() {
  return mode == 0 ? host_local : host_remote;
}

function isLoggedIn() {
  if (localStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
}

function getTheToken() {
  return localStorage.getItem("token");
}

function saveTheToken(token) {
  localStorage.setItem("token", token);
}

function removeTheToken() {
  localStorage.removeItem("token");
}

let configuration = {
  isLoggedIn: () => isLoggedIn(),
  host: () => getHost(),
  token: () => getTheToken(),
};

//   if (configuration.isLoggedIn()) {

async function signup() {
  let email = document.getElementById("signupEmail").value;

  let username = email.split("@")[0];

  let password = document.getElementById("signupPassword").value;
  let customer = { username: username, password: password, email: email };
  fetch(getHost() + "/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  })
    .then((response) => {
      if (response.ok) {
        alert("Signup successful, Now Login To Start Ordering Flowers!");
        toggleForm("login");
        localStorage.setItem("username", username);
      } else {
        console.log(`response status:${response.status}`);
        alert("Something went wrong!");
        location.href = "index.html";
      }
    })
    .catch((error) => {
      console.log(error);
      alert("Something went wrong!");
    });
}

async function login() {
  let email = document.getElementById("loginEmail").value;
  let username = email.split("@")[0];

  let password = document.getElementById("loginPassword").value;
  let customer = { username: username, password: password };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  };
  try {
    let response = await fetch(getHost() + "/signin", request);
    if (response.ok) {
      alert("The login was successful!");
      const token = await response.text();
      console.log(token);
      saveTheToken(token);
      localStorage.setItem("username", username);
      alert("The login was successful!");
    } else {
      console.error(error);
      removeTheToken();
      alert("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    removeTheToken();
    alert("Something went wrong!");
  }
}

async function logout() {
  removeTheToken();
}

function addToBasket() {
  var deliveryDate = document.getElementById("delivery-date").value;

  var purchasingOption = document.querySelector(
    'input[name="purchase-option"]:checked'
  );

  if (!deliveryDate || !purchasingOption) {
    alert(
      "Please select a delivery date and purchasing option before continuing."
    );
    return;
  }

  localStorage.setItem("deliveryDate", deliveryDate);
  localStorage.setItem("purchasingOption", purchasingOption.id);
  localStorage.setItem("itemInCart", true);

  window.location.href = "deliveryInformation.html";
}

function directToLoginPage() {
  location.href = "login.html";
}

function PostOrder() {
  if (!localStorage.getItem("token")) {
    alert("you must be logged in to place an order");
    location.href = "login.html";
    return;
  }

  const orderData = JSON.parse(localStorage.getItem("orderData"));
  const selectedFlower = JSON.parse(localStorage.getItem("selectedFlower"));
  const username = localStorage.getItem("username");

  const order = {
    flowerId: Number(selectedFlower.id),
    recipientName: `${orderData.firstName} ${orderData.lastName}`,
    totalCost: Number(selectedFlower.price),
    customerUserName: username,
  };

  fetch(getHost() + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTheToken()}`,
    },
    body: JSON.stringify(order),
  })
    .then((response) => {
      console.log(response.json());
    })
    .then((window.location.href = "MyOrders.html"))
    .then(alert("Order Succesfully Placed!"))

    .catch((error) => {
      console.log(error);
      alert("Something went wrong!");
    });

  localStorage.setItem("itemInCart", false);
  localStorage.setItem("orderData", {});
  localStorage.setItem("selectedFlower", {});
}

function getOrders() {
  const username = localStorage.getItem("username");

  fetch(getHost() + "/orders/" + username, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTheToken()}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
      alert("Something went wrong!");
    });
}

function toggleForm(view) {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const signupButton = document.getElementById("signup-button");
  const loginButton = document.getElementById("login-button");

  if (view === "signup") {
    signupForm.style.display = "flex";
    loginForm.style.display = "none";
    signupButton.classList.add("active");
    loginButton.classList.remove("active");
  } else {
    signupForm.style.display = "none";
    loginForm.style.display = "flex";
    signupButton.classList.remove("active");
    loginButton.classList.add("active");
  }
}
