# Teachable Machine Worksheet

**Group activity.** Every group trains the same 3-class problem: **Thumbs Up / Thumbs Down / Open Hand** using [Google Teachable Machine](https://teachablemachine.withgoogle.com).

## Phase 1: Collect Training Data (10 min)

- Open Teachable Machine, start a new Image Project
- Name your 3 classes: Thumbs Up, Thumbs Down, Open Hand
- Record at least 80–100 images per class using the webcam
- Vary your examples: different angles, lighting, distances, backgrounds

> If all your "thumbs up" photos are taken against the same white wall, the model might learn "white background" instead of "thumbs up." Try different backgrounds, lighting conditions, and distances.

## Phase 2: Train (5 min)

- Click "Train Model"
- Watch the loss go down in real time in the training panel
- Note how many epochs it ran and when it stopped

**Epochs trained:** _____

## Phase 3: Test Your Own Model (5 min)

- Use the Preview panel to test your model in real time
- Does it work? How confident is it?
- Note one case where it already fails with your own hand

**Failure case observed:**

## Phase 4: Cross-Group Challenge (15 min)

Rotate to another group's machine and try to break their model — different hand positions, angles, lighting, backgrounds. Record what causes failures and what doesn't.

**Group tested:** _____

**What worked / what broke:**

## Phase 5: Reflect

**Part 1: Your Model**
- How many training images did you collect per class?
- What variation did you intentionally include (angles, distances, backgrounds)?
- How well did it work when your own group tested it?

**Part 2: Cross-Group Results**
- Which other group's machine did you test? Did their model recognize your hand?
- Describe one failure you caused. What did you try?
- Why do you think it failed? (Different skin tone? Background? Angle? Lighting?)

**Part 3: Connecting to Today's Concepts**
- What does "training set" mean for your Teachable Machine project?
- Did you notice the loss going down during training? What does that tell you?
- Why did two groups training the exact same task end up with models that behave differently when tested on each other?

**Part 4: Fixing It**
- What would you change about your training data to make your model harder for other groups to break?
