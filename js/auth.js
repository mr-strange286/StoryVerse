import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const email = document.getElementById("email");
const displayName = document.getElementById("displayName");
const password = document.getElementById("password");
const message = document.getElementById("message");

document.getElementById("signupBtn").onclick = async () => {

    if (displayName.value.trim() === "") {

        message.textContent = "Please enter a display name.";

        return;

    }
    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        await setDoc(
            doc(db, "users", userCredential.user.uid),
            {
                displayName: displayName.value.trim(),
                email: email.value,
                joinedAt: serverTimestamp(),
                role: "user"
            }
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