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
  "runtime-doc": {
    canvas: "#FBFAF7",
    ink: "#202124",
    panel: "#FFFFFF",
    accent: "#275CAD",
    accent2: "#F4F1EA",
    accent3: "#626A73",
  },
  "slate-notes": {
    canvas: "#FFFFFF",
    ink: "#334155",
    panel: "#F8FAFC",
    accent: "#6B8CAE",
    accent2: "#E2E8F0",
    accent3: "#64748B",
  },
  "manual-cream": {
    canvas: "#EDE8DC",
    ink: "#2C2416",
    panel: "#F5F1E8",
    accent: "#B85C38",
    accent2: "#E8DCC8",
    accent3: "#5A4A38",
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
  "archive-shelf": {
    canvas: "#F6EBD8",
    ink: "#2A231C",
    panel: "#FFF7EA",
    accent: "#DE916A",
    accent2: "#D6C7CC",
    accent3: "#6C5C4B",
  },
  inkline: {
    canvas: "#FAFADF",
    ink: "#1A1A16",
    panel: "#FFFFFF",
    accent: "#5E5E54",
    accent2: "#E7E7C8",
    accent3: "#3D3D36",
  },
  "espresso-paper": {
    canvas: "#EDE7DD",
    ink: "#25211B",
    panel: "#F8F3EA",
    accent: "#6E6558",
    accent2: "#D2C6B7",
    accent3: "#403B32",
  },
  "long-table": {
    canvas: "#FAF1E2",
    ink: "#B53D2A",
    panel: "#FFF8EE",
    accent: "#B53D2A",
    accent2: "#E8C4AF",
    accent3: "#5B3A2E",
  },
  "incident-dark": {
    canvas: "#0D1117",
    ink: "#E6EDF3",
    panel: "#161B22",
    accent: "#58A6FF",
    accent2: "#1C2330",
    accent3: "#9AA7B4",
  },
  "soft-pop": {
    canvas: "#EFF1F5",
    ink: "#2D3748",
    panel: "#FFFFFF",
    accent: "#73D1C8",
    accent2: "#FCD34D",
    accent3: "#5D6D7E",
  },
  "neon-grid": {
    canvas: "#051423",
    ink: "#D9FBFF",
    panel: "#071B2C",
    accent: "#00F2FF",
    accent2: "#FF4FD8",
    accent3: "#235064",
  },
  "raw-grid": {
    canvas: "#FFFFFF",
    ink: "#0A0A0A",
    panel: "#F8F8F8",
    accent: "#0A0A0A",
    accent2: "#F2D4CF",
    accent3: "#5B5B5B",
  },
  "bold-poster": {
    canvas: "#FFFFFF",
    ink: "#1C1410",
    panel: "#FFF1EF",
    accent: "#D8000F",
    accent2: "#F4C7C1",
    accent3: "#5A2A23",
  },
  "soft-editorial": {
    canvas: "#ECE9DC",
    ink: "#202018",
    panel: "#FFFFFF",
    accent: "#E2A8CE",
    accent2: "#C9DA4F",
    accent3: "#8A786A",
  },
  "block-frame": {
    canvas: "#FFFDF5",
    ink: "#000000",
    panel: "#FFFFFF",
    accent: "#FE90E8",
    accent2: "#C0F7FE",
    accent3: "#FCC715",
  },
  "pin-and-paper": {
    canvas: "#FFFFFF",
    ink: "#161616",
    panel: "#FFFBE1",
    accent: "#2A3C99",
    accent2: "#F1E84E",
    accent3: "#576196",
  },
  "hatch-whiteboard": {
    canvas: "#FFFFFF",
    ink: "#111111",
    panel: "#FAFAF5",
    accent: "#9EDAE5",
    accent2: "#F6D7DE",
    accent3: "#5A5A5A",
  },
  "crayon-stack": {
    canvas: "#FFFFFF",
    ink: "#151515",
    panel: "#FFF3EC",
    accent: "#FF472B",
    accent2: "#D3FE79",
    accent3: "#2F65FF",
  },
};

const examples = [
  ["examples/theme-agentdraw-os.agentdraw.json", buildAgentDrawOs],
  ["examples/theme-incident-command.agentdraw.json", buildIncidentCommand],
  ["examples/theme-message-bus.agentdraw.json", buildMessageBus],
  ["examples/theme-plugin-runtime.agentdraw.json", buildPluginRuntime],
  ["examples/theme-spec-notes.agentdraw.json", buildSpecNotes],
  ["examples/theme-runbook-manual.agentdraw.json", buildRunbookManual],
  ["examples/theme-launch-room.agentdraw.json", buildLaunchRoom],
  ["examples/theme-strategy-grove.agentdraw.json", buildStrategyGrove],
  ["examples/theme-roadmap-mint.agentdraw.json", buildRoadmapMint],
  ["examples/theme-customer-journey.agentdraw.json", buildCustomerJourney],
  ["examples/theme-research-synthesis.agentdraw.json", buildResearchSynthesis],
  ["examples/theme-knowledge-shelf.agentdraw.json", buildKnowledgeShelf],
  ["examples/theme-spec-ledger.agentdraw.json", buildSpecLedger],
  ["examples/theme-executive-brief.agentdraw.json", buildExecutiveBrief],
  ["examples/theme-cache-incident.agentdraw.json", buildCacheIncident],
  ["examples/theme-signal-grid.agentdraw.json", buildSignalGrid],
  ["examples/theme-product-pop.agentdraw.json", buildProductPop],
  ["examples/theme-meeting-ledger.agentdraw.json", buildMeetingLedger],
  ["examples/theme-raw-grid.agentdraw.json", buildRawGrid],
  ["examples/theme-bold-poster.agentdraw.json", buildBoldPoster],
  ["examples/theme-soft-editorial.agentdraw.json", buildSoftEditorial],
  ["examples/theme-block-frame.agentdraw.json", buildBlockFrame],
  ["examples/theme-pin-and-paper.agentdraw.json", buildPinAndPaper],
  ["examples/theme-hatch-whiteboard.agentdraw.json", buildHatchWhiteboard],
  ["examples/theme-crayon-stack.agentdraw.json", buildCrayonStack],
];

await mkdir("examples", { recursive: true });

for (const [file, build] of examples) {
  const scene = build();
  await writeFile(file, `${JSON.stringify(scene, null, 2)}\n`, "utf8");
}

function buildAgentDrawOs() {
  const p = palettes["system-formal"];
  const elements = [
    text("title", 64, 52, 620, 42, "AgentDraw Operating System", 34, p.ink),
    text("subtitle", 66, 102, 720, 24, "A local loop for agent-made diagrams, validation, replay, and human editing.", 17, p.accent3),
    rect("canvas", 44, 34, 1188, 650, "transparent", p.accent2, 2),
    rect("top-band", 66, 150, 1120, 50, p.accent, p.accent, 0),
    text("top-band-label", 92, 165, 980, 20, "prompt -> semantic scene -> provider adapter -> editable canvas", 17, "#FFFFFF"),
  ];

  const modules = [
    ["Agent", "Reads task\nand files", 92, 248],
    ["Builder", "Chooses layout\nand style", 352, 248],
    ["Validator", "Checks text\nand routes", 612, 248],
    ["Editor", "Replay, edit\nand export", 872, 248],
  ];

  modules.forEach(([title, body, x, y], index) => {
    elements.push(
      rect(`module-${index}`, x, y, 210, 136, index % 2 ? p.accent2 : p.panel, p.ink, 2),
      text(`module-title-${index}`, x + 22, y + 24, 166, 26, title, 24, p.ink, "center", "middle"),
      text(`module-body-${index}`, x + 26, y + 70, 158, 48, body, 16, p.accent3, "center", "middle"),
    );
    if (index < modules.length - 1) {
      elements.push(elbow(`module-flow-${index}`, x + 210, y + 68, 50, 0, p.accent));
    }
  });

  const rows = [
    ["Storage", ".agentdraw.json", "portable scene envelope"],
    ["Provider", "Excalidraw", "editable primitives"],
    ["Quality", "validate", "repair before opening"],
  ];
  elements.push(rect("table", 92, 468, 1040, 136, p.panel, p.ink, 2));
  rows.forEach((row, index) => {
    const y = 468 + index * 45;
    elements.push(
      rect(`row-${index}`, 92, y, 1040, 45, index === 0 ? p.accent2 : "transparent", p.ink, index === 0 ? 0 : 1),
      text(`row-a-${index}`, 122, y + 13, 180, 20, row[0], 16, p.ink),
      text(`row-b-${index}`, 360, y + 13, 220, 20, row[1], 16, p.accent),
      text(`row-c-${index}`, 640, y + 13, 420, 20, row[2], 16, p.accent3),
    );
  });

  return scene("AgentDraw Operating System", "system-formal", elements);
}

function buildIncidentCommand() {
  const p = palettes.boardroom;
  const elements = [
    text("title", 72, 54, 520, 40, "Incident Command Center", 34, p.ink),
    text("subtitle", 74, 104, 650, 24, "A command board for severity, owners, recovery windows, and learning loops.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.accent2, 2),
    rect("status", 78, 158, 292, 404, p.ink, p.ink, 0),
    text("status-title", 104, 184, 230, 44, "SEV-1", 32, "#FFFFFF", "center", "middle"),
    text("status-body", 110, 252, 228, 96, "Payments degraded\nOwner: infra lead\nETA: 24 min", 22, "#FFFFFF", "center", "middle"),
    rect("status-chip", 118, 438, 180, 46, p.accent, p.accent, 0),
    text("status-chip-text", 142, 451, 132, 20, "Mitigating", 18, "#FFFFFF", "center", "middle"),
  ];

  const cards = [
    ["Detect", "alert spike", "logs"],
    ["Triage", "blast radius", "owner"],
    ["Mitigate", "rollback", "patch"],
    ["Review", "timeline", "actions"],
  ];
  cards.forEach((card, index) => {
    const x = 434 + (index % 2) * 330;
    const y = 168 + Math.floor(index / 2) * 174;
    elements.push(
      rect(`incident-${index}`, x, y, 260, 116, index === 2 ? p.accent2 : p.panel, p.ink, 2),
      text(`incident-title-${index}`, x + 24, y + 20, 210, 24, card[0], 22, p.ink),
      text(`incident-body-${index}`, x + 24, y + 58, 210, 42, `${card[1]}\n${card[2]}`, 16, p.accent3),
    );
  });
  elements.push(
    elbow("route-a", 370, 260, 64, -34, p.accent),
    elbow("route-b", 694, 226, 70, 0, p.accent),
    elbow("route-c", 564, 284, 0, 58, p.accent),
    elbow("route-d", 694, 400, 70, 0, p.accent),
    rect("timeline", 434, 520, 590, 56, p.panel, p.ink, 2),
    text("timeline-text", 462, 538, 530, 20, "00:04 detect   00:11 owner   00:19 rollback   00:31 stable", 16, p.ink, "center", "middle"),
  );

  return scene("Incident Command Center", "boardroom", elements);
}

function buildMessageBus() {
  const p = palettes["blueprint-formal"];
  const elements = [
    text("title", 70, 54, 520, 40, "Multi-Agent Message Bus", 34, p.ink),
    text("subtitle", 72, 104, 650, 24, "A formal blueprint for coordinating specialist agents through shared events.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.accent2, 2),
    rect("bus", 154, 338, 900, 64, p.accent, p.accent, 0),
    text("bus-label", 220, 360, 760, 20, "EVENT BACKBONE · requests · tool results · validation facts · memory writes", 18, "#FFFFFF", "center", "middle"),
  ];

  const agents = [
    ["Planner", "goals\nroutes", 122, 196],
    ["Worker A", "code\ntools", 382, 196],
    ["Verifier", "checks\ndiffs", 642, 196],
    ["Memory", "facts\nstate", 902, 196],
  ];
  agents.forEach(([title, body, x, y], index) => {
    elements.push(
      rect(`agent-${index}`, x, y, 168, 104, p.panel, p.ink, 2),
      text(`agent-title-${index}`, x + 20, y + 18, 128, 22, title, 20, p.ink, "center", "middle"),
      text(`agent-body-${index}`, x + 28, y + 56, 112, 36, body, 15, p.accent3, "center", "middle"),
      elbow(`agent-down-${index}`, x + 84, y + 104, 0, 38, p.accent),
    );
  });
  const stores = [
    ["Scene File", 212, 470],
    ["Browser", 522, 500],
    ["Export", 832, 470],
  ];
  stores.forEach(([label, x, y], index) => {
    elements.push(
      rect(`store-${index}`, x, y, 190, 72, index === 1 ? p.accent2 : p.panel, p.ink, 2),
      text(`store-label-${index}`, x + 24, y + 26, 142, 20, label, 18, p.ink, "center", "middle"),
      elbow(`store-up-${index}`, x + 95, y, 0, -68, p.accent),
    );
  });

  return scene("Multi-Agent Message Bus", "blueprint-formal", elements);
}

function buildPluginRuntime() {
  const p = palettes["runtime-doc"];
  const elements = [
    text("eyebrow", 74, 48, 220, 18, "PLUGIN RUNTIME", 13, p.accent),
    text("title", 72, 76, 620, 46, "Agent Plugin Runtime", 40, p.ink),
    text("subtitle", 76, 132, 860, 24, "A warm document board for explaining local tools, manifests, permissions, and execution flow.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", "#E2DFD8", 2, { roundness: true }),
    rect("toc", 76, 188, 204, 390, "#F2EFE8", "#E2DFD8", 1, { roundness: true }),
    text("toc-title", 98, 212, 150, 18, "Contents", 15, p.ink),
  ];

  const tocItems = ["Manifest", "Install", "Run loop", "Permissions", "Export"];
  tocItems.forEach((item, index) => {
    const y = 244 + index * 48;
    elements.push(
      rect(`toc-item-${index}`, 96, y, 164, 32, index === 2 ? "#E8EEFB" : "transparent", index === 2 ? "#C9D6EE" : "transparent", 1, { roundness: true }),
      text(`toc-text-${index}`, 112, y + 9, 132, 13, item, 14, index === 2 ? p.accent : "#4C545F"),
    );
  });

  const cards = [
    ["Manifest", "commands\nskill hooks", 340, 216, "#E8EEFB", p.accent],
    ["Sandbox", "files + net\nsecret rules", 584, 216, "#E7F6EF", "#1E7B58"],
    ["Runtime", "spawn\nstream events", 828, 216, "#FFF3D8", "#946200"],
  ];
  cards.forEach(([title, body, x, y, fill, color], index) => {
    elements.push(
      rect(`runtime-card-${index}`, x, y, 190, 164, fill, "#E2DFD8", 1, { roundness: true }),
      rect(`runtime-tag-${index}`, x + 22, y + 18, 84, 28, p.panel, "#E2DFD8", 1, { roundness: true }),
      text(`runtime-tag-text-${index}`, x + 34, y + 26, 60, 12, `0${index + 1}`, 13, color, "center", "middle"),
      text(`runtime-title-${index}`, x + 24, y + 58, 142, 22, title, 21, p.ink, "center", "middle"),
      text(`runtime-body-${index}`, x + 34, y + 104, 122, 36, body, 15, p.accent3, "center", "middle"),
    );
    if (index < cards.length - 1) {
      elements.push(arrow(`runtime-flow-${index}`, x + 190, y + 66, 54, 0, p.accent, 2));
    }
  });

  elements.push(
    rect("callout", 340, 434, 678, 94, "#F5F7FC", "#CDD9F0", 1, { roundness: true }),
    rect("callout-rule", 340, 434, 6, 94, p.accent, p.accent, 0),
    text("callout-title", 370, 452, 160, 20, "Design rule", 19, p.ink),
    text("callout-body", 370, 482, 594, 34, "Explain ownership and sequence\nbefore implementation details.", 16, p.accent3),
    rect("status-row", 340, 560, 678, 42, p.panel, "#E2DFD8", 1, { roundness: true }),
    text("status-row-text", 370, 572, 610, 16, "Open locally -> inspect result -> edit on canvas -> export SVG or PNG", 15, p.ink, "center", "middle"),
  );

  return scene("Agent Plugin Runtime", "runtime-doc", elements);
}

function buildSpecNotes() {
  const p = palettes["slate-notes"];
  const elements = [
    text("title", 72, 54, 520, 42, "Product Spec Notes", 38, p.ink),
    text("subtitle", 76, 106, 720, 24, "A clean slate board for requirements, open questions, and decision records.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", "#CBD5E1", 2, { roundness: true }),
    rect("summary", 90, 166, 330, 350, p.panel, "#CBD5E1", 1, { roundness: true }),
    text("summary-title", 118, 194, 260, 24, "Problem", 23, p.ink),
    text("summary-body", 118, 246, 250, 88, "Agents can draw diagrams,\nbut quality drifts without\nstyle constraints.", 18, p.accent3),
    rect("summary-chip", 118, 386, 116, 30, "#E2E8F0", "#CBD5E1", 1, { roundness: true }),
    text("summary-chip-text", 138, 394, 76, 12, "needs spec", 13, p.ink, "center", "middle"),
  ];
  const cards = [
    ["Input", "load skill\nread docs", 486, 178, "#D4E1EE", p.accent],
    ["Generate", "SVG source\nstyle rules", 760, 178, "#D5E8DC", "#73A78D"],
    ["Validate", "layout QA\npreview PNG", 486, 382, "#F0E0D6", "#CB9B7A"],
    ["Edit", "browser canvas\nexport result", 760, 382, p.panel, p.accent],
  ];
  cards.forEach(([title, body, x, y, fill, color], index) => {
    elements.push(
      rect(`notes-card-${index}`, x, y, 222, 128, fill, "#CBD5E1", 1, { roundness: true }),
      text(`notes-title-${index}`, x + 26, y + 24, 168, 22, title, 22, p.ink, "center", "middle"),
      text(`notes-body-${index}`, x + 34, y + 68, 154, 42, body, 16, p.accent3, "center", "middle"),
      rect(`notes-rule-${index}`, x + 22, y + 108, 178, 4, color, color, 0),
    );
  });
  elements.push(
    arrow("notes-flow-a", 708, 242, 52, 0, p.accent3, 2),
    arrow("notes-flow-b", 598, 306, 0, 76, p.accent3, 2),
    arrow("notes-flow-c", 708, 446, 52, 0, p.accent3, 2),
    rect("notes-decision", 150, 568, 870, 48, "#E2E8F0", "#CBD5E1", 1, { roundness: true }),
    text("notes-decision-text", 184, 582, 802, 18, "Decision: preserve editability, but use SVG as the source of design quality.", 17, p.ink, "center", "middle"),
  );
  return scene("Product Spec Notes", "slate-notes", elements);
}

function buildRunbookManual() {
  const p = palettes["manual-cream"];
  const elements = [
    text("title", 72, 54, 540, 44, "Repair Runbook", 40, p.ink),
    text("subtitle", 76, 110, 680, 24, "A printed-manual style for repeatable checks, fixes, and release procedures.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 3),
    rect("header", 92, 164, 1002, 48, p.ink, p.ink, 0),
    text("header-text", 126, 178, 930, 18, "SYMPTOM / CHECK / FIX / OWNER", 16, p.panel, "center", "middle"),
  ];
  const rows = [
    ["01", "Text overflow", "validate", "widen or wrap", "Design"],
    ["02", "Odd arrowhead", "inspect marker", "use plain line", "Tools"],
    ["03", "Off-grid cards", "quality report", "snap columns", "Agent"],
    ["04", "Bad preview", "export PNG", "revise SVG", "Review"],
  ];
  rows.forEach((row, index) => {
    const y = 212 + index * 76;
    elements.push(
      rect(`manual-row-${index}`, 92, y, 1002, 76, index % 2 ? p.panel : p.accent2, p.ink, 2),
      rect(`manual-step-${index}`, 118, y + 18, 44, 40, index === 1 ? p.accent : p.ink, index === 1 ? p.accent : p.ink, 0),
      text(`manual-num-${index}`, 130, y + 29, 20, 14, row[0], 14, p.panel, "center", "middle"),
      text(`manual-a-${index}`, 206, y + 26, 190, 18, row[1], 18, p.ink),
      text(`manual-b-${index}`, 456, y + 26, 150, 18, row[2], 17, p.accent3),
      text(`manual-c-${index}`, 662, y + 26, 180, 18, row[3], 17, p.ink),
      text(`manual-d-${index}`, 922, y + 26, 110, 18, row[4], 17, p.accent3),
    );
  });
  elements.push(
    rect("manual-stamp", 790, 548, 250, 50, p.panel, p.accent, 3),
    text("manual-stamp-text", 830, 563, 170, 18, "Run before publish", 17, p.accent, "center", "middle"),
  );
  return scene("Repair Runbook", "manual-cream", elements, { roundness: "sharp" });
}

function buildLaunchRoom() {
  const p = palettes["riso-brut"];
  const elements = [
    text("title", 70, 54, 500, 48, "Launch Room Loop", 42, p.ink),
    text("subtitle", 74, 112, 640, 24, "Chunky editorial blocks for campaign bets and learning cycles.", 18, p.ink),
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 4),
    rect("poster-band", 760, 56, 350, 72, p.accent2, p.ink, 4),
    text("poster-band-text", 790, 78, 290, 26, "SHIP / LEARN", 26, p.ink, "center", "middle"),
  ];

  const blocks = [
    ["01", "Audience", "pain\nsegment", 110, 204, p.accent],
    ["02", "Promise", "story\noffer", 382, 236, p.panel],
    ["03", "Surface", "page\nasset", 654, 204, p.accent2],
    ["04", "Signal", "traffic\nreply", 926, 236, p.accent3],
  ];
  blocks.forEach(([num, title, body, x, y, fill], index) => {
    shadow(`shadow-${index}`, elements, x, y, 202, 148, index === 3 ? p.accent : p.ink);
    elements.push(
      rect(`block-${index}`, x, y, 202, 148, fill, p.ink, 4),
      rect(`num-${index}`, x + 18, y + 18, 44, 36, p.panel, p.ink, 3),
      text(`num-text-${index}`, x + 28, y + 26, 24, 16, num, 16, p.ink, "center", "middle"),
      text(`block-title-${index}`, x + 24, y + 66, 154, 28, title, 27, p.ink, "center", "middle"),
      text(`block-body-${index}`, x + 34, y + 98, 134, 44, body, 16, p.ink, "center", "middle"),
    );
    if (index < blocks.length - 1) {
      elements.push(arrow(`brut-flow-${index}`, x + 214, y + 76, 54, index % 2 ? -30 : 30, p.ink, 4));
    }
  });
  elements.push(
    rect("learning-strip", 132, 520, 930, 58, p.panel, p.ink, 4),
    text("learning-strip-text", 164, 538, 866, 22, "Every loop returns with one stronger message, one clearer audience, and one cleaner surface.", 18, p.ink, "center", "middle"),
  );

  return scene("Launch Room Loop", "riso-brut", elements, { roughness: 0, roundness: "sharp" });
}

function buildStrategyGrove() {
  const p = palettes.grove;
  const elements = [
    text("title", 72, 56, 540, 42, "Quarterly Strategy Map", 38, p.ink),
    text("subtitle", 76, 108, 600, 24, "A quiet editorial board for bets, constraints, and operating cadence.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.accent3, 2),
    rect("thesis", 88, 176, 426, 332, p.accent, p.accent, 0),
    text("thesis-label", 126, 218, 336, 26, "NORTH STAR", 19, p.panel, "center", "middle"),
    text("thesis-main", 128, 258, 334, 136, "Improve creator\nconfidence before\nteam expansion", 32, p.panel, "center", "middle"),
    rect("coral-rule", 156, 422, 220, 8, p.accent2, p.accent2, 0),
  ];

  const cards = [
    ["Bets", "Template system\nReplay polish", 574, 178],
    ["Constraints", "Local first\nEditable output", 846, 178],
    ["Rituals", "Weekly review\nDesign QA", 574, 384],
    ["Signals", "Share rate\nRepair count", 846, 384],
  ];
  cards.forEach(([title, body, x, y], index) => {
    elements.push(
      rect(`grove-card-${index}`, x, y, 226, 126, p.panel, p.panel, 0),
      text(`grove-card-title-${index}`, x + 26, y + 22, 174, 24, title, 22, p.ink),
      text(`grove-card-body-${index}`, x + 26, y + 62, 174, 42, body, 17, p.accent3),
    );
  });
  elements.push(
    arrow("grove-a", 514, 276, 60, -34, p.accent2, 3),
    arrow("grove-b", 514, 364, 60, 84, p.accent2, 3),
    rect("footer-note", 130, 566, 918, 44, "transparent", p.accent2, 0),
    text("footer-note-text", 132, 574, 914, 20, "One coral accent only. Let the parchment carry the calm.", 17, p.accent2, "center", "middle"),
  );

  return scene("Quarterly Strategy Map", "grove", elements, { roundness: "sharp" });
}

function buildRoadmapMint() {
  const p = palettes["mint-brut"];
  const elements = [
    text("title", 70, 54, 490, 44, "Creator Tool Roadmap", 38, p.ink),
    text("subtitle", 74, 106, 630, 24, "A playful product map with stacked cards, bright chips, and visible depth.", 17, p.ink),
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 3),
  ];

  const cards = [
    ["NOW", "Sketch\nReplay", 126, 188, p.panel],
    ["NEXT", "Comments\nShare", 370, 250, p.accent2],
    ["LATER", "Templates\nTeams", 616, 188, p.accent],
    ["SCALE", "Agents\nGallery", 860, 250, p.panel],
  ];
  cards.forEach(([stage, body, x, y, fill], index) => {
    shadow(`mint-shadow-${index}`, elements, x, y, 202, 142, index % 2 ? p.accent : p.accent3, 14);
    elements.push(
      rect(`mint-card-${index}`, x, y, 202, 142, fill, p.ink, 3, { roundness: true }),
      rect(`mint-chip-${index}`, x + 24, y + 18, 86, 34, index % 2 ? p.panel : p.accent2, p.ink, 2, { roundness: true }),
      text(`mint-stage-${index}`, x + 34, y + 27, 66, 14, stage, 14, p.ink, "center", "middle"),
      text(`mint-body-${index}`, x + 36, y + 62, 130, 64, body, 24, p.ink, "center", "middle"),
    );
    if (index < cards.length - 1) {
      elements.push(arrow(`mint-flow-${index}`, x + 208, y + 72, 38, index % 2 ? -48 : 48, p.ink, 3));
    }
  });
  elements.push(
    rect("mint-base", 174, 536, 826, 54, p.accent2, p.ink, 3, { roundness: true }),
    text("mint-base-text", 208, 552, 758, 20, "Manual edits stay first-class. Agents generate the draft, humans keep control.", 17, p.ink, "center", "middle"),
  );

  return scene("Creator Tool Roadmap", "mint-brut", elements, { roughness: 1, currentItemFontFamily: 1 });
}

function buildCustomerJourney() {
  const p = palettes.coral;
  const elements = [
    text("title", 70, 54, 520, 42, "Customer Journey Signals", 36, p.ink),
    text("subtitle", 74, 106, 720, 24, "A warm journey board connecting user moments to measurable product signals.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.accent2, 2),
    rect("journey-band", 94, 234, 1000, 86, p.accent2, p.accent2, 0, { roundness: true, customData: { role: "decoration" } }),
  ];

  const steps = [
    ["Discover", "source\nintent", 132, 196],
    ["Activate", "aha\nsetup", 386, 304],
    ["Adopt", "habit\nvalue", 640, 196],
    ["Expand", "invite\nupgrade", 894, 304],
  ];
  steps.forEach(([title, body, x, y], index) => {
    elements.push(
      ellipse(`journey-dot-${index}`, x + 70, y + 170, 26, 26, p.accent, p.accent, 0),
      rect(`journey-card-${index}`, x, y, 184, 122, p.panel, p.ink, 2, { roundness: true }),
      text(`journey-title-${index}`, x + 24, y + 24, 136, 22, title, 22, p.ink, "center", "middle"),
      text(`journey-body-${index}`, x + 32, y + 66, 120, 38, body, 16, p.accent3, "center", "middle"),
    );
    if (index < steps.length - 1) {
      elements.push(arrow(`journey-flow-${index}`, x + 184, y + 64, 70, index % 2 ? -86 : 86, p.accent, 3));
    }
  });
  elements.push(
    rect("signal-panel", 176, 530, 828, 58, p.ink, p.ink, 0),
    text("signal-panel-text", 214, 548, 752, 20, "Each stage owns one human moment and one metric, never a wall of copy.", 17, "#FFFFFF", "center", "middle"),
  );

  return scene("Customer Journey Signals", "coral", elements);
}

function buildResearchSynthesis() {
  const p = palettes["violet-marker"];
  const elements = [
    text("title", 70, 54, 530, 42, "Research Synthesis Wall", 36, p.ink),
    text("subtitle", 74, 106, 680, 24, "A bright clustering board for turning interview notes into decisions.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.accent2, 2),
  ];

  const clusters = [
    ["Notes", ["slow setup", "unclear export", "likes replay"], 104, 184, p.panel],
    ["Themes", ["trust", "speed", "control"], 414, 212, p.accent],
    ["Insights", ["editability wins", "preview matters", "style rules help"], 724, 184, p.accent2],
  ];
  clusters.forEach(([title, notes, x, y, fill], clusterIndex) => {
    elements.push(
      rect(`cluster-${clusterIndex}`, x, y, 246, 260, "transparent", p.accent3, 2),
      text(`cluster-title-${clusterIndex}`, x + 28, y + 20, 188, 24, title, 24, p.ink, "center", "middle"),
    );
    notes.forEach((note, noteIndex) => {
      const nx = x + 26 + (noteIndex % 2) * 42;
      const ny = y + 72 + noteIndex * 48;
      shadow(`note-shadow-${clusterIndex}-${noteIndex}`, elements, nx, ny, 154, 38, noteIndex % 2 ? p.accent2 : p.accent3, 8);
      elements.push(
        rect(`note-${clusterIndex}-${noteIndex}`, nx, ny, 154, 38, fill, p.ink, 2, { roundness: true }),
        text(`note-text-${clusterIndex}-${noteIndex}`, nx + 14, ny + 11, 126, 14, note, 14, p.ink, "center", "middle"),
      );
    });
  });
  elements.push(
    arrow("research-a", 350, 314, 64, 0, p.ink, 3),
    arrow("research-b", 660, 314, 64, 0, p.ink, 3),
    rect("decision", 300, 522, 610, 54, p.accent2, p.ink, 2, { roundness: true }),
    text("decision-text", 334, 538, 542, 20, "Decision: ship design systems before adding more providers.", 17, p.ink, "center", "middle"),
  );

  return scene("Research Synthesis Wall", "violet-marker", elements, { roughness: 1 });
}

function buildKnowledgeShelf() {
  const p = palettes["archive-shelf"];
  const elements = [
    text("title", 72, 54, 520, 42, "Knowledge Shelf Map", 38, p.ink),
    text("subtitle", 76, 106, 690, 24, "A catalog-board for turning scattered research into indexed decisions.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.accent3, 2),
    rect("shelf-rail", 86, 160, 1030, 40, p.ink, p.ink, 0),
    text("shelf-rail-text", 112, 171, 960, 18, "SOURCES -> THEMES -> DECISIONS", 15, p.panel, "center", "middle"),
  ];

  const shelves = [
    ["01 Sources", "Interview notes\nSupport tickets\nTelemetry cuts", 100, 238, p.panel],
    ["02 Themes", "Trust gap\nSetup drag\nExport anxiety", 404, 238, p.accent2],
    ["03 Decisions", "Preview first\nRepair loop\nStyle contracts", 708, 238, p.panel],
  ];
  shelves.forEach(([heading, body, x, y, fill], index) => {
    elements.push(
      rect(`tab-${index}`, x + 18, y - 38, 106, 28, p.accent, p.accent, 0),
      text(`tab-label-${index}`, x + 32, y - 30, 78, 12, heading, 13, p.ink, "center", "middle"),
      rect(`shelf-card-${index}`, x, y, 238, 170, fill, p.ink, 2),
      text(`shelf-heading-${index}`, x + 24, y + 26, 190, 24, heading.replace(/^[0-9]+ /, ""), 22, p.ink, "center", "middle"),
      text(`shelf-body-${index}`, x + 30, y + 72, 178, 72, body, 17, p.accent3, "center", "middle"),
    );
    if (index < shelves.length - 1) {
      elements.push(arrow(`shelf-flow-${index}`, x + 238, y + 84, 66, 0, p.accent3, 2));
    }
  });

  elements.push(
    rect("margin-note", 976, 238, 132, 170, p.panel, p.accent3, 2),
    text("margin-note-title", 996, 264, 92, 20, "Index", 19, p.ink, "center", "middle"),
    text("margin-note-body", 1002, 310, 80, 54, "Each card\nkeeps one\nclaim.", 15, p.accent3, "center", "middle"),
    rect("evidence-strip", 150, 506, 840, 58, p.accent2, p.accent2, 0),
    text("evidence-text", 180, 523, 780, 20, "Evidence strips carry quotes or constraints. They are plain bands, not more cards.", 17, p.ink, "center", "middle"),
  );

  return scene("Knowledge Shelf Map", "archive-shelf", elements, { roundness: "sharp" });
}

function buildSpecLedger() {
  const p = palettes.inkline;
  const elements = [
    text("title", 72, 54, 500, 42, "Spec Ledger", 38, p.ink),
    text("subtitle", 76, 106, 730, 24, "A severe technical memo for requirements, failure modes, and repair actions.", 17, p.accent),
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 2),
    rect("rail", 92, 166, 70, 360, p.ink, p.ink, 0),
    text("rail-text", 112, 300, 30, 30, "QA", 28, p.panel, "center", "middle"),
    rect("head", 188, 166, 858, 48, p.ink, p.ink, 0),
    text("head-a", 222, 180, 170, 16, "REQUIREMENT", 14, p.panel),
    text("head-b", 496, 180, 170, 16, "FAILURE", 14, p.panel),
    text("head-c", 764, 180, 170, 16, "ACTION", 14, p.panel),
  ];

  const rows = [
    ["Centered labels", "text hugs top edge", "set middle baseline"],
    ["Edge connectors", "arrow starts inside", "snap to bounds"],
    ["Equal cards", "ragged row widths", "normalize columns"],
    ["Plain dividers", "accidental arrows", "remove marker-end"],
  ];
  rows.forEach((row, index) => {
    const y = 214 + index * 78;
    elements.push(
      rect(`ledger-row-${index}`, 188, y, 858, 78, index % 2 ? p.panel : p.accent2, p.ink, 1),
      text(`ledger-a-${index}`, 222, y + 27, 206, 18, row[0], 18, p.ink),
      text(`ledger-b-${index}`, 496, y + 27, 190, 18, row[1], 17, p.accent),
      text(`ledger-c-${index}`, 764, y + 27, 190, 18, row[2], 17, p.accent3),
    );
  });
  elements.push(
    rect("decision", 188, 556, 858, 46, p.accent3, p.accent3, 0),
    text("decision-text", 220, 570, 794, 18, "Pass when the board is readable as a grid before any color is considered.", 16, p.panel, "center", "middle"),
  );

  return scene("Spec Ledger", "inkline", elements, { roundness: "sharp" });
}

function buildExecutiveBrief() {
  const p = palettes["espresso-paper"];
  const elements = [
    text("title", 72, 54, 560, 42, "Executive Brief Board", 39, p.ink),
    text("subtitle", 76, 106, 690, 24, "A warm one-page decision map for leaders who need the answer and the tradeoffs.", 17, p.accent),
    rect("frame", 44, 36, 1188, 650, "transparent", p.accent, 2),
    rect("masthead-rule", 74, 146, 1020, 2, p.accent, p.accent, 0),
  ];

  const tiles = [
    ["Build", "highest control\nlongest path", 96, 206],
    ["Buy", "fastest start\nvendor lock-in", 378, 206],
    ["Partner", "shared risk\nunclear ownership", 660, 206],
  ];
  tiles.forEach(([title, body, x, y], index) => {
    elements.push(
      rect(`brief-tile-${index}`, x, y, 238, 150, index === 1 ? p.accent2 : p.panel, p.ink, 2, { roundness: true }),
      text(`brief-title-${index}`, x + 26, y + 28, 186, 24, title, 24, p.ink, "center", "middle"),
      text(`brief-body-${index}`, x + 34, y + 76, 170, 44, body, 17, p.accent3, "center", "middle"),
    );
  });
  elements.push(
    rect("score-panel", 954, 206, 150, 150, p.ink, p.ink, 0),
    text("score-label", 978, 236, 102, 20, "Choice", 18, p.panel, "center", "middle"),
    text("score-main", 974, 272, 110, 46, "Buy", 34, p.panel, "center", "middle"),
    rect("table", 96, 414, 1008, 112, p.panel, p.ink, 2, { roundness: true }),
    text("table-a", 130, 440, 180, 18, "Confidence", 17, p.ink),
    text("table-b", 410, 440, 180, 18, "Risk", 17, p.ink),
    text("table-c", 690, 440, 180, 18, "Next step", 17, p.ink),
    text("table-a2", 130, 482, 210, 18, "High for MVP", 17, p.accent3),
    text("table-b2", 410, 482, 210, 18, "Review export limits", 17, p.accent3),
    text("table-c2", 690, 482, 290, 18, "Negotiate escape hatch", 17, p.accent3),
    rect("decision-band", 166, 574, 868, 50, p.accent3, p.accent3, 0),
    text("decision-band-text", 202, 590, 796, 18, "Recommendation: buy the canvas layer, invest engineering effort in agent quality.", 17, p.panel, "center", "middle"),
  );

  return scene("Executive Brief Board", "espresso-paper", elements);
}

function buildCacheIncident() {
  const p = palettes["incident-dark"];
  const red = "#F85149";
  const green = "#3FB950";
  const amber = "#D29922";
  const purple = "#BC8CFF";
  const rule = "#2A3340";
  const elements = [
    text("title", 70, 50, 620, 38, "KV Cache Incident Report", 34, p.ink),
    text("subtitle", 72, 96, 780, 22, "A dark operational board for verdict, evidence, timeline, and action ownership.", 16, p.accent3),
    rect("frame", 44, 32, 1188, 660, "transparent", rule, 2, { roundness: true }),
  ];

  const tabs = ["Verdict", "Timeline", "Evidence", "Actions"];
  tabs.forEach((tab, index) => {
    const x = 72 + index * 142;
    elements.push(
      rect(`tab-${index}`, x, 136, 122, 36, index === 0 ? "#1D3350" : p.panel, index === 0 ? p.accent : rule, 1, { roundness: true }),
      text(`tab-text-${index}`, x + 18, 147, 86, 14, tab, 14, index === 0 ? "#CFE6FF" : p.accent3, "center", "middle"),
    );
  });

  elements.push(
    rect("verdict", 72, 202, 1030, 112, p.accent2, rule, 1, { roundness: true }),
    text("verdict-big", 106, 226, 748, 24, "Root cause: request prefix drift after runtime upgrade", 23, p.ink),
    rect("culprit", 742, 256, 244, 34, "#3A1D1D", "#5C2B2B", 1, { roundness: true }),
    text("culprit-text", 764, 266, 200, 13, "SDK 0.1.x -> 0.2.x", 14, "#FF9B94", "center", "middle"),
    text("verdict-note", 106, 266, 560, 18, "Claude stayed stable; qwen-compatible cache collapsed to static prefix.", 16, p.accent3),
  );

  const cards = [
    ["Test env", "07:14 UTC", "hit 97% -> 17%", 92, 354, amber],
    ["Prod env", "19:00 local", "hit 86% -> 38%", 372, 354, purple],
    ["Stable path", "Anthropic", "hit 81-87%", 652, 354, green],
  ];
  cards.forEach(([title, moment, note, x, y, color], index) => {
    elements.push(
      rect(`incident-card-${index}`, x, y, 236, 132, p.panel, rule, 1, { roundness: true }),
      rect(`incident-card-rule-${index}`, x, y, 236, 4, color, color, 0),
      text(`incident-title-${index}`, x + 20, y + 22, 170, 18, title, 17, p.ink),
      text(`incident-moment-${index}`, x + 20, y + 54, 176, 24, moment, 24, color),
      text(`incident-note-${index}`, x + 20, y + 96, 178, 16, note, 15, p.accent3),
    );
  });

  elements.push(
    rect("diff", 932, 354, 170, 132, "#0A0E14", rule, 1, { roundness: true }),
    text("diff-title", 954, 376, 116, 14, "dependency diff", 14, p.accent3, "center", "middle"),
    text("diff-del", 954, 410, 116, 14, "- sdk 0.1.61", 14, "#FF9B94"),
    text("diff-add", 954, 442, 116, 14, "+ sdk 0.2.89", 14, "#7EE787"),
  );

  const steps = [
    ["1", "Normalize proxy blocks", green],
    ["2", "Pin or rewrite CLI request", amber],
    ["3", "Add cache-prefix regression test", p.accent],
  ];
  steps.forEach(([num, label, color], index) => {
    const y = 534 + index * 46;
    elements.push(
      rect(`step-${index}`, 166, y, 780, 34, p.panel, rule, 1, { roundness: true }),
      rect(`step-num-${index}`, 182, y + 5, 24, 24, color, color, 0, { roundness: true }),
      text(`step-num-text-${index}`, 190, y + 12, 8, 10, num, 12, "#06121F", "center", "middle"),
      text(`step-label-${index}`, 226, y + 10, 560, 14, label, 15, p.ink),
    );
  });

  return scene("KV Cache Incident Report", "incident-dark", elements, { roundness: "sharp" });
}

function buildSignalGrid() {
  const p = palettes["neon-grid"];
  const magenta = "#FF4FD8";
  const green = "#7CE38B";
  const elements = [
    text("title", 70, 52, 560, 42, "Runtime Signal Grid", 38, p.ink),
    text("subtitle", 72, 104, 730, 24, "A high-contrast event map for observability, agent streams, and exception paths.", 17, p.accent),
    rect("frame", 44, 36, 1188, 650, "transparent", p.accent, 2),
    rect("top-rail", 84, 158, 1040, 4, p.accent, p.accent, 0),
  ];
  const nodes = [
    ["Prompt", "intent\nfiles", 112, 226],
    ["Planner", "route\nbudget", 370, 226],
    ["Worker", "tools\nstream", 628, 226],
    ["Verifier", "check\nexport", 886, 226],
  ];
  nodes.forEach(([title, body, x, y], index) => {
    elements.push(
      rect(`signal-node-${index}`, x, y, 190, 136, p.panel, p.accent, 2),
      rect(`signal-inner-${index}`, x + 14, y + 14, 162, 4, index === 2 ? magenta : p.accent, index === 2 ? magenta : p.accent, 0),
      text(`signal-title-${index}`, x + 28, y + 42, 134, 24, title, 23, p.ink, "center", "middle"),
      text(`signal-body-${index}`, x + 44, y + 82, 102, 38, body, 16, p.accent, "center", "middle"),
    );
    if (index < nodes.length - 1) {
      elements.push(arrow(`signal-flow-${index}`, x + 190, y + 68, 68, 0, index === 1 ? magenta : p.accent, 3));
    }
  });
  const metrics = [
    ["latency", "420ms", p.accent],
    ["repair", "2", magenta],
    ["pass", "94%", green],
  ];
  metrics.forEach(([label, value, color], index) => {
    const x = 192 + index * 280;
    elements.push(
      rect(`metric-${index}`, x, 494, 220, 76, p.panel, color, 2),
      text(`metric-label-${index}`, x + 26, 512, 160, 14, label, 14, color, "center", "middle"),
      text(`metric-value-${index}`, x + 40, 532, 136, 34, value, 25, p.ink, "center", "middle"),
    );
  });
  return scene("Runtime Signal Grid", "neon-grid", elements, { roundness: "sharp" });
}

function buildProductPop() {
  const p = palettes["soft-pop"];
  const elements = [
    text("title", 70, 54, 520, 42, "Onboarding Momentum Map", 38, p.ink),
    text("subtitle", 74, 106, 710, 24, "A friendly product board for stages, signals, owner actions, and next bets.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", "#DCE2EA", 2, { roundness: true }),
    rect("lane", 96, 254, 1000, 92, "#DCE2EA", "#DCE2EA", 0, { roundness: true, customData: { role: "decoration" } }),
  ];
  const cards = [
    ["Signup", "source\nintent", 122, 202, p.panel],
    ["First Value", "template\npreview", 366, 296, p.accent],
    ["Team Invite", "share\nreview", 610, 202, p.panel],
    ["Upgrade", "limit\nROI", 854, 296, p.accent2],
  ];
  cards.forEach(([title, body, x, y, fill], index) => {
    elements.push(
      rect(`pop-card-${index}`, x, y, 190, 128, fill, "#566573", 2, { roundness: true }),
      text(`pop-title-${index}`, x + 28, y + 24, 134, 22, title, 22, p.ink, "center", "middle"),
      text(`pop-body-${index}`, x + 44, y + 68, 102, 38, body, 16, p.ink, "center", "middle"),
    );
    if (index < cards.length - 1) {
      elements.push(arrow(`pop-flow-${index}`, x + 194, y + 64, 50, index % 2 ? -94 : 94, "#566573", 2));
    }
  });
  elements.push(
    rect("pop-footer", 176, 538, 820, 54, p.panel, "#566573", 2, { roundness: true }),
    text("pop-footer-text", 210, 554, 752, 18, "Use teal for progress, yellow for the one next bet, and keep the lane readable.", 17, p.ink, "center", "middle"),
  );
  return scene("Onboarding Momentum Map", "soft-pop", elements);
}

function buildMeetingLedger() {
  const p = palettes["long-table"];
  const elements = [
    text("title", 72, 54, 560, 42, "Operating Meeting Ledger", 38, p.ink),
    text("subtitle", 76, 106, 700, 24, "A warm ruled-table board for agenda, owner, decision, and follow-up tracking.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 2),
    rect("head", 92, 166, 1002, 48, p.ink, p.ink, 0),
    text("head-a", 124, 180, 160, 16, "TOPIC", 15, p.panel),
    text("head-b", 374, 180, 160, 16, "OWNER", 15, p.panel),
    text("head-c", 594, 180, 190, 16, "DECISION", 15, p.panel),
    text("head-d", 854, 180, 160, 16, "NEXT", 15, p.panel),
  ];
  const rows = [
    ["Runtime install", "Platform", "npm first", "publish guide"],
    ["Canvas quality", "Design", "SVG source", "eval weekly"],
    ["Agent handoff", "DX", "load skill", "gallery prompt"],
    ["Export loop", "Tools", "PNG + SVG", "visual check"],
  ];
  rows.forEach((row, index) => {
    const y = 214 + index * 76;
    elements.push(
      rect(`meeting-row-${index}`, 92, y, 1002, 76, index % 2 ? p.panel : p.canvas, p.ink, 1),
      text(`meeting-a-${index}`, 124, y + 26, 180, 18, row[0], 18, p.ink),
      text(`meeting-b-${index}`, 374, y + 26, 150, 18, row[1], 17, p.accent3),
      text(`meeting-c-${index}`, 594, y + 26, 180, 18, row[2], 17, p.ink),
      text(`meeting-d-${index}`, 854, y + 26, 180, 18, row[3], 17, p.accent3),
    );
  });
  elements.push(
    rect("stamp", 826, 548, 210, 48, p.panel, p.ink, 2),
    text("stamp-text", 842, 560, 178, 22, "Review every Friday", 17, p.ink, "center", "middle"),
  );
  return scene("Operating Meeting Ledger", "long-table", elements, { roundness: "sharp" });
}

function buildRawGrid() {
  const p = palettes["raw-grid"];
  const elements = [
    text("title", 70, 54, 560, 42, "Scene Quality Matrix", 36, p.ink),
    text("subtitle", 74, 106, 710, 24, "A strict grid for checking generated boards before a human opens them.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 2),
    rect("head", 92, 164, 990, 52, p.ink, p.ink, 0),
    text("head-a", 122, 181, 180, 18, "CHECK", 16, "#FFFFFF"),
    text("head-b", 390, 181, 220, 18, "FAILURE MODE", 16, "#FFFFFF"),
    text("head-c", 720, 181, 280, 18, "REPAIR ACTION", 16, "#FFFFFF"),
  ];
  const rows = [
    ["01", "text overflow", "widen box or wrap line"],
    ["02", "connector crosses label", "reroute with elbow path"],
    ["03", "unintentional overlap", "move card or mark shadow"],
    ["04", "off-center label", "align text group"],
  ];
  rows.forEach((row, index) => {
    const y = 216 + index * 78;
    elements.push(
      rect(`grid-row-${index}`, 92, y, 990, 78, index % 2 ? p.panel : p.accent2, p.ink, 2),
      text(`grid-num-${index}`, 122, y + 24, 54, 24, row[0], 22, p.ink, "center", "middle"),
      text(`grid-mode-${index}`, 390, y + 28, 220, 20, row[1], 18, p.ink),
      text(`grid-action-${index}`, 720, y + 28, 300, 20, row[2], 18, p.accent3),
    );
  });
  elements.push(
    rect("grid-footer", 92, 566, 990, 44, p.ink, p.ink, 0),
    text("grid-footer-text", 124, 579, 926, 18, "The design stays sharp because every generated scene gets checked before replay.", 16, "#FFFFFF", "center", "middle"),
  );
  return scene("Scene Quality Matrix", "raw-grid", elements, { roundness: "sharp" });
}

function buildBoldPoster() {
  const p = palettes["bold-poster"];
  const elements = [
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 4),
    rect("red-slab", 76, 64, 420, 190, p.accent, p.ink, 4),
    text("title", 106, 78, 356, 150, "DESIGN\nSYSTEMS\nWIN", 42, "#FFFFFF", "center", "middle"),
    text("subtitle", 560, 76, 620, 78, "Agent diagrams improve when style files define layout,\ntype, components, and repair rules.", 22, p.ink),
  ];
  const proofs = [
    ["01", "Typography", "sizes, rhythm, hierarchy"],
    ["02", "Components", "cards, strips, shadows"],
    ["03", "Validation", "overflow, routes, overlap"],
  ];
  proofs.forEach((proof, index) => {
    const x = 110 + index * 340;
    const y = 340;
    elements.push(
      rect(`proof-${index}`, x, y, 270, 150, index === 1 ? p.panel : p.accent2, p.ink, 4),
      text(`proof-num-${index}`, x + 24, y + 24, 54, 26, proof[0], 24, p.accent),
      text(`proof-title-${index}`, x + 24, y + 62, 210, 26, proof[1], 25, p.ink),
      text(`proof-body-${index}`, x + 24, y + 106, 214, 20, proof[2], 17, p.accent3),
    );
  });
  elements.push(
    rect("poster-strip", 560, 192, 522, 52, p.panel, p.ink, 3),
    text("poster-strip-text", 590, 208, 462, 18, "Not another palette swap.", 18, p.accent, "center", "middle"),
    arrow("poster-flow", 482, 160, 76, 52, p.ink, 4),
  );
  return scene("Design Systems Win", "bold-poster", elements, { roundness: "sharp" });
}

function buildSoftEditorial() {
  const p = palettes["soft-editorial"];
  const elements = [
    text("title", 72, 56, 570, 42, "Product Discovery Board", 38, p.ink),
    text("subtitle", 76, 108, 660, 24, "A soft editorial synthesis of interviews, signals, priorities, and next moves.", 17, p.accent3),
    rect("frame", 44, 36, 1188, 650, "transparent", p.accent3, 2),
    rect("feature", 90, 176, 404, 300, p.panel, p.panel, 0, { roundness: true }),
    rect("feature-accent", 120, 208, 126, 10, p.accent, p.accent, 0),
    text("feature-title", 122, 238, 330, 76, "Users trust diagrams\nwhen they can edit them", 27, p.ink),
    text("feature-body", 124, 338, 318, 70, "Editable output changes\nthe conversation from\nreview to collaboration.", 18, p.accent3),
  ];
  const notes = [
    ["Signals", "manual edits\nafter replay", 570, 184, p.accent],
    ["Friction", "style choice too vague", 846, 184, p.panel],
    ["Priority", "design systems first", 570, 378, p.accent2],
    ["Next Move", "builder recipes", 846, 378, p.panel],
  ];
  notes.forEach(([title, body, x, y, fill], index) => {
    elements.push(
      rect(`soft-note-${index}`, x, y, 226, 126, fill, p.ink, 2, { roundness: true }),
      text(`soft-title-${index}`, x + 24, y + 22, 174, 24, title, 22, p.ink),
      text(`soft-body-${index}`, x + 24, y + 66, 174, 38, body, 16, p.accent3),
    );
  });
  elements.push(
    rect("soft-strip", 138, 556, 882, 42, p.accent2, p.accent2, 0, { roundness: true }),
    text("soft-strip-text", 172, 568, 812, 18, "A gentle layout can still be rigorous: short text, stable spacing, clear decisions.", 16, p.ink, "center", "middle"),
  );
  return scene("Product Discovery Board", "soft-editorial", elements);
}

function buildBlockFrame() {
  const p = palettes["block-frame"];
  const elements = [
    text("title", 70, 54, 430, 48, "Maker Mode Map", 42, p.ink),
    text("subtitle", 74, 112, 620, 24, "A playful block-frame board for creative agent workflows.", 18, p.ink),
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 4),
  ];
  const blocks = [
    ["Prompt", "intent\nassets", 118, 202, p.accent],
    ["Sketch", "layout\nstyle", 394, 174, p.accent2],
    ["Replay", "watch\nrepair", 670, 236, p.accent3],
    ["Ship", "edit\nexport", 946, 184, p.panel],
  ];
  blocks.forEach(([title, body, x, y, fill], index) => {
    shadow(`blockframe-shadow-${index}`, elements, x, y, 196, 142, index % 2 ? p.accent : p.ink, 12);
    elements.push(
      rect(`blockframe-${index}`, x, y, 196, 142, fill, p.ink, 4, { roundness: true }),
      text(`blockframe-title-${index}`, x + 26, y + 24, 144, 28, title, 27, p.ink, "center", "middle"),
      text(`blockframe-body-${index}`, x + 38, y + 78, 120, 40, body, 18, p.ink, "center", "middle"),
    );
    if (index < blocks.length - 1) {
      elements.push(arrow(`blockframe-flow-${index}`, x + 204, y + 72, 66, index % 2 ? 42 : -34, p.ink, 4));
    }
  });
  elements.push(
    rect("blockframe-bottom", 176, 536, 846, 58, p.accent2, p.ink, 4, { roundness: true }),
    text("blockframe-bottom-text", 208, 552, 782, 20, "Hard shadows are real shapes, so the final board stays editable.", 18, p.ink, "center", "middle"),
  );
  return scene("Maker Mode Map", "block-frame", elements, { roughness: 1 });
}

function buildPinAndPaper() {
  const p = palettes["pin-and-paper"];
  const elements = [
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 2),
    text("title", 78, 62, 620, 44, "Workshop Decision Wall", 38, p.ink),
    text("subtitle", 82, 116, 720, 24, "A pinned-paper board for synthesis, priorities, and next moves.", 17, p.accent3),
    rect("highlight", 812, 68, 310, 50, p.accent2, p.ink, 2),
    text("highlight-text", 838, 84, 260, 20, "Decision: prototype first", 18, p.ink, "center", "middle"),
  ];
  const notes = [
    [92, 188, "User signal", "3 repeated pain points", p.panel],
    [372, 188, "Constraint", "manual edits matter", "#FFFFFF"],
    [652, 188, "Opportunity", "local editable boards", p.panel],
    [932, 188, "Risk", "prompt bloat", "#FFFFFF"],
    [232, 404, "Next", "ship combine command", p.panel],
    [552, 404, "Owner", "agent workflow docs", "#FFFFFF"],
    [872, 404, "Proof", "preview before share", p.panel],
  ];
  notes.forEach(([x, y, title, body, fill], index) => {
    elements.push(
      rect(`pin-note-${index}`, x, y, 230, 140, fill, p.ink, 2),
      ellipse(`pin-${index}`, x + 104, y - 44, 22, 22, index % 2 ? p.accent2 : p.accent, p.ink, 2),
      text(`pin-title-${index}`, x + 24, y + 28, 182, 24, title, 21, p.ink, "center", "middle"),
      text(`pin-body-${index}`, x + 28, y + 72, 174, 40, body, 16, p.accent3, "center", "middle"),
    );
  });
  return scene("Workshop Decision Wall", "pin-and-paper", elements);
}

function buildHatchWhiteboard() {
  const p = palettes["hatch-whiteboard"];
  const fills = ["#E8F7FA", "#FFF3C4", "#FCE7EC", "#E9F7E6"];
  const elements = [
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 2),
    text("title", 74, 60, 620, 48, "Data Flow Whiteboard", 40, p.ink),
    text("subtitle", 78, 118, 760, 24, "A hand-drawn lineage sketch with stage lanes and readable arrows.", 18, p.accent3),
  ];
  const lanes = [
    [82, 178, "Source"],
    [342, 178, "Transform"],
    [632, 178, "Model"],
    [922, 178, "Serve"],
  ];
  lanes.forEach(([x, y, label], index) => {
    elements.push(
      rect(`hatch-lane-${index}`, x, y, 220, 390, "transparent", p.ink, 2, { customData: { strokeDasharray: "12,10" } }),
      text(`hatch-lane-label-${index}`, x + 34, y + 330, 150, 34, label, 28, p.ink, "center", "middle"),
    );
  });
  const cards = [
    [114, 248, "events"],
    [114, 362, "orders"],
    [382, 276, "map()"],
    [382, 416, "group()"],
    [674, 304, "facts"],
    [674, 436, "dims"],
    [964, 340, "dashboard"],
  ];
  cards.forEach(([x, y, label], index) => {
    elements.push(
      rect(`hatch-card-${index}`, x, y, 138, 62, fills[index % fills.length], p.ink, 2),
      text(`hatch-card-text-${index}`, x + 18, y + 20, 102, 22, label, 21, p.ink, "center", "middle"),
    );
  });
  elements.push(
    arrow("hatch-arrow-0", 252, 278, 130, 30, p.accent3, 2),
    arrow("hatch-arrow-1", 252, 392, 130, 54, p.accent3, 2),
    arrow("hatch-arrow-2", 520, 306, 154, 28, p.accent3, 2),
    arrow("hatch-arrow-3", 520, 446, 154, 18, p.accent3, 2),
    arrow("hatch-arrow-4", 812, 334, 152, 36, p.accent3, 2),
    arrow("hatch-arrow-5", 812, 466, 152, -72, p.accent3, 2),
  );
  return scene("Data Flow Whiteboard", "hatch-whiteboard", elements, {
    roughness: 2,
    elementRoughness: 2,
    currentItemFontFamily: 5,
    elementFontFamily: 5,
  });
}

function buildCrayonStack() {
  const p = palettes["crayon-stack"];
  const elements = [
    rect("frame", 44, 36, 1188, 650, "transparent", p.ink, 4),
    text("title", 82, 60, 620, 54, "Crayon Idea Stack", 44, p.ink),
    text("subtitle", 86, 122, 680, 24, "A loud sketch style for playful roadmap and maker-energy boards.", 18, p.ink),
    rect("top-slab", 820, 70, 300, 72, p.accent2, p.ink, 4),
    text("top-slab-text", 850, 92, 240, 26, "Make it editable", 24, p.ink, "center", "middle"),
  ];
  const stack = [
    [112, 218, 860, 86, p.accent, "01  Capture the messy idea"],
    [172, 318, 860, 86, p.accent2, "02  Convert it into structure"],
    [232, 418, 860, 86, p.accent3, "03  Let the human reshape it"],
    [292, 518, 860, 86, p.panel, "04  Export a clean article image"],
  ];
  stack.forEach(([x, y, width, height, fill, label], index) => {
    shadow(`crayon-shadow-${index}`, elements, x, y, width, height, p.ink, 9);
    elements.push(
      rect(`crayon-layer-${index}`, x, y, width, height, fill, p.ink, 4),
      text(`crayon-label-${index}`, x + 34, y + 30, width - 70, 30, label, 27, index === 2 ? "#FFFFFF" : p.ink),
    );
  });
  elements.push(
    arrow("crayon-arrow", 1066, 276, 64, 276, p.ink, 4),
    ellipse("crayon-dot-a", 1088, 238, 26, 26, p.accent2, p.ink, 4),
    ellipse("crayon-dot-b", 1110, 572, 26, 26, p.accent, p.ink, 4),
  );
  return scene("Crayon Idea Stack", "crayon-stack", elements, { roughness: 2, elementRoughness: 2 });
}

function scene(title, styleId, elements, overrides = {}) {
  const p = palettes[styleId];
  return {
    type: "agentdraw/scene",
    version: 1,
    id: `theme-${styleId}`,
    title,
    styleId,
    providerId: "excalidraw",
    updatedAt: "2026-07-04T00:00:00.000Z",
    elements: elements.map((element) => ({
      ...element,
      ...(overrides.elementRoughness === undefined ? {} : { roughness: overrides.elementRoughness }),
      ...(overrides.elementFontFamily === undefined || element.type !== "text"
        ? {}
        : { fontFamily: overrides.elementFontFamily }),
    })),
    appState: {
      viewBackgroundColor: p.canvas,
      currentItemStrokeColor: p.ink,
      currentItemBackgroundColor: p.panel,
      currentItemFillStyle: "solid",
      currentItemStrokeWidth: 2,
      currentItemStrokeStyle: "solid",
      currentItemRoughness: overrides.roughness ?? 0,
      currentItemFontFamily: overrides.currentItemFontFamily ?? 2,
      currentItemRoundness: overrides.roundness ?? "round",
      currentItemArrowType: "sharp",
      currentItemStartArrowhead: null,
      currentItemEndArrowhead: "arrow",
      scrollX: 80,
      scrollY: 28,
      zoom: { value: 0.78 },
    },
    files: {},
  };
}

function shadow(id, elements, x, y, width, height, color, offset = 12) {
  elements.push(
    rect(id, x + offset, y + offset, width, height, color, color, 0, {
      customData: { role: "shadow" },
    }),
  );
}

function rect(id, x, y, width, height, backgroundColor, strokeColor, strokeWidth, extra = {}) {
  return base(id, "rectangle", x, y, width, height, {
    strokeColor,
    backgroundColor,
    fillStyle: "solid",
    strokeWidth,
    strokeStyle: "solid",
    roughness: extra.roughness ?? 0,
    roundness: extra.roundness ? { type: 3 } : null,
    customData: extra.customData,
  });
}

function ellipse(id, x, y, width, height, backgroundColor, strokeColor, strokeWidth) {
  return base(id, "ellipse", x, y, width, height, {
    strokeColor,
    backgroundColor,
    fillStyle: "solid",
    strokeWidth,
    strokeStyle: "solid",
    roughness: 0,
    roundness: null,
  });
}

function text(id, x, y, width, height, value, fontSize, strokeColor, textAlign = "left", verticalAlign = "top") {
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
    verticalAlign,
    containerId: null,
    originalText: value,
    lineHeight: 1.25,
  });
}

function arrow(id, x, y, width, height, strokeColor, strokeWidth = 2) {
  return base(id, "arrow", x, y, width, height, {
    strokeColor,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth,
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

function elbow(id, x, y, width, height, strokeColor, strokeWidth = 2) {
  return base(id, "arrow", x, y, width, height, {
    strokeColor,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth,
    strokeStyle: "solid",
    roughness: 0,
    points: [
      [0, 0],
      [width * 0.5, 0],
      [width * 0.5, height],
      [width, height],
    ],
    lastCommittedPoint: null,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: "arrow",
    elbowed: true,
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
