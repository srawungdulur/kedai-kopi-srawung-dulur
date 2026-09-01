// toggle class active hamburger menu
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");

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
