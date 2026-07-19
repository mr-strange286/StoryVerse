import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profileJoined = document.getElementById("profile-joined");
const profileRole = document.getElementById("profile-role");
const saveButton = document.getElementById("save-profile");
const avatarSelect = document.getElementById("avatar-select");
const avatarPreview = document.getElementById("avatar-preview");
const favoriteCount = document.getElementById("favorite-count");
const ratingCount = document.getElementById("rating-count");
const commentCount = document.getElementById("comment-count");

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
    if (data.avatar) {

        avatarSelect.value = data.avatar;

        avatarPreview.src = `images/avatars/${data.avatar}`;

    }
    profileEmail.textContent = `📧 ${data.email}`;
    profileRole.textContent = `👤 ${data.role}`;

    if (data.joinedAt) {

        const joinedDate = data.joinedAt.toDate();

        profileJoined.textContent =
            `📅 Joined: ${joinedDate.toLocaleDateString()}`;

    } else {

        profileJoined.textContent = "📅 Joined: Unknown";

    }
    const favoritesSnapshot = await getDocs(
        collection(db, "favorites", user.uid, "chapters")
    );

    favoriteCount.textContent =
        `❤️ Favorites: ${favoritesSnapshot.size}`;
    saveButton.onclick = async () => {

        const newName = profileName.value.trim();

        if (!newName) {

            alert("Display name cannot be empty.");

            return;

        }

        await updateDoc(
            userRef,
            {
                displayName: newName,
                avatar: avatarSelect.value
            }
        );

        alert("Profile updated successfully!");

    };

});
avatarSelect.addEventListener("change", () => {

    avatarPreview.src =
        `images/avatars/${avatarSelect.value}`;

});