import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const authLink = document.getElementById("auth-link");

if (!authLink) {

    console.log("No auth link on this page.");

} else {

    onAuthStateChanged(auth, (user) => {

        if (user) {

            authLink.innerHTML = `
                <a href="#" class="nav-link" id="logout-btn">
                    Logout
                </a>
            `;

            document.getElementById("logout-btn").onclick = async (e) => {

                e.preventDefault();

                await signOut(auth);

                window.location.reload();

            };

        } else {

            authLink.innerHTML = `
                <a href="login.html" class="nav-link">
                    Login
                </a>
            `;

        }

    });

}
