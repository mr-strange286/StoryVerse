import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
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

    const userDoc = await getDoc(
        doc(db, "users", currentUser.uid)
    );

    const userData = userDoc.data();

    await addDoc(
        collection(db, "comments", `chapter_${chapterId}`, "messages"),
        {
            userId: currentUser.uid,
            displayName: userData.displayName,
            avatar: userData.avatar,
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
function formatTime(timestamp) {

    if (!timestamp) return "Just now";

    const date = timestamp.toDate();

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60)
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24)
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);

    if (days < 7)
        return `${days} day${days > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();

}

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
            <div class="comment-top">

                <img
                    class="comment-avatar"
                    src="images/avatars/${comment.avatar || "avatar1.png"}"
                    alt="Avatar"
                >

                <div class="comment-info">

                    <strong>${comment.displayName || comment.email}</strong>

                    <div class="comment-time">
                        ${formatTime(comment.createdAt)}
                    </div>

                </div>

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