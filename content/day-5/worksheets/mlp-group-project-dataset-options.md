# MLP Group Project: Dataset Options

Each group picks **one dataset** below, builds a Keras MLP (`Sequential` with `Dense` layers), and experiments with hyperparameters: number of layers, units per layer, activation functions, learning rate, batch size, epochs, dropout, and regularization. All datasets here are tabular (rows of numeric/categorical features), which is what MLPs handle best — no images or raw text.

Difficulty legend: 🟢 Beginner · 🟡 Intermediate · 🔴 Advanced (extra preprocessing required)

---

## 🟢 1. Wine

Predict which of 3 cultivars a wine comes from based on 13 chemical measurements (alcohol, malic acid, flavanoids, etc.). 178 rows, no missing data.

**Source:** [UCI Machine Learning Repository - Wine](https://archive.ics.uci.edu/dataset/109/wine)

**Load in Python (via scikit-learn):**
```python
from sklearn.datasets import load_wine
data = load_wine()
X, y = data.data, data.target
```

---

## 🟢 2. Breast Cancer Wisconsin (Diagnostic)

Binary classification: predict malignant vs. benign tumor from 30 numeric features computed from digitized images of cell nuclei. 569 rows.

**Source:** [UCI Machine Learning Repository - Breast Cancer Wisconsin](https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic)

**Load in Python (via scikit-learn):**
```python
from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
X, y = data.data, data.target
```

---

## 🟢 3. Pima Indians Diabetes

Binary classification: predict onset of diabetes from 8 medical predictor variables (glucose, BMI, age, etc.). 768 rows. A good, slightly messier real-world dataset (some biologically-impossible zero values need cleaning).

**Source:** [UCI Machine Learning Repository - Pima Indians Diabetes](https://archive.ics.uci.edu/dataset/34/diabetes) (mirrored as CSV on GitHub for easy download)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.csv"
cols = ["pregnancies","glucose","bp","skin","insulin","bmi","pedigree","age","outcome"]
df = pd.read_csv(url, names=cols)
X, y = df.drop("outcome", axis=1).values, df["outcome"].values
```

---

## 🟡 4. Heart Disease (Cleveland)

Binary classification: predict presence of heart disease from 13 clinical features (age, cholesterol, chest pain type, max heart rate, etc.). 303 rows. Mix of numeric and categorical columns.

**Source:** [UCI Machine Learning Repository - Heart Disease](https://archive.ics.uci.edu/dataset/45/heart+disease)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
cols = ["age","sex","cp","trestbps","chol","fbs","restecg","thalach",
        "exang","oldpeak","slope","ca","thal","target"]
df = pd.read_csv(url, names=cols, na_values="?")
df = df.dropna()
X, y = df.drop("target", axis=1).values, (df["target"] > 0).astype(int).values
```

---

## 🟡 5. Auto MPG

Regression: predict a car's fuel efficiency (mpg) from 7 attributes (cylinders, horsepower, weight, model year, origin, etc.). 398 rows. TensorFlow's own regression tutorial uses this dataset.

**Source:** [UCI Machine Learning Repository - Auto MPG](https://archive.ics.uci.edu/dataset/9/auto+mpg) | [TensorFlow tutorial using this dataset](https://www.tensorflow.org/tutorials/keras/regression)

**Load in Python (via keras `get_file` helper):**
```python
import pandas as pd
import tensorflow as tf

url = "http://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data"
path = tf.keras.utils.get_file("auto-mpg.data", url)
cols = ["mpg","cylinders","displacement","horsepower","weight",
        "acceleration","model_year","origin"]
df = pd.read_csv(path, names=cols, na_values="?", comment="\t",
                  sep=" ", skipinitialspace=True)
df = df.dropna()
X, y = df.drop("mpg", axis=1).values, df["mpg"].values
```

---

## 🟡 6. California Housing

Regression: predict median house value for California districts from 8 features (median income, house age, rooms, location, etc.). 20,640 rows — bigger dataset, good for seeing how MLPs scale.

**Source:** [scikit-learn documentation - California Housing](https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset)

**Load in Python (via scikit-learn, no download needed):**
```python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
X, y = data.data, data.target
```

---

## 🟡 7. Wine Quality (Red & White)

Regression or classification: predict a wine's quality score (0-10) from 11 physicochemical properties (acidity, sugar, sulphates, alcohol, etc.). ~1,600 rows (red) or ~4,900 rows (white); can combine both.

**Source:** [UCI Machine Learning Repository - Wine Quality](https://archive.ics.uci.edu/dataset/186/wine+quality)

**Load in Python (via URL):**
```python
import pandas as pd
red_url = "https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv"
df = pd.read_csv(red_url, sep=";")
X, y = df.drop("quality", axis=1).values, df["quality"].values
```

---

## 🔴 8. Adult / Census Income

Binary classification: predict whether income exceeds $50K/year from census data (age, education, occupation, hours worked, etc.). ~48,842 rows with a mix of numeric and categorical columns — requires one-hot encoding and is noticeably class-imbalanced.

**Source:** [UCI Machine Learning Repository - Adult](https://archive.ics.uci.edu/dataset/2/adult)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data"
cols = ["age","workclass","fnlwgt","education","education_num","marital_status",
        "occupation","relationship","race","sex","capital_gain","capital_loss",
        "hours_per_week","native_country","income"]
df = pd.read_csv(url, names=cols, na_values=" ?", skipinitialspace=True)
df = df.dropna()
df = pd.get_dummies(df, columns=[c for c in df.columns if df[c].dtype == "object" and c != "income"])
X = df.drop("income", axis=1).values
y = (df["income"] == ">50K").astype(int).values
```

---

## 🔴 9. Abalone

Regression or multi-class classification: predict the age of an abalone (via number of rings) from 8 physical measurements (length, weight, sex, etc.). 4,177 rows. One categorical column (sex) to encode; target can be treated as continuous (regression) or bucketed (classification).

**Source:** [UCI Machine Learning Repository - Abalone](https://archive.ics.uci.edu/dataset/1/abalone)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/abalone/abalone.data"
cols = ["sex","length","diameter","height","whole_weight",
        "shucked_weight","viscera_weight","shell_weight","rings"]
df = pd.read_csv(url, names=cols)
df = pd.get_dummies(df, columns=["sex"])
X, y = df.drop("rings", axis=1).values, df["rings"].values
```

---

## 🔴 10. Bank Marketing

Binary classification: predict whether a client subscribes to a term deposit after a marketing campaign. 45,211 rows, mostly categorical features, and strongly class-imbalanced (~11% positive) — a good dataset for discussing accuracy vs. precision/recall.

**Source:** [UCI Machine Learning Repository - Bank Marketing](https://archive.ics.uci.edu/dataset/222/bank+marketing)

**Load in Python (via URL, zipped CSV):**
```python
import pandas as pd
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00222/bank.zip"
df = pd.read_csv(url, sep=";", compression="zip")
# quick fix: pandas needs the inner filename when reading directly from a zip with multiple files;
# if this errors, download & unzip bank.zip locally and read "bank-full.csv" instead
df = pd.get_dummies(df, columns=[c for c in df.columns if df[c].dtype == "object" and c != "y"])
X = df.drop("y_yes", axis=1).values if "y_yes" in df.columns else df.drop([c for c in df.columns if c.startswith("y_")], axis=1).values
y = df["y_yes"].values if "y_yes" in df.columns else None
```

---

## 🟢 11. Seeds (Wheat Kernels)

Classification: identify which of 3 wheat varieties a kernel belongs to based on 7 geometric measurements (area, perimeter, compactness, etc.). 210 rows, small and clean — a good simple starter dataset.

**Source:** [UCI Machine Learning Repository - Seeds](https://archive.ics.uci.edu/dataset/236/seeds)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00236/seeds_dataset.txt"
cols = ["area","perimeter","compactness","kernel_length","kernel_width",
        "asymmetry","kernel_groove_length","variety"]
df = pd.read_csv(url, names=cols, sep=r"\s+")
X, y = df.drop("variety", axis=1).values, (df["variety"] - 1).values
```

---

## 🟢 12. Ionosphere

Binary classification: predict "good" vs. "bad" radar returns from the ionosphere based on 34 numeric signal features. 351 rows, all numeric, no missing values.

**Source:** [UCI Machine Learning Repository - Ionosphere](https://archive.ics.uci.edu/dataset/52/ionosphere)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/ionosphere/ionosphere.data"
df = pd.read_csv(url, header=None)
X = df.iloc[:, :-1].values
y = (df.iloc[:, -1] == "g").astype(int).values
```

---

## 🟡 13. Sonar (Mines vs. Rocks)

Binary classification: distinguish sonar signals bounced off a metal cylinder (mine) from those bounced off a rock, using 60 numeric frequency-band energy features. 208 rows — small sample size with many features makes overfitting an interesting discussion point.

**Source:** [UCI Machine Learning Repository - Connectionist Bench (Sonar, Mines vs. Rocks)](https://archive.ics.uci.edu/dataset/151/connectionist+bench+sonar+mines+vs+rocks)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/undocumented/connectionist-bench/sonar/sonar.all-data"
df = pd.read_csv(url, header=None)
X = df.iloc[:, :-1].values
y = (df.iloc[:, -1] == "M").astype(int).values
```

---

## 🟡 14. Concrete Compressive Strength

Regression: predict the compressive strength of concrete from 8 features describing its mix (cement, water, aggregate, age, etc.). 1,030 rows, all numeric, no missing values — a clean engineering regression problem.

**Source:** [UCI Machine Learning Repository - Concrete Compressive Strength](https://archive.ics.uci.edu/dataset/165/concrete+compressive+strength)

**Load in Python (via `ucimlrepo` package, or direct Excel download):**
```python
# pip install ucimlrepo
from ucimlrepo import fetch_ucirepo
data = fetch_ucirepo(id=165)
X, y = data.data.features.values, data.data.targets.values.ravel()
```

---

## 🟡 15. Energy Efficiency

Regression: predict a building's heating load and cooling load from 8 architectural features (surface area, wall area, glazing area, orientation, etc.). 768 rows, two possible regression targets — good for discussing multi-output regression.

**Source:** [UCI Machine Learning Repository - Energy Efficiency](https://archive.ics.uci.edu/dataset/242/energy+efficiency)

**Load in Python (via `ucimlrepo` package):**
```python
# pip install ucimlrepo
from ucimlrepo import fetch_ucirepo
data = fetch_ucirepo(id=242)
X = data.data.features.values
y = data.data.targets.values  # 2 columns: heating load, cooling load
```

---

## 🟡 16. Bike Sharing (Daily)

Regression: predict daily bike rental counts from weather and calendar features (season, temperature, humidity, windspeed, holiday, etc.). 731 rows — a nice time-adjacent but still tabular regression task.

**Source:** [UCI Machine Learning Repository - Bike Sharing Dataset](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset)

**Load in Python (via URL, zipped CSV):**
```python
import pandas as pd
url = "https://archive.ics.uci.edu/static/public/275/bike+sharing+dataset.zip"
df = pd.read_csv(url, compression="zip")  # if this errors, download & unzip, then read "day.csv"
X = df.drop(columns=["instant","dteday","casual","registered","cnt"]).values
y = df["cnt"].values
```

---

## Suggested workflow for every group

1. Load and explore the data (shape, missing values, class balance).
2. Preprocess: handle missing values, encode categorical columns, **scale/normalize numeric features** (important for MLPs — use `StandardScaler` or `Normalization`).
3. Split into train/validation/test sets.
4. Build a baseline Keras `Sequential` MLP.
5. Experiment with hyperparameters: number of hidden layers, units per layer, activation (`relu`, `tanh`), learning rate, optimizer, batch size, epochs, dropout rate, L2 regularization.
6. Track and compare results (accuracy/loss curves, or RMSE for regression tasks).
7. Present: which architecture worked best, and why they think so.

---

# RNN / LSTM Group Project: Time Series Dataset Options

For groups tackling sequence models, pick **one dataset** below and build a Keras RNN/LSTM (`SimpleRNN`, `LSTM`, or `GRU` layers). These break into two task types: **forecasting** (predict the next value(s) in a sequence) and **sequence classification** (predict a label for an entire sequence). Same difficulty legend as above.

---

## 🟢 1. Monthly Airline Passengers

Forecasting: predict future monthly totals of international airline passengers from historical monthly counts, 1949-1960. 144 rows, univariate, the classic "hello world" of time series forecasting — clear trend and seasonality.

**Source:** [Datasets used in Time Series Forecasting on MachineLearningMastery.com (Jason Brownlee)](https://github.com/jbrownlee/Datasets)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url)
series = df["Passengers"].values  # univariate sequence to window into (X, y) pairs
```

---

## 🟢 2. Monthly Sunspots

Forecasting: predict future monthly sunspot counts from over 250 years of historical observations (starting 1749). ~3,000 rows, univariate, noisier and less seasonal than airline passengers — a good next step up.

**Source:** [Datasets used in Time Series Forecasting on MachineLearningMastery.com (Jason Brownlee)](https://github.com/jbrownlee/Datasets)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/monthly-sunspots.csv"
df = pd.read_csv(url)
series = df["Sunspots"].values
```

---

## 🟢 3. Daily Minimum Temperatures (Melbourne)

Forecasting: predict tomorrow's minimum temperature in Melbourne, Australia from 10 years of daily readings (1981-1990). ~3,650 rows, univariate with strong yearly seasonality — good for comparing window sizes.

**Source:** [Datasets used in Time Series Forecasting on MachineLearningMastery.com (Jason Brownlee)](https://github.com/jbrownlee/Datasets)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/daily-min-temperatures.csv"
df = pd.read_csv(url)
series = df["Temp"].values
```

---

## 🟡 4. Individual Household Electric Power Consumption

Forecasting: predict future household electricity usage from minute-level power readings collected over almost 4 years (2006-2010) in a house near Paris. ~2.07M rows (commonly resampled to hourly/daily), multivariate (active power, reactive power, voltage, sub-metering by room) — a widely-used LSTM tutorial dataset. Has some missing values to clean.

**Source:** [UCI Machine Learning Repository - Individual Household Electric Power Consumption](https://archive.ics.uci.edu/dataset/235/individual+household+electric+power+consumption)

**Load in Python (via `ucimlrepo` package, or direct zip download):**
```python
# pip install ucimlrepo
from ucimlrepo import fetch_ucirepo
data = fetch_ucirepo(id=235)
df = data.data.features
df = df.dropna()
# resample to hourly means before windowing into sequences, e.g. df.resample("h").mean()
```

---

## 🟡 5. Metro Interstate Traffic Volume

Forecasting: predict hourly westbound I-94 traffic volume (between Minneapolis and St. Paul, MN) from weather conditions and holiday flags, 2012-2018. ~48,200 rows, multivariate (temperature, rain, snow, cloud cover, holiday) — good for discussing exogenous features alongside the sequence itself.

**Source:** [UCI Machine Learning Repository - Metro Interstate Traffic Volume](https://archive.ics.uci.edu/dataset/492/metro+interstate+traffic+volume)

**Load in Python (via `ucimlrepo` package):**
```python
# pip install ucimlrepo
from ucimlrepo import fetch_ucirepo
data = fetch_ucirepo(id=492)
X, y = data.data.features, data.data.targets  # y = traffic_volume
```

---

## 🟡 6. Beijing PM2.5 Air Quality

Forecasting: predict hourly PM2.5 air pollution concentration in Beijing from meteorological readings (dew point, temperature, pressure, wind, rain/snow hours), 2010-2014. 43,824 rows, multivariate — has missing PM2.5 values in the first 24 hours that need handling.

**Source:** [UCI Machine Learning Repository - Beijing PM2.5 Data](https://archive.ics.uci.edu/dataset/381/beijing+pm2+5+data)

**Load in Python (via `ucimlrepo` package):**
```python
# pip install ucimlrepo
from ucimlrepo import fetch_ucirepo
data = fetch_ucirepo(id=381)
df = data.data.features.join(data.data.targets)
df = df.dropna(subset=["pm2.5"])
```

---

## 🔴 7. Jena Climate

Forecasting: predict future weather conditions (e.g. temperature) from 14 meteorological variables recorded every 10 minutes at a weather station in Jena, Germany, 2009-2016. ~420,000 rows — a large, richly multivariate dataset used directly in the official Keras/TensorFlow time series tutorials.

**Source:** [Keras documentation - Timeseries forecasting for weather prediction](https://keras.io/examples/timeseries/timeseries_weather_forecasting/) | [TensorFlow tutorial - Time series forecasting](https://www.tensorflow.org/tutorials/structured_data/time_series)

**Load in Python (via keras `get_file` helper):**
```python
import pandas as pd
import tensorflow as tf

zip_path = tf.keras.utils.get_file(
    origin="https://storage.googleapis.com/tensorflow/tf-keras-datasets/jena_climate_2009_2016.csv.zip",
    fname="jena_climate_2009_2016.csv.zip",
    extract=True,
)
csv_path, _ = os.path.splitext(zip_path)
df = pd.read_csv(csv_path)
```

---

## 🔴 8. UCI HAR (Human Activity Recognition Using Smartphones)

Sequence classification (not forecasting): predict which of 6 activities (walking, walking upstairs/downstairs, sitting, standing, laying) a person is doing from smartphone accelerometer + gyroscope readings. 10,299 windowed samples of 2.56s each — a good "many-to-one" LSTM classification task, distinct from the forecasting datasets above.

**Source:** [UCI Machine Learning Repository - Human Activity Recognition Using Smartphones](https://archive.ics.uci.edu/dataset/240/human+activity+recognition+using+smartphones)

**Load in Python (via `ucimlrepo` package for the pre-extracted feature version):**
```python
# pip install ucimlrepo
from ucimlrepo import fetch_ucirepo
data = fetch_ucirepo(id=240)
X, y = data.data.features.values, data.data.targets.values.ravel()
# Note: for a "true" sequence-in/sequence-out LSTM (rather than pre-extracted features),
# download the raw Inertial Signals folder from the dataset zip instead.
```

---

## 🔴 9. ECG5000

Sequence classification: label each 140-timestep heartbeat trace from ECG recordings as normal or one of 4 abnormality types. 5,000 sequences — small, fast to train, but heavily class-imbalanced (great for discussing precision/recall on imbalanced sequence data).

**Source:** [Time Series Classification Website - ECG5000](https://www.timeseriesclassification.com/description.php?Dataset=ECG5000) (from the UCR/UEA Time Series Classification Archive)

**Load in Python (via URL, hosted mirror in .txt/arff form on the UCR archive site — download the zip and read the train/test files, or use `aeon`):**
```python
# pip install aeon
from aeon.datasets import load_classification
X, y = load_classification("ECG5000")  # downloads and caches automatically
```

---

## Suggested workflow for RNN/LSTM groups

1. Load the sequence and (for forecasting) decide on a window size — how many past steps predict the next step(s).
2. Split chronologically into train/validation/test (never shuffle time series randomly before splitting).
3. Scale/normalize using statistics from the training set only.
4. Reshape data into the 3D shape Keras expects: `(samples, timesteps, features)`.
5. Build a baseline `SimpleRNN`, `LSTM`, or `GRU` model.
6. Experiment with hyperparameters: window size, number of recurrent layers, units per layer, dropout/recurrent_dropout, learning rate, batch size, and stacking recurrent layers vs. adding `Dense` layers on top.
7. Compare results (loss curves, RMSE for forecasting, accuracy/F1 for classification) and discuss why certain settings helped or hurt.

---

# RNN / LSTM Group Project: Text Dataset Options

For groups who want to work with text instead of numeric time series, pick **one dataset** below. Text needs an extra preprocessing step before it reaches an RNN/LSTM: tokenize, convert to integer sequences, pad to a fixed length, then optionally pass through an `Embedding` layer before the recurrent layers. (The IMDB movie review dataset is skipped here since it's already been used as a worked example.)

---

## 🟢 1. Reuters Newswire Topic Classification

Multi-class classification: classify short newswire articles into 46 mutually exclusive topics (e.g. earnings, acquisitions, trade). ~11,000 articles, already tokenized into integer sequences — built directly into Keras, no download or cleanup needed. A good first text dataset since loading is trivial and the focus can stay on the RNN itself.

**Source:** [Keras documentation - Reuters newswire classification dataset](https://keras.io/api/datasets/reuters/)

**Load in Python (via Keras, no download needed):**
```python
from tensorflow.keras.datasets import reuters
(X_train, y_train), (X_test, y_test) = reuters.load_data(num_words=10000)
# X entries are already lists of word-index integers; pad with keras.preprocessing.sequence.pad_sequences
```

---

## 🟢 2. SMS Spam Collection

Binary classification: label raw SMS text messages as spam or ham (legitimate). 5,574 messages — short texts, clean labels, a gentle first dataset for going from raw strings to padded sequences yourself.

**Source:** [UCI Machine Learning Repository - SMS Spam Collection](https://archive.ics.uci.edu/dataset/228/sms+spam+collection)

**Load in Python (via `ucimlrepo` package):**
```python
# pip install ucimlrepo
from ucimlrepo import fetch_ucirepo
data = fetch_ucirepo(id=228)
df = data.data.features.join(data.data.targets)
texts, labels = df["message"].values, (df["label"] == "spam").astype(int).values
```

---

## 🟢 3. AG News

Multi-class classification: classify news articles into 4 topics (World, Sports, Business, Sci/Tech) from headline + short description. 120,000 training / 7,600 test articles — a step up from Reuters in text length while still being a clean, well-balanced classification task.

**Source:** [Hugging Face - fancyzhx/ag_news](https://huggingface.co/datasets/fancyzhx/ag_news)

**Load in Python (via Hugging Face `datasets` library):**
```python
# pip install datasets
from datasets import load_dataset
ds = load_dataset("fancyzhx/ag_news")
train_texts, train_labels = ds["train"]["text"], ds["train"]["label"]
```

---

## 🟡 4. BBC News Article Classification

Multi-class classification: classify full-length BBC news articles into 5 topics (business, entertainment, politics, sport, tech). 2,225 articles — longer documents than AG News, so a good dataset for discussing sequence length / truncation trade-offs.

**Source:** [Original dataset - Insight Centre, UCD (Greene & Cunningham)](http://mlg.ucd.ie/datasets/bbc.html) (mirrored as a ready-to-use CSV on GitHub)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://raw.githubusercontent.com/mdsohaib/BBC-News-Classification/master/bbc-text.csv"
df = pd.read_csv(url)
texts, labels = df["text"].values, df["category"].values
```

---

## 🟡 5. Twitter US Airline Sentiment

3-class sentiment classification: label tweets directed at US airlines as positive, neutral, or negative, from February 2015. 14,640 tweets — short, informal text (slang, hashtags, typos) that's noisier than movie reviews, and a 3-class target instead of binary.

**Source:** [Kaggle - Twitter US Airline Sentiment (Crowdflower)](https://www.kaggle.com/datasets/crowdflower/twitter-airline-sentiment) (mirrored as a CSV on GitHub for easy no-login download)

**Load in Python (via URL):**
```python
import pandas as pd
url = "https://raw.githubusercontent.com/satyajeetkrjha/kaggle-Twitter-US-Airline-Sentiment-/master/Tweets.csv"
df = pd.read_csv(url)
texts, labels = df["text"].values, df["airline_sentiment"].values
```

---

## 🟡 6. Yelp Review Polarity

Binary sentiment classification: label Yelp business reviews as positive or negative (derived from star ratings). 560,000 training / 38,000 test reviews — same task type as IMDB but a different domain and much larger, so a good dataset for discussing how to handle bigger corpora and longer training times.

**Source:** [Hugging Face - fancyzhx/yelp_polarity](https://huggingface.co/datasets/fancyzhx/yelp_polarity)

**Load in Python (via Hugging Face `datasets` library):**
```python
# pip install datasets
from datasets import load_dataset
ds = load_dataset("fancyzhx/yelp_polarity")
train_texts, train_labels = ds["train"]["text"], ds["train"]["label"]
# consider ds["train"].select(range(20000)) to start with a manageable subset
```

---

## 🔴 7. Sentiment140

Binary sentiment classification: label tweets as positive or negative using emoticon-based auto-labeling (no manual annotation). 1.6 million tweets — very large, informal, and noisier than curated datasets, good for discussing label quality and dataset size trade-offs. Requires a free Kaggle account to download.

**Source:** [Kaggle - Sentiment140 dataset with 1.6 million tweets](https://www.kaggle.com/datasets/kazanova/sentiment140)

**Load in Python (via `kagglehub`, requires Kaggle account + API token):**
```python
# pip install kagglehub
import kagglehub
import pandas as pd

path = kagglehub.dataset_download("kazanova/sentiment140")
df = pd.read_csv(f"{path}/training.1600000.processed.noemoticon.csv",
                  encoding="latin-1", header=None,
                  names=["target","id","date","flag","user","text"])
texts, labels = df["text"].values, (df["target"] == 4).astype(int).values
```

---

## 🔴 8. Jigsaw Toxic Comment Classification

Multi-label classification: label Wikipedia talk-page comments across 6 (non-exclusive) toxicity categories — toxic, severe_toxic, obscene, threat, insult, identity_hate. ~159,000 comments — a good dataset for introducing multi-label output layers (`sigmoid` + `binary_crossentropy` per label instead of a single softmax). Requires a free Kaggle account.

**Source:** [Kaggle - Jigsaw Toxic Comment Classification Challenge](https://www.kaggle.com/competitions/jigsaw-toxic-comment-classification-challenge)

**Load in Python (via `kagglehub`, requires Kaggle account + API token):**
```python
# pip install kagglehub
import kagglehub
import pandas as pd

path = kagglehub.dataset_download("julian3833/jigsaw-toxic-comment-classification-challenge")
df = pd.read_csv(f"{path}/train.csv")
texts = df["comment_text"].values
labels = df[["toxic","severe_toxic","obscene","threat","insult","identity_hate"]].values
```

---

## 🔴 9. Tiny Shakespeare (Text Generation)

Different task type — character-level text generation: train an LSTM to predict the next character given the preceding ones, then use it to generate new "Shakespeare-like" text. ~1.1MB of Shakespeare's plays as one continuous string. Conceptually different from the classification datasets above (sequence-to-sequence rather than sequence-to-label) — best for a group that wants an extra challenge.

**Source:** [TensorFlow tutorial - Text generation with an RNN](https://www.tensorflow.org/text/tutorials/text_generation)

**Load in Python (via keras `get_file` helper):**
```python
import tensorflow as tf

path = tf.keras.utils.get_file(
    "shakespeare.txt",
    "https://storage.googleapis.com/download.tensorflow.org/data/shakespeare.txt",
)
text = open(path, "rb").read().decode(encoding="utf-8")
```

---

## Suggested workflow for text groups

1. Load the raw text and labels; look at class balance and typical text length.
2. Tokenize (e.g. `keras.preprocessing.text.Tokenizer` or `TextVectorization`), convert to integer sequences.
3. Pad/truncate sequences to a fixed length (`pad_sequences`).
4. Add an `Embedding` layer before the recurrent layers (either trainable from scratch, or initialized with pretrained vectors like GloVe).
5. Build a baseline `SimpleRNN`, `LSTM`, or `GRU` model (stacked or bidirectional are both worth trying).
6. Experiment with hyperparameters: vocabulary size, embedding dimension, sequence length, recurrent units, dropout/recurrent_dropout, learning rate, batch size.
7. Compare results (accuracy/F1 for classification, perplexity/sample generations for Tiny Shakespeare) and discuss what helped or hurt.
