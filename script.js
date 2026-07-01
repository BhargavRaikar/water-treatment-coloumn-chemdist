/* ============================================================
   ZONE DATA  — Stage 01 is now Screening (external, before column)
   ============================================================ */
const ZONES = [
  {
    id: "screen",
    num: 1,
    title: "Coarse Bar Screen",
    short: "Removes large solids",
    eyebrow: "Stage 01 — Pre-Treatment",
    body: "Before water enters the column, it passes through an industrial coarse bar screen — a series of parallel steel bars spaced 6–25 mm apart. Large suspended solids such as leaves, twigs, plastic fragments, and rags are physically captured between the bars, protecting the distributor and all downstream packing media from clogging. Screened debris is periodically raked off by a mechanical cleaner.",
    specs: [
      ["Type", "Coarse bar screen"],
      ["Bar spacing", "6–25 mm (coarse)"],
      ["Location", "External, before column"],
      ["Mechanism", "Physical size exclusion"]
    ]
  },
  {
    id: "inlet",
    num: 2,
    title: "Inlet & Distributor",
    short: "Even distribution of water",
    eyebrow: "Stage 02 — Entry",
    body: "Pre-screened water enters the column at the top and passes through a perforated distributor plate. The distributor spreads the inflow evenly across the column's cross-section so every downstream zone gets uniform contact, instead of the water channeling down one side. Because large solids were removed upstream, the distributor holes stay clear.",
    specs: [
      ["Flow", "Top-down, gravity fed"],
      ["Function", "Even distribution"],
      ["Hardware", "Perforated plate"]
    ]
  },
  {
    id: "mtz",
    num: 3,
    title: "Mass Transfer Zone",
    short: "Ozone + wire-mesh packing",
    eyebrow: "Stage 03 — Oxidation",
    body: "Ozone gas is injected and diffuses through the water as it flows down through structural packing made of wire mesh. The mesh creates a huge surface area, so gas and liquid mix far more efficiently than they would in open water. Ozone oxidizes dissolved contaminants and breaks down organics into smaller, more biodegradable fragments.",
    specs: [
      ["Gas phase", "Ozone (O₃)"],
      ["Packing", "Structural wire mesh"],
      ["Mechanism", "Gas–liquid mass transfer"]
    ]
  },
  {
    id: "carbon",
    num: 4,
    title: "Activated Carbon Zone",
    short: "Rashing rings + biofilm",
    eyebrow: "Stage 04 — Adsorption",
    body: "Water moves through a random packed bed of Rashing rings coated with activated carbon and a thin microbial layer. The porous carbon adsorbs organic micropollutants and residual oxidants, while the microbial film biologically degrades what the carbon captures — combining physical adsorption with biological treatment in one pass.",
    specs: [
      ["Packing", "Rashing ring, random"],
      ["Coating", "Activated carbon + biofilm"],
      ["Mechanism", "Adsorption + biodegradation"]
    ]
  },
  {
    id: "resin",
    num: 5,
    title: "Ion Exchange Resin Zone",
    short: "Removes heavy metals",
    eyebrow: "Stage 05 — Ion Exchange",
    body: "Water percolates through ion exchange resin beads. Charged sites on the resin swap harmless ions for dissolved heavy metal ions in the water, pulling lead, cadmium, and similar contaminants out of solution. The resin bed is the column's main defense against dissolved metals.",
    specs: [
      ["Media", "Ion exchange resin beads"],
      ["Targets", "Heavy metal ions"],
      ["Mechanism", "Ion exchange"]
    ]
  },
  {
    id: "zeolite",
    num: 6,
    title: "Zeolite Contact Zone",
    short: "Random packing of zeolite",
    eyebrow: "Stage 06 — Polishing",
    body: "A random packed bed of natural zeolite granules gives the water a final polishing pass. Zeolite's microporous crystal structure traps remaining ammonium and trace ions, and helps clarify any fine particulate that survived the earlier zones, before water leaves the main column.",
    specs: [
      ["Media", "Zeolite granules, random"],
      ["Function", "Final polishing"],
      ["Targets", "Ammonium, trace ions"]
    ]
  },
  {
    id: "uv",
    num: 7,
    title: "UV Chamber (External)",
    short: "Eliminates microbial activity",
    eyebrow: "Stage 07 — Disinfection",
    body: "After leaving the main column, water is routed through an external UV chamber. Ultraviolet light at germicidal wavelengths damages the DNA of any remaining bacteria, viruses, and microorganisms, neutralizing them without adding any chemical disinfectant. This sits outside the column body, in its own sealed glass sleeve.",
    specs: [
      ["Location", "External to column"],
      ["Mechanism", "UV-C germicidal dose"],
      ["Targets", "Bacteria, viruses, microbes"]
    ]
  },
  {
    id: "outlet",
    num: 8,
    title: "Pure Water Outlet",
    short: "Safe drinking water",
    eyebrow: "Stage 08 — Output",
    body: "Water exiting the UV chamber has been screened, oxidized, adsorbed, ion-exchanged, polished, and disinfected. What comes out the outlet is clear, pathogen-free, and safe to drink.",
    specs: [
      ["Appearance", "Clear, colorless"],
      ["Microbial load", "Neutralized"],
      ["Status", "Potable"]
    ]
  }
];

const TOTAL_STEPS = ZONES.length; // 8

/* ============================================================
   STATE
   ============================================================ */
const state = {
  currentStep: 0,
  selectedZoneId: null,
  playing: false,
  speed: 1,
  timer: null
};

/* ============================================================
   BUILD THE SVG DIAGRAM
   The viewBox is 560 wide × 920 tall.
   Layout:
     - Bar Screen unit: top-left area, y=20..180
     - Pipe from screen to column inlet: angled right
     - Main column: x=110..370, y=190..730
     - Outlet pipe + UV chamber: below column, same as before
   ============================================================ */
const svgNS = "http://www.w3.org/2000/svg";

function buildColumnSVG(){
  const root = document.getElementById("column-root");
  const H = 960;

  root.innerHTML = `
  <svg viewBox="0 0 560 ${H}" xmlns="${svgNS}" role="img" aria-label="Cutaway diagram of water treatment mass transfer column with bar screen">
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
      <linearGradient id="gradScreenWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4FD1E8" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#2BAEC7" stop-opacity="0.3"/>
      </linearGradient>
      <radialGradient id="gradUVGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#D9A6FF" stop-opacity="0.9"/>
        <stop offset="60%" stop-color="#B968F0" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#B968F0" stop-opacity="0"/>
      </radialGradient>
      <clipPath id="clipColumn">
        <rect x="118" y="208" width="248" height="520" rx="6"/>
      </clipPath>
      <clipPath id="clipScreen">
        <rect x="14" y="30" width="90" height="140"/>
      </clipPath>
      <pattern id="meshPattern" width="14" height="14" patternUnits="userSpaceOnUse">
        <path d="M0 0L14 14M14 0L0 14" stroke="#BFD9E0" stroke-width="1" opacity="0.55"/>
      </pattern>
    </defs>

    <!-- ============================================================
         BAR SCREEN UNIT (external, top-left)
         Industrial coarse bar screen: a rectangular chamber with
         angled parallel bars, water inlet on the left, outlet on bottom
    ============================================================ -->
    <g id="screen-unit">

      <!-- Screen chamber housing -->
      <rect x="12" y="28" width="94" height="144" rx="6"
            fill="#0F2235" stroke="url(#gradShell)" stroke-width="2.5"/>
      <!-- Chamber inner wall -->
      <rect x="20" y="36" width="78" height="128" rx="3"
            fill="#091726" stroke="#1C3650" stroke-width="1"/>

      <!-- Water fill inside screen (revealed on screen step) -->
      <rect id="screen-water-fill" x="20" y="80" width="78" height="84"
            fill="url(#gradScreenWater)" opacity="0" rx="2"/>

      <!-- INDUSTRIAL BAR SCREEN — angled parallel bars inside chamber -->
      <!-- Frame for the screen rack -->
      <rect x="44" y="38" width="8" height="124" rx="2"
            fill="#3A5468" stroke="#5A7184" stroke-width="1"/>
      <rect x="66" y="38" width="8" height="124" rx="2"
            fill="#3A5468" stroke="#5A7184" stroke-width="1"/>
      <rect x="88" y="38" width="8" height="124" rx="2"
            fill="#3A5468" stroke="#5A7184" stroke-width="1"/>
      <!-- Cross-braces (horizontal) to make it look like a real rack -->
      <rect x="44" y="44" width="52" height="4" rx="1" fill="#2A4050" stroke="#5A7184" stroke-width="0.8"/>
      <rect x="44" y="104" width="52" height="4" rx="1" fill="#2A4050" stroke="#5A7184" stroke-width="0.8"/>
      <rect x="44" y="154" width="52" height="4" rx="1" fill="#2A4050" stroke="#5A7184" stroke-width="0.8"/>

      <!-- DEBRIS caught on bars (particles visible even before animation) -->
      <!-- Left bar debris -->
      <rect x="40" y="70" width="16" height="5" rx="2" fill="#7A6040" opacity="0.7"/>
      <rect x="41" y="84" width="12" height="4" rx="2" fill="#5C7040" opacity="0.6"/>
      <rect x="39" y="98" width="18" height="3" rx="1" fill="#6A5030" opacity="0.5"/>
      <!-- Middle bar debris -->
      <rect x="62" y="62" width="20" height="4" rx="2" fill="#7A6040" opacity="0.65"/>
      <rect x="64" y="78" width="14" height="5" rx="2" fill="#5C7040" opacity="0.6"/>
      <rect x="62" y="116" width="16" height="3" rx="1" fill="#6A5030" opacity="0.55"/>
      <!-- Right bar debris -->
      <rect x="84" y="75" width="16" height="4" rx="2" fill="#7A6040" opacity="0.7"/>
      <rect x="86" y="92" width="10" height="5" rx="2" fill="#5C7040" opacity="0.6"/>
      <!-- Animated debris particles group -->
      <g id="screen-debris-anim"></g>

      <!-- INLET pipe coming from the left into the screen -->
      <rect x="-8" y="76" width="30" height="14" rx="4"
            fill="url(#gradShell)" stroke="#1C3650" stroke-width="1.5"/>
      <!-- Inlet pipe label arrow -->
      <text x="-10" y="72" font-family="IBM Plex Mono, monospace" font-size="9"
            fill="#5A7184" text-anchor="start">Raw water in</text>

      <!-- OUTLET pipe from bottom of screen to pipe going right -->
      <rect x="43" y="164" width="32" height="14" rx="4"
            fill="url(#gradShell)" stroke="#1C3650" stroke-width="1.5"/>

      <!-- Mechanical rake arm (visual detail - shows automated cleaning) -->
      <g id="rake-arm">
        <rect x="43" y="52" width="52" height="3" rx="1.5"
              fill="#8AABB8" stroke="#5A7184" stroke-width="0.8"/>
        <rect x="43" y="52" width="3" height="20" rx="1"
              fill="#8AABB8" stroke="#5A7184" stroke-width="0.8"/>
        <rect x="92" y="52" width="3" height="20" rx="1"
              fill="#8AABB8" stroke="#5A7184" stroke-width="0.8"/>
      </g>

      <!-- LABEL: BAR SCREEN tag on the housing -->
      <rect x="12" y="12" width="94" height="16" rx="4" fill="#1C3650"/>
      <text x="59" y="24" font-family="IBM Plex Mono, monospace" font-size="9"
            fill="#4FD1E8" text-anchor="middle" font-weight="600">BAR SCREEN</text>

      <!-- Zone hit overlay -->
      <rect class="zone-outline" id="screen-outline" x="10" y="10" width="98" height="170" rx="8"/>

    </g>

    <!-- ============================================================
         CONNECTING PIPE: Screen outlet → Column top inlet
         Path: down from screen bottom (y=178) → right → up to column top
    ============================================================ -->
    <!-- Pipe body -->
    <path d="M59 178 L59 200 L210 200 L210 192"
          fill="none" stroke="url(#gradShell)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Pipe inner (dark) -->
    <path d="M59 178 L59 200 L210 200 L210 192"
          fill="none" stroke="#0B1929" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    <!-- Animated flow dot in connecting pipe -->
    <circle id="screen-pipe-dot" cx="59" cy="185" r="4" fill="#4FD1E8" opacity="0"/>

    <!-- ============================================================
         MAIN COLUMN (shifted down to y=190 to make room for screen)
    ============================================================ -->

    <!-- Top cap & inlet nozzle -->
    <g>
      <rect x="110" y="188" width="264" height="26" rx="5"
            fill="url(#gradShell)" stroke="#1C3650" stroke-width="1.5"/>
      <rect x="200" y="158" width="40" height="34" rx="4"
            fill="url(#gradShell)" stroke="#1C3650" stroke-width="1.5"/>
      <rect x="188" y="154" width="64" height="10" rx="3"
            fill="#5A7184" stroke="#1C3650"/>
    </g>

    <!-- Main shell -->
    <rect x="110" y="206" width="252" height="530" rx="8"
          fill="url(#gradShell)" stroke="#1C3650" stroke-width="2"/>
    <!-- Inner glass cutaway -->
    <rect x="118" y="212" width="236" height="518" rx="5"
          fill="#0B1929" stroke="#1C3650" stroke-width="1"/>

    <g clip-path="url(#clipColumn)">

      <!-- ZONE: Distributor -->
      <g id="zone-inlet-visual">
        <rect x="118" y="212" width="236" height="40" fill="url(#gradWater)"/>
        <line x1="126" y1="240" x2="346" y2="240"
              stroke="#7C97A8" stroke-width="3"/>
        <g id="distributor-drops"></g>
      </g>

      <!-- ZONE: Mass Transfer (wire mesh + ozone) -->
      <g id="zone-mtz-visual" transform="translate(0,252)">
        <rect x="118" y="0" width="236" height="120" fill="url(#meshPattern)" opacity="0.9"/>
        <rect x="118" y="0" width="236" height="120" fill="#142B40" opacity="0.35"/>
        <rect x="126" y="6" width="220" height="108"
              fill="none" stroke="#9FB6C2" stroke-width="1.4" opacity="0.6" rx="3"/>
        <g id="ozone-bubbles"></g>
      </g>

      <!-- ZONE: Activated Carbon -->
      <g id="zone-carbon-visual" transform="translate(0,372)">
        <rect x="118" y="0" width="236" height="110" fill="#0B1929"/>
        <g id="carbon-rings"></g>
      </g>

      <!-- ZONE: Ion Exchange Resin -->
      <g id="zone-resin-visual" transform="translate(0,482)">
        <rect x="118" y="0" width="236" height="100" fill="#0B1929"/>
        <g id="resin-beads"></g>
      </g>

      <!-- ZONE: Zeolite -->
      <g id="zone-zeolite-visual" transform="translate(0,582)">
        <rect x="118" y="0" width="236" height="100" fill="#0B1929"/>
        <g id="zeolite-granules"></g>
      </g>

      <!-- Bottom sump -->
      <g id="zone-sump-visual" transform="translate(0,682)">
        <rect x="118" y="0" width="236" height="44" fill="url(#gradWater)"/>
      </g>

      <!-- Water fill — height driven by JS -->
      <rect id="water-fill" x="118" y="212" width="236" height="0"
            fill="#4FD1E8" opacity="0.10"/>

    </g>

    <!-- Zone divider lines -->
    <g stroke="#1C3650" stroke-width="1.5" opacity="0.8">
      <line x1="110" y1="316" x2="362" y2="316"/>
      <line x1="110" y1="436" x2="362" y2="436"/>
      <line x1="110" y1="546" x2="362" y2="546"/>
      <line x1="110" y1="646" x2="362" y2="646"/>
    </g>

    <!-- Bottom cap -->
    <rect x="110" y="730" width="264" height="22" rx="5"
          fill="url(#gradShell)" stroke="#1C3650" stroke-width="1.5"/>

    <!-- ============================================================
         OUTLET PIPE → UV CHAMBER
    ============================================================ -->
    <path d="M240 752 L240 776 L148 776 L148 800"
          fill="none" stroke="url(#gradShell)" stroke-width="14" stroke-linecap="round"/>
    <path d="M240 752 L240 776 L148 776 L148 800"
          fill="none" stroke="#0B1929" stroke-width="9" stroke-linecap="round" opacity="0.6"/>
    <circle id="pipe-flow-dot1" cx="240" cy="758" r="4" fill="#4FD1E8" opacity="0"/>

    <!-- UV CHAMBER (external, bottom-left) -->
    <g id="uv-chamber-group" transform="translate(68,802)">
      <rect x="0" y="0" width="160" height="46" rx="23"
            fill="#1A1430" stroke="#1C3650" stroke-width="2"/>
      <rect x="14" y="8" width="132" height="30" rx="15"
            fill="#0B1929" stroke="#3A2D55" stroke-width="1"/>
      <ellipse id="uv-glow" cx="80" cy="23" rx="58" ry="11"
               fill="url(#gradUVGlow)" opacity="0.3"/>
      <line x1="20" y1="23" x2="140" y2="23"
            stroke="#D9A6FF" stroke-width="2" opacity="0.7"/>
      <circle cx="-2" cy="23" r="7" fill="#5A7184" stroke="#1C3650" stroke-width="1.5"/>
      <circle cx="162" cy="23" r="7" fill="#5A7184" stroke="#1C3650" stroke-width="1.5"/>
      <rect class="zone-outline" x="-6" y="-6" width="172" height="58" rx="26"/>
    </g>

    <!-- Pipe UV → outlet glass -->
    <path d="M228 825 L320 825 L320 842"
          fill="none" stroke="url(#gradShell)" stroke-width="14" stroke-linecap="round"/>
    <path d="M228 825 L320 825 L320 842"
          fill="none" stroke="#0B1929" stroke-width="9" stroke-linecap="round" opacity="0.6"/>
    <circle id="pipe-flow-dot2" cx="238" cy="825" r="4" fill="#4FD1E8" opacity="0"/>

    <!-- OUTLET GLASS -->
    <g transform="translate(292,842)">
      <path d="M0 0 L56 0 L50 64 Q28 72 6 64 Z"
            fill="#142B40" stroke="#3A5468" stroke-width="1.5"/>
      <path id="glass-water" d="M6 64 L50 64 L52 50 L4 50 Z"
            fill="#4FD1E8" opacity="0"/>
    </g>

    <!-- ============================================================
         ZONE HIT AREAS
    ============================================================ -->
    <g id="hitareas">
      <!-- Screen hit area -->
      <g class="zone-hit" data-zone="screen" tabindex="0" role="button"
         aria-label="Bar Screen, external pre-treatment">
        <rect class="zone-outline" x="10" y="10" width="98" height="170" rx="8"/>
      </g>
      <!-- Inlet / distributor -->
      <g class="zone-hit" data-zone="inlet" tabindex="0" role="button"
         aria-label="Inlet and Distributor zone">
        <rect class="zone-outline" x="112" y="208" width="248" height="46"/>
      </g>
      <!-- Mass Transfer Zone -->
      <g class="zone-hit" data-zone="mtz" tabindex="0" role="button"
         aria-label="Mass Transfer Zone">
        <rect class="zone-outline" x="112" y="254" width="248" height="120"/>
      </g>
      <!-- Activated Carbon -->
      <g class="zone-hit" data-zone="carbon" tabindex="0" role="button"
         aria-label="Activated Carbon Zone">
        <rect class="zone-outline" x="112" y="374" width="248" height="110"/>
      </g>
      <!-- Ion Exchange Resin -->
      <g class="zone-hit" data-zone="resin" tabindex="0" role="button"
         aria-label="Ion Exchange Resin Zone">
        <rect class="zone-outline" x="112" y="484" width="248" height="100"/>
      </g>
      <!-- Zeolite -->
      <g class="zone-hit" data-zone="zeolite" tabindex="0" role="button"
         aria-label="Zeolite Contact Zone">
        <rect class="zone-outline" x="112" y="584" width="248" height="100"/>
      </g>
      <!-- UV Chamber -->
      <g class="zone-hit" data-zone="uv" tabindex="0" role="button"
         aria-label="UV Chamber, external">
        <rect class="zone-outline" x="62" y="796" width="172" height="58" rx="26"/>
      </g>
      <!-- Outlet -->
      <g class="zone-hit" data-zone="outlet" tabindex="0" role="button"
         aria-label="Pure water outlet">
        <rect class="zone-outline" x="286" y="836" width="64" height="76" rx="6"/>
      </g>
    </g>

    <!-- ============================================================
         CALLOUT LABELS (right-side annotations)
    ============================================================ -->
    <g font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#A7B9C7">

      <!-- Screen label (left side, since screen is on the left) -->
      <g>
        <line x1="108" y1="100" x2="126" y2="100" stroke="#5A7184" stroke-width="1"/>
        <text x="130" y="96" fill="#E8A23D">Bar Screen</text>
        <text x="130" y="110" fill="#5A7184" font-size="9">Removes large solids</text>
        <text x="130" y="122" fill="#5A7184" font-size="9">before column entry</text>
      </g>

      <!-- Dirty water inlet -->
      <g>
        <line x1="362" y1="228" x2="384" y2="228" stroke="#5A7184" stroke-width="1"/>
        <text x="388" y="232">Dirty water inlet</text>
      </g>

      <!-- Mass Transfer Zone -->
      <g>
        <line x1="362" y1="310" x2="384" y2="310" stroke="#5A7184" stroke-width="1"/>
        <text x="388" y="308">Mass Transfer Zone</text>
        <text x="388" y="322" fill="#5A7184" font-size="9">Ozone + wire mesh</text>
      </g>

      <!-- Activated Carbon -->
      <g>
        <line x1="362" y1="430" x2="384" y2="430" stroke="#5A7184" stroke-width="1"/>
        <text x="388" y="428">Activated Carbon</text>
        <text x="388" y="442" fill="#5A7184" font-size="9">Rashing ring + biofilm</text>
      </g>

      <!-- Ion Exchange Resin -->
      <g>
        <line x1="362" y1="540" x2="384" y2="540" stroke="#5A7184" stroke-width="1"/>
        <text x="388" y="538">Ion Exchange Resin</text>
        <text x="388" y="552" fill="#5A7184" font-size="9">Removes heavy metals</text>
      </g>

      <!-- Zeolite -->
      <g>
        <line x1="362" y1="640" x2="384" y2="640" stroke="#5A7184" stroke-width="1"/>
        <text x="388" y="638">Zeolite Contact</text>
        <text x="388" y="652" fill="#5A7184" font-size="9">Random packing</text>
      </g>

      <!-- UV Chamber label -->
      <g>
        <line x1="228" y1="800" x2="228" y2="780" stroke="#5A7184" stroke-width="1"/>
        <text x="205" y="770" text-anchor="middle">UV Chamber (external)</text>
      </g>

      <!-- Outlet label -->
      <g>
        <text x="320" y="928" text-anchor="middle" fill="#4FD1E8" font-weight="600">Pure water outlet</text>
      </g>

    </g>

  </svg>
  `;

  // populate procedural visuals
  populateDrops();
  populateBubbles();
  populateCarbonRings();
  populateResinBeads();
  populateZeoliteGranules();
  populateScreenDebrisAnim();
}

function ns(tag){ return document.createElementNS(svgNS, tag); }

/* ---- Distributor drops ---- */
function populateDrops(){
  const g = document.getElementById("distributor-drops");
  const xs = [140, 170, 200, 230, 260, 290, 320];
  xs.forEach((x, i) => {
    const drop = ns("ellipse");
    drop.setAttribute("cx", x);
    drop.setAttribute("cy", 244);
    drop.setAttribute("rx", 2.4);
    drop.setAttribute("ry", 5);
    drop.setAttribute("fill", "#4FD1E8");
    drop.setAttribute("opacity", "0");
    drop.classList.add("anim-drop");
    drop.dataset.delay = (i * 0.18).toFixed(2);
    g.appendChild(drop);
  });
}

/* ---- Ozone bubbles ---- */
function populateBubbles(){
  const g = document.getElementById("ozone-bubbles");
  const cols = [134, 160, 188, 216, 244, 272, 300, 324];
  cols.forEach((x, i) => {
    for(let r = 0; r < 3; r++){
      const b = ns("circle");
      b.setAttribute("cx", x + (r % 2 === 0 ? 0 : 6));
      b.setAttribute("cy", 118);
      b.setAttribute("r", 2.6 + (r % 2));
      b.setAttribute("fill", "#9B7BE8");
      b.setAttribute("opacity", "0");
      b.classList.add("anim-bubble");
      b.dataset.delay = ((i * 0.13) + r * 0.3).toFixed(2);
      g.appendChild(b);
    }
  });
}

/* ---- Carbon Rashing rings ---- */
function populateCarbonRings(){
  const g = document.getElementById("carbon-rings");
  const positions = [
    [130,20],[162,16],[194,24],[226,18],[258,22],[290,16],[322,20],[340,28],
    [140,46],[172,50],[204,44],[236,52],[268,46],[300,50],[330,44],
    [126,78],[158,74],[190,80],[222,76],[254,82],[286,76],[318,80],[340,72],
    [138,100],[170,96],[202,102],[234,96],[266,102],[298,96],[328,100]
  ];
  positions.forEach(([x, y]) => {
    const ring = ns("circle");
    ring.setAttribute("cx", x); ring.setAttribute("cy", y); ring.setAttribute("r", 9);
    ring.setAttribute("fill", "#1C1F23"); ring.setAttribute("stroke", "#3A3F45");
    ring.setAttribute("stroke-width", "1.5");
    g.appendChild(ring);
    const hole = ns("circle");
    hole.setAttribute("cx", x); hole.setAttribute("cy", y); hole.setAttribute("r", 3.4);
    hole.setAttribute("fill", "#0B1929");
    g.appendChild(hole);
  });
}

/* ---- Ion exchange resin beads ---- */
function populateResinBeads(){
  const g = document.getElementById("resin-beads");
  const rows = 5, cols = 16;
  for(let r = 0; r < rows; r++){
    for(let c = 0; c < cols; c++){
      const x = 126 + c * 14.5 + (r % 2 === 0 ? 0 : 7);
      const y = 14 + r * 18;
      if(x > 342) continue;
      const bead = ns("circle");
      bead.setAttribute("cx", x); bead.setAttribute("cy", y); bead.setAttribute("r", 5.5);
      bead.setAttribute("fill", "#C89B5C"); bead.setAttribute("stroke", "#9E7642");
      bead.setAttribute("stroke-width", "0.8");
      g.appendChild(bead);
    }
  }
}

/* ---- Zeolite granules ---- */
function populateZeoliteGranules(){
  const g = document.getElementById("zeolite-granules");
  const rows = 5, cols = 18;
  for(let r = 0; r < rows; r++){
    for(let c = 0; c < cols; c++){
      const x = 122 + c * 13 + (r % 2 === 0 ? 0 : 6);
      const y = 12 + r * 18 + (Math.sin(c * 1.7) * 2);
      if(x > 346) continue;
      const grain = ns("polygon");
      const s = 4.5;
      const pts = [
        [x, y - s], [x + s * 0.8, y - s * 0.2], [x + s * 0.5, y + s * 0.7],
        [x - s * 0.5, y + s * 0.7], [x - s * 0.8, y - s * 0.2]
      ].map(p => p.join(",")).join(" ");
      grain.setAttribute("points", pts);
      grain.setAttribute("fill", "#8A9199"); grain.setAttribute("stroke", "#6B7177");
      grain.setAttribute("stroke-width", "0.6");
      g.appendChild(grain);
    }
  }
}

/* ---- Screen debris animation particles ---- */
function populateScreenDebrisAnim(){
  const g = document.getElementById("screen-debris-anim");
  // 6 particles that flow in from left and get stuck on bars
  const particles = [
    { x: 22, y: 58,  w: 10, h: 4, targetX: 41, delay: "0.0s",  color: "#7A5030" },
    { x: 22, y: 76,  w: 7,  h: 3, targetX: 62, delay: "0.25s", color: "#5C7030" },
    { x: 22, y: 92,  w: 12, h: 4, targetX: 41, delay: "0.5s",  color: "#6A4020" },
    { x: 22, y: 112, w: 8,  h: 3, targetX: 62, delay: "0.1s",  color: "#7A5030" },
    { x: 22, y: 130, w: 11, h: 4, targetX: 84, delay: "0.35s", color: "#5C6030" },
    { x: 22, y: 148, w: 6,  h: 3, targetX: 62, delay: "0.6s",  color: "#6A4020" },
  ];
  particles.forEach((p, i) => {
    const rect = ns("rect");
    rect.setAttribute("x", p.x);
    rect.setAttribute("y", p.y);
    rect.setAttribute("width", p.w);
    rect.setAttribute("height", p.h);
    rect.setAttribute("rx", "2");
    rect.setAttribute("fill", p.color);
    rect.setAttribute("opacity", "0");
    rect.classList.add("anim-debris");
    rect.dataset.delay = p.delay;
    g.appendChild(rect);
  });
}

/* ============================================================
   CSS KEYFRAMES — injected once
   ============================================================ */
const styleTag = document.createElement("style");
styleTag.textContent = `
  .anim-drop.is-falling{
    animation: dropFall calc(1.1s / var(--speed, 1)) ease-in infinite;
  }
  @keyframes dropFall{
    0%  { opacity:0; transform: translateY(0); }
    10% { opacity:1; }
    90% { opacity:1; }
    100%{ opacity:0; transform: translateY(20px); }
  }

  .anim-bubble.is-bubbling{
    animation: bubbleRise calc(1.8s / var(--speed,1)) ease-in infinite;
  }
  @keyframes bubbleRise{
    0%  { opacity:0; transform: translateY(0) scale(0.6); }
    15% { opacity:0.9; }
    85% { opacity:0.7; }
    100%{ opacity:0; transform: translateY(-115px) scale(1.1); }
  }

  #uv-glow.is-active{
    animation: uvPulse calc(1.4s / var(--speed,1)) ease-in-out infinite;
  }
  @keyframes uvPulse{
    0%, 100%{ opacity: 0.25; }
    50%     { opacity: 0.65; }
  }

  #pipe-flow-dot1.is-flowing,
  #pipe-flow-dot2.is-flowing,
  #screen-pipe-dot.is-flowing{
    animation: pipeFlow calc(1.2s / var(--speed,1)) linear infinite;
  }
  @keyframes pipeFlow{
    0%  { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100%{ opacity: 0; }
  }

  /* Rake arm sweeps down through the bars when screening is active */
  #rake-arm.is-raking{
    animation: rakeSweep calc(2.0s / var(--speed,1)) ease-in-out infinite;
    transform-origin: 50% 52px;
  }
  @keyframes rakeSweep{
    0%  { transform: translateY(0px); }
    40% { transform: translateY(90px); }
    55% { transform: translateY(90px); }
    100%{ transform: translateY(0px); }
  }

  /* Debris particles appear and move to screen bars */
  .anim-debris.is-screening{
    animation: debrisHit calc(1.6s / var(--speed,1)) ease-out infinite;
  }
  @keyframes debrisHit{
    0%  { opacity:0;   transform: translateX(0px); }
    20% { opacity:0.9; }
    60% { opacity:0.9; transform: translateX(22px); }
    80% { opacity:0.7; transform: translateX(22px); }
    100%{ opacity:0;   transform: translateX(22px); }
  }

  /* Screen water fill pulses gently */
  #screen-water-fill.is-active{
    animation: screenWaterPulse calc(2s / var(--speed,1)) ease-in-out infinite;
  }
  @keyframes screenWaterPulse{
    0%, 100%{ opacity: 0.7; }
    50%     { opacity: 1.0; }
  }
`;
document.head.appendChild(styleTag);

function setSpeedVar(){
  document.documentElement.style.setProperty("--speed", state.speed);
}

/* ============================================================
   APPLY VISUALS PER STEP
   ============================================================ */
function applyStepVisuals(stepIndex){
  const zone = ZONES[stepIndex];
  const waterFill  = document.getElementById("water-fill");
  const glass      = document.getElementById("glass-water");
  const uvGlow     = document.getElementById("uv-glow");
  const dot1       = document.getElementById("pipe-flow-dot1");
  const dot2       = document.getElementById("pipe-flow-dot2");
  const screenDot  = document.getElementById("screen-pipe-dot");
  const rakeArm    = document.getElementById("rake-arm");
  const screenWater= document.getElementById("screen-water-fill");

  // --- reset all transient states ---
  document.querySelectorAll(".anim-drop").forEach(d => d.classList.remove("is-falling"));
  document.querySelectorAll(".anim-bubble").forEach(b => b.classList.remove("is-bubbling"));
  document.querySelectorAll(".anim-debris").forEach(d => d.classList.remove("is-screening"));
  uvGlow.classList.remove("is-active");
  dot1.classList.remove("is-flowing");
  dot2.classList.remove("is-flowing");
  screenDot.classList.remove("is-flowing");
  rakeArm.classList.remove("is-raking");
  screenWater.classList.remove("is-active");
  screenWater.setAttribute("opacity", "0");
  glass.setAttribute("opacity", "0");

  // --- water fill height (column only) ---
  const fillTargets = {
    screen: 0, inlet: 40, mtz: 170, carbon: 290,
    resin: 400, zeolite: 500, uv: 520, outlet: 520
  };
  waterFill.setAttribute("height", fillTargets[zone.id] || 0);

  // --- zone-specific animations ---
  if(zone.id === "screen"){
    screenWater.setAttribute("opacity", "1");
    screenWater.classList.add("is-active");
    rakeArm.classList.add("is-raking");
    document.querySelectorAll(".anim-debris").forEach(d => d.classList.add("is-screening"));
    screenDot.classList.add("is-flowing");
  }
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

  // --- zone selection highlight ring ---
  document.querySelectorAll(".zone-hit").forEach(el => {
    el.classList.toggle("is-current", el.dataset.zone === zone.id);
  });
}

/* ============================================================
   STEP LIST (left panel)
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
    li.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); goToStep(i, true); }
    });
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
   INFO PANEL
   ============================================================ */
function showZoneInfo(zoneId){
  const zone = ZONES.find(z => z.id === zoneId);
  if(!zone) return;
  document.getElementById("info-eyebrow").textContent = zone.eyebrow;
  document.getElementById("info-title").textContent   = zone.title;
  document.getElementById("info-body").textContent    = zone.body;
  document.getElementById("info-specs").innerHTML = zone.specs.map(([k,v]) => `
    <div class="spec-row">
      <span class="spec-row__key">${k}</span>
      <span class="spec-row__val">${v}</span>
    </div>
  `).join("");
}

/* ============================================================
   BOTTOM STRIP + TOPBAR META
   ============================================================ */
function refreshStrip(){
  const zone = ZONES[state.currentStep];
  document.getElementById("bb-zone").textContent    = zone.title;
  document.getElementById("bb-outlet").textContent  = state.currentStep === TOTAL_STEPS - 1 ? "Pure drinking water" : "Pending";
  document.getElementById("meta-stage").textContent = `${state.currentStep + 1} / ${TOTAL_STEPS}`;
  document.getElementById("meta-status").textContent= state.playing ? "Running" : (state.currentStep === TOTAL_STEPS - 1 ? "Complete" : "Paused");
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
  if(state.currentStep === TOTAL_STEPS - 1) state.currentStep = 0;
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
  const delay = 2200 / state.speed;
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
    const ni = Math.min(state.currentStep + 1, TOTAL_STEPS - 1);
    state.selectedZoneId = ZONES[ni].id;
    goToStep(ni, true);
  });
  document.getElementById("btn-prev").addEventListener("click", () => {
    pause();
    const pi = Math.max(state.currentStep - 1, 0);
    state.selectedZoneId = ZONES[pi].id;
    goToStep(pi, true);
  });
  const slider  = document.getElementById("speed-slider");
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
    const idx    = ZONES.findIndex(z => z.id === zoneId);
    el.addEventListener("mouseenter", () => {
      if(!state.selectedZoneId) showZoneInfo(zoneId);
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
      state.selectedZoneId = zoneId;
    });
    el.addEventListener("keydown", e => {
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); el.click(); }
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
