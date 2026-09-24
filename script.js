/* ===== Edit these ===== */
const CONFIG = {
 whatsapp: "918892864631" // country code + number, no + or spaces
};

const SERVICES = [
 ["Orthopedic rehabilitation","Recovery from fractures, ligament and tendon injuries and other musculoskeletal conditions.","M12 2v20M8 6h8M8 12h8M8 18h8"],
 ["Joint and back care","Neck pain, back pain, sciatica, arthritis, knee and shoulder problems.","M3 12h4l3-8 4 16 3-8h4"],
 ["Post-operative recovery","Structured rehab after joint replacement, ligament reconstruction and spine surgery.","M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"],
 ["Sports physical therapy","Injury rehab, return-to-play planning and conditioning for athletes and academies.","M13 2 3 14h9l-1 8 10-12h-9z"],
 ["Chronic pain management","Long-term relief using manual therapy, exercise and supportive modalities.","M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"],
 ["Neuro rehabilitation","Supportive therapy for stroke, nerve injuries and other neurological conditions.","M12 3a4 4 0 0 0-4 4v1a3 3 0 0 0 0 6v1a4 4 0 0 0 8 0v-1a3 3 0 0 0 0-6V7a4 4 0 0 0-4-4z"],
 ["Ergonomic wellness","Workplace and posture counseling to prevent strain and recurring pain.","M3 4h18v12H3zM8 20h8M12 16v4"],
 ["Home physiotherapy","Professional care at your doorstep, with the same personalized plan.","M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"]
];

const $ = (s, r = document) => r.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Services */
$("#services-grid").innerHTML = SERVICES.map(([t, d, p]) =>
 `<article class="card reveal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${p}"/></svg><h3>${t}</h3><p>${d}</p></article>`).join("");

/* Year, WhatsApp links */
$("#year").textContent = new Date().getFullYear();

/* Theme toggle */
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
$("#theme").addEventListener("click", () => {
 const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
 root.dataset.theme = dark ? "light" : "dark";
 try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

/* Mobile menu */
const nav = $("#nav"), menu = $("#menu");
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", nav.classList.toggle("open")));
nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); } });
document.addEventListener("keydown", e => {
 if (e.key === "Escape" && nav.classList.contains("open")) {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.focus();
 }
});

/* Hero visual carousel */
const carousel = $(".carousel");
if (carousel) {
 const slides = [...carousel.querySelectorAll(".carousel-slide")];
 const dots = [...carousel.querySelectorAll(".carousel-dot")];
 let current = 0;
 let timer;
 let paused = false;

 const showSlide = index => {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
   const active = i === current;
   slide.classList.toggle("is-active", active);
   slide.setAttribute("aria-hidden", String(!active));
   if (active) slide.removeAttribute("inert");
   else slide.setAttribute("inert", "");
  });
  dots.forEach((dot, i) => {
   const active = i === current;
   dot.classList.toggle("is-active", active);
   dot.setAttribute("aria-selected", String(active));
   dot.tabIndex = active ? 0 : -1;
  });
 };

 const stopAutoAdvance = () => { clearInterval(timer); timer = undefined; };
 const startAutoAdvance = () => {
  stopAutoAdvance();
  if (!reduced && !paused) timer = setInterval(() => showSlide(current + 1), 6000);
 };
 carousel.querySelector("[data-carousel-prev]").addEventListener("click", () => { showSlide(current - 1); startAutoAdvance(); });
 carousel.querySelector("[data-carousel-next]").addEventListener("click", () => { showSlide(current + 1); startAutoAdvance(); });
 dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); startAutoAdvance(); }));
 carousel.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") { e.preventDefault(); showSlide(current - 1); startAutoAdvance(); }
  if (e.key === "ArrowRight") { e.preventDefault(); showSlide(current + 1); startAutoAdvance(); }
  if (e.key === "Home") { e.preventDefault(); showSlide(0); startAutoAdvance(); }
  if (e.key === "End") { e.preventDefault(); showSlide(slides.length - 1); startAutoAdvance(); }
 });
 carousel.addEventListener("mouseenter", () => { paused = true; stopAutoAdvance(); });
 carousel.addEventListener("mouseleave", () => { paused = false; startAutoAdvance(); });
 carousel.addEventListener("focusin", () => { paused = true; stopAutoAdvance(); });
 carousel.addEventListener("focusout", e => {
  if (!carousel.contains(e.relatedTarget)) { paused = false; startAutoAdvance(); }
 });
 showSlide(0);
 startAutoAdvance();
}

/* Range-of-motion dial */
const arm = $("#arm"), deg = $("#deg"), sector = $("#sector");
function setAngle(a) {
 const r = a * Math.PI / 180, x = 210 + 170 * Math.cos(r), y = 250 - 170 * Math.sin(r);
 arm.setAttribute("transform", `rotate(${-a} 210 250)`);
 sector.setAttribute("d", `M210 250 L380 250 A170 170 0 0 0 ${x.toFixed(1)} ${y.toFixed(1)}Z`);
 deg.textContent = Math.round(a) + "\u00B0";
}
if (arm && deg && sector && reduced) setAngle(130);
else if (arm && deg && sector) {
 setAngle(30);
 let s = null;
 const step = t => { s = s || t; const p = Math.min((t - s) / 2800, 1); setAngle(30 + 100 * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
 setTimeout(() => requestAnimationFrame(step), 600);
}

/* Counters + reveal on scroll */
const fmt = n => n.toLocaleString("en-IN");
function count(el) {
 const end = +el.dataset.count, suf = el.dataset.suffix || "";
 if (reduced) { el.textContent = fmt(end) + suf; return; }
 let s = null;
 const step = t => { s = s || t; const p = Math.min((t - s) / 1600, 1); el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3)))) + suf; if (p < 1) requestAnimationFrame(step); };
 requestAnimationFrame(step);
}
const io = new IntersectionObserver(entries => entries.forEach(e => {
 if (!e.isIntersecting) return;
 e.target.classList.add("in");
 if (e.target.dataset.count) count(e.target);
 io.unobserve(e.target);
}), { threshold: .25 });
document.querySelectorAll(".reveal,[data-count]").forEach(el => io.observe(el));

/* Booking form uses the browser's normal HTML form submission logic */
const form = $("#book");
if (form) {
 form.addEventListener("submit", () => {
  const note = $("#note");
  if (note) note.textContent = "Your email app may open to send the enquiry.";
 });
}

/* WhatsApp button */
const fab = $("#fab");
if (!CONFIG.whatsapp.includes("X")) { fab.href = `https://wa.me/${CONFIG.whatsapp}`; fab.target = "_blank"; fab.rel = "noopener"; }

/* Header shadow + scroll progress */
const header = $(".site-header"), bar = $("#progress");
addEventListener("scroll", () => {
 const h = document.documentElement;
 header.classList.toggle("scrolled", scrollY > 8);
 bar.style.width = (scrollY / Math.max(h.scrollHeight - innerHeight, 1) * 100) + "%";
}, { passive: true });

/* Highlight current section in nav */
const links = [...nav.querySelectorAll("a")];
const spy = new IntersectionObserver(entries => entries.forEach(e => {
 if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
links.forEach(a => { const t = document.querySelector(a.getAttribute("href")); if (t) spy.observe(t); });
