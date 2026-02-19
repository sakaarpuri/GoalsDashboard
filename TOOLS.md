---
summary: "Workspace template for TOOLS.md"
read_when:
  - Bootstrapping a workspace manually
---

# TOOLS.md - Local Notes

## Manus AI API

- **API Key**: Stored in `.env.manus`
- **Base URL**: `https://api.manus.ai/v1`
- **Auth Header**: `API_KEY: <your_key>` (not Bearer)
- **Quick Test**: `./manus.sh "your prompt"`

### Common Endpoints
- `POST /v1/tasks` - Create AI task
- `GET /v1/tasks` - List tasks
- `POST /v1/files` - Upload files
- `POST /v1/webhooks` - Register webhooks

### Example Response
```json
{
  "task_id": "XZskNePxobUj2GHmHqve8E",
  "task_title": "Say Hello",
  "task_url": "https://manus.im/app/XZskNePxobUj2GHmHqve8E"
}
```

---

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

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.