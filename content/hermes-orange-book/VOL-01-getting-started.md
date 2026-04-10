---
title: 第一卷：Getting Started
---

# Hermes Agent 中文橙皮书

## 第一卷：Getting Started

说明：

- 本卷严格基于 Hermes Agent 官方文档原文整理。
- 命令、配置键、环境变量、工具名、产品名、路径名尽量保留英文原样，避免误译造成歧义。
- 本卷覆盖官方 `Getting Started` 全部 5 篇页面，顺序与官方侧边栏一致。

---

## 第 1 章：快速开始（Quickstart）

来源：

- `https://hermes-agent.nousresearch.com/docs/getting-started/quickstart`

### 这一章讲什么

这一章带你完成 Hermes Agent 的最短上手路径：安装、配置 provider、开始第一次对话，并快速试用终端、斜杠命令、语音、自动化、技能、ACP 和 MCP 等关键能力。官方说法是：从安装到开始聊天，大约 2 分钟。

### 1. 安装 Hermes Agent

运行一行安装命令：

```bash
# Linux / macOS / WSL2
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

Windows 用户说明：

- 原文提示 Windows 用户先安装 `WSL2`
- 然后在 `WSL2` 终端中执行上面的安装命令

安装结束后，重新加载 shell：

```bash
source ~/.bashrc   # 或 source ~/.zshrc
```

### 2. 配置 Provider

安装器会自动帮你配置 LLM provider；如果之后想改，可以使用：

```bash
hermes model       # 选择 LLM provider 和 model
hermes tools       # 配置启用哪些工具
hermes setup       # 一次性重配全部内容
```

其中 `hermes model` 会引导你选择推理 provider。官方列出的 provider 与配置方式如下：

| Provider | 含义 | 配置方式 |
|---|---|---|
| `Nous Portal` | 订阅制、零配置 | 在 `hermes model` 里做 OAuth 登录 |
| `OpenAI Codex` | 使用 ChatGPT OAuth 的 Codex 模型 | 在 `hermes model` 中走 device code 认证 |
| `Anthropic` | 直接使用 Claude 模型 | 在 `hermes model` 中做 Claude Code 认证，或提供 Anthropic API key |
| `OpenRouter` | 在多个模型供应商之间做路由 | 输入 API key |
| `Z.AI` | GLM / Zhipu 托管模型 | 设置 `GLM_API_KEY` 或 `ZAI_API_KEY` |
| `Kimi / Moonshot` | Moonshot 托管的编码与聊天模型 | 设置 `KIMI_API_KEY` |
| `MiniMax` | 国际版 MiniMax 端点 | 设置 `MINIMAX_API_KEY` |
| `MiniMax China` | 中国区 MiniMax 端点 | 设置 `MINIMAX_CN_API_KEY` |
| `Alibaba Cloud` | 通过 DashScope 使用 Qwen | 设置 `DASHSCOPE_API_KEY` |
| `Hugging Face` | 通过统一路由访问 20+ 开源模型 | 设置 `HF_TOKEN` |
| `Kilo Code` | KiloCode 托管模型 | 设置 `KILOCODE_API_KEY` |
| `OpenCode Zen` | 按量付费访问精选模型 | 设置 `OPENCODE_ZEN_API_KEY` |
| `OpenCode Go` | 每月 10 美元的开源模型订阅 | 设置 `OPENCODE_GO_API_KEY` |
| `DeepSeek` | 直接接入 DeepSeek API | 设置 `DEEPSEEK_API_KEY` |
| `GitHub Copilot` | GitHub Copilot 订阅模型 | 在 `hermes model` 中做 OAuth，或设置 `COPILOT_GITHUB_TOKEN` / `GH_TOKEN` |
| `GitHub Copilot ACP` | Copilot ACP agent 后端，本地拉起 `copilot` CLI | 在 `hermes model` 中配置；要求有 `copilot` CLI 且执行过 `copilot login` |
| `Vercel AI Gateway` | 通过 Vercel AI Gateway 做路由 | 设置 `AI_GATEWAY_API_KEY` |
| `Custom Endpoint` | VLLM、SGLang、Ollama 或任意 OpenAI 兼容接口 | 设置 base URL 和 API key |

官方补充说明：

- 你可以随时用 `hermes model` 切换 provider
- 不需要改代码，也不会被锁定在某个 provider
- 配置 `Custom Endpoint` 时，Hermes 会询问上下文窗口大小，并在可能时自动探测
- 上下文长度探测的详细说明在 `integrations/providers` 文档中

### 3. 开始聊天

启动：

```bash
hermes
```

启动后会看到欢迎横幅，显示：

- 当前 model
- 可用 tools
- 可用 skills

然后直接输入消息并回车，例如：

```text
❯ What can you help me with?
```

官方明确说明：Hermes 开箱即用就可访问 web search、文件操作、终端命令等工具。

### 4. 先试几个关键能力

#### 让它使用终端

示例提示：

```text
❯ What's my disk usage? Show the top 5 largest directories.
```

官方说明：agent 会代你运行终端命令并展示结果。

#### 使用 slash commands

输入 `/` 会出现带自动补全的命令下拉。

官方示例包括：

| 命令 | 作用 |
|---|---|
| `/help` | 查看所有可用命令 |
| `/tools` | 查看可用工具 |
| `/model` | 交互式切换模型 |
| `/personality pirate` | 试用趣味 personality |
| `/save` | 保存当前对话 |

#### 多行输入

- 按 `Alt+Enter` 或 `Ctrl+J` 可换行
- 适合粘贴代码或写更长的提示

#### 中断 agent

- 如果 agent 执行太久，可以直接输入一条新消息并回车
- 新消息会中断当前任务，并切换到新指令
- `Ctrl+C` 也可中断

#### 恢复会话

退出后，Hermes 会打印恢复命令：

```bash
hermes --continue    # 恢复最近一次会话
hermes -c            # 短写
```

### 5. 接下来可以继续做什么

#### 配置沙箱终端

为了安全，可将 agent 放进 Docker 容器或远程服务器中运行：

```bash
hermes config set terminal.backend docker    # Docker 隔离
hermes config set terminal.backend ssh       # 远程服务器
```

#### 连接消息平台

官方列举可以从手机或其他界面与 Hermes 对话的平台：

- Telegram
- Discord
- Slack
- WhatsApp
- Signal
- Email
- Home Assistant

交互式配置命令：

```bash
hermes gateway setup
```

#### 添加语音模式

如果想在 CLI 中使用麦克风输入，或在消息平台中用语音回复：

```bash
pip install "hermes-agent[voice]"

# 可选但推荐：本地免费语音转文字
pip install faster-whisper
```

然后在 CLI 中开启：

```text
/voice on
```

官方补充：

- 按 `Ctrl+B` 开始录音
- 用 `/voice tts` 让 Hermes 把回复读出来
- 跨 CLI、Telegram、Discord 与 Discord voice channels 的完整说明见 `Voice Mode`

#### 安排自动化任务

官方示例：

```text
❯ Every morning at 9am, check Hacker News for AI news and send me a summary on Telegram.
```

官方说明：agent 会通过 gateway 设置一个自动运行的 cron job。

#### 浏览并安装 skills

```bash
hermes skills search kubernetes
hermes skills search react --source skills-sh
hermes skills search https://mintlify.com/docs --source well-known
hermes skills install openai/skills/k8s
hermes skills install official/security/1password
hermes skills install skills-sh/vercel-labs/json-render/json-render-react --force
```

官方 tips：

- `--source skills-sh`：搜索公共 `skills.sh` 目录
- `--source well-known`：传文档或站点 URL，从 `/.well-known/skills/index.json` 发现技能
- `--force`：仅在审阅过第三方 skill 后使用。它可以覆盖非危险级别的策略阻止，但不能绕过 `dangerous` 扫描结论

你也可以在聊天中直接使用 `/skills`。

#### 通过 ACP 在编辑器中使用 Hermes

Hermes 可作为 ACP server 运行，供 VS Code、Zed、JetBrains 等 ACP 兼容编辑器接入：

```bash
pip install -e '.[acp]'
hermes acp
```

#### 试用 MCP servers

官方给出的 `~/.hermes/config.yaml` 示例：

```yaml
mcp_servers:
  github:
    command: npx
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_xxx"
```

### 快速参考

| 命令 | 说明 |
|---|---|
| `hermes` | 开始聊天 |
| `hermes model` | 选择 LLM provider 和 model |
| `hermes tools` | 配置每个平台启用哪些工具 |
| `hermes setup` | 完整安装向导，一次配全 |
| `hermes doctor` | 诊断问题 |
| `hermes update` | 升级到最新版本 |
| `hermes gateway` | 启动消息网关 |
| `hermes --continue` | 恢复最近一次会话 |

### 下一步阅读建议

- `CLI Guide`
- `Configuration`
- `Messaging Gateway`
- `Tools & Toolsets`

---

## 第 2 章：安装（Installation）

来源：

- `https://hermes-agent.nousresearch.com/docs/getting-started/installation`

### 这一章讲什么

这一章给出两条路径：

- 一键安装：适合大多数用户
- 手动安装：适合想完全掌控环境的人

官方宣称一键安装通常可在两分钟内完成。

### 快速安装

适用平台：

- Linux
- macOS
- WSL2

命令：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

官方警告：

- 原生 Windows 不受支持
- 请安装 `WSL2`
- 然后在 `WSL2` 内运行上面的安装命令

### 安装器会做什么

安装器会自动处理：

- Python
- Node.js
- `ripgrep`
- `ffmpeg`
- 仓库 clone
- 虚拟环境
- 全局 `hermes` 命令的设置
- LLM provider 配置

安装完成后，你应该已经可以直接开始聊天。

### 安装后怎么做

重新加载 shell，然后启动：

```bash
source ~/.bashrc   # 或: source ~/.zshrc
hermes
```

之后如果只想调整局部设置，可使用：

```bash
hermes model
hermes tools
hermes gateway setup
hermes config set
hermes setup
```

### 先决条件

唯一必需的前置条件是：

- `git`

安装器会自动处理其余依赖：

- `uv`
- `Python 3.11`
- `Node.js v22`
- `ripgrep`
- `ffmpeg`

官方特别说明：

- 这些依赖都不需要手动安装
- 安装器会探测缺失项并自动安装
- 你只需确认 `git --version` 可用

Nix 用户注意：

- 官方提供专门的 `Nix & NixOS Setup`
- 包括 Nix flake、NixOS module 和 container mode

### 手动安装

#### 第 1 步：克隆仓库

```bash
git clone --recurse-submodules https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
```

如果一开始没带 `--recurse-submodules`，执行：

```bash
git submodule update --init --recursive
```

#### 第 2 步：安装 uv 并创建虚拟环境

```bash
# 安装 uv（若尚未安装）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 使用 Python 3.11 创建 venv
uv venv venv --python 3.11
```

官方 tip：

- 你不需要手动激活 venv 才能使用 `hermes`
- 安装入口点时 shebang 会写死到 venv 里的 Python
- 只要后面做了全局软链，就可以直接使用

#### 第 3 步：安装 Python 依赖

```bash
export VIRTUAL_ENV="$(pwd)/venv"
uv pip install -e ".[all]"
```

如果只想装核心 agent，不要 Telegram / Discord / cron 支持：

```bash
uv pip install -e "."
```

官方给出的 extras 列表如下：

| Extra | 增加什么 | 安装命令 |
|---|---|---|
| `all` | 下列全部 | `uv pip install -e ".[all]"` |
| `messaging` | Telegram 与 Discord gateway | `uv pip install -e ".[messaging]"` |
| `cron` | 定时任务 cron 表达式解析 | `uv pip install -e ".[cron]"` |
| `cli` | 安装向导的终端菜单 UI | `uv pip install -e ".[cli]"` |
| `modal` | Modal 云执行后端 | `uv pip install -e ".[modal]"` |
| `tts-premium` | ElevenLabs 高级语音 | `uv pip install -e ".[tts-premium]"` |
| `voice` | CLI 麦克风输入与音频播放 | `uv pip install -e ".[voice]"` |
| `pty` | PTY 终端支持 | `uv pip install -e ".[pty]"` |
| `honcho` | AI-native memory，即 Honcho 集成 | `uv pip install -e ".[honcho]"` |
| `mcp` | Model Context Protocol 支持 | `uv pip install -e ".[mcp]"` |
| `homeassistant` | Home Assistant 集成 | `uv pip install -e ".[homeassistant]"` |
| `acp` | ACP 编辑器集成 | `uv pip install -e ".[acp]"` |
| `slack` | Slack 消息接入 | `uv pip install -e ".[slack]"` |
| `dev` | pytest 与测试工具 | `uv pip install -e ".[dev]"` |

extras 可以组合，例如：

```bash
uv pip install -e ".[messaging,cron]"
```

#### 第 4 步：安装可选 submodule

```bash
# RL 训练后端（可选）
uv pip install -e "./tinker-atropos"
```

官方说明：

- 这些 submodule 都是可选的
- 不装的话，对应 toolset 不会出现

#### 第 5 步：安装 Node.js 依赖（可选）

只有以下场景需要：

- 浏览器自动化
- WhatsApp bridge

```bash
npm install
```

#### 第 6 步：创建配置目录

```bash
mkdir -p ~/.hermes/{cron,sessions,logs,memories,skills,pairing,hooks,image_cache,audio_cache,whatsapp/session}
cp cli-config.yaml.example ~/.hermes/config.yaml
touch ~/.hermes/.env
```

#### 第 7 步：加入 API keys

编辑 `~/.hermes/.env`，至少提供一个 LLM provider key：

```bash
# 至少需要一个 LLM provider：
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# 可选：启用更多工具
FIRECRAWL_API_KEY=fc-your-key
FAL_KEY=your-fal-key
```

也可通过 CLI 设置：

```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-your-key-here
```

#### 第 8 步：把 `hermes` 加到 PATH

```bash
mkdir -p ~/.local/bin
ln -sf "$(pwd)/venv/bin/hermes" ~/.local/bin/hermes
```

如果 `~/.local/bin` 不在 PATH 中，按你的 shell 添加：

```bash
# Bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc

# Zsh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc

# Fish
fish_add_path $HOME/.local/bin
```

#### 第 9 步：选择 Provider

```bash
hermes model
```

#### 第 10 步：验证安装

```bash
hermes version
hermes doctor
hermes status
hermes chat -q "Hello! What tools do you have available?"
```

### 手动安装速查版

官方还给出一份浓缩命令序列：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
git clone --recurse-submodules https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
uv venv venv --python 3.11
export VIRTUAL_ENV="$(pwd)/venv"
uv pip install -e ".[all]"
uv pip install -e "./tinker-atropos"
npm install
mkdir -p ~/.hermes/{cron,sessions,logs,memories,skills,pairing,hooks,image_cache,audio_cache,whatsapp/session}
cp cli-config.yaml.example ~/.hermes/config.yaml
touch ~/.hermes/.env
echo 'OPENROUTER_API_KEY=sk-or-v1-your-key' >> ~/.hermes/.env
mkdir -p ~/.local/bin
ln -sf "$(pwd)/venv/bin/hermes" ~/.local/bin/hermes
hermes doctor
hermes
```

### 故障排查

| 问题 | 解决方案 |
|---|---|
| `hermes: command not found` | 重新加载 shell，如 `source ~/.bashrc`，并检查 PATH |
| `API key not set` | 运行 `hermes model`，或执行 `hermes config set OPENROUTER_API_KEY your_key` |
| 更新后缺少配置 | 先执行 `hermes config check`，再执行 `hermes config migrate` |

官方建议：更多问题直接运行 `hermes doctor`，它会说明缺了什么以及如何修复。

---

## 第 3 章：Nix 与 NixOS 安装（Nix & NixOS Setup）

来源：

- `https://hermes-agent.nousresearch.com/docs/getting-started/nix-setup`

### 这一章讲什么

Hermes Agent 官方附带一个 Nix flake，并提供三种集成层级：

| 层级 | 适合谁 | 你会得到什么 |
|---|---|---|
| `nix run` / `nix profile install` | 任意 Nix 用户（macOS、Linux） | 带齐依赖的预构建二进制，然后继续走标准 CLI 工作流 |
| `NixOS module (native)` | NixOS 服务器部署 | 声明式配置、加固过的 systemd 服务、托管 secrets |
| `NixOS module (container)` | 需要 agent 自我修改的场景 | 除以上内容外，还附带一个可持久化的 Ubuntu 容器，agent 可在其中执行 `apt` / `pip` / `npm install` |

### 它和标准安装有什么不同

官方说明的核心差异：

- 标准 `curl | bash` 安装器会自己管理 Python、Node 和各类依赖
- Nix flake 则完全替代这套过程
- 所有 Python 依赖都作为 Nix derivation，由 `uv2nix` 构建
- `Node.js`、`git`、`ripgrep`、`ffmpeg` 等运行时工具会被包装进二进制的 PATH
- 不需要运行时 `pip`
- 不需要激活 `venv`
- 不需要执行 `npm install`

对非 NixOS 用户：

- 变化只在安装方式
- 后续 `hermes setup`、`hermes gateway install`、编辑配置等流程，和标准安装完全一致

对 NixOS module 用户：

- 生命周期完全不同
- 配置写在 `configuration.nix`
- secrets 通过 `sops-nix` 或 `agenix`
- 服务由 systemd 托管
- CLI 配置命令会被阻止
- 你需要像管理其他 NixOS 服务一样管理 Hermes

### 先决条件

- 需要安装带 flakes 的 Nix
- 官方推荐 [Determinate Nix](https://install.determinate.systems)
- 至少准备一个 LLM provider 的 API key，例如 OpenRouter 或 Anthropic

### 任意 Nix 用户的快速开始

无需 clone，Nix 会自动拉取、构建、运行：

```bash
nix run github:NousResearch/hermes-agent -- setup
nix run github:NousResearch/hermes-agent -- chat

nix profile install github:NousResearch/hermes-agent
hermes setup
hermes chat
```

安装到 profile 后，以下命令会出现在 PATH 中：

- `hermes`
- `hermes-agent`
- `hermes-acp`

官方强调：从这里开始，工作流与标准安装相同。也就是说：

- `hermes setup` 用于选择 provider
- `hermes gateway install` 用于配置 launchd 或 systemd user service
- 配置仍写在 `~/.hermes/`

如果你想从本地 clone 构建：

```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
nix build
./result/bin/hermes setup
```

### NixOS Module

官方 flake 导出了 `nixosModules.default`，用于声明式管理：

- 用户创建
- 目录
- 配置生成
- secrets
- documents
- 服务生命周期

#### 添加 flake input

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    hermes-agent.url = "github:NousResearch/hermes-agent";
  };

  outputs = { nixpkgs, hermes-agent, ... }: {
    nixosConfigurations.your-host = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        hermes-agent.nixosModules.default
        ./configuration.nix
      ];
    };
  };
}
```

#### 最小配置

```nix
{ config, ... }: {
  services.hermes-agent = {
    enable = true;
    settings.model.default = "anthropic/claude-sonnet-4";
    environmentFiles = [ config.sops.secrets."hermes-env".path ];
    addToSystemPackages = true;
  };
}
```

官方解释：执行 `nixos-rebuild switch` 后，系统会：

- 创建 `hermes` 用户
- 生成 `config.yaml`
- 连接 secrets
- 启动 gateway

这里的 gateway 是一个长时间运行的服务，负责把 agent 接到 Telegram、Discord 等消息平台并监听消息。

#### 关于 secrets

如果使用了上面的 `environmentFiles`，官方假定你已经配置好：

- `sops-nix`
- 或 `agenix`

这个文件里至少要有一个 LLM provider key，例如：

```bash
echo "OPENROUTER_API_KEY=sk-or-your-key" | sudo install -m 0600 -o hermes /dev/stdin /var/lib/hermes/env
```

然后在 Nix 中配置：

```nix
services.hermes-agent.environmentFiles = [ "/var/lib/hermes/env" ];
```

#### `addToSystemPackages`

官方特别说明，设为 `true` 会同时做两件事：

1. 把 `hermes` CLI 放进系统 PATH
2. 全局设置 `HERMES_HOME`

这样交互式 CLI 与 gateway service 就能共享：

- sessions
- skills
- cron
- 其他状态

如果不这样做，直接在 shell 里运行 `hermes` 会生成一个独立的 `~/.hermes/`。

#### 验证是否工作正常

```bash
systemctl status hermes-agent
journalctl -u hermes-agent -f
hermes version
hermes config
```

#### 选择部署模式

`container.enable` 控制两种模式：

| | Native | Container |
|---|---|---|
| 运行方式 | 主机上的加固 systemd 服务 | 持久化 Ubuntu 容器，`/nix/store` 绑定挂载 |
| 安全性 | `NoNewPrivileges`、`ProtectSystem=strict`、`PrivateTmp` | 容器隔离，容器内以非特权用户运行 |
| agent 是否能自装包 | 不行，只能用 Nix 提供到 PATH 的工具 | 可以，`apt` / `pip` / `npm` 安装可跨重启保留 |
| 配置面 | 相同 | 相同 |
| 适用场景 | 标准部署、优先安全与可复现 | 需要运行时安装包、需要可变环境、实验性工具 |

启用容器模式：

```nix
{
  services.hermes-agent = {
    enable = true;
    container.enable = true;
  };
}
```

补充说明：

- `container.enable = true` 会默认开启 `virtualisation.docker.enable`
- 如果用 Podman，则设 `container.backend = "podman"`，并把 `virtualisation.docker.enable = false`

### 配置

#### 声明式 `settings`

`settings` 接受任意 attrset，并渲染为 `config.yaml`。

官方说明：

- 支持深度合并
- 可拆到多个 Nix 文件里定义
- 多份定义会通过 `lib.recursiveUpdate` 合并

官方示例：

```nix
# base.nix
services.hermes-agent.settings = {
  model.default = "anthropic/claude-sonnet-4";
  toolsets = [ "all" ];
  terminal = { backend = "local"; timeout = 180; };
};

# personality.nix
services.hermes-agent.settings = {
  display = { compact = false; personality = "kawaii"; };
  memory = { memory_enabled = true; user_profile_enabled = true; };
};
```

进一步说明：

- Nix 声明的键优先级高于磁盘上已有的 `config.yaml`
- 但 Nix 没声明到的用户自加键会被保留
- 例如 `skills.disabled`、`streaming.enabled` 之类，如果 Nix 没覆盖，仍会保留下来

#### model 命名说明

- `settings.model.default` 应写成 provider 期望的 model 标识
- 若使用 OpenRouter，常见值如 `"anthropic/claude-sonnet-4"`、`"google/gemini-3-flash"`
- 若直接接 Anthropic 或 OpenAI，则设置 `settings.model.base_url` 为其 API 地址，并使用原生 model ID
- 当没有 `base_url` 时，Hermes 默认走 OpenRouter

#### 发现可用配置键

```bash
nix build .#configKeys && cat result
```

官方说明：这会列出 Python `DEFAULT_CONFIG` 中抽出的所有叶子级配置键。现有 `config.yaml` 的结构可以直接映射到 `settings` attrset。

#### 全量示例

官方给出一个常见自定义项较全的示例：

```nix
{ config, ... }: {
  services.hermes-agent = {
    enable = true;
    container.enable = true;

    settings = {
      model = {
        base_url = "https://openrouter.ai/api/v1";
        default = "anthropic/claude-opus-4.6";
      };
      toolsets = [ "all" ];
      max_turns = 100;
      terminal = { backend = "local"; cwd = "."; timeout = 180; };
      compression = {
        enabled = true;
        threshold = 0.85;
        summary_model = "google/gemini-3-flash-preview";
      };
      memory = { memory_enabled = true; user_profile_enabled = true; };
      display = { compact = false; personality = "kawaii"; };
      agent = { max_turns = 60; verbose = false; };
    };

    environmentFiles = [ config.sops.secrets."hermes-env".path ];

    documents = {
      "SOUL.md" = builtins.readFile /home/user/.hermes/SOUL.md;
      "USER.md" = ./documents/USER.md;
    };

    mcpServers.filesystem = {
      command = "npx";
      args = [ "-y" "@modelcontextprotocol/server-filesystem" "/data/workspace" ];
    };

    container = {
      image = "ubuntu:24.04";
      backend = "docker";
      extraVolumes = [ "/home/user/projects:/projects:rw" ];
      extraOptions = [ "--gpus" "all" ];
    };

    addToSystemPackages = true;
    extraArgs = [ "--verbose" ];
    restart = "always";
    restartSec = 5;
  };
}
```

#### 自带配置文件的逃生口

如果你完全想自己管理 `config.yaml`，可以使用：

```nix
services.hermes-agent.configFile = /etc/hermes/config.yaml;
```

这会绕过 `settings`：

- 不再合并
- 不再生成
- 每次 activation 都把该文件原样复制到 `$HERMES_HOME/config.yaml`

#### 常用自定义速查表

| 我想做什么 | 选项 | 示例 |
|---|---|---|
| 改 LLM model | `settings.model.default` | `"anthropic/claude-sonnet-4"` |
| 改 provider endpoint | `settings.model.base_url` | `"https://openrouter.ai/api/v1"` |
| 加 API keys | `environmentFiles` | `[ config.sops.secrets."hermes-env".path ]` |
| 设定 personality | `documents."SOUL.md"` | `builtins.readFile ./my-soul.md` |
| 添加 MCP servers | `mcpServers.<name>` | 见下文 |
| 把宿主目录挂到容器里 | `container.extraVolumes` | `[ "/data:/data:rw" ]` |
| 把 GPU 权限给容器 | `container.extraOptions` | `[ "--gpus" "all" ]` |
| 用 Podman 替代 Docker | `container.backend` | `"podman"` |
| 给服务 PATH 增加工具 | `extraPackages` | `[ pkgs.pandoc pkgs.imagemagick ]` |
| 自定义基础镜像 | `container.image` | `"ubuntu:24.04"` |
| 覆盖 `hermes` package | `package` | `inputs.hermes-agent.packages.${system}.default.override { ... }` |
| 改 state 目录 | `stateDir` | `"/opt/hermes"` |
| 改工作目录 | `workingDirectory` | `"/home/user/projects"` |

### Secrets 管理

官方危险提示：

- 不要把 API key 放进 `settings` 或 `environment`
- 因为 Nix 表达式会进入 `/nix/store`
- `/nix/store` 是全局可读的
- secrets 应通过 `environmentFiles` 配合 secrets manager 提供

`environment` 与 `environmentFiles` 会在 activation 时合并成 `$HERMES_HOME/.env`。Hermes 每次启动都会读取这个文件，因此重启服务即可让 secrets 变更生效。

#### `sops-nix`

```nix
{
  sops = {
    defaultSopsFile = ./secrets/hermes.yaml;
    age.keyFile = "/home/user/.config/sops/age/keys.txt";
    secrets."hermes-env" = { format = "yaml"; };
  };

  services.hermes-agent.environmentFiles = [
    config.sops.secrets."hermes-env".path
  ];
}
```

加密 secrets 文件示例：

```yaml
hermes-env: |
    OPENROUTER_API_KEY=sk-or-...
    TELEGRAM_BOT_TOKEN=123456:ABC...
    ANTHROPIC_API_KEY=sk-ant-...
```

#### `agenix`

```nix
{
  age.secrets.hermes-env.file = ./secrets/hermes-env.age;

  services.hermes-agent.environmentFiles = [
    config.age.secrets.hermes-env.path
  ];
}
```

#### OAuth / Auth 预播种

对于需要 OAuth 的平台，官方提供 `authFile`：

```nix
{
  services.hermes-agent = {
    authFile = config.sops.secrets."hermes/auth.json".path;
  };
}
```

补充说明：

- 默认只在首次部署、目标位置没有 `auth.json` 时复制
- 若设 `authFileForceOverwrite = true`，则每次 activation 都覆盖
- 运行时刷新出来的 OAuth token 会写到 state 目录，并跨重建保留

### Documents

`documents` 选项会把文件安装到 agent 的工作目录中，即 `workingDirectory`，也就是 agent 的 workspace。

Hermes 对以下文件名有约定：

- `SOUL.md`：agent 的 system prompt / personality
- `USER.md`：关于使用者的信息
- 其他文件：都会作为 workspace 文件暴露给 agent

示例：

```nix
{
  services.hermes-agent.documents = {
    "SOUL.md" = ''
      You are a helpful research assistant specializing in NixOS packaging.
      Always cite sources and prefer reproducible solutions.
    '';
    "USER.md" = ./documents/USER.md;
  };
}
```

值可以是：

- 行内字符串
- 路径引用

并且会在每次 `nixos-rebuild switch` 时重新安装。

### MCP Servers

`mcpServers` 用来声明式配置 Model Context Protocol 服务器。支持两类传输：

- `stdio`
- `HTTP`

#### 本地 `stdio` 方式

```nix
{
  services.hermes-agent.mcpServers = {
    filesystem = {
      command = "npx";
      args = [ "-y" "@modelcontextprotocol/server-filesystem" "/data/workspace" ];
    };
    github = {
      command = "npx";
      args = [ "-y" "@modelcontextprotocol/server-github" ];
      env.GITHUB_PERSONAL_ACCESS_TOKEN = "\${GITHUB_TOKEN}";
    };
  };
}
```

官方 tip：

- `env` 中的环境变量值会从 `$HERMES_HOME/.env` 在运行时解析
- 令牌仍应通过 `environmentFiles` 注入，不要直接写进 Nix 配置

#### 远程 HTTP 方式

```nix
{
  services.hermes-agent.mcpServers.remote-api = {
    url = "https://mcp.example.com/v1/mcp";
    headers.Authorization = "Bearer \${MCP_REMOTE_API_KEY}";
    timeout = 180;
  };
}
```

#### 带 OAuth 的 HTTP 方式

```nix
{
  services.hermes-agent.mcpServers.my-oauth-server = {
    url = "https://mcp.example.com/mcp";
    auth = "oauth";
  };
}
```

官方说明：Hermes 实现了完整 PKCE 流程，包括：

- metadata discovery
- dynamic client registration
- token exchange
- automatic refresh

生成的 token 存在：

- `$HERMES_HOME/mcp-tokens/<server-name>.json`

可跨重启、跨 rebuild 保留。

#### 无头服务器上的首次 OAuth

官方给出两种方式。

方式 A：交互式 bootstrap

```bash
# Container mode
docker exec -it hermes-agent \
  hermes mcp add my-oauth-server --url https://mcp.example.com/mcp --auth oauth

# Native mode
sudo -u hermes HERMES_HOME=/var/lib/hermes/.hermes \
  hermes mcp add my-oauth-server --url https://mcp.example.com/mcp --auth oauth
```

方式 B：预先播种 token

```bash
hermes mcp add my-oauth-server --url https://mcp.example.com/mcp --auth oauth
scp ~/.hermes/mcp-tokens/my-oauth-server{,.client}.json \
    server:/var/lib/hermes/.hermes/mcp-tokens/
```

复制后应确保：

- `chown hermes:hermes`
- `chmod 0600`

#### Sampling

某些 MCP server 可以向 agent 请求 LLM completion：

```nix
{
  services.hermes-agent.mcpServers.analysis = {
    command = "npx";
    args = [ "-y" "analysis-server" ];
    sampling = {
      enabled = true;
      model = "google/gemini-3-flash";
      max_tokens_cap = 4096;
      timeout = 30;
      max_rpm = 10;
    };
  };
}
```

### Managed Mode

当 Hermes 由 NixOS module 管理时，以下 CLI 命令会被阻止，并提示你去改 `configuration.nix`：

| 被阻止的命令 | 原因 |
|---|---|
| `hermes setup` | 配置是声明式的，应改 `settings` |
| `hermes config edit` | 配置由 `settings` 生成 |
| `hermes config set <key> <value>` | 配置由 `settings` 生成 |
| `hermes gateway install` | systemd 服务由 NixOS 托管 |
| `hermes gateway uninstall` | systemd 服务由 NixOS 托管 |

阻止漂移的检测信号有两个：

1. 环境变量 `HERMES_MANAGED=true`
2. `HERMES_HOME` 中的 `.managed` 标记文件

因此，不管是 gateway 进程还是 `docker exec` 进去的交互式 shell，都能识别自己处在受管环境中。

### 容器架构

这一节只适用于 `container.enable = true`。

官方给出的核心关系是：

- `/nix/store` 以只读方式挂进容器
- `/var/lib/hermes` 挂到容器内 `/data`
- `current-package` 符号链接指向当前 hermes 包
- `.gc-root` 防止运行中的包被垃圾回收
- `.container-identity` 用于判断是否需要重建容器
- `.hermes/` 保存运行状态、`config.yaml`、`.env`、tokens、sessions、memories 等
- `workspace/` 是 `MESSAGING_CWD`

容器内可写层主要是：

- `/usr`
- `/usr/local`
- `/tmp`

也就是通过 `apt` / `pip` / `npm` 安装进去的内容所在区域。

官方说明：

- Nix 构建出的二进制之所以能在 Ubuntu 容器里运行，是因为 `/nix/store` 被 bind mount 进去
- 二进制携带自己的解释器与依赖，不依赖容器系统库
- 容器入口点解析到 `/data/current-package/bin/hermes gateway run --replace`
- `nixos-rebuild switch` 时，只更新符号链接，不重建容器

#### 哪些东西在什么情况下会保留

| 事件 | 容器是否重建 | `/data` | `/home/hermes` | 可写层 |
|---|---|---|---|---|
| `systemctl restart hermes-agent` | 否 | 保留 | 保留 | 保留 |
| `nixos-rebuild switch`（仅代码变更） | 否 | 保留 | 保留 | 保留 |
| 主机重启 | 否 | 保留 | 保留 | 保留 |
| `nix-collect-garbage` | 否 | 保留 | 保留 | 保留 |
| 改 `container.image` | 是 | 保留 | 保留 | 丢失 |
| 改卷挂载或容器选项 | 是 | 保留 | 保留 | 丢失 |
| 改 `environment` / `environmentFiles` | 否 | 保留 | 保留 | 保留 |

官方进一步解释：

- 容器只在 identity hash 改变时重建
- hash 覆盖 schema version、image、`extraVolumes`、`extraOptions`、entrypoint script
- settings、documents、environment 变化不会触发重建
- hermes package 自身变化也不会触发重建

官方警告：

- 如果 identity hash 变化，容器会被销毁并重建
- 可写层中的 `apt` / `pip` / `npm` 安装内容会丢失
- `/data` 与 `/home/hermes` 不会丢
- 如果依赖某些固定包，建议做自定义镜像，或在 `SOUL.md` 中加入自动安装脚本

#### GC Root 保护

`preStart` 会在 `${stateDir}/.gc-root` 建立指向当前包的 GC root，防止 `nix-collect-garbage` 删掉正在运行的二进制。若 GC root 失效，重启服务会重新创建。

### 开发

#### Dev Shell

```bash
cd hermes-agent
nix develop
hermes setup
hermes chat
```

官方说明 dev shell 提供：

- Python 3.11 + uv
- Node.js 20、`ripgrep`、`git`、`openssh`、`ffmpeg`
- 首次进入时把依赖装进 `.venv`
- 之后依赖未变时靠 stamp file 实现快速重进

#### direnv

仓库里的 `.envrc` 可以自动激活 dev shell：

```bash
cd hermes-agent
direnv allow
```

#### Flake Checks

```bash
nix flake check
nix build .#checks.x86_64-linux.package-contents
nix build .#checks.x86_64-linux.entry-points-sync
nix build .#checks.x86_64-linux.cli-commands
nix build .#checks.x86_64-linux.managed-guard
nix build .#checks.x86_64-linux.bundled-skills
nix build .#checks.x86_64-linux.config-roundtrip
```

这些检查分别验证：

| 检查项 | 验证内容 |
|---|---|
| `package-contents` | `hermes` 与 `hermes-agent` 二进制存在，且 `hermes version` 可运行 |
| `entry-points-sync` | `pyproject.toml` 的 `[project.scripts]` 与 Nix 包导出的包装二进制同步 |
| `cli-commands` | `hermes --help` 暴露 `gateway` 与 `config` 子命令 |
| `managed-guard` | 在 `HERMES_MANAGED=true` 下，`hermes config set ...` 会打印 NixOS 管理错误 |
| `bundled-skills` | skills 目录存在、含 `SKILL.md`、包装器中设置了 `HERMES_BUNDLED_SKILLS` |
| `config-roundtrip` | 验证 fresh install、Nix 覆盖、用户键保留、混合合并、MCP 追加合并、嵌套深合并、幂等性等 7 类场景 |

### 选项参考

#### Core

| Option | Type | Default | 说明 |
|---|---|---|---|
| `enable` | `bool` | `false` | 是否启用 `hermes-agent` 服务 |
| `package` | `package` | `hermes-agent` | 使用哪个 hermes-agent 包 |
| `user` | `str` | `"hermes"` | 系统用户 |
| `group` | `str` | `"hermes"` | 系统用户组 |
| `createUser` | `bool` | `true` | 是否自动创建用户/组 |
| `stateDir` | `str` | `"/var/lib/hermes"` | 状态目录，即 `HERMES_HOME` 的父目录 |
| `workingDirectory` | `str` | `"${stateDir}/workspace"` | agent 工作目录，即 `MESSAGING_CWD` |
| `addToSystemPackages` | `bool` | `false` | 将 `hermes` CLI 放入系统 PATH，并设置系统级 `HERMES_HOME` |

#### Configuration

| Option | Type | Default | 说明 |
|---|---|---|---|
| `settings` | `attrs` | `{}` | 渲染为 `config.yaml` 的声明式配置，支持任意嵌套和深度合并 |
| `configFile` | `null` or `path` | `null` | 现成的 `config.yaml` 路径；一旦设置，就完全覆盖 `settings` |

#### Secrets And Environment

| Option | Type | Default | 说明 |
|---|---|---|---|
| `environmentFiles` | `listOf str` | `[]` | secret env 文件路径，activation 时合并进 `$HERMES_HOME/.env` |
| `environment` | `attrsOf str` | `{}` | 非 secret 环境变量；会暴露在 Nix store 中 |
| `authFile` | `null` or `path` | `null` | OAuth 凭证种子文件，只在首次部署时复制 |
| `authFileForceOverwrite` | `bool` | `false` | 是否每次 activation 都强制覆盖 `auth.json` |

#### Documents

| Option | Type | Default | 说明 |
|---|---|---|---|
| `documents` | `attrsOf (either str path)` | `{}` | 工作区文件。键是文件名，值是字符串或路径 |

#### MCP Servers

| Option | Type | Default | 说明 |
|---|---|---|---|
| `mcpServers` | `attrsOf submodule` | `{}` | MCP server 定义，最终并入 `settings.mcp_servers` |
| `mcpServers.<name>.command` | `null` or `str` | `null` | `stdio` 传输下的命令 |
| `mcpServers.<name>.args` | `listOf str` | `[]` | 参数列表 |
| `mcpServers.<name>.env` | `attrsOf str` | `{}` | server 进程环境变量 |
| `mcpServers.<name>.url` | `null` or `str` | `null` | HTTP/StreamableHTTP endpoint |
| `mcpServers.<name>.headers` | `attrsOf str` | `{}` | HTTP headers |
| `mcpServers.<name>.auth` | `null` or `"oauth"` | `null` | 认证方式；`"oauth"` 表示 OAuth 2.1 PKCE |
| `mcpServers.<name>.enabled` | `bool` | `true` | 是否启用该 server |
| `mcpServers.<name>.timeout` | `null` or `int` | `null` | tool call 超时，单位秒 |
| `mcpServers.<name>.connect_timeout` | `null` or `int` | `null` | 连接超时，单位秒 |
| `mcpServers.<name>.tools` | `null` or `submodule` | `null` | 工具过滤，支持 `include` / `exclude` |
| `mcpServers.<name>.sampling` | `null` or `submodule` | `null` | server 发起 LLM 请求时的 sampling 配置 |

#### Service Behavior

| Option | Type | Default | 说明 |
|---|---|---|---|
| `extraArgs` | `listOf str` | `[]` | 传给 `hermes gateway` 的额外参数 |
| `extraPackages` | `listOf package` | `[]` | 仅 native mode 有效，追加到服务 PATH 的包 |
| `restart` | `str` | `"always"` | systemd `Restart=` 策略 |
| `restartSec` | `int` | `5` | systemd `RestartSec=` |

#### Container

| Option | Type | Default | 说明 |
|---|---|---|---|
| `container.enable` | `bool` | `false` | 是否启用 OCI 容器模式 |
| `container.backend` | `enum ["docker" "podman"]` | `"docker"` | 容器运行时 |
| `container.image` | `str` | `"ubuntu:24.04"` | 基础镜像 |
| `container.extraVolumes` | `listOf str` | `[]` | 额外挂载，格式 `host:container:mode` |
| `container.extraOptions` | `listOf str` | `[]` | 透传给 `docker create` 的额外参数 |

### 目录布局

#### Native Mode

官方列出的目录含义如下：

- `/var/lib/hermes/`：`stateDir`
- `.hermes/`：`HERMES_HOME`
- `config.yaml`：Nix 生成并在每次 rebuild 时深度合并
- `.managed`：表明 CLI 不允许修改配置
- `.env`：由 `environment` 与 `environmentFiles` 合并得到
- `auth.json`：OAuth 凭证
- `gateway.pid`、`state.db`
- `mcp-tokens/`
- `sessions/`
- `memories/`
- `skills/`
- `cron/`
- `logs/`
- `home/`：agent 的 HOME
- `workspace/`：`MESSAGING_CWD`，包括 `SOUL.md` 以及 agent 创建的文件

#### Container Mode

同一套布局会挂载到容器中：

| 容器内路径 | 宿主机路径 | 模式 | 说明 |
|---|---|---|---|
| `/nix/store` | `/nix/store` | `ro` | Hermes 二进制与全部 Nix 依赖 |
| `/data` | `/var/lib/hermes` | `rw` | 状态、配置、workspace |
| `/home/hermes` | `${stateDir}/home` | `rw` | 持久化 HOME，适合 `pip install --user` 等 |
| `/usr`、`/usr/local`、`/tmp` | 可写层 | `rw` | `apt` / `pip` / `npm` 安装区；重启保留，重建丢失 |

### 更新

```bash
nix flake update hermes-agent --flake /etc/nixos
sudo nixos-rebuild switch
```

官方说明：在 container mode 下，更新只会改 `current-package` 符号链接，并在重启服务后使用新二进制，不会重建容器，也不会丢已安装包。

### 故障排查

#### 查看日志

```bash
journalctl -u hermes-agent -f
docker logs -f hermes-agent
```

#### 容器检查

```bash
systemctl status hermes-agent
docker ps -a --filter name=hermes-agent
docker inspect hermes-agent --format='{{.State.Status}}'
docker exec -it hermes-agent bash
docker exec hermes-agent readlink /data/current-package
docker exec hermes-agent cat /data/.container-identity
```

#### 强制重建容器

```bash
sudo systemctl stop hermes-agent
docker rm -f hermes-agent
sudo rm /var/lib/hermes/.container-identity
sudo systemctl start hermes-agent
```

#### 检查 secrets 是否正确加载

```bash
# Native mode
sudo -u hermes cat /var/lib/hermes/.hermes/.env

# Container mode
docker exec hermes-agent cat /data/.hermes/.env
```

#### 验证 GC root

```bash
nix-store --query --roots $(docker exec hermes-agent readlink /data/current-package)
```

#### 常见问题

| 现象 | 原因 | 修复 |
|---|---|---|
| `Cannot save configuration: managed by NixOS` | CLI guard 生效 | 修改 `configuration.nix`，再 `nixos-rebuild switch` |
| 容器意外重建 | `extraVolumes`、`extraOptions` 或 `image` 发生变化 | 这是预期行为；重新安装包或改用自定义镜像 |
| `hermes version` 还是旧版本 | 容器未重启 | `systemctl restart hermes-agent` |
| `/var/lib/hermes` 权限不足 | 目录权限为 `0750 hermes:hermes` | 用 `docker exec` 或 `sudo -u hermes` |
| `nix-collect-garbage` 删掉了 hermes | GC root 丢失 | 重启服务，`preStart` 会重建 GC root |

---

## 第 4 章：更新与卸载（Updating & Uninstalling）

来源：

- `https://hermes-agent.nousresearch.com/docs/getting-started/updating`

### 更新

升级到最新版：

```bash
hermes update
```

官方说明，这条命令会：

- 拉取最新代码
- 更新依赖
- 检测你当前版本之后新增的配置项
- 提示你完成新的配置

如果你在提示时跳过了配置项补齐，可手动执行：

```bash
hermes config check
hermes config migrate
```

### 更新过程中会发生什么

官方列出了四个步骤：

1. `Git pull`：从 `main` 分支拉取最新代码，并更新 submodules
2. 依赖安装：执行 `uv pip install -e ".[all]"`
3. 配置迁移：检查新增配置项，并引导设置
4. gateway 自动重启：如果 gateway service 正在运行，在更新完成后会自动重启

官方示例输出：

```text
$ hermes update
Updating Hermes Agent...
📥 Pulling latest code...
Already up to date.  (or: Updating abc1234..def5678)
📦 Updating dependencies...
✅ Dependencies updated
🔍 Checking for new config options...
✅ Config is up to date  (or: Found 2 new options — running migration...)
🔄 Restarting gateway service...
✅ Gateway restarted
✅ Hermes Agent updated successfully!
```

### 官方推荐的更新后核查

虽然 `hermes update` 已处理主要流程，但官方仍建议快速验证：

1. `git status --short`
2. `hermes doctor`
3. `hermes --version`
4. 若使用 gateway，则执行 `hermes gateway status`
5. 如果 `doctor` 报告 npm audit 问题，则在对应目录执行 `npm audit fix`

官方警告：

- 如果 `git status --short` 在更新后显示意外变更，先停下检查
- 这通常意味着本地改动被重新应用，或依赖步骤改写了 lockfile

### 查看当前版本

```bash
hermes version
hermes update --check
```

并可对照 GitHub releases 页面查看最新版本。

### 从消息平台触发更新

Telegram、Discord、Slack、WhatsApp 中可直接发送：

```text
/update
```

官方说明：

- 这会拉取最新代码
- 更新依赖
- 重启 gateway
- 重启过程中 bot 会短暂离线，通常 5 到 15 秒

### 手动更新

如果你不是用快速安装器，而是手动安装：

```bash
cd /path/to/hermes-agent
export VIRTUAL_ENV="$(pwd)/venv"
git pull origin main
git submodule update --init --recursive
uv pip install -e ".[all]"
uv pip install -e "./tinker-atropos"
hermes config check
hermes config migrate
```

### 回滚

如果升级后有问题，可以回滚到历史提交：

```bash
cd /path/to/hermes-agent
git log --oneline -10
git checkout <commit-hash>
git submodule update --init --recursive
uv pip install -e ".[all]"
hermes gateway restart
```

也可以回滚到某个 release tag：

```bash
git checkout v0.6.0
git submodule update --init --recursive
uv pip install -e ".[all]"
```

官方警告：

- 回滚后可能遇到配置不兼容
- 建议执行 `hermes config check`
- 如果 `config.yaml` 中出现无法识别的新增键，手动删掉

### Nix 用户的更新方式

```bash
nix flake update hermes-agent
nix profile upgrade hermes-agent
nix profile rollback
```

官方说明：Nix 安装是不可变的，回滚依赖 Nix 的 generation 系统。

### 卸载

```bash
hermes uninstall
```

官方说明：

- 卸载器会询问是否保留 `~/.hermes/`
- 如果以后还打算重装，可选择保留配置

### 手动卸载

```bash
rm -f ~/.local/bin/hermes
rm -rf /path/to/hermes-agent
rm -rf ~/.hermes
```

其中 `~/.hermes` 可选保留。

如果你把 gateway 安装成系统服务，官方要求先停服务并解除注册：

```bash
hermes gateway stop
# Linux: systemctl --user disable hermes-gateway
# macOS: launchctl remove ai.hermes.gateway
```

---

## 第 5 章：学习路径（Learning Path）

来源：

- `https://hermes-agent.nousresearch.com/docs/getting-started/learning-path`

### 这一章讲什么

这一章不是配置说明，而是官方为不同经验水平和不同目标设计的“读文档路线图”。Hermes Agent 可用于：

- CLI 助手
- Telegram / Discord bot
- 自动化任务
- RL 训练
- 以及更多场景

如果你还没安装，官方建议先读：

1. `Installation`
2. `Quickstart`

下面的学习路径都默认你已经成功安装。

### 如何使用这一页

官方给出三种使用方式：

- 知道自己是什么水平：看“按经验水平”
- 已经有明确目标：看“按使用场景”
- 只是浏览能力全貌：看“关键特性速览”

### 按经验水平

| Level | 目标 | 推荐阅读顺序 | 预估时间 |
|---|---|---|---|
| Beginner | 完成安装、能基础对话、使用内置工具 | `Installation` -> `Quickstart` -> `CLI Usage` -> `Configuration` | 约 1 小时 |
| Intermediate | 配消息 bot，使用 memory、cron、skills 等进阶功能 | `Sessions` -> `Messaging` -> `Tools` -> `Skills` -> `Memory` -> `Cron` | 约 2 到 3 小时 |
| Advanced | 构建自定义 tools、创建 skills、做 RL 训练、参与贡献 | `Architecture` -> `Adding Tools` -> `Creating Skills` -> `RL Training` -> `Contributing` | 约 4 到 6 小时 |

### 按使用场景

#### 场景一：我想要一个 CLI 编码助手

官方推荐阅读顺序：

1. `Installation`
2. `Quickstart`
3. `CLI Usage`
4. `Code Execution`
5. `Context Files`
6. `Tips & Tricks`

官方补充 tip：

- 你可以把文件直接作为 context file 传给会话
- Hermes Agent 能读、改、运行项目里的代码

#### 场景二：我想要一个 Telegram / Discord bot

推荐顺序：

1. `Installation`
2. `Configuration`
3. `Messaging Overview`
4. `Telegram Setup`
5. `Discord Setup`
6. `Voice Mode`
7. `Use Voice Mode with Hermes`
8. `Security`

官方还推荐两个完整项目例子：

- `Daily Briefing Bot`
- `Team Telegram Assistant`

#### 场景三：我想自动化任务

推荐顺序：

1. `Quickstart`
2. `Cron Scheduling`
3. `Batch Processing`
4. `Delegation`
5. `Hooks`

官方 tip：

- Cron jobs 可让 Hermes 在无人值守时按计划运行
- 适合日报、定期检查、自动化报告等

#### 场景四：我想构建自定义 tools / skills

推荐顺序：

1. `Tools Overview`
2. `Skills Overview`
3. `MCP`
4. `Architecture`
5. `Adding Tools`
6. `Creating Skills`

官方解释：

- tools 是 agent 可调用的单个函数
- skills 是一组工具、提示词和配置打包成的可复用能力包
- 建议先学 tools，再扩展到 skills

#### 场景五：我想训练模型

推荐顺序：

1. `Quickstart`
2. `Configuration`
3. `RL Training`
4. `Provider Routing`
5. `Architecture`

官方 tip：

- RL training 最适合已经理解 Hermes 对话与 tool call 工作方式的人
- 如果你是新手，先走 Beginner 路线

#### 场景六：我想把它当成 Python 库使用

推荐顺序：

1. `Installation`
2. `Quickstart`
3. `Python Library Guide`
4. `Architecture`
5. `Tools`
6. `Sessions`

### 关键特性速览

| 特性 | 作用 | 对应文档 |
|---|---|---|
| `Tools` | agent 可调用的内置工具，如文件 I/O、搜索、shell 等 | `Tools` |
| `Skills` | 可安装的插件式能力包 | `Skills` |
| `Memory` | 跨会话持久记忆 | `Memory` |
| `Context Files` | 把文件与目录送入对话上下文 | `Context Files` |
| `MCP` | 通过 Model Context Protocol 连接外部工具服务器 | `MCP` |
| `Cron` | 安排周期性 agent 任务 | `Cron` |
| `Delegation` | 生成子 agent 并行处理工作 | `Delegation` |
| `Code Execution` | 在沙箱环境执行代码 | `Code Execution` |
| `Browser` | 网页浏览与抓取 | `Browser` |
| `Hooks` | 事件驱动回调与中间件 | `Hooks` |
| `Batch Processing` | 批量处理多份输入 | `Batch Processing` |
| `RL Training` | 用强化学习微调模型行为 | `RL Training` |
| `Provider Routing` | 在多个 LLM provider 之间路由 | `Provider Routing` |

### 官方建议的下一步

- 刚装完：去读 `Quickstart`
- 已做完 Quickstart：继续读 `CLI Usage` 与 `Configuration`
- 基础已熟：读 `Tools`、`Skills`、`Memory`
- 想给团队搭：读 `Security` 与 `Sessions`
- 想开始构建：读 `Developer Guide`
- 想看实战：读 `Guides`

官方最后的提示是：

- 你不需要把全部文档一次读完
- 挑一条符合目标的路径顺着读，就能很快进入可用状态
- 之后随时回到这页找下一步
