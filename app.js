// ============================================
// DONNÉES DE DÉPART — citations courtes et iconiques,
// avec attribution claire. D'autres arriveront via la
// modération communautaire (voir kotoba.js)
// ============================================
const seedQuotes = [
  { text: "Un cœur qui ne veut pas se briser ne peut jamais devenir fort.", character: "Kenshin Himura", series: "Rurouni Kenshin", category: "Force", lang: "Français" },
  { text: "Je vais devenir le roi des pirates.", character: "Monkey D. Luffy", series: "One Piece", category: "Motivation", lang: "Français" },
  { text: "Ce n'est pas la force qui fait un héros, mais son courage.", character: "Izuku Midoriya", series: "My Hero Academia", category: "Motivation", lang: "Français" },
  { text: "Les liens qu'on tisse sont notre plus grande force.", character: "Naruto Uzumaki", series: "Naruto", category: "Amitié", lang: "Français" },
  { text: "On ne peut pas obtenir quelque chose sans en sacrifier une autre.", character: "Edward Elric", series: "Fullmetal Alchemist", category: "Perte", lang: "Français" },
  { text: "Un jour comme un autre finira par revenir.", character: "Levi Ackerman", series: "L'Attaque des Titans", category: "Perte", lang: "Français" },
  { text: "Je ne veux pas te perdre, c'est pour ça que je deviendrai plus fort.", character: "Asta", series: "Black Clover", category: "Amour", lang: "Français" },
  { text: "I'm gonna be King of the Pirates.", character: "Monkey D. Luffy", series: "One Piece", category: "Motivation", lang: "English" },
  { text: "People's lives don't end when they die, it ends when they lose faith.", character: "Itachi Uchiha", series: "Naruto", category: "Force", lang: "English" },
  { text: "諦めたらそこで試合終了ですよ。", character: "Anzai", series: "Slam Dunk", category: "Motivation", lang: "日本語" },
  { text: "Tant que les gens continueront de chérir le souvenir des morts, ils ne seront jamais vraiment partis.", character: "Itachi Uchiha", series: "Naruto", category: "Perte", lang: "Français" },
  { text: "Un vrai ami est quelqu'un qui te tend la main même quand il a mal.", character: "Sakura Haruno", series: "Naruto", category: "Amitié", lang: "Français" },
  { text: "L'échec n'est pas une option, c'est une étape.", character: "All Might", series: "My Hero Academia", category: "Motivation", lang: "Français" },
  { text: "Even if I have to crawl, I'll get back up.", character: "Eren Yeager", series: "L'Attaque des Titans", category: "Force", lang: "English" },
  { text: "Un roi ne doit jamais montrer sa peur devant son peuple.", character: "Thorfinn", series: "Vinland Saga", category: "Force", lang: "Français" },
  { text: "L'amour, c'est accepter les cicatrices de l'autre comme les siennes.", character: "Violet Evergarden", series: "Violet Evergarden", category: "Amour", lang: "Français" },
  { text: "On ne choisit pas sa famille, mais on choisit ses compagnons de route.", character: "Gon Freecss", series: "Hunter x Hunter", category: "Amitié", lang: "Français" },
  { text: "Ce qui compte, ce n'est pas comment tu tombes, c'est comment tu te relèves.", character: "Saitama", series: "One Punch Man", category: "Force", lang: "Français" },
  { text: "The world is not beautiful, therefore it is.", character: "Lain", series: "Kino no Tabi", category: "Motivation", lang: "English" },
  { text: "君との出会いが、僕の人生を変えた。", character: "Tanjiro Kamado", series: "Demon Slayer", category: "Amour", lang: "日本語" },
];

let quotes = [...seedQuotes];
let activeCategory = "Toutes";
let activeLang = "Toutes";
let searchTerm = "";

function getFavorites() {
  try { return JSON.parse(localStorage.getItem("kotoba-favs") || "[]"); }
  catch { return []; }
}

function toggleFavorite(text) {
  let favs = getFavorites();
  if (favs.includes(text)) favs = favs.filter((f) => f !== text);
  else favs.push(text);
  localStorage.setItem("kotoba-favs", JSON.stringify(favs));
  renderQuotes();
  renderFavorites();
}

// ============================================
// RENDU D'UNE CARTE DE CITATION
// ============================================
function quoteCardHTML(q) {
  const favs = getFavorites();
  const isFav = favs.includes(q.text);
  return `
    <div class="quote-card">
      <div class="quote-card-top">
        <span class="lang-badge">${q.lang || "Français"}</span>
      </div>
      <p class="quote-card-text">「${q.text}」</p>
      <div class="quote-card-footer">
        <div class="quote-card-meta">
          <strong>${q.character}</strong>
          ${q.series}
        </div>
        <div class="quote-card-actions">
          <button class="icon-btn ${isFav ? "is-fav" : ""}" data-fav="${encodeURIComponent(q.text)}" aria-label="Favori">${isFav ? "♥" : "♡"}</button>
          <button class="icon-btn" data-card="${encodeURIComponent(JSON.stringify(q))}" aria-label="Créer une carte">⇩</button>
        </div>
      </div>
    </div>`;
}

function renderQuotes() {
  const grid = document.getElementById("quoteGrid");
  const filtered = quotes.filter((q) => {
    const matchCat = activeCategory === "Toutes" || q.category === activeCategory;
    const matchLang = activeLang === "Toutes" || (q.lang || "Français") === activeLang;
    const matchSearch =
      !searchTerm ||
      q.series.toLowerCase().includes(searchTerm) ||
      q.character.toLowerCase().includes(searchTerm) ||
      q.text.toLowerCase().includes(searchTerm);
    return matchCat && matchLang && matchSearch;
  });
  grid.innerHTML = filtered.length
    ? filtered.map(quoteCardHTML).join("")
    : `<p class="empty-hint">Aucune citation ne correspond.</p>`;
  attachCardEvents();
}

function renderFavorites() {
  const favs = getFavorites();
  const favGrid = document.getElementById("favGrid");
  const favQuotes = quotes.filter((q) => favs.includes(q.text));
  favGrid.innerHTML = favQuotes.map(quoteCardHTML).join("");
  document.getElementById("favEmpty").hidden = favQuotes.length > 0;
  attachCardEvents();
}

function attachCardEvents() {
  document.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", () => toggleFavorite(decodeURIComponent(btn.dataset.fav)));
  });
  document.querySelectorAll("[data-card]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = JSON.parse(decodeURIComponent(btn.dataset.card));
      openCardModal(q);
    });
  });
}

// ============================================
// CATÉGORIES
// ============================================
document.getElementById("categoryRow").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll("#categoryRow .chip").forEach((c) => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  activeCategory = chip.dataset.cat;
  renderQuotes();
});

document.getElementById("langRow").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll("#langRow .chip").forEach((c) => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  activeLang = chip.dataset.lang;
  renderQuotes();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderQuotes();
});

// ============================================
// NAVIGATION (Parcourir / Favoris)
// ============================================
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.goto;
    document.getElementById("parcourir").hidden = target !== "parcourir";
    document.getElementById("favoris").hidden = target !== "favoris";
    if (target === "favoris") renderFavorites();
    navLinks.classList.remove("is-open");
    window.scrollTo({ top: 0, behavior: "instant" });
  });
});

// ============================================
// MODALE : PROPOSER UNE CITATION
// ============================================
const submitModal = document.getElementById("submitModal");
document.getElementById("submitBtn").addEventListener("click", () => submitModal.classList.add("is-open"));
document.getElementById("submitModalClose").addEventListener("click", () => submitModal.classList.remove("is-open"));
submitModal.addEventListener("click", (e) => { if (e.target === submitModal) submitModal.classList.remove("is-open"); });

// ============================================
// APERÇU EN DIRECT — se met à jour pendant la saisie
// ============================================
const subText = document.getElementById("subText");
const subCharacter = document.getElementById("subCharacter");
const subSeries = document.getElementById("subSeries");
const previewText = document.getElementById("previewText");
const previewMeta = document.getElementById("previewMeta");
const charCount = document.getElementById("charCount");

function updatePreview() {
  previewText.textContent = subText.value.trim() || "Ta citation apparaîtra ici...";
  const character = subCharacter.value.trim();
  const series = subSeries.value.trim();
  previewMeta.textContent = character || series ? `${character || "?"} — ${series || "?"}` : "";
  charCount.textContent = `${subText.value.length} / 280`;
}

[subText, subCharacter, subSeries].forEach((el) => el.addEventListener("input", updatePreview));

// ============================================
// MODALE : CARTE DE CITATION (génération Canvas)
// ============================================
const cardModal = document.getElementById("cardModal");
const canvas = document.getElementById("quoteCanvas");
const ctx = canvas.getContext("2d");

function wrapText(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const categoryPalettes = {
  Motivation: ["#0F1F3D", "#050814"],
  Amitié: ["#0F2E3D", "#050814"],
  Amour: ["#1F0F3D", "#050814"],
  Force: ["#0F3D2E", "#050814"],
  Perte: ["#0F1A3D", "#050814"],
};

function drawQuoteCard(q) {
  const W = canvas.width, H = canvas.height;
  const [c1, c2] = categoryPalettes[q.category] || ["#0A0F24", "#050814"];

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Halo lumineux diffus, comme le fond du site
  const glowGrad = ctx.createRadialGradient(W/2, 200, 50, W/2, 200, 500);
  glowGrad.addColorStop(0, "rgba(56,189,248,0.25)");
  glowGrad.addColorStop(1, "rgba(56,189,248,0)");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(56,189,248,0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  ctx.fillStyle = "#38BDF8";
  ctx.font = "italic 120px Georgia, serif";
  ctx.globalAlpha = 0.8;
  ctx.fillText("「", 90, 260);
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#F0F5FF";
  ctx.font = "bold 44px -apple-system, sans-serif";
  const lines = wrapText(ctx, q.text, W - 220);
  let y = 420 - (lines.length - 1) * 30;
  lines.forEach((line) => {
    ctx.fillText(line, 110, y);
    y += 62;
  });

  ctx.fillStyle = "#38BDF8";
  ctx.font = "italic 120px Georgia, serif";
  ctx.globalAlpha = 0.8;
  ctx.textAlign = "right";
  ctx.fillText("」", W - 90, y + 40);
  ctx.textAlign = "left";
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#93DCFF";
  ctx.font = "bold 34px -apple-system, sans-serif";
  ctx.fillText(q.character, 110, H - 160);

  ctx.fillStyle = "#8C9BB9";
  ctx.font = "26px -apple-system, sans-serif";
  ctx.fillText(q.series, 110, H - 118);

  // Signature — simple et discrète
  ctx.fillStyle = "#38BDF8";
  ctx.font = "bold 26px -apple-system, sans-serif";
  ctx.fillText("#kotoba", 110, H - 60);
}

function openCardModal(q) {
  drawQuoteCard(q);
  cardModal.classList.add("is-open");
  document.getElementById("downloadCardBtn").onclick = () => {
    const link = document.createElement("a");
    link.download = `kotoba-${q.character.replace(/\s/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
}

window.openCardModal = openCardModal; // accessible depuis kotoba.js pour la citation du jour

document.getElementById("cardModalClose").addEventListener("click", () => cardModal.classList.remove("is-open"));
cardModal.addEventListener("click", (e) => { if (e.target === cardModal) cardModal.classList.remove("is-open"); });

// ============================================
// INITIALISATION
// ============================================
window.renderQuotes = renderQuotes;
window.getSeedAndQuotes = () => quotes;
window.setQuotes = (newQuotes) => { quotes = newQuotes; renderQuotes(); window.updateQuoteCount?.(); };

renderQuotes();

// Citation du jour — choisie de façon stable selon la date (même citation
// toute la journée, pour tout le monde)
const dayIndex = new Date().getDate() % seedQuotes.length;
const dayQuote = seedQuotes[dayIndex];
document.getElementById("quoteDayText").textContent = dayQuote.text;
document.getElementById("quoteDayMeta").textContent = `${dayQuote.character} — ${dayQuote.series}`;
document.getElementById("cardDayBtn").addEventListener("click", () => openCardModal(dayQuote));

document.getElementById("randomBtn").addEventListener("click", () => {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteDayText").textContent = random.text;
  document.getElementById("quoteDayMeta").textContent = `${random.character} — ${random.series}`;
  document.getElementById("cardDayBtn").onclick = () => openCardModal(random);
});

function updateQuoteCount() {
  document.getElementById("quoteCount").textContent =
    `${quotes.length} citations et ça grandit chaque semaine`;
}
updateQuoteCount();
window.updateQuoteCount = updateQuoteCount;
