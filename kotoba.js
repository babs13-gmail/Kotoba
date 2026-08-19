// ============================================
// KOTOBA — Firebase Firestore
//
// ⚠️ ÉTAPE OBLIGATOIRE : crée un nouveau projet Firebase
// "kotoba", active Firestore (mode test), colle sa config ici.
//
// Fonctionnement de la modération : chaque citation proposée
// est enregistrée avec approved:false. Toi seul peux la valider
// en changeant ce champ à true directement dans la console
// Firebase (onglet Données) — pas besoin de panneau admin.
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFYtVEEDO_5fsSq3uibNi9dLxN2HjhilU",
  authDomain: "kotoba-bed37.firebaseapp.com",
  projectId: "kotoba-bed37",
  storageBucket: "kotoba-bed37.firebasestorage.app",
  messagingSenderId: "61014442641",
  appId: "1:61014442641:web:aba7bc8a586e9d5c83b530"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const quotesRef = collection(db, "quotes");

// ============================================
// EMAILJS — notification par email à chaque proposition
// ⚠️ Remplace ces 3 valeurs par celles de ton compte EmailJS
// (emailjs.com → Email Services / Email Templates / Account)
// ============================================
const EMAILJS_PUBLIC_KEY = "EkSzKCh4R7T0LL9jM";
const EMAILJS_SERVICE_ID = "service_0ftcqd4";
const EMAILJS_TEMPLATE_ID = "template_kw0q3u3";

if (window.emailjs) emailjs.init(EMAILJS_PUBLIC_KEY);

// ============================================
// ENVOI D'UNE PROPOSITION DE CITATION
// ============================================
document.getElementById("submitForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = document.getElementById("subText").value.trim();
  const character = document.getElementById("subCharacter").value.trim();
  const series = document.getElementById("subSeries").value.trim();
  const category = document.getElementById("subCategory").value;
  const lang = document.getElementById("subLang").value;
  const status = document.getElementById("submitStatus");
  const btn = e.target.querySelector("button[type=submit]");

  if (!text || !character || !series) return;

  btn.disabled = true;
  status.textContent = "Envoi...";

  try {
    await addDoc(quotesRef, {
      text: text.slice(0, 280),
      character: character.slice(0, 60),
      series: series.slice(0, 60),
      category,
      lang,
      approved: false,
      createdAt: Timestamp.now()
    });

    // Notification par email — si ça échoue, on ne bloque pas
    // l'expérience utilisateur, la citation est déjà enregistrée
    if (window.emailjs) {
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        character, series, text, category, lang
      }).catch((err) => console.error("Notification email échouée :", err));
    }

    status.textContent = "🙏 Merci ! Elle sera visible après vérification, en général sous 48h.";
    e.target.reset();
    document.getElementById("previewText").textContent = "Ta citation apparaîtra ici...";
    document.getElementById("previewMeta").textContent = "";
    document.getElementById("charCount").textContent = "0 / 280";
    setTimeout(() => {
      document.getElementById("submitModal").classList.remove("is-open");
      status.textContent = "";
    }, 3500);
  } catch (err) {
    console.error(err);
    status.textContent = "Erreur, réessaie.";
  } finally {
    btn.disabled = false;
  }
});

// ============================================
// CHARGEMENT DES CITATIONS APPROUVÉES
// (vient s'ajouter aux citations de départ dans app.js)
// ============================================
async function loadApprovedQuotes() {
  try {
    const q = query(quotesRef, where("approved", "==", true));
    const snap = await getDocs(q);
    if (snap.empty) return;

    const communityQuotes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const current = window.getSeedAndQuotes();
    window.setQuotes([...current, ...communityQuotes]);
  } catch (err) {
    console.error("Citations communautaires indisponibles :", err);
  }
}

loadApprovedQuotes();
