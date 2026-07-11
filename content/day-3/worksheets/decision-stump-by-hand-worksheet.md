# Decision Stump by Hand — Worksheet

**Form a team of 2–3.** Your team's job is to find the single best rule for predicting `Survived` from the [Titanic Sample Data](#/day-3/worksheets/titanic-sample-data) — and prove it.

A "rule" is one simple test you can apply to every passenger, like:

- *If Sex = female → predict survived, else → predict died*
- *If Pclass = 1 → predict survived, else → predict died*
- *If Age < 16 → predict survived, else → predict died*

You can also **combine two features into one rule**, like:

- *If Pclass = 1 AND Age < 40 → predict survived, else → predict died*

This is a competition: every team is trying to beat every other team. The winning rule is whichever gets the most passengers right out of 20.

## Step 1: Try at least three different rules

For each rule, apply it to all 20 rows, count how many it gets right, and record it below.

| Rule | Correct / 20 | Accuracy |
|---|---|---|
| | | |
| | | |
| | | |

## Step 2: Try combining two features

Pick two features (e.g. Pclass + Age, Sex + Fare, SibSp + Pclass) and write a rule that uses both. Record it the same way.

| Rule | Correct / 20 | Accuracy |
|---|---|---|

## Step 3: Pick your team's best rule

Write your single best-performing rule here, and show your work — list which of the 20 passengers it gets wrong.

**Best rule:**

**Correct:** _____ / 20 (_____%)

**Rows it gets wrong:**

## Step 4: Class competition

When time is called, report your best rule and its accuracy to the class. Be ready to explain it — the class will check your count.

## Step 5: Discuss

1. What was the winning rule, and why do you think it worked best?
2. Did combining two features beat every single-feature rule? Why or why not?
3. Could any rule get 20/20? Why or why not?
4. If you had a 21st passenger with no `Survived` label, would you trust your rule to predict it? What would make you more or less confident?
