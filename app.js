// ============================================
// DONNÉES DE DÉPART — citations courtes et iconiques,
// avec attribution claire. D'autres arriveront via la
// modération communautaire (voir kotoba.js)
// ============================================
const seedQuotes = [
  { id: "s0", pop: 60, order: 18, text: "Un cœur qui ne veut pas se briser ne peut jamais devenir fort.", character: "Kenshin Himura", series: "Rurouni Kenshin", category: "Force", lang: "Français" },
  { id: "s1", pop: 99, order: 17, text: "Je vais devenir le roi des pirates.", character: "Monkey D. Luffy", series: "One Piece", category: "Motivation", lang: "Français" },
  { id: "s2", pop: 98, order: 16, text: "Ce n'est pas la force qui fait un héros, mais son courage.", character: "Izuku Midoriya", series: "My Hero Academia", category: "Motivation", lang: "Français" },
  { id: "s3", pop: 97, order: 15, text: "Les liens qu'on tisse sont notre plus grande force.", character: "Naruto Uzumaki", series: "Naruto", category: "Amitié", lang: "Français" },
  { id: "s4", pop: 96, order: 14, text: "On ne peut pas obtenir quelque chose sans en sacrifier une autre.", character: "Edward Elric", series: "Fullmetal Alchemist", category: "Perte", lang: "Français" },
  { id: "s5", pop: 95, order: 13, text: "Un jour comme un autre finira par revenir.", character: "Levi Ackerman", series: "L'Attaque des Titans", category: "Perte", lang: "Français" },
  { id: "s6", pop: 94, order: 12, text: "Je ne veux pas te perdre, c'est pour ça que je deviendrai plus fort.", character: "Asta", series: "Black Clover", category: "Amour", lang: "Français" },
  { id: "s7", pop: 93, order: 11, text: "I'm gonna be King of the Pirates.", character: "Monkey D. Luffy", series: "One Piece", category: "Motivation", lang: "English" },
  { id: "s8", pop: 92, order: 10, text: "People's lives don't end when they die, it ends when they lose faith.", character: "Itachi Uchiha", series: "Naruto", category: "Force", lang: "English" },
  { id: "s9", pop: 91, order: 9, text: "Tant que les gens continueront de chérir le souvenir des morts, ils ne seront jamais vraiment partis.", character: "Itachi Uchiha", series: "Naruto", category: "Perte", lang: "Français" },
  { id: "s10", pop: 90, order: 8, text: "Un vrai ami est quelqu'un qui te tend la main même quand il a mal.", character: "Sakura Haruno", series: "Naruto", category: "Amitié", lang: "Français" },
  { id: "s11", pop: 89, order: 7, text: "L'échec n'est pas une option, c'est une étape.", character: "All Might", series: "My Hero Academia", category: "Motivation", lang: "Français" },
  { id: "s12", pop: 88, order: 6, text: "Even if I have to crawl, I'll get back up.", character: "Eren Yeager", series: "L'Attaque des Titans", category: "Force", lang: "English" },
  { id: "s13", pop: 87, order: 5, text: "Un roi ne doit jamais montrer sa peur devant son peuple.", character: "Thorfinn", series: "Vinland Saga", category: "Force", lang: "Français" },
  { id: "s14", pop: 86, order: 4, text: "L'amour, c'est accepter les cicatrices de l'autre comme les siennes.", character: "Violet Evergarden", series: "Violet Evergarden", category: "Amour", lang: "Français" },
  { id: "s15", pop: 85, order: 3, text: "On ne choisit pas sa famille, mais on choisit ses compagnons de route.", character: "Gon Freecss", series: "Hunter x Hunter", category: "Amitié", lang: "Français" },
  { id: "s16", pop: 84, order: 2, text: "Ce qui compte, ce n'est pas comment tu tombes, c'est comment tu te relèves.", character: "Saitama", series: "One Punch Man", category: "Force", lang: "Français" },
  { id: "s17", pop: 83, order: 1, text: "The world is not beautiful, therefore it is.", character: "Lain", series: "Kino no Tabi", category: "Motivation", lang: "English" },
];

let quotes = [...seedQuotes];
let activeCategory = "Toutes";
let activeLang = "Toutes";
let searchTerm = "";
let activeSort = "pop";

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

function sortQuotes(list) {
  const sorted = [...list];
  if (activeSort === "pop") return sorted.sort((a, b) => (b.pop || 0) - (a.pop || 0));
  if (activeSort === "recent") return sorted.sort((a, b) => (b.order || 0) - (a.order || 0));
  if (activeSort === "random") return sorted.sort(() => Math.random() - 0.5);
  return sorted;
}

function renderQuotes() {
  const grid = document.getElementById("quoteGrid");
  let filtered = quotes.filter((q) => {
    const matchCat = activeCategory === "Toutes" || q.category === activeCategory;
    const matchLang = activeLang === "Toutes" || (q.lang || "Français") === activeLang;
    const matchSearch =
      !searchTerm ||
      q.series.toLowerCase().includes(searchTerm) ||
      q.character.toLowerCase().includes(searchTerm) ||
      q.text.toLowerCase().includes(searchTerm);
    return matchCat && matchLang && matchSearch;
  });
  filtered = sortQuotes(filtered);

  grid.innerHTML = filtered.length
    ? filtered.map(quoteCardHTML).join("")
    : `
      <div class="empty-state">
        <div class="empty-state-icon">✦</div>
        <p class="empty-state-title">「 言葉が見つかりません 」</p>
        <p class="empty-state-text">Aucune citation ne correspond à ta recherche.</p>
        <button class="btn-secondary btn-sm" id="resetFiltersBtn">Réinitialiser les filtres</button>
      </div>`;
  attachCardEvents();

  const resetBtn = document.getElementById("resetFiltersBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      activeCategory = "Toutes"; activeLang = "Toutes"; searchTerm = "";
      document.getElementById("searchInput").value = "";
      document.querySelectorAll("#categoryRow .chip, #langRow .chip").forEach((c) => c.classList.remove("is-active"));
      document.querySelector('#categoryRow [data-cat="Toutes"]').classList.add("is-active");
      document.querySelector('#langRow [data-lang="Toutes"]').classList.add("is-active");
      renderQuotes();
    });
  }
}

document.getElementById("parcourir").addEventListener("click", (e) => {
  const btn = e.target.closest(".sort-btn");
  if (!btn) return;
  document.querySelectorAll(".sort-btn").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  activeSort = btn.dataset.sort;
  renderQuotes();
});

// ============================================
// ANIME DU MOMENT — calculé depuis les citations disponibles
// ============================================
function renderAnimeSection() {
  const counts = {};
  quotes.forEach((q) => { counts[q.series] = (counts[q.series] || 0) + 1; });
  const topSeries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  document.getElementById("animeRow").innerHTML = topSeries
    .map(([name, count]) => `
      <button class="anime-card" data-search-term="${encodeURIComponent(name)}">
        <p class="anime-card-name">${name}</p>
        <p class="anime-card-count">${count} citation${count > 1 ? "s" : ""}</p>
      </button>`)
    .join("");
  document.querySelectorAll(".anime-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const term = decodeURIComponent(btn.dataset.searchTerm);
      document.getElementById("searchInput").value = term;
      searchTerm = term.toLowerCase();
      goToSection("parcourir");
      renderQuotes();
    });
  });
}

function renderFavorites() {
  const favs = getFavorites();
  const favGrid = document.getElementById("favGrid");
  const favQuotes = quotes.filter((q) => favs.includes(q.text));
  favGrid.innerHTML = favQuotes.map(quoteCardHTML).join("");
  document.getElementById("favEmpty").hidden = favQuotes.length > 0;
  attachCardEvents();
}

document.getElementById("favEmptyBtn")?.addEventListener("click", () => goToSection("parcourir"));

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
  incrementStat("viewed");
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
// NAVIGATION (Explorer / Favoris / Créer / Profil)
// ============================================
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const hero = document.querySelector(".hero");
const sections = ["parcourir", "favoris", "creer", "profil"];

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

function goToSection(target) {
  sections.forEach((s) => { document.getElementById(s).hidden = s !== target; });
  hero.hidden = target !== "parcourir";
  document.getElementById("recentSection").hidden = target !== "parcourir" || !getRecentlyViewed().length;
  document.getElementById("animeSection").hidden = target !== "parcourir";

  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.goto === target);
  });

  if (target === "favoris") renderFavorites();
  if (target === "creer") initCreator();
  if (target === "profil") renderProfileStats();

  navLinks.classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => goToSection(btn.dataset.goto));
});

window.goToTab = goToSection; // utilisé par la recherche cliquable (personnage/série)

// ============================================
// MODALE : PROPOSER UNE CITATION
// ============================================
const submitModal = document.getElementById("submitModal");
document.getElementById("submitBtn")?.addEventListener("click", () => submitModal.classList.add("is-open"));
document.getElementById("submitBtnMobile")?.addEventListener("click", () => submitModal.classList.add("is-open"));
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
  renderAnimeSection();
  checkSharedLink(); // au cas où la citation partagée vient d'une proposition communautaire
};

renderQuotes();
renderRecentlyViewed();
renderAnimeSection();

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
  const card = document.querySelector(".quote-day-card");
  card.classList.add("is-transitioning");
  setTimeout(() => {
    document.getElementById("quoteDayText").textContent = random.text;
    document.getElementById("quoteDayMeta").textContent = `${random.character} — ${random.series}`;
    document.getElementById("cardDayBtn").onclick = () => openCardModal(random);
    card.classList.remove("is-transitioning");
  }, 350);
});

// ============================================
// PAGE CRÉER — éditeur de carte avec plusieurs styles
// ============================================
// ============================================
// PAGE CRÉER — KOTOBA CARD STUDIO V3
// Rendu canvas premium : chaque style possède sa propre
// direction artistique. Aucun asset externe nécessaire.
// ============================================
const cardStyles = {
  neon: {
    label: "NEON TOKYO", number: "01",
    bg1: "#030817", bg2: "#07152f", accent: "#53e9ff", accent2: "#c14dff",
    text: "#f7fbff", muted: "#9fb4cc"
  },
  sakura: {
    label: "SAKURA", number: "02",
    bg1: "#fff8fb", bg2: "#f2d9e7", accent: "#d9578f", accent2: "#ff9fc7",
    text: "#241724", muted: "#7e6675"
  },
  manga: {
    label: "DARK MANGA", number: "03",
    bg1: "#050505", bg2: "#151515", accent: "#ef3f43", accent2: "#ffffff",
    text: "#f8f8f8", muted: "#a5a5a5"
  }
};

let creatorStyle = "neon";
let creatorQuote = null;
const creatorCanvas = document.getElementById("creatorCanvas");
const creatorCtx = creatorCanvas.getContext("2d");

function roundedRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function fillRounded(ctx,x,y,w,h,r,fill,stroke=null,lw=1){
  roundedRectPath(ctx,x,y,w,h,r);
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}
}
function drawGlow(ctx,x,y,radius,color,alpha=1){
  const g=ctx.createRadialGradient(x,y,0,x,y,radius);
  g.addColorStop(0,color); g.addColorStop(1,"rgba(0,0,0,0)");
  ctx.save(); ctx.globalAlpha=alpha; ctx.fillStyle=g; ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height); ctx.restore();
}
function drawNoise(ctx,amount=.025){
  const W=ctx.canvas.width,H=ctx.canvas.height; ctx.save(); ctx.globalAlpha=amount;
  for(let i=0;i<1500;i++){
    const x=Math.random()*W,y=Math.random()*H,a=30+Math.random()*90;
    ctx.fillStyle=`rgba(255,255,255,${a/255})`; ctx.fillRect(x,y,1,1);
  }
  ctx.restore();
}
function drawFrame(ctx,color,soft=false){
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=soft?2:5;
  roundedRectPath(ctx,30,30,W-60,H-60,36); ctx.stroke();
  ctx.lineWidth=soft?2:4; const m=52,l=72;
  [[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]].forEach(([x,y,sx,sy])=>{
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+sx*l,y);ctx.moveTo(x,y);ctx.lineTo(x,y+sy*l);ctx.stroke();
  }); ctx.restore();
}
function wrapText(ctx,text,maxWidth){
  const words=text.split(/\s+/),lines=[]; let line="";
  for(const word of words){
    const test=line?`${line} ${word}`:word;
    if(ctx.measureText(test).width>maxWidth && line){lines.push(line);line=word;} else line=test;
  }
  if(line)lines.push(line); return lines;
}
function fitFont(ctx,text,maxWidth,start=56,min=30,weight="700",family="Inter, Arial, sans-serif"){
  for(let size=start;size>=min;size-=2){ctx.font=`${weight} ${size}px ${family}`;if(ctx.measureText(text).width<=maxWidth)return size;}
  return min;
}
function drawBrand(ctx,s,align="left"){
  const W=ctx.canvas.width,H=ctx.canvas.height; ctx.save(); ctx.textAlign=align;
  const x=align==="right"?W-72:72;
  ctx.fillStyle=s.accent;ctx.font="700 24px Inter,Arial,sans-serif";ctx.fillText("KOTOBA",x,H-62);
  ctx.fillStyle=s.muted;ctx.font="500 13px Inter,Arial,sans-serif";ctx.fillText("言葉  •  ANIME QUOTES",x,H-40);ctx.restore();
}
function drawRain(ctx,count=230){
  const W=ctx.canvas.width,H=ctx.canvas.height;ctx.save();
  for(let i=0;i<count;i++){const x=(i*83)%W,y=(i*137)%H,len=16+(i%8)*4;ctx.strokeStyle=`rgba(100,220,255,${.08+(i%5)*.025})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-10,y+len);ctx.stroke();}
  ctx.restore();
}
function drawCity(ctx,neon=true){
  const W=ctx.canvas.width,H=ctx.canvas.height,base=H-115;ctx.save();
  const buildings=[
    [0,430,125,base],[105,350,235,base],[215,455,325,base],[300,300,430,base],[410,405,535,base],[515,335,640,base],[620,390,755,base],[740,275,885,base],[870,360,1000,base]
  ];
  buildings.forEach(([x,y,r,b],i)=>{
    ctx.fillStyle=i%2?"#07101e":"#050a14";ctx.fillRect(x,y,r-x,b-y);
    for(let yy=y+28;yy<b-20;yy+=28)for(let xx=x+16;xx<r-10;xx+=25){
      if((xx+yy+i*17)%7<3){ctx.fillStyle=neon?(i%3===0?"rgba(76,231,255,.72)":"rgba(208,67,255,.65)"):"rgba(255,255,255,.12)";ctx.fillRect(xx,yy,7,11);}
    }
  });
  // perspective road
  const g=ctx.createLinearGradient(0,base-80,0,H);g.addColorStop(0,"rgba(12,31,56,.2)");g.addColorStop(1,"rgba(1,4,10,.98)");ctx.fillStyle=g;ctx.fillRect(0,base-80,W,H-base+80);
  ctx.strokeStyle=neon?"rgba(75,225,255,.35)":"rgba(255,255,255,.12)";ctx.lineWidth=3;
  for(let i=-5;i<=5;i++){ctx.beginPath();ctx.moveTo(W/2+i*26,base);ctx.lineTo(W/2+i*170,H);ctx.stroke();}
  ctx.restore();
}
function drawNeonSigns(ctx){
  const W=ctx.canvas.width,H=ctx.canvas.height;ctx.save();
  const signs=[{x:805,y:230,w:120,h:260,t:"未来"},{x:115,y:520,w:95,h:210,t:"言葉"},{x:700,y:470,w:105,h:180,t:"心"}];
  signs.forEach((s,i)=>{ctx.shadowColor=i%2?"#53e9ff":"#c14dff";ctx.shadowBlur=22;ctx.strokeStyle=i%2?"#53e9ff":"#c14dff";ctx.lineWidth=4;ctx.strokeRect(s.x,s.y,s.w,s.h);ctx.shadowBlur=0;ctx.save();ctx.translate(s.x+s.w/2,s.y+s.h/2);ctx.rotate(-Math.PI/2);ctx.textAlign="center";ctx.fillStyle=i%2?"#b8f8ff":"#ffb4ff";ctx.font="700 42px serif";ctx.fillText(s.t,0,14);ctx.restore();});ctx.restore();
}
function drawNeonCard(ctx,q,s,W,H){
  const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,s.bg1);g.addColorStop(.5,"#07182f");g.addColorStop(1,s.bg2);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  drawGlow(ctx,180,160,480,"rgba(42,220,255,.32)");drawGlow(ctx,W-120,H-120,520,"rgba(194,60,255,.28)");
  // distant skyline + rain creates the immersive Tokyo background
  drawCity(ctx,true);drawRain(ctx);drawNeonSigns(ctx);
  // glass text panel
  ctx.fillStyle="rgba(2,8,22,.68)";ctx.strokeStyle="rgba(83,233,255,.32)";ctx.lineWidth=2;fillRounded(ctx,72,205,W-144,525,30,"rgba(2,8,22,.68)","rgba(83,233,255,.32)",2);
  drawFrame(ctx,"rgba(83,233,255,.75)");
  ctx.fillStyle=s.accent;ctx.font="700 24px Inter,Arial";ctx.fillText(`KOTOBA  言葉  /  ${s.number}`,76,92);
  ctx.fillStyle="rgba(255,255,255,.52)";ctx.font="500 16px Inter,Arial";ctx.fillText("TOKYO • AFTER MIDNIGHT",76,121);
  ctx.save();ctx.shadowColor=s.accent;ctx.shadowBlur=30;ctx.fillStyle=s.accent;ctx.font="italic 150px Georgia,serif";ctx.fillText("“",105,365);ctx.restore();
  const size=fitFont(ctx,q.text,W-250,58,32,"700");ctx.font=`700 ${size}px Inter,Arial,sans-serif`;ctx.fillStyle=s.text;
  const lines=wrapText(ctx,q.text,W-250);let y=485-(lines.length-1)*30;lines.forEach(line=>{ctx.fillText(line,125,y);y+=size*1.27;});
  const accentWords=(q.text.match(/\b[^\s]+\s*[^\s]*$/)||[""])[0];
  ctx.fillStyle=s.accent2;ctx.fillRect(125,y+28,220,5);
  ctx.fillStyle=s.accent;ctx.font="700 29px Inter,Arial";ctx.fillText(`— ${q.character}`,125,y+82);
  ctx.fillStyle=s.muted;ctx.font="500 20px Inter,Arial";ctx.fillText(q.series,125,y+116);
  ctx.fillStyle="rgba(255,255,255,.42)";ctx.font="500 17px Inter,Arial";ctx.fillText("#KOTOBA  #TOKYO  #WORDS",125,H-92);
  drawBrand(ctx,s,"right");
}
function drawBranch(ctx,x,y,scale,flip=1){
  ctx.save();ctx.translate(x,y);ctx.scale(flip,1);ctx.strokeStyle="#5c3f43";ctx.lineWidth=11*scale;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(80*scale,-80*scale,145*scale,-170*scale);ctx.stroke();
  [[55,-58],[100,-105],[132,-150],[24,-42]].forEach(([bx,by],i)=>{ctx.lineWidth=5*scale;ctx.beginPath();ctx.moveTo(bx*scale,by*scale);ctx.lineTo((bx+45)*scale,(by-55)*scale);ctx.stroke();for(let p=0;p<4;p++){const px=(bx+25)+(p%2)*22,py=(by-48)+Math.floor(p/2)*20;ctx.fillStyle=p%2?"#f48bb3":"#ffb8cf";ctx.beginPath();ctx.ellipse(px*scale,py*scale,14*scale,9*scale,(p*.7),0,Math.PI*2);ctx.fill();}});ctx.restore();
}
function drawSakuraPetals(ctx,count=70){const W=ctx.canvas.width,H=ctx.canvas.height;ctx.save();for(let i=0;i<count;i++){const x=(i*173+37)%W,y=(i*97+63)%H,sz=5+(i%7);ctx.translate(x,y);ctx.rotate((i%9)*.28);ctx.fillStyle=`rgba(242,116,166,${.18+(i%5)*.035})`;ctx.beginPath();ctx.moveTo(0,-sz);ctx.bezierCurveTo(sz*1.7,-sz*.4,sz*1.4,sz*.9,0,sz);ctx.bezierCurveTo(-sz*1.4,sz*.9,-sz*1.7,-sz*.4,0,-sz);ctx.fill();ctx.setTransform(1,0,0,1,0,0);}ctx.restore();}
function drawSakuraCard(ctx,q,s,W,H){
  const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,"#fffafb");g.addColorStop(.55,"#f7e2ed");g.addColorStop(1,"#e7c5da");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  drawGlow(ctx,190,180,520,"rgba(255,170,205,.24)");
  // moon + mountains + lake
  ctx.fillStyle="rgba(255,255,255,.55)";ctx.beginPath();ctx.arc(250,330,125,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#cba8c1";ctx.beginPath();ctx.moveTo(0,650);ctx.lineTo(190,470);ctx.lineTo(315,620);ctx.lineTo(475,455);ctx.lineTo(690,655);ctx.lineTo(860,495);ctx.lineTo(W,655);ctx.lineTo(W,900);ctx.lineTo(0,900);ctx.fill();
  ctx.fillStyle="rgba(137,102,141,.22)";ctx.beginPath();ctx.moveTo(0,760);ctx.lineTo(W,760);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  for(let i=0;i<9;i++){ctx.strokeStyle=`rgba(255,255,255,${.12-i*.008})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(350+i*25,780+i*18);ctx.lineTo(650-i*20,780+i*18);ctx.stroke();}
  // torii silhouette
  ctx.strokeStyle="#7b4d64";ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(735,760);ctx.lineTo(735,590);ctx.moveTo(875,760);ctx.lineTo(875,590);ctx.moveTo(700,610);ctx.lineTo(910,610);ctx.moveTo(720,650);ctx.lineTo(890,650);ctx.stroke();
  drawBranch(ctx,940,190,1.05,-1);drawBranch(ctx,90,760,.55,1);drawSakuraPetals(ctx,75);
  ctx.fillStyle="rgba(255,255,255,.72)";fillRounded(ctx,70,210,W-140,505,30,"rgba(255,255,255,.58)","rgba(217,87,143,.28)",2);
  drawFrame(ctx,"rgba(217,87,143,.55)",true);
  ctx.fillStyle=s.accent;ctx.font="700 24px Inter,Arial";ctx.fillText(`KOTOBA  言葉  /  ${s.number}`,76,92);
  ctx.fillStyle=s.muted;ctx.font="500 16px Inter,Arial";ctx.fillText("SAKURA • QUIET MOMENTS",76,121);
  ctx.fillStyle="rgba(217,87,143,.65)";ctx.font="italic 145px Georgia,serif";ctx.fillText("“",102,365);
  const size=fitFont(ctx,q.text,W-250,57,31,"600","Georgia, serif");ctx.font=`600 ${size}px Georgia,serif`;ctx.fillStyle=s.text;
  const lines=wrapText(ctx,q.text,W-250);let y=485-(lines.length-1)*29;lines.forEach(line=>{ctx.fillText(line,125,y);y+=size*1.32;});
  ctx.strokeStyle="rgba(217,87,143,.45)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(125,y+28);ctx.lineTo(350,y+28);ctx.stroke();
  ctx.fillStyle=s.accent;ctx.font="700 29px Inter,Arial";ctx.fillText(`— ${q.character}`,125,y+80);ctx.fillStyle=s.muted;ctx.font="500 20px Inter,Arial";ctx.fillText(q.series,125,y+113);
  ctx.fillStyle=s.accent;ctx.font="600 18px Inter,Arial";ctx.fillText("#KOTOBA  #SAKURA  #WORDS",125,H-90);drawBrand(ctx,s,"right");
}
function drawHalftone(ctx,x,y,w,h,step=16,alpha=.08){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle=`rgba(255,255,255,${alpha})`;for(let yy=y;yy<y+h;yy+=step)for(let xx=x;xx<x+w;xx+=step){ctx.beginPath();ctx.arc(xx,yy,2,0,Math.PI*2);ctx.fill();}ctx.restore();}
function drawInk(ctx,count=40){const W=ctx.canvas.width,H=ctx.canvas.height;ctx.save();for(let i=0;i<count;i++){const x=(i*193)%W,y=(i*83)%H,r=5+(i%11)*3;ctx.fillStyle=`rgba(255,255,255,${.03+(i%5)*.018})`;ctx.beginPath();ctx.arc(x,y,r*(1+(i%3)),0,Math.PI*2);ctx.fill();}ctx.restore();}
function drawMangaCard(ctx,q,s,W,H){
  const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,"#020202");g.addColorStop(.62,"#0b0b0b");g.addColorStop(1,"#1a1a1a");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // moon and ink city
  ctx.fillStyle="rgba(255,255,255,.13)";ctx.beginPath();ctx.arc(760,360,210,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#090909";for(let i=0;i<12;i++){const x=i*90-20,h=120+(i%5)*70;ctx.fillRect(x,H-140-h,70,h);}
  // impact brush strokes
  ctx.save();ctx.globalAlpha=.35;ctx.strokeStyle="#fff";ctx.lineWidth=18;ctx.lineCap="round";for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(580+i*20,160+i*15);ctx.lineTo(930+i*7,70+i*25);ctx.stroke();}ctx.restore();
  drawHalftone(ctx,0,0,W,H,18,.055);drawInk(ctx);
  // caped silhouette / manga hero
  ctx.fillStyle="#030303";ctx.beginPath();ctx.moveTo(650,900);ctx.quadraticCurveTo(700,660,775,650);ctx.quadraticCurveTo(850,670,920,910);ctx.lineTo(870,1000);ctx.lineTo(620,1000);ctx.closePath();ctx.fill();
  ctx.fillStyle="#111";ctx.beginPath();ctx.arc(775,620,48,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#ddd";ctx.beginPath();ctx.moveTo(730,710);ctx.lineTo(820,710);ctx.lineTo(855,930);ctx.lineTo(690,930);ctx.closePath();ctx.fill();
  ctx.fillStyle="#050505";ctx.beginPath();ctx.moveTo(690,740);ctx.quadraticCurveTo(780,790,860,735);ctx.lineTo(900,930);ctx.lineTo(650,930);ctx.closePath();ctx.fill();
  // red editorial panel
  fillRounded(ctx,70,205,W-140,540,28,"rgba(0,0,0,.70)","rgba(239,63,67,.32)",2);drawFrame(ctx,"rgba(255,255,255,.88)");
  ctx.fillStyle="#fff";ctx.font="900 24px Inter,Arial";ctx.fillText(`KOTOBA  言葉  /  ${s.number}`,76,92);
  ctx.fillStyle="#999";ctx.font="500 16px Inter,Arial";ctx.fillText("DARK MANGA • SURVIVE",76,121);
  ctx.fillStyle=s.accent;ctx.font="italic 150px Georgia,serif";ctx.fillText("“",105,365);
  const size=fitFont(ctx,q.text,W-250,58,31,"800");ctx.font=`800 ${size}px Inter,Arial,sans-serif`;ctx.fillStyle=s.text;
  const lines=wrapText(ctx,q.text,W-250);let y=485-(lines.length-1)*29;lines.forEach(line=>{ctx.fillText(line,125,y);y+=size*1.27;});
  ctx.fillStyle=s.accent;ctx.fillRect(125,y+27,230,6);ctx.fillStyle="#fff";ctx.font="900 29px Inter,Arial";ctx.fillText(`— ${q.character}`,125,y+82);ctx.fillStyle="#999";ctx.font="500 20px Inter,Arial";ctx.fillText(q.series,125,y+115);
  ctx.fillStyle="#ddd";ctx.font="500 18px Inter,Arial";ctx.fillText("#KOTOBA  #MANGA  #WORDS",125,H-90);drawBrand(ctx,s,"right");
}
function drawCreatorCard(){
  if(!creatorQuote)return;
  const q=creatorQuote,s=cardStyles[creatorStyle],W=creatorCanvas.width,H=creatorCanvas.height;
  creatorCtx.clearRect(0,0,W,H);creatorCtx.textAlign="left";creatorCtx.globalAlpha=1;
  if(creatorStyle==="neon")drawNeonCard(creatorCtx,q,s,W,H);
  else if(creatorStyle==="sakura")drawSakuraCard(creatorCtx,q,s,W,H);
  else drawMangaCard(creatorCtx,q,s,W,H);
  drawNoise(creatorCtx,.012);creatorCtx.textAlign="left";
}
function initCreator(){
  const select=document.getElementById("creatorQuoteSelect");
  if(!select.dataset.filled){
    select.innerHTML=quotes.map(q=>`<option value="${q.id}">${q.text.slice(0,60)}${q.text.length>60?"…":""}</option>`).join("");
    select.dataset.filled="1";select.addEventListener("change",()=>{creatorQuote=quotes.find(q=>q.id===select.value);drawCreatorCard();});
  }
  creatorQuote=quotes.find(q=>q.id===select.value)||quotes[0];drawCreatorCard();
}
document.getElementById("styleRow").addEventListener("click",e=>{const btn=e.target.closest(".style-swatch");if(!btn)return;document.querySelectorAll(".style-swatch").forEach(b=>b.classList.remove("is-active"));btn.classList.add("is-active");creatorStyle=btn.dataset.style;drawCreatorCard();});
document.getElementById("creatorDownloadBtn").addEventListener("click",()=>{if(!creatorQuote)return;const safe=creatorQuote.character.replace(/[^a-z0-9À-ÿ]+/gi,"-").replace(/^-|-$/g,"").toLowerCase();const link=document.createElement("a");link.download=`kotoba-${safe||"quote"}-${creatorStyle}.png`;link.href=creatorCanvas.toDataURL("image/png");link.click();incrementStat("cardsCreated");});

// ============================================
// PAGE PROFIL — statistiques locales
// ============================================
function getStats() {
  try { return JSON.parse(localStorage.getItem("kotoba-stats") || "{}"); }
  catch { return {}; }
}

function incrementStat(key) {
  const stats = getStats();
  stats[key] = (stats[key] || 0) + 1;
  localStorage.setItem("kotoba-stats", JSON.stringify(stats));
}

function renderProfileStats() {
  const stats = getStats();
  document.getElementById("statFavs").textContent = getFavorites().length;
  document.getElementById("statViewed").textContent = stats.viewed || 0;
  document.getElementById("statCards").textContent = stats.cardsCreated || 0;
}
