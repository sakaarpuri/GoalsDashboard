# Learning Patterns: How to Apply

## Pattern Application Framework

### 1. Trigger Detection
Before acting, scan for pattern triggers:
- Keywords in user message
- Similarity to past situations
- Request type classification

```
User input → Pattern match? → Confidence check → Apply or ask
```

### 2. Confidence Thresholds

| Confidence | Action |
|------------|--------|
| > 0.90 | Apply silently |
| 0.75 - 0.90 | Apply with brief note |
| 0.60 - 0.75 | Ask: "Based on previous interactions..." |
| < 0.60 | Don't apply, proceed normally |

### 3. Verification Loop

When applying patterns with confidence 0.75-0.90:

```
Apply pattern → Do work → Verify with user → Update success rate
```

Example:
```
AI: "I've applied the 3D neumorphic style to all pricing buttons 
     (based on our previous work). Does this look right?"
User: "Yes" → Success rate +1
User: "No, only the main CTA" → Update pattern, try again
```

## Pattern Categories

### Category: Communication
**How to detect:**
- User feedback on response style
- Short/long question patterns
- Explicit preferences stated

**How to apply:**
- Adjust response length dynamically
- Match tone to user's tone
- Use preferred formatting

**Example:**
```
User asks short question → Check preference.json → 
communication.response_length = "short" → 
Provide 1-2 sentence answer
```

---

### Category: Execution
**How to detect:**
- "You did X but I wanted Y"
- Post-execution corrections
- Scope misunderstandings

**How to apply:**
- Verify scope before acting
- Enumerate ambiguous elements
- Confirm destructive actions

**Example:**
```
User: "Update the buttons" → Check mistake-log for "buttons" → 
Found pattern: enumerate instances → 
"I see 4 buttons: submit, cancel, save, delete. Update all?"
```

---

### Category: Timing
**How to detect:**
- "You jumped ahead"
- "I said wait"
- Explicit workflow requests

**How to apply:**
- Pause before execution
- Confirm understanding
- Ask before proceeding

**Example:**
```
User: "Check with me first" → Pattern: verification_needed → 
STOP → Explain plan → Wait for "go"
```

---

### Category: Preference
**How to detect:**
- "I prefer..." / "I like..."
- Implicit from repeated choices
- Corrections showing consistent direction

**How to apply:**
- Store in preferences.json
- Apply to similar situations
- Update MEMORY.md periodically

**Example:**
```
User consistently chooses bullet points over paragraphs → 
Update preferences.communication.formatting → 
Default to bullets for lists
```

## Special Situations

### First-Time vs Recurring

**First time:**
- Log the interaction
- Note the outcome
- No pattern yet

**Second time:**
- Compare to first
- If similar, create pattern
- Apply cautiously

**Third+ time:**
- Confident pattern application
- High success rate
- Can apply silently

### Pattern Conflicts

When two patterns suggest different actions:

```
Pattern A: User likes short answers (confidence: 0.9)
Pattern B: User wants detailed technical explanations (confidence: 0.8)

Resolution: Ask clarifying question
"Quick summary or detailed breakdown?"
```

### Pattern Decay

Patterns lose relevance over time:

- **Last applied > 3 months ago:** Reduce confidence by 0.1
- **Last applied > 6 months ago:** Reduce confidence by 0.2
- **Last applied > 1 year:** Archive pattern

## Success Metrics

Track per pattern:
- Times applied
- Success rate
- Last applied date
- User satisfaction (explicit feedback)

**Good pattern:** > 80% success, applied 3+ times
**Review pattern:** 60-80% success, check for false positives
**Deprecate pattern:** < 60% success, or outdated

## Continuous Improvement

### Daily
- Log all mistakes automatically
- Update context cache

### Weekly
- Review mistake log for new patterns
- Update pattern-capsules.json
- Check for pattern conflicts

### Monthly
- Update MEMORY.md with consolidated learnings
- Archive old patterns
- Review success metrics

### Quarterly
- Full preference review with user
- Major pattern consolidation
- Skill version bump

## Anti-Patterns

**Don't:**
- Over-apply patterns (assumption creep)
- Ignore changing preferences
- Keep failed patterns active
- Apply with low confidence

**Do:**
- Verify uncertain patterns
- Update patterns based on feedback
- Ask when confident but critical
- Log both successes and failures
