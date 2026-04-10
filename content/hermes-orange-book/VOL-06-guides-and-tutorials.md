---
title: 第六卷：Guides and Tutorials
---

# Hermes Agent 中文橙皮书

## 第六卷：Guides And Tutorials

说明：

- 本卷严格基于 Hermes Agent 官方文档 `Guides & Tutorials` 分组页面整理。
- 因教程页数量较多，最初按批次整理；当前版本已补齐本卷全部章节。
- 当前已完成：
  - `guides/tips`
  - `guides/local-llm-on-mac`
  - `guides/daily-briefing-bot`
  - `guides/team-telegram-assistant`
  - `guides/python-library`
  - `guides/use-mcp-with-hermes`
  - `guides/use-soul-with-hermes`
  - `guides/use-voice-mode-with-hermes`
  - `guides/build-a-hermes-plugin`
  - `guides/automate-with-cron`
  - `guides/work-with-skills`
  - `guides/delegation-patterns`
  - `guides/migrate-from-openclaw`

---

## 第 1 章：Tips & Best Practices

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/tips`

### 这一章讲什么

官方把这页定位为：

- 一组能立刻提高 Hermes 使用效率的 quick wins

覆盖面包括：

- 提示词写法
- CLI 高阶用法
- Context Files
- Memory 与 Skills
- 成本与性能
- Messaging
- Security

### Getting the Best Results

官方建议的核心原则：

- 要具体，不要只说 “fix the code”
- 一次性把上下文给全：路径、报错、期望行为
- 反复要说的规则写进 `AGENTS.md`
- 不要事无巨细地指挥 agent 每一步，让它自己用工具探索
- 复杂流程优先考虑已有 skill

官方甚至给出一句经验：

- 一个写得好的消息，通常胜过三轮澄清

### CLI Power User Tips

官方列出的高频技巧包括：

- `Alt+Enter` 或 `Ctrl+J`：插入换行而不发送
- 多行粘贴会被自动识别为单条消息
- `Ctrl+C` 单击中断当前响应，双击 2 秒内强制退出
- `hermes -c`：恢复上次会话
- 剪贴板图片可直接粘贴进 CLI 走 vision
- `/` + `Tab`：slash command 自动补全
- `/verbose`：切换工具输出显示级别

### Context Files

#### `AGENTS.md`

官方把它称为：

- 项目的大脑

适合放：

- 架构决策
- 编码规范
- 测试规则
- 项目级约束

#### `SOUL.md`

官方建议：

- 用 `SOUL.md` 定义稳定人格 / 语气
- 用 `AGENTS.md` 放项目特定约束

#### `.cursorrules`

兼容读取：

- `.cursorrules`
- `.cursor/rules/*.mdc`

#### Discovery 规则

官方特别说明：

- 顶层 `AGENTS.md` 在 session 启动时加载
- 子目录 `AGENTS.md` 是懒发现的
- 通过工具调用结果动态注入，不会一开始就塞进 system prompt

### Memory & Skills

官方用一句话区分：

- Memory 记的是“事实”
- Skills 记的是“流程”

进一步建议：

- 重复 5 步以上且以后还会做的任务，适合做成 skill
- session 完成后可说 “remember this for next time”
- memory 有容量上限，需要周期性清理与合并

官方特别警告：

- memory 是 session 开始时的冻结快照
- 中途写入磁盘后，不会立刻改变当前 prompt cache

### Performance & Cost

核心建议包括：

- 不要频繁改变 system prompt，以保住 prompt cache
- 临近上下文上限时用 `/compress`
- 多主题并行研究时用 `delegate_task`
- 批量操作优先考虑 `execute_code`
- 根据任务切换合适模型
- 定期用 `/usage` 和 `/insights` 看消耗

### Messaging Tips

官方建议：

- 在 Telegram / Discord 用 `/sethome` 设一个 home channel
- 用 `/title` 给 session 命名，方便恢复
- 团队访问优先用 DM pairing，而不是手工收集 ID
- 消息平台一般把 tool progress 保持在简洁档位

### Security

这页最后的建议包括：

- 不信任的代码优先放 Docker / Daytona 容器里跑
- Windows 上注意 UTF-8 编码陷阱
- 危险命令审批时，不要轻易点 “always”
- Command approval 是关键安全网，不要在生产里关闭
- 对消息 bot 永远优先 allowlists / pairing，不要直接 `GATEWAY_ALLOW_ALL_USERS=true`

---

## 第 2 章：Run Local LLMs on Mac

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/local-llm-on-mac`

### 目标

这篇指南教你如何在 macOS 上跑一个：

- OpenAI-compatible local LLM server

官方强调它的收益：

- 完整隐私
- 零 API 成本
- Apple Silicon 上性能出乎意料地好

### 两条后端路线

官方只覆盖两种：

| Backend | 安装方式 | 优势 | 格式 |
|---|---|---|---|
| `llama.cpp` | `brew install llama.cpp` | 首 token 最快、量化 KV cache 省内存 | GGUF |
| `omlx` | `omlx.ai` App | token 生成更快、原生 Metal 优化 | MLX / safetensors |

它们都提供：

- `/v1/chat/completions`

Hermes 只需指向：

- `http://localhost:8080`
- 或 `http://localhost:8000`

### 平台前提

官方明确说：

- 这篇指南主要面向 Apple Silicon（M1 及以后）
- Intel Mac 虽然能跑 llama.cpp，但没有 GPU acceleration，会明显更慢

### 选模型

官方推荐入门模型：

- `Qwen3.5-9B`

原因：

- 推理能力强
- 在 8GB+ unified memory 上配合量化能比较舒适地运行

官方给了两种变体：

- `Qwen3.5-9B-Q4_K_M`（GGUF）
- `Qwen3.5-9B-mlx-lm-mxfp4`（MLX）

并给出经验法则：

- 内存需求 = 模型体积 + KV cache
- 9B Q4 模型约 5GB
- 128K context 下，Q4 KV cache 再加约 4–5GB
- 若用默认 f16 KV cache，会暴涨到约 16GB

### Option A：llama.cpp

#### 安装

```bash
brew install llama.cpp
```

会得到：

- `llama-server`

#### 下载模型

官方示例：

```bash
brew install huggingface-cli
huggingface-cli download unsloth/Qwen3.5-9B-GGUF Qwen3.5-9B-Q4_K_M.gguf --local-dir ~/models
```

若模型受限：

- 先执行 `huggingface-cli login`

#### 启动服务

```bash
llama-server -m ~/models/Qwen3.5-9B-Q4_K_M.gguf \
  -ngl 99 \
  -c 131072 \
  -np 1 \
  -fa on \
  --cache-type-k q4_0 \
  --cache-type-v q4_0 \
  --host 0.0.0.0
```

官方逐项解释了这些 flags，核心结论是：

- `-ngl 99`：尽量全放 GPU
- `-c 131072`：128K context
- `-np 1`：单用户保持 1 slot
- `-fa on`：flash attention，降内存提速度
- `--cache-type-k/v q4_0`：最关键的 KV cache 内存优化
- `--host 0.0.0.0`：对外监听；只本地使用可改 `127.0.0.1`

#### 内存优化建议

官方给出 128K context 下的 KV cache 对比：

- f16：约 16GB
- q8_0：约 8GB
- q4_0：约 4GB

因此：

- 8GB Mac：用 `q4_0`，并把 context 降到 `32768`
- 16GB：可较舒适跑 128K
- 32GB+：可尝试更大模型或多个 slots

### Option B：MLX via omlx

官方定位：

- `omlx` 是一个 macOS-native app
- 管理并服务 MLX 模型
- 基于 Apple 自家的 MLX 框架

步骤：

1. 从 `omlx.ai` 安装 App
2. 下载 `Qwen3.5-9B-mlx-lm-mxfp4`
3. 默认在 `http://127.0.0.1:8000` 提供服务

测试命令：

```bash
curl -s http://127.0.0.1:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen3.5-9B-mlx-lm-mxfp4",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
  }' | jq .choices[0].message.content
```

查看可用模型：

```bash
curl -s http://127.0.0.1:8000/v1/models | jq '.data[].id'
```

### Benchmarks

官方在同一台 Apple M5 Max、128GB unified memory 上跑了对比：

- llama.cpp：首 token 更快，约 4.3x 优势
- MLX：生成 token 更快，约 37% 优势
- 512 tokens 总耗时：MLX 约快 25%

官方给出的结论：

- 交互式聊天、低延迟工具：优先 `llama.cpp`
- 长文本生成、批处理：优先 `MLX`
- 8–16GB 机器：`llama.cpp` 更有优势
- 要同时服务多个模型：`omlx`

### 接到 Hermes

最后一步就是：

```bash
hermes model
```

然后选择：

- `Custom endpoint`

再填：

- 本地服务 base URL
- 模型名

---

## 第 3 章：Tutorial: Build a Daily Briefing Bot

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/daily-briefing-bot`

### 目标

这篇教程要搭一个：

- 每天早上自动唤醒
- 去网上查你关心的话题
- 做成简报
- 发到 Telegram / Discord

的 briefing bot。

官方强调：

- 全程不用写代码
- 只是把 web search、cron、delegation、messaging 组合起来

### What We’re Building

整条链路是：

1. 早上 8:00 触发 cron
2. Hermes 拉起一个新 session
3. web search 抓最新消息
4. summarization 整成 briefing
5. 投递到 Telegram 或 Discord

若没配置消息平台：

- 也可以用 `deliver: "local"`
- 输出保存在 `~/.hermes/cron/output/`

### Prerequisites

官方要求：

- 已安装 Hermes
- gateway 正在运行，因为 cron 由 gateway 执行
- 已配置 Firecrawl API key（`FIRECRAWL_API_KEY`）
- 可选但推荐：配置 Telegram / Discord，并设好 home channel

### Step 1：先手工跑通

先进入：

```bash
hermes
```

然后手动发 prompt：

```text
Search for the latest news about AI agents and open source LLMs.
Summarize the top 3 stories in a concise briefing format with links.
```

官方强调：

- 先手工验证工作流，再自动化

### Step 2：Create the Cron Job

这一节有两种方式：

#### Option A：Natural Language

直接在对话里说要每天几点做什么，并发到哪里。

#### Option B：CLI / Slash Command

通过：

- `hermes cron create`
- 或 `/cron add`

显式建任务。

#### Golden Rule：Self-Contained Prompts

官方把这条单独拎出来强调：

- cron prompt 必须自包含
- 不能依赖“本次对话刚刚提过的上下文”
- 因为 cron 执行时跑的是全新 session

### Step 3：Customize the Briefing

这一节给了几个典型变体：

- Multi-topic briefings
- 使用 delegation 做并行研究
- Weekday-only schedule
- Twice-daily briefings
- 用 memory 添加个人偏好上下文

核心思路是：

- prompt 里明确写你关心哪些主题
- 是否按工作日执行
- 是否早晚各一次
- 输出格式是什么

### 整体经验

这篇教程真正想传达的是：

- cron 负责定时
- web search 负责抓信息
- delegation 负责并行化
- messaging / local delivery 负责结果投递

也就是把 Hermes 的几个核心 feature 组合成一条稳定的自动化流水线。

---

## 第 4 章：Set Up a Team Telegram Assistant

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/team-telegram-assistant`

### 目标

这篇教程要搭的是：

- 一个 Telegram bot
- 多个团队成员都能 DM 使用
- 具备完整 tool access
- 每人自己的会话相互隔离
- 默认安全，只允许授权用户访问

官方明确说它适合：

- 代码协助
- 研究
- shell 命令
- 调试
- 定时 standups、健康检查、提醒

### Prerequisites

需要：

- Hermes 安装在服务器 / VPS 上，不建议跑在笔记本上
- 你自己的 Telegram 账号
- 至少一个已配置好的 LLM provider

官方还给了一个现实建议：

- `$5/月` 的 VPS 就够跑 gateway

### Step 1：Create a Telegram Bot

仍然通过：

- `@BotFather`

流程是：

1. `/newbot`
2. 配 display name
3. 配必须以 `bot` 结尾的 username
4. 复制 bot token

### Step 2：Configure the Gateway

#### Option A：交互式

```bash
hermes gateway setup
```

#### Option B：手工

核心就是写入：

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ALLOWED_USERS`

并通过：

- `@userinfobot`
- 或 `@get_id_bot`

找到自己的 Telegram user ID。

### Step 3：Start the Gateway

先前台快速测试：

```bash
hermes gateway
```

生产环境则安装成服务。

官方还强调：

- 要验证 gateway 真的在跑
- 否则 bot 在线状态与消息处理都不会稳定

### Step 4：Set Up Team Access

这一步是整篇的重点。官方给了两条路：

#### Approach A：Static Allowlist

- 直接把团队成员 Telegram IDs 全写进 `TELEGRAM_ALLOWED_USERS`

#### Approach B：DM Pairing（推荐）

- 新同事先 DM bot
- 收到 pairing code
- 管理员执行 `hermes pairing approve ...`

官方更推荐 pairing，因为：

- 不用事先收集团队所有 ID
- 审批式更安全

### Step 5：Configure the Bot

这一步围绕三个点展开：

- Set a Home Channel
- 配置 Tool Progress Display
- 用 `SOUL.md` 设置稳定人格 / 语气

也就是说，一个团队 bot 不只是“能回话”，还要解决：

- 结果回到哪里
- 日常输出多啰嗦
- 说话风格是否适合团队

### 教程想表达的核心

这篇教程本质上是在教你把：

- Telegram integration
- gateway
- allowlists / pairing
- SOUL.md
- home channel

组合成一个可供多人安全使用的团队 AI 助手。

---

## 第 5 章：Using Hermes as a Python Library

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/python-library`

### 核心定位

官方一开始就强调：

- Hermes 不只是 CLI
- 你可以直接 import `AIAgent`
- 在 Python 脚本、Web 应用、自动化流水线里程序化使用

### Installation

官方给出 3 种方式：

```bash
pip install git+https://github.com/NousResearch/hermes-agent.git
uv pip install git+https://github.com/NousResearch/hermes-agent.git
```

或在 `requirements.txt` 里写：

```text
hermes-agent @ git+https://github.com/NousResearch/hermes-agent.git
```

官方提醒：

- 作为库使用时，仍需和 CLI 一样配置环境变量
- 至少要有某个可用的 provider key

### Basic Usage

最简单的入口是：

- `chat()`

官方示例：

```python
from run_agent import AIAgent

agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    quiet_mode=True,
)
response = agent.chat("What is the capital of France?")
print(response)
```

`chat()` 会自己处理：

- 完整 conversation loop
- tool calls
- retries

最终只返回最终文本响应。

### 这篇指南的核心意思

虽然 CLI 是最常见入口，但 Hermes 的核心抽象其实是：

- `AIAgent`

因此你可以把 Hermes 当：

- 程序内的 agent runtime

嵌进你自己的应用，而不仅仅把它当成一个命令行工具。

---

## 第 6 章：Use MCP with Hermes

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes`

### 教程目标

这篇教程是 MCP 的实操版，重点不是讲协议原理，而是带你把：

- 外部 MCP server

真正接进 Hermes，并让 agent 直接调用其工具。

### 先装 MCP 支持

官方第一步是安装 MCP extra：

```bash
cd ~/.hermes/hermes-agent
uv pip install -e ".[mcp]"
```

教程明确说：

- 不装这个 extra，Hermes 不会加载 MCP runtime

### 从一个最小 server 开始

官方推荐从：

- `@modelcontextprotocol/server-filesystem`

这类现成 stdio server 开始。

示例配置：

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/home/user/projects"
```

这条配置的意思是：

- 启动一个本地子进程
- 暴露指定目录下的文件系统能力

### 启动与验证

启动：

```bash
hermes chat
```

然后可以直接问 Hermes：

- 列目录
- 读文件
- 改文件

因为 MCP tools 会在启动时自动注册进 Hermes 的工具列表。

### GitHub MCP 示例

教程也给了 GitHub server 的样例，核心配置仍是：

- `command`
- `args`
- `env`

例如：

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "***"
```

官方想表达的是：

- 凭据不要塞进 prompt
- 要通过 server 进程的环境变量传入

### HTTP MCP server

除了 stdio，教程也说明可以连远程 HTTP MCP server：

```yaml
mcp_servers:
  remote_api:
    url: "https://mcp.example.com/mcp"
    headers:
      Authorization: "Bearer ***"
```

适合：

- 团队统一维护的内部 MCP service
- 不想在 Hermes 本地再装 Node / 二进制 server 的场景

### 工具注册规则

教程会把你带回 MCP 特性的几个关键点：

- 工具名统一变成 `mcp_<server>_<tool>`
- 若 server 支持 resources / prompts，Hermes 还会额外包出 wrapper tools
- 每个成功注册工具的 server 也会变成一个运行时 toolset：`mcp-<server>`

### 最实用的配置技巧

这篇教程在实操层面最重要的部分其实是过滤：

#### 只暴露白名单工具

```yaml
tools:
  include: [create_issue, list_issues]
```

#### 排除危险工具

```yaml
tools:
  exclude: [delete_customer]
```

#### 完全禁用某个 server

```yaml
enabled: false
```

#### 不要 prompts / resources wrappers

```yaml
tools:
  prompts: false
  resources: false
```

官方教程的核心意思是：

- MCP 最好从最小暴露面开始
- 先接一个 server、先开少量工具
- 跑通后再逐步放宽

### 运行时刷新

若修改了配置，可执行：

```text
/reload-mcp
```

而如果 server 自己支持：

- `notifications/tools/list_changed`

Hermes 会自动刷新工具列表。

### Troubleshooting

教程里的排查思路与 MCP 特性页一致，重点包括：

- 没装 `.[mcp]`
- `npx` / `node` 不在 PATH
- server 启动失败
- include / exclude 把工具全过滤掉了
- resources / prompts wrappers 不存在，是因为 server 本身没暴露这些 capability

### 这篇教程的核心信息

它真正教你的，是把 MCP 当作：

- “接第三方工具能力的统一插槽”

而不是再为每个系统重复写一套原生 Hermes tool。

---

## 第 7 章：Use SOUL with Hermes

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/use-soul-with-hermes`

### 教程目标

这篇教程教你如何使用：

- `SOUL.md`

给 Hermes 稳定地注入人格、语气和长期行为风格。

官方把它和 `AGENTS.md` 的区别说得很清楚：

- `SOUL.md`：定义“你是谁、怎么说话”
- `AGENTS.md`：定义“在这个项目里该怎么做事”

### SOUL 的定位

官方强调：

- `SOUL.md` 不是单次 prompt
- 也不是会话里随口说的一段临时要求
- 它是稳定、可复用、跨会话的人格文件

因此它适合写：

- 说话风格
- 沟通价值观
- 决策倾向
- 角色定位
- 对合作方式的偏好

### 文件位置

官方支持：

- 顶层 `~/.hermes/SOUL.md`
- profile-specific `~/.hermes/profiles/<name>/SOUL.md`

也就是说：

- 你可以给整个 Hermes 设一个默认人格
- 也可以给不同 profile 设不同人格

### 该写什么

教程建议把 `SOUL.md` 分成几类内容：

- Identity / Role
- Tone / Style
- Values
- Boundaries
- Interaction patterns

官方强调：

- 要写稳定特质
- 不要写一次性任务
- 不要把“这个项目要做什么”写进 SOUL

### 官方建议的写法

好的 `SOUL.md` 应该：

- 具体
- 一致
- 可长期复用
- 不与项目规则混杂

例如你可以规定：

- 回答要简洁还是详细
- 更像老师、搭档还是审稿人
- 更偏保守还是探索
- 面对不确定信息时先说限制

但不应该在 SOUL 里写：

- 当前这个 bug 的修复步骤
- 某个仓库专属约定
- 某一周的短期目标

### Profile 的价值

教程专门强调 profile + SOUL 的组合：

- `research` profile 可以有偏分析型人格
- `coding` profile 可以更偏执行型
- `personal` profile 可以更温和或更口语化

也就是说：

- profile 不只是切换模型和工具
- 还可以切换人格

### 与 Prompt Cache 的关系

官方在这类文档里反复提醒：

- 人格文件属于 system-level context
- 不要频繁改动

原因是：

- 频繁变化会破坏 prompt cache
- 稳定的人格设定更省成本，也更一致

### Common Mistakes

教程中着重避免的错误包括：

- 把 SOUL 当成任务说明书
- 把项目规则和人格混在一起
- 一会儿一个版本，导致行为飘忽
- 写得太空泛，如 “be helpful”

### 这篇教程的核心信息

它真正要教你的是：

- 把稳定人格做成文件资产
- 让 Hermes 每次会话都从相同人格基线启动
- 再用 `AGENTS.md` 叠加项目约束

---

## 第 8 章：Use Voice Mode with Hermes

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/use-voice-mode-with-hermes`

### 教程目标

这篇教程是 `Voice Mode` 特性页的实操版，围绕三个现实使用场景：

1. CLI 里的实时语音对话
2. Telegram / Discord 上的语音消息回复
3. Discord voice channel 里的完整语音助手

### 基本前提

官方先要求确认三件事：

1. `hermes` 纯文本会话已经正常
2. 至少配好了一个 LLM provider
3. 相关依赖和系统包已装好

Python extras：

```bash
pip install "hermes-agent[voice]"
pip install "hermes-agent[messaging]"
pip install "hermes-agent[tts-premium]"
python -m pip install -U neutts[all]
```

系统依赖：

```bash
brew install portaudio ffmpeg opus
brew install espeak-ng

sudo apt install portaudio19-dev ffmpeg libopus0
sudo apt install espeak-ng
```

环境变量常见项：

- `GROQ_API_KEY`
- `VOICE_TOOLS_OPENAI_KEY`
- `ELEVENLABS_API_KEY`
- `DISCORD_BOT_TOKEN`
- `DISCORD_ALLOWED_USERS`

### Use Case 1：CLI Voice Loop

#### 最小流程

1. 运行 `hermes`
2. 执行 `/voice on`
3. 按 `Ctrl+B`
4. 说话
5. 等待转写、回复、TTS 播放

官方提醒：

- `Ctrl+B` 默认是录音键
- 录音结束后会自动重启下一轮录音
- 这形成连续语音对话 loop

#### 什么时候该用本地 STT

教程建议：

- 若你在本机长期用 CLI 语音，优先本地 `faster-whisper`
- 不需要 key
- 也更适合长期低成本使用

#### TTS provider 选择建议

官方经验是：

- 只想马上可用：用 `edge`
- 想要更高语音质量：用 `elevenlabs`
- 想完全本地：尝试 `neutts`

### Use Case 2：Telegram / Discord Voice Reply

这是“消息平台语音回复”模式。

关键命令：

```text
/voice on
/voice tts
/voice off
/voice status
```

教程再次解释了三种模式：

- `off`
- `voice_only`
- `all`

也就是：

- 只文本
- 只对语音消息回语音
- 对所有消息都回语音

#### Telegram

官方建议重点关注：

- 如果用 Edge / MiniMax / NeuTTS，要装 `ffmpeg`
- 否则 Telegram 里会发成普通音频附件，而不是 voice bubble

#### Discord

官方建议：

- DMs 是最顺手的个人使用场景
- 服务器频道默认要 mention

### Use Case 3：Discord Voice Channel Assistant

这是教程最完整的一部分。

关键前提：

- bot 已具备文本能力
- 已加上 voice permissions
- 已启用 3 个 privileged gateway intents
- 已安装 Opus codec

文本频道内使用：

```text
/voice join
/voice leave
/voice status
```

官方强调：

- 人必须先在某个 VC 中
- bot 才能加入当前频道

#### 运行逻辑

进入 VC 后：

- bot 监听用户音频
- 检测语音段落结束
- 做 STT
- 走 agent pipeline
- 用 TTS 在 VC 里播报回复

并且：

- 转写内容会同步发回文本频道
- 回复既显示文本，也会播放语音

### Recommended Config

教程会回到 `config.yaml`，建议重点关注：

- `voice.record_key`
- `voice.silence_threshold`
- `voice.silence_duration`
- `stt.provider`
- `stt.local.model`
- `tts.provider`
- 各 provider 的 voice / model 设定

### Troubleshooting

教程里最关键的排障点包括：

- CLI 里找不到音频设备：先查 PortAudio
- Telegram 里不是 voice bubble：大概率是缺 `ffmpeg`
- Discord 服务器里不响应：多半是 mention 或 intents
- 进了 VC 但 bot 听不见你：检查 `DISCORD_ALLOWED_USERS`、静音状态和 speaking 事件
- 文本会回但 VC 不说话：检查 TTS provider、配额和日志

### 这篇教程的核心信息

它不是只教“怎么打开语音”，而是在教你：

- 根据使用场景选对模式
- 本地 CLI 语音、消息语音回复、VC 助手这三种模式的配置重点完全不同

---

## 第 9 章：Build a Hermes Plugin

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/build-a-hermes-plugin`

### 教程目标

这篇教程是插件系统的完整入门，从零带你做一个最小可运行的 Hermes plugin。

官方定位是：

- 不改 Hermes 核心代码
- 通过 plugin 增加自定义 tools、hooks、CLI commands、bundled skills

### Step 1：创建插件目录

最小结构：

```text
~/.hermes/plugins/my-plugin/
├── plugin.yaml
├── __init__.py
├── schemas.py
└── tools.py
```

### Step 2：写 `plugin.yaml`

最小示例：

```yaml
name: hello-world
version: "1.0"
description: A minimal example plugin
```

官方还说明可加：

- `requires_env`

用于：

- 没有必要环境变量时跳过加载

### Step 3：在 `register(ctx)` 中注册能力

核心入口是：

- `__init__.py` 中的 `register(ctx)`

在这里可以：

- `ctx.register_tool(...)`
- `ctx.register_hook(...)`
- `ctx.register_cli_command(...)`

### Step 4：定义工具 schema 与 handler

教程会引导你把：

- schema
- handler

拆开写，避免把所有东西堆在一个文件里。

官方重点强调：

- schema 要精确定义输入
- handler 应只做本插件自己的逻辑
- 错误处理要返回清晰信息

### Step 5：挂 hooks

可接入的 hook 与特性页一致：

- `pre_tool_call`
- `post_tool_call`
- `pre_llm_call`
- `post_llm_call`
- `on_session_start`
- `on_session_end`

教程里会强调：

- 所有 hook 回调都应接受 `**kwargs`
- 以便未来版本加参数时仍兼容

### Step 6：本地测试

官方建议：

1. 把插件目录放到 `~/.hermes/plugins/`
2. 启动 Hermes
3. 用 `hermes plugins list` 或 `/plugins` 看它是否已加载
4. 直接调用你注册的 tool 测试

### Project Plugins

教程也再次提醒：

- 项目级插件 `./.hermes/plugins/` 默认关闭
- 必须显式：

```bash
HERMES_ENABLE_PROJECT_PLUGINS=true
```

### Bundled Skills

插件还能在加载时把自己的 skill 文档复制到：

- `~/.hermes/skills/`

也就是说：

- plugin 不只是“加一个 tool”
- 还可以把整套复用 workflow 一起分发

### Injecting Messages

教程里也会提到：

- `ctx.inject_message(...)`

它允许插件把外部事件注入当前 CLI 对话。

官方提醒：

- 这只在 CLI mode 下可用

### Packaging & Distribution

除了目录式插件，还能通过：

- `hermes_agent.plugins` entry_points

做 pip 分发。

教程真正想传达的是：

- 目录式插件适合快速本地实验
- pip 分发适合团队 / 社区复用

---

## 第 10 章：Automate with Cron

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron`

### 教程目标

这篇教程专门教你把 Hermes 变成一个：

- 定时执行的自动化代理

而不是单次对话工具。

### Step 1：先确保 gateway 在运行

因为官方再次强调：

- cron 由 gateway daemon 驱动
- 不开 gateway，定时任务不会跑

### Step 2：先用手工 prompt 跑通

教程和 Daily Briefing Bot 一样，第一原则是：

- 先把手工执行流程跑通
- 再交给 cron

### Step 3：选择调度表达方式

官方给两种写法：

- 自然语言，如 `every morning at 9am`
- 标准 cron schedule

你可以通过：

- `/cron add`
- `hermes cron create`
- 或自然语言直接让 Hermes 帮你建

### Step 4：让 prompt 自包含

官方把这一点单独反复强调：

- cron prompt 不能依赖当前对话上下文
- 因为每次 cron 执行都是 fresh agent session

因此 prompt 要明确写清：

- 要做什么
- 查哪些来源
- 输出格式
- 结果送到哪里

### Step 5：编辑、暂停、恢复

教程会把常用管理动作串起来：

- `list`
- `pause`
- `resume`
- `edit`
- `run`
- `remove`

并再次强调：

- 改任务不需要删了重建

### 使用 skill 的自动化

教程里的关键高级技巧是：

- 给 cron 任务附加 skill

这样可以把：

- 固定工作流
- 领域知识

从 prompt 里抽离出来，变成更稳定的复用单元。

### 结果投递

可送到：

- origin
- local
- Telegram / Discord / Slack / Email 等

教程真正要你掌握的是：

- “调度”和“投递”是两回事
- 建任务时要显式想好结果落点

### 核心信息

这篇教程本质上是在教你把：

- self-contained prompt
- cron scheduler
- skills
- messaging delivery

拼成一条长期稳定运行的自动化链路。

---

## 第 11 章：Work with Skills

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/work-with-skills`

### 教程目标

这篇教程是 skills 的实践指南，重点在于：

- 如何安装
- 如何组织
- 如何写好
- 什么时候该用 skills，什么时候不该

### Skills 的角色

官方用一句很重要的话概括：

- Skills are reusable workflows and knowledge packs

也就是说，skill 同时承载：

- 领域知识
- 操作流程
- 最佳实践

### 安装与管理

技能目录位于：

- `~/.hermes/skills/`

启用方式包括：

- 启动时用 `-s`
- 会话中用 `/<skill-name>`
- cron 任务中用 `--skill`

官方也提到：

- plugin 可以捆绑分发 skills

### 什么时候应该写成 skill

官方建议的判断标准：

- 重复出现的工作流
- 每次都要解释一遍的领域上下文
- 需要固定工具序列或固定审查标准

而不适合写 skill 的是：

- 一次性任务
- 只属于某个仓库的局部约束
- 非稳定、容易频繁变化的说明

### 一个好 skill 的结构

教程会强调：

- 文件开头的 metadata / frontmatter
- 清晰的使用触发条件
- 具体步骤而不是空话
- 必要时声明 `required_environment_variables`

官方还提醒：

- 如果 skill 需要 API key，应在 frontmatter 里显式声明
- 这样它们才能透传到 `execute_code` / `terminal` 沙箱

### 技能的使用方式

常见方式：

- CLI 启动时预加载
- 会话中临时激活
- 在 cron 中附加
- 在 messaging 平台里通过 slash command 触发

官方的核心观点是：

- 技能应该是可组合的
- 不是把所有东西塞进一个巨型 skill

### 常见失败模式

这篇教程强调的坑包括：

- skill 写成泛泛而谈的长 prose
- 没有触发条件，agent 不知何时该用
- 把项目约束和全局可复用流程混在一起
- 把敏感密钥直接硬写进 skill 文本
- 一个 skill 又大又杂，难以组合

### 核心信息

它真正想教你的是：

- 把高频、稳定、可复用的工作流沉淀为 skill
- 让 Hermes 在多会话、多平台、多自动化场景里都能重用

---

## 第 12 章：Delegation Patterns

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/delegation-patterns`

### 教程目标

这篇教程不是重复介绍 `delegate_task` 的参数，而是告诉你：

- 什么时候 delegate
- 如何拆任务
- 哪些拆法最有效

### 关键原则

官方最重要的一条仍然是：

- 子 agent 什么都不知道

所以：

- `goal` 要具体
- `context` 要完整
- 不要把关键细节留在父对话里“默认它会懂”

### 几类推荐模式

#### Parallel Research

把多个独立研究题分给不同子 agent：

- 每个子 agent 各查一题
- 父 agent 只整合最终摘要

#### Review + Fix

让子 agent 在新上下文里：

- 先审查
- 再修复
- 再跑测试

这种模式特别适合：

- 安全审查
- 模块级代码修正

#### Large Refactor

当一个任务会产生大量中间输出、会把父上下文塞爆时，适合委派。

#### Sidecar Delegation

官方特别推荐把：

- 非关键路径
- 可以并行的
- 不阻塞下一步主任务

的工作交给子 agent。

### 什么时候不要 delegate

教程明确指出几种不适合的情况：

- 任务太小，delegate 反而有 overhead
- 下一步就依赖它的结果，不适合作为异步 sidecar
- 需要和用户来回澄清
- 需要写共享状态或做跨平台副作用

### Toolset 选择策略

再次强调：

- 给子 agent 最小够用的 toolsets

典型选择：

- 研究：`["web"]`
- 代码：`["terminal", "file"]`
- 混合任务：`["terminal", "file", "web"]`

官方的深层意思是：

- toolsets 既是能力配置，也是安全边界

### 结果整合

教程想让你形成的习惯是：

- 不要求子 agent 把所有过程塞回父上下文
- 只让它返回结构化 summary
- 父 agent 再基于摘要整合结果

### 核心信息

这篇教程本质上是在教你：

- 用 delegation 控制上下文压力
- 让多条工作流并行
- 但同时保持任务边界清晰、上下文完整、工具最小化

---

## 第 13 章：Migrate from OpenClaw

来源：

- `https://hermes-agent.nousresearch.com/docs/guides/migrate-from-openclaw`

### 教程目标

这篇教程面向原 OpenClaw 用户，目标是：

- 把现有 OpenClaw 的工作方式迁移到 Hermes
- 并说明哪些概念对等、哪些地方已经变化

### OpenClaw 与 Hermes 的关系

官方语气是连续性的：

- Hermes 不是完全陌生的新东西
- 许多 OpenClaw 使用习惯都能映射过来

但同时它也明确：

- Hermes 的架构和命令组织已经更统一
- 功能也更完整

### 迁移重点

这篇教程重点围绕这些映射关系：

- profiles
- tools / toolsets
- messaging gateway
- skills
- memory
- provider configuration
- cron

也就是说，迁移不是只改一个命令名，而是要把原来的工作流重新安放到 Hermes 的统一配置模型里。

### 配置迁移的核心思路

官方建议：

1. 先保留旧环境
2. 在新 `~/.hermes/` 下重新配置 provider、gateway、profiles
3. 优先迁移最常用 workflow
4. 再迁移 skills、automation、团队入口

### 迁移时最容易踩的坑

教程提醒的风险点包括：

- 旧环境变量名已废弃，不要原样搬
- custom endpoint 配置方式已经变化
- 某些 OpenClaw 时代的命令入口已被统一进 `hermes model`、`hermes gateway`、`hermes memory setup` 等新入口
- 若你过去依赖特殊技能或插件，需要单独确认在 Hermes 中的加载位置

### 迁移策略

官方隐含的推荐做法是：

- 先把基础对话跑通
- 再把 gateway 跑通
- 再把 memory / skills / cron 一项项加回

而不是：

- 一次性把全部旧配置无差别复制过去

### 核心信息

这篇教程真正的重点是：

- Hermes 是 OpenClaw 的继承与统一化升级
- 迁移时要按“能力块”逐步搬迁
- 不要把过时环境变量和旧式配置机械复制到新系统里
