# AgentDraw：让 AI Agent 生成好看、稳定、可编辑的文章配图

GitHub: <https://github.com/agentdraw/agentdraw>

写技术文章、产品方案、复盘报告、评审文档时，最麻烦的事情之一往往不是写文字，而是配一张合适的图。

直接让 AI 生成图片，效果可能很好看，但后面很难改。直接让 AI 写 HTML，表达力很强，但通常不适合继续手动编辑。让 AI 直接生成白板 JSON，又经常出现文字不居中、连线乱飞、元素不对齐、整体缺少设计感的问题。

AgentDraw 想解决的就是这个空白：让 Claude Code、Codex、Cursor 这类 coding agent 可以为文章、文档和方案生成稳定、好看、有设计感的可编辑画板配图。

它不是单纯的画图工具，而是一套给 agent 使用的 skill 和 CLI 工具集。Agent 可以先根据文章内容选择合适的表达方式、设计风格和版式结构，再生成 SVG 或 Mermaid，最后转换成可编辑的 Excalidraw 白板。用户可以直接在本地浏览器里打开、拖动、修改文字、调整连线，也可以导出 SVG、PNG 或结构化 JSON。

## 为什么需要 AgentDraw

很多时候，我们真正想要的不是一张“生成完就结束”的图片，而是一张可以参与写作和沟通的图。

比如：

- 给一篇技术文章做核心架构图；
- 给一次方案评审做问题诊断图；
- 给产品思考文章做结构化配图；
- 给团队同步文档做流程图、对比图、路线图；
- 给复杂概念做一张读者一眼能看懂的说明图。

这些图既要好看，也要准确，还要能改。

AgentDraw 的优势在于，它把 AI 生成图的过程拆成了更稳定的工作流：

- 结构明确的流程图、时序图、类图，可以走 Mermaid；
- 更偏文章配图、架构说明、观点表达的图，可以走 SVG；
- 最终都转换成可编辑的 `.agentdraw.json` 白板；
- 打开前可以进行修复、校验和质量检查；
- 打开后仍然可以在 Excalidraw 里自由编辑。

这样 agent 不需要从零手写复杂白板坐标，用户也不会被锁死在一张不可修改的截图里。

## 安装

如果你是给 Claude Code、Codex、Cursor 这类 agent 使用，推荐同时安装 CLI 和 skill：

```bash
npm install -g @aidraw/agentdraw
npx skills add agentdraw/agentdraw --skill agentdraw -g -y
```

也可以把下面这个安装说明直接发给 agent：

```text
https://raw.githubusercontent.com/agentdraw/agentdraw/main/INSTALL.md
```

只想临时使用 CLI，也可以不全局安装：

```bash
npx @aidraw/agentdraw@latest import-svg board.svg --out board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest open board.agentdraw.json --background --open
```

## 怎么使用

最简单的用法，是直接让 agent 读取你的文档，然后生成配图：

```text
请阅读这篇文章，使用 AgentDraw 给它生成一张适合放在文章开头的配图。
要求：重点突出、有设计感、像杂志信息图一样好看，并且生成可编辑画板。
```

如果你已经知道想要的图类型，也可以说得更明确：

```text
使用 AgentDraw 画一张系统架构说明图，突出数据流、agent 协作关系和人工确认节点。
```

```text
使用 AgentDraw 画一张产品策略对比图，采用四象限或杂志风排版，要求适合放在方案评审文档里。
```

生成完成后，agent 可以用本地浏览器打开画板。你可以继续手动编辑，也可以导出为 SVG 或 PNG 放进文章、PPT、飞书文档、GitHub README 或公众号里。

## 一些生成例子

下面这些都是 AgentDraw 生成的可编辑白板预览，不是一次性截图。对应的源文件在 GitHub 仓库里，可以继续打开编辑。

### 复杂说明画板

![AgentDraw complex workbench](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/complex-agentdraw-workbench.svg)

### 不同主题风格

AgentDraw 内置了多套设计风格。agent 可以根据文章气质选择更适合的视觉语言，比如偏咨询汇报、产品发布、研究综合、事故复盘、手绘说明、规格文档等。

![Launch room theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-launch-room.svg)

![AgentDraw OS theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-agentdraw-os.svg)

![Incident command theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-incident-command.svg)

![Message bus theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-message-bus.svg)

![Research synthesis theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-research-synthesis.svg)

![Roadmap mint theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-roadmap-mint.svg)

![Strategy grove theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-strategy-grove.svg)

![Raw grid theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-raw-grid.svg)

![Bold poster theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-bold-poster.svg)

![Soft editorial theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-soft-editorial.svg)

![Knowledge shelf theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-knowledge-shelf.svg)

![Spec notes theme example](https://github.com/agentdraw/agentdraw/raw/main/assets/examples/theme-spec-notes.svg)

### 杂志感版式

适合文章开头图、观点总结图、方案评审图。重点不是简单换配色，而是让 agent 使用更明确的表达结构。

![Monochrome big number layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/01-monochrome-big-number.svg)

![Reading room overlap layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/02-reading-room-overlap.svg)

![Swiss statement grid layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/03-swiss-statement-grid.svg)

![Editorial sidebar layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/04-editorial-sidebar.svg)

![Poster ledger layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/05-poster-ledger.svg)

![Reading room index layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/06-reading-room-index.svg)

### 分析和决策类版式

适合 SWOT、路线图、阶段推进、方案对比、生态关系和分层结构。

![Strategic quadrant layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/07-strategic-quadrant.svg)

![Editorial timeline layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/08-editorial-timeline.svg)

![Roadmap terrace layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/09-roadmap-terrace.svg)

![Decision scoreboard layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/10-decision-scoreboard.svg)

![Ecosystem orbit layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/11-ecosystem-orbit.svg)

![Pyramid stack layout](https://github.com/agentdraw/agentdraw/raw/main/assets/layouts/12-pyramid-stack.svg)

## AgentDraw 适合什么场景

AgentDraw 当前最适合的场景，是“文章和文档里的可编辑说明图”。

它特别适合：

- 技术文章配图；
- 架构说明图；
- 产品方案图；
- 复盘和诊断图；
- 策略分析图；
- 流程图和对比图；
- 需要后续人工微调的白板图。

如果你的目标是做一张完全写实的海报图，或者是复杂的网页交互页面，直接生成图片或 HTML 可能更合适。AgentDraw 的核心价值，是让 AI 生成的图既有设计感，又能保持结构化和可编辑。

## 它和普通 AI 画图有什么不同

普通 AI 画图更像是“生成一张结果图”。好看时很好看，但修改成本高。

AgentDraw 更像是“让 agent 帮你搭好一张可编辑白板”。它关注的是：

- 图里的文字是否清晰；
- 信息层级是否明确；
- 元素是否对齐；
- 连线是否可读；
- 画板是否能继续编辑；
- 结果是否适合放进真实文章和文档。

这也是为什么 AgentDraw 不只提供一个渲染命令，而是提供 skill、设计系统、版式参考、校验工具和本地编辑器。

## 未来

AgentDraw 的目标不是替代所有设计工具，而是成为 agent 生成结构化配图时的默认工作流。

我们希望它能做到：

- 让 agent 更稳定地产出高质量配图；
- 让用户可以继续手动编辑，而不是只能接受最终截图；
- 让技术文章、产品方案、评审文档里的图更清楚、更好看；
- 让 AI 画板从“能画出来”变成“真的能用”。

项目地址：<https://github.com/agentdraw/agentdraw>
