# Day 2 Worksheet — Guided Dataset Exploration

**Group size:** 2–3 students
**Time:** ~30–35 minutes working + 3–4 minutes presenting
**Tools:** Google Colab (starter notebook: `Day2-Worksheet-GuidedDatasetExploration-Starter.ipynb`) + a Google Slide or Word Doc for your findings

## The task

Pick a dataset, form a hypothesis about it *before* you look, test that
hypothesis with one chart, and figure out whether the story is as simple as
it first looks. This is EDA in miniature — the same process you used on
Titanic, but now you're the one choosing what to ask.

## 1. Pick a dataset

Browse the [Rdatasets list](https://vincentarelbundock.github.io/Rdatasets/articles/data.html)
and pick anything that looks interesting. If you're stuck, here are a few
that reliably have a good hypothesis + surprise hiding in them:

| Dataset | Package | What it's about |
|---|---|---|
| `Guerry` | `HistData` | Crime, literacy, and suicide across 1830s France |
| `Housing` | `Ecdat` | House prices vs. lot size, bedrooms, driveway access |
| `Salaries` | `carData` | Professor salary by rank, sex, and years of service |
| `Wages1` | `Ecdat` | Wages by experience, sex, and union membership |
| `Cars93` | `MASS` | Price, MPG, and horsepower across 93 car models |
| `Fertility` | `Ecdat` | Fertility rate vs. education and region |
| `mtcars` | `datasets` | Fuel economy vs. weight, cylinders, transmission |
| `Diamonds` (or `diamonds`) | `ggplot2` | Diamond price vs. carat, cut, clarity |

To load any Rdatasets dataset in Colab, use its CSV link:

```python
import pandas as pd

# Format: https://vincentarelbundock.github.io/Rdatasets/csv/<package>/<dataset>.csv
url = "https://vincentarelbundock.github.io/Rdatasets/csv/HistData/Guerry.csv"
df = pd.read_csv(url)
df.head()
```

You can find the exact package/dataset name and the URL for the "doc" page
(which explains every column) by clicking through from the Rdatasets list.

## 2. Answer these questions in your Colab notebook

Work through them **in order** — each one builds on the last. Use the
starter notebook, which has a markdown + code cell for each question.

**Q1. What is this dataset?**
Where's it from (which R package), what does one row represent, how many
rows/columns, and what time period or population does it cover?

**Q2. Before you dig in — what did you expect to find?**
Pick two variables in the dataset and write down your hypothesis about how
they relate, *before you plot anything*. This is the step people skip, and
it's the whole point.

**Q3. What did you actually find?**
Make one chart (scatter plot, bar chart, whatever fits) of those two
variables. Does it match your hypothesis in Q2?

**Q4. Was anything surprising or backwards from what you expected?**
If yes — describe the surprise in one sentence. If no — **you must** slice
the data by a third variable (a category, a subgroup, a time period) and see
if a surprise shows up there instead. Almost every dataset has a
Simpson's-Paradox-shaped surprise in it if you group by the right thing.

**Q5. Why do you think that happened?**
Is there a lurking variable, a self-selected group, a small sample size, or
something else hiding underneath the headline number? You don't need to
prove it statistically — a reasonable, well-argued guess is the goal.

**Q6. So what?**
If someone only saw the headline number (not the full dataset), what wrong
conclusion might they draw? What's the one-sentence lesson for the class?

## 3. Build your slide / doc

Make **one slide (or one page)** with:

- A 1–2 sentence dataset summary (Q1)
- Your hypothesis (Q2)
- **At least one chart** supporting your findings (Q3, and Q4 if you sliced)
- Your explanation and one-sentence lesson (Q5 + Q6)

One slide. One hypothesis. One chart. One explanation. The constraint is
the point — it forces you to find the actual story instead of dumping
every plot you made.

## 4. Present

3–4 minutes per group. Be ready to answer: "what would change your mind
about this explanation?"
