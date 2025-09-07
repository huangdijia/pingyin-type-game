# 拼音打字王（Pinyin Type Game）

一款面向小学中低年级的趣味打字小游戏。目标是帮助孩子熟悉键盘位置并强化
“看字/图 → 拼音 → 输入”的学习路径。项目为纯前端静态站点，开箱即玩。

## 功能特性

- 两大基础模式（MVP）
  - 键盘熟悉关：
    - 掉落字母，按对即可得分，逐步提速与提难
    - 主键区 → 左手区 → 右手区 → 全键盘逐级解锁
    - 支持开始弹窗、暂停遮罩、顶部主菜单按钮
  - 拼音打字关：
    - 输入拼音（不含声调，回车提交）
    - 正确后直接进入下一题（不再停留选字）
    - 覆盖常用字/词题库（可自定义扩展）
- 儿童友好 UI：卡通渐变、云朵/气泡装饰、按钮动效、弹出提示
- 声音反馈：正确/错误/成功 三种短音（基于 Web Audio API 合成）
- 纯静态部署：任意静态托管或本地打开 `public/index.html` 即可

## 目录结构

```shell
.
├── docs/                  # 设计/需求文档
│   └── type-game-prd.md
├── src/                   # 源码（开发目录）
│   ├── css/style.css
│   └── js/
│       ├── game.js        # 全局控制器 + 声音引擎
│       ├── keyboard-game.js
│       └── pinyin-game.js
├── public/                # 构建产物（部署目录）
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── game.js
│       ├── keyboard-game.js
│       └── pinyin-game.js
├── package.json
└── README.md
```

说明：`npm run build` 会将 `src/*` 覆盖复制到 `public/`。

## 快速开始

- 方式一：直接打开

  - 用浏览器打开 `public/index.html`

- 方式二：本地服务（推荐）

  ```bash
  npm install
  npm run dev   # http://localhost:8080 自动打开
  # 或
  npm start     # http://localhost:8080 手动打开
  ```

- 构建（同步 src → public）

  ```bash
  npm run build
  ```

## 使用说明（玩家）

- 首页只显示主标题和模式选择；进入游戏后才显示顶部计分/准确率/暂停/主菜单按钮。
- 键盘熟悉关：
  - 点击“开始”弹窗中的“开始 ▶️”进入
  - 根据屏幕掉落的字母按键（仅当前练习区的键有效）
  - 右上角可“暂停/继续”，其右侧可返回主菜单
- 拼音打字关：
  - 看到目标字/图后，输入拼音（不含声调），按回车提交
  - 正确即加分并直接进入下一题

提示：首次用户交互后声音才能播放（浏览器自动播放策略）。

## 自定义与扩展

- 题库（拼音打字关）
  - 位置：`src/js/pinyin-game.js` 顶部 `PINYIN_COMMON_ITEMS`
  - 字段：`{ char: '中国', base: 'zhongguo', hint: '🇨🇳' }`
  - 约定：
    - `base` 为不含声调的连写拼音，多音节直接拼接（例：谢谢→`xiexie`）
    - `ü` 使用 `v`（例：绿→`lv`）
  - 修改后执行 `npm run build`

- 声音（提示音）
  - 简易引擎：`src/js/game.js` 内 `SimpleAudio`
  - 调整音量：修改 `new SimpleAudio()` 中的 `this.volume`
  - 触发点：`gameApp.playSound('correct'|'wrong'|'success')`

- UI 与交互
  - 全局样式：`src/css/style.css`
  - 首页/游戏 UI：`public/index.html`（结构） + `style.css`（样式）
  - 键盘开始弹窗按钮（含“返回主菜单”）在 `#keyboard-start-overlay`

## 部署

- 静态托管（推荐）
  - 执行 `npm run build`，将 `public/` 目录上传到任意静态空间（如 GitHub Pages、Vercel、Netlify 等）
- 本地/内网
  - 直接使用 `npm run start` 提供本地服务

## 桌面应用（Electron + CI）

- 本地运行（Electron）
  - `npm run electron:dev`（会先构建 Web，再启动桌面应用）

- 打包 macOS DMG
  - 通用命令：`npm run dist:mac`
  - 指定架构：
    - Intel x64：`npm run dist:mac:x64`
    - Apple Silicon arm64：`npm run dist:mac:arm64`
  - 产物位置：`dist/*.dmg`

- GitHub Actions（CI）
  - 工作流：`.github/workflows/build-macos.yml`
  - 触发方式：push 到 `main/master`、打 tag（`v*.*.*`）、或手动 `workflow_dispatch`
  - 流程：`npm install` → `npm run build` → `electron-builder --mac dmg`（分别构建 x64/arm64） → 上传工件

- 代码签名与公证（可选）
  - 当前配置未签名（`build.mac.identity: null`），首次运行可能提示来源不明
  - 如需签名：在 CI Secrets 配置 Apple 证书，设置 `CSC_LINK` / `CSC_KEY_PASSWORD`，并移除 `identity: null`

- DMG 背景说明
  - 配置项：`package.json > build > dmg`
  - 已使用 `backgroundColor: "rgb(255,255,255)"`（注意：dmgbuild 不接受 `#FFFFFF` 这种 hex 格式）
  - 如需自定义背景图：将图片放入 `build/`，设置 `build.dmg.background` 为图片路径

- 锁文件与安装
  - 若使用 `npm ci`，需要提交与 `package.json` 同步的 `package-lock.json`
  - 当前 CI 使用 `npm install` 以避免锁文件未同步导致的失败；如需更严格可改回 `npm ci`

## 浏览器兼容

- 现代浏览器（Chromium、Firefox、Safari 最新版）
- iOS/Android 移动端浏览器可直接游玩（建议横屏）

## 路线图（Roadmap）

- 节奏模式（随音乐节拍按键）
- 冒险闯关（打字打怪、开宝箱）
- 家长后台（练习统计、成长曲线、自定义题库）
- 资源音效与背景音乐（替代合成波形）
- 云端同步/多设备进度

## 贡献与规范

- 提交信息：按 Conventional Commits（例如 `feat: ...` / `fix: ...`）
- 代码风格：
  - Markdown 使用 ATX 标题与代码块语言标注
  - JSON/TOML 两空格缩进；TOML 可注释
- 建议在提交前：
  - 本地运行并体验两个模式
  - `npm run build`，确认 `public/` 内容更新

## 许可

本项目使用 MIT 许可协议。详见 `package.json` 中的 `license` 字段。

---

如果你希望增加关卡、导入自定义词表、或替换提示音为音频文件，欢迎提 Issue 或 PR！
