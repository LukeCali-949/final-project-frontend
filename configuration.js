const mode = 0;

const host_local = "http://localhost:3000";
const host_remote = "";

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
        alert("Signup successful");
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

  window.location.href = "deliveryInformation.html";
}

function directToLoginPage() {
  location.href = "login.html";
}
