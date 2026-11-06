// AB Motors website logic
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const money = (n) => `${BUSINESS.currency} ${Number(n).toLocaleString("en-GH")}`;
const waLink = (t) => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(t)}`;
const img = (f) => `images/${f}`;
const carName = (c) => `${c.year} ${c.make} ${c.model}`;
let toastT;
const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2000); };

// ---------- business details everywhere ----------
$$("[data-biz]").forEach((el) => (el.textContent = BUSINESS[el.dataset.biz]));
$$("[data-wa]").forEach((el) => (el.href = waLink(el.dataset.wa)));
$$("[data-call]").forEach((el) => (el.href = `tel:${BUSINESS.phoneCall}`));
$("#mapLink").href = BUSINESS.mapsLink;
$("#year").textContent = new Date().getFullYear();
$("#statCars").textContent = CARS.length;
if (CARS.length) $("#statFrom").textContent = money(Math.min(...CARS.map((c) => c.price)));
CARS.forEach((c) => $("#contactCar").insertAdjacentHTML("beforeend", `<option>${carName(c)}</option>`));

// ---------- mobile menu & sticky nav ----------
$("#burger").onclick = () => $("#links").classList.toggle("open");
$$("#links a").forEach((a) => a.addEventListener("click", () => $("#links").classList.remove("open")));
window.addEventListener("scroll", () => $("#nav").classList.toggle("scrolled", window.scrollY > 40), { passive: true });

// ---------- car listings ----------
let typeF = "";
function renderCars() {
  const sort = $("#sort").value;
  const list = CARS.filter((c) => !typeF || c.type === typeF).sort((a, b) =>
    sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price :
    sort === "new" ? b.year - a.year : (b.featured === true) - (a.featured === true) || b.price - a.price);
  $("#carGrid").innerHTML = list.map((c) => `
    <article class="car" data-id="${c.id}" tabindex="0" aria-label="${carName(c)}, ${money(c.price)}">
      <div class="car-img">
        <img src="${img(c.images[0])}" alt="${carName(c)}" loading="lazy">
        <span class="badge">${c.condition}</span>
        ${c.featured ? '<span class="badge feat">Featured</span>' : ""}
        <span class="photos">📷 ${c.images.length}</span>
      </div>
      <div class="car-body">
        <h3>${carName(c)}</h3>
        <p class="price">${money(c.price)}</p>
        <ul class="chips">
          <li>${c.mileage}</li><li>${c.transmission}</li><li>${c.fuel}</li>${c.drive === "4×4" ? "<li>4×4</li>" : ""}
        </ul>
        <div class="car-actions">
          <button class="btn dark-btn" data-open="${c.id}">View details</button>
          <a class="btn wa icon" href="${waLink(`Hello AB Motors, is the ${carName(c)} (${money(c.price)}) still available?`)}" target="_blank" rel="noopener" aria-label="WhatsApp about ${carName(c)}">WhatsApp</a>
        </div>
      </div>
    </article>`).join("");
  $("#carEmpty").hidden = list.length > 0;
}
$("#typeFilter").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  typeF = b.dataset.type; $$("#typeFilter button").forEach((x) => x.classList.toggle("on", x === b)); renderCars();
});
$("#sort").addEventListener("change", renderCars);
$("#carGrid").addEventListener("click", (e) => {
  if (e.target.closest("a")) return;
  const card = e.target.closest(".car"); if (card) openCar(card.dataset.id);
});
$("#carGrid").addEventListener("keydown", (e) => {
  const card = e.target.closest(".car"); if (card && e.key === "Enter") openCar(card.dataset.id);
});

// ---------- car detail modal + gallery ----------
let cur = null, idx = 0;
function openCar(id, push = true) {
  cur = CARS.find((c) => c.id === id); if (!cur) return;
  idx = 0;
  $("#mTitle").textContent = carName(cur);
  $("#mPrice").textContent = money(cur.price);
  $("#mCond").textContent = cur.condition;
  $("#mDesc").textContent = cur.description;
  $("#mSpecs").innerHTML = [["Year", cur.year], ["Mileage", cur.mileage], ["Transmission", cur.transmission],
    ["Fuel", cur.fuel], ["Drive", cur.drive], ["Colour", cur.colour], ["Body type", cur.type], ["Location", BUSINESS.location]]
    .map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("");
  $("#mHigh").innerHTML = (cur.highlights || []).map((h) => `<li>${h}</li>`).join("");
  $("#mThumbs").innerHTML = cur.images.map((f, i) => `<button data-i="${i}" aria-label="Photo ${i + 1}"><img src="${img(f)}" alt="" loading="lazy"></button>`).join("");
  $("#mWa").href = waLink(`Hello AB Motors, I'm interested in the ${carName(cur)} listed at ${money(cur.price)}. Is it still available?`);
  $("#mInspect").href = waLink(`Hello AB Motors, I'd like to book an inspection / test drive for the ${carName(cur)} at Achimota. When is a good time?`);
  showImg();
  $("#modal").classList.add("open"); document.body.style.overflow = "hidden";
  if (push) history.replaceState(null, "", `#car=${cur.id}`);
}
function showImg() {
  $("#mImg").src = img(cur.images[idx]); $("#mImg").alt = `${carName(cur)} photo ${idx + 1}`;
  $("#mCount").textContent = `${idx + 1} / ${cur.images.length}`;
  $$("#mThumbs button").forEach((b, i) => b.classList.toggle("on", i === idx));
  const multi = cur.images.length > 1; $("#mPrev").hidden = $("#mNext").hidden = !multi;
}
const step = (d) => { idx = (idx + d + cur.images.length) % cur.images.length; showImg(); };
$("#mPrev").onclick = () => step(-1); $("#mNext").onclick = () => step(1);
$("#mThumbs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { idx = +b.dataset.i; showImg(); } });
function closeCar() { $("#modal").classList.remove("open"); document.body.style.overflow = ""; history.replaceState(null, "", location.pathname); }
$("#mClose").onclick = closeCar;
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeCar(); });
document.addEventListener("keydown", (e) => {
  if (!$("#modal").classList.contains("open")) return;
  if (e.key === "Escape") closeCar(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1);
});
// swipe on phones
let sx = null;
$("#mImg").addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
$("#mImg").addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); sx = null; });
$("#mShare").onclick = async () => {
  try { await navigator.clipboard.writeText(location.href); toast("Link copied. Share it on WhatsApp!"); }
  catch (e) { toast(location.href); }
};

// ---------- spare parts ----------
function renderParts() {
  if (!PARTS.length) {
    $("#partsArea").innerHTML = `
      <div class="soon card light">
        <div><h3>Spare parts catalogue coming soon</h3>
        <p class="muted">Need a part now? Tell us the part and your car model and we'll check availability and price for you.</p></div>
        <form id="partForm" class="part-form">
          <input name="part" required placeholder="Part (e.g. brake pads)">
          <input name="car" required placeholder="Car (e.g. Kia Morning 2016)">
          <button class="btn yellow" type="submit">Request on WhatsApp</button>
        </form>
      </div>`;
    $("#partForm").addEventListener("submit", (e) => {
      e.preventDefault(); const f = new FormData(e.target);
      window.open(waLink(`Hello AB Motors, I'm looking for a spare part.\nPart: ${f.get("part")}\nCar: ${f.get("car")}`), "_blank");
    });
    return;
  }
  $("#partsArea").innerHTML = `<div class="parts">${PARTS.map((p) => `
    <article class="part card light">
      ${p.image ? `<img src="${img(p.image)}" alt="${p.name}" loading="lazy">` : `<div class="part-ph">🔧</div>`}
      <div class="part-b"><h3>${p.name}</h3><p class="muted small">Fits: ${p.fits}</p>
      <p class="price sm">${money(p.price)} <span class="stock ${p.inStock ? "in" : "out"}">${p.inStock ? "In stock" : "On request"}</span></p>
      <a class="btn wa full sm" target="_blank" rel="noopener" href="${waLink(`Hello AB Motors, I'd like to order: ${p.name} (fits ${p.fits}) — ${money(p.price)}.`)}">Order on WhatsApp</a></div>
    </article>`).join("")}</div>`;
}

// ---------- forms ----------
$("#sellForm").addEventListener("submit", (e) => {
  e.preventDefault(); const f = new FormData(e.target);
  window.open(waLink(`Hello AB Motors, I want to SELL my car.\nCar: ${f.get("year")} ${f.get("make")} ${f.get("model")}\nMileage: ${f.get("mileage") || "-"}\nAsking price: ${f.get("price") ? money(f.get("price")) : "-"}\nName: ${f.get("name")}\n${f.get("notes")}`), "_blank");
});
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault(); const f = new FormData(e.target);
  window.open(waLink(`Hello AB Motors, my name is ${f.get("name")}.${f.get("car") ? `\nAbout: ${f.get("car")}` : ""}\n${f.get("msg")}`), "_blank");
});

// Docker container info (written by the container at start-up)
fetch("/info.json", { cache: "no-store" }).then((r) => r.json())
  .then((i) => ($("#served").textContent = `Served from Docker container ${i.hostname}`)).catch(() => {});

renderCars(); renderParts();
const m = location.hash.match(/^#car=(.+)$/); if (m) openCar(decodeURIComponent(m[1]), false);
