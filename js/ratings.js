import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const chapterId = Number(params.get("id"));

const stars = document.querySelectorAll("#rating-stars span");
const ratingInfo = document.getElementById("rating-info");
const yourRating = document.getElementById("your-rating");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    currentUser = user;

    await loadAverageRating();

    if (!user) return;

    const myRatingDoc = await getDoc(
        doc(db, "ratings", `chapter_${chapterId}`, "users", user.uid)
    );

    if (myRatingDoc.exists()) {

        const myRating = myRatingDoc.data().rating;

        highlightStars(myRating);

        yourRating.textContent = `Your Rating: ${"★".repeat(myRating)}${"☆".repeat(5-myRating)}`;

    }

});

stars.forEach(star => {

    star.addEventListener("click", async () => {

        if (!currentUser) {

            alert("Please login to rate this chapter.");

            sessionStorage.setItem(
                "redirectAfterLogin",
                window.location.href
            );

            window.location.href = "login.html";

            return;

        }

        const rating = Number(star.dataset.value);

        await setDoc(
            doc(db, "ratings", `chapter_${chapterId}`, "users", currentUser.uid),
            {
                rating: rating
            }
        );

        highlightStars(rating);

        yourRating.textContent =
        `Your Rating: ${"★".repeat(rating)}${"☆".repeat(5-rating)}`;

        await loadAverageRating();

    });

});

function highlightStars(value) {

    stars.forEach(star => {

        if (Number(star.dataset.value) <= value) {

            star.style.color = "#FFD700";

        } else {

            star.style.color = "#999";

        }

    });

}

async function loadAverageRating() {

    const snapshot = await getDocs(
        collection(db, "ratings", `chapter_${chapterId}`, "users")
    );

    let total = 0;

    snapshot.forEach(doc => {

        total += doc.data().rating;

    });

    const count = snapshot.size;

    if (count === 0) {

        ratingInfo.textContent = "Be the first to rate this chapter.";

        return;

    }

    const average = (total / count).toFixed(1);

    ratingInfo.innerHTML = `
        ⭐ <strong>${average}</strong> / 5
        <br>
        ${count} Rating${count > 1 ? "s" : ""}
    `;

}