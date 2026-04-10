---
title: 第七卷：Developer Guide
---

# Hermes Agent 中文橙皮书

## 第七卷：Developer Guide

说明：

- 本卷严格基于 Hermes Agent 官方文档 `Developer Guide` 分组页面整理。
- 由于开发者文档篇幅较长、内部机制密集，最初按批次整理；当前版本已补齐本卷全部章节。
- 当前已完成：
  - `developer-guide/contributing`
  - `developer-guide/architecture`
  - `developer-guide/agent-loop`
  - `developer-guide/prompt-assembly`
  - `developer-guide/context-compression-and-caching`
  - `developer-guide/gateway-internals`
  - `developer-guide/session-storage`
  - `developer-guide/provider-runtime`
  - `developer-guide/adding-tools`
  - `developer-guide/adding-providers`
  - `developer-guide/memory-provider-plugin`
  - `developer-guide/creating-skills`
  - `developer-guide/extending-the-cli`
  - `developer-guide/tools-runtime`
  - `developer-guide/acp-internals`
  - `developer-guide/cron-internals`
  - `developer-guide/environments`
  - `developer-guide/trajectory-format`

---

## 第 1 章：Contributing

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/contributing`

### 这一章讲什么

这页是官方贡献指南，覆盖：

- 开发环境准备
- 代码风格
- 跨平台要求
- 安全要求
- PR 提交流程

### Contribution Priorities

官方明确列出贡献优先级，顺序是：

1. Bug fixes
2. Cross-platform compatibility
3. Security hardening
4. Performance and robustness
5. New skills
6. New tools
7. Documentation

其中一个很重要的产品判断是：

- 新 skill 的优先级高于新 tool
- 因为大多数新能力更应该以 skill 形式落地，而不是继续扩展原生工具面

### Common Contribution Paths

官方给了三个最常见入口：

- 做新 tool：先看 `Adding Tools`
- 做新 skill：先看 `Creating Skills`
- 做新 inference provider：先看 `Adding Providers`

### Development Setup

#### Prerequisites

最低前提：

- Git（支持 `--recurse-submodules`）
- Python 3.11+
- `uv`
- Node.js 18+（浏览器工具与 WhatsApp bridge 需要）

#### Clone and Install

```bash
git clone --recurse-submodules https://github.com/NousResearch/hermes-agent.git
cd hermes-agent

uv venv venv --python 3.11
export VIRTUAL_ENV="$(pwd)/venv"

uv pip install -e ".[all,dev]"
uv pip install -e "./tinker-atropos"

npm install
```

#### Configure for Development

```bash
mkdir -p ~/.hermes/{cron,sessions,logs,memories,skills}
cp cli-config.yaml.example ~/.hermes/config.yaml
touch ~/.hermes/.env
echo 'OPENROUTER_API_KEY=sk-or-v1-your-key' >> ~/.hermes/.env
```

#### Run

```bash
mkdir -p ~/.local/bin
ln -sf "$(pwd)/venv/bin/hermes" ~/.local/bin/hermes

hermes doctor
hermes chat -q "Hello"
```

#### Run Tests

```bash
pytest tests/ -v
```

### Code Style

官方代码风格原则：

- PEP 8，但不强制严格行长
- 注释只解释非显然的意图、权衡、API 怪癖
- 错误处理要抓具体异常
- 未预期异常要配合 `logger.warning()` / `logger.error()` 与 `exc_info=True`
- 不要假定只在 Unix 上运行

官方还单独强调一条路径规范：

- 不要硬编码 `~/.hermes`
- 代码中用 `get_hermes_home()`
- 面向用户展示路径时用 `display_hermes_home()`

### Cross-Platform Compatibility

官方支持：

- Linux
- macOS
- WSL2

原生 Windows 不正式支持，但代码里仍要求做防御性处理。

四条具体规则：

1. `termios` / `fcntl` 是 Unix-only，要同时捕获 `ImportError` 与 `NotImplementedError`
2. `.env` 文件可能不是 UTF-8，必要时回退 `latin-1`
3. `os.setsid()` / `os.killpg()` / signal 行为跨平台不同
4. 路径拼接要用 `pathlib.Path`

### Security Considerations

官方强调：

- Hermes 有 terminal access，安全不是可选项

现有保护层包括：

- sudo password piping 使用 `shlex.quote()`
- 危险命令检测与审批流
- cron prompt injection scanner
- 写入 deny list 会先做 `os.path.realpath()`
- skills 安全扫描
- code execution sandbox 会剥离 API keys
- Docker 容器硬化

对安全敏感代码的贡献要求：

- shell 插值一律 `shlex.quote()`
- 访问控制前先 resolve symlink
- 不要记录 secrets
- 工具执行周围要有广义异常保护
- 涉及路径或进程的改动要做跨平台测试

### Pull Request Process

#### Branch Naming

官方建议：

- `fix/description`
- `feat/description`
- `docs/description`
- `test/description`
- `refactor/description`

#### Before Submitting

提交前至少做：

1. `pytest tests/ -v`
2. 手工跑 `hermes` 覆盖改动路径
3. 考虑 macOS / Linux 兼容性
4. 保持 PR 聚焦

#### PR Description

应包括：

- 改了什么、为什么
- 怎么测试
- 在哪些平台测过
- 关联 issue

#### Commit Messages

官方使用 Conventional Commits：

```text
<type>(<scope>): <description>
```

常见 scope 包括：

- `cli`
- `gateway`
- `tools`
- `skills`
- `agent`
- `install`
- `whatsapp`
- `security`

### Reporting Issues / Community / License

官方要求 issue 报告附带：

- OS
- Python 版本
- Hermes 版本
- 完整 traceback
- 重现步骤

安全漏洞要求：

- 私下报告

社区入口包括：

- Discord
- GitHub Discussions
- Skills Hub

贡献默认遵循：

- MIT License

---

## 第 2 章：Architecture

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/architecture`

### 顶层定位

这页是 Hermes 内部架构总图。官方明确说：

- 这是 codebase 的 top-level map
- 应先用它定位系统，再下钻到各子系统实现页

### Entry Points

官方总览图中列出的入口包括：

- CLI（`cli.py`）
- Gateway（`gateway/run.py`）
- ACP（`acp_adapter/`）
- Batch Runner
- API Server
- Python Library

这些入口最终都会流向同一个核心：

- `AIAgent`（`run_agent.py`）

### AIAgent 中央位置

总览图把 `AIAgent` 画在中心，其下最核心的三块是：

- Prompt Builder（`prompt_builder.py`）
- Provider Resolution（`runtime_provider.py`）
- Tool Dispatch（`model_tools.py`）

这意味着官方架构理念是：

- 不同入口共享同一 agent 内核
- 入口差异主要发生在外层协议与上下文来源
- 不在核心推理循环里复制多份实现

### 这页的真正作用

它本身并不展开每个子系统细节，而是把后续页面串起来：

- `Agent Loop Internals`
- `Prompt Assembly`
- `Context Compression and Caching`
- `Gateway Internals`
- `Session Storage`
- `Provider Runtime Resolution`

也就是告诉贡献者：

- 想理解 Hermes，不要只盯着一个入口文件
- 需要把 prompt、provider、tool、session、gateway 看成一条贯穿的 runtime 链

---

## 第 3 章：Agent Loop Internals

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/agent-loop`

### 核心定位

官方直接点名：

- `run_agent.py` 里的 `AIAgent` 是核心 orchestration engine
- 大约 9200 行

它负责从 prompt assembly 到 tool dispatch，再到 provider failover 的几乎全部主流程。

### Core Responsibilities

官方列出的职责包括：

- 通过 `prompt_builder.py` 组装有效 system prompt 与 tool schemas
- 选择正确的 provider / API mode
- 发起可中断的模型调用
- 执行工具调用，可串行也可并发 thread pool
- 维护 OpenAI message format 的对话历史
- 处理 compression、retries、fallback model switching
- 跨父子 agent 追踪 iteration budgets
- 在上下文丢失前 flush persistent memory

### Two Entry Points

官方给出两种调用方式：

#### 简单接口

```python
response = agent.chat("Fix the bug in main.py")
```

特点：

- 只返回最终 response string

#### 完整接口

```python
result = agent.run_conversation(
    user_message="Fix the bug in main.py",
    system_message=None,
    conversation_history=None,
    task_id="task_abc123"
)
```

特点：

- 返回 dict
- 包含 messages、metadata、usage stats 等完整信息

### 这一页想传达什么

官方不是只在说“代码很长”，而是在告诉你：

- Hermes 的复杂性集中在一个可复用 runtime loop
- 其他入口大多只是输入 / 输出壳层
- 所以做深层改动时，要优先理解 `AIAgent` 的责任边界

---

## 第 4 章：Prompt Assembly

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/prompt-assembly`

### 最重要的设计选择

官方一开头就强调：

- Hermes 故意把“缓存的 system prompt 状态”
- 和“API 调用时临时附加内容”

分开处理。

原因影响四件事：

- token usage
- prompt caching effectiveness
- session continuity
- memory correctness

### 关键文件

官方点名的主文件：

- `run_agent.py`
- `agent/prompt_builder.py`
- `tools/memory_tool.py`

### Cached System Prompt Layers

官方给出 system prompt 的组装顺序：

1. agent identity：优先 `SOUL.md`，否则 `DEFAULT_AGENT_IDENTITY`
2. tool-aware behavior guidance
3. Honcho static block
4. optional system message
5. frozen `MEMORY` snapshot
6. frozen `USER` profile snapshot
7. skills index
8. context files（`AGENTS.md`、`.cursorrules`、`.cursor/rules/*.mdc`）
9. timestamp / optional session ID
10. platform hint

官方还说明：

- 若设 `skip_context_files`，如子 agent delegation 场景
- 就不会加载 `SOUL.md`
- 会回退到硬编码 `DEFAULT_AGENT_IDENTITY`

### 这一页的核心意思

它真正说明的是：

- 稳定、可缓存、跨轮次复用的内容应尽量进入 cached system prompt
- 易变、按调用动态变化的上下文不要污染这层
- 这样既能保 prompt cache，也更利于多轮正确性

---

## 第 5 章：Context Compression and Caching

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching`

### 双压缩系统

官方明确说 Hermes 有两套独立工作的 compression layers：

1. Gateway Session Hygiene
2. Agent ContextCompressor

### 1. Gateway Session Hygiene

位置：

- `gateway/run.py` 中 `_maybe_compress_session`

特点：

- agent 处理消息前运行
- 是 safety net
- 固定阈值为上下文窗口的 85%
- 优先用上一次 API 实际返回的 token 计数
- 退化时才用粗略字符估算
- 仅当历史长度至少 4 条且 compression 启用时触发

官方解释为什么不是 50%：

- 如果和 agent compressor 用同一阈值
- gateway 长会话会在几乎每一轮都被过早压缩

### 2. Agent ContextCompressor

位置：

- `agent/context_compressor.py`

这是主压缩系统，默认：

- 阈值 50%

并使用真实 API token 计数。

### Compression 配置

所有设置都在 `config.yaml` 的：

- `compression`

块下：

```yaml
compression:
  enabled: true
  threshold: 0.50
  target_ratio: 0.20
  protect_last_n: 20
  summary_model: null
```

其中：

- `threshold`：到多少比例触发压缩
- `target_ratio`：压缩后尾部保留预算
- `protect_last_n`：至少保住最近多少条消息
- `protect_first_n`：官方说明为硬编码 3

### 压缩算法 4 阶段

#### Phase 1：Prune Old Tool Results

- 先对受保护尾部之外的旧工具输出做廉价裁剪
- 超过 200 chars 的旧工具结果会被替换成简短占位文本

#### Phase 2：Determine Boundaries

- 头部固定保留
- 中间区间做摘要
- 尾部按 token budget 倒推保护
- 边界会对齐 tool_call / tool_result，避免拆散一组

#### Phase 3：Generate Structured Summary

官方给出的摘要模板包含：

- `## Goal`
- `## Constraints & Preferences`
- `## Progress`
- `## Key Decisions`
- `## Relevant Files`
- `## Next Steps`
- `## Critical Context`

摘要 token 预算：

- 公式为 `content_tokens × 0.20`
- 最少 2000
- 最多 `min(context_length × 0.05, 12000)`

#### Phase 4：Assemble Compressed Messages

压缩后的消息列表由三块组成：

1. head messages
2. summary message
3. tail messages

还会做：

- orphaned tool_call / tool_result 清理

### Iterative Re-compression

官方强调：

- 后续再次压缩时，不是从零重写摘要
- 而是把上一次 summary 带给 LLM 做增量更新

这样可保留长期进展脉络，例如：

- `In Progress` 变成 `Done`
- 旧阻塞消失
- 新决策被补进去

### Prompt Caching（Anthropic）

位置：

- `agent/prompt_caching.py`

作用：

- 多轮对话下，输入 token 成本约可降 75%

官方策略叫：

- `system_and_3`

Anthropic 最多支持 4 个 `cache_control` breakpoint，Hermes 用法是：

1. system prompt
2. 倒数第三条非 system message
3. 倒数第二条非 system message
4. 最后一条非 system message

### Cache-Aware 设计原则

官方列出几条重要模式：

1. system prompt 尽量稳定
2. message ordering 很重要
3. 压缩会让压缩区缓存失效，但 system prompt cache 仍保留
4. TTL 默认是 `5m`，长会话可用 `1h`

启用条件：

- 模型是 Anthropic Claude
- provider 支持 `cache_control`

配置：

```yaml
model:
  cache_ttl: "5m"
```

---

## 第 6 章：Gateway Internals

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/gateway-internals`

### 核心定位

官方把 messaging gateway 定义为：

- 一个长生命周期进程
- 通过统一架构连接 14+ 外部消息平台

### Key Files

官方列出的关键文件与职责：

- `gateway/run.py`：`GatewayRunner` 主循环、slash commands、消息分发，约 7500 行
- `gateway/session.py`：`SessionStore`，会话持久化与 session key 构造
- `gateway/delivery.py`：向目标平台 / channel 投递消息
- `gateway/pairing.py`：DM pairing 授权流程
- `gateway/channel_directory.py`：把 chat IDs 映射成可读名称，便于 cron 投递
- `gateway/hooks.py`：hook 发现、加载、生命周期事件分发
- `gateway/mirror.py`：`send_message` 的 cross-session mirroring
- `gateway/status.py`：profile-scoped gateway instance 的 token lock 管理
- `gateway/builtin_hooks/`：内建 hooks
- `gateway/platforms/`：平台 adapters

### Architecture Overview

官方架构图中：

- 各平台 adapter 位于 `GatewayRunner` 下
- 消息统一汇入 session store
- 再流向共享的 `AIAgent`

这和 CLI / ACP / API Server 一样，体现的是：

- 入口多样
- runtime 内核统一

### 这一页想让你知道的事

Hermes 的消息平台支持并不是很多孤立 bot 的拼接，而是：

- 统一 gateway runner
- 统一 session model
- 统一 delivery model
- 统一 authorization / pairing / hook / channel-directory 子系统

---

## 第 7 章：Session Storage

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/session-storage`

### 核心定位

Hermes 用一个 SQLite 数据库：

- `~/.hermes/state.db`

保存：

- session metadata
- 完整消息历史
- model configuration

官方明确指出：

- 这取代了早期每个 session 一个 JSONL 文件的方案

### Source file

主实现文件：

- `hermes_state.py`

### Architecture Overview

官方的数据库结构包括：

- `sessions`
- `messages`
- `messages_fts`
- `schema_version`

并启用：

- SQLite WAL mode

### 关键设计决定

官方总结了 5 个设计点：

- WAL mode：支持并发读 + 单写，适合 gateway 多平台
- `messages_fts`：FTS5 全文搜索
- 通过 `parent_session_id` 维护 session lineage
- 用 `source` 标记 `cli` / `telegram` / `discord` 等来源
- Batch runner 与 RL trajectories 不存这里，是独立系统

### Sessions Table

官方给了 schema 关键字段，包括：

- `id`
- `source`
- `user_id`
- `model`
- `model_config`
- `system_prompt`
- `parent_session_id`
- `started_at`
- `ended_at`
- `end_reason`
- `message_count`
- `tool_call_count`
- `input_tokens`
- `output_tokens`

从字段设计可以看出：

- 这张表既保存会话身份，也保存计费 / token 统计信息

### 这一页的核心信息

官方想让开发者知道：

- session state 是严肃的持久化层，不只是聊天记录缓存
- 它承接 CLI、gateway 多平台和压缩后的 lineage 追踪
- 因此任何会话相关改动都要考虑数据库 schema、迁移和 FTS 行为

---

## 第 8 章：Provider Runtime Resolution

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/provider-runtime`

### 核心定位

官方把这一页定义为共享 provider runtime resolver 的内部说明，它覆盖：

- CLI
- gateway
- cron jobs
- ACP
- auxiliary model calls

### Primary implementation

主要文件：

- `hermes_cli/runtime_provider.py`
- `hermes_cli/auth.py`
- `hermes_cli/model_switch.py`
- `agent/auxiliary_client.py`

如果要新增 first-class inference provider，官方要求：

- 同时看 `Adding Providers`

### Resolution precedence

官方给出解析优先级：

1. explicit CLI / runtime request
2. `config.yaml` model/provider config
3. environment variables
4. provider-specific defaults 或 auto resolution

并特别解释：

- 保存下来的 model/provider 选择，是正常运行时的 source of truth
- 这样可避免过期 shell export 静默覆盖用户在 `hermes model` 中最后选定的 endpoint

### 当前 provider families

页面列出的 provider 家族包括：

- AI Gateway
- OpenRouter
- Nous Portal
- OpenAI Codex
- Copilot / Copilot ACP
- Anthropic
- Google / Gemini
- Alibaba / DashScope
- DeepSeek
- Z.AI
- Kimi / Moonshot
- MiniMax
- MiniMax China
- Kilo Code
- Hugging Face
- OpenCode Zen / OpenCode Go
- `custom`
- named `custom_providers`

### 这一页的核心信息

它真正解释的是：

- Hermes 的 provider 解析不是零散散落在各入口里
- 而是一个统一 runtime resolver
- 其设计目标是：一致、可切换、可扩展、且不被旧环境变量误伤

---

## 第 9 章：Adding Tools

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/adding-tools`

### 这一章讲什么

这页教的是：

- 如何把一个新工具接进 Hermes
- 工具的代码应该放哪
- schema、注册、执行与显示层分别怎么接

官方真正强调的不是“随便加个函数”，而是：

- Hermes 的工具有完整 runtime 约定
- 新工具必须同时接好 schema、dispatch、可见性与安全边界

### 顶层流程

官方给出的添加路径可以概括为：

1. 实现工具逻辑
2. 定义输入 schema
3. 把工具注册进工具注册表 / toolset
4. 确保在 `model_tools.py` 的 dispatch 链中可执行
5. 在 CLI / gateway / agent loop 中验证行为

### 工具应该具备的特性

从这页的写法能看出，官方对新工具的要求包括：

- 输入参数明确、稳定
- 错误返回可结构化处理
- 能在工具调用日志里被正确显示
- 有合理的安全保护
- 能在多入口环境下工作，而不是只为 CLI 特判

### 与 Toolsets 的关系

这页也会把你带回官方的工具分组设计：

- 工具不是孤立注册
- 通常还要落到某个 toolset
- 这样才能被 CLI、profiles、ACP、delegation 等能力统一控制

### 开发时要重点关注的文件

虽然这一页是指导页，不是完整源码表，但它明确引导开发者去看：

- 工具定义文件
- `model_tools.py`
- toolsets 相关配置
- 参考已有工具实现

### 设计原则

这页隐含的几条原则非常重要：

- 新能力优先判断是不是更适合做 skill，而不是原生 tool
- 工具应该尽量通用，而不是绑死单个项目逻辑
- 工具输出要利于模型消费，而不是只方便人看
- 涉及 shell、文件、网络、副作用时，要先考虑安全与审批

### 这页的核心信息

它真正想告诉贡献者的是：

- “加工具”是 Hermes 最强的扩展点之一
- 但它不是单点改动，而是要接入统一 runtime 生态

---

## 第 10 章：Adding Providers

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/adding-providers`

### 核心定位

这页讲的是：

- 如何把新的 inference provider 作为 first-class provider 接进 Hermes

而不是仅仅用 custom endpoint 临时接一条 URL。

### 什么时候需要新增原生 provider

从官方文档的结构可以看出，只有当某 provider 需要：

- 独特的认证方式
- 特殊的模型枚举或模型切换逻辑
- 不同于标准 OpenAI-compatible 的 API 语义
- 或 Hermes 需要为其做一等公民 UX

时，才值得新增 first-class provider。

否则更推荐：

- `custom endpoint`
- 或 named `custom_providers`

### 这一页强调的接入点

新增 provider 时，开发者要同时理解并修改：

- provider runtime resolver
- auth 解析
- model switching
- auxiliary client resolution
- 可能的 CLI 配置入口

也就是说，provider 不是单独的一层 HTTP client，而是：

- 贯穿模型选择、凭据查找、fallback、side-model 解析与用户交互

### 兼容目标

官方这一页想确保新增 provider 满足：

- 能与 `hermes model` 一起工作
- 能与 `config.yaml` 保存的选择一起工作
- 能用于 CLI、gateway、ACP、cron、API server
- 必要时能参与 fallback / auxiliary 体系

### 设计原则

这页隐含的原则包括：

- 不要让新 provider 绕开统一 runtime resolver
- 尽量复用现有 OpenAI-compatible 路径
- 只有 provider 真有特性差异时才做专门分支
- 凭据解析应优先走统一 auth / config 机制

### 这页的核心信息

它本质上是在说：

- 新增 provider 是“把一个模型生态接入 Hermes 运行时”
- 而不是“多写一个 requests.post()”

---

## 第 11 章：Build a Memory Provider Plugin

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/memory-provider-plugin`

### 核心定位

这页讲的是：

- 如何实现一个 Memory Provider Plugin

也就是把 Hermes 的记忆层挂接到外部 memory backend，而不是只用本地：

- `MEMORY.md`
- `USER.md`

### 这类插件和普通 plugin 的区别

Memory provider 不是一个任意工具插件，而是要接入 Hermes 的记忆生命周期：

- 召回
- 写入
- flush
- profile 读写
- session 结束后的整理

因此它比普通 tool plugin 更贴近核心 runtime。

### 生命周期钩子

从官方写法可以看出，一个 memory provider 需要覆盖的关键节点包括：

- session / turn 开始时的 recall
- 会话或阶段结束时的 flush
- profile 与长期记忆的读写

官方的重点不在“存什么格式”，而在：

- 何时 recall
- 何时 flush
- 何时把结论重新注入到后续对话

### Provider 该提供什么

这页真正关注的是能力接口：

- 能取回相关记忆
- 能写入新观察
- 能维护用户 profile
- 能和 Hermes 当前 memory 工具体系协同

也就是说：

- 记忆 provider 需要同时服务“模型上下文注入”和“持久化层”

### 设计目标

这页隐含的设计目标包括：

- 让不同 memory backend 都能在同一 memory abstraction 下工作
- 不要求每个 provider 重新改 agent loop
- 把差异尽量封装在 provider 插件自身

### 这页的核心信息

它真正想传达的是：

- Hermes 的 memory 是可插拔体系
- 做 memory provider，不是做个数据库 adapter，而是实现完整的记忆生命周期契约

---

## 第 12 章：Creating Skills

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills`

### 核心定位

这页是官方的 skill 编写指南。与用户向的 `Work with Skills` 不同，这一页更偏“作者视角”，即：

- 如何设计一个高质量、可复用、可被 agent 正确触发的 skill

### Skill 的本质

官方把 skill 定义为：

- 可重用的 workflow 与知识包

因此 skill 不是简单的长提示词，而应该同时包含：

- 触发场景
- 具体步骤
- 领域知识
- 约束与输出模式

### 一个好 skill 应该具备什么

从这页的结构能看出，官方最重视这些属性：

- 触发条件清晰
- 使用步骤具体
- 内容稳定、可跨任务复用
- 不是项目私货
- 必要时显式声明环境变量依赖

### 该写什么，不该写什么

适合写进 skill 的：

- 重复工作流
- 固定审查标准
- 某个领域的操作知识
- 工具组合使用建议

不适合写进 skill 的：

- 一次性任务说明
- 仓库专属局部规则
- 短期变化很快的说明
- 明文密钥

### 技术层面

官方会要求 skill 文件具备：

- frontmatter / metadata
- 明确的触发与适用条件
- 必要时列出 `required_environment_variables`

这会直接影响：

- agent 何时决定使用该 skill
- 沙箱中哪些变量可透传

### 这页的核心信息

它真正想强调的是：

- 好 skill 的难点不是“写长一点”
- 而是把高频、稳定、可组合的实践沉淀成可被 agent 正确调用的模块

---

## 第 13 章：Extending the CLI

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/extending-the-cli`

### 核心定位

这页讲的是：

- 如何扩展 Hermes 的 CLI / TUI 交互层

而不是改 agent 核心。

### CLI 在整体架构中的角色

官方把 CLI 定位为：

- 最常用的人机交互入口
- 负责输入编辑、slash commands、状态栏、工具流显示、审批交互、图像粘贴等体验层

因此扩 CLI 时要特别注意：

- UX 一致性
- 快捷键
- 中断行为
- 跨平台兼容

### 扩展方式

从这页内容看，CLI 的扩展主要落在：

- 新 slash commands
- 状态 / 显示增强
- 输入行为增强
- 与插件 CLI commands 的接驳

官方也明确支持：

- plugin 通过 `ctx.register_cli_command(...)` 增加命令

### 设计原则

这页隐含的原则包括：

- 不要把运行时业务逻辑硬塞进 CLI 层
- CLI 应更多充当壳层和展示层
- 新命令要与既有 slash command 体系一致
- 交互行为必须考虑中断、审批、终端兼容性

### 这页的核心信息

它本质上是在说：

- CLI 不是一堆零散命令，而是一个统一终端交互系统
- 扩展它时，应该优先保持整体 UX 的连续性

---

## 第 14 章：Tools Runtime

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/tools-runtime`

### 核心定位

这页讨论的是：

- 工具在 Hermes 运行时里如何被发现、序列化、分发、执行与回传

也就是工具系统的内部生命线。

### 运行时视角

从前面多页开发者文档拼起来看，这页真正站在 runtime 角度解释：

- 工具 schema 如何进入 prompt
- 模型如何返回 tool calls
- Hermes 如何 dispatch
- 工具结果如何重新喂回对话
- 并发工具调用如何管理

### 关键设计目标

这页隐含的目标包括：

- 工具层对 provider 差异尽量透明
- 工具返回结果要标准化，便于模型消费
- 并发与中断要一致
- 同一工具 runtime 要被 CLI、gateway、ACP、API server 复用

### 这页的核心信息

它本质是在告诉开发者：

- Hermes 的工具系统不是静态函数表
- 而是一整套 schema-in-prompt、dispatch-at-runtime、result-back-into-history 的统一机制

---

## 第 15 章：ACP Internals

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/acp-internals`

### 核心定位

这页是 ACP 集成的内部实现页，重点不再是“怎么用”，而是：

- ACP adapter 如何桥接编辑器与 Hermes runtime

### 关注点

这页会把 ACP 的几个关键内部点拆开：

- JSON-RPC / protocol bridge
- session manager
- editor working directory 绑定
- tool / diff / terminal / approval 事件如何映射给编辑器

### 与普通 CLI 的区别

官方意图很明确：

- ACP 不是“在编辑器里嵌一个 CLI”
- 而是把 Hermes 包装成 ACP server
- 让编辑器用原生 ACP 语义接收消息、补丁、审批和工具活动

### 这页的核心信息

它真正想解释的是：

- ACP 适配层是一个协议桥
- 既要理解 Hermes runtime，也要理解 ACP client 期望的事件模型

---

## 第 16 章：Cron Internals

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/cron-internals`

### 核心定位

这页从实现角度解释：

- cron scheduler 如何在 gateway 中运行
- 任务状态怎样保存
- 到点后如何拉起 fresh agent session

### 关键机制

结合特性页，这里的实现关注点包括：

- `jobs.json` 持久化
- `next_run_at` 计算
- 每 60 秒 tick
- `.tick.lock` 防重入
- 结果投递与元数据回写

### 这页真正要讲的事

不是“如何用 cron”，而是：

- 为什么 cron job 必须由 gateway 驱动
- 为什么 cron 执行时要禁用再创建 cron 的能力
- 为什么每个 job 必须在隔离 session 里运行

### 这页的核心信息

它真正阐明的是：

- Hermes 的 cron 不是简单 shell scheduler
- 而是“定时触发全功能 agent session”的调度子系统

---

## 第 17 章：Environments

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/environments`

### 核心定位

这页围绕的是：

- Benchmarks / RL / trajectory generation 中的 environment abstraction

也就是 Hermes 如何把任务环境标准化成可训练、可评测、可批处理的对象。

### Environment 在系统中的角色

从官方描述可以看出，environment 负责：

- 提供任务样本
- 组织 prompt
- 评估输出
- 计算 reward / correctness
- 生成可供训练或评测的轨迹

### 这页强调的实现目标

- 任务定义要和 agent runtime 分离
- 环境应可独立复用
- 不同 benchmark / RL 任务共用同一套抽象

### 快速理解

这页其实是 RL Training、Batch Processing、Trajectory Format 的地基说明：

- 若要新增 benchmark 或 RL 任务
- 核心不是改 agent loop
- 而是定义新 environment

### 这页的核心信息

它真正想告诉开发者：

- Hermes 的训练 / 评测不是硬编码脚本堆起来的
- 而是通过 environments 抽象统一管理任务世界

---

## 第 18 章：Trajectory Format

来源：

- `https://hermes-agent.nousresearch.com/docs/developer-guide/trajectory-format`

### 核心定位

这页讲的是：

- Hermes 生成的 trajectory 数据长什么样
- 为什么要这样组织
- 训练与评测系统如何使用它

### 基本结构

结合 Batch Processing 与 RL 页面，这里的 trajectory 核心要素包括：

- conversations
- metadata
- completed / partial
- api_calls
- toolsets_used
- tool_stats
- tool_error_counts

官方也强调：

- `conversations` 采用 ShareGPT-like 结构
- 保持和常见训练数据格式兼容

### 设计目的

这页真正关心的不是“JSON 怎么排版”，而是：

- 如何保留工具使用轨迹
- 如何记录 reasoning 覆盖率
- 如何让后续训练 / 评测 / 数据管线稳定消费这些字段

### 与其他子系统的关系

trajectory format 是这些系统之间的连接点：

- Batch Runner
- RL Training
- Environments
- 未来的数据清洗 / 过滤 / HuggingFace 发布流程

### 这页的核心信息

它真正想说明的是：

- trajectory 是 Hermes 训练与评测生态的标准数据契约
- 一旦改动格式，就会影响整条下游数据链路
