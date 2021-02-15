const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password-confirmation");

const showError = (input, message) => {
	const formControl = input.parentElement;
	formControl.className = "form-control error";
	const small = formControl.querySelector("small");
	small.innerText = message;
};

const showSuccess = (input) => {
	const formControl = input.parentElement;
	formControl.className = "form-control success";
};

const checkEmail = (input) => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (re.test(input.value.trim())) {
		showSuccess(input);
	} else {
		showError(input, "Email is not valid");
	}
};

const checkRequired = (inputArr) => {
	inputArr.forEach((input) => {
		if (input.value.trim() === "") {
			showError(input, `${getFieldName(input)} is required`);
		} else {
			showSuccess(input);
		}
	});
};

const checkLength = (input, min, max) => {
	if (input.value.length < min) {
		showError(
			input,
			`${getFieldName(input)} must be at least ${min} characters`
		);
	} else if (input.value.length > max) {
		showError(
			input,
			`${getFieldName(input)} must be less than ${max} characters`
		);
	} else {
		showSuccess(input);
	}
};

const checkPasswordsMatch = (input1, input2) => {
	if (input1.value !== input2.value) {
		showError(input2, "Passwords do not match");
	}
};

const getFieldName = (input) => {
	return input.id.charAt(0).toUpperCase() + input.id.slice(1);
};

form.addEventListener("submit", (e) => {
	e.preventDefault();
	let arr = [username, email, password, password2];
	checkRequired(arr);
	checkLength(username, 3, 70);
	checkLength(password, 6, 100);
	checkEmail(email);
	checkPasswordsMatch(password, password2);
	e.target.submit();
	// console.log(arr[0].value + " " + arr[1].value + " " + arr[2].value);
});

// * google auth
function onSignIn(googleUser) {
	// Useful data for your client-side scripts:
	var profile = googleUser.getBasicProfile();
	// console.log("ID: " + profile.getId());
	// console.log("Full Name: " + profile.getName());
	// console.log("Given Name: " + profile.getGivenName());
	// console.log("Family Name: " + profile.getFamilyName());
	// console.log("Image URL: " + profile.getImageUrl());
	// console.log("Email: " + profile.getEmail());

	// The ID token you need to pass to your backend:
	var id_token = googleUser.getAuthResponse().id_token;
	console.log("ID Token: " + id_token);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/sign-in");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () {
		//console.log("Signed in as: " + xhr.responseText);
		if (xhr.responseText == "done") {
			signOut();
			location.assign("/user");
		}
	};
	xhr.send(JSON.stringify({ token: id_token }));
}

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log("User signed out.");
	});
}
