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
    label: "NEON TOKYO",
    bg1: "#050817", bg2: "#071D35", accent: "#4DEBFF",
    accent2: "#8B5CFF", text: "#F5FBFF", muted: "#8BA7C2"
  },
  sakura: {
    label: "SAKURA",
    bg1: "#160914", bg2: "#321329", accent: "#FF9BCB",
    accent2: "#FFD2E5", text: "#FFF7FB", muted: "#D8A9BF"
  },
  manga: {
    label: "DARK MANGA",
    bg1: "#080808", bg2: "#171717", accent: "#FFFFFF",
    accent2: "#A8A8A8", text: "#FAFAFA", muted: "#9B9B9B"
  }
};

let creatorStyle = "neon";
let creatorQuote = null;
const creatorCanvas = document.getElementById("creatorCanvas");
const creatorCtx = creatorCanvas.getContext("2d");

function roundedRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr);
  ctx.arcTo(x+w,y+h,x,y+h,rr);
  ctx.arcTo(x,y+h,x,y,rr);
  ctx.arcTo(x,y,x+w,y,rr);
  ctx.closePath();
}

function fillRounded(ctx, x,y,w,h,r,fill,stroke=null,lw=1) {
  roundedRectPath(ctx,x,y,w,h,r);
  if(fill){ ctx.fillStyle=fill; ctx.fill(); }
  if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=lw; ctx.stroke(); }
}

function drawGlow(ctx, x, y, radius, color, alpha=1) {
  const g = ctx.createRadialGradient(x,y,0,x,y,radius);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
  ctx.restore();
}

function drawNoise(ctx, amount=0.035) {
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.save();
  ctx.globalAlpha=amount;
  for(let i=0;i<1300;i++){
    const x=Math.random()*W, y=Math.random()*H;
    const a=40+Math.random()*80;
    ctx.fillStyle=`rgba(255,255,255,${a/255})`;
    ctx.fillRect(x,y,1,1);
  }
  ctx.restore();
}

function drawGrid(ctx, size=52, alpha=0.08) {
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.save();
  ctx.strokeStyle=`rgba(100,220,255,${alpha})`;
  ctx.lineWidth=1;
  for(let x=0;x<=W;x+=size){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<=H;y+=size){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();
}

function drawDots(ctx, gap=22, radius=1.4, alpha=0.18) {
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.save();
  ctx.fillStyle=`rgba(255,255,255,${alpha})`;
  for(let y=0;y<H;y+=gap){
    for(let x=0;x<W;x+=gap){
      ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
    }
  }
  ctx.restore();
}

function drawSakuraPetals(ctx, count=28) {
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.save();
  for(let i=0;i<count;i++){
    const x=(i*137)%W, y=(i*233)%H;
    const size=8+(i%5)*3;
    ctx.translate(x,y);
    ctx.rotate((i%7)*0.35);
    ctx.fillStyle=`rgba(255,165,205,${0.10+(i%4)*0.04})`;
    ctx.beginPath();
    ctx.moveTo(0,-size);
    ctx.bezierCurveTo(size*1.4,-size*0.6,size*1.4,size*0.8,0,size);
    ctx.bezierCurveTo(-size*1.4,size*0.8,-size*1.4,-size*0.6,0,-size);
    ctx.fill();
    ctx.setTransform(1,0,0,1,0,0);
  }
  ctx.restore();
}

function drawCornerMarks(ctx, color) {
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=5;
  const m=54,l=80;
  [[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]].forEach(([x,y,sx,sy])=>{
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+sx*l,y);ctx.moveTo(x,y);ctx.lineTo(x,y+sy*l);ctx.stroke();
  });
  ctx.restore();
}

function fitFont(ctx, text, maxWidth, start=56, min=30, weight="700") {
  let size=start;
  while(size>min){
    ctx.font=`${weight} ${size}px Inter, Arial, sans-serif`;
    if(ctx.measureText(text).width<=maxWidth) return size;
    size-=2;
  }
  return min;
}

function wrapText(ctx, text, maxWidth) {
  const words=text.split(/\s+/); const lines=[]; let line="";
  words.forEach(word=>{
    const test=line?`${line} ${word}`:word;
    if(ctx.measureText(test).width>maxWidth && line){lines.push(line);line=word;}
    else line=test;
  });
  if(line) lines.push(line);
  return lines;
}

function drawBrand(ctx, style, compact=false) {
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.save();
  ctx.textAlign="right";
  ctx.font=`700 ${compact?22:24}px Inter, Arial, sans-serif`;
  ctx.fillStyle=style.accent;
  ctx.fillText("KOTOBA",W-72,H-58);
  ctx.font=`500 ${compact?12:13}px Inter, Arial, sans-serif`;
  ctx.fillStyle=style.muted;
  ctx.fillText("言葉  •  ANIME QUOTES",W-72,H-37);
  ctx.restore();
}

function drawNeonCard(ctx,q,s,W,H){
  const g=ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0,s.bg1);g.addColorStop(.52,"#06152B");g.addColorStop(1,s.bg2);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  drawGlow(ctx,160,170,500,"rgba(77,235,255,.30)");
  drawGlow(ctx,W-100,H-100,600,"rgba(139,92,255,.25)");
  drawGrid(ctx,54,.065);
  drawCornerMarks(ctx,s.accent);
  ctx.save();ctx.globalAlpha=.7;ctx.strokeStyle=s.accent;ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(W-135,145,78,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.arc(W-135,145,58,0,Math.PI*2);ctx.stroke();ctx.restore();

  ctx.fillStyle=s.accent;ctx.font="700 24px Inter,Arial";ctx.fillText("KOTOBA / 01",76,100);
  ctx.fillStyle="rgba(255,255,255,.28)";ctx.font="500 18px Inter,Arial";ctx.fillText("WORDS THAT STAY",76,130);

  ctx.save();ctx.shadowColor=s.accent;ctx.shadowBlur=28;
  ctx.fillStyle=s.accent;ctx.font="italic 180px Georgia,serif";ctx.fillText("“",78,330);ctx.restore();

  const size=fitFont(ctx,q.text,W-220,60,34,"700");
  ctx.font=`700 ${size}px Inter,Arial,sans-serif`;ctx.fillStyle=s.text;
  const lines=wrapText(ctx,q.text,W-220); let y=485-(lines.length-1)*28;
  lines.forEach(line=>{ctx.fillText(line,110,y);y+=size*1.28;});

  ctx.strokeStyle="rgba(77,235,255,.45)";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(110,y+35);ctx.lineTo(390,y+35);ctx.stroke();
  ctx.fillStyle=s.accent;ctx.font="700 31px Inter,Arial";ctx.fillText(q.character,110,y+88);
  ctx.fillStyle=s.muted;ctx.font="500 22px Inter,Arial";ctx.fillText(q.series,110,y+124);
  ctx.fillStyle="rgba(255,255,255,.18)";ctx.font="500 20px Inter,Arial";ctx.fillText("NEON TOKYO / ORIGINAL CARD",110,H-105);
  drawBrand(ctx,s);
}

function drawSakuraCard(ctx,q,s,W,H){
  const g=ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0,s.bg1);g.addColorStop(.5,"#241025");g.addColorStop(1,s.bg2);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  drawGlow(ctx,150,160,560,"rgba(255,155,203,.22)");
  drawGlow(ctx,W-100,H-40,500,"rgba(255,210,229,.16)");
  drawSakuraPetals(ctx,34);
  ctx.save();ctx.strokeStyle="rgba(255,190,215,.25)";ctx.lineWidth=2;
  roundedRectPath(ctx,48,48,W-96,H-96,44);ctx.stroke();ctx.restore();

  ctx.textAlign="center";
  ctx.fillStyle=s.accent;ctx.font="600 20px Inter,Arial";ctx.fillText("K O T O B A",W/2,105);
  ctx.fillStyle="rgba(255,255,255,.5)";ctx.font="400 16px Inter,Arial";ctx.fillText("言葉  /  ことば",W/2,132);

  ctx.fillStyle=s.accent2;ctx.font="italic 155px Georgia,serif";ctx.globalAlpha=.55;ctx.fillText("“",150,350);ctx.globalAlpha=1;
  const size=fitFont(ctx,q.text,W-230,58,34,"600");
  ctx.font=`600 ${size}px Georgia,serif`;ctx.fillStyle=s.text;
  const lines=wrapText(ctx,q.text,W-230);let y=500-(lines.length-1)*26;
  lines.forEach(line=>{ctx.fillText(line,W/2,y);y+=size*1.32;});

  ctx.fillStyle=s.accent;ctx.font="700 28px Inter,Arial";ctx.fillText(q.character,W/2,y+95);
  ctx.fillStyle=s.muted;ctx.font="400 20px Inter,Arial";ctx.fillText(q.series,W/2,y+130);
  ctx.strokeStyle="rgba(255,180,210,.38)";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(W/2-100,y+55);ctx.lineTo(W/2+100,y+55);ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,.36)";ctx.font="500 18px Inter,Arial";ctx.fillText("SAKURA / A MEMORY IN WORDS",W/2,H-90);
  drawBrand(ctx,s,true);
}

function drawMangaCard(ctx,q,s,W,H){
  ctx.fillStyle=s.bg1;ctx.fillRect(0,0,W,H);
  // Manga halftone field
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
  for(let y=0;y<H;y+=18) for(let x=0;x<W;x+=18){
    const r=((x*13+y*7)%100)/100;
    ctx.fillStyle=`rgba(255,255,255,${.025+r*.045})`;
    ctx.beginPath();ctx.arc(x,y,1+r*2,0,Math.PI*2);ctx.fill();
  }
  // diagonal impact bands
  ctx.fillStyle="rgba(255,255,255,.045)";
  ctx.beginPath();ctx.moveTo(-100,220);ctx.lineTo(W,40);ctx.lineTo(W,170);ctx.lineTo(-100,350);ctx.fill();
  ctx.fillStyle="rgba(255,255,255,.075)";
  ctx.beginPath();ctx.moveTo(-100,H-260);ctx.lineTo(W,H-480);ctx.lineTo(W,H-390);ctx.lineTo(-100,H-170);ctx.fill();
  ctx.restore();

  ctx.strokeStyle="#fff";ctx.lineWidth=5;ctx.strokeRect(38,38,W-76,H-76);
  drawCornerMarks(ctx,"#fff");

  ctx.fillStyle="#fff";ctx.font="900 24px Inter,Arial";ctx.fillText("KOTOBA",78,96);
  ctx.fillStyle="#999";ctx.font="500 16px Inter,Arial";ctx.fillText("DARK MANGA / 03",78,122);

  ctx.save();ctx.translate(W-170,230);ctx.rotate(-.08);ctx.fillStyle="#fff";
  ctx.font="900 130px Arial Black,Arial";ctx.fillText("言葉",0,0);ctx.restore();

  const size=fitFont(ctx,q.text,W-220,64,34,"900");
  ctx.font=`900 ${size}px Inter,Arial,sans-serif`;ctx.fillStyle="#fff";
  const lines=wrapText(ctx,q.text,W-220);let y=470-(lines.length-1)*28;
  lines.forEach(line=>{ctx.fillText(line,110,y);y+=size*1.25;});
  ctx.fillStyle="#fff";ctx.fillRect(110,y+30,250,7);
  ctx.fillStyle="#ddd";ctx.font="900 31px Inter,Arial";ctx.fillText(q.character,110,y+95);
  ctx.fillStyle="#888";ctx.font="500 21px Inter,Arial";ctx.fillText(q.series,110,y+130);
  ctx.fillStyle="#aaa";ctx.font="500 18px Inter,Arial";ctx.fillText("#KOTOBA  #MANGA  #WORDS",110,H-90);
}

function drawCreatorCard() {
  if (!creatorQuote) return;
  const q=creatorQuote, s=cardStyles[creatorStyle];
  const W=creatorCanvas.width,H=creatorCanvas.height;
  creatorCtx.clearRect(0,0,W,H);
  creatorCtx.textAlign="left";creatorCtx.globalAlpha=1;

  if(creatorStyle==="neon") drawNeonCard(creatorCtx,q,s,W,H);
  else if(creatorStyle==="sakura") drawSakuraCard(creatorCtx,q,s,W,H);
  else drawMangaCard(creatorCtx,q,s,W,H);

  drawNoise(creatorCtx,.018);
  creatorCtx.textAlign="left";
}

function initCreator() {
  const select=document.getElementById("creatorQuoteSelect");
  if(!select.dataset.filled){
    select.innerHTML=quotes.map(q=>`<option value="${q.id}">${q.text.slice(0,60)}${q.text.length>60?"…":""}</option>`).join("");
    select.dataset.filled="1";
    select.addEventListener("change",()=>{
      creatorQuote=quotes.find(q=>q.id===select.value);
      drawCreatorCard();
    });
  }
  creatorQuote=quotes.find(q=>q.id===select.value)||quotes[0];
  drawCreatorCard();
}

document.getElementById("styleRow").addEventListener("click",(e)=>{
  const btn=e.target.closest(".style-swatch"); if(!btn)return;
  document.querySelectorAll(".style-swatch").forEach(b=>b.classList.remove("is-active"));
  btn.classList.add("is-active");
  creatorStyle=btn.dataset.style;
  drawCreatorCard();
});

document.getElementById("creatorDownloadBtn").addEventListener("click",()=>{
  if(!creatorQuote)return;
  const safe=creatorQuote.character.replace(/[^a-z0-9À-ÿ]+/gi,"-").replace(/^-|-$/g,"").toLowerCase();
  const link=document.createElement("a");
  link.download=`kotoba-${safe||"quote"}-${creatorStyle}.png`;
  link.href=creatorCanvas.toDataURL("image/png");
  link.click();
  incrementStat("cardsCreated");
});

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
