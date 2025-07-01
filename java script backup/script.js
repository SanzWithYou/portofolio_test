// C:\xampp\htdocs\persiapan\script.js

document.addEventListener("DOMContentLoaded", () => {
  // --- Fungsi untuk menyensor kata-kata kasar yang lebih ketat (DIPINDAHKAN KE SINI) ---
  function censorText(text) {
    const profaneWords = [
      "anjing",
      "bangsat",
      "babi",
      "kontol",
      "memek",
      "tolol",
      "goblok",
      "bajingan",
      "asu",
      "jembut",
      "titit",
      "peler",
      "ngentot",
      "tai",
      "silit",
      "cok",
      "tempik",
      "kimak",
      "brengsek",
      "dancok",
      "fuck",
      "shit",
      "asshole",
      "bitch",
      "damn",
      "fucker",
      "motherfucker",
      // Tambahkan variasi umum dan typo yang mungkin
      "anjeng",
      "ancuk",
      "bgsd",
      "jembut",
      "kntol",
      "mmk",
      "ttit",
      "pler",
      "entot",
      "taik",
      "silit",
      "cok",
      "tempek",
      "kimak",
      "brengsek",
      "dancok",
      "fu*k",
      "sh*t",
      "assh*le",
      "b*tch",
      "d*mn",
      "f*cker",
      "m*therf*cker",
      "ngntl",
      "mmk",
      "bgst",
      "anj",
      "asw", // Singkatan umum
    ];

    let censoredText = text;
    let containsProfanity = false; // Flag untuk menandai apakah ada kata kasar

    profaneWords.forEach((word) => {
      // Regex yang lebih canggih untuk menangani spasi, tanda baca, dan kapitalisasi
      // \b untuk word boundary
      // [\s.,!?;]* untuk mengabaikan tanda baca/spasi di sekitar kata
      // (a|4) untuk a atau 4, (i|1) untuk i atau 1, dll. (leetspeak)
      const pattern = word
        .split("")
        .map((char) => {
          if (char === "a") return "[aA4@]";
          if (char === "i") return "[iI1!]";
          if (char === "e") return "[eE3]";
          if (char === "o") return "[oO0]";
          if (char === "s") return "[sS5$]";
          return char;
        })
        .join("");

      // Menyesuaikan regex untuk menangani kata-kata yang mungkin digabung dengan tanda baca atau spasi di kedua sisi
      const regex = new RegExp(
        `\\b(${pattern})\\b|[\\s.,!?;]*(${pattern})[\\s.,!?;]*`,
        "gi"
      );

      if (regex.test(censoredText)) {
        containsProfanity = true;
      }
      // Ganti dengan bintang sebanyak panjang kata yang cocok
      censoredText = censoredText.replace(regex, (match) =>
        "*".repeat(match.length)
      );
    });

    return { censoredText, containsProfanity }; // Mengembalikan objek dengan teks dan flag
  }
  // --- Akhir dari Fungsi censorText ---

  // --- Navbar Toggle Logic (Untuk Mobile Responsif) ---
  const menuToggle = document.querySelector(".menu-toggle");
  const navigasiList = document.querySelector(".navigasi-list");

  if (menuToggle && navigasiList) {
    menuToggle.addEventListener("click", () => {
      navigasiList.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      if (navigasiList.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });

    navigasiList.querySelectorAll(".navigasi-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (navigasiList.classList.contains("active")) {
          navigasiList.classList.remove("active");
          menuToggle.querySelector("i").classList.remove("fa-times");
          menuToggle.querySelector("i").classList.add("fa-bars");
        }
      });
    });
  }

  // --- Smooth Scrolling for Navigation Links ---
  document.querySelectorAll(".navigasi-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        document.querySelectorAll(".navigasi-link").forEach((link) => {
          link.classList.remove("active");
        });
        this.classList.add("active");

        const mainNav = document.querySelector(".main-navigasi");
        const navbarHeight = mainNav ? mainNav.offsetHeight : 0;
        const offsetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        e.preventDefault();
      }
    });
  });

  // --- ScrollSpy Logic ---
  const sections = document.querySelectorAll(
    "section[id='beranda'], section[id='tentang-saya'], section[id='layanan-saya'], section[id='kontak-saran']"
  );
  const navLinks = document.querySelectorAll(".navigasi-link");

  function activateNavLink() {
    let currentActiveSectionId = null;
    const scrollY = window.scrollY;
    const mainNav = document.querySelector(".main-navigasi");
    const navbarHeight = mainNav ? mainNav.offsetHeight : 0;

    const scrollOffset = navbarHeight + 10;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.offsetTop - scrollOffset;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentActiveSectionId = section.getAttribute("id");
        break;
      }
    }

    if (
      !currentActiveSectionId &&
      scrollY < sections[0].offsetTop + sections[0].offsetHeight / 2
    ) {
      currentActiveSectionId = "beranda";
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    if (currentActiveSectionId) {
      const correspondingLink = document.querySelector(
        `.navigasi-link[href="#${currentActiveSectionId}"]`
      );
      if (correspondingLink) {
        correspondingLink.classList.add("active");
      }
    }
  }

  window.addEventListener("scroll", activateNavLink);
  window.addEventListener("load", activateNavLink);
  window.addEventListener("resize", activateNavLink);

  // --- Image Replacement Logic for .gambar-utama and gallery ---
  const mainImage = document.getElementById("gambarUtamaTampil");
  const galleryItems = document.querySelectorAll(".gambar-item");

  if (mainImage && galleryItems.length > 0) {
    function cleanMainImageClasses() {
      mainImage.classList.remove("fade-out", "fade-in");
      mainImage.style.opacity = "";
    }

    function updateSelectedThumbnail() {
      const currentMainImageSrc = mainImage.src;
      const currentMainImageFileName = currentMainImageSrc
        .split("/")
        .pop()
        .split("?")[0];

      galleryItems.forEach((item) => {
        const imgInItem = item.querySelector("img");
        const itemSrc = item.dataset.src || (imgInItem ? imgInItem.src : "");
        const itemFileName = itemSrc.split("/").pop().split("?")[0];

        item.classList.remove("is-selected");
        if (imgInItem) {
          imgInItem.style.filter = "grayscale(100%)";
        }

        if (itemFileName && currentMainImageFileName === itemFileName) {
          item.classList.add("is-selected");
          if (imgInItem) imgInItem.style.filter = "grayscale(0%)";
        }
      });
    }

    mainImage.addEventListener("load", updateSelectedThumbnail);
    if (mainImage.complete) {
      updateSelectedThumbnail();
    }

    galleryItems.forEach((item) => {
      item.addEventListener("click", function () {
        if (!mainImage) return;

        const newSrc = this.dataset.src || this.querySelector("img").src;
        const newAlt = this.querySelector("img")
          ? this.querySelector("img").alt
          : "";

        const currentMainImageFileName = mainImage.src
          .split("/")
          .pop()
          .split("?")[0];
        const newSrcFileName = newSrc.split("/").pop().split("?")[0];

        if (currentMainImageFileName === newSrcFileName) {
          return;
        }

        cleanMainImageClasses();
        mainImage.classList.add("fade-out");

        mainImage.addEventListener(
          "animationend",
          function fadeOutHandler() {
            this.removeEventListener("animationend", fadeOutHandler);
            cleanMainImageClasses();

            this.src = newSrc;
            this.alt = newAlt;

            this.classList.add("fade-in");

            this.addEventListener(
              "animationend",
              function fadeInHandler() {
                this.removeEventListener("animationend", fadeInHandler);
                cleanMainImageClasses();
                updateSelectedThumbnail();
              },
              {
                once: true,
              }
            );
          },
          {
            once: true,
          }
        );
      });
    });
  }

  // --- Modal Logic (GANTI GAMBAR GALERI) ---
  const tombolGantiGambar = document.getElementById("tombolGantiGambar");
  const gantiGambarModal = document.getElementById("gantiGambarModal");
  const modalChoiceButtons = document.getElementById("modalChoiceButtons");
  const cancelGantiGambar = document.getElementById("cancelGantiGambar");

  let selectedGalleryItemForChange = null;

  if (
    tombolGantiGambar &&
    gantiGambarModal &&
    modalChoiceButtons &&
    cancelGantiGambar
  ) {
    tombolGantiGambar.addEventListener("click", () => {
      modalChoiceButtons.innerHTML = "";

      if (galleryItems.length === 0) {
        const noItemsMessage = document.createElement("p");
        noItemsMessage.textContent =
          "Tidak ada gambar di galeri untuk diganti.";
        modalChoiceButtons.appendChild(noItemsMessage);
      } else {
        galleryItems.forEach((item, index) => {
          const button = document.createElement("button");
          button.classList.add("modal-choice-button");
          button.textContent = `Galeri ${index + 1}`;
          button.dataset.index = index;
          button.addEventListener("click", () => {
            selectedGalleryItemForChange = item;
            gantiGambarModal.classList.remove("active");

            const tempInputFile = document.createElement("input");
            tempInputFile.type = "file";
            tempInputFile.accept = "image/*";
            tempInputFile.style.display = "none";
            document.body.appendChild(tempInputFile);

            tempInputFile.addEventListener(
              "change",
              function handleFileChange() {
                if (
                  this.files &&
                  this.files[0] &&
                  selectedGalleryItemForChange
                ) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const newImageSrc = e.target.result;
                    const targetImgElement =
                      selectedGalleryItemForChange.querySelector("img");

                    if (targetImgElement) {
                      targetImgElement.src = newImageSrc;
                      selectedGalleryItemForChange.dataset.src = newImageSrc;

                      if (mainImage) {
                        const currentMainImageFileName = mainImage.src
                          .split("/")
                          .pop()
                          .split("?")[0];
                        const newGalleryImageFileName = newImageSrc
                          .split("/")
                          .pop()
                          .split("?")[0];

                        if (
                          selectedGalleryItemForChange.classList.contains(
                            "is-selected"
                          )
                        ) {
                          mainImage.src = newImageSrc;
                          mainImage.alt = targetImgElement.alt;
                        }
                      }
                      updateSelectedThumbnail();
                    }
                  };
                  reader.readAsDataURL(this.files[0]);
                }
                tempInputFile.removeEventListener("change", handleFileChange);
                if (document.body.contains(tempInputFile)) {
                  document.body.removeChild(tempInputFile);
                }
              }
            );

            tempInputFile.click();
          });
          modalChoiceButtons.appendChild(button);
        });
      }
      gantiGambarModal.classList.add("active");
    });

    cancelGantiGambar.addEventListener("click", () => {
      gantiGambarModal.classList.remove("active");
      selectedGalleryItemForChange = null;
    });

    gantiGambarModal.addEventListener("click", (e) => {
      if (e.target === gantiGambarModal) {
        gantiGambarModal.classList.remove("active");
        selectedGalleryItemForChange = null;
      }
    });
  }

  // --- Scroll-to-Top/Bottom Button Logic ---
  const scrollButton = document.getElementById("scrollButton");

  if (scrollButton) {
    let isScrollingDown = true;

    function updateScrollButton() {
      const scrollThreshold = 300;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const currentScrollPos = window.scrollY;

      if (currentScrollPos > scrollThreshold) {
        scrollButton.classList.add("show");
      } else {
        scrollButton.classList.remove("show");
      }

      if (scrollHeight - (currentScrollPos + clientHeight) < 100) {
        scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        isScrollingDown = false;
      } else {
        scrollButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
        isScrollingDown = true;
      }
    }

    window.addEventListener("scroll", updateScrollButton);
    window.addEventListener("load", updateScrollButton);
    window.addEventListener("resize", updateScrollButton);

    scrollButton.addEventListener("click", () => {
      if (isScrollingDown) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });

    updateScrollButton();
  }

  // --- Intersection Observer for General Animations (Scroll-in/Scroll-out, Reversible) ---
  const elementsToAnimate = document.querySelectorAll(
    "[data-animation-class], .gambar-item, .footer-main, .main-datdir"
  );

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      const element = entry.target;
      const animationClass = element.dataset.animationClass;

      if (
        (element.classList.contains("footer-main") ||
          element.classList.contains("main-datdir")) &&
        entry.isIntersecting
      ) {
        element.classList.add("is-visible");
        observer.unobserve(element);
        return;
      }

      if (entry.isIntersecting) {
        if (animationClass) {
          element.classList.remove(`${animationClass}-hidden`);
          element.classList.add(`${animationClass}-visible`);
        } else if (element.classList.contains("gambar-item")) {
          element.classList.add("is-visible");
        }
      } else {
        if (animationClass) {
          element.classList.remove(`${animationClass}-visible`);
          element.classList.add(`${animationClass}-hidden`);
        } else if (element.classList.contains("gambar-item")) {
          element.classList.remove("is-visible");
        }
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach((element) => {
    const animationClass = element.dataset.animationClass;
    if (animationClass) {
      element.classList.add(`${animationClass}-hidden`);
    } else if (element.classList.contains("gambar-item")) {
      element.classList.remove("is-visible");
    }
    observer.observe(element);
  });

  // --- Custom Scrollbar Logic ---
  const customScrollbar = document.getElementById("customScrollbar");
  if (customScrollbar) {
    const customThumb = customScrollbar.querySelector(
      ".custom-scrollbar-thumb"
    );
    let scrollbarTimeout;

    function showCustomScrollbar() {
      if (!customScrollbar.classList.contains("show-scrollbar")) {
        customScrollbar.classList.add("show-scrollbar");
      }
      clearTimeout(scrollbarTimeout);
      scrollbarTimeout = setTimeout(() => {
        customScrollbar.classList.remove("show-scrollbar");
      }, 1500);
    }

    function updateCustomThumbPosition() {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight <= clientHeight + 5) {
        customScrollbar.classList.remove("show-scrollbar");
        return;
      }

      const scrollTop = window.scrollY;
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

      const scrollbarTrackHeight = customScrollbar.clientHeight;
      const minThumbHeightPx = 40;
      const maxThumbHeightPx = scrollbarTrackHeight * 0.8;

      let thumbHeight = (clientHeight / scrollHeight) * scrollbarTrackHeight;
      thumbHeight = Math.max(
        minThumbHeightPx,
        Math.min(maxThumbHeightPx, thumbHeight)
      );

      customThumb.style.height = `${thumbHeight}px`;

      const thumbRange = scrollbarTrackHeight - thumbHeight;
      const thumbPosition = scrollPercentage * thumbRange;

      customThumb.style.top = `${thumbPosition}px`;

      if (!isDragging) {
        showCustomScrollbar();
      }
    }

    let isDragging = false;
    let startY;
    let startScrollTop;

    customThumb.addEventListener("mousedown", (e) => {
      isDragging = true;
      startY = e.clientY;
      startScrollTop = window.scrollY;
      customThumb.classList.add("active");
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollTrackHeight =
        customScrollbar.offsetHeight - customThumb.offsetHeight;

      if (scrollTrackHeight <= 0) return;

      const scrollRatio = (docHeight - winHeight) / scrollTrackHeight;
      window.scrollTo(0, startScrollTop + deltaY * scrollRatio);
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        customThumb.classList.remove("active");
        showCustomScrollbar();
      }
    });

    window.addEventListener("scroll", function () {
      updateCustomThumbPosition();
    });

    updateCustomThumbPosition();
    customScrollbar.classList.remove("show-scrollbar");

    window.addEventListener("resize", function () {
      updateCustomThumbPosition();
      if (
        document.documentElement.scrollHeight >
        document.documentElement.clientHeight + 5
      ) {
        showCustomScrollbar();
      }
    });
  }

  // --- Comment Section Logic ---
  const submitCommentBtn = document.getElementById("submitCommentBtn");
  const commenterName = document.getElementById("commenterName");
  const commentText = document.getElementById("commentText");
  const commentsDisplay = document.getElementById("commentsDisplay");
  const noCommentsYet = document.querySelector(".no-comments-yet");
  const commentOverallStatusMessage = document.getElementById(
    "commentOverallStatusMessage"
  );

  const API_URL = "http://localhost:3000/api/comments";

  async function loadComments() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.message || response.statusText
          }`
        );
      }
      const comments = await response.json();

      commentsDisplay.innerHTML = "";

      if (comments.length > 0) {
        if (noCommentsYet) {
          noCommentsYet.style.display = "none";
        }
        // Pastikan komentar ditampilkan dalam urutan terbaru di atas
        // Server seharusnya sudah mengembalikan komentar terbaru di atas.
        // Jika tidak, Anda bisa mengurutkan di sini:
        // comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        comments.forEach((comment) => displayComment(comment, true)); // true untuk append, agar tampil sesuai urutan dari server
      } else {
        if (noCommentsYet) {
          noCommentsYet.style.display = "block";
          if (!commentsDisplay.contains(noCommentsYet)) {
            commentsDisplay.appendChild(noCommentsYet);
          }
        }
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      if (commentsDisplay && commentsDisplay.innerHTML === "") {
        commentsDisplay.innerHTML = `
          <p class="status-message error">
            Gagal memuat komentar: ${error.message}. Pastikan server berjalan.
          </p>`;
        if (noCommentsYet) noCommentsYet.style.display = "none";
      } else if (commentOverallStatusMessage) {
        commentOverallStatusMessage.textContent = `Gagal memuat komentar: ${error.message}.`;
        commentOverallStatusMessage.classList.remove("success");
        commentOverallStatusMessage.classList.add("error");
        commentOverallStatusMessage.style.color = "red";
        commentOverallStatusMessage.style.display = "block";
        setTimeout(() => {
          commentOverallStatusMessage.style.display = "none";
        }, 5000);
      }
    }
  }

  async function submitCommentToServer(commentData) {
    if (commentOverallStatusMessage) {
      commentOverallStatusMessage.textContent = "Mengirim komentar...";
      commentOverallStatusMessage.classList.remove("error", "success");
      commentOverallStatusMessage.style.color = "orange";
      commentOverallStatusMessage.style.display = "block";
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengirim komentar.");
      }

      console.log("Comment submitted successfully:", result.comment);
      if (commentOverallStatusMessage) {
        commentOverallStatusMessage.textContent =
          result.message || "Komentar berhasil terkirim!";
        commentOverallStatusMessage.classList.remove("error");
        commentOverallStatusMessage.classList.add("success");
        commentOverallStatusMessage.style.color = "green";
      }
      // Langsung tampilkan komentar baru di atas tanpa me-reload semua
      displayComment(result.comment, false); // false agar menggunakan prepend
      if (noCommentsYet) {
        noCommentsYet.style.display = "none";
      }
      commenterName.value = "";
      commentText.value = "";
    } catch (error) {
      console.error("Error submitting comment:", error);
      if (commentOverallStatusMessage) {
        commentOverallStatusMessage.textContent = `Error: ${error.message}`;
        commentOverallStatusMessage.classList.remove("success");
        commentOverallStatusMessage.classList.add("error");
        commentOverallStatusMessage.style.color = "red";
      } else {
        alert(`Gagal mengirim komentar: ${error.message}`);
      }
    } finally {
      if (commentOverallStatusMessage) {
        setTimeout(() => {
          commentOverallStatusMessage.style.display = "none";
        }, 5000);
      }
    }
  }

  // Parameter `append` ditambahkan. Jika true, akan appendChild (untuk load awal).
  // Jika false, akan prepend (untuk komentar baru).
  function displayComment(comment, append = false) {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("user-comment");
    commentDiv.classList.add("fade-in");

    let commentDate = "Tanggal tidak tersedia";
    if (comment.timestamp) {
      try {
        commentDate = new Date(comment.timestamp).toLocaleString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        console.warn("Invalid timestamp for comment:", comment.timestamp, e);
        commentDate = "Tanggal tidak valid";
      }
    }

    commentDiv.innerHTML = `
            <p><strong>${escapeHTML(comment.name)}</strong></p>
            <p>${escapeHTML(comment.comment_text)}</p>
            <small>${commentDate}</small>
        `;
    if (commentsDisplay) {
      if (append) {
        commentsDisplay.appendChild(commentDiv); // Untuk loading komentar lama (urutan asli dari server)
      } else {
        commentsDisplay.prepend(commentDiv); // Untuk komentar baru (muncul di atas)
      }
    }
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  if (
    submitCommentBtn &&
    commenterName &&
    commentText &&
    commentsDisplay &&
    commentOverallStatusMessage
  ) {
    loadComments();

    submitCommentBtn.addEventListener("click", () => {
      const name = commenterName.value.trim();
      const text = commentText.value.trim();

      if (!name || !text) {
        commentOverallStatusMessage.textContent =
          "Nama dan Komentar tidak boleh kosong!";
        commentOverallStatusMessage.classList.remove("success");
        commentOverallStatusMessage.classList.add("error");
        commentOverallStatusMessage.style.color = "red";
        commentOverallStatusMessage.style.display = "block";
        setTimeout(() => {
          commentOverallStatusMessage.style.display = "none";
        }, 3000);
        return; // Hentikan proses jika kosong
      }

      // Pastikan fungsi censorText sudah didefinisikan sebelum dipanggil
      const {
        censoredText: processedName,
        containsProfanity: nameHasProfanity,
      } = censorText(name);
      const {
        censoredText: processedText,
        containsProfanity: textHasProfanity,
      } = censorText(text);

      if (nameHasProfanity || textHasProfanity) {
        commentOverallStatusMessage.textContent =
          "Komentar mengandung kata-kata tidak pantas dan tidak dapat dikirim.";
        commentOverallStatusMessage.classList.remove("success");
        commentOverallStatusMessage.classList.add("error");
        commentOverallStatusMessage.style.color = "red";
        commentOverallStatusMessage.style.display = "block";
        setTimeout(() => {
          commentOverallStatusMessage.style.display = "none";
        }, 5000);
        return; // Hentikan pengiriman jika ada kata kasar
      }

      submitCommentToServer({
        name: processedName,
        text: processedText,
      });
    });
  }

  // --- Change Theme (Dark/Light Mode) Logic ---
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeToggleBtn) {
      if (theme === "dark") {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggleBtn.setAttribute("aria-label", "Switch to light mode");
      } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggleBtn.setAttribute("aria-label", "Switch to dark mode");
      }
    }
  }

  function initializeTheme() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDarkScheme.matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  if (themeToggleBtn) {
    initializeTheme();

    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });

    prefersDarkScheme.addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
  }

  // --- Contact Form Submission Logic ---
  const contactForm = document.getElementById("contactForm");
  const contactName = document.getElementById("contactName");
  const contactEmail = document.getElementById("contactEmail");
  const contactMessage = document.getElementById("contactMessage");
  const contactStatusMessage = document.getElementById("contactStatusMessage");

  const CONTACT_API_URL = "http://localhost:3000/api/contact";

  if (
    contactForm &&
    contactName &&
    contactEmail &&
    contactMessage &&
    contactStatusMessage
  ) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = contactName.value.trim();
      const email = contactEmail.value.trim();
      const message = contactMessage.value.trim();

      if (!name || !email || !message) {
        contactStatusMessage.textContent = "Semua bidang harus diisi!";
        contactStatusMessage.classList.remove("success");
        contactStatusMessage.classList.add("error");
        contactStatusMessage.style.display = "block";
        setTimeout(() => {
          contactStatusMessage.style.display = "none";
        }, 3000);
        return;
      }

      // Pastikan fungsi censorText sudah didefinisikan sebelum dipanggil
      const {
        censoredText: processedName,
        containsProfanity: nameHasProfanity,
      } = censorText(name);
      const {
        censoredText: processedMessage,
        containsProfanity: messageHasProfanity,
      } = censorText(message);

      if (nameHasProfanity || messageHasProfanity) {
        contactStatusMessage.textContent =
          "Pesan mengandung kata-kata tidak pantas dan tidak dapat dikirim.";
        contactStatusMessage.classList.remove("success");
        contactStatusMessage.classList.add("error");
        contactStatusMessage.style.color = "red";
        contactStatusMessage.style.display = "block";
        setTimeout(() => {
          contactStatusMessage.style.display = "none";
        }, 5000);
        return; // Hentikan pengiriman jika ada kata kasar
      }

      contactStatusMessage.textContent = "Mengirim pesan...";
      contactStatusMessage.classList.remove("error", "success");
      contactStatusMessage.style.color = "orange";
      contactStatusMessage.style.display = "block";

      try {
        const response = await fetch(CONTACT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: processedName,
            email,
            message: processedMessage,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          contactStatusMessage.textContent =
            result.message || "Pesan berhasil terkirim!";
          contactStatusMessage.classList.remove("error");
          contactStatusMessage.classList.add("success");
          contactStatusMessage.style.color = "green";
          contactForm.reset();
        } else {
          throw new Error(result.message || "Gagal mengirim pesan.");
        }
      } catch (error) {
        console.error("Error submitting contact form:", error);
        contactStatusMessage.textContent = `Error: ${error.message}`;
        contactStatusMessage.classList.remove("success");
        contactStatusMessage.classList.add("error");
        contactStatusMessage.style.color = "red";
      } finally {
        setTimeout(() => {
          contactStatusMessage.style.display = "none";
        }, 5000);
      }
    });
  }
});
