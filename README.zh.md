# AgentDraw

[English README](./README.md)

AgentDraw 是一个本地优先、SVG-first、可编辑的白板工作区，面向 Claude Code、Codex、Cursor 或其它 coding agent。

它的目标是让 agent 先生成整齐、可预览的 SVG，再转换成可编辑的 `.agentdraw.json` 画板。用户可以在浏览器里继续手动调整，也可以导出 JSON、SVG 或 PNG。

当前第一个画板 provider 是 Excalidraw。AgentDraw 使用 SVG 作为 agent 友好的源草稿，使用 `.agentdraw.json` 作为浏览器可编辑格式。

Powered by [Excalidraw](https://github.com/excalidraw/excalidraw)。

## 安装

推荐：让你的 coding agent 同时安装 CLI 和 skill。

```text
安装 AgentDraw：
npm install -g @aidraw/agentdraw
npx skills add chenhg5/agentdraw --skill agentdraw -g -y
```

给 agent 的 bootstrap URL：

```text
https://raw.githubusercontent.com/chenhg5/agentdraw/main/INSTALL.md
```

如果只是人手动使用 CLI：

```bash
npm install -g @aidraw/agentdraw
agentdraw --help
agentdraw guide
```

不全局安装也可以直接运行：

```bash
npx @aidraw/agentdraw@latest import-svg board.svg --out board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest open board.agentdraw.json --no-open
```

更多 agent 安装方式见 [INSTALL.md](./INSTALL.md)。

## 画廊

AgentDraw 示例都是可编辑的真实 scene 文件。下面的图片只是 README 预览图；点击图片可以打开对应的 `.agentdraw.json` 源文件。

### 复杂示例

<a href="./examples/complex-agentdraw-workbench.agentdraw.json">
  <img src="./assets/examples/complex-agentdraw-workbench.svg" alt="Complex AgentDraw Workbench preview" />
</a>

### 主题示例

<table>
<tr>
<td width="50%"><a href="./examples/theme-agentdraw-os.agentdraw.json"><img src="./assets/examples/theme-agentdraw-os.svg" alt="AgentDraw Operating System preview" /></a><br />
<sub><a href="./examples/theme-agentdraw-os.agentdraw.json"><b>AgentDraw OS</b></a> · 本地 agent 作图闭环</sub>
</td>
<td width="50%"><a href="./examples/theme-incident-command.agentdraw.json"><img src="./assets/examples/theme-incident-command.svg" alt="Incident Command Center preview" /></a><br />
<sub><a href="./examples/theme-incident-command.agentdraw.json"><b>Incident Command</b></a> · 故障响应和复盘图</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-message-bus.agentdraw.json"><img src="./assets/examples/theme-message-bus.svg" alt="Multi-Agent Message Bus preview" /></a><br />
<sub><a href="./examples/theme-message-bus.agentdraw.json"><b>Message Bus</b></a> · 多 agent 协作图</sub>
</td>
<td width="50%"><a href="./examples/theme-launch-room.agentdraw.json"><img src="./assets/examples/theme-launch-room.svg" alt="Launch Room Loop preview" /></a><br />
<sub><a href="./examples/theme-launch-room.agentdraw.json"><b>Launch Room</b></a> · 增长发布闭环</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-strategy-grove.agentdraw.json"><img src="./assets/examples/theme-strategy-grove.svg" alt="Quarterly Strategy Map preview" /></a><br />
<sub><a href="./examples/theme-strategy-grove.agentdraw.json"><b>Strategy Grove</b></a> · 季度策略图</sub>
</td>
<td width="50%"><a href="./examples/theme-roadmap-mint.agentdraw.json"><img src="./assets/examples/theme-roadmap-mint.svg" alt="Creator Tool Roadmap preview" /></a><br />
<sub><a href="./examples/theme-roadmap-mint.agentdraw.json"><b>Roadmap Mint</b></a> · 创作工具路线图</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-customer-journey.agentdraw.json"><img src="./assets/examples/theme-customer-journey.svg" alt="Customer Journey Signals preview" /></a><br />
<sub><a href="./examples/theme-customer-journey.agentdraw.json"><b>Customer Journey</b></a> · 用户旅程信号图</sub>
</td>
<td width="50%"><a href="./examples/theme-research-synthesis.agentdraw.json"><img src="./assets/examples/theme-research-synthesis.svg" alt="Research Synthesis Wall preview" /></a><br />
<sub><a href="./examples/theme-research-synthesis.agentdraw.json"><b>Research Synthesis</b></a> · 访谈聚类分析图</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-raw-grid.agentdraw.json"><img src="./assets/examples/theme-raw-grid.svg" alt="Scene Quality Matrix preview" /></a><br />
<sub><a href="./examples/theme-raw-grid.agentdraw.json"><b>Raw Grid</b></a> · 严格校验矩阵</sub>
</td>
<td width="50%"><a href="./examples/theme-bold-poster.agentdraw.json"><img src="./assets/examples/theme-bold-poster.svg" alt="Design Systems Win preview" /></a><br />
<sub><a href="./examples/theme-bold-poster.agentdraw.json"><b>Bold Poster</b></a> · 高冲击设计观点图</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-soft-editorial.agentdraw.json"><img src="./assets/examples/theme-soft-editorial.svg" alt="Product Discovery Board preview" /></a><br />
<sub><a href="./examples/theme-soft-editorial.agentdraw.json"><b>Soft Editorial</b></a> · 研究和产品发现板</sub>
</td>
<td width="50%"><a href="./examples/theme-block-frame.agentdraw.json"><img src="./assets/examples/theme-block-frame.svg" alt="Maker Mode Map preview" /></a><br />
<sub><a href="./examples/theme-block-frame.agentdraw.json"><b>BlockFrame</b></a> · 创作工作流图</sub>
</td>
</tr>
</table>

## 为什么做

Agent 直接生成白板 JSON 经常会出现几类稳定问题：文字重叠、标签没居中、连线没有接到目标、坐标不对齐。AgentDraw 把这些问题当成工程问题处理：

- 先用 SVG 生成和预览整齐布局；
- 再转换成可编辑的结构化 JSON，不是截图；
- 风格是可复用设计系统，不是一堆临时颜色；
- 打开前可以先做修复、场景校验和质量评分；
- 最后用户仍然可以在浏览器画板里直接编辑。

## 能力

- SVG-first agent 作图流程，并输出本地 `.agentdraw.json` 可编辑文件。
- 受限 SVG importer，支持 `rect`、`circle`、`ellipse`、`line`、`polyline`、`text/tspan`、group 和箭头 marker。
- 基于 Excalidraw 的可编辑画布。
- 内置 38 个风格，包括正式图表风格，以及从 `beautiful-feishu-whiteboard` 迁移过来的配色。
- CLI 支持打开和校验场景。
- 本地 HTTP API 负责加载和保存当前画板。
- 支持导出 JSON、SVG、PNG。
- 场景校验支持检查文字重叠、图形覆盖、文字垂直居中、连线端点距离、连线穿过文字等问题。

## 快速开始

先把 SVG 转成可编辑画板，再打开：

```bash
npx @aidraw/agentdraw@latest import-svg board.svg --out board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest repair board.agentdraw.json --style boardroom --write --json
npx @aidraw/agentdraw@latest validate board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest open board.agentdraw.json --no-open
```

或者使用仓库源码：

```bash
pnpm install
pnpm build
pnpm agentdraw open examples/complex-agentdraw-workbench.agentdraw.json
```

打开命令输出的 URL。默认本地服务地址是：

```text
http://127.0.0.1:3927
```

如果在 WSL 里工作，但浏览器在另一台机器上，可以在有浏览器的机器上启动：

```bash
pnpm agentdraw open examples/complex-agentdraw-workbench.agentdraw.json --no-open
```

## CLI

发现命令：

```bash
pnpm agentdraw --help
pnpm agentdraw schema open --json
pnpm agentdraw guide styles --json
```

打开画板：

```bash
pnpm agentdraw open examples/getting-started.agentdraw.json
```

只启动服务，不自动打开系统浏览器：

```bash
pnpm agentdraw open examples/getting-started.agentdraw.json --no-open
```

只创建 scene 文件，不启动编辑器：

```bash
pnpm agentdraw init .agentdraw/board.agentdraw.json
```

把受限 SVG 转成可编辑画板：

```bash
pnpm agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style boardroom --title "Agent workflow" --json
```

画板默认直接打开最终场景。只有在明确想看绘制过程时，才用下面任一 URL 参数开启 replay：

```text
?animate=1
?replay=1
```

校验 agent 生成的场景：

```bash
pnpm validate:scene examples/complex-agentdraw-workbench.agentdraw.json
pnpm agentdraw validate examples/complex-agentdraw-workbench.agentdraw.json --format json
```

校验器遇到 layout error 会返回非 0 退出码。warning 会打印出来，但不会让命令失败。推荐 agent 生成图时使用这个流程：

```text
选择风格 -> 加载 design guide + contract -> 生成受限 SVG -> 预览/检查 SVG -> import-svg -> repair -> validate -> quality -> 必要时修改 SVG 重来 -> 打开画板
```

## 示例源文件

画廊图片由这些可编辑源文件生成：

- [`examples/getting-started.agentdraw.json`](./examples/getting-started.agentdraw.json)
- [`examples/complex-agentdraw-workbench.agentdraw.json`](./examples/complex-agentdraw-workbench.agentdraw.json)
- [`examples/theme-agentdraw-os.agentdraw.json`](./examples/theme-agentdraw-os.agentdraw.json)
- [`examples/theme-incident-command.agentdraw.json`](./examples/theme-incident-command.agentdraw.json)
- [`examples/theme-message-bus.agentdraw.json`](./examples/theme-message-bus.agentdraw.json)
- [`examples/theme-launch-room.agentdraw.json`](./examples/theme-launch-room.agentdraw.json)
- [`examples/theme-strategy-grove.agentdraw.json`](./examples/theme-strategy-grove.agentdraw.json)
- [`examples/theme-roadmap-mint.agentdraw.json`](./examples/theme-roadmap-mint.agentdraw.json)
- [`examples/theme-customer-journey.agentdraw.json`](./examples/theme-customer-journey.agentdraw.json)
- [`examples/theme-research-synthesis.agentdraw.json`](./examples/theme-research-synthesis.agentdraw.json)
- [`examples/theme-raw-grid.agentdraw.json`](./examples/theme-raw-grid.agentdraw.json)
- [`examples/theme-bold-poster.agentdraw.json`](./examples/theme-bold-poster.agentdraw.json)
- [`examples/theme-soft-editorial.agentdraw.json`](./examples/theme-soft-editorial.agentdraw.json)
- [`examples/theme-block-frame.agentdraw.json`](./examples/theme-block-frame.agentdraw.json)

重新生成主题示例：

```bash
node scripts/generate-theme-examples.mjs
```

重新生成 README 预览图：

```bash
pnpm examples:previews
```

## SVG-First 格式

推荐让 agent 先生成受限 SVG：

```svg
<svg width="1200" height="760" viewBox="0 0 1200 760" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B" />
    </marker>
  </defs>
  <rect x="80" y="80" width="1040" height="600" rx="10" fill="#FFFFFF" stroke="#172033" />
  <text x="120" y="140" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="750" fill="#172033">System map</text>
</svg>
```

当前 importer 支持 `svg`、`g`、`rect`、`circle`、`ellipse`、`line`、`polyline`、`text`、`tspan`、`defs`、`marker`。文字要保留为真实文本，不要转成 path。可编辑画板里不要使用 `foreignObject`、`image`、`clipPath`、`mask`、`filter`、渐变和任意 path 图形。

## 场景格式

AgentDraw scene 是 `agentdraw import-svg` 生成的浏览器可编辑存储格式。Agent 应该把它当作生成结果，而不是源绘图语言。

只有在修改已有画板的高级场景下，才直接 patch 这些字段：

- `styleId`
- `providerId`
- `elements`
- `appState`
- `files`

浏览器编辑器会把用户的手动修改自动保存回同一个文件。

## 风格

可以在 scene 文件里写 `styleId`，也可以在工具栏里切换。默认风格是：

```text
system-formal
```

风格后续应该是设计系统，而不只是换配色。目标架构见
[`docs/STYLE_SYSTEM.md`](./docs/STYLE_SYSTEM.md)，agent 可读的风格规则会放在
`packages/styles/designs/*/design.md`。

正式图表风格：

- `system-formal`
- `boardroom`
- `blueprint-formal`

其它配色风格按三组组织：

- restrained: `avocado-press`, `grove`, `jade-lens`, `long-table`, `macchiato`, `monochrome`,
  `papier-bleu`, `reading-room`, `salmon-stamp`
- balanced: `apricot-arc`, `berry-pop`, `bold-poster`, `checker-bloom`, `cobalt-bloom`, `coral`,
  `cut-bloom`, `editorial-forest`, `lime-slab`, `linen-cut`, `pin-and-paper`, `raw-grid`,
  `riptide-cobalt`, `soft-editorial`, `violet-marker`
- bold: `block-frame`, `burst-panel`, `confetti-wedge`, `court-press`, `crayon-stack`,
  `grove-block`, `mint-brut`, `neo-grid-bold`, `riso-brut`, `specimen-bold`, `stencil-tablet`

高正式度风格会使用更方正的几何形状、零 roughness、sans 字体和 elbow-style 默认连线。低正式度风格会保留更明显的 Excalidraw 手绘感。

## 校验

场景校验器是轻量级的，不是完整视觉渲染器。它用于在打开浏览器前提前发现常见问题：

- 文字 bounding box 重叠；
- 非包含关系的图形异常覆盖；
- 短容器里的文字组明显偏离垂直中心；
- 连线端点离最近图形太远；
- 连线穿过文字 bounding box。

重要图仍然建议打开浏览器检查一遍。

## 开发

```bash
pnpm install
pnpm typecheck
pnpm build
```

## Agent Skill

其它 agent 应该安装 [`skills/agentdraw/SKILL.md`](./skills/agentdraw/SKILL.md)，然后通过 CLI 读取版本匹配的作图指南：

```bash
agentdraw guide styles --json
agentdraw guide style system-formal --format text
agentdraw guide quality --format text
```

## 评估

可以用 [`evals/`](./evals) 检查这个 skill 是否真的能产出有用、可编辑、有设计感的画板。第一版 eval 包含真实 prompt 和一个 24 分 rubric，覆盖任务命中、结构、视觉设计、可读性、连线质量和校验结果。

开发模式同时启动 web 和 API：

```bash
pnpm dev
```

目录结构：

```text
apps/web/          浏览器编辑器
packages/cli/      agentdraw 命令
packages/server/   本地 HTTP 服务
packages/scene/    scene 读写和校验
packages/styles/   风格目录和渲染 profile
examples/          示例场景
scripts/           仓库工具脚本
```

## 仓库

```bash
git remote add origin git@github.com:chenhg5/agentdraw.git
```

## License

[MIT](./LICENSE)

AgentDraw 基于 [Excalidraw](https://github.com/excalidraw/excalidraw) 构建。
