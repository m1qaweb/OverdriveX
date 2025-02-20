const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
document.head.appendChild(script);

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("preloaderShown")) {
    document.getElementById("preloader").style.display = "none";
    document.body.style.overflow = "auto";
    return;
  }

  localStorage.setItem("preloaderShown", "true");

  setTimeout(() => {
    const logo = document.querySelector(".preloader-logo img");
    if (logo) {
      logo.style.animation = "none";
    }

    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
        document.body.style.overflow = "auto";
      }, 800);
    }
  }, 3000);
});

function openModal(type) {
  const modal = document.getElementById("authModal");
  modal.style.display = "block";

  gsap.fromTo(
    ".modal-content",
    { opacity: 0, scale: 0.8, y: -30 },
    { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
  );

  switchForm(type);
}

function closeModal() {
  gsap.to(".modal-content", {
    opacity: 0,
    scale: 0.8,
    y: -30,
    duration: 0.3,
    ease: "power2.in",
    onComplete: function () {
      document.getElementById("authModal").style.display = "none";
    },
  });
}

function switchForm(type) {
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  if (type === "signIn") {
    gsap.to(signUpForm, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        signUpForm.style.display = "none";
        signInForm.style.display = "block";
        gsap.fromTo(
          signInForm,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      },
    });
  } else {
    gsap.to(signInForm, {
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
        gsap.fromTo(
          signUpForm,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      },
    });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("toggleSignInPassword")
    .addEventListener("click", function () {
      togglePassword("signInPassword", this);
    });

  document
    .getElementById("toggleSignUpPassword")
    .addEventListener("click", function () {
      togglePassword("signUpPassword", this);
    });

  function togglePassword(passwordFieldId, icon) {
    const passwordField = document.getElementById(passwordFieldId);

    if (!passwordField) {
      console.error("Password field not found:", passwordFieldId);
      return;
    }

    if (passwordField.type === "password") {
      passwordField.type = "text";
      icon.src = "./assets/openedeye.svg";
    } else {
      passwordField.type = "password";
      icon.src = "./assets/closedeye.svg";
    }
  }
});
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{6,}$/;

function saveUser(username, email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some((user) => user.email === email)) {
    document.getElementById("signUpError").textContent =
      "Email already registered!";
    return;
  }

  users.push({ username, email, password: btoa(password) });
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("signInEmail").value = email;

  switchForm("signIn");
}

function validateSignUp() {
  let username = document.getElementById("signUpUsername").value.trim();
  let email = document.getElementById("signUpEmail").value.trim();
  let password = document.getElementById("signUpPassword").value.trim();
  let errorMsg = document.getElementById("signUpError");

  if (!username) {
    errorMsg.textContent = "Username is required!";
    return;
  }
  if (!emailPattern.test(email)) {
    errorMsg.textContent = "Invalid email format!";
    return;
  }
  if (!passwordPattern.test(password)) {
    errorMsg.textContent =
      "Password must be 6+ chars, 1 uppercase, 1 number, 1 special character!";
    return;
  }

  errorMsg.textContent = "";
  saveUser(username, email, password);
}

function validateSignIn() {
  let email = document.getElementById("signInEmail").value.trim();
  let password = document.getElementById("signInPassword").value.trim();
  let errorMsg = document.getElementById("signInError");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(
    (user) => user.email === email && atob(user.password) === password
  );

  if (!user) {
    errorMsg.textContent = "Invalid email or password!";
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  updateAuthUI();
  closeModal();
}

function updateAuthUI() {
  const authButtons = document.querySelector(".auth-buttons");
  const userProfile = document.querySelector(".user-profile");
  const logoImg = document.querySelector(".logo img");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    authButtons.style.display = "none";
    userProfile.style.display = "flex";

    if (window.innerWidth <= 1024) {
      logoImg.style.top = "53px";
    } else {
      logoImg.style.top = "45px";
    }

    userProfile.innerHTML = `
      <div class="profile">
        <span>${user.username}</span>
        <div id="userIcon" class="profile-icon"></div>
        <div class="dropdown" id="dropdownMenu">
          <a href="#" onclick="logout()">Log Out</a>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      const userIconContainer = document.getElementById("userIcon");
      if (userIconContainer) {
        lottie.loadAnimation({
          container: userIconContainer,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "/assets/user-icon.json",
        });
      }
    });

    setupDropdownAnimation();
  } else {
    authButtons.style.display = "flex";
    userProfile.style.display = "none";

    if (window.innerWidth <= 1024) {
      logoImg.style.top = "53px";
    } else {
      logoImg.style.top = "35px";
    }
  }
}

window.addEventListener("resize", updateAuthUI);
window.onload = function () {
  updateAuthUI();
};

function setupDropdownAnimation() {
  const profileIcon = document.querySelector(".profile-icon");
  const dropdown = document.querySelector("#dropdownMenu");

  if (!profileIcon || !dropdown) return;

  let isOpen = false;

  profileIcon.addEventListener("click", (event) => {
    event.stopPropagation();

    gsap.to(dropdown, {
      opacity: isOpen ? 0 : 1,
      y: isOpen ? -10 : 0,
      visibility: isOpen ? "hidden" : "visible",
      duration: 0.3,
      ease: "power2.out",
    });

    isOpen = !isOpen;
  });

  document.addEventListener("click", (event) => {
    if (
      !profileIcon.contains(event.target) &&
      !dropdown.contains(event.target)
    ) {
      gsap.to(dropdown, {
        opacity: 0,
        y: -10,
        visibility: "hidden",
        duration: 0.2,
        ease: "power2.in",
      });
      isOpen = false;
    }
  });
}

function logout() {
  localStorage.removeItem("loggedInUser");
  updateAuthUI();
}

window.onload = function () {
  updateAuthUI();
};
document.addEventListener("DOMContentLoaded", function () {
  let menuAnimation = lottie.loadAnimation({
    container: document.getElementById("menuIcon"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "/assets/menu-icon.json",
  });

  let isMenuOpen = false;
  const menuIcon = document.getElementById("menuIcon");
  const mobileNav = document.getElementById("mobileNav");
  const closeMenuBtn = document.getElementById("closeMenu");
  const navLinks = document.querySelectorAll(".mobile-nav-links li");
  const navLinksAnchor = document.querySelectorAll(".mobile-nav-links a");

  function openMenu() {
    if (isMenuOpen) return;
    isMenuOpen = true;

    menuAnimation.playSegments([0, 30], true);
    mobileNav.classList.add("show");

    navLinks.forEach((li, index) => {
      gsap.fromTo(
        li,
        { opacity: 0, x: index % 2 === 0 ? -450 : 450 },
        { opacity: 1, x: 0, duration: 0.8, delay: index * 0.1 }
      );
    });
  }

  function closeMenu() {
    if (!isMenuOpen) return;
    isMenuOpen = false;

    menuAnimation.playSegments([30, 0], true);
    gsap.to(navLinks, { opacity: 0, x: 0, duration: 0.3, stagger: 0.1 });

    setTimeout(() => mobileNav.classList.remove("show"), 300);
  }

  menuIcon.addEventListener("click", openMenu);
  closeMenuBtn.addEventListener("click", closeMenu);

  navLinksAnchor.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const jsonURL =
    "https://raw.githubusercontent.com/Troxv9/CarModelsAPI/refs/heads/main/mockend.json";

  try {
    const response = await fetch(jsonURL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    if (!data.engines || !Array.isArray(data.engines)) {
      throw new Error("No engines data found!");
    }

    const engines = data.engines;
    const engineTextBlocks = document.querySelectorAll(".engine-text");

    if (engines.length < engineTextBlocks.length) {
      console.warn("Not enough engine data available!");
    }

    engineTextBlocks.forEach((block, index) => {
      if (engines[index]) {
        block.innerHTML = `
          <h3>${engines[index].name}</h3>
          <ul>
            <li><strong>Cylinders:</strong> ${engines[index].cylinders}</li>
            <li><strong>Displacement:</strong> ${engines[index].displacement}</li>
            <li><strong>Power Output:</strong> ${engines[index].power_output}</li>
            <li><strong>Torque:</strong> ${engines[index].torque}</li>
            <li><strong>RPM Range:</strong> ${engines[index].rpm_range}</li>
            <li><strong>Fuel Efficiency:</strong> ${engines[index].fuel_efficiency}</li>
          </ul>
        `;
        block.style.opacity = "1";
        block.style.transform = "translateX(0)";
        block.style.clipPath = "inset(0 0 0 0)";
      }
    });

    if (typeof gsap !== "undefined") {
      gsap.from(".engine-text", {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.3,
      });
    } else {
      console.warn("GSAP is not loaded!");
    }
  } catch (error) {
    console.error("Error fetching engine data:", error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const engineRows = document.querySelectorAll(".engine-row");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  engineRows.forEach((row) => observer.observe(row));
});

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".scroll-wrapper");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const jsonURL =
    "https://raw.githubusercontent.com/Troxv9/CarModelsAPI/refs/heads/main/mockend.json";

  let index = 1;
  let slideWidth;
  let autoPlayInterval;
  let totalSlides;

  fetch(jsonURL)
    .then((response) => response.json())
    .then((data) => {
      const cars = data.cars;
      slider.innerHTML = "";

      cars.forEach((car) => {
        const carHTML = `
          <article class="car scroll-slide">
            <div class="scroll-line"></div>
            <div class="car-container">
              <div class="car-image">
                <img
                  src="/assets/images/${car.name}.png"
                  width="700px"
                  alt="${car.name}"
                  onerror="this.onerror=null; this.src='/assets/images/placeholder.png';"
                />
              </div>
              <div class="car-body">
                <ul class="car-title">${car.name.replace(/_/g, " ")}</ul>
               <li>Horsepower: ${car.horsepower}hp</li> 
               <li>Top Speed: ${car.top_speed}</li>
                <p class="car-price">Starting from <strong>${
                  car.price
                }</strong></p>
              </div>
            </div>
          </article>
        `;
        slider.innerHTML += carHTML;
      });

      setTimeout(() => initializeCarousel(), 100);
    })
    .catch((error) => console.error("Error fetching car data:", error));

  function initializeCarousel() {
    const slides = Array.from(document.querySelectorAll(".scroll-slide"));

    if (slides.length === 0) return;

    slideWidth = slides[0].offsetWidth;
    totalSlides = slides.length;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    slider.appendChild(firstClone);
    slider.insertBefore(lastClone, slides[0]);

    slider.style.transform = `translateX(-${index * slideWidth}px)`;

    startAutoPlay();
  }

  function moveSlide(direction) {
    slider.style.transition = "transform 0.7s ease-in-out";

    if (direction === "next") {
      index++;
    } else {
      index--;
    }

    slider.style.transform = `translateX(-${index * slideWidth}px)`;

    setTimeout(() => {
      if (index >= totalSlides + 1) {
        slider.style.transition = "none";
        index = 1;
        slider.style.transform = `translateX(-${index * slideWidth}px)`;
      } else if (index <= 0) {
        slider.style.transition = "none";
        index = totalSlides;
        slider.style.transform = `translateX(-${index * slideWidth}px)`;
      }
    }, 700);
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      moveSlide("next");
    }, 4000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  prevBtn.addEventListener("click", () => {
    stopAutoPlay();
    moveSlide("prev");
    startAutoPlay();
  });

  nextBtn.addEventListener("click", () => {
    stopAutoPlay();
    moveSlide("next");
    startAutoPlay();
  });

  window.addEventListener("resize", () => {
    slideWidth = document.querySelector(".scroll-slide").offsetWidth;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptCookies = document.getElementById("acceptCookies");
  const openPolicy = document.getElementById("openPolicy");
  const cookieModal = document.getElementById("cookie-modal");
  const closeModal = document.getElementById("closeModal");
  const modalBody = document.querySelector(".cookie-modal-body");

  setTimeout(() => {
    cookieBanner.classList.add("show");
  }, 1000);

  acceptCookies.addEventListener("click", function () {
    fadeOut(cookieBanner);
  });

  openPolicy.addEventListener("click", async function (event) {
    event.preventDefault();
    await fetchPrivacyPolicy();
    showModal(cookieModal);
  });

  closeModal.addEventListener("click", function () {
    hideModal(cookieModal);
    fadeOut(cookieBanner);
  });

  window.addEventListener("click", function (event) {
    if (event.target === cookieModal) {
      hideModal(cookieModal);
    }
  });

  function showModal(modal) {
    modal.classList.add("show");
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
  }

  function hideModal(modal) {
    fadeOut(modal);
  }

  async function fetchPrivacyPolicy() {
    try {
      const response = await fetch("cookiesPolicy.json");
      if (!response.ok) throw new Error("Failed to load privacy policy");

      const data = await response.json();
      modalBody.innerHTML = formatPolicy(data);
    } catch (error) {
      modalBody.innerHTML = `<p style="color: red;">Error loading privacy policy.</p>`;
      console.error("Error fetching privacy policy:", error);
    }
  }

  function formatPolicy(data) {
    let html = `<h3>Last Updated:</h3><p>${data.last_updated}</p>`;
    html += `<p>${data.welcome_message}</p>`;
    html += `<h3>Information We Collect:</h3><ul>`;

    for (const [key, value] of Object.entries(data.information_we_collect)) {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    html += `</ul>`;

    html += `<h3>How We Use Your Information:</h3><ul>`;
    data.how_we_use_your_information.forEach((item) => {
      html += `<li>${item}</li>`;
    });
    html += `</ul>`;

    html += `<h3>Data Security:</h3><ul>`;
    for (const [key, value] of Object.entries(data.data_security)) {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    html += `</ul>`;

    html += `<h3>Cookies:</h3><ul>`;
    for (const [key, value] of Object.entries(data.cookies)) {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    html += `</ul>`;

    html += `<h3>Your Rights:</h3><ul>`;
    for (const [key, value] of Object.entries(data.your_rights)) {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    html += `</ul>`;

    html += `<h3>Contact Us:</h3><ul>`;
    for (const [key, value] of Object.entries(data.contact_us)) {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    html += `</ul>`;

    return html;
  }

  function fadeOut(element, callback) {
    element.style.opacity = "0";
    setTimeout(() => {
      element.style.visibility = "hidden";
      element.classList.remove("show");
      if (callback) callback();
    }, 500);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 50,
          behavior: "smooth",
        });
      }
    });
  });
});
