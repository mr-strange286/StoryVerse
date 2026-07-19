import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const chapterId = Number(params.get("id"));

const favoriteBtn = document.getElementById("favorite-btn");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    currentUser = user;

    if (!user) {

        favoriteBtn.textContent = "🤍 Login to Favorite";

        return;

    }

    const favoriteDoc = await getDoc(
        doc(db, "favorites", user.uid, "chapters", String(chapterId))
    );

    if (favoriteDoc.exists()) {

        favoriteBtn.textContent = "❤️ Remove Favorite";

    } else {

        favoriteBtn.textContent = "🤍 Add to Favorites";

    }

});

favoriteBtn.onclick = async () => {

    if (!currentUser) {

        alert("Please login first.");

        sessionStorage.setItem(
            "redirectAfterLogin",
            window.location.href
        );

        window.location.href = "login.html";

        return;

    }

    const ref = doc(
        db,
        "favorites",
        currentUser.uid,
        "chapters",
        String(chapterId)
    );

    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {

        await deleteDoc(ref);

        favoriteBtn.textContent = "🤍 Add to Favorites";

    } else {

        await setDoc(ref, {
            chapterId: chapterId,
            addedAt: new Date().toISOString()
        });

        favoriteBtn.textContent = "❤️ Remove Favorite";

    }

};