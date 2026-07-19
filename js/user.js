import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("Logged in:", user.email);

    } else {

        console.log("Not logged in");

    }

});

window.logout = async function () {

    await signOut(auth);

    window.location.href = "login.html";

};