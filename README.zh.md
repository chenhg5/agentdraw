# AgentDraw

[English README](./README.md)

[![npm version](https://img.shields.io/npm/v/@aidraw/agentdraw?color=182230)](https://www.npmjs.com/package/@aidraw/agentdraw)
[![license: MIT](https://img.shields.io/badge/license-MIT-1F8A4C.svg)](./LICENSE)
[![SVG-first](https://img.shields.io/badge/SVG--first-editable%20boards-4053D6)](#核心理念)
[![local-first](https://img.shields.io/badge/local--first-browser%20editor-0B63CE)](#为什么选择-agentdraw)
[![powered by Excalidraw](https://img.shields.io/badge/powered%20by-Excalidraw-6965DB)](https://github.com/excalidraw/excalidraw)
[![agent ready](https://img.shields.io/badge/agent--ready-Codex%20%7C%20Claude%20Code%20%7C%20Cursor-1E1B16)](./skills/agentdraw/SKILL.md)

AgentDraw 帮助 coding agent 生成可编辑的图表、文章配图和说明类白板。

你可以让 Claude Code、Codex、Cursor 或其它 agent 先生成整齐的 SVG 或 Mermaid，再转换成可编辑的
`.agentdraw.json`，在本地浏览器里继续手动调整，并导出 JSON、SVG 或 PNG。

## 安装

推荐用于 agent 工作流：

```bash
npm install -g @aidraw/agentdraw
npx skills add agentdraw/agentdraw --skill agentdraw -g -y
```

给 agent 的 bootstrap URL：

```text
https://raw.githubusercontent.com/agentdraw/agentdraw/main/INSTALL.md
```

只使用 CLI：

```bash
npm install -g @aidraw/agentdraw
agentdraw --help
agentdraw guide
```

不全局安装也可以：

```bash
npx @aidraw/agentdraw@latest import-svg board.svg --out board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest open board.agentdraw.json --background --open
```

## 快速开始

把 SVG 草稿转换成可编辑本地画板：

```bash
npx @aidraw/agentdraw@latest import-svg board.svg --out board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest repair board.agentdraw.json --style boardroom --write --json
npx @aidraw/agentdraw@latest validate board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest open board.agentdraw.json --background --open
```

标准结构图可以用 Mermaid：

```bash
npx @aidraw/agentdraw@latest import-mermaid flow.mmd --out flow.agentdraw.json --style blueprint-formal --json
```

从仓库源码运行：

```bash
pnpm install
pnpm build
pnpm agentdraw open examples/complex-agentdraw-workbench.agentdraw.json --background --open
```

## 画廊

AgentDraw 示例都是真实可编辑 scene。README 里展示的是预览图；点击图片可以打开对应的
`.agentdraw.json` 源文件。

### 复杂示例

<a href="./examples/complex-agentdraw-workbench.agentdraw.json">
  <img src="./assets/examples/complex-agentdraw-workbench.svg" alt="Complex AgentDraw Workbench preview" />
</a>

<details open>
<summary><b>主题示例</b> · 内置设计系统和视觉风格</summary>

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
<tr>
<td width="50%"><a href="./examples/theme-pin-and-paper.agentdraw.json"><img src="./assets/examples/theme-pin-and-paper.svg" alt="Workshop Decision Wall preview" /></a><br />
<sub><a href="./examples/theme-pin-and-paper.agentdraw.json"><b>Pin & Paper</b></a> · 研讨会和协作便签板</sub>
</td>
<td width="50%"><a href="./examples/theme-hatch-whiteboard.agentdraw.json"><img src="./assets/examples/theme-hatch-whiteboard.svg" alt="Data Flow Whiteboard preview" /></a><br />
<sub><a href="./examples/theme-hatch-whiteboard.agentdraw.json"><b>Hatch Whiteboard</b></a> · 手绘数据白板</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-crayon-stack.agentdraw.json"><img src="./assets/examples/theme-crayon-stack.svg" alt="Crayon Idea Stack preview" /></a><br />
<sub><a href="./examples/theme-crayon-stack.agentdraw.json"><b>Crayon Stack</b></a> · 玩具感想法堆叠图</sub>
</td>
<td width="50%"></td>
</tr>
</table>
</details>

<details open>
<summary><b>数据白板示例</b> · 手绘风格的可编辑数据流白板</summary>

这些示例使用 [`Hatch Whiteboard`](./packages/styles/designs/hatch-whiteboard/design.md) 和
[`data-flow-whiteboard-patterns.md`](./skills/agentdraw/method/data-flow-whiteboard-patterns.md)
里的规则。

<table>
<tr>
<td width="50%"><a href="./examples/data-whiteboard/01-transform-lanes.agentdraw.json"><img src="./assets/data-whiteboard/01-transform-lanes.svg" alt="Transform Lanes data whiteboard preview" /></a><br />
<sub><a href="./examples/data-whiteboard/01-transform-lanes.agentdraw.json"><b>D01 Transform Lanes</b></a> · 类 MapReduce 的分阶段转换</sub>
</td>
<td width="50%"><a href="./examples/data-whiteboard/02-warehouse-layer-ladder.agentdraw.json"><img src="./assets/data-whiteboard/02-warehouse-layer-ladder.svg" alt="Warehouse Layer Ladder data whiteboard preview" /></a><br />
<sub><a href="./examples/data-whiteboard/02-warehouse-layer-ladder.agentdraw.json"><b>D02 Warehouse Layer Ladder</b></a> · 数仓分层血缘图</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/data-whiteboard/03-spaghetti-to-structure.agentdraw.json"><img src="./assets/data-whiteboard/03-spaghetti-to-structure.svg" alt="Spaghetti To Structure data whiteboard preview" /></a><br />
<sub><a href="./examples/data-whiteboard/03-spaghetti-to-structure.agentdraw.json"><b>D03 Spaghetti To Structure</b></a> · 从混乱依赖到治理结构</sub>
</td>
<td width="50%"><a href="./examples/data-whiteboard/04-governance-swimlanes.agentdraw.json"><img src="./assets/data-whiteboard/04-governance-swimlanes.svg" alt="Governance Swimlanes data whiteboard preview" /></a><br />
<sub><a href="./examples/data-whiteboard/04-governance-swimlanes.agentdraw.json"><b>D04 Governance Swimlanes</b></a> · 数据治理泳道图</sub>
</td>
</tr>
</table>
</details>

<details open>
<summary><b>版式示例</b> · 表达结构，不只是换颜色</summary>

版式规则见 [`editorial-layouts.md`](./skills/agentdraw/method/editorial-layouts.md)。

<table>
<tr>
<td width="50%"><a href="./examples/layouts/01-monochrome-big-number.agentdraw.json"><img src="./assets/layouts/01-monochrome-big-number.svg" alt="Monochrome Big Number layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e01-monochrome-big-number"><b>E01 Monochrome Big Number</b></a> · 三阶段论点表达</sub>
</td>
<td width="50%"><a href="./examples/layouts/02-reading-room-overlap.agentdraw.json"><img src="./assets/layouts/02-reading-room-overlap.svg" alt="Reading Room Overlap layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e02-reading-room-overlap"><b>E02 Reading Room Overlap</b></a> · 平静观点和错落面板</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/03-swiss-statement-grid.agentdraw.json"><img src="./assets/layouts/03-swiss-statement-grid.svg" alt="Swiss Statement Grid layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e03-swiss-statement-grid"><b>E03 Swiss Statement Grid</b></a> · 结论主张加证据网格</sub>
</td>
<td width="50%"><a href="./examples/layouts/04-editorial-sidebar.agentdraw.json"><img src="./assets/layouts/04-editorial-sidebar.svg" alt="Editorial Sidebar layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e04-editorial-sidebar"><b>E04 Editorial Sidebar</b></a> · 非对称文章配图</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/05-poster-ledger.agentdraw.json"><img src="./assets/layouts/05-poster-ledger.svg" alt="Poster Ledger layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e05-poster-ledger"><b>E05 Poster Ledger</b></a> · 强标题加规则化证据行</sub>
</td>
<td width="50%"><a href="./examples/layouts/06-reading-room-index.agentdraw.json"><img src="./assets/layouts/06-reading-room-index.svg" alt="Reading Room Index layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e06-reading-room-index"><b>E06 Reading Room Index</b></a> · 长文档综合和多个记忆锚点</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/07-strategic-quadrant.agentdraw.json"><img src="./assets/layouts/07-strategic-quadrant.svg" alt="Strategic Quadrant layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e07-strategic-quadrant"><b>E07 Strategic Quadrant</b></a> · SWOT 和定位分析</sub>
</td>
<td width="50%"><a href="./examples/layouts/08-editorial-timeline.agentdraw.json"><img src="./assets/layouts/08-editorial-timeline.svg" alt="Editorial Timeline layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e08-editorial-timeline"><b>E08 Editorial Timeline</b></a> · 时间演进和关键转折点</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/09-roadmap-terrace.agentdraw.json"><img src="./assets/layouts/09-roadmap-terrace.svg" alt="Roadmap Terrace layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e09-roadmap-terrace"><b>E09 Roadmap Terrace</b></a> · 阶段路线图和成熟度台阶</sub>
</td>
<td width="50%"><a href="./examples/layouts/10-decision-scoreboard.agentdraw.json"><img src="./assets/layouts/10-decision-scoreboard.svg" alt="Decision Scoreboard layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e10-decision-scoreboard"><b>E10 Decision Scoreboard</b></a> · 方案对比和推荐结论</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/11-ecosystem-orbit.agentdraw.json"><img src="./assets/layouts/11-ecosystem-orbit.svg" alt="Ecosystem Orbit layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e11-ecosystem-orbit"><b>E11 Ecosystem Orbit</b></a> · 利益相关方和生态关系图</sub>
</td>
<td width="50%"><a href="./examples/layouts/12-pyramid-stack.agentdraw.json"><img src="./assets/layouts/12-pyramid-stack.svg" alt="Pyramid Stack layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e12-pyramid-stack"><b>E12 Pyramid Stack</b></a> · 层级、成熟度和依赖关系</sub>
</td>
</tr>
</table>
</details>

## 为什么选择 AgentDraw

Agent 直接生成白板时，经常会出现文字重叠、标签不居中、连线没接上、坐标漂移等稳定问题。
AgentDraw 把这些问题变成一个可重复的工作流：

- 标准流程图、时序图、类图等走 Mermaid；
- 文章配图、架构说明、策略单页等走受限 SVG；
- 输出可编辑 `.agentdraw.json`，不是截图；
- 主题是设计系统，版式是表达结构，不只是换颜色；
- repair、validate、quality、preview、browser editor 在同一个本地闭环里。

目标很简单：少花 token，更快出图，第一版更好，而且用户还能继续手动调整。

## 核心理念

```text
意图/输入材料
  -> provider 路由
  -> 设计风格 + 版式系统
  -> Mermaid 或 SVG 源文件
  -> 可编辑 .agentdraw.json
  -> repair / validate / quality / preview
  -> 本地浏览器编辑器
```

- **Mermaid** 适合流程图、时序图、类图、状态图、ER 图、时间线、用户旅程等成熟结构图。
- **SVG** 适合文章配图、架构说明、机制图、策略单页和类似 PPT 的单页视觉。
- **设计风格** 和 **版式风格** 分开。主题控制视觉语言；版式控制阅读路径、层级和信息结构。

## 更多文档

- [安装方式](./INSTALL.md)
- [详细 CLI 和格式说明](./docs/USAGE.md)
- [风格系统](./docs/STYLE_SYSTEM.md)
- [设计评估](./docs/DESIGN_EVAL.md)
- [Playbook 评估](./docs/PLAYBOOK_EVAL.md)
- [相关项目调研](./docs/RELATED_PROJECT_RESEARCH.md)

## 灵感来源

AgentDraw 受到这些项目和理念的启发：

- [Excalidraw](https://github.com/excalidraw/excalidraw)
- [Mermaid](https://github.com/mermaid-js/mermaid)
- [Drawnix](https://github.com/plait-board/drawnix)
- [beautiful-feishu-whiteboard](https://github.com/zarazhangrui/beautiful-feishu-whiteboard)
- [open-design](https://github.com/nexu-io/open-design)
- [Google design.md](https://github.com/google-labs-code/design.md)
- [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)
- [html-ppt-skill](https://github.com/lewislulu/html-ppt-skill)
- [next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io)
- [ai-excalidraw](https://github.com/co-pine/ai-excalidraw)
- [fireworks-tech-graph](https://github.com/yizhiyanhua-ai/fireworks-tech-graph)
- [architecture-diagram-generator](https://github.com/Cocoon-AI/architecture-diagram-generator)
- [GitHub excalidraw-diagram-generator skill](https://github.com/github/awesome-copilot/blob/main/skills/excalidraw-diagram-generator/SKILL.md)

## License

[MIT](./LICENSE)
