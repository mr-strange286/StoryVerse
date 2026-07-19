import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profileJoined = document.getElementById("profile-joined");
const profileRole = document.getElementById("profile-role");
const saveButton = document.getElementById("save-profile");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {

        profileName.textContent = "Profile not found.";
        return;

    }

    const data = userSnap.data();

    profileName.value = data.displayName;
    profileEmail.textContent = `📧 ${data.email}`;
    profileRole.textContent = `👤 ${data.role}`;

    if (data.joinedAt) {

        const joinedDate = data.joinedAt.toDate();

        profileJoined.textContent =
            `📅 Joined: ${joinedDate.toLocaleDateString()}`;

    } else {

        profileJoined.textContent = "📅 Joined: Unknown";

    }
    saveButton.onclick = async () => {

        const newName = profileName.value.trim();

        if (!newName) {

            alert("Display name cannot be empty.");

            return;

        }

        await updateDoc(
            userRef,
            {
                displayName: newName
            }
        );

        alert("Profile updated successfully!");

    };

});