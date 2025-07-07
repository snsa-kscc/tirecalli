import { gsap, ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const titleElement = document.querySelector(".butoh-title h1");
  if (titleElement) {
    const titleText = titleElement.textContent;
    titleElement.innerHTML = "";

    titleText.split(" ").forEach((word) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.margin = "0 0.2em";
      wordSpan.style.overflow = "hidden";

      const innerSpan = document.createElement("span");
      innerSpan.textContent = word;
      innerSpan.style.display = "inline-block";

      wordSpan.appendChild(innerSpan);
      titleElement.appendChild(wordSpan);
    });

    const titleSpans = document.querySelectorAll(".butoh-title h1 span span");

    gsap.from(titleSpans, {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".butoh-title h1",
        start: "top 90%",
        scrub: 0.5,
      },
    });
  }

  const revealElements = document.querySelectorAll(".butoh-concept__img, .butoh-nature__img, .butoh-why__pic, .butoh-gallery img, .butoh-detail__copy");

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  function revealOnScroll() {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add("active");
      }
    });
  }

  revealOnScroll();

  window.addEventListener("scroll", revealOnScroll);

  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(video);

    video.addEventListener("click", () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
});
