const title = document.getElementById("chapter-title");
const content = document.getElementById("chapter-content");
const chapterLoader = document.getElementById("chapter-loader");
const readingTime = document.getElementById("reading-time");

const previousButton = document.getElementById("previous-btn");
const nextButton = document.getElementById("next-btn");

const progressBar = document.querySelector(".progress-bar");
const backToTopButton = document.getElementById("back-to-top");

const chapterCompletedMessage =
    document.getElementById("chapter-completed");

let chapterMarkedCompleted = false;

const params = new URLSearchParams(window.location.search);
const chapterId = Number(params.get("id"));

fetch("assets/data/chapters.json")

.then(response => response.json())

.then(chapters => {

    const chapterInfo = chapters.find(chapter => chapter.id === chapterId);

    if(!chapterInfo){

        throw new Error("Chapter not found");

    }

    if(chapterId > latestReleasedChapter){

        title.textContent = "Coming Soon";
        readingTime.style.display = "none";

        content.textContent =
            "This chapter hasn't been released yet. Please check back next week.";

        previousButton.style.display = "none";

        nextButton.style.display = "none";

        if(chapterLoader){

            chapterLoader.classList.add("hidden");

            setTimeout(() => {

                chapterLoader.remove();

            }, 500);

        }

        return;

    }

    return Promise.all([

        Promise.resolve(chapters),

        fetch(`assets/chapters/${chapterId}.json`)
        .then(response => {

            if(!response.ok){

                throw new Error("Chapter not found");

            }

            return response.json();

        })

    ]);

})

.then(([chapters, chapter]) => {

    title.textContent = `Chapter ${chapter.id}: ${chapter.title}`;

    // Calculate reading time
    const words = chapter.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    readingTime.textContent = `⏱ ${minutes} min read`;

    content.textContent = chapter.content;
    if(chapterLoader){

        chapterLoader.classList.add("hidden");

        setTimeout(() => {

            chapterLoader.remove();

        }, 500);

    }

    /* ==========================
        SAVE LAST READ CHAPTER
        ========================== */

    localStorage.setItem("lastChapter", chapter.id);
    

    /* ==========================
       PREVIOUS BUTTON
    ========================== */

    if(chapter.id > 1){

        previousButton.onclick = function(){

            window.location.href = `reader.html?id=${chapter.id - 1}`;

        };

    }

    else{

        previousButton.disabled = true;

    }

    /* ==========================
    NEXT BUTTON
    ========================== */

    if (chapter.id < latestReleasedChapter) {

        nextButton.onclick = function () {

            window.location.href = `reader.html?id=${chapter.id + 1}`;

        };

    }

    else{

        nextButton.disabled = true;

    }

})

.catch(() => {

    title.textContent = "Chapter Not Found";
    readingTime.style.display = "none";

    content.textContent =
        "The requested chapter does not exist.";

    previousButton.style.display = "none";

    nextButton.style.display = "none";

    if(chapterLoader){

        chapterLoader.classList.add("hidden");

        setTimeout(() => {

            chapterLoader.remove();

        }, 500);

    }

});

/* ==========================
   SCROLL EFFECTS
========================== */

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    if(progressBar && documentHeight > 0){

        const scrollPercent =
            (scrollTop / documentHeight) * 100;

        progressBar.style.width = `${scrollPercent}%`;

    }

    if(backToTopButton){

        backToTopButton.style.display =
            scrollTop > 400 ? "block" : "none";

    }

    /* ==========================
       CHAPTER COMPLETION
    ========================== */

    if(
        !chapterMarkedCompleted &&
        documentHeight > 0 &&
        scrollTop >= documentHeight - 100
    ){

        chapterMarkedCompleted = true;

        let completedChapters =
            JSON.parse(localStorage.getItem("completedChapters")) || [];

        if(!completedChapters.includes(chapterId)){

            completedChapters.push(chapterId);

            localStorage.setItem(
                "completedChapters",
                JSON.stringify(completedChapters)
            );

        }

        if(chapterCompletedMessage){

            chapterCompletedMessage.style.display = "block";

        setTimeout(() => {

            chapterCompletedMessage.style.display = "none";

        }, 3000);

        }

    }

});

/* ==========================
   BACK TO TOP
========================== */

if(backToTopButton){

    backToTopButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* ==========================
   KEYBOARD NAVIGATION
========================== */

document.addEventListener("keydown", function(event){

    if(event.key === "ArrowLeft" && !previousButton.disabled){

        window.location.href =
            `reader.html?id=${chapterId - 1}`;

    }

    if(event.key === "ArrowRight" && !nextButton.disabled){

        window.location.href =
            `reader.html?id=${chapterId + 1}`;

    }

    if(event.key === "Home"){

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

});