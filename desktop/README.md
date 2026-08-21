# DevFlow 桌面端

Tauri 2.0 + Vue 3 + TypeScript，对接 NestJS 后端。

## 启动

```bash
npm install
npm run tauri dev    # 桌面浮动窗口
```

## 打包

```bash
npm run tauri build
# 产物在 src-tauri/target/release/bundle/
# Windows: nsis/*.exe, msi/*.msi
# macOS: dmg/*.dmg, macos/*.app
```

> 提示：正式打包前记得替换 `src-tauri/icons/` 占位图标（可用 `npm run tauri icon path/to/your/logo.png` 生成全套正确尺寸）。
