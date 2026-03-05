---
name: scheduled-reminder
description: Create scheduled reminders and tasks using OpenClaw's cron system. Use when user asks to set reminders, schedule tasks, or create timed notifications. Supports one-time reminders (--at) and recurring tasks (--every/--cron). Can deliver via DingTalk, Telegram, Discord, and other channels.
---

# Scheduled Reminder Skill

## Quick Reference

**Use OpenClaw's cron system, NOT system crontab or at.**

OpenClaw cron tasks show in dashboard; system crontab/at do not.

## Commands

### List all scheduled tasks

```bash
openclaw cron list
```

### Create a one-time reminder

```bash
openclaw cron add \
  --name "提醒名称" \
  --at "2026-03-02T19:00:00+08:00" \
  --channel dingtalk \
  --to "01433859201038513442" \
  --message "提醒内容" \
  --delete-after-run
```

**Key flags:**
- `--at`: ISO 8601 datetime with timezone (e.g., `2026-03-02T19:00:00+08:00`)
- `--delete-after-run`: Auto-delete after execution (for one-time reminders)
- `--channel`: dingtalk, telegram, discord, etc.
- `--to`: User ID or chat ID

### Create a recurring reminder

```bash
openclaw cron add \
  --name "每日提醒" \
  --cron "0 9 * * *" \
  --channel dingtalk \
  --to "01433859201038513442" \
  --message "提醒内容"
```

**Cron format:** 5-field (minute hour day month weekday) or 6-field (with seconds)

### Create a recurring reminder with duration

```bash
openclaw cron add \
  --name "每小时提醒" \
  --every 1h \
  --channel dingtalk \
  --to "01433859201038513442" \
  --message "提醒内容"
```

### Delete a scheduled task

```bash
openclaw cron rm <task-id>
```

### Run a task immediately (debug)

```bash
openclaw cron run <task-id>
```

### View task history

```bash
openclaw cron runs <task-id>
```

## Common Mistakes to Avoid

### Mistake 1: Using system crontab or at

**Wrong:**
```bash
crontab -e
echo "..." | at 19:00
```

**Why:** System-level crontab/at don't appear in OpenClaw dashboard and can't use OpenClaw's message delivery.

**Right:** Use `openclaw cron add`

### Mistake 2: Wrong datetime format for --at

**Wrong:**
```bash
--at "19:00"
--at "2026-03-02 19:00"
```

**Right:**
```bash
--at "2026-03-02T19:00:00+08:00"
```

### Mistake 3: Missing --delete-after-run for one-time reminders

Without `--delete-after-run`, one-time reminders stay in the task list after execution.

## Timezone Handling

- Always include timezone in ISO datetime: `+08:00` for Beijing time
- Use `--tz` to set default timezone for cron expressions

## Channel-Specific Notes

### DingTalk

- `--channel dingtalk`
- `--to`: User ID (e.g., `01433859201038513442`)
- Requires proper DingTalk channel configuration in OpenClaw

### Telegram

- `--channel telegram`
- `--to`: Chat ID

### Discord

- `--channel discord`
- `--to`: Channel ID or User ID

## Verification

After creating a task, verify it exists:

```bash
openclaw cron list
```

Output shows: ID, Name, Schedule, Next run time, Status.