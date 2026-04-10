---
title: 第二卷：Using Hermes
---

# Hermes Agent 中文橙皮书

## 第二卷：Using Hermes

说明：

- 本卷严格基于 Hermes Agent 官方文档 `Using Hermes` 分组下的页面整理。
- 章节顺序与官方侧边栏保持一致。
- 命令、配置键、环境变量、路径、模型名、平台名保持英文原样，以避免误差。
- 本卷覆盖以下 8 篇官方页面：
  - `user-guide/cli`
  - `user-guide/configuration`
  - `user-guide/sessions`
  - `user-guide/profiles`
  - `user-guide/git-worktrees`
  - `user-guide/docker`
  - `user-guide/security`
  - `user-guide/checkpoints-and-rollback`

---

## 第 1 章：CLI 界面（CLI Interface）

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/cli`

### 这一章讲什么

官方将 Hermes 的 CLI 定义为完整的终端用户界面，也就是 TUI，而不是 web UI。它支持：

- 多行编辑
- slash command 自动补全
- 对话历史
- 中断并重定向当前任务
- 流式工具输出

官方定位很明确：这是为长期驻留终端的人设计的界面。

### 启动 CLI

官方示例：

```bash
# 启动交互式会话（默认）
hermes

# 单次查询模式（非交互）
hermes chat -q "Hello"

# 指定 model
hermes chat --model "anthropic/claude-sonnet-4"

# 指定 provider
hermes chat --provider nous
hermes chat --provider openrouter

# 指定 toolsets
hermes chat --toolsets "web,terminal,skills"

# 启动时预加载一个或多个 skills
hermes -s hermes-agent-dev,github-auth
hermes chat -s github-pr-workflow -q "open a draft PR"

# 恢复历史会话
hermes --continue
hermes --resume <session_id>

# 调试输出
hermes chat --verbose

# 启用隔离的 git worktree
hermes -w
hermes -w -q "Fix issue #123"
```

### 界面布局

官方文档中配有一张 CLI 布局示意图，核心区域包括：

- 欢迎横幅
- 对话流
- 固定输入提示区

欢迎横幅会直接展示：

- 当前 model
- terminal backend
- working directory
- 可用 tools
- 已安装 skills

### 状态栏（Status Bar）

输入区域上方有一条实时状态栏。例如：

```text
 ⚕ claude-sonnet-4-20250514 │ 12.4K/200K │ [██████░░░░░░] 6% │ $0.06 │ 15m
```

官方对各字段的解释：

| 元素 | 说明 |
|---|---|
| Model name | 当前模型名；过长会截断到 26 个字符以内 |
| Token count | 当前上下文已使用 token / 最大上下文窗口 |
| Context bar | 可视化填充条，带阈值颜色编码 |
| Cost | 预估会话成本；价格未知或为 0 时显示 `n/a` |
| Duration | 会话已持续时间 |

状态栏会根据终端宽度自适应：

- 宽度 `>= 76`：完整布局
- 宽度 `52–75`：紧凑布局
- 宽度 `< 52`：最小布局，只显示 model 和 duration

上下文颜色编码：

| 颜色 | 阈值 | 含义 |
|---|---|---|
| Green | `< 50%` | 空间充足 |
| Yellow | `50–80%` | 上下文开始变满 |
| Orange | `80–95%` | 接近上限 |
| Red | `>= 95%` | 很接近溢出，建议考虑 `/compress` |

如果想看更细的 token 与成本明细，官方建议使用 `/usage`。

### 恢复会话时的显示

当你用 `hermes -c` 或 `hermes --resume <id>` 恢复历史会话时，横幅和输入框之间会出现一个 “Previous Conversation” 面板，用于展示上一轮会话的紧凑回顾。更详细的规则官方放在 `Sessions` 页面里。

### 键位（Keybindings）

| 按键 | 作用 |
|---|---|
| `Enter` | 发送消息 |
| `Alt+Enter` 或 `Ctrl+J` | 插入新行，多行输入 |
| `Alt+V` | 终端支持时，从剪贴板粘贴图片 |
| `Ctrl+V` | 粘贴文本，并在可能时附加剪贴板图片 |
| `Ctrl+B` | 在 voice mode 开启时开始/停止录音；默认键位可通过 `voice.record_key` 改 |
| `Ctrl+C` | 中断 agent；2 秒内按两次则强制退出 |
| `Ctrl+D` | 退出 |
| `Ctrl+Z` | 将 Hermes 挂起到后台；仅 Unix 可用，之后用 `fg` 恢复 |
| `Tab` | 接受自动建议或自动补全 slash command |

### Slash Commands

输入 `/` 会出现自动补全下拉。Hermes 支持：

- 内建 CLI slash commands
- 动态 skill commands
- 用户定义的 quick commands

官方列出的常用例子：

| 命令 | 说明 |
|---|---|
| `/help` | 查看命令帮助 |
| `/model` | 查看或切换当前 model |
| `/tools` | 查看当前可用工具 |
| `/skills browse` | 浏览 skills hub 与官方 optional skills |
| `/background <prompt>` | 在后台会话中运行一个 prompt |
| `/skin` | 查看或切换当前 CLI skin |
| `/voice on` | 开启 CLI voice mode |
| `/voice tts` | 切换是否把回复读出来 |
| `/reasoning high` | 提高 reasoning effort |
| `/title My Session` | 给当前会话命名 |

补充说明：

- 完整命令列表见 `Slash Commands Reference`
- slash commands 大小写不敏感，`/HELP` 和 `/help` 等效
- 已安装 skills 会自动变成 slash commands

### Quick Commands

你可以定义一些不经过 LLM 的自定义命令，直接执行 shell 命令，CLI 与消息平台都可用。

官方示例：

```yaml
# ~/.hermes/config.yaml
quick_commands:
  status:
    type: exec
    command: systemctl status hermes-agent
  gpu:
    type: exec
    command: nvidia-smi --query-gpu=utilization.gpu,memory.used --format=csv,noheader
```

之后在聊天中直接输入 `/status` 或 `/gpu` 即可执行。

### 启动时预加载 Skills

如果你在开局就知道本次会话需要哪些 skills，可以直接在命令行指定：

```bash
hermes -s hermes-agent-dev,github-auth
hermes chat -s github-pr-workflow -s github-auth
```

官方说明：这些 skills 会在第一轮对话前就写入会话 prompt 中。

### Skill Slash Commands

任何安装到 `~/.hermes/skills/` 中的 skill 都会自动注册成 slash command，skill 名就是命令名。例如：

```text
/gif-search funny cats
/axolotl help me fine-tune Llama 3 on my dataset
/github-pr-workflow create a PR for the auth refactor

/excalidraw
```

最后这个示例表示：只输入 skill 名，也可以先把 skill 加载进来，再让 agent 问你具体需求。

### Personalities

你可以用内置 personality 改变 agent 的表达风格：

```text
/personality pirate
/personality kawaii
/personality concise
```

官方列出的内置 personality 包括：

- `helpful`
- `concise`
- `technical`
- `creative`
- `teacher`
- `kawaii`
- `catgirl`
- `pirate`
- `shakespeare`
- `surfer`
- `noir`
- `uwu`
- `philosopher`
- `hype`

也可以在 `~/.hermes/config.yaml` 中自行定义：

```yaml
personalities:
  helpful: "You are a helpful, friendly AI assistant."
  kawaii: "You are a kawaii assistant! Use cute expressions..."
  pirate: "Arrr! Ye be talkin' to Captain Hermes..."
```

### 多行输入

官方给了两种方式：

1. 用 `Alt+Enter` 或 `Ctrl+J` 插入换行
2. 用反斜杠续行

示例：

```text
❯ Write a function that:\
  1. Takes a list of numbers\
  2. Returns the sum
```

官方还说明，多行内容可以直接粘贴。

### 中断 Agent

可以在任意时刻中断当前工作：

- agent 正忙时直接输入新消息并回车：会立刻中断当前任务，并改为处理新指令
- `Ctrl+C`：中断当前操作；2 秒内连按两次则强制退出
- 正在执行的 terminal commands 会先收到 `SIGTERM`，1 秒后若未结束再发 `SIGKILL`
- 中断期间输入的多条消息会合并为一条 prompt

#### Busy Input Mode

`display.busy_input_mode` 用于控制在 agent 忙的时候按 Enter 会发生什么：

| 模式 | 行为 |
|---|---|
| `"interrupt"`（默认） | 立即中断当前操作并处理新消息 |
| `"queue"` | 新消息静默排队，等 agent 忙完后作为下一轮发送 |

配置示例：

```yaml
display:
  busy_input_mode: "queue"
```

未知值会回退到 `"interrupt"`。

#### 挂起到后台

在 Unix 系统中，按 `Ctrl+Z` 可将 Hermes 挂起到后台。shell 会打印：

```text
Hermes Agent has been suspended. Run `fg` to bring Hermes Agent back.
```

之后在 shell 中执行 `fg` 即可恢复，Windows 不支持此功能。

### 工具进度显示（Tool Progress Display）

当 agent 工作时，CLI 会展示动画反馈。

官方举了两类例子。

思考动画：

```text
  ◜ (｡•́︿•̀｡) pondering... (1.2s)
  ◠ (⊙_⊙) contemplating... (2.4s)
  ✧٩(ˊᗜˋ*)و✧ got it! (3.1s)
```

工具执行流：

```text
  ┊ 💻 terminal `ls -la` (0.3s)
  ┊ 🔍 web_search (1.2s)
  ┊ 📄 web_extract (2.1s)
```

用 `/verbose` 可以循环切换显示模式：

- `off`
- `new`
- `all`
- `verbose`

这个命令也可以给消息平台启用，相关设置在 `Configuration` 里。

#### Tool Preview Length

`display.tool_preview_length` 用于限制工具预览行展示的字符数，比如路径或终端命令的长度。

默认值是 `0`，表示不限制，展示完整内容。

```yaml
display:
  tool_preview_length: 80
```

### 会话管理

#### 恢复会话

退出 CLI 会话时，Hermes 会打印恢复命令。例如：

```text
Resume this session with:
  hermes --resume 20260225_143052_a1b2c3

Session:        20260225_143052_a1b2c3
Duration:       12m 34s
Messages:       28 (5 user, 18 tool calls)
```

常见恢复方式：

```bash
hermes --continue
hermes -c
hermes -c "my project"
hermes --resume 20260225_143052_a1b2c3
hermes --resume "refactoring auth"
hermes -r 20260225_143052_a1b2c3
```

恢复时会从 SQLite 中恢复完整会话历史，包括：

- 之前的消息
- tool calls
- tool results
- agent 回复

#### Session Storage

CLI 会话存放在 `~/.hermes/state.db` 这个 SQLite 数据库中，里面保存：

- session metadata
- message history
- compression / resume 形成的 lineage
- 给 `session_search` 使用的全文搜索索引

某些消息平台还会有附加 transcript 文件，但 CLI 恢复主要依赖 SQLite 会话存储。

#### Context Compression

长会话在接近上下文上限时会自动摘要压缩：

```yaml
compression:
  enabled: true
  threshold: 0.50
  summary_model: "google/gemini-3-flash-preview"
```

官方说明：压缩时会保留最前面的 3 轮和最后面的 4 轮，中间部分做摘要。

### 后台会话（Background Sessions）

你可以在当前 CLI 继续使用的同时，开一个后台任务：

```text
/background Analyze the logs in /var/log and summarize any errors from today
```

Hermes 会立即确认任务，并返回 task ID，例如：

```text
🔄 Background task #1 started: "Analyze the logs in /var/log and summarize..."
   Task ID: bg_143022_a1b2c3
```

官方说明其工作方式如下：

- 会启动一个完全独立的 agent session
- 背景 agent 不知道你当前前台会话的历史，只收到你给的 prompt
- 但它会继承当前会话的配置：model、provider、toolsets、reasoning 设置、fallback model
- 前台仍保持可交互
- 可以同时跑多个后台任务

后台任务完成时，会以一个结果面板显示在终端里；如果启用了 `display.bell_on_complete`，还会敲终端铃。

官方列举的适用场景：

- 长时间研究任务
- 文件分析
- 并行调查多个方向

补充说明：

- 后台会话不会出现在主对话历史里
- 它们是独立会话，拥有各自的 task ID

### Quiet Mode

默认情况下 CLI 运行在 quiet mode，这会：

- 压制工具的冗长日志
- 使用 kawaii 风格的动画反馈
- 保持输出更干净、更友好

如果想要调试输出：

```bash
hermes chat --verbose
```

---

## 第 2 章：Profiles：运行多个独立 Agent

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/profiles`

### 这一章讲什么

Profile 是一套完全隔离的 Hermes 环境。每个 profile 都有自己独立的：

- `config.yaml`
- `.env`
- `SOUL.md`
- memories
- sessions
- skills
- cron jobs
- state database
- gateway

官方建议用它来在同一台机器上运行多个用途不同、互不污染的 agent，比如：

- coding assistant
- personal bot
- research agent

创建 profile 后，它还会自动变成一个命令别名。比如建一个 `coder` profile，就会自动得到 `coder chat`、`coder setup`、`coder gateway start` 等命令。

### Quick Start

```bash
hermes profile create coder
coder setup
coder chat
```

这时 `coder` 就是一个完全独立的 agent。

### 创建 Profile

#### 空白 Profile

```bash
hermes profile create mybot
```

结果：

- 创建一个全新的 profile
- 自动播种 bundled skills
- 然后执行 `mybot setup` 去配置 API keys、model、gateway tokens

#### 只克隆配置：`--clone`

```bash
hermes profile create work --clone
```

会复制当前 profile 的：

- `config.yaml`
- `.env`
- `SOUL.md`

但不会复制：

- sessions
- memory

官方说明：如果要改 API keys，可直接编辑 `~/.hermes/profiles/work/.env`；若要改 personality，则改 `SOUL.md`。

#### 克隆全部内容：`--clone-all`

```bash
hermes profile create backup --clone-all
```

这会复制：

- config
- API keys
- personality
- 全部 memories
- 全部 session history
- skills
- cron jobs
- plugins

官方将其描述为一个完整快照，适合做备份或 fork 一个已经有上下文的 agent。

#### 从指定 Profile 克隆

```bash
hermes profile create work --clone --clone-from coder
```

补充说明：

- 若启用了 Honcho memory，`--clone` 会自动为新 profile 创建一个专属 AI peer
- 但仍共享同一个 user workspace
- 每个 profile 会形成自己的 observations 与 identity

### 使用 Profiles

#### 命令别名

每个 profile 会自动在 `~/.local/bin/<name>` 下生成一个命令别名。例如：

```bash
coder chat
coder setup
coder gateway start
coder doctor
coder skills list
coder config set model.model anthropic/claude-sonnet-4
```

本质上，这些别名只是 `hermes -p <name>` 的包装。

#### `-p` 参数

任何 Hermes 命令都可以通过 `-p` 指向某个 profile：

```bash
hermes -p coder chat
hermes --profile=coder doctor
hermes chat -p coder -q "hello"
```

#### 设为粘性默认值：`hermes profile use`

```bash
hermes profile use coder
hermes chat
hermes tools
hermes profile use default
```

官方把这个类比成 `kubectl config use-context`。设完后，裸 `hermes` 命令就默认指向该 profile。

#### 识别当前在哪个 Profile

CLI 会始终显示当前激活的 profile：

- Prompt：从 `❯` 变成 `coder ❯`
- Banner：启动时显示 `Profile: coder`
- `hermes profile`：显示当前 profile 名、路径、model、gateway 状态

### 运行 Gateways

每个 profile 都有独立 gateway 进程与独立 bot token：

```bash
coder gateway start
assistant gateway start
```

#### 不同的 bot tokens

每个 profile 都有自己的 `.env`，可分别配置不同 Telegram / Discord / Slack token：

```bash
nano ~/.hermes/profiles/coder/.env
nano ~/.hermes/profiles/assistant/.env
```

#### Safety：token locks

如果两个 profile 误用了同一个 bot token，第二个 gateway 会被阻止启动，并明确指出冲突的 profile。官方说该保护支持：

- Telegram
- Discord
- Slack
- WhatsApp
- Signal

#### 持久化服务

```bash
coder gateway install
assistant gateway install
```

每个 profile 都会得到各自独立的 systemd / launchd service 名。

### 配置 Profiles

每个 profile 都有自己的：

- `config.yaml`
- `.env`
- `SOUL.md`

官方示例：

```bash
coder config set model.model anthropic/claude-sonnet-4
echo "You are a focused coding assistant." > ~/.hermes/profiles/coder/SOUL.md
```

### 更新

`hermes update` 只会共享地拉一次代码，但会自动把新的 bundled skills 同步到所有 profiles：

```bash
hermes update
# → Code updated (12 commits)
# → Skills synced: default (up to date), coder (+2 new), assistant (+2 new)
```

官方说明：

- 用户修改过的 skill 永远不会被覆盖

### 管理 Profiles

```bash
hermes profile list
hermes profile show coder
hermes profile rename coder dev-bot
hermes profile export coder
hermes profile import coder.tar.gz
```

### 删除 Profile

```bash
hermes profile delete coder
```

这会：

- 停止 gateway
- 删除 systemd / launchd service
- 删除命令别名
- 删除该 profile 的全部数据

并要求你输入 profile 名以确认。可用 `--yes` 跳过确认：

```bash
hermes profile delete coder --yes
```

官方说明：

- 默认 profile，也就是 `~/.hermes` 本身，不能通过这个命令删除
- 若要彻底删掉一切，使用 `hermes uninstall`

### Tab Completion

```bash
# Bash
eval "$(hermes completion bash)"

# Zsh
eval "$(hermes completion zsh)"
```

将该行写入 `~/.bashrc` 或 `~/.zshrc` 后，可持续启用补全。支持：

- `-p` 后的 profile 名补全
- profile 子命令补全
- 顶层命令补全

### 工作原理

官方说明，profiles 的核心是环境变量 `HERMES_HOME`。

当你运行 `coder chat` 时，wrapper script 会先设置：

- `HERMES_HOME=~/.hermes/profiles/coder`

因为代码库中大量路径解析都通过 `get_hermes_home()`，所以以下内容都会自动被隔离到 profile 目录中：

- config
- sessions
- memory
- skills
- state database
- gateway PID
- logs
- cron jobs

默认 profile 就是 `~/.hermes`。因此既有安装无需迁移。

---

## 第 3 章：Sessions

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/sessions`

### 这一章讲什么

Hermes 会自动把每次对话都保存为 session。session 的作用包括：

- 恢复对话
- 跨会话搜索
- 管理完整历史

适用来源非常广，官方明确列出：

- CLI
- Telegram
- Discord
- Slack
- WhatsApp
- Signal
- Matrix
- Mattermost
- Email
- SMS
- DingTalk
- Feishu
- WeCom
- BlueBubbles
- Home Assistant
- Webhook
- API server
- ACP
- cron
- batch

### Sessions 如何工作

官方说每个会话都由两套互补系统跟踪：

1. SQLite 数据库：`~/.hermes/state.db`
2. JSONL transcripts：`~/.hermes/sessions/`

SQLite 中存：

- Session ID、source platform、user ID
- Session title
- model 与配置
- system prompt snapshot
- 完整 message history
- token counts
- started_at / ended_at
- parent session ID

#### Session Sources

官方列出的 source 标签如下：

| Source | 含义 |
|---|---|
| `cli` | CLI 会话 |
| `telegram` | Telegram |
| `discord` | Discord |
| `slack` | Slack |
| `whatsapp` | WhatsApp |
| `signal` | Signal |
| `matrix` | Matrix |
| `mattermost` | Mattermost |
| `email` | Email |
| `sms` | Twilio SMS |
| `dingtalk` | DingTalk |
| `feishu` | Feishu / Lark |
| `wecom` | 企业微信 |
| `bluebubbles` | BlueBubbles iMessage |
| `homeassistant` | Home Assistant |
| `webhook` | 入站 webhook |
| `api-server` | API server 请求 |
| `acp` | ACP 编辑器接入 |
| `cron` | 定时任务 |
| `batch` | 批处理运行 |

### CLI 恢复历史会话

#### 继续最近会话

```bash
hermes --continue
hermes -c
hermes chat --continue
hermes chat -c
```

这会从 SQLite 里找最近的 `cli` session，并载入完整历史。

#### 按名称恢复

若 session 已命名，可直接按名字恢复：

```bash
hermes -c "my project"
```

如果存在 lineage 变体，例如：

- `my project`
- `my project #2`
- `my project #3`

官方说明会自动恢复最新的那个，也就是 `my project #3`。

#### 恢复指定 Session

```bash
hermes --resume 20250305_091523_a1b2c3d4
hermes -r 20250305_091523_a1b2c3d4
hermes --resume "refactoring auth"
hermes chat --resume 20250305_091523_a1b2c3d4
```

Session ID 会在退出 CLI 时显示，也能通过 `hermes sessions list` 查到。

#### 恢复时的会话回顾（Conversation Recap on Resume）

恢复会话时，Hermes 会在输入框前显示一个紧凑回顾面板。官方说明它会：

- 用金色 `●` 展示 user messages
- 用绿色 `◆` 展示 assistant responses
- 截断超长消息：user 最多 300 字符，assistant 最多 200 字符或 3 行
- 把 tool calls 折叠成计数与工具名，例如 `[3 tool calls: terminal, web_search]`
- 隐藏 system messages、tool results 与内部 reasoning
- 最多展示最后 10 次交流
- 若更早还有消息，则显示 `... N earlier messages ...`
- 用 dim 样式区别于当前活跃会话

如果不想显示完整 recap，可在 `~/.hermes/config.yaml` 中配置：

```yaml
display:
  resume_display: minimal
```

官方还说明 Session ID 格式为：

- `YYYYMMDD_HHMMSS_<8-char-hex>`

例如：

- `20250305_091523_a1b2c3d4`

### Session 命名

#### 自动生成标题

Hermes 会在首次来回对话后自动生成一个 3–7 个词的简短标题。这个过程在后台线程中完成，使用一个快速 auxiliary model，因此不会给主交互增加延迟。

如果你已经手动设了标题，就不会再自动生成。

#### 手动设标题

在任何 CLI 或 gateway 会话中都可用 `/title`：

```text
/title my research project
```

如果 session 还没进数据库，例如你在第一条正式消息前就执行 `/title`，标题会先排队，等 session 真正开始后再写入。

也可从命令行改名：

```bash
hermes sessions rename 20250305_091523_a1b2c3d4 "refactoring auth module"
```

#### 标题规则

- 必须唯一
- 最长 100 个字符
- 会自动剥离控制字符、零宽字符、RTL override
- 正常 Unicode 都可以，包括 emoji、CJK、重音字符

#### 压缩后的自动 lineage

当会话因 `/compress` 或自动压缩而产生 continuation session 时，原来有标题的话，新 session 会自动变成：

- `my project`
- `my project #2`
- `my project #3`

因此按名字恢复时会自动指向最新一代。

#### 消息平台中的 `/title`

`/title` 同样适用于：

- Telegram
- Discord
- Slack
- WhatsApp

用法：

- `/title My Research`：设置标题
- `/title`：查看当前标题

### Session 管理命令

#### 列出 Sessions

```bash
hermes sessions list
hermes sessions list --source telegram
hermes sessions list --limit 50
```

如果 session 有标题，输出会展示：

- title
- preview
- relative timestamp
- ID

如果没有标题，则展示简化格式。

#### 导出 Sessions

```bash
hermes sessions export backup.jsonl
hermes sessions export telegram-history.jsonl --source telegram
hermes sessions export session.jsonl --session-id 20250305_091523_a1b2c3d4
```

导出结果是 JSONL，每行一个 JSON 对象，包含完整 metadata 与全部 messages。

#### 删除 Session

```bash
hermes sessions delete 20250305_091523_a1b2c3d4
hermes sessions delete 20250305_091523_a1b2c3d4 --yes
```

#### 重命名 Session

```bash
hermes sessions rename 20250305_091523_a1b2c3d4 "debugging auth flow"
hermes sessions rename 20250305_091523_a1b2c3d4 debugging auth flow
```

若标题已被其他 session 使用，会报错。

#### 清理旧 Sessions

```bash
hermes sessions prune
hermes sessions prune --older-than 30
hermes sessions prune --source telegram --older-than 60
hermes sessions prune --older-than 30 --yes
```

官方强调：

- prune 只删除已结束 session
- active sessions 永远不会被 prune

#### Session 统计

```bash
hermes sessions stats
```

官方示例输出包括：

- Total sessions
- Total messages
- 各来源 session 数
- 数据库大小

更深入的 token、cost、tool breakdown 和活动模式，官方建议使用 `hermes insights`。

### Session Search Tool

Hermes 内建 `session_search` 工具，使用 SQLite FTS5 做全文检索。

#### 工作流程

官方描述步骤如下：

1. FTS5 按相关度检索匹配消息
2. 按 session 聚合，取前 N 个唯一 session，默认 3 个
3. 加载这些 session 的对话，并围绕命中位置截断到约 100K 字符
4. 送给快速 summarization model 做聚焦摘要
5. 返回每个 session 的摘要、metadata 与上下文片段

#### FTS5 查询语法

支持：

- 普通关键词：`docker deployment`
- 短语：`"exact phrase"`
- 布尔：`docker OR kubernetes`、`python NOT java`
- 前缀：`deploy*`

#### 何时会被用到

官方把这条指令直接写给 agent：

当用户提到过去的会话内容，或你怀疑先前对话里有相关上下文时，应先使用 `session_search`，而不是直接让用户重复一遍。

### 按平台跟踪 Session

#### Gateway Sessions

消息平台上的 session key 由消息来源决定。官方给出几类格式：

| 聊天类型 | 默认 key 格式 | 行为 |
|---|---|---|
| Telegram DM | `agent:main:telegram:dm:<chat_id>` | 每个 DM chat 一个 session |
| Discord DM | `agent:main:discord:dm:<chat_id>` | 每个 DM chat 一个 session |
| WhatsApp DM | `agent:main:whatsapp:dm:<chat_id>` | 每个 DM chat 一个 session |
| 群聊 | `agent:main:<platform>:group:<chat_id>:<user_id>` | 能识别用户 ID 时，群里每人一个 session |
| 线程 / topic | `agent:main:<platform>:group:<chat_id>:<thread_id>:<user_id>` | 在线程中也按每用户隔离 |
| Channel | `agent:main:<platform>:channel:<chat_id>:<user_id>` | 若平台提供 user ID，则频道里每用户一个 session |

若 Hermes 拿不到参与者 ID，则会退回成该房间共用一个 session。

#### Shared vs Isolated Group Sessions

默认配置：

```yaml
group_sessions_per_user: true
```

意味着：

- 同一 Discord channel 里 Alice 与 Bob 各自有自己的 transcript history
- 某个人的长任务不会污染另一个人的上下文窗口
- interrupt handling 也是按用户隔离

如果想让整个房间共享一个“共同大脑”，则设为：

```yaml
group_sessions_per_user: false
```

这样会：

- 把群 / channel 恢复成一个共享 session
- 共享上下文、token 成本、interrupt 状态与上下文膨胀

#### Session Reset Policies

gateway sessions 可按策略自动重置：

- `idle`
- `daily`
- `both`
- `none`

在 auto-reset 前，agent 会先得到一轮机会，把重要内容保存成 memories 或 skills。

官方还强调：

- 只要 session 里有 active background processes，就不会被 auto-reset

### 存储位置

| 内容 | 路径 | 说明 |
|---|---|---|
| SQLite 数据库 | `~/.hermes/state.db` | 所有 session metadata 与 messages，带 FTS5 |
| Gateway transcripts | `~/.hermes/sessions/` | 每个 session 的 JSONL transcript，加上 `sessions.json` 索引 |
| Gateway 索引 | `~/.hermes/sessions/sessions.json` | 从 session key 映射到当前 active session ID |

官方说明 SQLite 使用 WAL 模式，适合网关的多平台读取 + 单写入模式。

#### Database Schema

关键表包括：

- `sessions`
- `messages`
- `messages_fts`

其中 `sessions` 的 title 使用唯一索引，但允许 `NULL`，只有非空 title 要求唯一。

### Session 过期与清理

#### 自动清理

- gateway sessions 会根据 reset policy 自动 reset
- reset 前会先提取 memories 与 skills
- 已结束 sessions 会保留在数据库中，直到被 prune

#### 手动清理

```bash
hermes sessions prune
hermes sessions delete <session_id>
hermes sessions export backup.jsonl
hermes sessions prune --older-than 30 --yes
```

官方 tip：

- 数据库增长通常比较慢
- 几百个 sessions 大约也就 10–15 MB
- prune 更多是为了删掉不再需要检索的旧对话

---

## 第 4 章：Git Worktrees

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/git-worktrees`

### 为什么要和 Hermes 一起用 Worktrees

Hermes 把当前工作目录视为项目根：

- CLI：你运行 `hermes` 或 `hermes chat` 的目录
- Gateway：`MESSAGING_CWD` 指向的目录

如果多个 agents 在同一个 checkout 里工作，官方指出会有风险：

- 一个 agent 可能删除或重写另一个 agent 正在使用的文件
- 很难分清不同实验各自改了什么

worktree 的好处是每个 agent 拥有：

- 自己独立的 branch 和 working directory
- 自己独立的 Checkpoint Manager 历史

### 快速开始：创建 Worktree

```bash
cd /path/to/your/repo
git worktree add ../repo-feature feature/hermes-experiment
```

这会创建：

- 新目录 `../repo-feature`
- 新分支 `feature/hermes-experiment`

然后在新 worktree 中启动 Hermes：

```bash
cd ../repo-feature
hermes
```

官方说明这时 Hermes 会：

- 把 `../repo-feature` 视为项目根
- 用它来做 context files、代码编辑与工具调用
- 为这个 worktree 使用独立的 checkpoint history

### 并行运行多个 Agents

```bash
cd /path/to/your/repo
git worktree add ../repo-experiment-a feature/hermes-a
git worktree add ../repo-experiment-b feature/hermes-b
```

然后在不同终端中分别运行：

```bash
# Terminal 1
cd ../repo-experiment-a
hermes

# Terminal 2
cd ../repo-experiment-b
hermes
```

每个 Hermes 进程都会：

- 运行在各自的 branch 上
- 由于 worktree 路径不同，写到不同的 shadow repo hash 下
- 可以独立使用 `/rollback`，互不影响

官方认为这对以下场景特别有用：

- batch refactors
- 同一问题尝试不同方案
- CLI 与 gateway 会话同时对同一个上游仓库工作

### 安全清理 Worktrees

结束实验后，官方建议：

1. 先决定是保留还是丢弃工作
2. 若要保留，则像平常一样把该 branch 合回主分支
3. 删除 worktree：

```bash
cd /path/to/your/repo
git worktree remove ../repo-feature
```

注意事项：

- 若 worktree 里还有未提交改动，`git worktree remove` 会拒绝删除，除非你显式强制
- 删除 worktree 不会自动删 branch
- `~/.hermes/checkpoints/` 下对应的 checkpoint 数据不会自动 prune，但通常很小

### 最佳实践

- 每个 Hermes 实验对应一个 worktree
- branch 名最好按实验来命名
- 高频提交，用 git commits 记录高层里程碑
- 用 checkpoints 与 `/rollback` 兜住中间的 tool-driven edits
- 如果用了 worktrees，就尽量别从原始 bare repo root 里直接跑 Hermes

### 使用 `hermes -w` 自动进入 Worktree 模式

Hermes 内置 `-w` 参数，可以自动创建一个一次性的 git worktree 与独立 branch。

```bash
cd /path/to/your/repo
hermes -w
```

官方说明它会：

- 在仓库的 `.worktrees/` 下创建临时 worktree
- checkout 一个隔离 branch，例如 `hermes/hermes-<hash>`
- 在这个 worktree 里运行完整 CLI 会话

也可以配合单次查询：

```bash
hermes -w -q "Fix issue #123"
```

如果要并行多个 agent，只需在多个终端中分别运行 `hermes -w`。

### 这一页的结论

官方把推荐组合总结为：

- 用 git worktrees 隔离不同 Hermes 会话
- 用 branches 保留实验的高层历史
- 用 checkpoints 与 `/rollback` 处理单个 worktree 内的失误恢复

这样能同时得到：

- 不同 agent 之间不会互相踩文件
- 更快的试错速度
- 更干净、可审阅的 PR

---

## 第 5 章：Docker

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/docker`

### 这一章讲什么

官方说明 Docker 与 Hermes 的关系有两种：

1. Hermes 本身运行在 Docker 里
2. Hermes 运行在宿主机，但命令执行在 Docker sandbox 里

本页主要讲第一种，即让 Hermes 自身跑在容器中。

### 核心思路

容器中的所有用户数据都放在挂载自宿主机的 `/opt/data` 下。镜像本身是无状态的，因此可以通过拉新镜像升级，而不丢配置。

### Quick start

首次运行时，先在宿主机创建数据目录，然后交互式运行 setup：

```sh
mkdir -p ~/.hermes
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent setup
```

这会进入 setup wizard，向你询问 API keys，并把它们写入 `~/.hermes/.env`。官方还建议你在这个阶段顺手配置好至少一个聊天系统，便于后续 gateway 工作。

### 以 gateway mode 后台运行

完成配置后，可以将其作为常驻 gateway 在后台启动：

```sh
docker run -d \
  --name hermes \
  --restart unless-stopped \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

### 交互式运行 CLI chat

若只是连接到已有数据目录并打开一个交互式 CLI：

```sh
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent
```

### 持久化卷

`/opt/data` 是所有 Hermes 状态的唯一真源，对应宿主机上的 `~/.hermes/`。其中包括：

| 路径 | 内容 |
|---|---|
| `.env` | API keys 与 secrets |
| `config.yaml` | Hermes 全部配置 |
| `SOUL.md` | agent personality / identity |
| `sessions/` | 对话历史 |
| `memories/` | 持久 memory |
| `skills/` | 已安装 skills |
| `cron/` | 定时任务定义 |
| `hooks/` | event hooks |
| `logs/` | 运行日志 |
| `skins/` | 自定义 CLI skins |

官方警告：

- 不要让两个 Hermes 容器同时挂到同一个数据目录
- session files 与 memory stores 并没有为并发访问设计

### 环境变量转发

容器内默认从 `/opt/data/.env` 读取 API keys。你也可以直接通过 `-e` 传入：

```sh
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  -e ANTHROPIC_API_KEY="sk-ant-..." \
  -e OPENAI_API_KEY="sk-..." \
  nousresearch/hermes-agent
```

官方说明：

- 直接 `-e` 传入的值优先级高于 `.env`
- 适合 CI/CD 或 secrets manager 场景
- 也适合不希望把 key 写入磁盘的情况

### Docker Compose 示例

```yaml
version: "3.8"
services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes
    restart: unless-stopped
    command: gateway run
    volumes:
      - ~/.hermes:/opt/data
    # environment:
    #   - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    #   - OPENAI_API_KEY=${OPENAI_API_KEY}
    #   - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: "2.0"
```

启动方式：

```bash
docker compose up -d
docker compose logs -f hermes
```

### 资源限制

官方给出的推荐资源下限：

| 资源 | 最低 | 推荐 |
|---|---|---|
| Memory | 1 GB | 2–4 GB |
| CPU | 1 core | 2 cores |
| Disk（data volume） | 500 MB | 2+ GB |

补充说明：

- 浏览器自动化（Playwright / Chromium）是最吃内存的功能
- 不用浏览器工具的话，1 GB 够用
- 若开启浏览器工具，至少给 2 GB

设置资源限制的运行示例：

```sh
docker run -d \
  --name hermes \
  --restart unless-stopped \
  --memory=4g --cpus=2 \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

### 官方 Dockerfile 做了什么

官方镜像基于 `debian:13.4`，包含：

- Python 3 与全部 Hermes 依赖，即 `pip install -e ".[all]"`
- Node.js + npm
- Playwright + Chromium
- `ripgrep` 与 `ffmpeg`
- WhatsApp bridge

`docker/entrypoint.sh` 在首次运行时会：

- 创建目录结构，如 `sessions/`、`memories/`、`skills/`
- 若无 `.env`，复制 `.env.example` 到 `.env`
- 若缺失默认 `config.yaml`，则复制
- 若缺失默认 `SOUL.md`，则复制
- 用 manifest 方式同步 bundled skills，并保留用户改动
- 最后用你传入的参数启动 `hermes`

### 升级

拉最新镜像并重建容器即可，数据目录不受影响：

```sh
docker pull nousresearch/hermes-agent:latest
docker rm -f hermes
docker run -d \
  --name hermes \
  --restart unless-stopped \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

Docker Compose 方式：

```sh
docker compose pull
docker compose up -d
```

### Skills 与 credential files

官方特别说明了一种容易混淆的情况：

- 当 Docker 被用作“执行环境”，也就是 terminal backend，而不是本页这种“把 Hermes 本身运行在 Docker 中”时
- Hermes 会自动把 `~/.hermes/skills/` 和 skills 声明的 credential files 以只读挂载方式放进容器

同类同步逻辑也适用于：

- SSH backend
- Modal backend

### 故障排查

#### 容器启动后立刻退出

先看：

```sh
docker logs hermes
```

常见原因：

- 缺少或损坏 `.env`
- 如果暴露了端口，可能有端口冲突

#### “Permission denied”

官方说明容器默认以 root 运行。若 `~/.hermes/` 是由普通用户创建，一般不会有权限问题。若出现问题，可以确认该目录可写：

```sh
chmod -R 755 ~/.hermes
```

#### 浏览器工具不工作

Playwright 需要共享内存，给容器加上：

```sh
docker run -d \
  --name hermes \
  --shm-size=1g \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

#### 网络问题后 gateway 无法重连

`--restart unless-stopped` 可处理多数瞬时故障；若仍卡住：

```sh
docker restart hermes
```

#### 检查容器健康状态

```sh
docker logs --tail 50 hermes
docker exec hermes hermes version
docker stats hermes
```

---

## 第 6 章：Checkpoints 与 `/rollback`

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback`

### 这一章讲什么

Hermes 会在执行破坏性操作前自动为项目做快照，并允许你用一条命令恢复。官方强调：

- checkpoints 默认开启
- 当没有触发任何会改文件的工具时，几乎没有成本

这套机制由内部的 Checkpoint Manager 驱动，并把 shadow git repository 存放在：

- `~/.hermes/checkpoints/`

你的真实项目 `.git` 不会被触碰。

### 什么会触发 Checkpoint

Hermes 会在以下动作前自动做快照：

- 文件工具：`write_file` 与 `patch`
- 破坏性终端命令：`rm`、`mv`、`sed -i`、`truncate`、`shred`、输出重定向 `>`、以及 `git reset` / `git clean` / `git checkout`

官方限制：

- 每个目录、每轮对话最多做一个 checkpoint
- 因此长会话不会疯狂刷快照

### 快速参考

| 命令 | 说明 |
|---|---|
| `/rollback` | 列出所有 checkpoints 和变更统计 |
| `/rollback <N>` | 恢复到第 N 个 checkpoint，同时撤销最近一次 chat turn |
| `/rollback diff <N>` | 预览第 N 个 checkpoint 与当前状态的 diff |
| `/rollback <N> <file>` | 只从第 N 个 checkpoint 恢复某一个文件 |

### 工作原理

官方高层描述如下：

- Hermes 发现某个工具即将修改 working tree
- 然后每个对话轮次、每个目录只做一次 checkpoint
- 它会先解析合适的 project root
- 初始化或复用一个绑定到该目录的 shadow git repo
- 用简洁、可读的理由提交当前状态

这些 shadow repo commits 组成了可供你检查与恢复的 checkpoint 历史。

### 配置

默认启用，可在 `~/.hermes/config.yaml` 中调整：

```yaml
checkpoints:
  enabled: true
  max_snapshots: 50
```

关闭：

```yaml
checkpoints:
  enabled: false
```

关闭后 Checkpoint Manager 会变成 no-op，不再做 git 操作。

### 列出 Checkpoints

在 CLI 中输入：

```text
/rollback
```

官方示例输出：

```text
📸 Checkpoints for /path/to/project:

  1. 4270a8c  2026-03-16 04:36  before patch  (1 file, +1/-0)
  2. eaf4c1f  2026-03-16 04:35  before write_file
  3. b3f9d2e  2026-03-16 04:34  before terminal: sed -i s/old/new/ config.py  (1 file, +1/-1)

  /rollback <N>             restore to checkpoint N
  /rollback diff <N>        preview changes since checkpoint N
  /rollback <N> <file>      restore a single file from checkpoint N
```

每一项包含：

- 短 hash
- 时间戳
- 理由
- 变更摘要

### 使用 `/rollback diff` 预览变化

```text
/rollback diff 1
```

官方示例输出会先展示 diff stat，再展示实际 diff：

```text
test.py | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

diff --git a/test.py b/test.py
--- a/test.py
+++ b/test.py
@@ -1 +1 @@
-print('original content')
+print('modified content')
```

长 diff 最多显示 80 行，避免刷屏。

### 使用 `/rollback` 恢复

```text
/rollback 1
```

官方描述幕后会发生四件事：

1. 确认目标 commit 在 shadow repo 中存在
2. 先对当前状态做一个 pre-rollback snapshot，便于“撤销这次撤销”
3. 恢复 working directory 中被跟踪的文件
4. 撤销最近一次 conversation turn，让 agent 的上下文与恢复后的文件系统状态一致

成功示例：

```text
✅ Restored to checkpoint 4270a8c5: before patch
A pre-rollback snapshot was saved automatically.
(^_^)b Undid 4 message(s). Removed: "Now update test.py to ..."
  4 message(s) remaining in history.
  Chat turn undone to match restored file state.
```

官方强调，撤销对话轮次的目的是避免 agent 还“记得”已经被回滚掉的修改。

### 单文件恢复

```text
/rollback 1 src/broken_file.py
```

适合只想回滚一个文件而不影响整个目录的情况。

### 安全与性能保护

为了保证 checkpointing 安全且足够快，官方列出的保护包括：

- 若 `git` 不在 `PATH` 中，则透明地停用 checkpoints
- 跳过过于宽泛的目录，比如根目录 `/` 和 home 目录 `$HOME`
- 若目录中文件数超过 50,000，会跳过，避免 git 过慢
- 若与上一次 snapshot 相比没有变化，则不做新 checkpoint
- Checkpoint Manager 内部所有错误都只记 debug log，不会阻止工具继续运行

### Checkpoints 存储在哪里

官方目录结构：

```text
~/.hermes/checkpoints/
  ├── <hash1>/
  ├── <hash2>/
  └── ...
```

每个 `<hash>` 都由 working directory 的绝对路径推导而来。shadow repo 内部包含：

- 标准 git internals
- `info/exclude`
- `HERMES_WORKDIR` 文件

通常不需要手动操作这些内容。

### 最佳实践

- 保持 checkpoints 开启
- 恢复前先用 `/rollback diff`
- 当你只想撤销 agent 造成的改动时，优先用 `/rollback` 而不是 `git reset`
- 与 git worktrees 配合使用时最安全：每个 Hermes 会话单独一个 worktree / branch，再加上 checkpoints 作为第二层保险

---

## 第 7 章：Configuration

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/configuration`

### 这一章讲什么

官方把 Hermes 的所有设置统一放在 `~/.hermes/` 下，便于直接查看与修改。

### 目录结构

官方给出的目录结构如下：

```text
~/.hermes/
├── config.yaml
├── .env
├── auth.json
├── SOUL.md
├── memories/
├── skills/
├── cron/
├── sessions/
└── logs/
```

各项含义：

- `config.yaml`：普通设置，如 model、terminal、TTS、compression
- `.env`：API keys 与 secrets
- `auth.json`：OAuth provider 凭证，如 Nous Portal
- `SOUL.md`：主 agent identity
- `memories/`：持久记忆
- `skills/`：agent 创建的 skills
- `cron/`：定时任务
- `sessions/`：gateway sessions
- `logs/`：日志，包含自动 secrets redaction

### 管理配置

官方命令：

```bash
hermes config
hermes config edit
hermes config set KEY VAL
hermes config check
hermes config migrate
```

示例：

```bash
hermes config set model anthropic/claude-opus-4
hermes config set terminal.backend docker
hermes config set OPENROUTER_API_KEY sk-or-...
```

官方 tip：

- `hermes config set` 会自动把值写到正确的文件
- API keys 会写进 `.env`
- 其余普通配置会写进 `config.yaml`

### 配置优先级

官方给出的优先级从高到低如下：

1. CLI arguments
2. `~/.hermes/config.yaml`
3. `~/.hermes/.env`
4. 内建默认值

官方 rule of thumb：

- secrets 放 `.env`
- 非 secrets 放 `config.yaml`
- 当两边都设置了同一个非 secret 值时，`config.yaml` 优先

### 环境变量替换

你可以在 `config.yaml` 中使用 `${VAR_NAME}` 语法：

```yaml
auxiliary:
  vision:
    api_key: ${GOOGLE_API_KEY}
    base_url: ${CUSTOM_VISION_URL}

delegation:
  api_key: ${DELEGATION_KEY}
```

规则：

- 支持同一字符串中多个 `${VAR}`
- 未定义变量时，原样保留 `${UNDEFINED_VAR}`
- 不支持裸 `$VAR`

### Terminal Backend 配置

官方支持 6 种 terminal backend：

- `local`
- `docker`
- `ssh`
- `modal`
- `daytona`
- `singularity`

基础配置示例：

```yaml
terminal:
  backend: local
  cwd: "."
  timeout: 180
  env_passthrough: []
  singularity_image: "docker://nikolaik/python-nodejs:python3.11-nodejs20"
  modal_image: "nikolaik/python-nodejs:python3.11-nodejs20"
  daytona_image: "nikolaik/python-nodejs:python3.11-nodejs20"
```

对云 sandbox 而言，`container_persistent: true` 表示尽量保留文件系统状态，但不保证原来的 live sandbox、PID 空间或后台进程仍然存在。

#### Backend 总览

| Backend | 命令运行位置 | 隔离性 | 适用场景 |
|---|---|---|---|
| `local` | 本机 | 无 | 开发、个人使用 |
| `docker` | Docker 容器 | 完整 | 安全沙箱、CI/CD |
| `ssh` | 远程服务器 | 网络边界 | 远程开发、大机器 |
| `modal` | Modal 云 sandbox | 完整 | 临时云算力、evals |
| `daytona` | Daytona workspace | 完整 | 托管云开发环境 |
| `singularity` | Singularity / Apptainer 容器 | 完整 | HPC、共享机器 |

#### Local Backend

默认后端，命令直接在本机执行：

```yaml
terminal:
  backend: local
```

官方警告：

- agent 拥有与你当前用户相同的文件系统权限
- 如需更安全，可通过 `hermes tools` 禁用工具，或切换到 Docker

#### Docker Backend

在 Docker 容器中执行命令，带安全加固：

```yaml
terminal:
  backend: docker
  docker_image: "nikolaik/python-nodejs:python3.11-nodejs20"
  docker_mount_cwd_to_workspace: false
  docker_forward_env:
    - "GITHUB_TOKEN"
  docker_volumes:
    - "/home/user/projects:/workspace/projects"
    - "/home/user/data:/data:ro"
  container_cpu: 1
  container_memory: 5120
  container_disk: 51200
  container_persistent: true
```

要求：

- Docker Desktop 或 Docker Engine 已安装并运行
- Hermes 会在 `$PATH` 与常见 macOS 路径里探测 docker

生命周期：

- 每个 session 会启动一个长生命周期容器，如 `docker run -d ... sleep 2h`
- 实际命令通过 `docker exec` 在登录 shell 中运行
- cleanup 时停止并删除容器

安全加固：

- `--cap-drop ALL`
- 只加回 `DAC_OVERRIDE`、`CHOWN`、`FOWNER`
- `--security-opt no-new-privileges`
- `--pids-limit 256`
- `/tmp`、`/var/tmp`、`/run` 使用限额 tmpfs

凭证转发：

- `docker_forward_env` 中列出的变量会优先从当前 shell 解析，其次回退到 `~/.hermes/.env`
- skills 也可通过 `required_environment_variables` 自动合并

#### SSH Backend

在远端服务器执行命令。支持 ControlMaster 复用连接，默认空闲保活 5 分钟。并且默认启用 persistent shell。

```yaml
terminal:
  backend: ssh
  persistent_shell: true
```

所需环境变量：

```bash
TERMINAL_SSH_HOST=my-server.example.com
TERMINAL_SSH_USER=ubuntu
```

可选：

| 变量 | 默认值 | 说明 |
|---|---|---|
| `TERMINAL_SSH_PORT` | `22` | SSH 端口 |
| `TERMINAL_SSH_KEY` | 系统默认 | 私钥路径 |
| `TERMINAL_SSH_PERSISTENT` | `true` | 是否启用 persistent shell |

工作方式：

- 初始化时用 `BatchMode=yes` 与 `StrictHostKeyChecking=accept-new` 建立连接
- persistent shell 会维持一个长时间运行的 `bash -l`
- 如命令需要 `stdin_data` 或 `sudo`，会自动退回 one-shot mode

#### Modal Backend

在 [Modal](https://modal.com) 云 sandbox 中执行。

```yaml
terminal:
  backend: modal
  container_cpu: 1
  container_memory: 5120
  container_disk: 51200
  container_persistent: true
```

要求：

- `MODAL_TOKEN_ID` + `MODAL_TOKEN_SECRET`
- 或 `~/.modal.toml`

持久化：

- cleanup 时对文件系统做 snapshot
- 下一 session 恢复
- snapshot 跟踪在 `~/.hermes/modal_snapshots.json`
- 只保留文件系统状态，不保留进程与 PID 空间

credential files 会自动从 `~/.hermes/` 挂载，并在每条命令前同步。

#### Daytona Backend

在 [Daytona](https://daytona.io) 管理的 workspace 中执行。

```yaml
terminal:
  backend: daytona
  container_cpu: 1
  container_memory: 5120
  container_disk: 10240
  container_persistent: true
```

要求：

- `DAYTONA_API_KEY`

持久化：

- cleanup 时 stop 而不是 delete
- 下次 session 会 resume
- sandbox 名格式为 `hermes-{task_id}`

磁盘限制：

- Daytona 最大仅支持 10 GiB
- 超过时 Hermes 会截断并打印警告

#### Singularity / Apptainer Backend

在 [Singularity/Apptainer](https://apptainer.org) 容器中运行：

```yaml
terminal:
  backend: singularity
  singularity_image: "docker://nikolaik/python-nodejs:python3.11-nodejs20"
  container_cpu: 1
  container_memory: 5120
  container_persistent: true
```

要求：

- `apptainer` 或 `singularity` 在 `$PATH`

镜像处理：

- `docker://...` 会被自动转换成 `.sif`
- 已有 `.sif` 文件会直接使用

scratch 目录解析顺序：

1. `TERMINAL_SCRATCH_DIR`
2. `TERMINAL_SANDBOX_DIR/singularity`
3. `/scratch/$USER/hermes-agent`
4. `~/.hermes/sandboxes/singularity`

隔离方式：

- `--containall --no-home`

#### 常见 Terminal Backend 问题

若 terminal commands 一上来就失败，或 terminal tool 被视为禁用，官方建议排查：

- `local`：无特殊要求
- `docker`：先运行 `docker version`
- `ssh`：必须同时设置 `TERMINAL_SSH_HOST` 和 `TERMINAL_SSH_USER`
- `modal`：需要 `MODAL_TOKEN_ID` 或 `~/.modal.toml`
- `daytona`：需要 `DAYTONA_API_KEY`
- `singularity`：需要 `apptainer` 或 `singularity`

不确定时，可先切回：

```bash
hermes config set terminal.backend local
```

#### Docker Volume Mounts

`docker_volumes` 使用标准 Docker `-v` 语法：

```yaml
terminal:
  backend: docker
  docker_volumes:
    - "/home/user/projects:/workspace/projects"
    - "/home/user/datasets:/data:ro"
    - "/home/user/outputs:/outputs"
```

用途：

- 给 agent 提供输入文件
- 接收 agent 产出的文件
- 共享 workspace

也可通过环境变量传 JSON 数组：

- `TERMINAL_DOCKER_VOLUMES='["/host:/container"]'`

#### Docker Credential Forwarding

默认情况下，Docker terminal session 不会继承任意宿主机凭证。若需某个 token 进容器：

```yaml
terminal:
  backend: docker
  docker_forward_env:
    - "GITHUB_TOKEN"
    - "NPM_TOKEN"
```

官方警告：

- 进入 `docker_forward_env` 的变量，会对容器中的命令可见
- 只应转发你愿意暴露给 terminal session 的凭证

#### 可选：将启动目录挂到 `/workspace`

默认情况下 Docker sandbox 与宿主机启动目录隔离。如需把当前目录挂入容器：

```yaml
terminal:
  backend: docker
  docker_mount_cwd_to_workspace: true
```

启用后：

- 若从 `~/projects/my-app` 启动 Hermes，则该目录会挂到容器内 `/workspace`
- Docker backend 也会从 `/workspace` 启动
- file tools 与 terminal commands 会看到同一个挂载项目

安全权衡：

- `false`：保留 sandbox 边界
- `true`：让 sandbox 直接访问你启动 Hermes 时所在目录

#### Persistent Shell

默认情况下，每条 terminal command 都在新 subprocess 里运行，因此：

- 工作目录会重置
- 环境变量会重置
- shell variables 会重置

若开启 persistent shell，则会跨多次 `execute()` 维持一个长生命周期 bash 进程。

```yaml
terminal:
  persistent_shell: true
```

关闭：

```bash
hermes config set terminal.persistent_shell false
```

会持久保留的内容：

- `cd` 改过的工作目录
- `export FOO=bar`
- `MY_VAR=hello`

优先级：

| 层级 | 变量 | 默认值 |
|---|---|---|
| Config | `terminal.persistent_shell` | `true` |
| SSH override | `TERMINAL_SSH_PERSISTENT` | 跟随 config |
| Local override | `TERMINAL_LOCAL_PERSISTENT` | `false` |

若想让 local backend 也启用 persistent shell：

```bash
export TERMINAL_LOCAL_PERSISTENT=true
```

官方 note：

- 带 `stdin_data` 或 `sudo` 的命令会自动退回 one-shot mode

### Skill Settings

skills 可在自身 `SKILL.md` frontmatter 中声明配置项，这些非 secret 值会存到 `config.yaml` 的 `skills.config` 命名空间。

```yaml
skills:
  config:
    wiki:
      path: ~/wiki
```

官方说明：

- `hermes config migrate` 会扫描已启用 skills，找出未配置项并提示填写
- `hermes config show` 会在 “Skill Settings” 下显示这些设置
- skill 加载时，解析后的配置值会自动注入到 skill context

手动设置：

```bash
hermes config set skills.config.wiki.path ~/my-research-wiki
```

### Memory Configuration

```yaml
memory:
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 2200
  user_char_limit: 1375
```

### File Read Safety

控制单次 `read_file` 允许返回的最大字符数：

```yaml
file_read_max_chars: 100000
```

超过上限时，agent 会收到错误，并被引导改用 `offset` 与 `limit` 分段读取。

官方给出的调优示例：

```yaml
# 大上下文模型
file_read_max_chars: 200000

# 小上下文本地模型
file_read_max_chars: 30000
```

官方还说明：

- 同一区间的文件重复读取时，若文件没变，会返回轻量 stub，而不是重新灌全文
- 发生 context compression 后，这个 dedup 会重置

### Git Worktree Isolation

可以在配置中始终启用 worktree：

```yaml
worktree: true
# worktree: false
```

开启后：

- 每个 CLI session 都会在 `.worktrees/` 下创建新的 worktree
- 带独立 branch
- agent 可在其中编辑、提交、push、创建 PR
- 干净的 worktree 退出时会被清理
- 有脏改动的 worktree 会保留，便于手动恢复

你还可以在 repo root 中通过 `.worktreeinclude` 指定要复制进 worktree 的 gitignored 文件：

```text
.env
.venv/
node_modules/
```

### Context Compression

Hermes 会自动压缩长会话，避免撞到 model 的上下文上限。压缩摘要是一次独立的 LLM 调用。

完整配置：

```yaml
compression:
  enabled: true
  threshold: 0.50
  target_ratio: 0.20
  protect_last_n: 20
  summary_model: "google/gemini-3-flash-preview"
  summary_provider: "auto"
  summary_base_url: null
```

常见方案：

默认自动探测：

```yaml
compression:
  enabled: true
  threshold: 0.50
```

强制指定 provider：

```yaml
compression:
  summary_provider: nous
  summary_model: gemini-3-flash
```

自定义 OpenAI-compatible endpoint：

```yaml
compression:
  summary_model: glm-4.7
  summary_base_url: https://api.z.ai/api/coding/paas/v4
```

三项参数的关系：

| `summary_provider` | `summary_base_url` | 结果 |
|---|---|---|
| `auto` | 未设置 | 自动探测最佳 provider |
| `nous` / `openrouter` / 其他 | 未设置 | 强制指定该 provider |
| 任意值 | 已设置 | 直接调用该 endpoint，忽略 provider |

官方提醒：

- `summary_model` 的上下文长度应至少不小于主模型，因为它要接收会话中较大的中段内容

### Iteration Budget Pressure

Hermes 会在 agent 接近单轮迭代预算上限时自动提醒模型。

阈值：

| 阈值 | 级别 | 模型会看到什么 |
|---|---|---|
| `70%` | Caution | `[BUDGET: 63/90. 27 iterations left. Start consolidating.]` |
| `90%` | Warning | `[BUDGET WARNING: 81/90. Only 9 left. Respond NOW.]` |

配置：

```yaml
agent:
  max_turns: 90
```

这些警告会注入到最近一个 tool result 的 JSON 里，而不是单独插一条新消息，以保留 prompt caching 结构。

### Context Pressure Warnings

这和 iteration budget 不同，它提醒的是“离 context compaction 还有多远”。

| 进度 | 级别 | 表现 |
|---|---|---|
| `>= 60%` 到阈值 | Info | CLI 中出现青色进度条；gateway 发信息性提示 |
| `>= 85%` 到阈值 | Warning | CLI 中出现醒目的黄色进度条；gateway 提醒压缩将发生 |

CLI 例子：

```text
  ◐ context ████████████░░░░░░░░ 62% to compaction  48k threshold (50%) · approaching compaction
```

消息平台例子：

```text
◐ Context: ████████████░░░░░░░░ 62% to compaction (threshold: 50% of window).
```

若 auto-compression 关闭，提示会说明上下文可能被截断。

### Credential Pool Strategies

当同一个 provider 有多把 key 或多个 OAuth token 时，可配置轮换策略：

```yaml
credential_pool_strategies:
  openrouter: round_robin
  anthropic: least_used
```

支持：

- `fill_first`
- `round_robin`
- `least_used`
- `random`

默认是 `fill_first`。

### Auxiliary Models

Hermes 用轻量辅助模型来做：

- image analysis
- web page summarization
- browser screenshot analysis
- approval classifier
- session search summarization
- skills hub 匹配
- MCP dispatch
- memory flush

默认情况下，这些 auxiliary tasks 走 Gemini Flash 自动探测链。

#### 通用配置模式

所有 auxiliary / compression / fallback model 槽位都共享三元组：

| Key | 作用 | 默认 |
|---|---|---|
| `provider` | 用哪个 provider 做认证与路由 | `"auto"` |
| `model` | 请求哪个模型 | provider 默认值 |
| `base_url` | 自定义 OpenAI-compatible endpoint | 未设置 |

当设置了 `base_url` 后，会直接调用该 endpoint，并忽略 `provider`。

#### 全量 auxiliary 配置参考

官方给出如下结构：

```yaml
auxiliary:
  vision:
    provider: "auto"
    model: ""
    base_url: ""
    api_key: ""
    timeout: 30
    download_timeout: 30

  web_extract:
    provider: "auto"
    model: ""
    base_url: ""
    api_key: ""
    timeout: 360

  approval:
    provider: "auto"
    model: ""
    base_url: ""
    api_key: ""
    timeout: 30

  compression:
    timeout: 120

  session_search:
    provider: "auto"
    model: ""
    base_url: ""
    api_key: ""
    timeout: 30

  skills_hub:
    provider: "auto"
    model: ""
    base_url: ""
    api_key: ""
    timeout: 30

  mcp:
    provider: "auto"
    model: ""
    base_url: ""
    api_key: ""
    timeout: 30

  flush_memories:
    provider: "auto"
    model: ""
    base_url: ""
    api_key: ""
    timeout: 30
```

官方 tip：

- 每类 auxiliary task 都可单独配 `timeout`
- 默认值如：vision 30s、web_extract 360s、approval 30s、compression 120s
- vision 另有 `download_timeout`

#### 更换 Vision Model

如果想把 image analysis 改成 GPT-4o：

```yaml
auxiliary:
  vision:
    model: "openai/gpt-4o"
```

也可以走环境变量：

```bash
AUXILIARY_VISION_MODEL=openai/gpt-4o
```

#### Provider Options

这些 provider 选项只适用于 auxiliary / compression / fallback，不适用于主 `model.provider`。

| Provider | 含义 | 需求 |
|---|---|---|
| `"auto"` | 自动探测最佳 provider | 无 |
| `"openrouter"` | 强制走 OpenRouter | `OPENROUTER_API_KEY` |
| `"nous"` | 强制走 Nous Portal | `hermes auth` |
| `"codex"` | 强制走 Codex OAuth | 先在 `hermes model` 中配置 Codex |
| `"main"` | 使用主 agent 的 provider / endpoint | 主模型配置可用 |

官方警告：

- `"main"` 只对 auxiliary tasks 有意义
- 顶层 `model.provider` 不能设成 `"main"`

#### 常见 Auxiliary 配置

自定义 endpoint：

```yaml
auxiliary:
  vision:
    base_url: "http://localhost:1234/v1"
    api_key: "local-key"
    model: "qwen2.5-vl"
```

走主 OpenAI endpoint：

```yaml
auxiliary:
  vision:
    provider: "main"
    model: "gpt-4o"
```

走 OpenRouter：

```yaml
auxiliary:
  vision:
    provider: "openrouter"
    model: "openai/gpt-4o"
```

走 Codex OAuth：

```yaml
auxiliary:
  vision:
    provider: "codex"
```

官方说明：如果主模型本身就是 Codex OAuth，vision 通常无需额外配置。

官方警告：

- vision model 必须是多模态模型
- 若设为 `provider: "main"`，你要自行保证主 endpoint 支持视觉

#### Legacy 环境变量

虽然官方更推荐 `config.yaml`，但 auxiliary 仍支持部分环境变量：

| 设置项 | 环境变量 |
|---|---|
| Vision provider | `AUXILIARY_VISION_PROVIDER` |
| Vision model | `AUXILIARY_VISION_MODEL` |
| Vision endpoint | `AUXILIARY_VISION_BASE_URL` |
| Vision API key | `AUXILIARY_VISION_API_KEY` |
| Web extract provider | `AUXILIARY_WEB_EXTRACT_PROVIDER` |
| Web extract model | `AUXILIARY_WEB_EXTRACT_MODEL` |
| Web extract endpoint | `AUXILIARY_WEB_EXTRACT_BASE_URL` |
| Web extract API key | `AUXILIARY_WEB_EXTRACT_API_KEY` |

官方说明：

- compression 与 fallback model 只支持 `config.yaml`
- 可用 `hermes config` 查看当前 auxiliary 配置

### Reasoning Effort

```yaml
agent:
  reasoning_effort: ""
```

官方说明：

- 空值时默认是 `medium`
- 支持：`xhigh`、`high`、`medium`、`low`、`minimal`、`none`
- 提高 reasoning effort 会提升复杂任务效果，但增加 token 与延迟

也可在运行时用：

```text
/reasoning
/reasoning high
/reasoning none
/reasoning show
/reasoning hide
```

### Tool-Use Enforcement

某些模型，尤其 GPT 系列，偶尔会“描述自己要调用工具”，而不是实际发起 tool call。tool-use enforcement 的作用就是给模型更强的提示，逼近真实 tool call。

```yaml
agent:
  tool_use_enforcement: "auto"
```

取值：

| 值 | 行为 |
|---|---|
| `"auto"` | 对 GPT 家族启用，对其他模型关闭 |
| `true` | 永远启用 |
| `false` | 永远关闭 |
| `["gpt-", "o1-", "custom-model"]` | 仅对匹配子串的模型启用 |

### TTS Configuration

```yaml
tts:
  provider: "edge"
  edge:
    voice: "en-US-AriaNeural"
  elevenlabs:
    voice_id: "pNInz6obpgDQGcFmaJgB"
    model_id: "eleven_multilingual_v2"
  openai:
    model: "gpt-4o-mini-tts"
    voice: "alloy"
    base_url: "https://api.openai.com/v1"
  neutts:
    ref_audio: ''
    ref_text: ''
    model: neuphonic/neutts-air-q4-gguf
    device: cpu
```

这同时影响：

- `text_to_speech` 工具
- voice mode 中的 spoken replies

### Display Settings

```yaml
display:
  tool_progress: all
  tool_progress_command: false
  tool_progress_overrides: {}
  skin: default
  personality: "kawaii"
  compact: false
  resume_display: full
  bell_on_complete: false
  show_reasoning: false
  streaming: false
  show_cost: false
  tool_preview_length: 0
```

`tool_progress` 各模式：

| 模式 | 表现 |
|---|---|
| `off` | 静默，只看最终回复 |
| `new` | 工具变化时才显示一行 |
| `all` | 每次 tool call 都显示简短预览，默认 |
| `verbose` | 展示完整参数、结果与 debug logs |

官方还支持按平台覆盖：

```yaml
display:
  tool_progress: all
  tool_progress_overrides:
    signal: 'off'
    telegram: verbose
    slack: 'off'
```

支持的平台键包括：

- `telegram`
- `discord`
- `slack`
- `signal`
- `whatsapp`
- `matrix`
- `mattermost`
- `email`
- `sms`
- `homeassistant`
- `dingtalk`
- `feishu`
- `wecom`
- `bluebubbles`

### Privacy

```yaml
privacy:
  redact_pii: false
```

当设为 `true` 时，gateway 会在送给 LLM 的 system prompt 中对 PII 做脱敏。

官方列出的处理方式：

| 字段 | 处理 |
|---|---|
| Phone numbers | 哈希成 `user_<12-char-sha256>` |
| User IDs | 哈希成 `user_<12-char-sha256>` |
| Chat IDs | 数字部分做哈希，平台前缀保留 |
| Home channel IDs | 数字部分做哈希 |
| 用户名 | 不处理 |

平台支持：

- WhatsApp
- Signal
- Telegram

Discord 与 Slack 不支持，因为 mention 机制需要真实 ID。

### Speech-to-Text（STT）

```yaml
stt:
  provider: "local"
  local:
    model: "base"
  openai:
    model: "whisper-1"
```

provider 行为：

- `local`：本地 `faster-whisper`
- `groq`：Groq Whisper-compatible endpoint，读取 `GROQ_API_KEY`
- `openai`：OpenAI speech API，读取 `VOICE_TOOLS_OPENAI_KEY`

回退顺序：

- `local` → `groq` → `openai`

环境变量示例：

```bash
STT_GROQ_MODEL=whisper-large-v3-turbo
STT_OPENAI_MODEL=whisper-1
GROQ_BASE_URL=https://api.groq.com/openai/v1
STT_OPENAI_BASE_URL=https://api.openai.com/v1
```

### Voice Mode（CLI）

```yaml
voice:
  record_key: "ctrl+b"
  max_recording_seconds: 120
  auto_tts: false
  silence_threshold: 200
  silence_duration: 3.0
```

用法：

- `/voice on`：启用麦克风模式
- `record_key`：开始 / 停止录音
- `/voice tts`：切换语音播报

完整说明见 `Voice Mode` 文档。

### Streaming

#### CLI Streaming

```yaml
display:
  streaming: true
  show_reasoning: true
```

开启后，响应会 token-by-token 流式显示；若 provider 不支持 streaming，则自动回退到普通展示。

#### Gateway Streaming

```yaml
streaming:
  enabled: true
  transport: edit
  edit_interval: 0.3
  buffer_threshold: 40
  cursor: " ▉"
```

行为：

- 第一批 token 到来时先发消息
- 后续不断编辑同一条消息
- 对不支持编辑的平台，例如 Signal、Email、Home Assistant，会自动关闭 streaming
- 超过平台消息长度限制时，会自动开新消息续写

### Group Chat Session Isolation

```yaml
group_sessions_per_user: true
```

官方说明：

- `true` 是默认且推荐值
- 在 Discord、Telegram、Slack 等共享上下文中，如果平台提供 user ID，则每个用户有自己的 session
- `false` 则回退到单房间共享 session
- DMs 不受影响
- threads 本身始终与父 channel 隔离；若为 `true`，线程内也按参与者继续隔离

### Unauthorized DM Behavior

```yaml
unauthorized_dm_behavior: pair

whatsapp:
  unauthorized_dm_behavior: ignore
```

含义：

- `pair`：默认；拒绝访问，但回一条一次性 pairing code
- `ignore`：静默丢弃 unauthorized DM
- 平台分组中的配置可覆盖全局默认

### Quick Commands

官方完整示例：

```yaml
quick_commands:
  status:
    type: exec
    command: systemctl status hermes-agent
  disk:
    type: exec
    command: df -h /
  update:
    type: exec
    command: cd ~/.hermes/hermes-agent && git pull && pip install -e .
  gpu:
    type: exec
    command: nvidia-smi --query-gpu=name,utilization.gpu,memory.used,memory.total --format=csv,noheader
```

规则：

- 调用方式是 `/status`、`/disk`、`/update`、`/gpu`
- 不经过 LLM，不消耗 tokens
- 30 秒超时
- quick commands 优先级高于 skill commands
- 内建 slash 自动补全表不会展示它们
- 目前只支持 `type: exec`
- 在 CLI 与几乎所有消息平台都能用

### Human Delay

```yaml
human_delay:
  mode: "off"
  min_ms: 800
  max_ms: 2500
```

用于模拟消息平台中的“人类式回复延迟”。

### Code Execution

```yaml
code_execution:
  timeout: 300
  max_tool_calls: 50
```

### Web Search Backends

`web_search`、`web_extract` 与 `web_crawl` 支持 4 种 backend：

```yaml
web:
  backend: firecrawl
```

| Backend | Env Var | Search | Extract | Crawl |
|---|---|---|---|---|
| `Firecrawl` | `FIRECRAWL_API_KEY` | ✔ | ✔ | ✔ |
| `Parallel` | `PARALLEL_API_KEY` | ✔ | ✔ | — |
| `Tavily` | `TAVILY_API_KEY` | ✔ | ✔ | ✔ |
| `Exa` | `EXA_API_KEY` | ✔ | ✔ | — |

官方自动选择逻辑：

- 若未显式设置 `web.backend`，则根据现有 key 自动探测
- 只有 `EXA_API_KEY` 时用 Exa
- 只有 `TAVILY_API_KEY` 时用 Tavily
- 只有 `PARALLEL_API_KEY` 时用 Parallel
- 否则默认 Firecrawl

自托管 Firecrawl：

- 设置 `FIRECRAWL_API_URL`
- 若 server 端 `USE_DB_AUTHENTICATION=false`，则 API key 可选

Parallel search mode：

- `PARALLEL_SEARCH_MODE`
- 可设 `fast`、`one-shot`、`agentic`
- 默认 `agentic`

### Browser

```yaml
browser:
  inactivity_timeout: 120
  command_timeout: 30
  record_sessions: false
  camofox:
    managed_persistence: false
```

说明：

- `inactivity_timeout`：空闲多久后自动关闭 session
- `command_timeout`：浏览器操作的超时，如 screenshot、navigate
- `record_sessions`：是否录 WebM 到 `~/.hermes/browser_recordings/`
- `camofox.managed_persistence`：是否让 Camofox 会话在重启后保留 cookies / logins

### Timezone

```yaml
timezone: "America/New_York"
```

支持任意 IANA timezone。影响：

- logs 时间
- cron 调度
- system prompt 中注入的时间

### Discord

```yaml
discord:
  require_mention: true
  free_response_channels: ""
  auto_thread: true
```

含义：

- `require_mention`：server channel 中默认必须 `@BotName` 才回应；DM 不受影响
- `free_response_channels`：一组 channel IDs，在这些频道里无需 mention 也会回应
- `auto_thread`：在 channel 中被 mention 时自动建 thread，避免污染主频道

### Security（配置视角）

```yaml
security:
  redact_secrets: true
  tirith_enabled: true
  tirith_path: "tirith"
  tirith_timeout: 5
  tirith_fail_open: true
  website_blocklist:
    enabled: false
    domains: []
    shared_files: []
```

含义：

- `redact_secrets`：自动在工具输出与日志中隐藏疑似 key / token / password
- `tirith_enabled`：执行 terminal command 前做 Tirith 扫描
- `tirith_path`：tirith 二进制路径
- `tirith_timeout`：等待 Tirith 的最大秒数
- `tirith_fail_open`：Tirith 不可用时是否仍允许执行

### Website Blocklist

```yaml
security:
  website_blocklist:
    enabled: false
    domains:
      - "*.internal.company.com"
      - "admin.example.com"
      - "*.local"
    shared_files:
      - "/etc/hermes/blocked-sites.txt"
```

作用：

- 阻止 agent 的 web 与 browser 工具访问指定域名
- 适用于 `web_search`、`web_extract`、`browser_navigate` 以及其他 URL-capable 工具

域名规则支持：

- 精确匹配
- 子域通配
- TLD 通配

shared files 规则：

- 每行一个域名规则
- 空行与 `#` 注释忽略
- 文件缺失只会记 warning，不会导致工具整体停用

策略缓存 30 秒。

### Smart Approvals

```yaml
approvals:
  mode: manual
```

取值：

| 模式 | 行为 |
|---|---|
| `manual` | 对 flag 掉的命令一律人工确认 |
| `smart` | 用 auxiliary LLM 判定低风险命令并自动批准，真正危险的命令再升级给用户 |
| `off` | 关闭所有审批检查，相当于 `HERMES_YOLO_MODE=true` |

### Checkpoints

```yaml
checkpoints:
  enabled: true
  max_snapshots: 50
```

详细机制见 `Checkpoints & Rollback`。

### Delegation

```yaml
delegation:
  # model: "google/gemini-3-flash-preview"
  # provider: "openrouter"
  # base_url: "http://localhost:1234/v1"
  # api_key: "local-key"
```

官方说明：

- 默认 subagent 继承父 agent 的 provider 与 model
- 若设置 `delegation.provider` / `delegation.model`，则可把 subagent 路由到更便宜、更快的模型
- 若设置 `delegation.base_url`，则直接调用该自定义 OpenAI-compatible endpoint，并优先于 provider
- 若 `delegation.api_key` 未设置，则只回退到 `OPENAI_API_KEY`

支持的 provider 包括：

- `openrouter`
- `nous`
- `copilot`
- `zai`
- `kimi-coding`
- `minimax`
- `minimax-cn`

### Clarify

```yaml
clarify:
  timeout: 120
```

用于控制等待用户澄清的超时时间。

### Context Files（SOUL.md、AGENTS.md 等）

官方把上下文文件分成两类：

| 文件 | 作用 | 范围 |
|---|---|---|
| `SOUL.md` | 主 agent identity，位于 system prompt 槽位 #1 | `~/.hermes/SOUL.md` 或 `$HERMES_HOME/SOUL.md` |
| `.hermes.md` / `HERMES.md` | 项目指令，最高优先级 | 向上走到 git root |
| `AGENTS.md` | 项目级指令、代码规范 | 递归目录遍历 |
| `CLAUDE.md` | Claude Code 上下文文件 | 仅工作目录 |
| `.cursorrules` | Cursor IDE 规则 | 仅工作目录 |
| `.cursor/rules/*.mdc` | Cursor rule files | 仅工作目录 |

官方规则：

- `SOUL.md` 总是独立加载
- 若缺失或为空，会回退到内建默认 identity
- 项目 context files 只加载一种类型，优先级顺序是：`.hermes.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`
- 但 `AGENTS.md` 是分层的，子目录下若也有，会一起合并
- 所有 context files 最多读取 20,000 字符，并带智能截断

### Working Directory

默认工作目录：

| 场景 | 默认值 |
|---|---|
| CLI | 你运行命令时所在目录 |
| Messaging gateway | 家目录 `~`，可用 `MESSAGING_CWD` 覆盖 |
| Docker / Singularity / Modal / SSH | 容器或远程机内的用户家目录 |

覆盖方式：

```bash
MESSAGING_CWD=/home/myuser/projects
TERMINAL_CWD=/workspace
```

---

## 第 8 章：Security

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/security`

### 这一章讲什么

官方把 Hermes 的安全模型描述为一套 defense-in-depth 分层体系。本页覆盖的安全边界包括：

- command approval
- container isolation
- messaging platform user authorization
- MCP credential handling
- context file injection protection
- 以及生产部署最佳实践

### 总览

官方列出的 7 层安全模型：

1. User authorization
2. Dangerous command approval
3. Container isolation
4. MCP credential filtering
5. Context file scanning
6. Cross-session isolation
7. Input sanitization

具体含义：

- user authorization：控制谁能和 bot 说话
- dangerous command approval：对破坏性操作做人类在环审批
- container isolation：依靠 Docker / Singularity / Modal 等沙箱做运行隔离
- MCP credential filtering：对子进程环境变量做过滤
- context file scanning：检查项目文件中的 prompt injection
- cross-session isolation：不同 session 不能互相读状态；cron job 路径还做了 path traversal 加固
- input sanitization：terminal backend 中 working directory 参数有 allowlist 校验，避免 shell injection

### Dangerous Command Approval

在执行任何命令前，Hermes 会先把它和一份 curated dangerous patterns 列表对比。若匹配，则要求用户显式批准。

#### Approval Modes

通过 `~/.hermes/config.yaml` 中的 `approvals.mode` 设置：

```yaml
approvals:
  mode: manual
  timeout: 60
```

| 模式 | 行为 |
|---|---|
| `manual`（默认） | 所有危险命令都询问用户 |
| `smart` | 用 auxiliary LLM 评估风险。低风险自动批准，真正危险自动拒绝，不确定则升级为人工确认 |
| `off` | 彻底关闭审批；等价于 `--yolo` |

官方警告：

- `approvals.mode: off` 会关闭所有安全提示
- 只应用于 CI/CD、容器等可信环境

#### YOLO Mode

YOLO mode 会跳过当前 session 的全部危险命令审批。可通过三种方式开启：

1. CLI 参数：`hermes --yolo` 或 `hermes chat --yolo`
2. Slash command：`/yolo`
3. 环境变量：`HERMES_YOLO_MODE=1`

`/yolo` 是一个 toggle。官方示例：

```text
> /yolo
  ⚡ YOLO mode ON — all commands auto-approved. Use with caution.

> /yolo
  ⚠ YOLO mode OFF — dangerous commands will require approval.
```

官方说明：

- CLI 与 gateway sessions 都支持 YOLO mode
- 底层是通过检查 `HERMES_YOLO_MODE` 环境变量实现的

#### Approval Timeout

危险命令审批提示出现后，用户有一段可配置时间回应；超时默认拒绝，也就是 fail-closed。

```yaml
approvals:
  timeout: 60
```

#### 触发审批的模式

官方列出会触发审批的模式如下：

| Pattern | 说明 |
|---|---|
| `rm -r` / `rm --recursive` | 递归删除 |
| `rm ... /` | 在根路径下删除 |
| `chmod 777/666` / `o+w` / `a+w` | 给 world / other 可写权限 |
| `chmod --recursive` unsafe perms | 递归开放危险权限 |
| `chown -R root` / `chown --recursive root` | 递归 chown 到 root |
| `mkfs` | 格式化文件系统 |
| `dd if=` | 磁盘复制 |
| `> /dev/sd` | 往块设备写数据 |
| `DROP TABLE/DATABASE` | SQL DROP |
| `DELETE FROM` without WHERE | 无 WHERE 的 SQL DELETE |
| `TRUNCATE TABLE` | SQL TRUNCATE |
| `> /etc/` | 覆盖系统配置 |
| `systemctl stop/disable/mask` | 停止或禁用系统服务 |
| `kill -9 -1` | 杀掉所有进程 |
| `pkill -9` | 强制 kill 进程 |
| fork bomb patterns | fork bomb |
| `bash -c` / `sh -c` / `zsh -c` / `ksh -c` | 通过 `-c` 执行 shell 命令 |
| `python -e` / `perl -e` / `ruby -e` / `node -c` | 通过 `-e` / `-c` 执行脚本 |
| `curl ... \| sh` / `wget ... \| sh` | 将远程内容 pipe 进 shell |
| `bash <(curl ...)` / `sh <(wget ...)` | 通过 process substitution 执行远程脚本 |
| `tee` 到 `/etc/`、`~/.ssh/`、`~/.hermes/.env` | 覆盖敏感文件 |
| `>` / `>>` 到上述敏感位置 | 重定向覆盖敏感文件 |
| `xargs rm` | 用 xargs 批量删 |
| `find -exec rm` / `find -delete` | 用 find 做破坏性动作 |
| `cp` / `mv` / `install` 到 `/etc/` | 改系统配置 |
| `sed -i` / `sed --in-place` on `/etc/` | 原地改系统配置 |
| `pkill` / `killall` hermes/gateway | 防止 agent 自杀 |
| `gateway run` with `&` / `disown` / `nohup` / `setsid` | 防止脱离服务管理器启动 gateway |

官方还给出一个重要例外：

- 若 terminal backend 是 `docker`、`singularity`、`modal` 或 `daytona`
- 则 dangerous command checks 会被跳过
- 因为容器 / sandbox 本身就是安全边界

#### CLI 中的审批流程

在交互式 CLI 中，危险命令会弹出内联审批提示：

```text
  ⚠️  DANGEROUS COMMAND: recursive delete
      rm -rf /tmp/old-project

      [o]nce  |  [s]ession  |  [a]lways  |  [d]eny

      Choice [o/s/a/D]:
```

四种选项：

- `once`：只批准这一次
- `session`：本 session 内同类模式都批准
- `always`：加入永久 allowlist
- `deny`：拒绝，且为默认值

#### Gateway / Messaging 中的审批流程

在消息平台中，agent 会把危险命令细节发到聊天里，等待用户回复：

- 回复 `yes`、`y`、`approve`、`ok`、`go`：批准
- 回复 `no`、`n`、`deny`、`cancel`：拒绝

官方说明：

- gateway 运行时会自动设置 `HERMES_EXEC_ASK=1`

#### Permanent Allowlist

选择 “always” 批准的命令模式会写进 `~/.hermes/config.yaml`：

```yaml
command_allowlist:
  - rm
  - systemctl
```

这些模式之后在所有 session 中都会被静默批准。

官方 tip：

- 可用 `hermes config edit` 定期审查或删除 allowlist 中的条目

### User Authorization（Gateway）

当 Hermes 以消息 gateway 运行时，它会用分层授权系统控制谁可以和 bot 交互。

#### Authorization Check Order

官方 `_is_user_authorized()` 的检查顺序：

1. 每平台 allow-all flag
2. DM pairing approved list
3. 平台特定 allowlist
4. 全局 allowlist
5. 全局 allow-all
6. 默认拒绝

#### Platform Allowlists

在 `~/.hermes/.env` 中可配置：

```bash
TELEGRAM_ALLOWED_USERS=123456789,987654321
DISCORD_ALLOWED_USERS=111222333444555666
WHATSAPP_ALLOWED_USERS=15551234567
SLACK_ALLOWED_USERS=U01ABC123

GATEWAY_ALLOWED_USERS=123456789

DISCORD_ALLOW_ALL_USERS=true
GATEWAY_ALLOW_ALL_USERS=true
```

官方警告：

- 如果没有配置任何 allowlist，且没有设 `GATEWAY_ALLOW_ALL_USERS`
- 那么默认所有用户都被拒绝
- gateway 启动时会打印相应 warning

#### DM Pairing System

官方提供一套基于 code 的 pairing 机制，使你不用提前知道所有 user IDs。

流程：

1. 未知用户给 bot 发 DM
2. bot 回复一个 8 字符 pairing code
3. bot owner 在 CLI 中执行批准
4. 该用户被永久批准访问该平台

控制 unauthorized DMs 的处理方式：

```yaml
unauthorized_dm_behavior: pair

whatsapp:
  unauthorized_dm_behavior: ignore
```

含义：

- `pair`：默认，回 pairing code
- `ignore`：静默忽略
- 平台分组可覆盖全局值

安全特性：

| 特性 | 细节 |
|---|---|
| Code format | 8 字符，使用 32 字符不易混淆字母表，不含 `0/O/1/I` |
| Randomness | 使用 `secrets.choice()` |
| Code TTL | 1 小时 |
| Rate limiting | 每用户 10 分钟内最多 1 次请求 |
| Pending limit | 每平台最多 3 个 pending code |
| Lockout | 5 次失败审批后锁 1 小时 |
| File security | pairing 文件一律 `chmod 0600` |
| Logging | code 不会打印到 stdout |

CLI 命令：

```bash
hermes pairing list
hermes pairing approve telegram ABC12DEF
hermes pairing revoke telegram 123456789
hermes pairing clear-pending
```

存储位置：

- `~/.hermes/pairing/{platform}-pending.json`
- `~/.hermes/pairing/{platform}-approved.json`
- `~/.hermes/pairing/_rate_limits.json`

### Container Isolation

当使用 `docker` terminal backend 时，Hermes 会对每个容器应用一组严格的安全加固。

#### Docker Security Flags

官方列出的安全参数：

```python
_SECURITY_ARGS = [
    "--cap-drop", "ALL",
    "--cap-add", "DAC_OVERRIDE",
    "--cap-add", "CHOWN",
    "--cap-add", "FOWNER",
    "--security-opt", "no-new-privileges",
    "--pids-limit", "256",
    "--tmpfs", "/tmp:rw,nosuid,size=512m",
    "--tmpfs", "/var/tmp:rw,noexec,nosuid,size=256m",
    "--tmpfs", "/run:rw,noexec,nosuid,size=64m",
]
```

#### 资源限制

```yaml
terminal:
  backend: docker
  docker_image: "nikolaik/python-nodejs:python3.11-nodejs20"
  docker_forward_env: []
  container_cpu: 1
  container_memory: 5120
  container_disk: 51200
  container_persistent: true
```

#### 文件系统持久化

- `container_persistent: true`：`/workspace` 与 `/root` 会从 `~/.hermes/sandboxes/docker/<task_id>/` 挂载
- `container_persistent: false`：workspace 走 tmpfs，cleanup 后全丢

官方 tip：

- 对生产 gateway，建议用 `docker`、`modal` 或 `daytona`
- 这样 agent 命令与宿主系统分离，也就不再需要 dangerous command approval

官方警告：

- 若把变量放进 `terminal.docker_forward_env`
- 它们会被显式注入到容器
- 容器中的代码可以读取并外传它们

### Terminal Backend 安全对比

| Backend | 隔离 | Dangerous Cmd Check | 最适合 |
|---|---|---|---|
| `local` | 无，直接跑在宿主机 | ✅ | 开发、可信用户 |
| `ssh` | 远端机器 | ✅ | 分离到另一台服务器 |
| `docker` | 容器 | ❌ | 生产 gateway |
| `singularity` | 容器 | ❌ | HPC |
| `modal` | 云 sandbox | ❌ | 可扩展云隔离 |
| `daytona` | 云 workspace | ❌ | 持久化云工作区 |

### Environment Variable Passthrough

官方说明 `execute_code` 与 `terminal` 默认都会从子进程中过滤敏感环境变量，以防 LLM 生成的代码窃取凭证。

但某些 skills 合法地需要访问这些值，因此 Hermes 允许显式 passthrough。

#### 机制一：基于 Skill 的自动 passthrough

当某个 skill 通过 frontmatter 声明 `required_environment_variables` 时，只要该变量在当前环境中真实存在，就会自动加入 passthrough。

示例：

```yaml
required_environment_variables:
  - name: TENOR_API_KEY
    prompt: Tenor API key
    help: Get a key from https://developers.google.com/tenor
```

加载该 skill 后，`TENOR_API_KEY` 会自动穿透到：

- `execute_code`
- `terminal` local
- Docker backend
- Modal backend

官方特别说明：

- 从 v0.5.1 开始，skill passthrough 与 Docker `forward_env` 合并
- skill 声明的 env 不需要再手动写进 `docker_forward_env`

#### 机制二：手动 config passthrough

如果某变量不是由任何 skill 声明的，可在 `config.yaml` 中显式加入：

```yaml
terminal:
  env_passthrough:
    - MY_CUSTOM_KEY
    - ANOTHER_TOKEN
```

#### Credential File Passthrough

有些 skills 需要文件而不只是环境变量，例如 `google_token.json` 之类的 OAuth 文件。可在 skill frontmatter 里声明：

```yaml
required_credential_files:
  - path: google_token.json
    description: Google OAuth2 token (created by setup script)
  - path: google_client_secret.json
    description: Google OAuth2 client credentials
```

Hermes 会检查这些文件是否存在于当前 profile 的 `HERMES_HOME`，并自动注册：

- Docker：只读 bind mount
- Modal：创建 sandbox 时挂载，并在每次命令前同步
- Local：无需额外处理

也可以手动在配置中列：

```yaml
terminal:
  credential_files:
    - google_token.json
    - my_custom_oauth_token.json
```

路径相对于 `~/.hermes/`，在容器中会挂到 `/root/.hermes/`。

#### 各 Sandbox 默认过滤策略

| Sandbox | 默认过滤 | Passthrough Override |
|---|---|---|
| `execute_code` | 阻断名称中含 `KEY`、`TOKEN`、`SECRET`、`PASSWORD`、`CREDENTIAL`、`PASSWD`、`AUTH` 的变量 | ✅ |
| `terminal`（local） | 阻断 Hermes 基础设施相关 secrets | ✅ |
| `terminal`（Docker） | 默认不传宿主机 env | ✅ |
| `terminal`（Modal） | 默认不传宿主机 env / files | ✅ |
| `MCP` | 除安全系统变量与显式配置 `env` 外一律阻断 | ❌，不受 passthrough 影响 |

#### 安全注意事项

- passthrough 只对你或 skill 显式声明的变量生效
- credential files 挂进 Docker 时是只读
- Skills Guard 会在安装前扫描 skill 中可疑的 env 访问模式
- 未设置的变量不会被注册 passthrough
- Hermes 自身的 provider keys、gateway tokens 等基础设施 secrets 不应加入 `env_passthrough`

### MCP Credential Handling

MCP server 子进程会收到一个“经过过滤的环境”，避免意外泄露宿主机 secrets。

#### 安全环境变量

默认只透传：

```text
PATH, HOME, USER, LANG, LC_ALL, TERM, SHELL, TMPDIR
```

以及所有 `XDG_*` 变量。

此外，MCP server 自己在配置中显式声明的 `env` 会被传入：

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_..."
```

#### Credential Redaction

MCP tool 的错误消息在回给 LLM 前会做脱敏，官方列出的模式包括：

- GitHub PAT：`ghp_...`
- OpenAI 风格 key：`sk-...`
- Bearer tokens
- `token=`、`key=`、`API_KEY=`、`password=`、`secret=` 这类参数

#### Website Access Policy

你可以限制 agent 允许访问的网站：

```yaml
security:
  website_blocklist:
    enabled: true
    domains:
      - "*.internal.company.com"
      - "admin.example.com"
    shared_files:
      - "/etc/hermes/blocked-sites.txt"
```

被 blocked 的 URL 会直接返回 policy 错误。该 blocklist 会作用于：

- `web_search`
- `web_extract`
- `browser_navigate`
- 以及其他能处理 URL 的工具

#### SSRF Protection

所有 URL-capable tools 都会做 URL 校验，以防 SSRF。官方列出的被阻止目标包括：

- 私网：`10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16`
- Loopback：`127.0.0.0/8`、`::1`
- Link-local：`169.254.0.0/16`
- CGNAT：`100.64.0.0/10`
- Cloud metadata hostnames：`metadata.google.internal`、`metadata.goog`
- 以及保留、多播、未指定地址

官方说明：

- SSRF protection 永远开启，不能关闭
- DNS 失败按 blocked 处理，采用 fail-closed
- redirect 链每一跳都会重新校验

#### Tirith 预执行安全扫描

Hermes 集成了 [tirith](https://github.com/sheeki03/tirith)，在命令执行前做内容级扫描，以识别单纯模式匹配发现不了的风险，例如：

- 同形异义域名欺骗
- `curl | bash`、`wget | sh`
- terminal injection attacks

Tirith 会在首次使用时自动从 GitHub releases 安装，并校验 SHA-256；若本机有 cosign，还会做 provenance verification。

配置：

```yaml
security:
  tirith_enabled: true
  tirith_path: "tirith"
  tirith_timeout: 5
  tirith_fail_open: true
```

说明：

- `tirith_fail_open: true` 时，tirith 不可用或超时时仍允许命令继续执行
- 在高安全环境里可设为 `false`
- tirith 的结论会整合进 approval flow，连同 severity、title、description、safer alternatives 一起展示给用户
- 默认选项仍然是 deny

#### Context File Injection Protection

Hermes 会在把 context files 纳入 system prompt 前先扫描，防止 prompt injection。检查内容包括：

- 指示 agent 忽略先前指令
- 含可疑关键字的隐藏 HTML 注释
- 诱导读取 `.env`、`credentials`、`.netrc`
- 通过 `curl` 外传凭证
- 不可见 Unicode 字符，如 zero-width spaces、bidirectional overrides

被阻止的文件会显示类似：

```text
[BLOCKED: AGENTS.md contained potential prompt injection (prompt_injection). Content not loaded.]
```

### 生产部署最佳实践

#### Gateway Deployment Checklist

官方给出 10 条检查表：

1. 明确设置 allowlists，不要在生产里开 `GATEWAY_ALLOW_ALL_USERS=true`
2. 使用 container backend，如 `terminal.backend: docker`
3. 收紧 CPU、内存、磁盘限制
4. 用 `~/.hermes/.env` 安全保存 API keys，并设置正确权限
5. 优先启用 DM pairing，而不是硬编码全部 user IDs
6. 定期审计 `command_allowlist`
7. 设置 `MESSAGING_CWD`，不要让 agent 在敏感目录工作
8. 不要用 root 运行 gateway
9. 监控 `~/.hermes/logs/` 中的未授权访问尝试
10. 经常运行 `hermes update`

#### 保护 API Keys

官方示例：

```bash
chmod 600 ~/.hermes/.env
```

同时建议：

- 给不同服务使用不同 keys
- 永远不要把 `.env` 提交进版本控制

#### 网络隔离

若要最大化安全，官方建议把 gateway 跑在单独机器或 VM 上：

```yaml
terminal:
  backend: ssh
  ssh_host: "agent-worker.local"
  ssh_user: "hermes"
  ssh_key: "~/.ssh/hermes_agent_key"
```

这样可将消息连接面与命令执行面物理或网络隔离开来。
