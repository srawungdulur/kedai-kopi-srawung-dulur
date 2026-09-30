// toggle class active hamburger menu
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");

if (navbarNav) {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navbarNav.querySelectorAll("a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

if (hamburger && navbarNav) {
  hamburger.onclick = () => {
    navbarNav.classList.toggle("active");
  };

  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove("active");
    }
  });
}

// toggle class active search form
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
const searchButton = document.querySelector("#search-button");

if (searchButton && searchForm && searchBox) {
  searchButton.onclick = (e) => {
    searchForm.classList.toggle("active");
    searchBox.focus();
    e.preventDefault();
  };
}

// pilih menu untuk mengisi pesan
const menuCards = document.querySelectorAll(".menu-card");
const catatanInput = document.getElementById("catatan");

if (menuCards.length > 0 && catatanInput) {
  const addMenuToOrder = (card) => {
    const menuTitle = card.querySelector(".menu-card-title")?.textContent.trim();

    if (!menuTitle) return;

    catatanInput.value = catatanInput.value.trim()
      ? `${catatanInput.value.trim()}\n${menuTitle}`
      : menuTitle;
    catatanInput.focus();
  };

  menuCards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", () => addMenuToOrder(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        addMenuToOrder(card);
      }
    });
  });
}

// kirim order form ke WhatsApp
const orderForm = document.getElementById("orderForm");

if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const toBulletList = (value) => {
      const lines = (value || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length === 0) return "-";
      return lines.map((line) => `• ${line}`).join("\n");
    };

    const nama = document.getElementById("nama")?.value.trim() || "-";
    const meja = document.getElementById("meja")?.value.trim() || "-";
    const catatan = document.getElementById("catatan")?.value.trim() || "-";
    const catatanList = toBulletList(catatan);
    const nomor = "6285336021102";

    const pesan =
      "Halo Srawung Dulur,\n\n" +
      `Nama: ${nama}\n` +
      `Meja: ${meja}\n` +
      `Pesanan:\n${catatanList}`;

    window.open(`https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`, "_blank");
  });
}

// Simpan ulasan beserta media di browser ini.
const reviewForm = document.getElementById("reviewForm");

if (reviewForm && "indexedDB" in window) {
  const reviewList = document.getElementById("review-items");
  const reviewCount = document.getElementById("review-count");
  const reviewStatus = document.getElementById("review-status");
  const mediaInput = document.getElementById("review-media-input");
  const mediaPreview = document.getElementById("review-preview");
  const maxMediaFiles = 4;
  const maxMediaSize = 15 * 1024 * 1024;
  let previewUrls = [];
  let savedMediaUrls = [];

  const openReviewDatabase = () => new Promise((resolve, reject) => {
    const request = indexedDB.open("srawung-dulur-reviews", 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore("reviews", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const withReviewStore = async (mode, action) => {
    const database = await openReviewDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction("reviews", mode);
      const request = action(transaction.objectStore("reviews"));

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => database.close();
      transaction.onerror = () => reject(transaction.error);
    });
  };

  const setReviewStatus = (message) => {
    reviewStatus.textContent = message;
  };

  const clearUrls = (urls) => {
    urls.forEach((url) => URL.revokeObjectURL(url));
    urls.length = 0;
  };

  const renderMediaPreview = () => {
    clearUrls(previewUrls);
    mediaPreview.replaceChildren();

    Array.from(mediaInput.files || []).forEach((file) => {
      const url = URL.createObjectURL(file);
      const media = document.createElement(file.type.startsWith("video/") ? "video" : "img");
      previewUrls.push(url);
      media.src = url;
      media.alt = file.name;

      if (media.tagName === "VIDEO") {
        media.controls = true;
        media.muted = true;
      }

      mediaPreview.append(media);
    });
  };

  const renderReviews = async () => {
    const reviews = await withReviewStore("readonly", (store) => store.getAll());
    clearUrls(savedMediaUrls);
    reviewList.replaceChildren();
    reviewCount.textContent = `${reviews.length} ulasan`;

    if (reviews.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "review-empty";
      emptyMessage.textContent = "Belum ada ulasan. Jadilah yang pertama berbagi cerita.";
      reviewList.append(emptyMessage);
      return;
    }

    reviews.sort((first, second) => second.createdAt - first.createdAt);
    reviews.forEach((review) => {
      const item = document.createElement("article");
      const header = document.createElement("div");
      const name = document.createElement("h3");
      const date = document.createElement("time");
      const stars = document.createElement("div");
      const comment = document.createElement("p");
      const mediaContainer = document.createElement("div");
      const deleteButton = document.createElement("button");

      item.className = "review-item";
      header.className = "review-item-header";
      name.textContent = review.name;
      date.dateTime = new Date(review.createdAt).toISOString();
      date.textContent = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(review.createdAt);
      stars.className = "review-stars";
      stars.setAttribute("aria-label", `Rating ${review.rating} dari 5`);
      stars.textContent = `${review.rating} dari 5`;
      comment.textContent = review.comment;
      mediaContainer.className = "review-media";

      review.media.forEach((file) => {
        const url = URL.createObjectURL(file.blob);
        const media = document.createElement(file.type.startsWith("video/") ? "video" : "img");
        savedMediaUrls.push(url);
        media.src = url;
        media.alt = file.name;

        if (media.tagName === "VIDEO") {
          media.controls = true;
          media.preload = "metadata";
        }

        mediaContainer.append(media);
      });

      deleteButton.className = "review-delete";
      deleteButton.type = "button";
      deleteButton.textContent = "Hapus ulasan ini";
      deleteButton.addEventListener("click", async () => {
        await withReviewStore("readwrite", (store) => store.delete(review.id));
        await renderReviews();
        setReviewStatus("Ulasan berhasil dihapus dari browser ini.");
      });

      header.append(name, date);
      item.append(header, stars, comment);
      if (review.media.length > 0) item.append(mediaContainer);
      item.append(deleteButton);
      reviewList.append(item);
    });
  };

  mediaInput.addEventListener("change", () => {
    const files = Array.from(mediaInput.files || []);
    const hasInvalidType = files.some((file) => !/^(image|video)\//.test(file.type));
    const hasOversizedFile = files.some((file) => file.size > maxMediaSize);

    if (files.length > maxMediaFiles || hasInvalidType || hasOversizedFile) {
      mediaInput.value = "";
      renderMediaPreview();
      setReviewStatus("Pilih maksimal 4 foto/video. Ukuran tiap file maksimal 15 MB.");
      return;
    }

    renderMediaPreview();
    setReviewStatus("");
  });

  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const files = Array.from(mediaInput.files || []);

    if (files.length > maxMediaFiles || files.some((file) => file.size > maxMediaSize)) {
      setReviewStatus("Periksa kembali jumlah dan ukuran foto/video yang dipilih.");
      return;
    }

    const review = {
      id: crypto.randomUUID(),
      name: document.getElementById("review-name").value.trim(),
      rating: Number(reviewForm.elements.rating.value),
      comment: document.getElementById("review-comment").value.trim(),
      createdAt: Date.now(),
      media: files.map((file) => ({ name: file.name, type: file.type, blob: file })),
    };

    try {
      await withReviewStore("readwrite", (store) => store.add(review));
      reviewForm.reset();
      renderMediaPreview();
      await renderReviews();
      setReviewStatus("Terima kasih! Ulasan tersimpan di browser ini.");
    } catch (error) {
      setReviewStatus("Ulasan belum tersimpan. Periksa ruang penyimpanan browser lalu coba lagi.");
    }
  });

  renderReviews().catch(() => {
    setReviewStatus("Penyimpanan ulasan tidak tersedia di browser ini.");
  });
} else if (reviewForm) {
  document.getElementById("review-status").textContent = "Browser ini belum mendukung penyimpanan ulasan.";
}
