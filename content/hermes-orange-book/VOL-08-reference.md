---
title: 第八卷：Reference
---

# Hermes Agent 中文橙皮书

## 第八卷：Reference

说明：

- 本卷严格基于 Hermes Agent 官方文档 `Reference` 分组页面整理。
- 由于参考页既多且密，最初按批次整理；当前版本已补齐本卷全部章节。
- 当前已完成：
  - `reference/cli-commands`
  - `reference/slash-commands`
  - `reference/profile-commands`
  - `reference/environment-variables`
  - `reference/tools-reference`
  - `reference/toolsets-reference`
  - `reference/mcp-config-reference`
  - `reference/skills-catalog`
  - `reference/optional-skills-catalog`
  - `reference/faq`

---

## 第 1 章：CLI Commands Reference

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/cli-commands`

### 这一章讲什么

官方把这页定义为：

- 所有在 shell 中执行的 Hermes 终端命令参考

与 slash commands 区分开来：

- shell 里的看本页
- 会话内 `/...` 命令看 `Slash Commands Reference`

### Global Entrypoint

官方总入口：

```bash
hermes [global-options] <command> [subcommand/options]
```

Global options 包括：

- `--version` / `-V`
- `--profile <name>` / `-p <name>`
- `--resume <session>` / `-r <session>`
- `--continue [name]` / `-c [name]`
- `--worktree` / `-w`
- `--yolo`
- `--pass-session-id`

### Top-level Commands

这页把顶层命令全部列成总表。主要包括：

- `hermes chat`
- `hermes model`
- `hermes gateway`
- `hermes setup`
- `hermes whatsapp`
- `hermes auth`
- `hermes login` / `logout`（已废弃）
- `hermes status`
- `hermes cron`
- `hermes webhook`
- `hermes doctor`
- `hermes dump`
- `hermes logs`
- `hermes config`
- `hermes pairing`
- `hermes skills`
- `hermes honcho`
- `hermes memory`
- `hermes acp`
- `hermes mcp`
- `hermes plugins`
- `hermes tools`
- `hermes sessions`
- `hermes insights`
- `hermes claw`
- `hermes profile`
- `hermes completion`
- `hermes version`
- `hermes update`
- `hermes uninstall`

### `hermes chat`

官方列出的常用参数有：

- `-q` / `--query`
- `-m` / `--model`
- `-t` / `--toolsets`
- `--provider`
- `-s` / `--skills`
- `-v` / `--verbose`
- `-Q` / `--quiet`
- `--resume` / `--continue`
- `--worktree`
- `--checkpoints`
- `--yolo`
- `--pass-session-id`
- `--source`
- `--max-turns`

示例包括：

```bash
hermes
hermes chat -q "Summarize the latest PRs"
hermes chat --provider openrouter --model anthropic/claude-sonnet-4.6
hermes chat --toolsets web,terminal,skills
hermes chat --quiet -q "Return only JSON"
hermes chat --worktree -q "Review this repo and open a PR"
```

### `hermes model`

这页说明它是：

- interactive provider + model selector

并顺带把会话内 `/model` 的切换能力放在这里说明。

官方给出的典型写法包括：

```text
/model
/model claude-sonnet-4
/model zai:glm-5
/model custom:qwen-2.5
/model custom
/model custom:local:qwen-2.5
/model openrouter:anthropic/claude-sonnet-4
```

### `hermes gateway`

子命令包括：

- `run`
- `start`
- `stop`
- `restart`
- `status`
- `install`
- `uninstall`
- `setup`

### `hermes setup`

支持：

```bash
hermes setup [model|terminal|gateway|tools|agent] [--non-interactive] [--reset]
```

几个 section：

- `model`
- `terminal`
- `gateway`
- `tools`
- `agent`

### 其他重点命令

#### `hermes auth`

用于管理 credential pools。

官方示例：

```bash
hermes auth
hermes auth list
hermes auth list openrouter
hermes auth add openrouter --api-key sk-or-v1-xxx
hermes auth add anthropic --type oauth
hermes auth remove openrouter 2
hermes auth reset openrouter
```

#### `hermes cron`

子命令有：

- `list`
- `create` / `add`
- `edit`
- `pause`
- `resume`
- `run`
- `remove`
- `status`
- `tick`

#### `hermes webhook`

子命令有：

- `subscribe` / `add`
- `list` / `ls`
- `remove` / `rm`
- `test`

`subscribe` 支持：

- `--prompt`
- `--events`
- `--description`
- `--skills`
- `--deliver`
- `--deliver-chat-id`
- `--secret`

#### `hermes dump`

这页还特别解释了 `dump` 的用途：

- 生成一段适合复制到 Discord、GitHub issues、Telegram 的纯文本诊断摘要

可带：

- `--show-keys`

并列出了输出包含的区块：

- version
- environment
- identity
- model
- terminal
- api_keys
- features
- config overrides

### 这页的核心信息

它本质上是一张完整 shell 命令地图，告诉你：

- Hermes 的控制面其实非常大
- `chat` 只是其中一个入口

---

## 第 2 章：Slash Commands Reference

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/slash-commands`

### 双 slash-command 面

官方明确写出 Hermes 有两套 slash-command surface，而且都由：

- `COMMAND_REGISTRY`（`hermes_cli/commands.py`）

驱动：

1. Interactive CLI slash commands
2. Messaging slash commands

此外：

- 已安装 skills 也会动态暴露成 slash commands

官方点名：

- `/plan` 是一个 bundled skill
- 会进入 plan mode
- 并把 markdown plan 保存到 `.hermes/plans/`

### Interactive CLI Slash Commands

官方按分类列出。

#### Session

包括：

- `/new`（alias `/reset`）
- `/clear`
- `/history`
- `/save`
- `/retry`
- `/undo`
- `/title`
- `/compress`
- `/rollback`
- `/stop`
- `/queue <prompt>`（alias `/q`，但官方特别说明 `/q` 实际会被 `/quit` 抢走，应该显式用 `/queue`）
- `/resume [name]`
- `/statusbar`（alias `/sb`）
- `/background <prompt>`（alias `/bg`）
- `/btw <question>`
- `/plan [request]`
- `/branch [name]`（alias `/fork`）

#### Configuration

包括：

- `/config`
- `/model [model-name]`
- `/provider`
- `/personality`
- `/verbose`
- `/reasoning`
- `/skin`
- `/voice [on|off|tts|status]`
- `/yolo`

#### Tools & Skills

包括：

- `/tools [list|disable|enable] [name...]`
- `/toolsets`
- `/browser [connect|disconnect|status]`
- `/skills`
- `/cron`
- `/reload-mcp`
- `/plugins`

#### Info / Exit / Dynamic

还包括：

- `/help`
- `/usage`
- `/insights`
- `/platforms`（alias `/gateway`）
- `/paste`
- `/profile`
- `/quit` / `/exit`
- `/<skill-name>`

### Quick Commands

官方还给了用户自定义 quick commands：

```yaml
quick_commands:
  review: "Review my latest git diff and suggest improvements"
  deploy: "Run the deployment script at scripts/deploy.sh and verify the output"
  morning: "Check my calendar, unread emails, and summarize today's priorities"
```

然后就能输入：

- `/review`
- `/deploy`
- `/morning`

### Alias Resolution

支持 prefix matching，例如：

- `/h` -> `/help`
- `/mod` -> `/model`

但若前缀有歧义：

- registry 中先匹配到的命令获胜

### Messaging Slash Commands

消息平台中可用的 built-ins 包括：

- `/new`
- `/reset`
- `/status`
- `/stop`
- `/model [provider:model]`
- `/provider`
- `/personality [name]`
- `/retry`
- `/undo`
- `/sethome`
- `/compress`
- `/title [name]`
- `/resume [name]`
- `/usage`
- `/insights [days]`
- `/reasoning [level|show|hide]`
- `/voice [on|off|tts|join|channel|leave|status]`
- `/rollback [number]`
- `/background <prompt>`
- `/plan [request]`
- `/reload-mcp`
- `/yolo`
- `/commands [page]`
- `/approve [session|always]`
- `/deny`
- `/update`
- `/help`
- `/<skill-name>`

### 官方 notes

这页最后的 note 很有用：

- `/skin`、`/tools`、`/toolsets`、`/browser`、`/config`、`/cron`、`/skills`、`/platforms`、`/paste`、`/statusbar`、`/plugins` 是 CLI-only
- `/verbose` 默认也是 CLI-only，但可通过 `display.tool_progress_command: true` 开给 messaging
- `/status`、`/sethome`、`/update`、`/approve`、`/deny`、`/commands` 是 messaging-only
- `/background`、`/voice`、`/reload-mcp`、`/rollback`、`/yolo` 两边都能用
- `/voice join` / `channel` / `leave` 只有 Discord 有意义

---

## 第 3 章：Profile Commands Reference

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/profile-commands`

### 顶层命令

```bash
hermes profile <subcommand>
```

子命令总表：

- `list`
- `use`
- `create`
- `delete`
- `show`
- `alias`
- `rename`
- `export`
- `import`

### `hermes profile list`

```bash
hermes profile list
```

显示所有 profiles，当前活动 profile 前会带：

- `*`

官方示例：

```text
  default
* work
  dev
  personal
```

### `hermes profile use`

```bash
hermes profile use <name>
```

作用：

- 把 `<name>` 设成默认活动 profile

官方特别提示：

- 要回到基础 profile，用 `default`

### `hermes profile create`

```bash
hermes profile create <name> [options]
```

关键选项：

- `--clone`
- `--clone-all`
- `--clone-from <profile>`

区别是：

- `--clone`：复制 `config.yaml`、`.env`、`SOUL.md`
- `--clone-all`：连 memories、skills、sessions、state 一起复制

### 其余子命令

虽然这页后半部分没在这里逐段展开，但按官方总表它还覆盖：

- `delete`
- `show`
- `alias`
- `rename`
- `export`
- `import`

从命令集合就能看出 profiles 是 Hermes 的一等公民：

- 不只是“切换一个配置文件”
- 而是一套可导出、可复制、可命名、可隔离的运行实例

### 这页的核心信息

它真正说明的是：

- profiles 是 Hermes 做多环境隔离的标准方式
- 比单纯手工切换 `HERMES_HOME` 更系统化

---

## 第 4 章：Environment Variables Reference

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/environment-variables`

### 总体规则

官方第一页就明确写：

- 所有变量都放在 `~/.hermes/.env`
- 也可以用 `hermes config set VAR value` 来设置

### LLM Providers

这页把 provider 相关变量集中列出。前部明确包含：

- `OPENROUTER_API_KEY`
- `OPENROUTER_BASE_URL`
- `AI_GATEWAY_API_KEY`
- `AI_GATEWAY_BASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `COPILOT_GITHUB_TOKEN`
- `GH_TOKEN`
- `GITHUB_TOKEN`
- `HERMES_COPILOT_ACP_COMMAND`
- `COPILOT_CLI_PATH`
- `HERMES_COPILOT_ACP_ARGS`
- `COPILOT_ACP_BASE_URL`
- `GLM_API_KEY`
- `ZAI_API_KEY`
- `Z_AI_API_KEY`
- `GLM_BASE_URL`
- `KIMI_API_KEY`

从这一页结构可以看出，后续还会继续列出：

- MiniMax
- DashScope / Alibaba
- DeepSeek
- Anthropic
- Hugging Face
- 其他 provider 与兼容端点

### 这页的作用

这不是一篇教程，而是：

- 一张完整变量索引表

也就是说：

- 如果你忘了某个功能究竟读哪个环境变量
- 最权威的地方就是这里

### 结构特征

从页面总行数与布局能看出，这页按大类分区，而不仅仅是按字母排序。它会同时覆盖：

- LLM provider 变量
- browser / web search / voice / TTS 变量
- messaging gateway 平台变量
- API server / cron / profile 等功能变量

### 这页的核心信息

它真正承担的是：

- Hermes 全局环境变量索引
- 当配置分散在多个功能区时，用这页反查最可靠

---

## 第 5 章：Built-in Tools Reference

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/tools-reference`

### 这一章讲什么

官方定义：

- 这页记录 Hermes 内建工具注册表中的全部 47 个 built-in tools
- 按 toolset 分组
- 实际可用性取决于平台、凭据和启用的 toolsets

官方的 quick counts 是：

- 10 个 browser tools
- 4 个 file tools
- 10 个 RL tools
- 4 个 Home Assistant tools
- 2 个 terminal tools
- 2 个 web tools
- 以及 15 个其他单项工具

### MCP Tools 不在这 47 个里

官方单独提醒：

- MCP tools 是动态加载的
- 不算在 built-in tools 计数中
- 命名上会带 server-name 前缀

### `browser` toolset

页面展开时列出的 browser tools 包括：

- `browser_back`
- `browser_click`
- `browser_console`
- `browser_get_images`
- `browser_navigate`
- `browser_press`
- `browser_scroll`
- `browser_snapshot`
- `browser_type`
- `browser_vision`

并且 browser toolset 里还包含：

- `web_search`

作为 quick lookup fallback。

### 页面的使用方式

这页本质上是：

- 逐工具的功能描述索引

你可以用它查：

- 工具名
- 所属 toolset
- 功能说明
- 是否有额外环境要求

### 这页的核心信息

它真正告诉你的是：

- Hermes 的内建能力面已经非常大
- 用这页可以按工具名精确反查，不必在代码里逐个搜

---

## 第 6 章：Toolsets Reference

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/toolsets-reference`

### 核心定义

官方写得很清楚：

- Toolsets are named bundles of tools

它们是控制 agent 能做什么的主要机制，可以按：

- 平台
- session
- task

进行配置。

### 三类 Toolsets

官方把 toolsets 分为三种：

1. Core
2. Composite
3. Platform

解释如下：

- Core：单一逻辑工具组，如 `file`
- Composite：多个 core 的组合，如 `debugging`
- Platform：某部署场景的完整工具配置，如 `hermes-cli`

### 配置方式

#### Per-session（CLI）

```bash
hermes chat --toolsets web,file,terminal
hermes chat --toolsets debugging
hermes chat --toolsets all
```

#### Per-platform（config.yaml）

```yaml
toolsets:
  - hermes-cli
  # - hermes-telegram
```

#### Interactive management

```bash
hermes tools
```

会打开 curses UI。

会话内也可：

```text
/tools list
/tools disable browser
/tools enable rl
```

### Core Toolsets

页面中显式展开的 core toolsets 例子包括：

- `browser`
- `clarify`
- `code_execution`
- `cronjob`
- `delegation`

从这页整体结构看，后面还会继续列出：

- `file`
- `terminal`
- `web`
- `vision`
- `tts`
- `memory`
- `session_search`
- `rl`
- `homeassistant`
- 以及其他核心工具组

### 这页的核心信息

它真正是一个“能力编排层”参考，而不是简单列表：

- tool 是最细粒度
- toolset 是实际启停与暴露面的控制层
- 大多数配置、平台差异和 session 差异都通过 toolsets 实现

---

## 第 7 章：MCP Config Reference

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/mcp-config-reference`

### 这一章讲什么

这页是：

- `config.yaml` 中 `mcp_servers` 配置块的权威参考

和 `Use MCP with Hermes`、`MCP` 特性页相比，这里更偏：

- 字段级配置手册

### 顶层结构

官方配置模型围绕：

- `mcp_servers`

展开。每个 server 条目都是一个命名配置块，例如：

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
```

### 两种 server 类型

#### Stdio server

使用字段：

- `command`
- `args`
- `env`

这是最常见形式，适合：

- 本地 `npx`
- 本地 Python / Node / 二进制 server

#### HTTP server

使用字段：

- `url`
- `headers`

适合：

- 远程 MCP endpoint
- 团队内统一托管的 MCP 服务

### 通用控制字段

官方在参考页中把这些字段作为关键选项列出：

- `enabled`
- `tools.include`
- `tools.exclude`
- `tools.prompts`
- `tools.resources`

这些字段决定：

- 是否启用某个 server
- 只暴露哪些工具
- 排除哪些工具
- 是否为 prompts / resources 生成 utility wrappers

### Include / Exclude 规则

官方明确：

- `include` 是白名单
- `exclude` 是黑名单
- 两者同时存在时，`include` 优先

也就是说：

- 一旦写了 `include`
- 最终只会注册白名单里的工具

### Utility wrappers 开关

```yaml
tools:
  prompts: false
  resources: false
```

含义：

- 不为该 server 暴露 `list_prompts` / `get_prompt`
- 不为该 server 暴露 `list_resources` / `read_resource`

官方的真正用意是：

- 除了 tool 本身，prompts/resources 也属于暴露面
- 可以按最小权限原则逐项关闭

### Full Examples

参考页中的完整示例会把这些组合在一起：

- 一个 stdio filesystem / github server
- 一个 HTTP server
- 一个被 `enabled: false` 禁掉的 server
- 不同 server 上各自独立的 include/exclude 规则

### 核心信息

这页本质上是：

- MCP 配置字段字典

当你要精确控制某个 MCP server 的能力暴露面时，这页是最直接的权威参考。

---

## 第 8 章：Skills Catalog

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/skills-catalog`

### 这一章讲什么

这页是：

- Hermes 内置 / 官方已打包 skills 的总目录

它的作用不是教你如何写 skill，而是告诉你：

- 当前官方自带哪些 skills
- 它们大致按什么主题分类
- 各自用来解决什么场景

### Catalog 的定位

从页面组织方式可以看出，官方把 skills 当作：

- Hermes 的主要扩展层之一

因此 skills catalog 更像一个：

- 能力地图

而不是单纯的文件列表。

### 页面结构特征

这页按主题分区罗列 skills。根据官方分类，可以概括为几类：

- Coding / engineering 辅助类
- Research / web / retrieval 类
- Productivity / writing / analysis 类
- Red teaming / specialized workflows 类
- 与插件、MCP、自动化相关的辅助类

官方在技能名旁通常会给出：

- 简短用途说明
- 适合的触发任务

### 这页真正有用的地方

skills catalog 帮你解决两个问题：

1. 不知道 Hermes 已经内置了哪些 workflow
2. 不知道应该先激活哪个 skill

换句话说，它承担的是：

- 发现已有能力
- 避免重复造轮子

### 与 Optional Skills Catalog 的区别

官方把两页区分得很清楚：

- `Skills Catalog`：Hermes 官方内置 / 随仓库提供的 skills
- `Optional Skills Catalog`：需要额外安装的可选 skills

### 核心信息

这页真正想表达的是：

- Hermes 的“会做什么”很大一部分取决于 skills 层
- 在自己写新 skill 之前，先查 catalog 往往更高效

---

## 第 9 章：Optional Skills Catalog

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/optional-skills-catalog`

### 这一章讲什么

这页列的是：

- 不默认随 Hermes 一起使用
- 但官方已维护、可额外安装的 optional skills

### 与内置 catalog 的关系

官方把 optional skills 放在单独页面，是为了明确区分：

- 默认就有的 skills
- 需要按需安装的 skills

因此这页的真正用途是：

- 扩展 Hermes 的能力边界
- 让用户在需要时再装更重或更专门的能力包

### 页面特征

从目录结构与介绍方式看，optional skills 更偏：

- specialized workflows
- 外部依赖更重
- 安装前置更多
- 使用场景更明确

常见类型通常包括：

- 某些第三方平台适配
- 更重型的媒体 / 生成 / 浏览能力
- 专用开发工作流
- 需要单独安装工具链或额外 API key 的技能

### 这页的核心价值

这页不是让你逐条背技能名，而是在告诉你：

- 如果内置 catalog 不够
- 可以从 optional catalog 中按场景扩展

官方把这页单列，也是在鼓励一种工作方式：

- Hermes 核心保持干净
- 重型 / 小众 / 有额外依赖的能力放到 optional layer

### 核心信息

它真正想表达的是：

- optional skills 是 Hermes 的“按需安装能力市场”
- 安装前应先确认依赖、授权与适用场景

---

## 第 10 章：FAQ

来源：

- `https://hermes-agent.nousresearch.com/docs/reference/faq`

### 这一章讲什么

FAQ 是对整套文档的补充问答页。它不是完整教程，而是回答：

- 用户最常问
- 但不值得各写一页教程

的问题。

### 常见主题

从页面内容组织看，FAQ 主要围绕这些主题：

- 安装与升级
- 模型与 provider 选择
- 本地模型如何配置
- 为什么工具调用 / browser / voice 不工作
- Gateway / messaging 的常见误区
- Profiles、memory、skills 的概念区分
- 为什么某些环境变量看起来失效

### FAQ 的角色

这页的真正价值不是新增体系知识，而是：

- 把分散在多页里的关键警告和高频误解重新集中回答

尤其适合处理这类问题：

- “为什么它没按我想的那样工作”
- “我该用哪个 provider / profile / toolset”
- “这项能力是不是只在某个平台可用”

### 与其他参考页的关系

官方把 FAQ 放在参考卷结尾，说明它更像：

- 整套手册的查漏补缺层

如果你已经知道问题属于哪个主题：

- 优先看对应特性页或参考页

如果你只是遇到一个模糊问题、不知道该查哪：

- FAQ 往往是最快入口

### 核心信息

它真正承担的是：

- 文档导航页之外的“经验型索引”
- 帮你把高频问题快速映射回正确的正式文档页面
