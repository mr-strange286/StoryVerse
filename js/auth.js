import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");

document.getElementById("signupBtn").onclick = async () => {

    try {

        await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        message.textContent = "Account created successfully!";

    } catch (e) {

        message.textContent = e.message;

    }

};

document.getElementById("loginBtn").onclick = async () => {

    try {

        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        message.textContent = "Login successful!";

        const redirect =
            sessionStorage.getItem("redirectAfterLogin");

        if (redirect) {

            sessionStorage.removeItem("redirectAfterLogin");

            window.location.href = redirect;

        } else {

            window.location.href = "index.html";

        }

    } catch (e) {

        message.textContent = e.message;

    }

};