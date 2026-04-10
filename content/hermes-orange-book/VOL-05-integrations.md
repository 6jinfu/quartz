---
title: 第五卷：Integrations
---

# Hermes Agent 中文橙皮书

## 第五卷：Integrations

说明：

- 本卷严格基于 Hermes Agent 官方文档 `Integrations` 分组页面整理。
- 章节顺序与官方侧边栏保持一致。
- 命令、配置键、环境变量、provider 名称、模型名、URL 路径尽量保留英文原样，以避免偏差。
- 本卷覆盖以下 8 篇官方页面：
  - `integrations/index`
  - `integrations/providers`
  - `user-guide/features/mcp`
  - `user-guide/features/acp`
  - `user-guide/features/api-server`
  - `user-guide/features/honcho`
  - `user-guide/features/provider-routing`
  - `user-guide/features/fallback-providers`

---

## 第 1 章：Integrations Overview

来源：

- `https://hermes-agent.nousresearch.com/docs/integrations`

### 这一章讲什么

官方把 Integrations 定义为：Hermes 与外部系统的连接层，让 Hermes 能接入：

- AI inference providers
- MCP tool servers
- Web search backends
- Browser backends
- Voice / TTS providers
- 编辑器与 IDE
- HTTP API frontends
- 外部 memory systems
- 消息平台
- Home automation
- Plugins
- 训练与评测体系

这页本身像一张总览地图，用来告诉你 Hermes 可以连接到哪些外部能力。

### AI Providers & Routing

官方总结：

- Hermes 内建支持多种 AI inference providers
- 可以通过 `hermes model` 交互配置
- 也可直接写进 `config.yaml`

这一块对应 3 个重点页面：

- `AI Providers`
- `Provider Routing`
- `Fallback Providers`

### Tool Servers（MCP）

MCP 的定位是：

- 让 Hermes 直接接外部 tool servers
- 不需要先把那些能力重写成原生 Hermes tool

支持：

- 本地 `stdio` MCP server
- 远程 HTTP MCP server
- 按 server 做工具过滤
- resources / prompts 的能力包装

### Web Search Backends

官方明确写出 `web_search` / `web_extract` 目前支持 4 个后端：

| Backend | 环境变量 | Search | Extract | Crawl |
|---|---|---|---|---|
| Firecrawl | `FIRECRAWL_API_KEY` | ✔ | ✔ | ✔ |
| Parallel | `PARALLEL_API_KEY` | ✔ | ✔ | — |
| Tavily | `TAVILY_API_KEY` | ✔ | ✔ | ✔ |
| Exa | `EXA_API_KEY` | ✔ | ✔ | — |

配置示例：

```yaml
web:
  backend: firecrawl
```

若未设置 `web.backend`：

- Hermes 会根据当前可用 API key 自动检测

还支持：

- 自托管 Firecrawl
- 通过 `FIRECRAWL_API_URL` 指向实例

### Browser Automation

总览页只做摘要式介绍，列出：

- Browserbase
- Browser Use
- Local Chrome via CDP
- Local Chromium via `agent-browser`

完整配置与用法请看 `Browser Automation` 页面。

### Voice & TTS Providers

官方在总览页再次浓缩列出 TTS providers：

- Edge TTS
- ElevenLabs
- OpenAI TTS
- MiniMax
- NeuTTS

STT providers 则是：

- Local Whisper
- Groq
- OpenAI Whisper API

这些能力会贯穿 Telegram、Discord、WhatsApp 等消息平台。

### IDE & Editor Integration

总览页把 ACP 定位成：

- 让 Hermes 变成 ACP server
- 供 VS Code、Zed、JetBrains 等兼容 ACP 的编辑器调用

### Programmatic Access

对应的是 `API Server`：

- 将 Hermes 暴露成 OpenAI-compatible HTTP endpoint
- Open WebUI、LobeChat、LibreChat、NextChat、ChatBox 等前端都可接入

### Memory & Personalization

总览页把记忆分成两层：

- Built-in Memory：`MEMORY.md` / `USER.md`
- Memory Providers：外接记忆后端

其中点名了 7 类 provider，包括：

- Honcho
- OpenViking
- Mem0
- Hindsight
- Holographic
- RetainDB
- ByteRover

### Messaging Platforms / Home Automation / Plugins / Training

总览页也把其他生态位集中列出：

- 15+ 消息平台统一通过 gateway 子系统接入
- Home Assistant 也既是消息平台，又有专门工具集
- Plugins 可扩展 tools / hooks / CLI commands
- RL Training 与 Batch Processing 对应训练与评测

---

## 第 2 章：AI Providers

来源：

- `https://hermes-agent.nousresearch.com/docs/integrations/providers`

### 核心定位

这一页是 Hermes 的 inference provider 总目录。官方覆盖的范围很广：

- 云端 provider
- OAuth 型 provider
- 中国厂商 provider
- 自托管 OpenAI-compatible endpoint
- 本地模型服务
- 多 provider 路由
- fallback model
- smart model routing

官方一句话总结：

- 你至少需要配置一个 provider，Hermes 才能工作

### 快速入口

官方最推荐：

```bash
hermes model
```

它会交互式配置 provider 与 model。

也可以直接写进 `config.yaml`。另外官方特别说明：

- `model.default` 与 `model.model` 两个键都可用
- 两者语义相同

### 官方列出的主要 provider

总表中列出的 provider 包括：

- Nous Portal
- OpenAI Codex
- GitHub Copilot
- GitHub Copilot ACP
- Anthropic
- OpenRouter
- AI Gateway
- z.ai / GLM
- Kimi / Moonshot
- MiniMax
- MiniMax China
- Alibaba Cloud / DashScope / Qwen
- Kilo Code
- OpenCode Zen
- OpenCode Go
- DeepSeek
- Hugging Face
- Google / Gemini
- Custom Endpoint

### 关于 auxiliary model

官方特别提醒：

- 即使主 provider 用的是 Nous Portal、Codex 或 custom endpoint
- 某些 side tools 仍会用单独的 auxiliary model
- 默认通常是 Gemini Flash via OpenRouter

这类工具包括：

- vision
- web summarization
- MoA

因此：

- `OPENROUTER_API_KEY` 常常依旧很有用

### Anthropic（Native）

支持 3 种授权方式：

- `ANTHROPIC_API_KEY`
- 通过 `hermes model` 走 Claude Code / OAuth
- 手工 `ANTHROPIC_TOKEN`

命令示例：

```bash
hermes chat --provider anthropic --model claude-sonnet-4-6
hermes chat --provider anthropic
```

官方还说明：

- `--provider claude`
- `--provider claude-code`

都可以作为 `anthropic` 的别名。

### GitHub Copilot

官方支持两种模式：

#### `copilot`

- 直接走 Copilot API
- 可访问 GPT-5.x、Claude、Gemini 等模型

```bash
hermes chat --provider copilot --model gpt-5.4
```

查 token 的优先顺序：

1. `COPILOT_GITHUB_TOKEN`
2. `GH_TOKEN`
3. `GITHUB_TOKEN`
4. `gh auth token`

若都没有：

- `hermes model` 会提供 OAuth device code login

官方还强调：

- 不支持经典 `ghp_*` PAT
- 推荐 OAuth token / fine-grained PAT / GitHub App token

#### `copilot-acp`

- 启动本地 Copilot CLI 的 ACP backend

```bash
hermes chat --provider copilot-acp --model copilot-acp
```

需要：

- `copilot` CLI 在 PATH
- 已有 `copilot login`

相关环境变量：

- `HERMES_COPILOT_ACP_COMMAND`
- `HERMES_COPILOT_ACP_ARGS`

### First-Class Chinese AI Providers

官方把这些列为一等公民 provider：

- `zai`
- `kimi-coding`
- `minimax`
- `minimax-cn`
- `alibaba`

对应的 key：

- `GLM_API_KEY`
- `KIMI_API_KEY`
- `MINIMAX_API_KEY`
- `MINIMAX_CN_API_KEY`
- `DASHSCOPE_API_KEY`

base URL 也都可通过专门环境变量覆写。

其中 z.ai / GLM 还支持：

- 自动探测多个 endpoint
- 自动缓存可用 endpoint

### xAI Prompt Caching

若 base URL 指向 `x.ai`：

- Hermes 会自动发送 `x-grok-conv-id`
- 把同一会话请求尽量路由到同一后端
- 以复用 prompt cache，降低延迟与成本

### Hugging Face Inference Providers

官方说明 Hugging Face 这条路通过：

- `router.huggingface.co/v1`

统一路由到 20+ 模型和多个底层 provider。

命令示例：

```bash
hermes chat --provider huggingface --model Qwen/Qwen3-235B-A22B-Thinking-2507
hermes chat --provider hf --model deepseek-ai/DeepSeek-V3.2
```

需要：

- `HF_TOKEN`

并且 token 要开启：

- `Make calls to Inference Providers`

模型名还支持后缀：

- `:fastest`
- `:cheapest`
- `:provider_name`

### Custom & Self-Hosted Endpoints

官方明确说：

- 只要实现 `/v1/chat/completions`
- Hermes 就能把它当 OpenAI-compatible endpoint 使用

配置方式有 3 种：

1. `hermes model`
2. 直接编辑 `config.yaml`
3. 旧式 `.env` 已废弃

官方特别强调：

- `OPENAI_BASE_URL`
- `LLM_MODEL`

这两个旧环境变量已删除，不再被 Hermes 任何部分读取。

### `/model` 切换 custom endpoint

```bash
/model custom:qwen-2.5
/model custom
/model openrouter:claude-sonnet-4
```

若配置了 named custom providers，则可用三段式：

```bash
/model custom:local:qwen-2.5
/model custom:work:llama3-70b
```

官方补充：

- 切回内建 provider 时，旧的 `base_url` 会自动清理
- `/model custom` 裸调用时会查询 `/models`
- 若 endpoint 只挂了一个模型，就可自动选中

### 本地模型方案

官方重点列出：

- Ollama
- vLLM
- SGLang
- llama.cpp / llama-server
- LM Studio

#### Ollama

特点：

- 本地跑 open-weight 模型
- 上手最快
- 支持 tool calling

官方特别强调最容易踩坑的是：

- context length 不能靠 `/v1/chat/completions` 设置
- 必须在服务端或 Modelfile 配置

示例：

```bash
OLLAMA_CONTEXT_LENGTH=32768 ollama serve
ollama ps
```

#### vLLM

官方定位：

- 生产级 GPU serving
- 高吞吐
- continuous batching

关键启动参数：

- `--max-model-len`
- `--tensor-parallel-size`
- `--enable-auto-tool-choice`
- `--tool-call-parser hermes`

官方提醒：

- 没有这些 tool flags，模型只会把 tool calls 当文本输出

#### SGLang

特点：

- RadixAttention
- prefix / KV cache reuse
- 适合多轮对话

关键参数：

- `--context-length`
- `--tool-call-parser qwen`

#### LM Studio

定位：

- GUI 驱动的本地模型桌面应用

官方特别警告：

- 很多 GGUF 模型默认 context 只有 2048 或 4096
- 一定要手工把 Context Length 提到至少 16384，最好 32768
- 0.3.6+ 才对工具调用支持较完整

### WSL2 Networking

Windows 用户通过 WSL2 使用 Hermes 时，若模型服务跑在 Windows host，需要跨虚拟网卡访问。

官方列出常见修复方式：

- Ollama：设置 `OLLAMA_HOST=0.0.0.0`
- LM Studio：打开 `Serve on Network`
- llama-server：加 `--host 0.0.0.0`
- vLLM：默认就是 `0.0.0.0`
- SGLang：加 `--host 0.0.0.0`

必要时还要加 Windows Firewall 规则。

### Troubleshooting Local Models

官方总结的常见问题：

- tool calling 不生效：通常是服务端缺 parser / auto tool choice 参数
- 模型“失忆”或回答混乱：context window 太小
- Hermes 启动时显示 `Context limit: 2048 tokens`：应显式在 `config.yaml` 里设 `context_length`
- 回复被截断：常见原因是 server 端 `max_tokens` 太小，或上下文耗尽

官方给出的经验值是：

- agent 使用最好至少给 `32768` tokens context

### Named Custom Providers

若有多个自定义 endpoint，可在 `config.yaml` 中定义：

```yaml
custom_providers:
  - name: local
    base_url: http://localhost:8080/v1
  - name: work
    base_url: https://gpu-server.internal.corp/v1
    api_key: corp-api-key
```

还支持：

- `api_mode: chat_completions`
- `api_mode: anthropic_messages`

然后可用：

```bash
/model custom:anthropic-proxy:claude-sonnet-4
```

### Choosing the Right Setup

官方给了一个推荐表：

| Use Case | Recommended |
|---|---|
| Just want it to work | OpenRouter 或 Nous Portal |
| Local models, easy setup | Ollama |
| Production GPU serving | vLLM 或 SGLang |
| Mac / no GPU | Ollama 或 llama.cpp |
| Multi-provider routing | LiteLLM Proxy 或 OpenRouter |
| Cost optimization | ClawRouter 或 OpenRouter + `sort: "price"` |
| Maximum privacy | Ollama / vLLM / llama.cpp |
| Enterprise / Azure | Azure OpenAI + custom endpoint |

### OpenRouter Provider Routing / Fallback / Smart Routing

这页最后还把 3 个高级配置浓缩带了一遍：

- `provider_routing`
- `fallback_model`
- `smart_model_routing`

其中 `smart_model_routing` 的思路是：

- 简短、低风险、非代码型问题可以路由到便宜模型
- 复杂任务则继续走主模型
- 若 cheap route 解析失败，会自动回退主模型

---

## 第 3 章：MCP（Model Context Protocol）

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp`

### 核心定位

MCP 让 Hermes 能连接外部 tool servers，例如：

- GitHub
- databases
- file systems
- browser stacks
- internal APIs

官方的判断标准很明确：

- 如果某个工具已经在外部系统里存在
- MCP 往往是最干净的接入方式

### What MCP gives you

官方列出的价值：

- 不用先写原生 Hermes tool
- `stdio` 与远程 HTTP MCP servers 可共存
- 启动时自动发现并注册工具
- 若 server 支持，还会包装 resources / prompts
- 可按 server 做工具过滤

### Quick Start

1. 安装 MCP extra：

```bash
cd ~/.hermes/hermes-agent
uv pip install -e ".[mcp]"
```

2. 在 `config.yaml` 加一个 server：

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
```

3. 启动 Hermes：

```bash
hermes chat
```

4. 直接让 Hermes 使用该能力即可。

### 两类 MCP servers

#### Stdio servers

- 本地子进程
- 通过 stdin / stdout 通信

示例：

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "***"
```

适合：

- server 装在本机
- 低延迟本地资源访问
- 官方文档本身就是 `command` / `args` / `env` 风格

#### HTTP servers

- Hermes 直接连远程 URL

```yaml
mcp_servers:
  remote_api:
    url: "https://mcp.example.com/mcp"
    headers:
      Authorization: "Bearer ***"
```

适合：

- 组织内部暴露的 MCP endpoint
- 不希望 Hermes 本地再拉子进程

### Hermes 如何注册 MCP tools

为避免与内建工具重名，官方规定注册名统一加前缀：

- `mcp_<server_name>_<tool_name>`

例子：

- `mcp_filesystem_read_file`
- `mcp_github_create_issue`
- `mcp_my_api_query_data`

但官方也强调：

- 实战中通常不需要你手工调用这个前缀名
- Hermes 会在正常推理时自动选择

### MCP utility tools

若 server 支持，Hermes 还会额外注册：

- `list_resources`
- `read_resource`
- `list_prompts`
- `get_prompt`

注册后也会带 server 前缀，例如：

- `mcp_github_list_resources`
- `mcp_github_get_prompt`

这些 utility wrappers 是 capability-aware 的：

- 只有 server 真支持 resources 时才注册 resource wrappers
- 只有 server 真支持 prompts 时才注册 prompt wrappers

### Per-server filtering

官方把过滤系统当成命名空间管理与安全控制。

#### 完全禁用某 server

```yaml
mcp_servers:
  legacy:
    url: "https://mcp.legacy.internal"
    enabled: false
```

效果：

- 连连接都不会尝试

#### 白名单 include

```yaml
tools:
  include: [create_issue, list_issues]
```

只注册列出的 MCP tools。

#### 黑名单 exclude

```yaml
tools:
  exclude: [delete_customer]
```

注册除它之外的所有工具。

#### 优先级

若同时有：

- `include`
- `exclude`

则：

- `include` 优先

#### 关闭 utility wrappers

```yaml
tools:
  prompts: false
  resources: false
```

含义：

- `resources: false` 关闭 `list_resources` / `read_resource`
- `prompts: false` 关闭 `list_prompts` / `get_prompt`

### Full example

官方给的综合示例里同时展示了：

- GitHub stdio server + include whitelist
- Stripe HTTP server + exclude blacklist
- Legacy server + `enabled: false`

### Runtime behavior

官方说明：

- MCP servers 在启动时发现并注册
- 若配置变了，可执行 `/reload-mcp`

更重要的是它还支持：

- `notifications/tools/list_changed`

即 server 可在运行时告诉 Hermes：

- 自己的 tools 变了

Hermes 收到后会自动刷新 tool list，不需要手工 `/reload-mcp`。

但目前：

- `prompts/list_changed`
- `resources/list_changed`

只会接收，不会实际触发刷新。

### Toolsets

每个已成功贡献至少一个工具的 MCP server，还会形成一个运行时 toolset：

- `mcp-<server>`

这有助于在 toolset 层面管理。

### Security model

官方安全模型包括两层：

#### Stdio env filtering

- 不会把整个 shell environment 原样透传给 stdio server
- 只传显式配置的 `env` 加上安全基线

#### Config-level exposure control

过滤系统本身也是安全控制：

- 能隐藏危险工具
- 只暴露最小白名单
- 能关掉 resource / prompt wrappers

### Troubleshooting

常见原因包括：

- 没装 MCP extra
- `node` / `npx` 不可用
- server 连不上
- discovery 失败
- filter 把工具全过滤掉了
- utility capability 本来就不存在
- server 被 `enabled: false` 禁了

---

## 第 4 章：ACP Editor Integration

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/features/acp`

### 核心定位

ACP 模式下，Hermes 作为 ACP server 运行，兼容 ACP 的编辑器可以通过 stdio 与其对话，并在编辑器内渲染：

- chat messages
- tool activity
- file diffs
- terminal commands
- approval prompts
- streamed thinking / response chunks

官方的定位很明确：

- 这是一种“编辑器原生 coding agent”模式
- 不是单独 CLI，也不是消息 bot

### ACP 模式下暴露什么

Hermes 会启用一套精选过的：

- `hermes-acp`

toolset，包含：

- `read_file`、`write_file`、`patch`、`search_files`
- `terminal`、`process`
- web / browser tools
- memory、todo、session search
- skills
- `execute_code`
- `delegate_task`
- vision

刻意排除的能力包括：

- messaging delivery
- cronjob management

因为这些不适合典型编辑器 UX。

### Installation

```bash
pip install -e '.[acp]'
```

会启用：

- `hermes acp`
- `hermes-acp`
- `python -m acp_adapter`

### Launching the ACP server

任意一种都可以启动：

```bash
hermes acp
hermes-acp
python -m acp_adapter
```

官方特别说明：

- 日志写到 stderr
- stdout 保留给 ACP JSON-RPC 流量

### Editor setup

#### VS Code

需要 ACP client extension，并指向：

- `acp_registry/`

官方示例设置：

```json
{
  "acpClient.agents": [
    {
      "name": "hermes-agent",
      "registryDir": "/path/to/hermes-agent/acp_registry"
    }
  ]
}
```

#### Zed

```json
{
  "agent_servers": {
    "hermes-agent": {
      "type": "custom",
      "command": "hermes",
      "args": ["acp"]
    }
  }
}
```

#### JetBrains

使用 ACP-compatible plugin，并把 registry 指向：

- `/path/to/hermes-agent/acp_registry`

### Registry manifest

manifest 位于：

- `acp_registry/agent.json`

对外声明的启动命令是：

- `hermes acp`

### Configuration and credentials

ACP 模式与 CLI 共用 Hermes 的常规配置：

- `~/.hermes/.env`
- `~/.hermes/config.yaml`
- `~/.hermes/skills/`
- `~/.hermes/state.db`

也就是说：

- provider 解析与 credentials 解析都沿用 Hermes 正常 runtime resolver

### Session behavior

ACP session 由 ACP adapter 的内存 session manager 跟踪。每个 session 保存：

- session ID
- working directory
- selected model
- current conversation history
- cancel event

官方还强调：

- `AIAgent` 自身仍使用 Hermes 常规持久化与日志路径
- 但 ACP 的 `list/load/resume/fork` 只作用于当前正在运行的 ACP server 进程

### Working directory behavior

ACP 会把编辑器工作区的 cwd 绑定到 Hermes task ID，使文件和 terminal 工具相对：

- editor workspace

而不是 ACP server 进程的 cwd。

### Approvals

危险 terminal commands 可以通过 ACP 桥回到编辑器做审批。选项比 CLI 更简化：

- allow once
- allow always
- deny

若超时或桥接出错：

- 默认按 deny 处理

### Troubleshooting

若编辑器里看不到 ACP agent，检查：

- `acp_registry/` 路径是否正确
- Hermes 是否在 PATH
- ACP extra 是否已安装

若 ACP 一启动就报错，官方建议先跑：

```bash
hermes doctor
hermes status
hermes acp
```

---

## 第 5 章：API Server

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server`

### 核心定位

API Server 会把 hermes-agent 暴露成：

- OpenAI-compatible HTTP endpoint

这意味着任何会说 OpenAI 格式的前端都能把 Hermes 当 backend 用，例如：

- Open WebUI
- LobeChat
- LibreChat
- NextChat
- ChatBox

而且接进去的不是“普通聊天模型”，而是 Hermes 的完整 agent：

- terminal
- file operations
- web search
- memory
- skills

### Quick Start

#### 1. 启用 API server

加入 `~/.hermes/.env`：

```bash
API_SERVER_ENABLED=true
API_SERVER_KEY=change-me-local-dev
# API_SERVER_CORS_ORIGINS=http://localhost:3000
```

#### 2. 启动 gateway

```bash
hermes gateway
```

成功时会看到：

```text
[API Server] API server listening on http://127.0.0.1:8642
```

#### 3. 连接前端

目标地址是：

- `http://localhost:8642/v1`

测试命令：

```bash
curl http://localhost:8642/v1/chat/completions \
  -H "Authorization: Bearer change-me-local-dev" \
  -H "Content-Type: application/json" \
  -d '{"model": "hermes-agent", "messages": [{"role": "user", "content": "Hello!"}]}'
```

### Endpoints

#### `POST /v1/chat/completions`

这是标准 OpenAI Chat Completions 格式。

特点：

- 无状态
- 完整会话由客户端通过 `messages` 提供

支持：

- 普通响应
- `stream: true` 的 SSE 流式响应

流式时，官方还专门加了：

- tool progress indicators

也就是当前正在执行什么工具，会以内联 markdown 小提示插入内容流，让前端能实时显示 agent 在做什么。

#### `POST /v1/responses`

这是 OpenAI Responses API 格式。

特点：

- 支持 `previous_response_id`
- 由服务器维护多轮上下文状态
- 工具调用与工具结果也会保留在链条中

官方示例说明：

- 你可以先发一次请求得到 `resp_abc123`
- 下一轮只发 `input` 与 `previous_response_id`
- server 会自己重建完整上下文

### Configuration

环境变量包括：

- `API_SERVER_ENABLED`
- `API_SERVER_PORT`，默认 `8642`
- `API_SERVER_HOST`，默认 `127.0.0.1`
- `API_SERVER_KEY`
- `API_SERVER_CORS_ORIGINS`
- `API_SERVER_MODEL_NAME`

官方明确指出：

- `config.yaml` 暂时还不支持 API Server 配置
- 目前只能用环境变量

### Security headers

所有响应都会带：

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`

### 安全提醒

从默认值可以看出，官方思路是：

- 默认只绑定 localhost
- 默认要求 Bearer token
- 只有浏览器直连时才需要额外开 CORS

因此：

- 更适合本地或受控反向代理环境

---

## 第 6 章：Honcho Memory

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/features/honcho`

### 核心定位

官方把 Honcho 定义为：

- 一个 AI-native memory backend
- 通过 dialectic reasoning 与深层用户建模，为 Hermes 的内建记忆系统提供增强

与简单 key-value 不同，Honcho 追求的是：

- 持续推断用户是谁
- 用户喜欢什么
- 沟通风格怎样
- 有什么目标和行为模式

### 它属于什么

官方特别写明：

- Honcho 是一个 Memory Provider Plugin
- 它是统一 `Memory Providers` 体系中的一个 provider

### Honcho 相对内建记忆多了什么

文档用对照表总结：

| 能力 | Built-in Memory | Honcho |
|---|---|---|
| Cross-session persistence | 文件型 `MEMORY.md` / `USER.md` | 服务端 API |
| User profile | 手工 curated | 自动 dialectic reasoning |
| Multi-agent isolation | — | 每 peer 分离 |
| Observation modes | — | unified / directional |
| Conclusions | — | 服务端推导用户模式 |
| Search across history | FTS5 session search | conclusion 级 semantic search |

官方进一步解释：

- 每次对话后，Honcho 会分析本轮交流
- 产出“conclusions”
- 这些 conclusions 会随着时间积累

### Tools

当 Honcho 成为活动 memory provider 时，官方说会新增 4 个工具：

- `honcho_conclude`
- `honcho_context`
- `honcho_profile`
- `honcho_search`

分别对应：

- 触发最近对话的 dialectic reasoning
- 为当前会话拉取相关上下文
- 查看 / 更新用户 Honcho profile
- 在结论与 observation 上做 semantic search

### CLI Commands

官方列出两条：

```bash
hermes honcho status
hermes honcho peer
```

用途：

- 查看连接状态与配置
- 为多 agent 场景更新 peer names

### 从旧 `hermes honcho` 迁移

如果之前用过独立的 `hermes honcho setup`：

1. 原有配置会保留
2. 服务端数据不会丢
3. 只需在 `config.yaml` 中设 `memory.provider: honcho`

官方强调：

- 不需要重新登录
- 不需要重新 setup
- 跑 `hermes memory setup`，选 `honcho` 即可，它会自动发现原配置

---

## 第 7 章：Provider Routing

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/features/provider-routing`

### 核心定位

Provider Routing 只在：

- 使用 OpenRouter 作为 LLM provider 时

生效。

作用是：

- 控制底层具体由哪些 provider 处理请求
- 优化 cost / speed / quality
- 满足参数支持与数据处理要求

官方强调：

- 若是直接连 Anthropic API 之类的 native provider
- `provider_routing` 完全不起作用

### 配置

```yaml
provider_routing:
  sort: "price"
  only: []
  ignore: []
  order: []
  require_parameters: false
  data_collection: null
```

### 各选项含义

#### `sort`

决定 OpenRouter 的 provider 排序方式：

- `"price"`：最便宜优先
- `"throughput"`：tokens/sec 最快优先
- `"latency"`：首 token 最快优先

#### `only`

- provider 白名单
- 只允许这些 provider

示例：

```yaml
only:
  - "Anthropic"
  - "Google"
```

#### `ignore`

- provider 黑名单
- 这些 provider 永远不会被选中

示例：

```yaml
ignore:
  - "Together"
  - "DeepInfra"
```

#### `order`

- 显式优先顺序
- 列出的越靠前越优先
- 未列出的 provider 仍可作为 fallback

#### `require_parameters`

设为 `true` 后：

- OpenRouter 只会路由到支持你本次请求全部参数的 provider
- 避免 `temperature`、`tools` 等参数被静默丢弃

#### `data_collection`

控制 provider 是否可用你的 prompts 做训练：

- `"allow"`
- `"deny"`

### 使用场景

这页的实质是在回答：

- 想按价格优化怎么办
- 想避开特定 provider 怎么办
- 想保证所有请求参数都被支持怎么办
- 想禁止数据被训练使用怎么办

---

## 第 8 章：Fallback Providers

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers`

### 三层韧性模型

官方把 Hermes 的 provider resilience 分成 3 层：

1. `Credential pools`
2. Primary model fallback
3. Auxiliary task fallback

其中：

- `Credential pools` 先于其他层尝试
- 这一页主要讲的是“跨 provider fallback”，不是同 provider 的多 key 轮换

### Primary Model Fallback

当主 provider 遇到这些问题时：

- rate limit
- server overload
- auth failure
- connection drop

Hermes 可以在：

- 不丢会话上下文的前提下

切到备用 `provider:model`。

配置方式：

```yaml
fallback_model:
  provider: openrouter
  model: anthropic/claude-sonnet-4
```

两项都必填：

- `provider`
- `model`

否则 fallback 不生效。

### 支持的 fallback providers

官方页面列出的支持项包括：

- `ai-gateway`
- `openrouter`
- `nous`
- `openai-codex`
- `copilot`
- `copilot-acp`
- `anthropic`
- `zai`
- 以及其他多种 API-key provider
- `custom`

### 示例

官方给了几种典型组合：

#### Anthropic native -> OpenRouter

```yaml
model:
  provider: anthropic
  default: claude-sonnet-4-6

fallback_model:
  provider: openrouter
  model: anthropic/claude-sonnet-4
```

#### OpenRouter -> Nous Portal

```yaml
model:
  provider: openrouter
  default: anthropic/claude-opus-4

fallback_model:
  provider: nous
  model: nous-hermes-3
```

#### Cloud -> Local custom endpoint

```yaml
fallback_model:
  provider: custom
  model: llama-3.1-70b
  base_url: http://localhost:8000/v1
  api_key_env: LOCAL_API_KEY
```

#### Codex OAuth 作为 fallback

```yaml
fallback_model:
  provider: openai-codex
  model: gpt-5.3-codex
```

### Fallback 生效范围

官方表格写得很清楚：

| 场景 | 是否支持 |
|---|---|
| CLI sessions | ✔ |
| Messaging gateway | ✔ |
| Subagent delegation | ✘ |
| Cron jobs | ✘ |
| Auxiliary tasks | ✘ |

也就是说：

- 子 agent 不继承 fallback config
- cron 固定 provider 运行
- auxiliary tasks 走它们自己的 provider chain

官方还特别说明：

- `fallback_model` 只能写在 `config.yaml`
- 没有环境变量

### Auxiliary Task Fallback

Hermes 对 side tasks 使用单独轻量模型，每类任务都有独立 provider resolution chain。

独立任务包括：

- `auxiliary.vision`
- `auxiliary.web_extract`
- `auxiliary.compression`
- `auxiliary.session_search`
- `auxiliary.skills_hub`
- `auxiliary.mcp`
- `auxiliary.flush_memories`

#### Auto-detection chain

若 provider 设为 `"auto"`：

文本类任务会依次尝试：

- OpenRouter
- Nous Portal
- Custom endpoint
- Codex OAuth
- 其他 API-key providers

视觉任务会依次尝试：

- 主 provider（若支持 vision）
- OpenRouter
- Nous Portal
- Codex OAuth
- Anthropic
- Custom endpoint

官方还补充：

- 若实际调用时失败
- 且当前不是 OpenRouter 且未设显式 `base_url`
- Hermes 还会以 OpenRouter 作为最终兜底重试

### Configuring Auxiliary Providers

每个 auxiliary task 都可独立写：

```yaml
auxiliary:
  vision:
    provider: "auto"
    model: ""
    base_url: ""
    api_key: ""

  web_extract:
    provider: "auto"
    model: ""
```

顶层 compression 也有自己的等价写法：

```yaml
compression:
  summary_provider: main
  summary_model: google/gemini-3-flash-preview
  summary_base_url: null
```

### 总结

官方最后给出的统一模式是：

- auxiliary
- compression
- fallback_model

这三套都遵循同一个三元配置思路：

- `provider`
- `model`
- `base_url`
