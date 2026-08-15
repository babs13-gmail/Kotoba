// ============================================
// DONNÉES DE DÉPART — citations courtes et iconiques,
// avec attribution claire. D'autres arriveront via la
// modération communautaire (voir kotoba.js)
// ============================================
const seedQuotes = [
  { id: "s0", text: "Un cœur qui ne veut pas se briser ne peut jamais devenir fort.", character: "Kenshin Himura", series: "Rurouni Kenshin", category: "Force", lang: "Français" },
  { id: "s1", text: "Je vais devenir le roi des pirates.", character: "Monkey D. Luffy", series: "One Piece", category: "Motivation", lang: "Français" },
  { id: "s2", text: "Ce n'est pas la force qui fait un héros, mais son courage.", character: "Izuku Midoriya", series: "My Hero Academia", category: "Motivation", lang: "Français" },
  { id: "s3", text: "Les liens qu'on tisse sont notre plus grande force.", character: "Naruto Uzumaki", series: "Naruto", category: "Amitié", lang: "Français" },
  { id: "s4", text: "On ne peut pas obtenir quelque chose sans en sacrifier une autre.", character: "Edward Elric", series: "Fullmetal Alchemist", category: "Perte", lang: "Français" },
  { id: "s5", text: "Un jour comme un autre finira par revenir.", character: "Levi Ackerman", series: "L'Attaque des Titans", category: "Perte", lang: "Français" },
  { id: "s6", text: "Je ne veux pas te perdre, c'est pour ça que je deviendrai plus fort.", character: "Asta", series: "Black Clover", category: "Amour", lang: "Français" },
  { id: "s7", text: "I'm gonna be King of the Pirates.", character: "Monkey D. Luffy", series: "One Piece", category: "Motivation", lang: "English" },
  { id: "s8", text: "People's lives don't end when they die, it ends when they lose faith.", character: "Itachi Uchiha", series: "Naruto", category: "Force", lang: "English" },
  { id: "s9", text: "Tant que les gens continueront de chérir le souvenir des morts, ils ne seront jamais vraiment partis.", character: "Itachi Uchiha", series: "Naruto", category: "Perte", lang: "Français" },
  { id: "s10", text: "Un vrai ami est quelqu'un qui te tend la main même quand il a mal.", character: "Sakura Haruno", series: "Naruto", category: "Amitié", lang: "Français" },
  { id: "s11", text: "L'échec n'est pas une option, c'est une étape.", character: "All Might", series: "My Hero Academia", category: "Motivation", lang: "Français" },
  { id: "s12", text: "Even if I have to crawl, I'll get back up.", character: "Eren Yeager", series: "L'Attaque des Titans", category: "Force", lang: "English" },
  { id: "s13", text: "Un roi ne doit jamais montrer sa peur devant son peuple.", character: "Thorfinn", series: "Vinland Saga", category: "Force", lang: "Français" },
  { id: "s14", text: "L'amour, c'est accepter les cicatrices de l'autre comme les siennes.", character: "Violet Evergarden", series: "Violet Evergarden", category: "Amour", lang: "Français" },
  { id: "s15", text: "On ne choisit pas sa famille, mais on choisit ses compagnons de route.", character: "Gon Freecss", series: "Hunter x Hunter", category: "Amitié", lang: "Français" },
  { id: "s16", text: "Ce qui compte, ce n'est pas comment tu tombes, c'est comment tu te relèves.", character: "Saitama", series: "One Punch Man", category: "Force", lang: "Français" },
  { id: "s17", text: "The world is not beautiful, therefore it is.", character: "Lain", series: "Kino no Tabi", category: "Motivation", lang: "English" },
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
          <button class="meta-link" data-search-term="${encodeURIComponent(q.character)}"><strong>${q.character}</strong></button>
          <button class="meta-link meta-link-sm" data-search-term="${encodeURIComponent(q.series)}">${q.series}</button>
        </div>
        <div class="quote-card-actions">
          <button class="icon-btn" data-copy="${encodeURIComponent(q.text + " — " + q.character)}" aria-label="Copier">⧉</button>
          <button class="icon-btn" data-share="${q.id}" aria-label="Partager le lien">🔗</button>
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
      trackRecentlyViewed(q);
    });
  });
  document.querySelectorAll("[data-search-term]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const term = decodeURIComponent(btn.dataset.searchTerm);
      document.getElementById("searchInput").value = term;
      searchTerm = term.toLowerCase();
      goToTab("parcourir");
      renderQuotes();
    });
  });
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.copy));
      btn.textContent = "✓";
      setTimeout(() => (btn.textContent = "⧉"), 1500);
    });
  });
  document.querySelectorAll("[data-share]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = `${window.location.origin}${window.location.pathname}?id=${btn.dataset.share}`;
      await navigator.clipboard.writeText(url);
      btn.textContent = "✓";
      setTimeout(() => (btn.textContent = "🔗"), 1500);
    });
  });
}

// ============================================
// VU RÉCEMMENT — les 5 dernières citations consultées
// ============================================
function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem("kotoba-recent") || "[]"); }
  catch { return []; }
}

function trackRecentlyViewed(q) {
  let recent = getRecentlyViewed().filter((r) => r.text !== q.text);
  recent.unshift({ text: q.text, character: q.character, series: q.series, category: q.category, lang: q.lang, id: q.id });
  recent = recent.slice(0, 5);
  localStorage.setItem("kotoba-recent", JSON.stringify(recent));
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const recent = getRecentlyViewed();
  const section = document.getElementById("recentSection");
  const row = document.getElementById("recentRow");
  if (!recent.length) { section.hidden = true; return; }
  section.hidden = false;
  row.innerHTML = recent.map(quoteCardHTML).join("");
  attachCardEvents();
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
window.setQuotes = (newQuotes) => {
  quotes = newQuotes;
  renderQuotes();
  checkSharedLink(); // au cas où la citation partagée vient d'une proposition communautaire
};

renderQuotes();
renderRecentlyViewed();

// ============================================
// LIEN PARTAGÉ — ouvre directement la citation visée par ?id=
// ============================================
function checkSharedLink() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;
  const found = quotes.find((q) => q.id === id);
  if (found) {
    openCardModal(found);
    trackRecentlyViewed(found);
  }
}
checkSharedLink();

// ============================================
// MODE LECTURE — défilement plein écran, une citation à la fois
// ============================================
const categoryGlow = {
  Motivation: "radial-gradient(circle at 50% 30%, rgba(56,189,248,0.35), transparent 65%)",
  Amitié: "radial-gradient(circle at 50% 30%, rgba(56,189,248,0.3), transparent 65%)",
  Amour: "radial-gradient(circle at 50% 30%, rgba(124,111,240,0.35), transparent 65%)",
  Force: "radial-gradient(circle at 50% 30%, rgba(56,189,248,0.4), transparent 65%)",
  Perte: "radial-gradient(circle at 50% 30%, rgba(140,155,185,0.3), transparent 65%)",
};

function readSlideHTML(q, i) {
  return `
    <div class="read-slide">
      <div class="read-slide-bg" style="background:${categoryGlow[q.category] || categoryGlow.Motivation}"></div>
      <div class="read-slide-content">
        <p class="read-slide-text">「${q.text}」</p>
        <p class="read-slide-meta">${q.character} — ${q.series}</p>
      </div>
      ${i === 0 ? '<p class="read-slide-hint">Glisse vers le haut ↑</p>' : ""}
    </div>`;
}

const readMode = document.getElementById("readMode");

document.getElementById("readModeBtn").addEventListener("click", () => {
  document.getElementById("readModeTrack").innerHTML = quotes.map(readSlideHTML).join("");
  readMode.hidden = false;
  document.body.style.overflow = "hidden";
});

document.getElementById("readModeClose").addEventListener("click", () => {
  readMode.hidden = true;
  document.body.style.overflow = "";
});

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
