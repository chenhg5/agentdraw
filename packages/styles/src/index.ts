export type StyleLevel = "restrained" | "balanced" | "bold";
export type StyleFormality = "low" | "medium" | "high";
export type StyleGeometry = "organic" | "clean" | "formal";

export type StyleRenderProfile = {
  geometry: StyleGeometry;
  roughness: number;
  strokeWidth: number;
  roundness: "round" | "sharp";
  fontFamily: "hand" | "sans" | "mono";
  arrowType: "sharp" | "round" | "elbow";
};

export type AgentDrawStyle = {
  id: string;
  name: string;
  level: StyleLevel;
  formality: StyleFormality;
  vibe: string;
  palette: {
    canvas: string;
    ink: string;
    panel: string;
    accent: string;
    accent2: string;
    accent3: string;
    muted: string;
  };
};

export type DesignContract = {
  id: string;
  name: string;
  version: 1;
  summary: string;
  level: StyleLevel;
  formality: StyleFormality;
  palette: AgentDrawStyle["palette"];
  allowedColors: string[];
  typography: {
    fontFamily: StyleRenderProfile["fontFamily"];
    titlePx: [number, number];
    headingPx: [number, number];
    bodyPx: [number, number];
    maxTypeSizesPerBoard: number;
  };
  geometry: {
    roughness: [number, number];
    strokeWidth: [number, number];
    cornerRadiusPx: [number, number];
    preferredShapes: string[];
  };
  layout: {
    gridPx: number;
    minMajorGapPx: number;
    minConnectorTextGapPx: number;
    density: "low" | "medium" | "high";
  };
  connectors: {
    preferred: StyleRenderProfile["arrowType"];
    minStrokeWidth: number;
    avoidTextCrossing: boolean;
    avoidHeaderCrossing: boolean;
  };
  agentRules: string[];
  avoid: string[];
};

export type DesignContractIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
  elementIds?: string[];
};

export const defaultStyleId = "system-formal";

export const styles: AgentDrawStyle[] = [
  style("system-formal", "System Formal", "restrained", "high", "product diagram, square, Helvetica, low ornament", "#FFFFFF", "#172033", "#F7F9FC", "#2563EB", "#D8E5FF", "#64748B"),
  style("boardroom", "Boardroom", "restrained", "high", "consulting slide, precise, quiet professional", "#FFFFFF", "#182230", "#F8FAFC", "#4053D6", "#E7EEF8", "#667085"),
  style("blueprint-formal", "Blueprint Formal", "restrained", "high", "technical diagram, blue ink, structured", "#F8FBFF", "#163B68", "#FFFFFF", "#0B63CE", "#DBEAFE", "#5B708A"),
  style("runtime-doc", "Runtime Doc", "restrained", "high", "warm technical document, TOC rail, callouts", "#FBFAF7", "#202124", "#FFFFFF", "#275CAD", "#F4F1EA", "#626A73"),
  style("slate-notes", "Slate Notes", "restrained", "high", "clean spec notes, slate panels, calm accents", "#FFFFFF", "#334155", "#F8FAFC", "#6B8CAE", "#E2E8F0", "#64748B"),
  style("manual-cream", "Manual Cream", "restrained", "high", "retro manual, cream paper, dark ruled diagrams", "#EDE8DC", "#2C2416", "#F5F1E8", "#B85C38", "#E8DCC8", "#5A4A38"),
  style("avocado-press", "Avocado Press", "restrained", "medium", "clean duotone, white with blue and lime", "#FFFFFF", "#0055A4", "#F4FAEE", "#0055A4", "#DCF4A2", "#1A1A1A"),
  style("grove", "Grove", "restrained", "high", "editorial, grounded, parchment and forest green", "#E8E4D6", "#192B1B", "#F4EFE2", "#192B1B", "#C8524A", "#766C58"),
  style("jade-lens", "Jade Lens", "restrained", "high", "calm, harmonious, minimal green", "#F5F1EE", "#1E2421", "#FFFFFF", "#2BA483", "#D9ECE5", "#6D7771"),
  style("long-table", "Long Table", "restrained", "medium", "warm, rustic, single rust ink, menu like", "#FAF1E2", "#B53D2A", "#FFF8EE", "#B53D2A", "#E8C4AF", "#5B3A2E"),
  style("espresso-paper", "Espresso Paper", "restrained", "high", "warm executive paper, almond and espresso, premium", "#EDE7DD", "#25211B", "#F8F3EA", "#6E6558", "#D2C6B7", "#403B32"),
  style("inkline", "Inkline", "restrained", "high", "quiet, minimal, text first, no chromatic accent", "#FAFADF", "#1A1A16", "#FFFFFF", "#5E5E54", "#E7E7C8", "#3D3D36"),
  style("papier-bleu", "Papier Bleu", "restrained", "medium", "Matisse calm, artful, airy", "#FAF3EB", "#1A3C8F", "#FFFFFF", "#72D0E9", "#1A3C8F", "#6D7FA6"),
  style("archive-shelf", "Archive Shelf", "restrained", "high", "quiet, literary, catalog cards, institutional", "#F6EBD8", "#2A231C", "#FFF7EA", "#DE916A", "#D6C7CC", "#6C5C4B"),
  style("salmon-stamp", "Salmon Stamp", "restrained", "low", "clean stamp poster, white with salmon and green", "#FFFFFF", "#1A1A1A", "#FFF3F0", "#F0AE9E", "#049550", "#35483C"),
  style("apricot-arc", "Apricot Arc", "balanced", "medium", "warm, retro, geometric, friendly", "#FFF8EE", "#261B14", "#FFFFFF", "#F69834", "#F9C2BD", "#82501B"),
  style("berry-pop", "Berry Pop", "balanced", "medium", "fruity, fresh, white with raspberry and periwinkle", "#FFFFFF", "#171717", "#F8F3F7", "#9E2B50", "#C7D2F0", "#565A88"),
  style("bold-poster", "Bold Poster", "balanced", "medium", "loud type, print poster, single red accent", "#FFFFFF", "#1C1410", "#FFF1EF", "#D8000F", "#F4C7C1", "#5A2A23"),
  style("checker-bloom", "Checker Bloom", "balanced", "low", "playful, hand painted, mint with blue and green", "#E8F1DD", "#1E2620", "#FFFFFF", "#2C6EE0", "#5E9E4A", "#A7D2A0"),
  style("cobalt-bloom", "Cobalt Bloom", "balanced", "medium", "oversized type, fashion editorial, confident", "#DDA8A2", "#171717", "#F1C8C3", "#4746C6", "#FFFFFF", "#6B4A7D"),
  style("coral", "Coral", "balanced", "medium", "warm, friendly, clean, signature coral", "#F5F0E8", "#1A1A1A", "#FFFFFF", "#E85D5D", "#F4B1A3", "#6B5248"),
  style("cut-bloom", "Cut Bloom", "balanced", "medium", "calm, warm, soft colour blocks", "#FFFFFF", "#1A1A1A", "#FFF7E1", "#535D9E", "#F0CB65", "#E9A8B0"),
  style("editorial-forest", "Editorial Forest", "balanced", "high", "literary, bookish, forest green and rose", "#EFE7D4", "#1E241A", "#FBF6EA", "#2E4A2A", "#E89CB1", "#7A6C58"),
  style("lime-slab", "Lime Slab", "balanced", "medium", "electric, bold, modern SaaS", "#EEFA79", "#0A0A05", "#FFFFF2", "#0A0A05", "#C6D938", "#5F6B0E"),
  style("linen-cut", "Linen Cut", "balanced", "high", "mid century modernist, tasteful, calm", "#E4D2C4", "#1D2620", "#F7EEE7", "#044D99", "#04B24F", "#8C6757"),
  style("pin-and-paper", "Pin & Paper", "balanced", "medium", "clean, graphic, white with yellow and blue pop", "#FFFFFF", "#161616", "#FFFBE1", "#2A3C99", "#F1E84E", "#576196"),
  style("raw-grid", "Raw Grid", "balanced", "medium", "system native, sharp, digital brutalism", "#FFFFFF", "#0A0A0A", "#F8F8F8", "#0A0A0A", "#F2D4CF", "#5B5B5B"),
  style("riptide-cobalt", "Riptide Cobalt", "balanced", "medium", "bold poster, low density, high impact", "#FDF0E0", "#1A2240", "#FFFFFF", "#375DFE", "#DCE4FF", "#6D5A45"),
  style("incident-dark", "Incident Dark", "balanced", "high", "dark operational report, RCA, timeline evidence", "#0D1117", "#E6EDF3", "#161B22", "#58A6FF", "#1C2330", "#9AA7B4"),
  style("soft-pop", "Soft Pop", "balanced", "medium", "friendly product board, teal and yellow, approachable", "#EFF1F5", "#2D3748", "#FFFFFF", "#73D1C8", "#FCD34D", "#5D6D7E"),
  style("soft-editorial", "Soft Editorial", "balanced", "medium", "warm magazine, soft pastels, gentle", "#ECE9DC", "#202018", "#FFFFFF", "#E2A8CE", "#C9DA4F", "#8A786A"),
  style("violet-marker", "Violet Marker", "balanced", "low", "highlighter, white with violet and lime, modern", "#FFFFFF", "#171717", "#F8F4FF", "#C5A1FF", "#CFEE30", "#5E4A88"),
  style("block-frame", "BlockFrame", "bold", "low", "maximalist, candy, playful, sticker book", "#FFFDF5", "#000000", "#FFFFFF", "#FE90E8", "#C0F7FE", "#FCC715"),
  style("burst-panel", "Burst Panel", "bold", "low", "loud, energetic, dashboard", "#FBD65A", "#1E1E1E", "#FFF2B6", "#CFACE8", "#FFFFFF", "#9D5A36"),
  style("confetti-wedge", "Confetti Wedge", "bold", "low", "playful, breezy, celebratory pastel", "#F4F8FB", "#1E252B", "#FFFFFF", "#F8BED4", "#62C0A5", "#6F93D8"),
  style("court-press", "Court Press", "bold", "low", "sporty, athletic, energetic clash", "#F2EFE6", "#1F251B", "#FFFFFF", "#66914C", "#DA9EB7", "#E7C85E"),
  style("crayon-stack", "Crayon Stack", "bold", "low", "primary crayon brights, loud, fun", "#FFFFFF", "#151515", "#FFF3EC", "#FF472B", "#D3FE79", "#2F65FF"),
  style("grove-block", "Grove Block", "bold", "medium", "brand forward, flat, confident green", "#F7F1EC", "#17211A", "#FFFFFF", "#008248", "#F6BDDA", "#FCC715"),
  style("mint-brut", "Mint Brut", "bold", "low", "candy, friendly, app like", "#D0FDE4", "#000000", "#FFFFFF", "#F888C8", "#A7E7FF", "#6DD89E"),
  style("neon-grid", "Neon Grid", "bold", "medium", "dark cybernetic grid, cyan rails, magenta exceptions", "#051423", "#D9FBFF", "#071B2C", "#00F2FF", "#FF4FD8", "#235064"),
  style("neo-grid-bold", "Neo-Grid Bold", "bold", "medium", "editorial grid, bold, structured", "#F5F4EF", "#0A0A0A", "#FFFFFF", "#0A0A0A", "#E6FF3D", "#A9A9A1"),
  style("riso-brut", "Riso Brut", "bold", "medium", "neo brutalist editorial, confident, designed", "#EFE9D9", "#1E1B16", "#FFF8E8", "#1F8A4C", "#F06CA8", "#E85A1F"),
  style("specimen-bold", "Specimen Bold", "bold", "low", "type specimen, graphic, loud", "#F3F3F3", "#2E302E", "#FFFFFF", "#3EC06A", "#FBEF4A", "#8B8F87"),
  style("stencil-tablet", "Stencil & Tablet", "bold", "low", "skate poster, retro print blocks, bold", "#E2DCC9", "#201A17", "#F4ECD8", "#EE7A2E", "#C73B7A", "#2D7E73"),
];

export const styleGroups = [
  group("restrained"),
  group("balanced"),
  group("bold"),
];

export function getStyleById(id: string | null | undefined) {
  return (
    styles.find((candidate) => candidate.id === id) ??
    styles.find((candidate) => candidate.id === defaultStyleId)!
  );
}

export function getStylesByLevel(level: StyleLevel) {
  return styles.filter((candidate) => candidate.level === level);
}

export function getStyleRenderProfile(style: AgentDrawStyle): StyleRenderProfile {
  if (style.formality === "high") {
    return {
      geometry: "formal",
      roughness: 0,
      strokeWidth: 2,
      roundness: "sharp",
      fontFamily: "sans",
      arrowType: "elbow",
    };
  }
  if (style.formality === "medium") {
    return {
      geometry: "clean",
      roughness: 0,
      strokeWidth: 2,
      roundness: "round",
      fontFamily: "sans",
      arrowType: "sharp",
    };
  }
  return {
    geometry: "organic",
    roughness: 1,
    strokeWidth: 2,
    roundness: "round",
    fontFamily: "sans",
    arrowType: "round",
  };
}

export function getDesignContract(styleOrId: AgentDrawStyle | string): DesignContract {
  const style = typeof styleOrId === "string" ? getStyleById(styleOrId) : styleOrId;
  const profile = getStyleRenderProfile(style);
  const formal = style.formality === "high";
  const playful = style.formality === "low";
  return {
    id: style.id,
    name: style.name,
    version: 1,
    summary: style.vibe,
    level: style.level,
    formality: style.formality,
    palette: style.palette,
    allowedColors: uniqueColors([
      style.palette.canvas,
      style.palette.ink,
      style.palette.panel,
      style.palette.accent,
      style.palette.accent2,
      style.palette.accent3,
      style.palette.muted,
      ...neutralContractColors(style),
      ...semanticContractColors(style),
      "#FFFFFF",
      "#000000",
      "transparent",
    ]),
    typography: {
      fontFamily: profile.fontFamily,
      titlePx: playful ? [36, 54] : formal ? [34, 44] : [32, 46],
      headingPx: playful ? [20, 30] : formal ? [20, 26] : [19, 28],
      bodyPx: playful ? [15, 20] : formal ? [15, 19] : [15, 19],
      maxTypeSizesPerBoard: ["runtime-doc", "incident-dark"].includes(style.id) ? 8 : formal ? 4 : 5,
    },
    geometry: {
      roughness: profile.roughness === 0 ? [0, 0] : [0, 2],
      strokeWidth: formal ? [1, 3] : playful ? [2, 5] : [1, 4],
      cornerRadiusPx: profile.roundness === "sharp" ? [0, 6] : playful ? [6, 16] : [4, 12],
      preferredShapes: formal
        ? ["rectangle", "diamond", "line", "arrow"]
        : ["rectangle", "ellipse", "diamond", "line", "arrow"],
    },
    layout: {
      gridPx: formal ? 8 : 6,
      minMajorGapPx: formal ? 32 : 24,
      minConnectorTextGapPx: 16,
      density: style.level === "restrained" ? "medium" : style.level === "bold" ? "low" : "medium",
    },
    connectors: {
      preferred: profile.arrowType,
      minStrokeWidth: 2,
      avoidTextCrossing: true,
      avoidHeaderCrossing: true,
    },
    agentRules: [
      "Use the design contract as a constraint, not inspiration.",
      "The selected style must change layout, typography, geometry, components, and connector treatment.",
      "Use only contract palette colors unless the user explicitly asks for a custom brand color.",
      "Do not introduce generic success green, warning orange, or random semantic colors unless they are part of the selected palette.",
      "Use the contract font family; default AgentDraw themes use sans text for multilingual readability.",
      "Use title-size text for one clear title, heading-size text for section labels, and body-size text for content. Create hierarchy with size, contrast, and spacing rather than emoji.",
      "Avoid emoji and decorative pictograms unless the user explicitly asks for them.",
      ...(formal
        ? ["For architecture, layered system, and workflow boards, add an outer frame, canvas boundary, or titled system region so the diagram reads as a complete artifact."]
        : []),
      "Keep every label editable and contained inside its visual region.",
      "Run agentdraw validate before opening or delivering the board.",
    ],
    avoid: [
      "palette-only restyling",
      "handwritten or sketch fonts unless explicitly requested by the user",
      "emoji used as icons, bullets, or status markers",
      "uncontained or clipped text",
      "connectors crossing labels, titles, or table headers",
      "unmarked decorative overlaps",
      formal ? "hand-drawn roughness" : "generic default rectangles",
    ],
  };
}

export function validateDesignGuide(
  styleOrId: AgentDrawStyle | string,
  markdown: string,
): DesignContractIssue[] {
  const style = typeof styleOrId === "string" ? getStyleById(styleOrId) : styleOrId;
  const issues: DesignContractIssue[] = [];
  const normalized = markdown.toLowerCase();
  const frontmatterName = markdown.match(/^---[\s\S]*?\nname:\s*(.+)$/m)?.[1]?.trim();

  if (!normalized.includes(`# ${style.name.toLowerCase()}`)) {
    issues.push({
      severity: "warning",
      code: "missing-style-title",
      message: `Guide should include an H1 matching the style name: ${style.name}.`,
    });
  }
  if (frontmatterName && frontmatterName.replace(/^["']|["']$/g, "") !== style.name) {
    issues.push({
      severity: "warning",
      code: "frontmatter-name-mismatch",
      message: `Frontmatter name "${frontmatterName}" does not match catalog name "${style.name}".`,
    });
  }

  const requiredSections = [
    ["palette", "Palette"],
    ["typography", "Typography"],
    ["layout", "Layout"],
    ["avoid", "Avoid"],
  ] as const;
  for (const [needle, label] of requiredSections) {
    if (!normalized.includes(`## ${needle}`)) {
      issues.push({
        severity: "error",
        code: "missing-required-section",
        message: `Design guide must include a "${label}" section.`,
      });
    }
  }
  if (!normalized.includes("## components") && !normalized.includes("components")) {
    issues.push({
      severity: "warning",
      code: "missing-components-guidance",
      message: "Design guide should define reusable component treatments, not only colors.",
    });
  }
  if (!normalized.includes("connector")) {
    issues.push({
      severity: "warning",
      code: "missing-connector-guidance",
      message: "Design guide should explain connector style and routing expectations.",
    });
  }

  const paletteValues = Object.values(style.palette).map((value) => value.toLowerCase());
  const mentionedColors = paletteValues.filter((color) => normalized.includes(color.toLowerCase()));
  if (mentionedColors.length < Math.min(4, paletteValues.length)) {
    issues.push({
      severity: "warning",
      code: "palette-under-specified",
      message: "Design guide should mention the main palette colors from the catalog.",
    });
  }

  return issues;
}

export function validateSceneAgainstDesignContract(
  scene: { styleId?: string; elements?: unknown[] },
  styleOrId?: AgentDrawStyle | string,
): DesignContractIssue[] {
  const style = styleOrId
    ? typeof styleOrId === "string"
      ? getStyleById(styleOrId)
      : styleOrId
    : getStyleById(scene.styleId);
  const contract = getDesignContract(style);
  const allowed = new Set(contract.allowedColors.map(normalizeColor));
  const issues: DesignContractIssue[] = [];
  const elements = Array.isArray(scene.elements) ? scene.elements.filter(isElementRecord) : [];
  const typeSizes = new Set<number>();

  if (scene.styleId && scene.styleId !== style.id) {
    issues.push({
      severity: "warning",
      code: "style-id-mismatch",
      message: `Scene styleId is "${scene.styleId}" but validation used "${style.id}".`,
    });
  }

  for (const element of elements) {
    const colors = [
      ["strokeColor", element.strokeColor],
      ["backgroundColor", element.backgroundColor],
    ] as const;
    for (const [field, value] of colors) {
      if (typeof value !== "string" || value === "transparent") {
        continue;
      }
      if (!allowed.has(normalizeColor(value))) {
        issues.push({
          severity: "warning",
          code: "color-outside-contract",
          message: `${field} "${value}" is outside the ${style.id} design contract palette.`,
          elementIds: [element.id],
        });
      }
    }

    if (typeof element.roughness === "number") {
      const [min, max] = contract.geometry.roughness;
      if (element.roughness < min || element.roughness > max) {
        issues.push({
          severity: "warning",
          code: "roughness-outside-contract",
          message: `Element roughness ${element.roughness} is outside the contract range ${min}-${max}.`,
          elementIds: [element.id],
        });
      }
    }
    if (typeof element.strokeWidth === "number" && !isFilledBandWithoutStroke(element)) {
      const [min, max] = contract.geometry.strokeWidth;
      if (element.strokeWidth < min || element.strokeWidth > max) {
        issues.push({
          severity: "warning",
          code: "stroke-width-outside-contract",
          message: `Element strokeWidth ${element.strokeWidth} is outside the contract range ${min}-${max}.`,
          elementIds: [element.id],
        });
      }
    }
    if (
      element.type === "rectangle" &&
      contract.geometry.cornerRadiusPx[1] <= 6 &&
      element.roundness !== null &&
      element.roundness !== undefined
    ) {
      issues.push({
        severity: "warning",
        code: "corner-radius-outside-contract",
        message: `Rectangle uses Excalidraw roundness, but ${style.id} expects square or lightly rounded corners (${contract.geometry.cornerRadiusPx[0]}-${contract.geometry.cornerRadiusPx[1]}px).`,
        elementIds: [element.id],
      });
    }
    if (element.type === "text" && typeof element.fontSize === "number") {
      if (
        typeof element.fontFamily === "number" &&
        element.fontFamily !== excalidrawFontFamily(contract.typography.fontFamily)
      ) {
        issues.push({
          severity: "warning",
          code: "font-family-outside-contract",
          message: `Text fontFamily ${element.fontFamily} does not match the ${contract.typography.fontFamily} font required by the design contract.`,
          elementIds: [element.id],
        });
      }
      typeSizes.add(element.fontSize);
      const [min, max] = contract.typography.bodyPx;
      const [headingMin, headingMax] = contract.typography.headingPx;
      const [titleMin, titleMax] = contract.typography.titlePx;
      const inBodyRange = element.fontSize >= min && element.fontSize <= max;
      const inHeadingRange = element.fontSize >= headingMin && element.fontSize <= headingMax;
      const inTitleRange = element.fontSize >= titleMin && element.fontSize <= titleMax;
      if (!inBodyRange && !inHeadingRange && !inTitleRange) {
        issues.push({
          severity: "warning",
          code: "font-size-outside-contract",
          message: `Text fontSize ${element.fontSize}px is outside the expected body/title ranges.`,
          elementIds: [element.id],
        });
      }
    }
  }

  if (typeSizes.size > contract.typography.maxTypeSizesPerBoard) {
    issues.push({
      severity: "warning",
      code: "too-many-type-sizes",
      message: `Board uses ${typeSizes.size} text sizes; contract allows at most ${contract.typography.maxTypeSizesPerBoard}.`,
    });
  }

  return issues;
}

function group(level: StyleLevel) {
  return {
    level,
    styles: getStylesByLevel(level),
  };
}

function uniqueColors(values: string[]) {
  return Array.from(new Set(values.map((value) => value.toUpperCase())));
}

function neutralContractColors(style: AgentDrawStyle) {
  if (style.formality !== "high") {
    return [];
  }
  return [
    "#CBD5E1",
    "#E2E8F0",
    "#F8FAFC",
    "#475569",
    "#EAF1FF",
  ];
}

function semanticContractColors(style: AgentDrawStyle) {
  if (style.id === "runtime-doc") {
    return [
      "#E2DFD8",
      "#F2EFE8",
      "#E8EEFB",
      "#C9D6EE",
      "#4C545F",
      "#1E7B58",
      "#E7F6EF",
      "#946200",
      "#FFF3D8",
      "#CDD9F0",
      "#F5F7FC",
    ];
  }
  if (style.id === "incident-dark") {
    return [
      "#2A3340",
      "#1D3350",
      "#CFE6FF",
      "#F85149",
      "#3FB950",
      "#D29922",
      "#BC8CFF",
      "#3A1D1D",
      "#5C2B2B",
      "#FF9B94",
      "#0A0E14",
      "#7EE787",
      "#06121F",
    ];
  }
  if (style.id === "slate-notes") {
    return ["#CBD5E1", "#D4E1EE", "#D5E8DC", "#73A78D", "#F0E0D6", "#CB9B7A"];
  }
  if (style.id === "soft-pop") {
    return ["#DCE2EA", "#566573"];
  }
  if (style.id === "neon-grid") {
    return ["#FF4FD8", "#C77DFF", "#7CE38B"];
  }
  return [];
}

function normalizeColor(value: string) {
  return value.trim().toUpperCase();
}

function excalidrawFontFamily(fontFamily: StyleRenderProfile["fontFamily"]) {
  if (fontFamily === "sans") {
    return 2;
  }
  if (fontFamily === "mono") {
    return 3;
  }
  return 1;
}

function isElementRecord(element: unknown): element is Record<string, unknown> & { id: string } {
  return Boolean(
    element &&
      typeof element === "object" &&
      typeof (element as { id?: unknown }).id === "string" &&
      !(element as { isDeleted?: unknown }).isDeleted,
  );
}

function isFilledBandWithoutStroke(element: Record<string, unknown>) {
  return (
    typeof element.backgroundColor === "string" &&
    element.backgroundColor !== "transparent" &&
    (element.strokeColor === "transparent" || element.strokeWidth === 0)
  );
}

function style(
  id: string,
  name: string,
  level: StyleLevel,
  formality: StyleFormality,
  vibe: string,
  canvas: string,
  ink: string,
  panel: string,
  accent: string,
  accent2: string,
  accent3: string,
): AgentDrawStyle {
  return {
    id,
    name,
    level,
    formality,
    vibe,
    palette: {
      canvas,
      ink,
      panel,
      accent,
      accent2,
      accent3,
      muted: mix(canvas, ink, 0.28),
    },
  };
}

function mix(a: string, b: string, amount: number) {
  const left = hexToRgb(a);
  const right = hexToRgb(b);
  return rgbToHex({
    r: Math.round(left.r + (right.r - left.r) * amount),
    g: Math.round(left.g + (right.g - left.g) * amount),
    b: Math.round(left.b + (right.b - left.b) * amount),
  });
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(rgb: { r: number; g: number; b: number }) {
  return `#${[rgb.r, rgb.g, rgb.b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}
