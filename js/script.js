/* ==========================
   CONTINUE READING
========================== */

const startReadingButton = document.getElementById("start-reading-btn");

const progressText = document.getElementById("progress-text");

const progressPercent = document.getElementById("progress-percent");

const progressFill = document.getElementById("progress-fill");

if(startReadingButton){

    const lastChapter = Number(localStorage.getItem("lastChapter"));

    // Change this number when you add more chapters
    const totalChapters = 78;

    if(lastChapter>0){

        startReadingButton.href = `reader.html?id=${lastChapter}`;

        startReadingButton.textContent = "Continue Reading";

        const progress = Math.min(
            (lastChapter / totalChapters) * 100,
            100
        );

        progressPercent.textContent =
            `${Math.round(progress)}% Complete`;

        progressText.textContent =
            `Last Read: Chapter ${lastChapter}`;

        progressFill.style.width = `${progress}%`;

    }

    else{

        startReadingButton.href = "reader.html?id=1";

        progressPercent.textContent = "0% Complete";

        progressText.textContent = "You haven't started reading yet.";

        progressFill.style.width = "0%";

    }

}
/* ==========================
   SCROLL REVEAL
========================== */

const revealElements = document.querySelectorAll(".reveal");

function revealSections(){

    revealElements.forEach(section => {

        const sectionTop = section.getBoundingClientRect().top;

        const windowHeight = window.innerHeight;

        if(sectionTop < windowHeight - 100){

            section.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealSections);

revealSections();

/* ==========================
   MOBILE MENU
========================== */

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

const navItems = document.querySelectorAll(".nav-links a");

if(menuToggle && navLinks){

    menuToggle.addEventListener("click", function(){

        navLinks.classList.toggle("active");

        if(navLinks.classList.contains("active")){

            menuToggle.textContent = "✕";

        }

        else{

            menuToggle.textContent = "☰";

        }

    });

    navItems.forEach(link => {

        link.addEventListener("click", function(){

            navLinks.classList.remove("active");

            menuToggle.textContent = "☰";

        });

    });

}
/* ==========================
   NAVBAR SCROLL EFFECT
========================== */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function(){

    if(window.scrollY > 50){

        navbar.classList.add("scrolled");

    }

    else{

        navbar.classList.remove("scrolled");

    }

});

/* ==========================
   ACTIVE NAVIGATION
========================== */

const currentPage = window.location.pathname.split("/").pop();

const navigationLinks = document.querySelectorAll(".nav-link");

navigationLinks.forEach(link => {

    const linkPage = link.getAttribute("href").split("#")[0];

    if(linkPage === currentPage){

        link.classList.add("active");

    }

});

/* ==========================
   PRELOADER
========================== */

window.addEventListener("load", function(){

    const preloader = document.getElementById("preloader");

    if(preloader){

        preloader.style.opacity = "0";

        setTimeout(function(){

            preloader.style.display = "none";

        }, 600);

    }

});

/* ==========================
   BACK TO TOP
========================== */

const backToTopButton = document.getElementById("back-to-top");

if(backToTopButton){

    window.addEventListener("scroll", function(){

        if(window.scrollY > 400){

            backToTopButton.style.display = "block";

        }

        else{

            backToTopButton.style.display = "none";

        }

    });

    backToTopButton.addEventListener("click", function(){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}