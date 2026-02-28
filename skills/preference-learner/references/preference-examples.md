# Preference Learner Examples

## Example 1: Learning Communication Style

**Interaction:**
```
User: "What model are you using?"
AI: "I'm running moonshot/kimi-k2.5 (Kimi K2.5). It's my default model 
     for this session. Would you like me to switch to a different model?"
User: "no"
```

**Logged:**
```json
{
  "category": "preference",
  "what_i_did": "Over-answered with extra context about switching models",
  "what_you_wanted": "Just the model name",
  "learning": "Short questions = short answers. Don't volunteer unrelated options."
}
```

---

## Example 2: Learning Technical Preferences

**Interaction:**
```
User: "Make the buttons neumorphic"
AI: [applies neumorphic to main button only]
User: "All buttons on the pricing cards need this"
```

**Logged:**
```json
{
  "category": "execution",
  "what_i_did": "Applied style to only one button",
  "what_you_wanted": "All buttons in the component",
  "learning": "When user says 'buttons on X', enumerate all instances first."
}
```

---

## Example 3: Learning Workflow Preferences

**Interaction:**
```
User: "tell me what you understood before you execute"
AI: [immediately starts executing changes]
User: "STOP - I said tell me what you understood FIRST"
```

**Logged:**
```json
{
  "category": "timing",
  "what_i_did": "Jumped to execution without verification",
  "what_you_wanted": "Confirm understanding verbally first",
  "learning": "Explicit verification request = STOP and confirm before ANY action."
}
```

---

## Example 4: Applying Learned Pattern

**Week 1:**
```
User: "Make the cards match the HTML page"
AI: [recreates cards from scratch]
User: "No, I meant COPY the HTML exactly"
```

**Logged Pattern:**
```json
{
  "trigger": "User references existing implementation",
  "learning": "Ask: 'Copy exactly or adapt/recreate?'"
}
```

**Week 3:**
```
User: "Make the footer look like the one on example.com"
AI: "Do you want me to copy their HTML/CSS exactly, or recreate 
     something similar with our styling?"
User: "Copy exactly - I want the same layout"
```

**Result:** Pattern applied successfully, ambiguity avoided.

---

## Example 5: Progressive Refinement

**Interaction 1:**
```
User: "compact view"
AI: [makes buttons smaller]
User: "No, I meant stack the categories vertically"
```

**Interaction 2 (later):**
```
User: "make it compact"
AI: "When you say compact, do you mean: smaller elements, 
     reorganized layout, or both?"
User: "Reorganized - put headings above the items"
```

**Interaction 3 (weeks later):**
```
User: "make this compact"
AI: [automatically reorganizes with headings above, no questions needed]
User: "Perfect"
```

**Learning:** "Compact" = reorganize layout vertically for this user.

---

## Quick Reference: Pattern Triggers

| User Says | Likely Pattern | My Action |
|-----------|---------------|-----------|
| "the button" / "the link" | Ambiguous reference | Enumerate all instances |
| "like X" / "match Y" | Replication request | Ask: copy or adapt? |
| "tell me what you understood" | Verification needed | STOP, explain, wait |
| Short question (< 5 words) | Brevity preference | Short answer |
| "just" / "simply" | Downplaying complexity | Ask for clarification |
| "make it X" (UI) | Layout/design change | Ask for visual description |
