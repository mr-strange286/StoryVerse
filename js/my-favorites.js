import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const container = document.getElementById("favorites-container");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        container.innerHTML = `
            <p>Please <a href="login.html">login</a> to view your favorite chapters.</p>
        `;

        return;
    }

    // Get all favorite chapter IDs
    const favoriteSnapshot = await getDocs(
        collection(db, "favorites", user.uid, "chapters")
    );

    if (favoriteSnapshot.empty) {

        container.innerHTML = "<p>You haven't added any favorite chapters yet.</p>";

        return;
    }

    // Load chapter details
    const chapters = await fetch("assets/data/chapters.json")
        .then(response => response.json());

    container.innerHTML = "";

    favoriteSnapshot.forEach(doc => {

        const chapterId = doc.data().chapterId;

        const chapter = chapters.find(c => c.id === chapterId);

        if (!chapter) return;

        const card = document.createElement("div");

        card.className = "chapter-card";

        card.innerHTML = `
            <span class="chapter-number">
                Chapter ${chapter.id}
            </span>

            <h3>${chapter.title}</h3>

            <p>${chapter.description}</p>

            <a href="reader.html?id=${chapter.id}" class="read-btn">
                Read →
            </a>
        `;

        container.appendChild(card);

    });

});