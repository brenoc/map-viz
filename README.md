# Map Viz
## Setup

```sh
npm install
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

Install Redis

Mac:
```sh
brew install redis
```

Ubuntu
```sh
sudo apt-get install redis-server
```

Add the data file to the root folder with the name `data.geojson`

## Running

Open a terminal and type:

```sh
npm start
```

Open another terminal and type:

```sh
source venv/bin/activate
python app.py
```

Run Redis
```sh
redis-server
```