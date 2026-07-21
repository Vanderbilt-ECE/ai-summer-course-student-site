# Tool Calling & Pydantic Assignment

## Overview

In `Day8-ToolCalling-FromScratch.ipynb` you saw how tool calling works end-to-end: describe
a function to the model, let it request a call, run the real Python function yourself, and
send the result back. You also saw how Pydantic generates the JSON schema for you instead
of hand-writing it.

Now you'll build your own. Pick **2-3 tools** from the menu below (or propose your own idea
— see the note at the bottom), implement each one as a real Python function, define its
arguments with a Pydantic model, and wire all of them into a working agent loop like
`run_agent_loop` from the notebook.

> **Tip: Use an AI tool throughout.** You're encouraged to use an LLM as a thinking partner
> — especially for schema design ("what fields and types make sense for this tool's
> arguments?") and edge cases ("what could go wrong if the model passes weird input to this
> function?"). Don't ask it to just write the whole tool for you; the point is to understand
> every piece well enough to explain it.

---

## Step 1: Pick Your Tools

Choose 2-3 tools from the menu below. Try to pick at least one tool outside the "basic /
warm-up" tier — those are a good place to start, but a whole assignment of warm-up tools
won't stretch you much.

Each entry below describes what the tool does and shows a **small snippet of the core
mechanic** — not a full working tool, just the underlying Python technique. Turning that
snippet into an actual tool (with a Pydantic argument model, a docstring/description, and
error handling) is your job in Steps 2 and 3.

### Basic / warm-up tools

**Calculator** — `calculate(expression: str)`. Evaluates a basic arithmetic expression like
`"2 + 3 * 4"`. **Do not use Python's built-in `eval()`** — it will happily execute arbitrary
code (`eval("__import__('os').system('rm -rf /')")` is valid Python). `ast.literal_eval`
is safe but only parses literals (numbers, strings, lists) — it can't do `2 + 3`. The safe
approach is to parse the expression into an AST and only evaluate nodes you explicitly
allow:

```python
import ast, operator

ALLOWED_OPS = {ast.Add: operator.add, ast.Sub: operator.sub,
               ast.Mult: operator.mul, ast.Div: operator.truediv}

def safe_eval(node):
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.BinOp) and type(node.op) in ALLOWED_OPS:
        return ALLOWED_OPS[type(node.op)](safe_eval(node.left), safe_eval(node.right))
    raise ValueError("Disallowed expression")

tree = ast.parse("2 + 3 * 4", mode="eval")
print(safe_eval(tree.body))  # 14
```

**Unit converter** — `convert_units(value: float, from_unit: str, to_unit: str)` for
temperature, length, or weight. A dict of conversion factors keyed by unit pair is enough
for one category:

```python
LENGTH_TO_METERS = {"m": 1, "km": 1000, "ft": 0.3048, "mi": 1609.34}

def convert_length(value, from_unit, to_unit):
    meters = value * LENGTH_TO_METERS[from_unit]
    return meters / LENGTH_TO_METERS[to_unit]
```

**Random number / dice roller** — `roll_dice(sides: int, count: int)`. Roll `count` dice
with `sides` faces each:

```python
import random

def roll_dice(sides, count):
    return [random.randint(1, sides) for _ in range(count)]
```

**Date/time tools** — `get_current_time()`, `days_until(date: str)`, `add_days(date: str, n: int)`:

```python
from datetime import datetime, timedelta

def days_until(date_str):
    target = datetime.strptime(date_str, "%Y-%m-%d")
    return (target - datetime.now()).days

def add_days(date_str, n):
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return (d + timedelta(days=n)).strftime("%Y-%m-%d")
```

### File system tools

**Read file** — `read_file(filename: str)`:

```python
def read_file(filename):
    try:
        with open(filename) as f:
            return f.read()
    except FileNotFoundError:
        return f"Error: {filename} not found"
```

**Write file** — `write_file(filename: str, content: str)`. `"w"` mode overwrites the whole
file, so this is destructive if the file already exists:

```python
def write_file(filename, content):
    with open(filename, "w") as f:
        f.write(content)
    return f"Wrote {len(content)} characters to {filename}"
```

**List directory** — `list_files(directory: str = ".")`:

```python
from pathlib import Path

def list_files(directory="."):
    return [p.name for p in Path(directory).iterdir()]
```

**Delete file** — `delete_file(filename: str)`. This is the tool most worth thinking hard
about (see Step 4 — Guardrails): letting an LLM delete files based on its own judgment is
genuinely risky.

```python
import os

def delete_file(filename):
    os.remove(filename)
    return f"Deleted {filename}"
```

**Append to file** — `append_to_file(filename: str, content: str)`. Useful for a "notes" or
"log" tool — `"a"` mode adds to the end instead of overwriting:

```python
def append_to_file(filename, content):
    with open(filename, "a") as f:
        f.write(content + "\n")
    return f"Appended to {filename}"
```

**Search file contents** — `grep_files(pattern: str, directory: str)`. Search every file in
a directory for lines matching a regex pattern:

```python
import re
from pathlib import Path

def grep_files(pattern, directory):
    matches = []
    for path in Path(directory).glob("*"):
        if path.is_file():
            for line in path.read_text().splitlines():
                if re.search(pattern, line):
                    matches.append(f"{path.name}: {line}")
    return matches
```

### Data / structured tools

**CSV query** — `query_csv(filename: str, column: str, value: str)`. Load a CSV and return
rows where a column matches a value:

```python
import csv

def query_csv(filename, column, value):
    with open(filename) as f:
        return [row for row in csv.DictReader(f) if row[column] == value]
```

**JSON lookup** — `lookup_json(filename: str, key_path: str)`. Look up a nested key using a
dotted path like `"user.address.city"`:

```python
import json

def lookup_json(filename, key_path):
    with open(filename) as f:
        data = json.load(f)
    for key in key_path.split("."):
        data = data[key]
    return data
```

**In-memory database tool** — `add_record(table: str, data: dict)` /
`query_records(table: str, filters: dict)`, backed by a dict-of-lists acting as a fake DB.
This is a nice segue into thinking of tools as an API layer over some data store:

```python
db: dict[str, list[dict]] = {}

def add_record(table, data):
    db.setdefault(table, []).append(data)
    return f"Added record to {table}"

def query_records(table, filters):
    rows = db.get(table, [])
    return [r for r in rows if all(r.get(k) == v for k, v in filters.items())]
```

**Sort/filter a list** — `sort_data(data: list, key: str, ascending: bool)`:

```python
def sort_data(data, key, ascending=True):
    return sorted(data, key=lambda row: row[key], reverse=not ascending)
```

### Text processing tools

**Word/char counter** — `count_words(text: str)`:

```python
def count_words(text):
    return {"characters": len(text), "words": len(text.split())}
```

**Text summarizer (extractive, non-LLM)** — `summarize(text: str, n_sentences: int)`. A
simple frequency-based approach: score each sentence by how many "important" (frequent)
words it contains, then keep the top N sentences in their original order. This is a nice
contrast to the LLM itself — a "dumb" tool that works without any model call at all:

```python
import re
from collections import Counter

def summarize(text, n_sentences=2):
    sentences = re.split(r'(?<=[.!?]) +', text)
    words = re.findall(r'\w+', text.lower())
    freq = Counter(words)
    scored = [(sum(freq[w] for w in re.findall(r'\w+', s.lower())), i, s)
              for i, s in enumerate(sentences)]
    top = sorted(scored, reverse=True)[:n_sentences]
    return " ".join(s for _, _, s in sorted(top, key=lambda t: t[1]))
```

**Regex extractor** — `extract_pattern(text: str, pattern: str)`. Pull emails, phone
numbers, or URLs out of text:

```python
import re

def extract_pattern(text, pattern):
    return re.findall(pattern, text)

# example: extract_pattern(text, r'[\w.+-]+@[\w-]+\.[\w.-]+')  -> emails
```

**Translator (mock/dictionary-based)** — `translate(text: str, target_lang: str)`. Avoids
needing an external translation API by using a small hardcoded dictionary, word by word:

```python
DICTIONARY = {
    "spanish": {"hello": "hola", "goodbye": "adios", "thank you": "gracias"},
}

def translate(text, target_lang):
    lang_dict = DICTIONARY.get(target_lang.lower(), {})
    words = text.lower().split()
    return " ".join(lang_dict.get(w, w) for w in words)
```

### Something not on this list?

That's fine — but **check with your instructor before you start coding** a tool that isn't
in this menu.

---

## Step 2: Define Your Pydantic Argument Models

For each tool, write a `BaseModel` describing its arguments, with a `Field(description=...)`
on every field — this is what becomes the tool's JSON schema for the API. Reuse the
`tool_from_model()` helper from the notebook:

```python
from pydantic import BaseModel, Field

class ReadFileArgs(BaseModel):
    filename: str = Field(description="Path to the file to read")
```

## Step 3: Implement the Tool Functions

Turn each snippet above into a real tool function matching your Pydantic model's fields.
Handle the obvious failure cases (missing file, bad input) so a mistake doesn't crash your
whole agent loop.

## Step 4: Guardrails

Not every tool should just run whatever the model asks. For each tool you built, write a
sentence or two on what could go wrong if the model calls it with bad or malicious-looking
arguments, and what you did about it. Things to consider:

- **`delete_file` / `write_file`** — should the model be able to delete or overwrite
  *anything* on disk, or should you restrict these to a specific sandbox directory?
- **Calculator** — confirm your safe evaluator actually rejects something like
  `"__import__('os')"` — a raw `eval()` would not.
- **File tools in general** — what stops `filename` from being `"../../etc/passwd"` (path
  traversal)? Consider resolving the path and checking it's inside an allowed directory.
- **CSV/JSON tools** — what happens if the file doesn't exist, or the column/key doesn't?

## Step 5: Wire It Into the Agent Loop

Register your tools in a `dispatch` dict and a tools schema list, then run them through
`run_agent_loop` (or your own version of it) from the notebook. Try:

- One prompt that clearly needs just one of your tools.
- One prompt that needs a different one of your tools.
- One prompt that requires **two of your tools in sequence** (the output of one feeding
  into the next) — this is the interesting case, since it proves the loop, not just a
  single call, is doing the work.

---

## Deliverable

A notebook or `.py` file containing:

- Your Pydantic argument models for each tool
- Your tool implementations
- Your `dispatch` dict and tools list
- Output showing your 2-3 example prompts running successfully through the agent loop
- Your Step 4 guardrails write-up (a few sentences per tool is enough)

---

## Quick Checklist

- [ ] 2-3 tools chosen (at least one beyond the warm-up tier), or an original idea approved by the instructor
- [ ] Pydantic `BaseModel` written for each tool's arguments, with field descriptions
- [ ] Tool functions implemented and handle at least the obvious failure cases
- [ ] Guardrails considered and written up for each tool
- [ ] Tools registered in a dispatch dict and tools schema list
- [ ] Agent loop run successfully on 2-3 prompts, including one requiring two tools in sequence
