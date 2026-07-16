# RNN / LSTM Group Project Assignment

## Overview

Your group will pick a **sequence** dataset — either time series or text — and build an RNN/LSTM in Keras to model it. You'll experiment with the hyperparameters that matter most for sequence models, then present your process and results in a short 3-slide deck.

Dataset options: [Time Series Dataset Options](#/day-5/worksheets/mlp-group-project-dataset-options) and Text Dataset Options (same page). Pick any one dataset your group finds interesting — you don't have to pick from these lists, but check with your instructor first if you want to use something else.

> **Tip: Use an AI tool throughout.** You're encouraged to use an LLM (ChatGPT, Claude, etc.) as a thinking partner at every step below — not to write your code for you, but to sanity-check your reasoning. Prompts like "here's my sequence data and what I'm trying to predict, what preprocessing would you recommend and what gotchas should I watch for?" are exactly the kind of question to ask. **Before you write any code, use AI to help you turn your EDA findings into a concrete plan** (see Step 3).

---

## Step 1: Choose Your Dataset and Get Familiar

Pick a dataset and identify which category it falls into:
- **Time series forecasting** — predicting future value(s) from past values (e.g. temperature, traffic, energy use)
- **Time series / sequence classification** — predicting a label for a whole sequence (e.g. activity recognition, ECG classification)
- **Text classification** — predicting a label for a piece of text (e.g. topic, sentiment, spam)
- **Text generation** — predicting the next token in a sequence (e.g. Tiny Shakespeare)

Note roughly how many sequences/rows you have, and how long a typical sequence is.

## Step 2: Exploratory Data Analysis (EDA)

Load the data and answer these questions:

**If time series:**
1. Plot the raw sequence(s) over time. Is there a visible trend, seasonality, or noise?
2. Is the data univariate (one variable) or multivariate (several variables recorded together)?
3. Are there missing timestamps or gaps? Any obviously bad readings?
4. What's a reasonable sampling frequency, and does it need resampling (e.g. minute-level data resampled to hourly)?
5. If forecasting, what's the target — the very next step, or several steps ahead?

**If text:**
1. How many documents/examples are there, and what does the class distribution look like (balanced or imbalanced)?
2. What's the distribution of text length (in words or characters)? Any very short or very long outliers?
3. How large is the vocabulary (unique words)? Any noisy text — typos, emojis, HTML, non-English text — that needs cleaning?
4. If classification, look at a few examples from each class. Do they look distinguishable?

## Step 3: Identify Inputs/Target and Determine Preprocessing Needs, Then Get an AI Sanity Check

Based on your EDA, answer these sequence-specific preprocessing questions:

- **Normalization (time series):** Does your numeric sequence data need scaling (e.g. `StandardScaler` or min-max) before training? Almost always yes for RNNs/LSTMs.
- **Tokenization (text):** How will you convert raw text into tokens — word-level or character-level? What vocabulary size will you use?
- **Padding/truncation:** What sequence length (or window size, for time series) will you use? How will you pad shorter sequences and truncate longer ones?
- **Embedding layer (text):** Will you train an `Embedding` layer from scratch, or use pretrained embeddings (e.g. GloVe)? What embedding dimension?
- **Windowing (time series):** How many past time steps will your model see to predict the next step(s) (your window size)?
- **Reshaping:** Keras recurrent layers expect input shaped `(samples, timesteps, features)` — how will you get your data into that shape?

**Before writing any modeling code**, take your EDA findings and draft preprocessing plan to an LLM and ask it to help you refine it. Good questions to ask:
- "Given this sequence data and target, does my tokenization/windowing/padding plan make sense?"
- "Are there gotchas specific to sequence data I should watch for — like shuffling time series before splitting, data leakage from overlapping windows, or padding token issues?"
- "For text: does my vocabulary size and embedding choice seem reasonable for this dataset size?"

Write a short summary (a few sentences) of what the AI suggested and whether your group agreed with it. You'll want this for your slides.

## Step 4: Preprocessing

Using your plan from Step 3:
- **Time series:** handle missing values/gaps, scale/normalize using statistics computed from the training portion only, and window the sequence into (X, y) pairs using your chosen window size.
- **Text:** clean the text as needed, tokenize, build your vocabulary, convert to integer sequences, and pad/truncate to your chosen sequence length.
- Reshape your data into the 3D shape Keras expects: `(samples, timesteps, features)`.

## Step 5: Train / Validation / Test Split

- **Time series:** split **chronologically** — train on the earliest portion, validate on the next, test on the most recent. Do not shuffle randomly before splitting, or you'll leak future information into training.
- **Text:** a standard random train/validation/test split is fine (e.g. 70/15/15), stratified by class if your classes are imbalanced.

Note how many sequences/rows end up in each split.

## Step 6: Build a Baseline RNN/LSTM

Build a simple Keras `Sequential` model using `SimpleRNN`, `LSTM`, or `GRU` layers as your starting point (add an `Embedding` layer first if you're working with text). Use a sensible output layer and loss function for your task (e.g. linear output + `mse` for forecasting, `softmax` + `categorical_crossentropy` for multi-class text classification, `sigmoid` + `binary_crossentropy` for binary classification).

## Step 7: Experiment with Hyperparameters

Starting from your baseline, systematically vary hyperparameters and record what happens. At minimum, try changing each of the following relevant to your dataset type (a handful of thoughtful experiments is better than a huge unfocused grid):

**Sequence-specific:**
- **Window size / sequence length** (how far back the model looks)
- **Number of recurrent layers** (1 vs. stacked 2+)
- **Recurrent layer type** (`SimpleRNN` vs. `LSTM` vs. `GRU`)
- **Units per recurrent layer**
- **Bidirectional vs. unidirectional** (if it makes sense for your task)
- **Embedding dimension and vocabulary size** (text only)

**General (same as MLPs):**
- **Learning rate**
- **Optimizer** (e.g. `adam` vs. `sgd`)
- **Batch size**
- **Epochs** (and whether the model over/underfits with more epochs)
- **Dropout / recurrent_dropout rate**
- **L2 regularization** strength

Keep a simple log (a table works well) of each experiment: what you changed, and the resulting training/validation loss and accuracy (or RMSE).

## Step 8: Track and Compare Results

For your best few configurations:
- Plot training vs. validation loss curves (and accuracy curves, if classification) over epochs.
- Build a comparison table of your hyperparameter experiments and their validation performance.
- Pick your best model based on validation performance, then evaluate it once on the held-out test set for your final reported number. For text generation (e.g. Tiny Shakespeare), include a few sample generated text snippets instead of/alongside a single metric.

---

## Deliverable: 3-Slide Presentation

Create a 3-slide PowerPoint deck summarizing your project. Suggested breakdown:

**Slide 1 — Problem & Setup**
- Dataset name, task type (forecasting / sequence classification / text classification / text generation)
- Preprocessing summary: normalization or tokenization approach, window size or sequence length, embedding choice if applicable
- Train/validation/test split sizes (and note if split chronologically)
- Brief note on what your AI sanity-check step surfaced (Step 3)

**Slide 2 — Hyperparameter Experiments**
- A table comparing the hyperparameter configurations you tried and their validation results
- Training vs. validation loss (and accuracy, if applicable) curves for at least your baseline and your best model

**Slide 3 — Final Results & Takeaways**
- Your best model's architecture and hyperparameters
- Final test set performance (RMSE/MAE for forecasting, accuracy/F1 for classification, or sample generated text) — a table or plot (e.g. predicted vs. actual sequence plot, confusion matrix)
- 2-3 takeaways: which hyperparameters mattered most, anything surprising, what you'd try next with more time

---

## Quick Checklist

- [ ] Dataset chosen and task type identified (forecasting / sequence classification / text classification / text generation)
- [ ] EDA complete (sequence plots or text length/class distributions, missing values/noise, vocabulary size if text)
- [ ] Preprocessing needs determined: normalization, tokenization, padding/truncation, embedding
- [ ] AI consulted for a preprocessing/modeling plan before coding
- [ ] Preprocessing done and data reshaped to `(samples, timesteps, features)`
- [ ] Train/validation/test split created (chronological for time series)
- [ ] Baseline RNN/LSTM built and trained
- [ ] Hyperparameters systematically experimented with and logged
- [ ] Best model selected and evaluated on test set
- [ ] 3-slide deck complete with curves, tables, and final results
