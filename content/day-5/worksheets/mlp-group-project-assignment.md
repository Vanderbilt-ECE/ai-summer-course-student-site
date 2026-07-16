# MLP Group Project Assignment

## Overview

Your group will pick a tabular dataset, build a Multilayer Perceptron (MLP) in Keras to model it, and experiment with hyperparameters to see how they affect performance. You'll finish by presenting your process and results in a short 3-slide deck.

Dataset options: [MLP Dataset Options list](#/day-5/worksheets/mlp-group-project-dataset-options). Pick any one dataset your group finds interesting — you don't have to pick from this list, but check with your instructor first if you want to use something else.

> **Tip: Use an AI tool throughout.** You're encouraged to use an LLM (ChatGPT, Claude, etc.) as a thinking partner at every step below — not to write your code for you, but to sanity-check your reasoning. Prompts like "here's a description of my dataset's columns, what preprocessing would you recommend and what gotchas should I watch for?" are exactly the kind of question to ask. **Before you write any code, use AI to help you turn your EDA findings into a concrete plan** (see Step 3).

---

## Step 1: Choose Your Dataset and Get Familiar

Pick a dataset. Read its description and note:
- What is each row? What do the columns represent?
- Is this a classification problem or a regression problem?
- Roughly how many rows and columns does it have?

## Step 2: Exploratory Data Analysis (EDA)

Load the data and answer these questions with code, plots, or summary tables:

1. **Shape and types** — How many rows/columns? What data type is each column (numeric, categorical, text, date)?
2. **Missing values** — Are there any? Which columns? How will you handle them (drop rows, drop columns, impute)?
3. **Target distribution** — If classification: is it balanced or imbalanced across classes? If regression: what does the distribution of the target look like (histogram) — skewed, normal, has outliers?
4. **Feature distributions** — Plot histograms or boxplots for a few key numeric features. Any obvious outliers or strange values (e.g. zeros where they shouldn't be)?
5. **Relationships** — Do any features look correlated with each other, or with the target? A correlation heatmap or a few scatter plots is enough.
6. **Categorical features** — If any columns are categorical/text, how many unique values does each have? Will they need encoding?

## Step 3: Identify Features and Target, Then Get an AI Sanity Check

Based on your EDA:
- Write down your **tentative list of input features** — which columns will you feed into the model, and which will you drop (and why)?
- State your **output target** clearly — the column you're predicting, and whether this is classification or regression.

**Before writing any modeling code**, take your EDA findings (column list, target, missing values, distributions, anything unusual you noticed) to an LLM and ask it to help you build a plan. Good questions to ask:
- "Given these features and this target, what preprocessing steps would you recommend before training an MLP?"
- "Are there any gotchas in this kind of data that could bite me — data leakage, class imbalance, scaling issues, encoding pitfalls?"
- "Does my plan for splitting the data and normalizing features make sense?"

Write a short summary (a few sentences) of what the AI suggested and whether your group agreed with it. You'll want this for your slides.

## Step 4: Preprocessing

Using your plan from Step 3:
- Handle missing values as decided.
- Encode categorical columns (e.g. one-hot encoding) if needed.
- **Scale/normalize your numeric features.** MLPs are sensitive to feature scale, so use `StandardScaler` (zero mean, unit variance) or min-max `Normalization` — fit the scaler on training data only, then apply it to validation/test data.
- If your target is a regression target with a skewed distribution, discuss whether a transform (e.g. log) might help — this is optional but worth considering.

## Step 5: Train / Validation / Test Split

Split your data into three sets — for example 70% train / 15% validation / 15% test. Use the validation set to tune hyperparameters and the test set only at the very end to report final performance. Note how many rows end up in each split.

## Step 6: Build a Baseline MLP

Build a simple Keras `Sequential` MLP with `Dense` layers as your starting point. Use a sensible output layer for your task (e.g. `sigmoid` for binary classification, `softmax` for multi-class, no activation/`linear` for regression), and a matching loss function (`binary_crossentropy`, `categorical_crossentropy`, or `mse`/`mae`).

## Step 7: Experiment with Hyperparameters

Starting from your baseline, systematically vary hyperparameters and record what happens. At minimum, try changing each of the following (you don't need every combination — a handful of thoughtful experiments is better than a huge unfocused grid):

- **Number of hidden layers** (e.g. 1 vs. 2 vs. 3)
- **Units per layer** (e.g. 16 vs. 64 vs. 256)
- **Activation function** (`relu` vs. `tanh`)
- **Learning rate**
- **Optimizer** (e.g. `adam` vs. `sgd`)
- **Batch size**
- **Epochs** (and whether the model over/underfits with more epochs)
- **Dropout rate**
- **L2 regularization** strength

Keep a simple log (a table works well) of each experiment: what you changed, and the resulting training/validation loss and accuracy (or RMSE).

## Step 8: Track and Compare Results

For your best few configurations:
- Plot training vs. validation loss curves (and accuracy curves, if classification) over epochs.
- Build a comparison table of your hyperparameter experiments and their validation performance.
- Pick your best model based on validation performance, then evaluate it once on the held-out test set for your final reported number.

---

## Deliverable: 3-Slide Presentation

Create a 3-slide PowerPoint deck summarizing your project. Suggested breakdown:

**Slide 1 — Problem & Setup**
- Dataset name and what it's about; classification or regression
- Final input features used and the output target
- Preprocessing summary (scaling method, encoding, how missing values were handled)
- Train/validation/test split sizes
- Brief note on what your AI sanity-check step surfaced (Step 3)

**Slide 2 — Hyperparameter Experiments**
- A table comparing the hyperparameter configurations you tried and their validation results
- Training vs. validation loss (and accuracy, if applicable) curves for at least your baseline and your best model

**Slide 3 — Final Results & Takeaways**
- Your best model's architecture and hyperparameters
- Final test set performance (accuracy/precision/recall for classification, or RMSE/MAE for regression) — a table or a plot (e.g. confusion matrix, or predicted vs. actual scatter plot for regression)
- 2-3 takeaways: which hyperparameters mattered most, anything surprising, what you'd try next with more time

---

## Quick Checklist

- [ ] Dataset chosen and understood
- [ ] EDA complete (shape, missing values, target distribution, feature distributions, relationships, categorical columns)
- [ ] Features and target identified
- [ ] AI consulted for a preprocessing/modeling plan before coding
- [ ] Preprocessing done (missing values, encoding, scaling)
- [ ] Train/validation/test split created
- [ ] Baseline MLP built and trained
- [ ] Hyperparameters systematically experimented with and logged
- [ ] Best model selected and evaluated on test set
- [ ] 3-slide deck complete with curves, tables, and final results
