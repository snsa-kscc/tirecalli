import { gsap, ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

// ============================================
// STATEMENT SECTION - Word by word reveal with pin
// ============================================
const statementText = document.querySelector(".fim-statement__text");
if (statementText) {
  const words = statementText.innerText.trim().split(" ");
  statementText.innerText = "";

  words.forEach((word) => {
    const span = document.createElement("span");
    span.textContent = `${word} `;
    span.style.opacity = "0.1";
    statementText.appendChild(span);
  });

  const statementSpans = document.querySelectorAll(".fim-statement__text span");

  gsap.to(statementSpans, {
    opacity: 1,
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".fim-statement",
      start: "top top",
      end: "+=150%",
      scrub: true,
      pin: true,
    },
  });
}

// ============================================
// HEADING ANIMATIONS - Horizontal movement on scroll
// ============================================
const headings = document.querySelectorAll(".fim-heading h1");

headings.forEach((heading, idx) => {
  const startX = idx % 2 === 0 ? -15 : 15;
  const endX = idx % 2 === 0 ? 15 : -15;

  gsap.fromTo(
    heading,
    { xPercent: startX },
    {
      xPercent: endX,
      scrollTrigger: {
        trigger: heading,
        scrub: true,
        start: "top 95%",
        end: "bottom 5%",
      },
    }
  );
});

// ============================================
// NATURE SECTION - Background color transition
// ============================================
gsap.to(".fim-nature", {
  backgroundColor: "#0a0a0a",
  scrollTrigger: {
    trigger: ".fim-nature",
    start: "top center",
    end: "bottom center",
    scrub: true,
  },
});

// ============================================
// WHY SECTION - Random text fade in
// ============================================
const whyList = document.querySelector(".fim-why__list");
if (whyList) {
  const whyItems = whyList.querySelectorAll("p");
  let fadedIndices = [];

  function fadeInRandomly() {
    if (fadedIndices.length >= whyItems.length) return;

    let randomIndex = -1;
    while (fadedIndices.includes(randomIndex) || randomIndex === -1) {
      randomIndex = Math.floor(Math.random() * whyItems.length);
    }

    gsap.to(whyItems[randomIndex], {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    });
    fadedIndices.push(randomIndex);

    setTimeout(fadeInRandomly, 120);
  }

  // Set initial state
  gsap.set(whyItems, { opacity: 0, y: 20 });

  ScrollTrigger.create({
    trigger: ".fim-why__list",
    start: "top 70%",
    once: true,
    onEnter: () => fadeInRandomly(),
  });
}

// ============================================
// GALLERY - Pinned with scale effect
// ============================================
const galleryImg = document.querySelector(".fim-gallery img");
if (galleryImg) {
  gsap.fromTo(
    galleryImg,
    { scale: 1.3 },
    {
      scale: 1,
      scrollTrigger: {
        trigger: ".fim-gallery",
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
      },
    }
  );
}

// ============================================
// DESCRIPTION SECTION - Staggered card reveals
// ============================================
const descItems = document.querySelectorAll(".fim-description__item");
descItems.forEach((item, idx) => {
  const direction = idx % 2 === 0 ? -100 : 100;
  gsap.from(item, {
    xPercent: direction,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: item,
      start: "top 85%",
    },
  });
});

// ============================================
// PRODUCTS SECTION - Image reveal with clip
// ============================================
const productImages = document.querySelectorAll(
  ".fim-products__group-right img"
);
productImages.forEach((img, idx) => {
  gsap.from(img, {
    clipPath: "inset(100% 0 0 0)",
    scale: 1.2,
    duration: 1.2,
    delay: idx * 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".fim-products__group-right",
      start: "top 75%",
    },
  });
});

// ============================================
// CREWNECK SECTION - Background transition
// ============================================
gsap.fromTo(
  ".fim-crewneck",
  { backgroundColor: "#ffffff" },
  {
    backgroundColor: "#f0f0f0",
    scrollTrigger: {
      trigger: ".fim-crewneck",
      start: "top center",
      end: "bottom center",
      scrub: true,
    },
  }
);

// Crewneck images slide in
const crewneckImages = document.querySelectorAll(
  ".fim-crewneck__group-right img"
);
crewneckImages.forEach((img, idx) => {
  gsap.from(img, {
    xPercent: 50,
    opacity: 0,
    duration: 0.8,
    delay: idx * 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: img,
      start: "top 85%",
    },
  });
});

// ============================================
// OUTRO SECTION - Text reveal with scale
// ============================================
const outroText = document.querySelector(".fim-outro__content .text--xxl");
if (outroText) {
  gsap.from(outroText, {
    scale: 0.9,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".fim-outro",
      start: "top 60%",
    },
  });
}

const outroCta = document.querySelector(".fim-outro__cta");
if (outroCta) {
  gsap.from(outroCta, {
    y: 60,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".fim-outro",
      start: "top 50%",
    },
  });
}

// ============================================
// NATURE IMAGES - Parallax stacking
// ============================================
const natureImages = document.querySelectorAll(".fim-nature__group-left img");
natureImages.forEach((img, idx) => {
  gsap.to(img, {
    yPercent: -20 * (idx + 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".fim-nature",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

// ============================================
// VIDEO - Play/pause on visibility
// ============================================
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

// ============================================
// HERO - Parallax effect
// ============================================
const heroImg = document.querySelector(".fim-hero__img");
if (heroImg) {
  gsap.to(heroImg, {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: ".fim-hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}
