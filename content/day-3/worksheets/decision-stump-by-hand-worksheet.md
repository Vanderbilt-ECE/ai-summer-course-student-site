# Decision Stump by Hand — Worksheet

A decision stump is the simplest possible decision tree: one split, on one feature, at one threshold. It asks: *of all the ways to divide this data, which one separates the classes most cleanly?* That's exactly what you're about to do by hand.

Use the [Titanic Sample Data](#/day-3/worksheets/titanic-sample-data) — 20 passengers, three columns: `Sex`, `Pclass`, `Survived`.

## Step 1: Try a split on Sex

Rule: **if Sex = female → predict survived, else → predict died.**

Count how many of the 20 passengers this rule gets right.

- Correct predictions: _____ / 20
- Accuracy: _____%

## Step 2: Try a split on Pclass

Rule: **if Pclass = 1 → predict survived, else → predict died.**

Count how many of the 20 passengers this rule gets right.

- Correct predictions: _____ / 20
- Accuracy: _____%

## Step 3: Compare

- Which split had higher accuracy?
- Write out the rows your best rule got wrong. What do they have in common?

## Step 4: Discuss

1. Why does one feature split the data better than the other?
2. Could you ever get 100% accuracy with a single rule on this data? Why or why not?
3. If you could add a second rule on top of your first one, what would it be — and which rows would it fix?
