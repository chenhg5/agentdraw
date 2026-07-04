import { mkdir, writeFile } from "node:fs/promises";

let seed = 1000;

const palettes = {
  "system-formal": {
    canvas: "#FFFFFF",
    ink: "#172033",
    panel: "#F7F9FC",
    accent: "#2563EB",
    accent2: "#D8E5FF",
    accent3: "#64748B",
  },
  boardroom: {
    canvas: "#FFFFFF",
    ink: "#182230",
    panel: "#F8FAFC",
    accent: "#4053D6",
    accent2: "#E7EEF8",
    accent3: "#667085",
  },
  "blueprint-formal": {
    canvas: "#F8FBFF",
    ink: "#163B68",
    panel: "#FFFFFF",
    accent: "#0B63CE",
    accent2: "#DBEAFE",
    accent3: "#5B708A",
  },
  "riso-brut": {
    canvas: "#EFE9D9",
    ink: "#1E1B16",
    panel: "#FFF8E8",
    accent: "#1F8A4C",
    accent2: "#F06CA8",
    accent3: "#E85A1F",
  },
  grove: {
    canvas: "#E8E4D6",
    ink: "#192B1B",
    panel: "#F4EFE2",
    accent: "#192B1B",
    accent2: "#C8524A",
    accent3: "#766C58",
  },
  "mint-brut": {
    canvas: "#D0FDE4",
    ink: "#000000",
    panel: "#FFFFFF",
    accent: "#F888C8",
    accent2: "#A7E7FF",
    accent3: "#6DD89E",
  },
  coral: {
    canvas: "#F5F0E8",
    ink: "#1A1A1A",
    panel: "#FFFFFF",
    accent: "#E85D5D",
    accent2: "#F4B1A3",
    accent3: "#6B5248",
  },
  "violet-marker": {
    canvas: "#FFFFFF",
    ink: "#171717",
    panel: "#F8F4FF",
    accent: "#C5A1FF",
    accent2: "#CFEE30",
    accent3: "#5E4A88",
  },
};

const examples = [
  {
    file: "examples/theme-agentdraw-os.agentdraw.json",
    title: "AgentDraw Operating System",
    styleId: "system-formal",
    subtitle: "A local diagram loop from agent intent to editable board output.",
    cards: [
      ["Intent", "prompt", "files"],
      ["Scene", "schema", "layout"],
      ["Replay", "browser", "motion"],
      ["Export", "json", "svg/png"],
    ],
    lanes: ["Capture", "Structure", "Review", "Ship"],
  },
  {
    file: "examples/theme-incident-command.agentdraw.json",
    title: "Incident Command Center",
    styleId: "boardroom",
    subtitle: "A clear escalation map for severity, owners, and recovery loops.",
    cards: [
      ["Detect", "alerts", "logs"],
      ["Triage", "impact", "owner"],
      ["Mitigate", "rollback", "patch"],
      ["Review", "timeline", "actions"],
    ],
    lanes: ["Signal", "Decision", "Response", "Learning"],
  },
  {
    file: "examples/theme-message-bus.agentdraw.json",
    title: "Multi-Agent Message Bus",
    styleId: "blueprint-formal",
    subtitle: "How specialist agents coordinate through a shared event backbone.",
    cards: [
      ["Planner", "goals", "routes"],
      ["Workers", "tools", "state"],
      ["Verifier", "checks", "diffs"],
      ["Memory", "events", "facts"],
    ],
    lanes: ["Plan", "Execute", "Validate", "Persist"],
  },
  {
    file: "examples/theme-launch-room.agentdraw.json",
    title: "Launch Room Loop",
    styleId: "riso-brut",
    subtitle: "An editorial growth board for campaign bets and learning cycles.",
    cards: [
      ["Audience", "pain", "segment"],
      ["Promise", "story", "offer"],
      ["Surface", "page", "asset"],
      ["Signal", "traffic", "reply"],
    ],
    lanes: ["Sense", "Frame", "Publish", "Learn"],
  },
  {
    file: "examples/theme-strategy-grove.agentdraw.json",
    title: "Quarterly Strategy Map",
    styleId: "grove",
    subtitle: "A restrained operating map for bets, constraints, and cadence.",
    cards: [
      ["North Star", "metric", "thesis"],
      ["Bets", "product", "market"],
      ["Systems", "data", "process"],
      ["Rituals", "review", "adjust"],
    ],
    lanes: ["Intent", "Focus", "Enable", "Govern"],
  },
  {
    file: "examples/theme-roadmap-mint.agentdraw.json",
    title: "Creator Tool Roadmap",
    styleId: "mint-brut",
    subtitle: "A playful product plan for shipping collaborative creation tools.",
    cards: [
      ["Now", "sketch", "replay"],
      ["Next", "comments", "share"],
      ["Later", "templates", "teams"],
      ["Scale", "agents", "gallery"],
    ],
    lanes: ["Explore", "Make", "Package", "Grow"],
  },
  {
    file: "examples/theme-customer-journey.agentdraw.json",
    title: "Customer Journey Signals",
    styleId: "coral",
    subtitle: "A warm journey board connecting user moments to product signals.",
    cards: [
      ["Discover", "source", "intent"],
      ["Activate", "aha", "setup"],
      ["Adopt", "habit", "value"],
      ["Expand", "invite", "upgrade"],
    ],
    lanes: ["Visit", "Start", "Return", "Grow"],
  },
  {
    file: "examples/theme-research-synthesis.agentdraw.json",
    title: "Research Synthesis Wall",
    styleId: "violet-marker",
    subtitle: "A bright synthesis board for clustering interviews into decisions.",
    cards: [
      ["Notes", "quotes", "tags"],
      ["Themes", "clusters", "tension"],
      ["Insights", "why", "so what"],
      ["Moves", "test", "decide"],
    ],
    lanes: ["Collect", "Cluster", "Interpret", "Act"],
  },
];

await mkdir("examples", { recursive: true });

for (const example of examples) {
  const scene = buildScene(example);
  await writeFile(example.file, `${JSON.stringify(scene, null, 2)}\n`, "utf8");
}

function buildScene(example) {
  const palette = palettes[example.styleId];
  const elements = [];

  elements.push(
    text("title", 72, 56, 780, 44, example.title, 34, palette.ink),
    text("subtitle", 74, 106, 860, 24, example.subtitle, 18, palette.accent3),
    rect("boundary", 44, 36, 1180, 650, "transparent", palette.accent3, 2),
  );

  const startX = 92;
  const gap = 42;
  const cardW = 238;
  const cardY = 224;

  example.cards.forEach((card, index) => {
    const x = startX + index * (cardW + gap);
    const fill = index % 2 === 0 ? palette.panel : palette.accent2;
    elements.push(
      rect(`lane-${index}`, x, 166, cardW, 34, palette.accent, palette.accent, 0),
      text(`lane-label-${index}`, x + 16, 174, cardW - 32, 18, example.lanes[index], 14, "#FFFFFF", "center"),
      rect(`card-${index}`, x, cardY, cardW, 156, fill, palette.ink, 2),
      text(`card-title-${index}`, x + 24, cardY + 28, cardW - 48, 30, card[0], 24, palette.ink, "center"),
      text(`card-a-${index}`, x + 32, cardY + 78, 76, 22, card[1], 16, palette.accent, "center"),
      text(`card-b-${index}`, x + cardW - 108, cardY + 78, 76, 22, card[2], 16, palette.accent3, "center"),
      rect(`chip-a-${index}`, x + 24, cardY + 70, 92, 38, "transparent", palette.accent, 2),
      rect(`chip-b-${index}`, x + cardW - 116, cardY + 70, 92, 38, "transparent", palette.accent3, 2),
    );
    if (index < example.cards.length - 1) {
      elements.push(arrow(`flow-${index}`, x + cardW + 8, cardY + 78, gap - 16, 0, palette.accent));
    }
  });

  elements.push(
    rect("signal-strip", 92, 454, 1080, 64, palette.panel, palette.ink, 2),
    text("signal-text", 124, 475, 1016, 24, "Editable scene data, styled shapes, layout validation, and browser refinement.", 18, palette.ink, "center"),
  );

  const metricY = 578;
  const metrics = ["Editable", "Validated", "Themeable"];
  metrics.forEach((metric, index) => {
    const x = 208 + index * 280;
    elements.push(
      rect(`metric-${index}`, x, metricY, 200, 46, index === 1 ? palette.accent2 : palette.panel, palette.ink, 2),
      text(`metric-text-${index}`, x + 20, metricY + 13, 160, 20, metric, 16, palette.ink, "center"),
    );
  });

  return {
    type: "agentdraw/scene",
    version: 1,
    id: `theme-${example.styleId}`,
    title: example.title,
    styleId: example.styleId,
    providerId: "excalidraw",
    updatedAt: new Date().toISOString(),
    elements,
    appState: {
      viewBackgroundColor: palette.canvas,
      currentItemStrokeColor: palette.ink,
      currentItemBackgroundColor: palette.panel,
      currentItemFillStyle: "solid",
      currentItemStrokeWidth: 2,
      currentItemStrokeStyle: "solid",
      currentItemRoughness: example.styleId === "mint-brut" ? 1 : 0,
      currentItemFontFamily: example.styleId === "mint-brut" ? 1 : 2,
      currentItemRoundness: example.styleId === "system-formal" || example.styleId === "grove" ? "sharp" : "round",
      currentItemArrowType: example.styleId === "system-formal" || example.styleId === "grove" ? "elbow" : "sharp",
      currentItemStartArrowhead: null,
      currentItemEndArrowhead: "arrow",
      scrollX: 80,
      scrollY: 28,
      zoom: { value: 0.78 },
    },
    files: {},
  };
}

function rect(id, x, y, width, height, backgroundColor, strokeColor, strokeWidth) {
  return base(id, "rectangle", x, y, width, height, {
    strokeColor,
    backgroundColor,
    fillStyle: "solid",
    strokeWidth,
    strokeStyle: "solid",
    roughness: 0,
    roundness: null,
  });
}

function text(id, x, y, width, height, value, fontSize, strokeColor, textAlign = "left") {
  return base(id, "text", x, y, width, height, {
    strokeColor,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    text: value,
    fontSize,
    fontFamily: 2,
    textAlign,
    verticalAlign: "top",
    containerId: null,
    originalText: value,
    lineHeight: 1.25,
  });
}

function arrow(id, x, y, width, height, strokeColor) {
  return base(id, "arrow", x, y, width, height, {
    strokeColor,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    points: [
      [0, 0],
      [width, height],
    ],
    lastCommittedPoint: null,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: "arrow",
    elbowed: false,
  });
}

function base(id, type, x, y, width, height, extra) {
  seed += 1;
  return {
    id,
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    seed,
    version: 1,
    versionNonce: seed + 1,
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false,
    ...extra,
  };
}
