---
title: 第四卷：Messaging Platforms
---

# Hermes Agent 中文橙皮书

## 第四卷：Messaging Platforms

说明：

- 本卷严格基于 Hermes Agent 官方文档 `Messaging Platforms` 分组页面整理。
- 章节顺序与官方侧边栏保持一致。
- 因本卷平台数量较多，最初按批次整理；当前版本已补齐本卷全部章节。
- 当前已完成：
  - `user-guide/messaging/index`
  - `user-guide/messaging/telegram`
  - `user-guide/messaging/discord`
  - `user-guide/messaging/slack`
  - `user-guide/messaging/whatsapp`
  - `user-guide/messaging/signal`
  - `user-guide/messaging/email`
  - `user-guide/messaging/sms`
  - `user-guide/messaging/homeassistant`
  - `user-guide/messaging/mattermost`
  - `user-guide/messaging/matrix`
  - `user-guide/messaging/dingtalk`
  - `user-guide/messaging/feishu`
  - `user-guide/messaging/wecom`
  - `user-guide/messaging/bluebubbles`
  - `user-guide/messaging/open-webui`
  - `user-guide/messaging/webhooks`

---

## 第 1 章：Messaging Gateway

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging`

### 这一章讲什么

官方把 Messaging Gateway 定义为一个统一后台进程。它可以同时连接多个消息平台，并负责：

- 接收消息
- 做会话路由与会话持久化
- 运行 cron scheduler
- 投递定时任务结果
- 投递语音消息

支持的平台总表包括：

- Telegram
- Discord
- Slack
- WhatsApp
- Signal
- SMS
- Email
- Home Assistant
- Mattermost
- Matrix
- DingTalk
- Feishu / Lark
- WeCom
- BlueBubbles（iMessage）
- 浏览器

官方还单独提醒：

- 语音相关完整能力请看 `Voice Mode`
- 实战配置可以看 `Use Voice Mode with Hermes`

### Platform Comparison

官方给了一张能力矩阵，比较维度包括：

- Voice
- Images
- Files
- Threads
- Reactions
- Typing
- Streaming

其中说明如下：

- `Voice`：TTS 回复和 / 或语音消息转写
- `Images`：发送 / 接收图片
- `Files`：发送 / 接收文件
- `Threads`：线程式会话
- `Reactions`：emoji reactions
- `Typing`：处理中显示 typing indicator
- `Streaming`：通过编辑消息实现渐进式更新

从矩阵上看：

- Discord、Slack、Feishu/Lark 的能力最完整
- Telegram 也支持 Voice / Images / Files / Threads / Typing / Streaming
- SMS 与 Home Assistant 的交互能力最少

### Architecture

官方结构说明：

- 每个平台 adapter 负责接收消息
- 消息先进入按 chat 划分的 session store
- 再交给 `AIAgent` 处理
- gateway 同时每 60 秒 tick 一次 cron scheduler

### Quick Setup

最简单的配置方法是：

```bash
hermes gateway setup
```

这个交互式向导会：

- 让你用方向键选择平台
- 显示哪些平台已配置
- 写入配置
- 最后提供启动 / 重启 gateway 的选项

### Gateway Commands

```bash
hermes gateway
hermes gateway setup
hermes gateway install
sudo hermes gateway install --system
hermes gateway start
hermes gateway stop
hermes gateway status
hermes gateway status --system
```

官方定义：

- `hermes gateway`：前台运行
- `install`：安装服务
- `--system`：Linux 下安装开机自启 system service
- `start/stop/status`：管理默认服务

### Chat Commands（消息平台内）

官方列出了网关内可用的统一命令：

- `/new` 或 `/reset`
- `/model [provider:model]`
- `/provider`
- `/personality [name]`
- `/retry`
- `/undo`
- `/status`
- `/stop`
- `/approve`
- `/deny`
- `/sethome`
- `/compress`
- `/title [name]`
- `/resume [name]`
- `/usage`
- `/insights [days]`
- `/reasoning [level|show|hide]`
- `/voice [on|off|tts|join|leave|status]`
- `/rollback [number]`
- `/background <prompt>`
- `/reload-mcp`
- `/update`
- `/help`
- `/<skill-name>`

### Session Management

#### Session Persistence

官方说明：

- 会话会在多条消息之间持续存在
- agent 会记住上下文

#### Reset Policies

重置策略支持：

- Daily：每天固定时刻重置
- Idle：空闲 N 分钟后重置
- Both：两者谁先触发就按谁

默认值里提到：

- Daily 默认是 `4:00 AM`
- Idle 默认是 `1440 min`

按平台覆盖可以写到 `~/.hermes/gateway.json`：

```json
{
  "reset_by_platform": {
    "telegram": { "mode": "idle", "idle_minutes": 240 },
    "discord": { "mode": "idle", "idle_minutes": 60 }
  }
}
```

### Security

官方把安全默认值讲得很直白：

- 未进入 allowlist 或未完成 DM pairing 的用户，默认全部拒绝
- 这是因为 bot 可能有 terminal access，必须默认保守

允许名单环境变量示例：

```bash
TELEGRAM_ALLOWED_USERS=123456789,987654321
DISCORD_ALLOWED_USERS=123456789012345678
SIGNAL_ALLOWED_USERS=+155****4567,+155****6543
SMS_ALLOWED_USERS=+155****4567,+155****6543
EMAIL_ALLOWED_USERS=trusted@example.com,colleague@work.com
MATTERMOST_ALLOWED_USERS=3uo8dkh1p7g1mfk49ear5fzs5c
MATRIX_ALLOWED_USERS=@alice:matrix.org
DINGTALK_ALLOWED_USERS=user-id-1
GATEWAY_ALLOWED_USERS=123456789,987654321
```

若真要放开所有用户，可以设：

```bash
GATEWAY_ALLOW_ALL_USERS=true
```

但官方明确标注：

- `NOT recommended`

#### DM Pairing

允许替代手工 allowlist 的做法是 pairing code：

```bash
hermes pairing approve telegram XKGH5N7P
hermes pairing list
hermes pairing revoke telegram 123456789
```

官方说明 pairing code：

- 1 小时过期
- 有 rate limit
- 使用密码学随机数生成

### Interrupting the Agent

在 agent 正忙时，只要再发一条消息即可中断。

官方列出的行为：

- 正在跑的 terminal 命令会立即被杀
- 当前工具调用之外的其余工具调用会被取消
- 中断期间发来的多条消息会合并成一个 follow-up prompt
- `/stop` 可只中断、不排队新消息

### Tool Progress Notifications

`~/.hermes/config.yaml` 中可控制展示粒度：

```yaml
display:
  tool_progress: all
  tool_progress_command: false
```

`tool_progress` 可选：

- `off`
- `new`
- `all`
- `verbose`

### Background Sessions

通过：

```bash
/background Check all servers in the cluster and report any that are down
```

可以启动后台任务。

官方解释其特性：

- 隔离 session：和当前聊天上下文完全分离
- 继承同样的 model / provider / toolsets / reasoning 设置
- 非阻塞：主聊天仍可继续
- 结果会自动回到同一聊天

完成消息前缀是：

- `✅ Background task complete`

失败前缀是：

- `❌ Background task failed`

#### Background Process Notifications

如果后台任务内部用 `terminal(background=true)` 拉起长进程，可以通过：

```yaml
display:
  background_process_notifications: all
```

控制推送粒度，可选：

- `all`
- `result`
- `error`
- `off`

环境变量写法：

```bash
HERMES_BACKGROUND_NOTIFICATIONS=result
```

### Service Management

#### Linux（systemd）

```bash
hermes gateway install
hermes gateway start
hermes gateway stop
hermes gateway status
journalctl --user -u hermes-gateway -f

sudo loginctl enable-linger $USER
sudo hermes gateway install --system
sudo hermes gateway start --system
sudo hermes gateway status --system
journalctl -u hermes-gateway -f
```

官方建议：

- laptop / dev box 用 user service
- VPS / headless host 用 system service
- 不建议 user 与 system 两套同时装

多安装实例时：

- 默认 `~/.hermes` 用 `hermes-gateway`
- 其他 `HERMES_HOME` 用 `hermes-gateway-<hash>`

#### macOS（launchd）

```bash
hermes gateway install
hermes gateway start
hermes gateway stop
hermes gateway status
tail -f ~/.hermes/logs/gateway.log
```

生成的 plist 位于：

- `~/Library/LaunchAgents/ai.hermes.gateway.plist`

里面包含：

- `PATH`
- `VIRTUAL_ENV`
- `HERMES_HOME`

官方提醒：

- launchd plist 是静态的
- 如果后来又装了 Node.js、ffmpeg 等新工具，需要重新跑 `hermes gateway install`
- 否则 PATH 不会自动更新

多实例时：

- 默认 `~/.hermes` 用 `ai.hermes.gateway`
- 其他安装用 `ai.hermes.gateway-<suffix>`

---

## 第 2 章：Telegram

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram`

### 集成定位

官方将 Telegram 集成定义为一个完整 conversational bot，支持：

- 文本聊天
- 自动转写 voice memos
- 接收 scheduled task 结果
- 在群组里使用
- 发送图片与文件附件

底层基于：

- `python-telegram-bot`

### Step 1：通过 BotFather 创建 Bot

步骤如下：

1. 打开 `@BotFather`
2. 发送 `/newbot`
3. 设置 display name
4. 设置以 `bot` 结尾的唯一 username
5. 取得 API token

### Step 2：可选的 Bot 自定义

BotFather 常用命令：

| 命令 | 用途 |
|---|---|
| `/setdescription` | 设置“这个 bot 能做什么”说明 |
| `/setabouttext` | 设置 profile page 简介 |
| `/setuserpic` | 上传头像 |
| `/setcommands` | 定义命令菜单 |
| `/setprivacy` | 控制群组消息可见范围 |

### Step 3：Privacy Mode

官方特别强调：

- 这是群组里最常见的坑

若 Privacy Mode 为 ON，bot 只能看到：

- 以 `/` 开头的命令
- 直接回复 bot 消息的消息
- service messages
- bot 是管理员的频道消息

若 Privacy Mode 为 OFF：

- bot 能看到群里的每条消息

### Step 4：找到你的 Telegram User ID

官方推荐两个机器人：

- `@userinfobot`
- `@get_id_bot`

它们会直接返回你的数值型 user ID，例如：

- `123456789`

### Step 5：配置 Hermes

#### Option A：交互式配置

```bash
hermes gateway setup
```

#### Option B：手工配置

```bash
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ALLOWED_USERS=123456789
```

然后启动：

```bash
hermes gateway
```

### Webhook Mode

默认情况下，Telegram 适配器走：

- long polling

官方说明：

- 本地或长期在线部署时，polling 很合适
- 对 Fly.io、Railway、Render 这类“有流量再唤醒”的平台，webhook 更省钱
- 因为 polling 是出站连接，bot 无法休眠
- webhook 则让 Telegram 主动把更新推送到你的 HTTPS 地址

环境变量配置：

```bash
TELEGRAM_WEBHOOK_URL=https://my-app.fly.dev/telegram
# TELEGRAM_WEBHOOK_PORT=8443
# TELEGRAM_WEBHOOK_SECRET=mysecret
```

也可在 `config.yaml` 里写：

```yaml
telegram:
  webhook_mode: true
```

官方补充：

- 只要设置了 `TELEGRAM_WEBHOOK_URL`
- gateway 就会监听 `0.0.0.0:<port>`
- 并自动向 Telegram 注册 webhook
- path 默认从 URL 提取，通常是 `/telegram`

警告点：

- Telegram 要求 webhook 端点具备有效 TLS 证书
- self-signed certificate 会被拒绝

Fly.io 示例还给了：

```bash
fly secrets set TELEGRAM_WEBHOOK_URL=https://my-app.fly.dev/telegram
fly secrets set TELEGRAM_WEBHOOK_SECRET=$(openssl rand -hex 32)
fly deploy
```

### Home Channel

任何 Telegram 聊天中都可以用：

- `/sethome`

把当前 chat 设为 home channel，用于：

- cron 结果
- 其他主动通知

也可以直接设环境变量：

```bash
TELEGRAM_HOME_CHANNEL=-1001234567890
TELEGRAM_HOME_CHANNEL_NAME="My Notes"
```

官方提醒：

- 群聊 `chat_id` 是负数
- 个人 DM `chat_id` 通常与 user ID 相同

### Voice Messages

#### Incoming Voice（STT）

Telegram 上发来的语音消息会自动转写成文本。

官方列出的 provider：

- `local`：本机 `faster-whisper`
- `groq`：需要 `GROQ_API_KEY`
- `openai`：需要 `VOICE_TOOLS_OPENAI_KEY`

#### Outgoing Voice（TTS）

agent 生成的语音会以 Telegram 原生 voice bubble 发送。

官方说明：

- OpenAI / ElevenLabs 原生产出 Opus，不需额外处理
- Edge TTS 默认输出 MP3，需要 `ffmpeg` 转为 Opus

### Group Behavior 与 Mention 触发

文档说明了群组中的触发逻辑。若 `telegram.require_mention` 为 `true`，Hermes 只在这些情况回应：

- 直接 `@mention` bot
- 回复 bot 的消息
- 命中 `telegram.mention_patterns` 中的 regex wake words

配置示例：

```yaml
telegram:
  require_mention: true
  mention_patterns:
    - "^\\s*chompy\\b"
```

关于 `mention_patterns` 的规则：

- 使用 Python regex
- 不区分大小写
- 文本消息和媒体 caption 都会匹配
- 无效 regex 只记 warning，不会让 bot 崩
- 想匹配开头要用 `^`

### Private Chat Topics（Bot API 9.4）

Telegram Bot API 9.4（2026 年 2 月）引入了：

- Private Chat Topics

这允许 bot 在一对一 DM 中直接创建 forum-style topic threads，不需要 supergroup。

官方给的使用场景：

- `Website`：生产站点工作流
- `Research`：论文与文献
- `General`：杂项问题

每个 topic 都有自己隔离的：

- 会话
- 历史
- 上下文

配置位置：

- `platforms.telegram.extra.dm_topics`

示例：

```yaml
platforms:
  telegram:
    extra:
      dm_topics:
      - chat_id: 123456789
        topics:
        - name: General
          icon_color: 7322096
        - name: Website
          icon_color: 9367192
        - name: Research
          icon_color: 16766590
          skill: arxiv
```

Skill binding 的行为是：

- topic 若设置了 `skill`
- 新 session 开始时会自动加载该 skill
- 效果等同于对话一开始先执行一次 `/<skill-name>`

### Group Forum Topic Skill Binding

对于开启 Topics mode 的 supergroup，官方群组 topic 已经天然按 `thread_id` 做 session isolation。文档这一节额外补上：

- 你还可以把特定 group topic 绑定到 skill

配置位置：

- `platforms.telegram.extra.group_topics`

示例：

```yaml
platforms:
  telegram:
    extra:
      group_topics:
      - chat_id: -1001234567890
        topics:
        - name: Engineering
          thread_id: 5
          skill: software-development
        - name: Research
          thread_id: 12
          skill: arxiv
        - name: General
          thread_id: 1
```

官方还列出 DM Topics 与 Group Topics 的差异：

- 配置键分别是 `extra.dm_topics` / `extra.group_topics`
- DM topic 可由 Hermes 经 API 自动创建
- Group topic 通常要管理员先在 Telegram UI 中建好
- DM topic 缺少 `thread_id` 时可自动回填
- Group topic 的 `thread_id` 需要手动设
- `icon_color` / `icon_custom_emoji_id` 只适用于 DM topics

查 `thread_id` 的方法：

- 打开 Telegram Web / Desktop 里的 topic URL
- 例如 `https://t.me/c/1234567890/5`
- 最后一个数字 `5` 就是 `thread_id`

### 其他 Telegram 说明

文档后面还补了两点：

- Telegram 现在要求 bot 提供 privacy policy，可用 BotFather 的 `/setprivacy_policy`
- Bot API 9.4 对 Private Chat Topics 的支持时间点是 2026 年 2 月

### Restricted Network / Proxy / Fallback IP

对于受限网络，文档提供了代理配置：

```bash
export HTTPS_PROXY=http://proxy.example.com:8080
hermes gateway
```

或写到 `.env`：

```bash
HTTPS_PROXY=http://proxy.example.com:8080
```

它会同时作用于：

- 主传输
- 所有 fallback IP transport

若需要手工指定 fallback IP：

```bash
TELEGRAM_FALLBACK_IPS=149.154.167.220,149.154.167.221
```

或：

```yaml
platforms:
  telegram:
    extra:
      fallback_ips:
        - "149.154.167.220"
```

官方说明：

- 通常不必手工设置
- DoH 自动发现已能覆盖多数场景
- 只有当 DoH 也被封锁时，才需要显式写 `TELEGRAM_FALLBACK_IPS`

### Troubleshooting

文档尾部列出的典型问题包括：

- 语音消息未转写：检查 `faster-whisper` 或 `GROQ_API_KEY` / `VOICE_TOOLS_OPENAI_KEY`
- 语音回复是普通文件不是 bubble：安装 `ffmpeg`
- Bot token 无效或被撤销：重新在 BotFather 里生成并更新 `.env`

---

## 第 3 章：Discord

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/discord`

### 集成定位

官方将 Discord 集成定义为一个完整 bot，支持：

- DM
- 服务器频道
- 文本
- voice messages
- file attachments
- slash commands

所有消息都走完整 Hermes pipeline：

- tools
- memory
- reasoning

### How Hermes Behaves

官方先解释 Hermes 进服务器后的默认行为：

| 场景 | 行为 |
|---|---|
| DMs | 每条都回，不需要 `@mention` |
| Server channels | 默认只有 `@mention` 时才回 |
| Free-response channels | 可通过 `DISCORD_FREE_RESPONSE_CHANNELS` 设为免 mention |

若想全局关闭 mention 限制：

```bash
DISCORD_REQUIRE_MENTION=false
```

### Discord Gateway Model

官方强调 Discord 适配器不是无状态 webhook，而是完整 messaging gateway。每条消息都要经过：

1. 授权检查（`DISCORD_ALLOWED_USERS`）
2. mention / free-response 检查
3. session lookup
4. transcript loading
5. 正常 agent 执行
6. 响应投递

### Interrupts and Concurrency

Hermes 按 session key 跟踪运行中的 agent。

默认 `group_sessions_per_user: true` 时：

- 同一频道内 Alice 中断自己的任务，不会影响 Bob
- Bob 也不会继承 Alice 的历史

若设为 `false`：

- 整个频道 / thread 共享一个运行槽位
- 不同人的后续消息会互相中断或排队

### Step 1：Create a Discord Application

步骤：

1. 打开 Discord Developer Portal
2. 点击 `New Application`
3. 输入应用名
4. 创建

官方提醒：

- `Application ID` 后面还要拿来构造 invite URL

### Step 2：Create the Bot

在左侧点 `Bot`，Discord 会自动为应用创建 bot user。

Authorization Flow 下建议：

- `Public Bot` 开启
- `Require OAuth2 Code Grant` 关闭

若想做 private bot：

- 也可以把 `Public Bot` 关掉
- 但这样就不能走 Discord 提供的默认 invite link
- 需要用手工 URL

### Step 3：Enable Privileged Gateway Intents

官方把这一步定义为：

- 整个配置里最关键的一步

三个 intents：

| Intent | 作用 | 是否必需 |
|---|---|---|
| Presence Intent | 看在线状态 | 可选 |
| Server Members Intent | 读取成员列表、解析用户名 | 必需 |
| Message Content Intent | 读取消息正文 | 必需 |

没有 `Message Content Intent`：

- bot 收到事件但看不到正文

没有 `Server Members Intent`：

- bot 无法正确解析 allowlist 中的用户

官方还指出：

- 这几乎是 Discord bot“在线但完全不回复”的头号原因

### Step 4：Get the Bot Token

步骤：

1. 在 Bot 页面点击 `Reset Token`
2. 如有 2FA，输入验证码
3. 复制新 token

官方特别提醒：

- token 只显示一次
- 丢了就只能重新 reset
- 不要公开泄露，也不要 commit 到 Git

### Step 5：Generate the Invite URL

#### Option A：Installation Tab（推荐）

要求：

- `Public Bot = ON`

步骤：

1. 打开 `Installation`
2. 开启 `Guild Install`
3. 选择 `Discord Provided Link`
4. Scopes 选 `bot` 和 `applications.commands`
5. 再勾选所需权限

#### Option B：Manual URL

```text
https://discord.com/oauth2/authorize?client_id=YOUR_APP_ID&scope=bot+applications.commands&permissions=274878286912
```

#### 权限

最少需要：

- `View Channels`
- `Send Messages`
- `Embed Links`
- `Attach Files`
- `Read Message History`

推荐再加：

- `Send Messages in Threads`
- `Add Reactions`

官方给的权限整数：

- Minimal：`117760`
- Recommended：`274878286912`

### Step 6：Invite to Your Server

步骤：

1. 打开 invite URL
2. 在下拉框里选服务器
3. 点 Continue / Authorize
4. 完成 CAPTCHA

官方提醒：

- 你需要拥有服务器的 `Manage Server` 权限
- 如果列表里看不到服务器，就让管理员来执行邀请

### Step 7：Find Your Discord User ID

方法：

1. 开 `Developer Mode`
2. 右击自己的用户名
3. 选择 `Copy User ID`

user ID 是类似：

- `284102345871466496`

官方还提醒：

- 打开 Developer Mode 后，也能同样复制 Channel ID / Server ID

### Step 8：Configure Hermes Agent

#### Option A：交互式

```bash
hermes gateway setup
```

#### Option B：手工

```bash
DISCORD_BOT_TOKEN=your-bot-token
DISCORD_ALLOWED_USERS=284102345871466496
```

然后启动：

```bash
hermes gateway
```

### Configuration Reference

官方说 Discord 行为受两处配置控制：

- `~/.hermes/.env`
- `~/.hermes/config.yaml`

且：

- env vars 优先级高于 config

环境变量表中包含：

- `DISCORD_BOT_TOKEN`
- `DISCORD_ALLOWED_USERS`
- `DISCORD_HOME_CHANNEL`
- `DISCORD_HOME_CHANNEL_NAME`
- `DISCORD_REQUIRE_MENTION`
- `DISCORD_FREE_RESPONSE_CHANNELS`

`config.yaml` 里的 `discord:` 配置示例：

```yaml
discord:
  require_mention: true
  free_response_channels: ""
  auto_thread: true
  reactions: true
  ignored_channels: []
```

#### `discord.require_mention`

- 类型：boolean
- 默认：`true`
- 仅影响 server channels
- DMs 永远会回复

#### `discord.free_response_channels`

- 类型：string 或 list
- 默认：空
- 列在这里的 channel 不需要 mention
- 若 thread 的 parent channel 在列表里，该 thread 也自动免 mention

#### `discord.auto_thread`

- 类型：boolean
- 默认：`true`
- 在普通文本频道中被 mention 时，自动创建新 thread 继续对话
- 这样能保持主频道干净，并给每段会话独立历史

#### `discord.ignored_channels`

- 类型：string 或 list
- 默认：`[]`
- 列在这里的 channel 中，bot 即使被 mention 也完全忽略
- 优先级最高

#### `discord.no_thread_channels`

- 类型：string 或 list
- 默认：`[]`
- 当 `auto_thread=true` 时，这些频道改为直接 inline 回复，而不是开新 thread

### Discord Slash Commands 与 Model Picker

官方提到：

- 所有已安装 skill 会自动注册为 Discord slash commands
- 形式如 `/code-review`、`/ascii-art`
- 每个 skill 有一个可选 `args` 参数
- Discord 每个 bot 最多 100 个 application commands
- 多出来的 skill 会被跳过，并写 warning 到日志

`/model` 无参数时，还会弹出交互式下拉选择器：

1. 先选 provider
2. 再选 model

限制：

- 120 秒超时
- 只有 `DISCORD_ALLOWED_USERS` 中的用户能操作

### Home Channel

可以通过：

- 在某个频道执行 `/sethome`

来设置 home channel，用于接收：

- cron 输出
- reminders
- 其他主动通知

### Troubleshooting

官方列出的典型问题包括：

- `Disallowed Intents`：开发者后台没打开所需 intents
- bot 在特定频道看不到消息：bot 角色没有该频道权限
- `403 Forbidden`：缺少必要权限，需要重新邀请或修角色权限
- Bot offline：gateway 没在跑，或 token 不对

---

## 第 4 章：Slack

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/slack`

### 集成定位

Slack 集成基于：

- Socket Mode

官方强调它走的是：

- WebSocket

而不是公开 HTTP endpoint，因此：

- 不需要公网可访问
- 在防火墙后、本机笔记本、私有服务器都能跑

此外文档特别注明：

- Classic Slack Apps（RTM API）在 2025 年 3 月已完全废弃
- Hermes 现在使用现代 `Bolt SDK` + Socket Mode

### Overview

| 项 | 值 |
|---|---|
| Library | `slack-bolt` / `slack_sdk` |
| Connection | WebSocket |
| Auth tokens | Bot Token `xoxb-` + App-Level Token `xapp-` |
| User identification | Slack Member IDs，如 `U01ABC2DEF3` |

### Step 1：Create a Slack App

步骤：

1. 打开 `https://api.slack.com/apps`
2. `Create New App`
3. 选择 `From scratch`
4. 输入 app 名称并选择 workspace
5. `Create App`

### Step 2：Configure Bot Token Scopes

文档列出的 scopes：

- `chat:write`
- `app_mentions:read`
- `channels:history`
- `channels:read`
- `groups:history`
- `im:history`
- `im:read`
- `im:write`
- `users:read`
- `files:write`

可选：

- `groups:read`

官方特别提醒：

- 若缺少 `channels:history` 与 `groups:history`
- bot 在频道里几乎就收不到消息
- 只能在 DMs 工作

### Step 3：Enable Socket Mode

步骤：

1. 进入 `Settings → Socket Mode`
2. 打开 `Enable Socket Mode`
3. 创建一个 App-Level Token
4. 给它加 `connections:write`
5. 复制生成的 `xapp-` token

它就是：

- `SLACK_APP_TOKEN`

### Step 4：Subscribe to Events

文档称这一步是关键，因为它决定 bot 能看见哪些消息。

需添加的 bot events：

| Event | 是否必需 | 用途 |
|---|---|---|
| `message.im` | 是 | 接收 DM |
| `message.channels` | 是 | 接收 public channel 消息 |
| `message.groups` | 推荐 | 接收 private channel 消息 |
| `app_mention` | 是 | 处理 `@mention`，并避免 Bolt SDK 错误 |

官方指出：

- 这是“DM 正常、频道不工作”的头号原因
- 经常是忘了 `message.channels` 或 `message.groups`

### Step 5：Enable the Messages Tab

否则用户会看到：

- `Sending messages to this app has been turned off`

步骤：

1. `Features → App Home`
2. 找到 `Show Tabs`
3. 打开 `Messages Tab`
4. 勾选允许用户从 messages tab 发 slash commands 和消息

### Step 6：Install App to Workspace

步骤：

1. `Settings → Install App`
2. `Install to Workspace`
3. 检查权限并 `Allow`
4. 复制 `xoxb-` 开头的 Bot User OAuth Token

它就是：

- `SLACK_BOT_TOKEN`

官方提醒：

- 若之后改了 scopes 或 event subscriptions
- 必须重新安装 app，变更才会生效

### Step 7：Find User IDs for the Allowlist

Hermes 用的是：

- Slack Member ID

不是用户名、也不是显示名。

查法：

1. 点用户头像或名字
2. `View full profile`
3. 点 `⋮`
4. `Copy member ID`

### Step 8：Configure Hermes

`.env` 示例：

```bash
# Required
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_APP_TOKEN=xapp-your-app-token-here
SLACK_ALLOWED_USERS=U01ABC2DEF3

# Optional
SLACK_HOME_CHANNEL=C01234567890
SLACK_HOME_CHANNEL_NAME=general
```

也可以走：

```bash
hermes gateway setup
```

启动方式：

```bash
hermes gateway
hermes gateway install
sudo hermes gateway install --system
```

### Step 9：Invite the Bot to Channels

Slack bot 不会自动加入频道。必须逐个邀请：

```text
/invite @Hermes Agent
```

### How the Bot Responds

官方把行为分成三类：

| 场景 | 行为 |
|---|---|
| DMs | 每条都回，不需要 mention |
| Channels | 只有被 `@mention` 才回，并且默认在线程中回复 |
| Threads | 在已有 thread 中若被 mention，一样回在原 thread；一旦 thread 中已有活跃会话，后续 thread 回复可不再 mention |

文档特别提醒：

- 在频道里要先 `@mention` bot 才能启动会话
- 一旦 thread 活跃，thread 内后续消息可自然继续
- 线程外不 mention 的消息会被忽略，避免噪音

### Configuration Options

Slack 还支持在 `config.yaml` 中进一步配置。

#### 线程回复模式

| 键 | 默认值 | 说明 |
|---|---|---|
| `platforms.slack.reply_to_mode` | `"first"` | 多段消息的 threading 模式，可为 `off` / `first` / `all` |
| `platforms.slack.extra.reply_in_thread` | `true` | 频道消息是否回在线程里 |
| `platforms.slack.extra.reply_broadcast` | `false` | thread 回复是否广播到主频道，只广播第一段 |

#### Session Isolation

全局配置：

```yaml
group_sessions_per_user: true
```

默认 `true` 时：

- 同一共享频道里不同用户拥有独立 session

若设为 `false`：

- 整个频道共享一个会话
- 上下文、token 成本和 `/reset` 都一起共享

#### Mention & Trigger Behavior

```yaml
slack:
  require_mention: true
  mention_patterns:
    - "hey hermes"
    - "hermes,"
```

官方特别说明：

- Slack 没有 Discord / Telegram 那种 `free_response_channels`
- 频道里依然要求 `@mention` 才能开聊
- 但一旦 thread 中已有会话，后续 thread 回复就不再强制 mention

#### Unauthorized User Handling

```yaml
slack:
  unauthorized_dm_behavior: "pair"
```

可选：

- `"pair"`
- `"ignore"`

也可全局设置：

```yaml
unauthorized_dm_behavior: "pair"
```

平台级配置优先于全局。

#### Voice Transcription

```yaml
stt_enabled: true
```

默认为 `true`，表示进入系统的音频消息先做自动转写，再给 agent 处理。

#### Full Example

官方给了完整例子，组合了：

- `group_sessions_per_user`
- `unauthorized_dm_behavior`
- `stt_enabled`
- `slack.require_mention`
- `platforms.slack.reply_to_mode`
- `platforms.slack.extra.reply_in_thread`
- `platforms.slack.extra.reply_broadcast`

### Home Channel

设置：

```bash
SLACK_HOME_CHANNEL=C01234567890
```

它用于接收：

- scheduled messages
- cron results
- 其他主动通知

查 channel ID 的方法：

1. 右击频道名
2. `View channel details`
3. 滚到底部

前提：

- bot 必须已经被邀请进该频道

### Multi-Workspace Support

Hermes 可以用一个 gateway 同时连多个 Slack workspace。

方法一：环境变量里用逗号分隔多个 bot token：

```bash
SLACK_BOT_TOKEN=xoxb-workspace1-token,xoxb-workspace2-token,xoxb-workspace3-token
SLACK_APP_TOKEN=xapp-your-app-token
```

方法二：在 `config.yaml`：

```yaml
platforms:
  slack:
    token: "xoxb-workspace1-token,xoxb-workspace2-token"
```

另外还支持 OAuth token file：

- `~/.hermes/slack_tokens.json`

格式示例：

```json
{
  "T01ABC2DEF3": {
    "token": "xoxb-workspace-token-here",
    "team_name": "My Workspace"
  }
}
```

官方说明：

- 文件中的 token 会与 `SLACK_BOT_TOKEN` 合并
- 重复 token 会自动去重

---

## 第 5 章：WhatsApp

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/whatsapp`

### 集成定位与风险提示

Hermes 的 WhatsApp 集成基于内建 bridge，底层使用：

- `Baileys`

官方明确写出：

- 这不是官方 WhatsApp Business API
- 而是模拟 WhatsApp Web 会话
- 不需要 Meta developer account
- 也不需要 Business verification

但官方也给了显眼警告：

- 这属于 unofficial API
- 存在小概率账号限制风险

降低风险的建议：

- 给 bot 使用专门的手机号，而不是个人号
- 不要群发 / spam
- 不要主动向从未联系过的人自动外发消息

官方还补充：

- WhatsApp Web 协议会周期性更新
- 若更新导致 bridge 暂时失效，通常要更新 Hermes 并重新配对

### Two Modes

官方给出两种模式：

| 模式 | 说明 | 适用场景 |
|---|---|---|
| Separate bot number | 给 bot 单独一个号码，别人直接发给这个号码 | UX 更干净、多人使用、封号风险更低 |
| Personal self-chat | 用你自己的 WhatsApp，给自己发消息来和 agent 对话 | 快速测试、单人使用 |

### Prerequisites

需要：

- `Node.js v18+` 与 `npm`
- 一台装有 WhatsApp 的手机，用于扫码

官方特别说明：

- 现在的 Baileys bridge 不再依赖本地 Chromium 或 Puppeteer

### Step 1：Run the Setup Wizard

```bash
hermes whatsapp
```

向导会：

1. 问你选 bot mode 还是 self-chat
2. 如有需要安装 bridge 依赖
3. 在终端里显示二维码
4. 等你扫码

扫码步骤：

1. 打开手机 WhatsApp
2. 进入 `Settings → Linked Devices`
3. 点 `Link a Device`
4. 扫终端二维码

配对成功后：

- 向导会确认连接成功
- session 自动保存

若二维码乱码，官方建议：

- 终端至少 60 列宽
- 且要支持 Unicode

### Step 2：Getting a Second Phone Number（Bot Mode）

若走 bot mode，需要一个尚未注册 WhatsApp 的号码。官方列了三种来源：

| 方式 | 成本 | 说明 |
|---|---|---|
| Google Voice | 免费 | 仅美国；通过 Google Voice App 收短信验证 |
| Prepaid SIM | 一次性约 `$5–15` | 通用，激活后长期保号即可 |
| VoIP services | 免费到 `$5/月` | 如 TextNow / TextFree，但部分 VoIP 号会被 WhatsApp 拒绝 |

拿到号码后的步骤：

1. 在手机上安装 WhatsApp 或 WhatsApp Business
2. 用新号码注册
3. 运行 `hermes whatsapp`
4. 用这个账号去扫二维码

### Step 3：Configure Hermes

`.env` 中的核心配置：

```bash
WHATSAPP_ENABLED=true
WHATSAPP_MODE=bot
WHATSAPP_ALLOWED_USERS=15551234567
# WHATSAPP_ALLOWED_USERS=*
# WHATSAPP_ALLOW_ALL_USERS=true
```

官方解释：

- `WHATSAPP_ALLOWED_USERS=*` 等价于 `WHATSAPP_ALLOW_ALL_USERS=true`
- 若想走 pairing 流程，应移除这两个变量

行为控制还可在 `config.yaml` 写：

```yaml
unauthorized_dm_behavior: pair

whatsapp:
  unauthorized_dm_behavior: ignore
```

含义：

- 全局默认是 `pair`
- 对 WhatsApp 单独设为 `ignore` 后，陌生 DM 会被静默忽略，更适合私人号码

启动 gateway：

```bash
hermes gateway
hermes gateway install
sudo hermes gateway install --system
```

### Session Persistence 与 Re-pairing

Baileys session 会保存在：

- `~/.hermes/platforms/whatsapp/session`

官方特别提醒：

- 重启后无需反复扫码
- 该目录包含加密密钥和设备凭据
- 绝不能分享或提交到仓库

若会话失效，可重新执行：

```bash
hermes whatsapp
```

这会生成新二维码并重新建立连接。

### Voice Messages

官方说明 WhatsApp 语音支持包括：

- Incoming：收到 `.ogg` opus 语音后，自动用配置好的 STT provider 转写
- Outgoing：TTS 回复以 MP3 音频附件发送

STT 可选 provider：

- 本地 `faster-whisper`
- Groq Whisper
- OpenAI Whisper

回复前缀默认是：

- `⚕ Hermes Agent`

可在 `config.yaml` 自定义或禁用：

```yaml
whatsapp:
  reply_prefix: ""
```

### Troubleshooting

官方列出的典型问题：

- QR code 不好扫：扩大终端宽度，确认扫码的是正确账号
- QR code 过期：二维码约 20 秒刷新一次，超时就重跑 `hermes whatsapp`
- Session 不持久：检查 `~/.hermes/platforms/whatsapp/session` 是否存在且可写
- 被意外登出：可能是 WhatsApp 长时间无活动自动 unlink，需要重新配对
- Bridge 崩溃或反复重连：重启 gateway、更新 Hermes、必要时重新配对
- macOS 里 launchd 提示 Node.js 不存在：需重新执行 `hermes gateway install` 让 plist 重新快照 PATH
- 收不到消息：检查 `WHATSAPP_ALLOWED_USERS` 是否正确，或临时开 `WHATSAPP_DEBUG=true`
- 给陌生人回 pairing code：可把 `whatsapp.unauthorized_dm_behavior` 改成 `ignore`

### Security

官方强调上线前必须先设访问控制：

- 设定具体的 `WHATSAPP_ALLOWED_USERS`
- 或显式 `*`
- 或 `WHATSAPP_ALLOW_ALL_USERS=true`

若全都不设：

- gateway 会默认拒绝全部消息

其他安全建议：

- `~/.hermes/platforms/whatsapp/session` 视同密码保护
- 建议设权限：`chmod 700 ~/.hermes/platforms/whatsapp/session`
- 最好用单独手机号承载 bot 风险
- 若怀疑泄露，直接去 WhatsApp 的 `Linked Devices` 里解绑

---

## 第 6 章：Signal

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/signal`

### 集成定位

Hermes 通过：

- `signal-cli` daemon 的 HTTP 模式

接入 Signal。

官方描述其通信方式为：

- 入站通过 SSE（Server-Sent Events）实时流式接收
- 出站通过 JSON-RPC 发送

并强调：

- Signal 是隐私取向最强的主流即时通信平台之一
- 默认端到端加密
- 协议开源、元数据最小化

### No New Python Dependencies

这一适配器只用 Hermes 已自带的：

- `httpx`

因此：

- 不需要再额外安装 Python 包
- 只需要在系统层安装 `signal-cli`

### Prerequisites

需要：

- `signal-cli`
- `Java 17+`
- 一个已安装 Signal 的手机号，用来做 linked device

安装示例：

```bash
brew install signal-cli
```

Linux 官方给的是从 GitHub releases 直接下载压缩包并手工解压到 `/opt` 的方式，而不是 apt / snap。

### Step 1：Link Your Signal Account

Signal-cli 的工作模式就是 linked device：

```bash
signal-cli link -n "HermesAgent"
```

然后在手机上：

1. 打开 Signal
2. 进入 `Settings → Linked Devices`
3. 点 `Link New Device`
4. 扫码或输入 URI

### Step 2：Start the signal-cli Daemon

```bash
signal-cli --account +1234567890 daemon --http 127.0.0.1:8080
```

官方建议：

- 把它长期放在后台
- 可用 `systemd`、`tmux`、`screen` 或直接做成服务

检查方法：

```bash
curl http://127.0.0.1:8080/api/v1/check
```

应返回：

- `{"versions":{"signal-cli":...}}`

### Step 3：Configure Hermes

最简单方式：

```bash
hermes gateway setup
```

向导会：

1. 检查 `signal-cli`
2. 询问 HTTP URL
3. 测试连接
4. 询问账号手机号
5. 配置 allowlist 与访问策略

手工配置：

```bash
SIGNAL_HTTP_URL=http://127.0.0.1:8080
SIGNAL_ACCOUNT=+1234567890
SIGNAL_ALLOWED_USERS=+1234567890,+0987654321
SIGNAL_GROUP_ALLOWED_USERS=groupId1,groupId2
SIGNAL_HOME_CHANNEL=+1234567890
```

### Access Control

#### DM Access

官方规则：

1. 设了 `SIGNAL_ALLOWED_USERS`，只允许这些用户
2. 没设 allowlist，陌生 DM 会收到 pairing code
3. 若设 `SIGNAL_ALLOW_ALL_USERS=true`，任何人都可发消息

#### Group Access

由：

- `SIGNAL_GROUP_ALLOWED_USERS`

控制。

行为如下：

- 不设：忽略所有群消息，只响应 DM
- 设具体 group IDs：只监听这些群
- 设成 `*`：bot 所在任意群都响应

### Features

#### Attachments

入站支持：

- 图片：PNG / JPEG / GIF / WebP
- 音频：MP3 / OGG / WAV / M4A
- 文档：PDF / ZIP 等

出站支持：

- 图片：`send_image_file`
- 语音：`send_voice`
- 视频：`send_video`
- 文档：`send_document`

官方说明：

- Signal 协议里不区分 voice message 和普通文件附件
- 都走标准 attachment API
- 双向大小上限都是 100 MB

#### Typing Indicators

- 处理消息时每 8 秒刷新一次 typing indicator

#### Phone Number Redaction

日志里手机号会自动脱敏：

- `+15551234567` → `+155****4567`

#### Note to Self

若你把 signal-cli 挂在自己的手机号上，也可以用：

- Note to Self

和 Hermes 对话。

实现机制：

- 这类消息会作为 `syncMessage.sentMessage` 到达
- adapter 检测消息目标就是 bot 自己的账号
- 当成普通入站消息处理
- 同时用 sent-timestamp 跟踪避免回环

这个模式：

- 不需要额外配置
- 只要 `SIGNAL_ACCOUNT` 与你的号码一致即可

#### Health Monitoring

官方写了自动恢复逻辑：

- 连接掉线时做指数退避重连：`2s → 60s`
- 若 120 秒无活动，会主动 ping signal-cli 检查

### Troubleshooting

常见问题：

- `Cannot reach signal-cli`：daemon 没跑
- 收不到消息：`SIGNAL_ALLOWED_USERS` 没写对，必须是带 `+` 的 E.164
- `signal-cli not found on PATH`：安装或改 PATH
- 连接不断掉：检查 signal-cli 日志与 Java 版本
- 群消息被忽略：配置 `SIGNAL_GROUP_ALLOWED_USERS`
- 谁都不能用：配置 allowlist、pairing 或显式允许所有用户
- 重复消息：确认只有一个 signal-cli 实例在监听

### Security

官方警告：

- 没有 `SIGNAL_ALLOWED_USERS` 或 DM pairing 时，gateway 默认拒绝所有消息

并补充：

- 日志会自动脱敏手机号
- 建议优先用 DM pairing 或显式 allowlist
- 若不需要群支持，就保持群禁用
- Signal 的端到端加密会保护传输中的内容
- `~/.local/share/signal-cli/` 内含账号凭据，必须像密码一样保护

环境变量参考包括：

- `SIGNAL_HTTP_URL`
- `SIGNAL_ACCOUNT`
- `SIGNAL_ALLOWED_USERS`
- `SIGNAL_GROUP_ALLOWED_USERS`
- `SIGNAL_ALLOW_ALL_USERS`
- `SIGNAL_HOME_CHANNEL`

---

## 第 7 章：Email

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/email`

### 集成定位

Hermes 通过标准：

- IMAP
- SMTP

收发邮件。

官方定义它的体验是：

- 给 agent 的邮箱发邮件
- 它会在线程内回复
- 不需要任何专用 bot API 或专用客户端

适用邮箱提供商包括：

- Gmail
- Outlook
- Yahoo
- Fastmail
- 以及任何支持 IMAP/SMTP 的服务

### No External Dependencies

Email adapter 只用 Python 内建：

- `imaplib`
- `smtplib`
- `email`

因此：

- 不需要额外包
- 也不需要外部服务

### Prerequisites

官方建议准备：

- 给 Hermes 单独一个邮箱，不要复用私人邮箱
- 打开 IMAP
- 若邮箱开了 2FA，要准备 app password

#### Gmail

步骤：

1. 开启 2FA
2. 进入 `App Passwords`
3. 新建 App Password
4. 复制这个 16 位密码

#### Outlook / Microsoft 365

步骤：

1. 去 `Security Settings`
2. 开启 2FA
3. 在 Additional security options 里生成 App Password
4. IMAP host 用 `outlook.office365.com`
5. SMTP host 用 `smtp.office365.com`

#### Other Providers

官方建议查本服务商文档确认：

- IMAP host / port，通常 `993` + SSL
- SMTP host / port，通常 `587` + STARTTLS
- 是否需要 app password

### Step 1：Configure Hermes

最简单方式：

```bash
hermes gateway setup
```

手工配置：

```bash
EMAIL_ADDRESS=hermes@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_IMAP_HOST=imap.gmail.com
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_ALLOWED_USERS=your@email.com,colleague@work.com
EMAIL_IMAP_PORT=993
EMAIL_SMTP_PORT=587
EMAIL_POLL_INTERVAL=15
EMAIL_HOME_ADDRESS=your@email.com
```

### Step 2：Start the Gateway

```bash
hermes gateway
hermes gateway install
sudo hermes gateway install --system
```

启动时 Email adapter 会：

1. 测试 IMAP 连接
2. 测试 SMTP 连接
3. 把现有 inbox 全部标记为 `seen`
4. 之后只轮询新邮件

### How It Works

#### Receiving Messages

默认每 15 秒轮询一次 IMAP inbox 里的 UNSEEN 消息。对于每一封新邮件：

- Subject 会作为上下文前缀，如 `[Subject: Deploy to production]`
- 若是 `Re:` 开头的回复，则跳过 subject 前缀
- 附件会缓存到本地
- 图片附件可供 vision tool 使用
- 文档附件可供 file access 使用
- 纯 HTML 邮件会先去标签抽出纯文本
- 自己发给自己的邮件会被过滤，避免回环
- 各类 `noreply` / `mailer-daemon` / `bounce` 以及 bulk / unsubscribe 头的自动邮件会被静默忽略

#### Sending Replies

回复通过 SMTP 发送，并正确维持邮件线程：

- 保留 `In-Reply-To`
- 保留 `References`
- Subject 统一加 `Re:`，但避免出现 `Re: Re:`
- 生成新的 `Message-ID`
- 正文用 UTF-8 纯文本

#### File Attachments

若 agent 响应里写：

- `MEDIA:/path/to/file`

该文件就会作为邮件附件发出。

#### Skipping Attachments

若想完全忽略来信中的附件，可在 `config.yaml`：

```yaml
platforms:
  email:
    skip_attachments: true
```

开启后：

- 附件和 inline parts 会在 payload 解码前直接跳过
- 邮件正文仍正常处理

### Access Control

访问规则和其他平台一致：

1. 设了 `EMAIL_ALLOWED_USERS`：只处理这些发件人
2. 没设 allowlist：陌生发件人收到 pairing code
3. `EMAIL_ALLOW_ALL_USERS=true`：任何人都能发邮件（官方不建议）

官方警告非常明确：

- 一定要配置 `EMAIL_ALLOWED_USERS`
- 否则任何知道邮箱地址的人都可能给 agent 下命令

### Troubleshooting

常见问题：

- `IMAP connection failed`：核对 IMAP host / port，并确认邮箱端已启用 IMAP
- `SMTP connection failed`：核对 SMTP host / port，确认密码是 app password
- 收不到消息：检查 `EMAIL_ALLOWED_USERS` 与 spam folder
- `Authentication failed`：Gmail 必须用 App Password，不能用普通密码
- 重复回复：确认只启动了一个 gateway 实例
- 回复太慢：默认轮询 15 秒，可把 `EMAIL_POLL_INTERVAL=5`

---

## 第 8 章：SMS（Twilio）

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/sms`

### 集成定位

Hermes 通过：

- Twilio API

收发短信。用户给 Twilio 号码发短信，Hermes 再把回复发回去，整体体验与 Telegram / Discord 类似，只是媒介换成标准 SMS。

官方还说明：

- 这套 SMS gateway 与可选的 telephony skill 共用 Twilio 凭据

### Prerequisites

需要：

- Twilio 账号
- 一个支持 SMS 的 Twilio 号码
- 一个可公网访问的服务器，因为 Twilio 要向你的服务器发 webhook
- `aiohttp`，安装方式：

```bash
pip install 'hermes-agent[sms]'
```

### Step 1：Get Your Twilio Credentials

从 Twilio Console 获取：

- `Account SID`
- `Auth Token`
- 以及 E.164 格式的 Twilio 手机号

### Step 2：Configure Hermes

交互式配置：

```bash
hermes gateway setup
```

手工配置：

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
SMS_ALLOWED_USERS=+15559876543,+15551112222
SMS_HOME_CHANNEL=+15559876543
```

### Step 3：Configure Twilio Webhook

在 Twilio Console 中把来信 webhook 设为：

```text
https://your-server:8080/webhooks/twilio
```

HTTP Method：

- `POST`

若本地运行，可用隧道：

```bash
cloudflared tunnel --url http://localhost:8080
ngrok http 8080
```

端口默认：

- `8080`

可改成：

```bash
SMS_WEBHOOK_PORT=3000
```

### Step 4：Start the Gateway

```bash
hermes gateway
```

启动后官方示例日志是：

```text
[sms] Twilio webhook server listening on port 8080, from: +1555***4567
```

### Environment Variables

官方列出的变量包括：

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `SMS_WEBHOOK_PORT`
- `SMS_ALLOWED_USERS`
- `SMS_ALLOW_ALL_USERS`
- `SMS_HOME_CHANNEL`
- `SMS_HOME_CHANNEL_NAME`

### SMS-Specific Behavior

短信渠道有几条平台特有行为：

- 纯文本：Markdown 会被自动剥离
- 1600 字符限制：超长回复会按自然边界拆成多条
- Echo prevention：来自自己 Twilio 号码的消息会被忽略
- Phone number redaction：日志里手机号会脱敏

### Security

官方说明：

- gateway 默认拒绝所有用户
- 需要显式设 allowlist

推荐方式：

```bash
SMS_ALLOWED_USERS=+15559876543,+15551112222
```

若真要开放给所有人：

```bash
SMS_ALLOW_ALL_USERS=true
```

但官方警告：

- SMS 没有内建加密
- 敏感操作不建议走 SMS
- 更安全的选择是 Signal 或 Telegram

### Troubleshooting

官方列出的典型问题：

- 消息到不了：检查 webhook URL 是否正确且公网可达，检查 SID / Auth Token，检查 Twilio Console 日志，检查 allowlist
- 回复发不出去：检查 `TWILIO_PHONE_NUMBER` 是否正确，确认账号里有能发短信的号码，查看 gateway 日志
- 8080 端口冲突：把 `SMS_WEBHOOK_PORT` 改成别的端口，并同步更新 Twilio Console 中的 webhook URL

---

## 第 9 章：Home Assistant

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/homeassistant`

### 集成定位

官方把 Home Assistant 集成定义为：

- 通过 Home Assistant Companion App 的通知回复
- 让 Hermes 以“通知型 agent”方式进入你的家庭自动化体系

典型用途：

- 每日汇报
- 安全提醒
- 设备异常摘要
- 主动推送与后续追问

### 核心前提

需要：

- 一个可正常工作的 Home Assistant 实例
- Home Assistant Companion App（Android / iOS 任一）
- 一个 Long-Lived Access Token
- Hermes 能访问 Home Assistant（本地或远程）

### Setup

官方步骤概括如下：

1. 在 Home Assistant 中创建 Long-Lived Access Token
2. 在手机上安装并登录 Companion App
3. 在 App 中确认 `notify.mobile_app_<device_name>` 这类 notification service 已存在
4. 配置 Hermes

环境变量示例：

```bash
HOMEASSISTANT_URL=http://homeassistant.local:8123
HOMEASSISTANT_TOKEN=your_long_lived_access_token
HOMEASSISTANT_NOTIFY_SERVICE=notify.mobile_app_pixel_9
HOMEASSISTANT_ALLOWED_USERS=alice
HOMEASSISTANT_HOME_CHANNEL=notify.mobile_app_pixel_9
```

官方文档里也给出 `gateway setup` 作为首选方式。

### How It Works

Hermes 向 Home Assistant 调用通知服务时，会在通知里附带：

- 文本正文
- reply action
- 与当前 session 对应的元数据

当你在手机通知里直接回复时，Companion App 会把回复回传到 Home Assistant，再由 Hermes adapter 接回来，继续原会话。

因此这个渠道的体验不是“聊天窗口”，而是：

- 通知
- 回复
- 再通知

### Commands and Behavior

官方说明这个平台主要用于：

- 接收 cron / reminder / background 结果
- 对通知做简短追问

它并不追求 Discord / Telegram 那种完整聊天体验，而是偏：

- push-first
- mobile notification-first

### Access Control

`HOMEASSISTANT_ALLOWED_USERS` 用于限制谁能与 Hermes 交互。

官方保持和其他 gateway adapter 一致的安全原则：

- 未显式允许时，默认拒绝
- 不建议无条件对任何 Home Assistant 用户开放

### Troubleshooting

文档中强调的排查方向包括：

- `HOMEASSISTANT_URL` 是否正确
- Token 是否真的是 Long-Lived Access Token
- `notify.mobile_app_*` service 名称是否填写正确
- Companion App 是否已在 Home Assistant 中正确注册
- Hermes 所在主机是否能访问 Home Assistant

---

## 第 10 章：Mattermost

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/mattermost`

### 集成定位

官方把 Mattermost 集成定义为：

- 面向团队自托管协作环境的 Bot 接入
- 以 WebSocket / event-driven 方式工作
- 在 DMs、channels、threads 里提供 Hermes 的完整 agent 能力

### Step 1：Create a Bot Account

在 Mattermost System Console 中：

1. 创建 Bot Account
2. 记录 Bot Token
3. 决定 bot 将在哪些 team / channel 中可见

### Step 2：Get Connection Details

需要至少准备：

- Mattermost server URL
- Bot token
- 允许交互的 Mattermost user IDs

官方环境变量示例的核心键包括：

```bash
MATTERMOST_URL=https://chat.example.com
MATTERMOST_TOKEN=your_bot_token
MATTERMOST_ALLOWED_USERS=3uo8dkh1p7g1mfk49ear5fzs5c
MATTERMOST_HOME_CHANNEL=town-square
```

### Behavior

官方把交互行为概括为：

- DMs：正常持续会话
- Channels：通常通过 mention 唤醒
- Threads：thread 内继续原会话

它和 Slack / Discord 的设计思路接近：

- 在共享频道中尽量减少噪音
- 在 thread 中维持上下文

### Features

文档明确列到：

- 支持 threads
- 支持 typing indicator
- 支持文件 / 图片附件
- 支持 Home Channel 接收主动通知

### Security

Mattermost 也遵循统一 allowlist 机制：

- `MATTERMOST_ALLOWED_USERS`

只有列出的用户可以交互。官方继续强调：

- 默认拒绝未授权用户

### Troubleshooting

排查重点包括：

- Mattermost URL 是否可达
- bot token 是否有效
- bot 是否已被加入目标 team / channel
- allowed user IDs 是否写的是用户 ID，而不是显示名
- 若频道中无响应，检查 mention / 线程触发方式和 bot 权限

---

## 第 11 章：Matrix

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/matrix`

### 集成定位

Hermes 的 Matrix 集成使用：

- `mautrix`

接入 Matrix homeserver。

官方描述它支持：

- DMs
- rooms
- threads
- 端到端加密房间

并指出：

- 端到端加密支持来自 mautrix 的加密层

### Prerequisites

需要：

- 一个 Matrix 账号
- homeserver URL
- access token

环境变量示例核心键包括：

```bash
MATRIX_HOMESERVER=https://matrix.example.org
MATRIX_ACCESS_TOKEN=your_access_token
MATRIX_ALLOWED_USERS=@alice:matrix.org
MATRIX_HOME_CHANNEL=!roomid:matrix.org
```

### Session Model

官方说明：

- DM 与 room 都可以映射为 Hermes session
- thread 中可继续已有上下文
- Home room 可用来接收 cron / reminders / background 结果

### Encryption

Matrix 页面专门强调了 E2EE 支持。

含义是：

- 若所在房间启用端到端加密
- adapter 会通过 mautrix 的能力参与解密与收发

官方也提醒：

- 这比普通明文房间更复杂
- 初次配置时要特别关注 device trust 与 access token 状态

### Security

访问控制核心仍是：

- `MATRIX_ALLOWED_USERS`

官方保持一贯原则：

- 默认拒绝未授权用户
- 推荐只允许明确的 Matrix IDs

### Troubleshooting

页面中的常见排查点包括：

- homeserver URL 写错
- access token 无效或过期
- room ID / user ID 填写错误
- 加密房间中 device trust / encryption state 不正确

---

## 第 12 章：DingTalk

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/dingtalk`

### 集成定位

官方把 DingTalk 集成定义为：

- 面向钉钉企业环境的消息接入
- 用于在钉钉内与 Hermes 对话、接收通知、接收任务结果

### Setup

核心前提是创建企业内部应用 / 机器人，并取得所需凭据。文档中要求准备的配置包括：

- DingTalk app credentials
- 允许的用户标识
- 可选的 home channel / 接收目标

环境变量名字以 `DINGTALK_` 前缀提供，文档页面围绕：

- app key / app secret
- allowed users
- home channel

来配置。

### Behavior

官方说明该适配器同样纳入统一 gateway：

- 消息进入后进入 Hermes session
- 会话可持续
- cron / background 结果可回发到钉钉

### Security

和其他企业协作平台一样，重点是：

- 只允许明确的 `DINGTALK_ALLOWED_USERS`
- 未授权默认拒绝

### Troubleshooting

页面中主要排查方向是：

- app credentials 是否正确
- 企业机器人是否已在目标组织 / 会话中启用
- allowed users 是否使用了正确的钉钉用户标识

---

## 第 13 章：Feishu / Lark

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/feishu`

### 集成定位

官方把 Feishu / Lark 集成定义为：

- 针对飞书 / Lark 企业协作环境的 bot 接入
- 支持私聊、群聊、线程、主动通知

### Prerequisites

页面要求先创建 Feishu / Lark app，并拿到：

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`

同时配置允许访问的用户及 home channel。

### Setup

可通过：

```bash
hermes gateway setup
```

或手工在 `.env` 中填 `FEISHU_*` 变量。

官方在页面中围绕以下能力展开：

- app 创建与权限申请
- webhook / event subscription
- allowed users
- home channel

### Behavior

文档说明：

- 私聊是最直接的使用方式
- 群组里通常通过 mention 或 thread 方式维持上下文
- Hermes 可将 cron、background 结果回传到指定 Feishu/Lark 目标

### Security

访问控制核心是：

- `FEISHU_ALLOWED_USERS`

与其他平台一样：

- 默认拒绝未授权用户

### Troubleshooting

主要排查点：

- App ID / App Secret 是否正确
- 事件订阅是否已启用
- 目标用户 / 群组标识是否填写正确
- 机器人是否已被加入目标会话

---

## 第 14 章：WeCom

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/wecom`

### 集成定位

官方将 WeCom 集成描述为：

- 面向企业微信（WeCom）的企业协作渠道
- 支持私聊 / 群聊中的 Hermes 对话与通知

### Setup

需要先在企业微信侧创建应用，并准备：

- Corp / Agent 相关凭据
- 允许用户配置
- 可选的 home channel / target

页面使用 `WECOM_*` 环境变量进行配置。

### Behavior

集成后的行为仍遵循统一 gateway 模型：

- 私聊 / 群组消息进入 session
- 会话持续存在
- 结果可主动回推

### Security

官方继续沿用 allowlist 方案：

- `WECOM_ALLOWED_USERS`

并保持默认拒绝策略。

### Troubleshooting

文档侧重排查：

- 企业微信应用凭据是否正确
- 机器人是否已在对应企业环境中启用
- 目标用户标识是否使用了正确字段

---

## 第 15 章：BlueBubbles（iMessage）

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/bluebubbles`

### 集成定位

官方将 BlueBubbles 集成定义为：

- 借助 BlueBubbles bridge，把 Hermes 带入 iMessage

这条链路依赖：

- 一台运行 BlueBubbles Server 的 macOS 主机
- BlueBubbles API

### Prerequisites

需要：

- BlueBubbles Server 已正常运行
- Hermes 可访问其 API
- 配好鉴权令牌与目标会话

文档使用 `BLUEBUBBLES_*` 环境变量配置，如：

- server URL
- API password / token
- allowed users
- home channel

### Behavior

官方说明这一适配器主要面向：

- iMessage 中的个人对话
- 从 iMessage 接收通知和定时结果

同样纳入统一 gateway session 模型。

### Security

核心仍是 allowlist：

- `BLUEBUBBLES_ALLOWED_USERS`

官方继续提醒：

- 未授权默认拒绝
- BlueBubbles bridge 凭据本身也要像密码一样保护

### Troubleshooting

排查点包括：

- BlueBubbles Server 是否在线
- Hermes 是否能访问 API
- 鉴权配置是否正确
- 用户 / 聊天标识是否写对

---

## 第 16 章：Open WebUI

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/open-webui`

### 集成定位

这一页介绍的是：

- 让 Hermes 通过 Open WebUI 暴露为一个聊天入口

官方重点不是“搭一个新 UI”，而是：

- 把 Hermes agent loop 接入 Open WebUI 生态
- 继续保留 Hermes 的工具、会话与平台能力

### Setup

页面要求准备：

- Open WebUI 实例
- 与 Hermes 对接所需的 URL / token / webhook 或 API 配置

并通过 `OPEN_WEBUI_*` 相关配置项接入。

### Behavior

官方说明该集成的定位是：

- 在 WebUI 中以聊天方式使用 Hermes
- 适合本地或团队内部网页入口
- 同样可以连接 Hermes 的其他能力，如 session、tools、cron 输出等

### Security

依旧遵循显式授权原则：

- 对接 Open WebUI 时要确认谁能访问该入口
- 不建议把有终端 / 工具权限的 Hermes 随意暴露到公开 Web 界面

### Troubleshooting

页面重点排查：

- WebUI 与 Hermes 的连接 URL 是否正确
- API / token 是否匹配
- 代理或反向代理是否正确转发

---

## 第 17 章：Webhooks

来源：

- `https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks`

### 集成定位

官方把 Webhooks 定义为一个：

- 通用 HTTP 入口 / 出口
- 用来让任何系统都能把事件推给 Hermes，或让 Hermes 把结果推送出去

这使它成为最通用、最易与现有系统拼接的 adapter。

### Inbound Webhooks

核心思路：

- 外部系统向 Hermes 暴露的 webhook endpoint 发 `POST`
- Hermes 把请求内容映射成用户消息
- 再进入标准 agent session

文档中围绕这些配置展开：

- 监听地址 / 端口
- 路由路径
- 鉴权或 secret
- session key 生成方式
- 允许的来源

### Outbound Delivery

Hermes 也可以把结果主动回发给外部系统。

官方说明这种模式适合：

- 业务系统回调
- 告警系统
- 定时结果推送
- 自定义 automation workflow

### Payload Model

文档强调 Webhooks 的优势是：

- payload 灵活
- 可把原始 JSON、headers、metadata 一并传给 Hermes
- 再由 Hermes 在 prompt 中使用这些上下文

### Security

这一页对安全的强调比多数平台更重：

- 必须配置 secret / 签名校验 / 允许来源
- 默认不应把有工具权限的 agent 公开暴露到无鉴权的公网端点
- 若对接内部系统，仍建议最小权限与最小暴露面

### Operational Notes

官方把它定位成“通用胶水层”，因此推荐场景包括：

- 让 CI / alerting / internal tool 通过 HTTP 触发 Hermes
- 不必为每种系统单独写一个平台 adapter

### Troubleshooting

主要排查方向：

- webhook 路由是否真的被打到
- 反向代理是否正确转发 body 与 headers
- secret / auth 配置是否一致
- 外部系统发来的 payload 是否符合预期
