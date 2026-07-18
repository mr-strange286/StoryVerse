const chaptersContainer = document.getElementById("chapters-container");
const searchBox = document.getElementById("search-box");

let allChapters = [];
const completedChapters =
    JSON.parse(localStorage.getItem("completedChapters")) || [];

fetch("assets/data/chapters.json")
    .then(response => response.json())
    .then(chapters => {

        allChapters = chapters;

        displayChapters(allChapters);

    })
    .catch(() => {

        chaptersContainer.innerHTML =
            "<p>Unable to load chapters.</p>";

    });

function displayChapters(chapters){

    chaptersContainer.innerHTML = "";
    if(chapters.length === 0){

        chaptersContainer.innerHTML =
            "<p>No chapters found.</p>";

        return;

    }
    chapters.forEach(chapter => {

        const isUnlocked = chapter.id <= latestReleasedChapter;

        const isCompleted =
            completedChapters.includes(chapter.id);

        const chapterCard = document.createElement("div");

        chapterCard.className = "chapter-card";

        chapterCard.innerHTML = `

            <div class="chapter-info">

                <span class="chapter-number">
                    Chapter ${chapter.id}
                </span>

                <h2>
                    ${
                        isUnlocked
                            ? chapter.title
                            : "Title Coming Soon"
                    }
                </h2>

                ${
                    isUnlocked
                        ? `<p>${chapter.description}</p>`
                        : ``
                }

                ${
                    isUnlocked
                        ? `
                            <p class="chapter-published">
                                Published: ${chapter.published}
                            </p>
                        `
                        : ``
                }

            </div>

            ${
                isUnlocked
                    ? `<a href="reader.html?id=${chapter.id}" class="read-button ${isCompleted ? "completed" : ""}">
                            ${isCompleted ? "✓ Read" : "Read →"}
                    </a>`
                    : `<span class="read-button locked">
                            Coming Soon
                    </span>`
            }

        `;

        chaptersContainer.appendChild(chapterCard);

    });

}

searchBox.addEventListener("input", function(){

    const searchText = searchBox.value.trim().toLowerCase();

    const filteredChapters = allChapters.filter(chapter =>

        chapter.title.toLowerCase().includes(searchText) ||

        chapter.id.toString().includes(searchText)

    );

    displayChapters(filteredChapters);

});