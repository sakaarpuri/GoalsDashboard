---
name: preference-learner
description: A personalized learning system that captures user preferences, tracks mistake-fix patterns, and applies learnings to future similar situations. Creates a feedback loop for continuous improvement in understanding and serving the specific user.
tags: [personalization, learning, memory, preferences, continuous-improvement]
---

# 🧠 Preference Learner

**"Every interaction is a lesson. Every mistake is data."**

The **Preference Learner** is a meta-skill that captures what makes you *you* — your preferences, communication style, decision patterns, and how we solve problems together. It builds a personalized knowledge base that improves every interaction.

## Core Concepts

### 1. Preference Capture
Automatically extracts and stores:
- **Communication style** (short vs detailed, formal vs casual)
- **Technical preferences** (tools, approaches, patterns)
- **Decision criteria** (what matters most to you)
- **Workflow habits** (how you like things done)

### 2. Mistake-Fix Patterns
When things go wrong, we learn:
- What was misunderstood
- How it was fixed
- Root cause category
- Prevention strategy for next time

### 3. Situational Mapping
Recognizes similar situations and applies previous learnings:
- Pattern matching against past interactions
- Confidence scoring for recommendations
- Progressive refinement over time

## File Structure

```
skills/preference-learner/
├── SKILL.md                    # This file
├── assets/
│   ├── preferences.json        # User preference profile
│   ├── mistake-log.jsonl       # Append-only mistake/fix log
│   ├── pattern-capsules.json   # Reusable learnings
│   └── context-cache.json      # Recent interaction context
└── references/
    ├── preference-examples.md  # Example preference captures
    └── learning-patterns.md    # How to apply learnings
```

## Usage

### Automatic Mode
The system passively learns from every interaction:
- Silently updates preferences.json when patterns emerge
- Logs mistakes with fixes to mistake-log.jsonl
- Applies relevant patterns without explicit instruction

### Explicit Mode
You can explicitly teach the system:

```
"Remember: I prefer short responses"
"That approach didn't work because... here's how to fix it"
"Next time we do X, remember to check Y first"
```

### Query Mode
Ask what the system has learned:

```
"What do you know about my preferences?"
"Have we encountered this issue before?"
"How did we fix this last time?"
```

## Preference Categories

### Communication
- **Response length**: Short/concise vs thorough/detailed
- **Tone**: Formal vs casual vs friendly
- **Formatting**: Bullet points vs paragraphs vs tables
- **Examples**: Lots of examples vs minimal examples

### Technical
- **Code style**: Explicit vs clever, verbose vs minimal
- **Error handling**: Fail fast vs graceful degradation
- **Testing**: Comprehensive vs minimal viable
- **Documentation**: Extensive vs just-the-essentials

### Workflow
- **Approach**: Plan first vs dive in, ask vs assume
- **Review style**: Show before commit vs commit directly
- **Verification**: Double-check everything vs trust process
- **Tooling**: Prefer specific tools or flexible

### Decision Making
- **Priorities**: Speed vs quality, completeness vs MVP
- **Risk tolerance**: Conservative vs experimental
- **Change appetite**: Incremental vs revolutionary
- **Information needs**: Context-heavy vs just-the-facts

## Mistake Log Format

Each mistake entry follows this structure:

```json
{
  "timestamp": "2026-02-28T04:00:00Z",
  "category": "misunderstanding|execution|timing|preference",
  "situation": "Brief description of what was being attempted",
  "what_i_did": "What the AI did wrong",
  "what_you_wanted": "What you actually wanted",
  "how_we_fixed_it": "The correction or solution applied",
  "root_cause": "Why the mistake happened",
  "prevention": "How to prevent this in the future",
  "pattern_tags": ["ui-design", "cron-jobs", "git-workflow"],
  "confidence": 0.95
}
```

## Pattern Capsules

Reusable learnings extracted from mistake logs:

```json
{
  "id": "pattern-001",
  "trigger": "When user says 'just' or 'simply'",
  "learning": "User may be downplaying complexity — ask for clarification",
  "success_rate": 0.92,
  "last_applied": "2026-02-28T04:00:00Z",
  "times_applied": 5
}
```

## Integration with MEMORY.md

The Preference Learner works alongside your existing MEMORY.md:

- **MEMORY.md**: High-level summary, curated wisdom
- **preference-learner/**: Granular data, raw patterns, machine-readable

Update MEMORY.md periodically from preference-learner insights:
- "User prefers X over Y in Z situations"
- "Common mistake pattern: A → B, fix with C"
- "Decision framework for similar situations"

## Learning Lifecycle

### 1. Capture (Every Interaction)
- Preference signals detected
- Mistakes logged with context
- Successful patterns noted

### 2. Consolidate (Periodic)
- Raw logs → Pattern capsules
- Multiple examples → Confident rules
- Outdated preferences → Archived

### 3. Apply (Next Similar Situation)
- Pattern matching triggers
- Confidence threshold check
- Application with verification

### 4. Validate (Post-Application)
- Did it work as expected?
- Update success rate
- Refine or deprecate pattern

## Example: Learning in Action

**Interaction 1:**
```
User: "Make the button blue"
AI: [makes button blue]
User: "No, I meant the OTHER button"
AI: Oh, which button specifically?
User: "The submit button in the form"
```

**Logged Pattern:**
```json
{
  "category": "ambiguity",
  "learning": "When user references UI element without context, ask for specificity",
  "trigger": "Vague UI reference ('the button', 'the link')",
  "action": "Ask: 'Which [element] — in which component/page?'"
}
```

**Interaction 2 (Weeks Later):**
```
User: "Change the color"
AI: Which element — and on which page/component?
User: "The header background on the landing page"
```

**Result:** Pattern applied successfully, ambiguity avoided.

## Best Practices

### For You (The User)
- **Be explicit about preferences**: "I prefer..." / "I don't like..."
- **Explain the 'why'**: Helps categorize the learning
- **Correct immediately**: Fresh context = better learning
- **Review periodically**: "What have you learned about me?"

### For Me (The AI)
- **Log immediately**: Don't rely on memory
- **Tag thoroughly**: Good tags = better retrieval
- **Confidence scores**: Not all patterns are equal
- **Verify before applying**: "Based on previous interactions, you prefer X — is that right here?"

## Safety & Privacy

- All data stays in your workspace
- No external transmission
- You control what gets learned
- Can delete/modify any entry

## Getting Started

1. The system starts learning immediately
2. Check `preferences.json` to see what's been captured
3. Review `mistake-log.jsonl` to understand patterns
4. Explicitly teach: "Remember this about me..."

## Commands

```bash
# View current preferences
cat skills/preference-learner/assets/preferences.json

# View mistake log (last 10)
tail -10 skills/preference-learner/assets/mistake-log.jsonl

# View pattern capsules
cat skills/preference-learner/assets/pattern-capsules.json

# Clear all learnings (nuclear option)
rm -rf skills/preference-learner/assets/*
```

## Success Metrics

- **Preference accuracy**: Do my recommendations match your style?
- **Mistake recurrence**: Are we making the same mistakes twice?
- **Efficiency gains**: Fewer clarifications needed over time
- **User satisfaction**: "You get me" moments

---

*This skill learns from every interaction to serve you better. The goal is not perfection, but continuous improvement toward understanding you.*
