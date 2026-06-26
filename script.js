/* ============================================================
   ZONE DATA
   ============================================================ */
const ZONES = [
  {
    id: "inlet",
    num: 1,
    title: "Inlet & Distributor",
    short: "Dirty water enters",
    eyebrow: "Stage 01 — Entry",
    body: "Raw, untreated water enters the column at the top and passes through a perforated distributor plate. The distributor spreads the inflow evenly across the column's cross-section so every downstream zone gets uniform contact, instead of the water channeling down one side.",
    specs: [
      ["Flow", "Top-down, gravity fed"],
      ["Function", "Even distribution"],
      ["Hardware", "Perforated plate"]
    ]
  },
  {
    id: "mtz",
    num: 2,
    title: "Mass Transfer Zone",
    short: "Ozone + wire-mesh packing",
    eyebrow: "Stage 02 — Oxidation",
    body: "Ozone gas is injected and diffuses through the water as it flows down through structural packing made of wire mesh. The mesh creates a huge surface area, so gas and liquid mix far more efficiently than they would in open water. Ozone oxidizes dissolved contaminants and breaks down organics into smaller, more biodegradable fragments.",
    specs: [
      ["Gas phase", "Ozone (O₃)"],
      ["Packing", "Structural wire mesh"],
      ["Mechanism", "Gas–liquid mass transfer"]
    ]
  },
  {
    id: "carbon",
    num: 3,
    title: "Activated Carbon Zone",
    short: "Rashing rings + biofilm",
    eyebrow: "Stage 03 — Adsorption",
    body: "Water moves through a random packed bed of Rashing rings coated with activated carbon and a thin microbial layer. The porous carbon adsorbs organic micropollutants and residual oxidants, while the microbial film biologically degrades what the carbon captures — combining physical adsorption with biological treatment in one pass.",
    specs: [
      ["Packing", "Rashing ring, random"],
      ["Coating", "Activated carbon + biofilm"],
      ["Mechanism", "Adsorption + biodegradation"]
    ]
  },
  {
    id: "resin",
    num: 4,
    title: "Ion Exchange Resin Zone",
    short: "Removes heavy metals",
    eyebrow: "Stage 04 — Ion Exchange",
    body: "Water percolates through ion exchange resin beads. Charged sites on the resin swap harmless ions for dissolved heavy metal ions in the water, pulling lead, cadmium, and similar contaminants out of solution. The resin bed is the column's main defense against dissolved metals.",
    specs: [
      ["Media", "Ion exchange resin beads"],
      ["Targets", "Heavy metal ions"],
      ["Mechanism", "Ion exchange"]
    ]
  },
  {
    id: "zeolite",
    num: 5,
    title: "Zeolite Contact Zone",
    short: "Random packing of zeolite",
    eyebrow: "Stage 05 — Polishing",
    body: "A random packed bed of natural zeolite granules gives the water a final polishing pass. Zeolite's microporous crystal structure traps remaining ammonium and trace ions, and helps clarify any fine particulate that survived the earlier zones, before water leaves the main column.",
    specs: [
      ["Media", "Zeolite granules, random"],
      ["Function", "Final polishing"],
      ["Targets", "Ammonium, trace ions"]
    ]
  },
  {
    id: "uv",
    num: 6,
    title: "UV Chamber (External)",
    short: "Eliminates microbial activity",
    eyebrow: "Stage 06 — Disinfection",
    body: "After leaving the main column, water is routed through an external UV chamber. Ultraviolet light at germicidal wavelengths damages the DNA of any remaining bacteria, viruses, and microorganisms, neutralizing them without adding any chemical disinfectant. This sits outside the column body, in its own sealed glass sleeve.",
    specs: [
      ["Location", "External to column"],
      ["Mechanism", "UV-C germicidal dose"],
      ["Targets", "Bacteria, viruses, microbes"]
    ]
  },
  {
    id: "outlet",
    num: 7,
    title: "Pure Water Outlet",
    short: "Safe drinking water",
    eyebrow: "Stage 07 — Output",
    body: "Water exiting the UV chamber has been oxidized, adsorbed, ion-exchanged, polished, and disinfected. What comes out the outlet is clear, pathogen-free, and safe to drink.",
    specs: [
      ["Appearance", "Clear, colorless"],
      ["Microbial load", "Neutralized"],
      ["Status", "Potable"]
    ]
  }
];

const TOTAL_STEPS = ZONES.length; // 7 (inlet through outlet)

/* ============================================================
   STATE
   ============================================================ */
const state = {
  currentStep: 0,       // index into ZONES, represents furthest progress
  selectedZoneId: null, // locked selection for info panel
  playing: false,
  speed: 1,
  timer: null,
  progressWithinStep: 0 // 0..1 visual progress for the active step's flow animation
};

/* ============================================================
   BUILD THE SVG COLUMN
   ============================================================ */
const svgNS = "http://www.w3.org/2000/svg";

function buildColumnSVG(){
  const root = document.getElementById("column-root");

  // viewBox layout constants
  const W = 420, H = 760;

  root.innerHTML = `
  <svg viewBox="0 0 480 ${H}" xmlns="${svgNS}" role="img" aria-label="Cutaway diagram of water treatment mass transfer column">
    <defs>
      <linearGradient id="gradShell" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#3A5468"/>
        <stop offset="12%" stop-color="#7C97A8"/>
        <stop offset="50%" stop-color="#41606F"/>
        <stop offset="88%" stop-color="#7C97A8"/>
        <stop offset="100%" stop-color="#2E4654"/>
      </linearGradient>
      <linearGradient id="gradWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4FD1E8" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#2BAEC7" stop-opacity="0.18"/>
      </linearGradient>
      <radialGradient id="gradUVGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#D9A6FF" stop-opacity="0.9"/>
        <stop offset="60%" stop-color="#B968F0" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#B968F0" stop-opacity="0"/>
      </radialGradient>
      <clipPath id="clipColumn">
        <rect x="86" y="60" width="248" height="520" rx="6"/>
      </clipPath>
      <pattern id="meshPattern" width="14" height="14" patternUnits="userSpaceOnUse">
        <path d="M0 0L14 14M14 0L0 14" stroke="#BFD9E0" stroke-width="1" opacity="0.55"/>
      </pattern>
    </defs>

    <!-- ============ TOP CAP & INLET ============ -->
    <g>
      <rect x="78" y="40" width="264" height="26" rx="5" fill="url(#gradShell)" stroke="#1C3650" stroke-width="1.5"/>
      <rect x="190" y="10" width="40" height="34" rx="4" fill="url(#gradShell)" stroke="#1C3650" stroke-width="1.5"/>
      <rect x="178" y="6" width="64" height="10" rx="3" fill="#5A7184" stroke="#1C3650"/>
    </g>

    <!-- ============ MAIN COLUMN SHELL ============ -->
    <rect x="84" y="58" width="252" height="526" rx="8" fill="url(#gradShell)" stroke="#1C3650" stroke-width="2"/>
    <!-- inner glass cutaway -->
    <rect x="92" y="64" width="236" height="514" rx="5" fill="#0B1929" stroke="#1C3650" stroke-width="1"/>

    <g clip-path="url(#clipColumn)">

      <!-- ===== ZONE 1: distributor + falling inlet water ===== -->
      <g id="zone-inlet-visual">
        <rect x="92" y="64" width="236" height="40" fill="url(#gradWater)"/>
        <line x1="100" y1="92" x2="320" y2="92" stroke="#7C97A8" stroke-width="3"/>
        <g id="distributor-drops"></g>
      </g>

      <!-- ===== ZONE 2: Mass Transfer Zone (wire mesh + ozone bubbles) ===== -->
      <g id="zone-mtz-visual" transform="translate(0,104)">
        <rect x="92" y="0" width="236" height="120" fill="url(#meshPattern)" opacity="0.9"/>
        <rect x="92" y="0" width="236" height="120" fill="#142B40" opacity="0.35"/>
        <!-- mesh ring struts -->
        <rect x="100" y="6" width="220" height="108" fill="none" stroke="#9FB6C2" stroke-width="1.4" opacity="0.6" rx="3"/>
        <g id="ozone-bubbles"></g>
      </g>

      <!-- ===== ZONE 3: Activated Carbon (rashing rings, dark spheres) ===== -->
      <g id="zone-carbon-visual" transform="translate(0,224)">
        <rect x="92" y="0" width="236" height="110" fill="#0B1929"/>
        <g id="carbon-rings"></g>
      </g>

      <!-- ===== ZONE 4: Ion Exchange Resin (tan beads) ===== -->
      <g id="zone-resin-visual" transform="translate(0,334)">
        <rect x="92" y="0" width="236" height="100" fill="#0B1929"/>
        <g id="resin-beads"></g>
      </g>

      <!-- ===== ZONE 5: Zeolite Contact (grey granules) ===== -->
      <g id="zone-zeolite-visual" transform="translate(0,434)">
        <rect x="92" y="0" width="236" height="100" fill="#0B1929"/>
        <g id="zeolite-granules"></g>
      </g>

      <!-- ===== Bottom sump before outlet pipe ===== -->
      <g id="zone-sump-visual" transform="translate(0,534)">
        <rect x="92" y="0" width="236" height="44" fill="url(#gradWater)"/>
      </g>

      <!-- flowing water column tint, height controlled by JS -->
      <rect id="water-fill" x="92" y="64" width="236" height="0" fill="#4FD1E8" opacity="0.10"/>

    </g>

    <!-- zone divider lines (visual separators on the shell) -->
    <g stroke="#1C3650" stroke-width="1.5" opacity="0.8">
      <line x1="84" y1="168" x2="336" y2="168"/>
      <line x1="84" y1="288" x2="336" y2="288"/>
      <line x1="84" y1="398" x2="336" y2="398"/>
      <line x1="84" y1="498" x2="336" y2="498"/>
    </g>

    <!-- ============ BOTTOM CAP ============ -->
    <rect x="78" y="578" width="264" height="22" rx="5" fill="url(#gradShell)" stroke="#1C3650" stroke-width="1.5"/>

    <!-- ============ OUTLET PIPE TO UV CHAMBER ============ -->
    <path d="M210 600 L210 624 L120 624 L120 648" fill="none" stroke="url(#gradShell)" stroke-width="14" stroke-linecap="round"/>
    <path d="M210 600 L210 624 L120 624 L120 648" fill="none" stroke="#1C3650" stroke-width="16" stroke-linecap="round" opacity="0.0"/>
    <circle id="pipe-flow-dot1" cx="210" cy="605" r="4" fill="#4FD1E8" opacity="0"/>

    <!-- ============ UV CHAMBER (external) ============ -->
    <g id="uv-chamber-group" transform="translate(40,650)">
      <rect x="0" y="0" width="160" height="46" rx="23" fill="#1A1430" stroke="#1C3650" stroke-width="2"/>
      <rect x="14" y="8" width="132" height="30" rx="15" fill="#0B1929" stroke="#3A2D55" stroke-width="1"/>
      <ellipse id="uv-glow" cx="80" cy="23" rx="58" ry="11" fill="url(#gradUVGlow)" opacity="0.3"/>
      <line x1="20" y1="23" x2="140" y2="23" stroke="#D9A6FF" stroke-width="2" opacity="0.7"/>
      <circle cx="-2" cy="23" r="7" fill="#5A7184" stroke="#1C3650" stroke-width="1.5"/>
      <circle cx="162" cy="23" r="7" fill="#5A7184" stroke="#1C3650" stroke-width="1.5"/>
      <!-- hit area + outline for click/hover -->
      <rect class="zone-outline" x="-6" y="-6" width="172" height="58" rx="26"/>
    </g>

    <!-- pipe from UV chamber to outlet -->
    <path d="M160 673 L260 673 L260 690" fill="none" stroke="url(#gradShell)" stroke-width="14" stroke-linecap="round"/>
    <circle id="pipe-flow-dot2" cx="170" cy="673" r="4" fill="#4FD1E8" opacity="0"/>

    <!-- ============ OUTLET GLASS ============ -->
    <g transform="translate(232,690)">
      <path d="M0 0 L56 0 L50 64 Q28 72 6 64 Z" fill="#142B40" stroke="#3A5468" stroke-width="1.5"/>
      <path id="glass-water" d="M6 64 L50 64 L52 50 L4 50 Z" fill="#4FD1E8" opacity="0"/>
    </g>

    <!-- ============ ZONE HIT AREAS (transparent, for click/hover) ============ -->
    <g id="hitareas">
      <g class="zone-hit" data-zone="inlet" tabindex="0" role="button" aria-label="Inlet and Distributor zone">
        <rect class="zone-outline" x="86" y="60" width="248" height="44"/>
      </g>
      <g class="zone-hit" data-zone="mtz" tabindex="0" role="button" aria-label="Mass Transfer Zone">
        <rect class="zone-outline" x="86" y="106" width="248" height="120"/>
      </g>
      <g class="zone-hit" data-zone="carbon" tabindex="0" role="button" aria-label="Activated Carbon Zone">
        <rect class="zone-outline" x="86" y="226" width="248" height="110"/>
      </g>
      <g class="zone-hit" data-zone="resin" tabindex="0" role="button" aria-label="Ion Exchange Resin Zone">
        <rect class="zone-outline" x="86" y="336" width="248" height="100"/>
      </g>
      <g class="zone-hit" data-zone="zeolite" tabindex="0" role="button" aria-label="Zeolite Contact Zone">
        <rect class="zone-outline" x="86" y="436" width="248" height="100"/>
      </g>
      <g class="zone-hit" data-zone="uv" tabindex="0" role="button" aria-label="UV Chamber, external">
        <rect class="zone-outline" x="34" y="644" width="172" height="58" rx="26"/>
      </g>
      <g class="zone-hit" data-zone="outlet" tabindex="0" role="button" aria-label="Pure water outlet">
        <rect class="zone-outline" x="226" y="684" width="64" height="76" rx="6"/>
      </g>
    </g>

    <!-- ============ CALLOUT LABELS ============ -->
    <g font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#A7B9C7">
      <g>
        <line x1="336" y1="80" x2="358" y2="80" stroke="#5A7184" stroke-width="1"/>
        <text x="362" y="84">Dirty water inlet</text>
      </g>
      <g>
        <line x1="336" y1="160" x2="358" y2="160" stroke="#5A7184" stroke-width="1"/>
        <text x="362" y="158">Mass Transfer Zone</text>
        <text x="362" y="172" fill="#5A7184" font-size="9">Ozone + wire mesh</text>
      </g>
      <g>
        <line x1="336" y1="280" x2="358" y2="280" stroke="#5A7184" stroke-width="1"/>
        <text x="362" y="278">Activated Carbon</text>
        <text x="362" y="292" fill="#5A7184" font-size="9">Rashing ring + biofilm</text>
      </g>
      <g>
        <line x1="336" y1="390" x2="358" y2="390" stroke="#5A7184" stroke-width="1"/>
        <text x="362" y="388">Ion Exchange Resin</text>
        <text x="362" y="402" fill="#5A7184" font-size="9">Removes heavy metals</text>
      </g>
      <g>
        <line x1="336" y1="490" x2="358" y2="490" stroke="#5A7184" stroke-width="1"/>
        <text x="362" y="488">Zeolite Contact</text>
        <text x="362" y="502" fill="#5A7184" font-size="9">Random packing</text>
      </g>
      <g>
        <line x1="206" y1="648" x2="206" y2="628" stroke="#5A7184" stroke-width="1"/>
        <text x="178" y="618" text-anchor="middle">UV Chamber (external)</text>
      </g>
      <g>
        <text x="258" y="780" text-anchor="middle" fill="#4FD1E8" font-weight="600">Pure water outlet</text>
      </g>
    </g>

  </svg>
  `;

  // populate repeated procedural visuals
  populateDrops();
  populateBubbles();
  populateCarbonRings();
  populateResinBeads();
  populateZeoliteGranules();
}

function ns(tag){ return document.createElementNS(svgNS, tag); }

function populateDrops(){
  const g = document.getElementById("distributor-drops");
  const xs = [115, 145, 175, 205, 235, 265, 295];
  xs.forEach((x, i) => {
    const drop = ns("ellipse");
    drop.setAttribute("cx", x);
    drop.setAttribute("cy", 96);
    drop.setAttribute("rx", 2.4);
    drop.setAttribute("ry", 5);
    drop.setAttribute("fill", "#4FD1E8");
    drop.setAttribute("opacity", "0");
    drop.classList.add("anim-drop");
    drop.dataset.delay = (i * 0.18).toFixed(2);
    g.appendChild(drop);
  });
}

function populateBubbles(){
  const g = document.getElementById("ozone-bubbles");
  const cols = [110, 140, 170, 200, 230, 260, 290, 310];
  cols.forEach((x, i) => {
    for(let r=0;r<3;r++){
      const b = ns("circle");
      b.setAttribute("cx", x + (r%2===0? 0: 6));
      b.setAttribute("cy", 118 - r*0);
      b.setAttribute("r", 2.6 + (r%2));
      b.setAttribute("fill", "#9B7BE8");
      b.setAttribute("opacity", "0");
      b.classList.add("anim-bubble");
      b.dataset.delay = ((i*0.13) + r*0.3).toFixed(2);
      b.dataset.col = x;
      g.appendChild(b);
    }
  });
}

function populateCarbonRings(){
  const g = document.getElementById("carbon-rings");
  // random-ish packed circles (rashing rings as dark rings with carbon dot)
  const positions = [
    [108,20],[140,16],[172,24],[204,18],[236,22],[268,16],[300,20],[316,28],
    [120,46],[152,50],[184,44],[216,52],[248,46],[280,50],[308,44],
    [104,78],[136,74],[168,80],[200,76],[232,82],[264,76],[296,80],[316,72],
    [118,100],[150,96],[182,102],[214,96],[246,102],[278,96],[306,100]
  ];
  positions.forEach(([x,y]) => {
    const ring = ns("circle");
    ring.setAttribute("cx", x); ring.setAttribute("cy", y); ring.setAttribute("r", 9);
    ring.setAttribute("fill", "#1C1F23");
    ring.setAttribute("stroke", "#3A3F45");
    ring.setAttribute("stroke-width", "1.5");
    g.appendChild(ring);
    const hole = ns("circle");
    hole.setAttribute("cx", x); hole.setAttribute("cy", y); hole.setAttribute("r", 3.4);
    hole.setAttribute("fill", "#0B1929");
    g.appendChild(hole);
  });
}

function populateResinBeads(){
  const g = document.getElementById("resin-beads");
  const rows = 5, cols = 16;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const x = 100 + c*14.5 + (r%2===0?0:7);
      const y = 14 + r*18;
      if(x > 314) continue;
      const bead = ns("circle");
      bead.setAttribute("cx", x); bead.setAttribute("cy", y); bead.setAttribute("r", 5.5);
      bead.setAttribute("fill", "#C89B5C");
      bead.setAttribute("stroke", "#9E7642");
      bead.setAttribute("stroke-width", "0.8");
      g.appendChild(bead);
    }
  }
}

function populateZeoliteGranules(){
  const g = document.getElementById("zeolite-granules");
  const rows = 5, cols = 18;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const x = 96 + c*13 + (r%2===0?0:6);
      const y = 12 + r*18 + (Math.sin(c*1.7)*2);
      if(x > 320) continue;
      const grain = ns("polygon");
      const s = 4.5;
      const pts = [
        [x, y-s],[x+s*0.8, y-s*0.2],[x+s*0.5, y+s*0.7],[x-s*0.5, y+s*0.7],[x-s*0.8, y-s*0.2]
      ].map(p=>p.join(",")).join(" ");
      grain.setAttribute("points", pts);
      grain.setAttribute("fill", "#8A9199");
      grain.setAttribute("stroke", "#6B7177");
      grain.setAttribute("stroke-width", "0.6");
      g.appendChild(grain);
    }
  }
}

/* ============================================================
   ANIMATION HELPERS — CSS-in-JS keyframes injected once
   ============================================================ */
const styleTag = document.createElement("style");
styleTag.textContent = `
  .anim-drop.is-falling{ animation: dropFall calc(1.1s / var(--speed, 1)) ease-in infinite; }
  @keyframes dropFall{
    0%{ opacity:0; transform: translateY(0); }
    10%{ opacity:1; }
    90%{ opacity:1; }
    100%{ opacity:0; transform: translateY(18px); }
  }
  .anim-bubble.is-bubbling{ animation: bubbleRise calc(1.8s / var(--speed,1)) ease-in infinite; }
  @keyframes bubbleRise{
    0%{ opacity:0; transform: translateY(0) scale(0.6); }
    15%{ opacity:0.9; }
    85%{ opacity:0.7; }
    100%{ opacity:0; transform: translateY(-115px) scale(1.1); }
  }
  #uv-glow.is-active{ animation: uvPulse calc(1.4s / var(--speed,1)) ease-in-out infinite; }
  @keyframes uvPulse{
    0%, 100%{ opacity: 0.25; }
    50%{ opacity: 0.65; }
  }
  #pipe-flow-dot1.is-flowing, #pipe-flow-dot2.is-flowing{ animation: pipeFlow calc(1.2s / var(--speed,1)) linear infinite; }
  @keyframes pipeFlow{
    0%{ opacity: 0; }
    20%{ opacity: 1; }
    80%{ opacity: 1; }
    100%{ opacity: 0; }
  }
`;
document.head.appendChild(styleTag);

function setSpeedVar(){
  document.documentElement.style.setProperty("--speed", state.speed);
}

/* ============================================================
   ZONE VISIBILITY / WATER FILL LOGIC
   ============================================================ */
// Each step reveals water progressively further down the column,
// and activates the animation specific to that zone.
const ZONE_DEPTHS = {
  inlet: 40,
  mtz: 160,
  carbon: 280,
  resin: 390,
  zeolite: 490,
  uv: 0,      // handled separately (external)
  outlet: 0   // handled separately (glass fill)
};

function applyStepVisuals(stepIndex){
  const zone = ZONES[stepIndex];
  const waterFill = document.getElementById("water-fill");
  const glass = document.getElementById("glass-water");
  const uvGlow = document.getElementById("uv-glow");
  const dot1 = document.getElementById("pipe-flow-dot1");
  const dot2 = document.getElementById("pipe-flow-dot2");

  // reset transient animations
  document.querySelectorAll(".anim-drop").forEach(d => d.classList.remove("is-falling"));
  document.querySelectorAll(".anim-bubble").forEach(b => b.classList.remove("is-bubbling"));
  uvGlow.classList.remove("is-active");
  dot1.classList.remove("is-flowing");
  dot2.classList.remove("is-flowing");
  glass.setAttribute("opacity", "0");

  // water fill height climbs with progress through the column zones
  const fillTargets = { inlet: 40, mtz: 168, carbon: 288, resin: 398, zeolite: 498, uv: 520, outlet: 520 };
  const fillH = fillTargets[zone.id] || 0;
  waterFill.setAttribute("height", fillH);

  if(zone.id === "inlet"){
    document.querySelectorAll(".anim-drop").forEach(d => d.classList.add("is-falling"));
  }
  if(zone.id === "mtz"){
    document.querySelectorAll(".anim-bubble").forEach(b => b.classList.add("is-bubbling"));
  }
  if(zone.id === "uv"){
    uvGlow.classList.add("is-active");
    dot1.classList.add("is-flowing");
  }
  if(zone.id === "outlet"){
    dot2.classList.add("is-flowing");
    glass.setAttribute("opacity", "0.85");
  }

  // current-zone highlight ring
  document.querySelectorAll(".zone-hit").forEach(el => {
    el.classList.toggle("is-current", el.dataset.zone === zone.id);
  });
}

/* ============================================================
   UI: STEP LIST
   ============================================================ */
function buildStepList(){
  const list = document.getElementById("steplist");
  list.innerHTML = "";
  ZONES.forEach((z, i) => {
    const li = document.createElement("li");
    li.className = "step";
    li.dataset.index = i;
    li.dataset.zone = z.id;
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.innerHTML = `
      <span class="step__num">${z.num}</span>
      <span class="step__text">
        <span class="step__title">${z.title}</span>
        <span class="step__sub">${z.short}</span>
      </span>
    `;
    li.addEventListener("click", () => goToStep(i, true));
    li.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); goToStep(i, true); } });
    list.appendChild(li);
  });
}

function refreshStepListUI(){
  document.querySelectorAll(".step").forEach(li => {
    const i = parseInt(li.dataset.index, 10);
    li.classList.toggle("is-active", i === state.currentStep);
    li.classList.toggle("is-done", i < state.currentStep);
  });
}

/* ============================================================
   UI: INFO PANEL
   ============================================================ */
function showZoneInfo(zoneId){
  const zone = ZONES.find(z => z.id === zoneId);
  if(!zone) return;
  document.getElementById("info-eyebrow").textContent = zone.eyebrow;
  document.getElementById("info-title").textContent = zone.title;
  document.getElementById("info-body").textContent = zone.body;
  const specsEl = document.getElementById("info-specs");
  specsEl.innerHTML = zone.specs.map(([k,v]) => `
    <div class="spec-row"><span class="spec-row__key">${k}</span><span class="spec-row__val">${v}</span></div>
  `).join("");
}

/* ============================================================
   UI: BOTTOM STRIP + TOPBAR META
   ============================================================ */
function refreshStrip(){
  const zone = ZONES[state.currentStep];
  document.getElementById("bb-zone").textContent = zone.title;
  document.getElementById("bb-outlet").textContent = state.currentStep === TOTAL_STEPS - 1 ? "Pure drinking water" : "Pending";
  document.getElementById("meta-stage").textContent = `${state.currentStep + 1} / ${TOTAL_STEPS}`;
  document.getElementById("meta-status").textContent = state.playing ? "Running" : (state.currentStep === TOTAL_STEPS-1 ? "Complete" : "Paused");
}

/* ============================================================
   NAVIGATION / PLAYBACK
   ============================================================ */
function goToStep(index, userInitiated){
  index = Math.max(0, Math.min(TOTAL_STEPS - 1, index));
  state.currentStep = index;
  applyStepVisuals(index);
  refreshStepListUI();
  refreshStrip();
  if(userInitiated){
    state.selectedZoneId = ZONES[index].id;
    showZoneInfo(ZONES[index].id);
    highlightSelectedZone(ZONES[index].id);
  } else if(!state.selectedZoneId){
    // during autoplay, keep info panel synced to current zone unless user has locked a different one
    showZoneInfo(ZONES[index].id);
  }
  updateNavButtons();
}

function highlightSelectedZone(zoneId){
  document.querySelectorAll(".zone-hit").forEach(el => {
    el.classList.toggle("is-selected", el.dataset.zone === zoneId);
  });
}

function updateNavButtons(){
  document.getElementById("btn-prev").disabled = state.currentStep === 0;
  document.getElementById("btn-next").disabled = state.currentStep === TOTAL_STEPS - 1;
}

function play(){
  if(state.playing) return;
  if(state.currentStep === TOTAL_STEPS - 1) state.currentStep = 0; // restart loop if at end
  state.playing = true;
  refreshStrip();
  tick();
}

function tick(){
  applyStepVisuals(state.currentStep);
  refreshStepListUI();
  refreshStrip();
  if(!state.selectedZoneId){
    showZoneInfo(ZONES[state.currentStep].id);
    highlightSelectedZone(ZONES[state.currentStep].id);
  }
  updateNavButtons();

  clearTimeout(state.timer);
  if(!state.playing) return;
  if(state.currentStep >= TOTAL_STEPS - 1){
    state.playing = false;
    refreshStrip();
    return;
  }
  const baseDelay = 2200; // ms per step at speed 1
  const delay = baseDelay / state.speed;
  state.timer = setTimeout(() => {
    if(!state.playing) return;
    state.currentStep++;
    tick();
  }, delay);
}

function pause(){
  state.playing = false;
  clearTimeout(state.timer);
  refreshStrip();
}

function restart(){
  pause();
  state.selectedZoneId = null;
  goToStep(0, false);
}

/* ============================================================
   EVENT WIRING
   ============================================================ */
function wireControls(){
  document.getElementById("btn-play").addEventListener("click", play);
  document.getElementById("btn-pause").addEventListener("click", pause);
  document.getElementById("btn-restart").addEventListener("click", restart);
  document.getElementById("btn-next").addEventListener("click", () => {
    pause();
    state.selectedZoneId = ZONES[Math.min(state.currentStep+1, TOTAL_STEPS-1)].id;
    goToStep(state.currentStep + 1, true);
  });
  document.getElementById("btn-prev").addEventListener("click", () => {
    pause();
    state.selectedZoneId = ZONES[Math.max(state.currentStep-1, 0)].id;
    goToStep(state.currentStep - 1, true);
  });

  const slider = document.getElementById("speed-slider");
  const readout = document.getElementById("speed-readout");
  slider.addEventListener("input", () => {
    state.speed = parseFloat(slider.value);
    readout.textContent = state.speed.toFixed(1) + "×";
    setSpeedVar();
  });
}

function wireZoneHitAreas(){
  document.querySelectorAll(".zone-hit").forEach(el => {
    const zoneId = el.dataset.zone;
    const idx = ZONES.findIndex(z => z.id === zoneId);

    el.addEventListener("mouseenter", () => {
      if(!state.selectedZoneId) showZoneInfo(zoneId); // quick preview only if nothing locked
    });
    el.addEventListener("mouseleave", () => {
      if(!state.selectedZoneId) showZoneInfo(ZONES[state.currentStep].id);
    });
    el.addEventListener("click", () => {
      state.selectedZoneId = zoneId;
      showZoneInfo(zoneId);
      highlightSelectedZone(zoneId);
      pause();
      goToStep(idx, false);
      // keep the lock after goToStep (goToStep with userInitiated=false won't clear it)
      state.selectedZoneId = zoneId;
    });
    el.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        el.click();
      }
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
function init(){
  buildColumnSVG();
  buildStepList();
  wireControls();
  wireZoneHitAreas();
  setSpeedVar();
  goToStep(0, false);
  refreshStepListUI();
  refreshStrip();
  updateNavButtons();
}

document.addEventListener("DOMContentLoaded", init);
