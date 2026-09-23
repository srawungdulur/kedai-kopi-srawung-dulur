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
