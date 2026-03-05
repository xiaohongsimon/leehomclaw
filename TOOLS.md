# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## 已安装 Skills

| Skill | 状态 | 说明 |
|-------|------|------|
| weather | ✅ 可用 | 北京/杭州天气查询 |
| notion | ✅ 已配置 Token | 需要逐页授权 |
| apple-notes | ✅ 已安装 | 苹果备忘录 |
| apple-reminders | ✅ 已安装 | 苹果提醒事项 |
| github | ✅ 已安装 | 需要配置 token |

## API Tokens

- Notion: `ntn_*********************` (已配置，本地存储)

---

## GitHub Token
- **Token:** `ghp_*********************` (已配置，本地存储)
- **创建日期:** 2026-03-04
- **权限:** repo, read:org, read:user

> ⚠️ 注意：实际 token 仅存储在本地，GitHub 仓库中已脱敏

## 待配置

- ~~GitHub: 需要 Personal Access Token~~ ✅ 已配置
- Apple Notes/Reminders: 需要 macOS 授权
