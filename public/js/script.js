// C:\xampp\htdocs\persiapan\script.js

document.addEventListener("DOMContentLoaded", () => {
  // --- Navbar Toggle Logic (Untuk Mobile Responsif) ---
  const menuToggle = document.querySelector(".menu-toggle");
  const navigasiList = document.querySelector(".navigasi-list");

  if (menuToggle && navigasiList) {
    menuToggle.addEventListener("click", () => {
      navigasiList.classList.toggle("active");
      // Mengubah ikon hamburger menjadi X dan sebaliknya
      const icon = menuToggle.querySelector("i");
      if (navigasiList.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });

    // Tutup menu saat link navigasi diklik di mobile
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
  // Membiarkan browser handle smooth scroll via CSS 'scroll-behavior: smooth;'
  document.querySelectorAll(".navigasi-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Hapus kelas 'active' dari semua link dan tambahkan ke link yang diklik
        document.querySelectorAll(".navigasi-link").forEach((link) => {
          link.classList.remove("active");
        });
        this.classList.add("active");

        // Untuk navigasi ke elemen, kita bisa gunakan scrollIntoView dengan offset
        // Karena kita menggunakan scroll-behavior: smooth di CSS, kita hanya perlu sedikit tweak
        // Untuk mengatasi navbar fixed
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

        e.preventDefault(); // Cegah default jump agar offset bekerja
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

    const scrollOffset = navbarHeight + 10; // Offset yang lebih kecil untuk responsif

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.offsetTop - scrollOffset;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentActiveSectionId = section.getAttribute("id");
        break;
      }
    }

    // Jika di bagian paling atas halaman atau di beranda
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
      mainImage.style.opacity = ""; // Reset opacity to allow CSS to control it
    }

    function updateSelectedThumbnail() {
      const currentMainImageSrc = mainImage.src;
      const currentMainImageFileName = currentMainImageSrc
        .split("/")
        .pop()
        .split("?")[0]; // Menghilangkan query string jika ada

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

    // Panggil saat load untuk memastikan thumbnail yang benar terpilih jika mainImage sudah ada src
    // dan ada gambar yang cocok di galeri.
    mainImage.addEventListener("load", updateSelectedThumbnail); // Pastikan setelah gambar utama dimuat
    // Untuk kasus dimana gambar utama sudah ada di HTML dan langsung terload:
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

        // Jika gambar yang diklik sama dengan gambar utama saat ini, tidak lakukan apa-apa
        if (currentMainImageFileName === newSrcFileName) {
          return;
        }

        cleanMainImageClasses();
        mainImage.classList.add("fade-out");

        mainImage.addEventListener(
          "animationend",
          function fadeOutHandler() {
            this.removeEventListener("animationend", fadeOutHandler);
            cleanMainImageClasses(); // Hapus fade-out class

            this.src = newSrc;
            this.alt = newAlt;

            this.classList.add("fade-in"); // Tambahkan fade-in class

            this.addEventListener(
              "animationend",
              function fadeInHandler() {
                this.removeEventListener("animationend", fadeInHandler);
                cleanMainImageClasses(); // Hapus fade-in class
                updateSelectedThumbnail(); // Perbarui thumbnail yang terpilih
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
      // Clear previous buttons
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

            // Membuat input file secara dinamis
            const tempInputFile = document.createElement("input");
            tempInputFile.type = "file";
            tempInputFile.accept = "image/*";
            tempInputFile.style.display = "none"; // Sembunyikan input file
            document.body.appendChild(tempInputFile); // Tambahkan ke DOM sementara

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
                      selectedGalleryItemForChange.dataset.src = newImageSrc; // Update dataset.src

                      // Jika gambar yang diganti adalah gambar utama, update juga gambar utama
                      if (mainImage) {
                        const currentMainImageFileName = mainImage.src
                          .split("/")
                          .pop()
                          .split("?")[0];
                        const newGalleryImageFileName = newImageSrc
                          .split("/")
                          .pop()
                          .split("?")[0];

                        // Periksa apakah gambar yang diganti sama dengan gambar utama
                        // Ini logikanya perlu sedikit disesuaikan jika ingin benar-benar berdasarkan src file
                        // Untuk saat ini, kita anggap kalau yang sedang dipilih di galeri adalah yang aktif di main image
                        // atau jika src baru sama dengan src main image (walau nama file mungkin beda)
                        if (
                          selectedGalleryItemForChange.classList.contains(
                            "is-selected"
                          )
                        ) {
                          mainImage.src = newImageSrc;
                          mainImage.alt = targetImgElement.alt;
                          // Trigger re-selection of thumbnail to update visual state
                          // Debounce this if it causes performance issues
                          // setTimeout(updateSelectedThumbnail, 100);
                        }
                      }
                      updateSelectedThumbnail(); // Perbarui status terpilih untuk thumbnail
                    }
                  };
                  reader.readAsDataURL(this.files[0]);
                }
                // Hapus event listener dan elemen input setelah selesai
                tempInputFile.removeEventListener("change", handleFileChange);
                if (document.body.contains(tempInputFile)) {
                  document.body.removeChild(tempInputFile);
                }
              }
            );

            tempInputFile.click(); // Otomatis buka dialog pilih file
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
    let isScrollingDown = true; // True jika akan scroll ke bawah, false jika ke atas

    function updateScrollButton() {
      const scrollThreshold = 300; // Jarak scroll untuk menampilkan tombol
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const currentScrollPos = window.scrollY;

      // Tampilkan/sembunyikan tombol
      if (currentScrollPos > scrollThreshold) {
        scrollButton.classList.add("show");
      } else {
        scrollButton.classList.remove("show");
      }

      // Ubah ikon berdasarkan posisi scroll
      // Jika sudah dekat bagian bawah halaman (misal, 100px dari bawah)
      if (scrollHeight - (currentScrollPos + clientHeight) < 100) {
        scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>'; // Panah ke atas
        isScrollingDown = false;
      } else {
        scrollButton.innerHTML = '<i class="fas fa-chevron-down"></i>'; // Panah ke bawah
        isScrollingDown = true;
      }
    }

    // Panggil saat scroll dan saat load/resize
    window.addEventListener("scroll", updateScrollButton);
    window.addEventListener("load", updateScrollButton);
    window.addEventListener("resize", updateScrollButton); // Untuk memastikan tombol muncul/sembunyi saat resize

    scrollButton.addEventListener("click", () => {
      if (isScrollingDown) {
        window.scrollTo({
          top: document.body.scrollHeight, // Scroll ke paling bawah
          behavior: "smooth",
        });
      } else {
        window.scrollTo({
          top: 0, // Scroll ke paling atas
          behavior: "smooth",
        });
      }
    });

    // Initial check on load
    updateScrollButton();
  }

  // --- Intersection Observer for General Animations (Scroll-in/Scroll-out, Reversible) ---
  const elementsToAnimate = document.querySelectorAll(
    "[data-animation-class], .gambar-item, .footer-main, .main-datdir"
  ); // Tambahkan footer dan datdir

  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% dari elemen harus terlihat
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      const element = entry.target;
      const animationClass = element.dataset.animationClass;

      // Handle specific animations like footerFadeIn and datdirFadeIn if they are to be observed once
      if (
        (element.classList.contains("footer-main") ||
          element.classList.contains("main-datdir")) &&
        entry.isIntersecting
      ) {
        // These elements have their own CSS animations that run once on load
        // We only want to ensure they become visible for the animation to play
        // So, we add 'is-visible' or similar and then unobserve
        element.classList.add("is-visible"); // Or remove opacity/transform if CSS handles it
        observer.unobserve(element); // Stop observing once animated
        return; // Skip general animation class logic for these
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
      }, 1500); // Sembunyikan setelah 1.5 detik tidak ada scroll
    }

    function updateCustomThumbPosition() {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Jika konten tidak bisa discroll, sembunyikan scrollbar
      if (scrollHeight <= clientHeight + 5) {
        // Tambahkan sedikit margin toleransi
        customScrollbar.classList.remove("show-scrollbar");
        return;
      }

      const scrollTop = window.scrollY;
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

      const scrollbarTrackHeight = customScrollbar.clientHeight;
      const minThumbHeightPx = 40; // Tinggi minimum thumb
      const maxThumbHeightPx = scrollbarTrackHeight * 0.8; // Tinggi maksimum thumb (misal 80% dari track)

      // Hitung tinggi thumb proporsional
      let thumbHeight = (clientHeight / scrollHeight) * scrollbarTrackHeight;
      thumbHeight = Math.max(
        minThumbHeightPx,
        Math.min(maxThumbHeightPx, thumbHeight)
      ); // Pastikan antara min dan max

      customThumb.style.height = `${thumbHeight}px`;

      const thumbRange = scrollbarTrackHeight - thumbHeight;
      const thumbPosition = scrollPercentage * thumbRange;

      customThumb.style.top = `${thumbPosition}px`;

      // Jika sedang dragging, jangan sembunyikan scrollbar
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
      e.preventDefault(); // Mencegah drag default browser
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollTrackHeight =
        customScrollbar.offsetHeight - customThumb.offsetHeight;

      if (scrollTrackHeight <= 0) return; // Mencegah pembagian oleh nol

      const scrollRatio = (docHeight - winHeight) / scrollTrackHeight;
      window.scrollTo(0, startScrollTop + deltaY * scrollRatio);
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        customThumb.classList.remove("active");
        showCustomScrollbar(); // Tampilkan sebentar setelah lepas drag
      }
    });

    window.addEventListener("scroll", function () {
      updateCustomThumbPosition();
    });

    // Panggil saat inisialisasi dan resize
    updateCustomThumbPosition();
    // Sembunyikan secara default, akan muncul saat scroll
    customScrollbar.classList.remove("show-scrollbar");

    window.addEventListener("resize", function () {
      updateCustomThumbPosition();
      // Tampilkan scrollbar jika halaman bisa discroll setelah resize
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
  // === PERBAIKAN DI SINI ===
  const commentOverallStatusMessage = document.getElementById(
    "commentOverallStatusMessage"
  );
  // ========================

  const API_URL = "http://localhost:3000/api/comments";

  async function loadComments() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        // Tangani respons non-OK dari server
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.message || response.statusText
          }`
        );
      }
      const comments = await response.json();

      commentsDisplay.innerHTML = ""; // Bersihkan tampilan komentar

      if (comments.length > 0) {
        if (noCommentsYet) {
          noCommentsYet.style.display = "none";
        }
        comments.forEach((comment) => displayComment(comment));
      } else {
        if (noCommentsYet) {
          noCommentsYet.style.display = "block";
          // Pastikan noCommentsYet ada di dalam commentsDisplay jika belum
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
        // === PERBAIKAN DI SINI ===
      } else if (commentOverallStatusMessage) {
        commentOverallStatusMessage.textContent = `Gagal memuat komentar: ${error.message}.`;
        commentOverallStatusMessage.classList.remove("success");
        commentOverallStatusMessage.classList.add("error");
        commentOverallStatusMessage.style.display = "block";
        setTimeout(() => {
          commentOverallStatusMessage.style.display = "none";
        }, 5000);
      }
      // ========================
    }
  }

  async function submitCommentToServer(commentData) {
    // === PERBAIKAN DI SINI ===
    if (commentOverallStatusMessage) {
      commentOverallStatusMessage.textContent = "Mengirim komentar...";
      commentOverallStatusMessage.classList.remove("error", "success");
      commentOverallStatusMessage.style.color = "orange"; // Warna sementara untuk "loading"
      commentOverallStatusMessage.style.display = "block";
    }
    // ========================

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
        // Jika status kode bukan 2xx (misal 400, 429, 500)
        throw new Error(result.message || "Gagal mengirim komentar.");
      }

      console.log("Comment submitted successfully:", result.comment);
      // === PERBAIKAN DI SINI ===
      if (commentOverallStatusMessage) {
        commentOverallStatusMessage.textContent =
          result.message || "Komentar berhasil terkirim!";
        commentOverallStatusMessage.classList.remove("error");
        commentOverallStatusMessage.classList.add("success");
        commentOverallStatusMessage.style.color = "green"; // Warna untuk sukses
      }
      // ========================
      await loadComments(); // Muat ulang komentar setelah berhasil
      commenterName.value = "";
      commentText.value = "";
    } catch (error) {
      console.error("Error submitting comment:", error);
      // === PERBAIKAN DI SINI ===
      if (commentOverallStatusMessage) {
        commentOverallStatusMessage.textContent = `Error: ${error.message}`;
        commentOverallStatusMessage.classList.remove("success");
        commentOverallStatusMessage.classList.add("error");
        commentOverallStatusMessage.style.color = "red"; // Warna untuk error
      } else {
        alert(`Gagal mengirim komentar: ${error.message}`);
      }
      // ========================
    } finally {
      // === PERBAIKAN DI SINI ===
      if (commentOverallStatusMessage) {
        setTimeout(() => {
          commentOverallStatusMessage.style.display = "none";
        }, 5000); // Sembunyikan setelah 5 detik
      }
      // ========================
    }
  }

  function displayComment(comment) {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("user-comment");
    commentDiv.classList.add("fade-in"); // Tambahkan kelas fade-in untuk animasi

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
      commentsDisplay.prepend(commentDiv); // Tambahkan ke paling atas
    }
  }

  // Fungsi utilitas untuk menghindari XSS
  function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // === PERBAIKAN DI SINI ===
  if (
    submitCommentBtn &&
    commenterName &&
    commentText &&
    commentsDisplay &&
    commentOverallStatusMessage // Pastikan ini juga ada
  ) {
    loadComments(); // Muat komentar saat DOM selesai dimuat

    submitCommentBtn.addEventListener("click", () => {
      const name = commenterName.value.trim();
      const text = commentText.value.trim();

      if (name && text) {
        submitCommentToServer({
          name,
          text,
        });
      } else {
        if (commentOverallStatusMessage) {
          // Menggunakan yang baru
          commentOverallStatusMessage.textContent =
            "Nama dan Komentar tidak boleh kosong!";
          commentOverallStatusMessage.classList.remove("success");
          commentOverallStatusMessage.classList.add("error");
          commentOverallStatusMessage.style.color = "red";
          commentOverallStatusMessage.style.display = "block";
          setTimeout(() => {
            commentOverallStatusMessage.style.display = "none";
          }, 3000);
        } else {
          alert("Nama dan Komentar tidak boleh kosong!");
        }
      }
    });
  }
  // ========================

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
  const contactStatusMessage = document.getElementById("contactStatusMessage"); // Ini tetap merujuk ke ID yang sama di HTML

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

      // Validasi sederhana di frontend
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

      // Tampilkan pesan "Mengirim..."
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
          body: JSON.stringify({ name, email, message }),
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
