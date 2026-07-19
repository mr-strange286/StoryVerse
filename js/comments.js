import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const chapterId = Number(params.get("id"));

const commentInput = document.getElementById("comment-input");
const commentBtn = document.getElementById("comment-btn");
const commentsContainer = document.getElementById("comments-container");

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (user) {

        commentBtn.disabled = false;
        commentInput.disabled = false;

    } else {

        commentBtn.disabled = true;
        commentInput.disabled = true;
        commentInput.placeholder = "Login to write a comment.";

    }

});

commentBtn.onclick = async () => {

    const text = commentInput.value.trim();

    if (!text) return;

    await addDoc(
        collection(db, "comments", `chapter_${chapterId}`, "messages"),
        {
            userId: currentUser.uid,
            email: currentUser.email,
            text: text,
            createdAt: serverTimestamp()
        }
    );

    commentInput.value = "";

};

const commentsQuery = query(
    collection(db, "comments", `chapter_${chapterId}`, "messages"),
    orderBy("createdAt", "desc")
);

onSnapshot(commentsQuery, (snapshot) => {

    commentsContainer.innerHTML = "";

    if (snapshot.empty) {

        commentsContainer.innerHTML = "<p>No comments yet.</p>";
        return;

    }

    snapshot.forEach((commentDoc) => {

        const comment = commentDoc.data();

        const div = document.createElement("div");

        div.className = "comment-card";

        div.innerHTML = `
            <div class="comment-header">
                <strong>${comment.email}</strong>
                ${
                    currentUser && currentUser.uid === comment.userId
                    ? `<button class="delete-comment" data-id="${commentDoc.id}">Delete</button>`
                    : ""
                }
            </div>

            <p>${comment.text}</p>
        `;

        commentsContainer.appendChild(div);
        const deleteButton = div.querySelector(".delete-comment");

        if (deleteButton) {

            deleteButton.onclick = async () => {

                if (!confirm("Delete this comment?")) return;

                await deleteDoc(
                    doc(
                        db,
                        "comments",
                        `chapter_${chapterId}`,
                        "messages",
                        deleteButton.dataset.id
                    )
                );

            };

        }

    });

});