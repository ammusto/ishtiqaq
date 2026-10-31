# ishtiqaq

ishtiqaq is a tool for reading arabic manuscripts. when you come across a word whose rasm (the consonantal skeleton) is unclear, you can mark the ambiguous letters and search every possible reading at once. each match comes back with its root, a short english gloss, and links into several dictionaries.

## no backend

there is no server, database, or api behind the site. it is a plain react app (create-react-app) and all of the data lives as static files in `public/`. the browser fetches those files directly and does all of the searching and lookups itself. that means the whole thing can be hosted on any static file host, and running it locally is just:

```
npm install
npm start
```

`npm run build` produces a folder you can drop onto any static host as is.

## how a search works

1. the search form turns your input (plus any letters you marked as uncertain, and the alif, ta marbuta, prefix and suffix options) into a single regular expression.
2. it reads `db_files/index.txt` to figure out which word files could contain matches, based on the first two letters of the possible spellings.
3. each of those files is handed to `public/searchWorker.js`, a web worker that fetches the file, runs the regex against every word, and sends the matches back. running these in workers keeps the page from freezing while it scans hundreds of thousands of lines.
4. the matches are shown with their roots, a gloss from `root_definitions.txt`, and page links built from the files in `indices/`.

## data format

everything is utf-8 text or json. lines are separated by `\n`.

### word list: `public/db_files/dbfile_1.txt` to `dbfile_52.txt`

this is the main flatfile database, a list of roughly a million inflected arabic word forms and the roots they can come from. the list is sorted and split into 52 chunks of about 20,000 lines each so the browser only has to load the chunks it needs. each line is a word, a `#`, and a comma separated list of possible roots:

```
آبار#بأر
آبت#ءبت,ءبي,ءوب,ءيب
```

only the part before the `#` is tested against the search pattern.

### chunk index: `public/db_files/index.txt`

one line per chunk, giving the file path and the first and last word in that chunk:

```
db_files\dbfile_1.txt,ءدم,أحثتم
db_files\dbfile_2.txt,أحثتما,أشادا
```

### root glosses: `public/db_files/root_definitions.txt`

one line per root. the root and the english gloss are separated by `~`, and different senses inside the gloss are separated by `;`. the app splits on those semicolons to show the senses as a list.

```
أبر~to prick, sting; to pollinate (ه = a palm tree)
```

### dictionary page indices: `public/indices/*.txt`

these map roots to page numbers in the scanned dictionaries hosted on ejtaal.net, so the app can link straight to the right page. each line is `page=root`, and when a root spans several pages only the first one is kept.

```
42=أبد
43=أبر
```

the files are:

- `hw.txt`: hans wehr
- `sg.txt`: steingass
- `ll.txt`: lane's lexicon
- `ls.txt`: lane's lexicon supplement
- `ha.txt`: hava

if a root is not listed, the app falls back to the closest root that sorts before it, which usually lands on the right page or the one just before it.

### classical lexica: `public/clexica/`

the full text of five arabic dictionaries, used by the clexica page:

- `taj`: taj al-arus
- `maq`: maqayis al-lugha
- `sihah`: al-sihah
- `muhit`: al-muhit fi al-lugha
- `lisan`: lisan al-arab

each dictionary has two folders, `<name>_indices/` and `<name>_data/`.

the index folder has one file per letter of the alphabet, numbered by the letter order `أبتثجحخدذرزسشصضطظعغفقكلمنهوي` (so `_index_1.txt` is alif and `_index_28.txt` is ya). taj also has an `_index_0.txt` for a couple of entries that start with آ. each line is a headword and the json file it lives in:

```
أبد,lisan1.json
```

the data folder holds the json files. each one is an object keyed by headword, where every entry has the definition text in `def` and the printed edition's volume and page in `pg`. lisan does not have page numbers yet, so its `pg` is empty.

```json
{
  "أبد": {
    "def": "...",
    "pg": "1:34-35"
  }
}
```

to look up a root, the app picks the index file from the first letter, finds the line for the headword, then fetches that json file and reads the entry. if there is no exact match it tries a few common spelling swaps at the end of the root (ي, ى, ا and و) before giving up.

`taj_data/taj_index.txt` is an older combined index with a third column for the entry's position. the app does not use it.

## sources

the word and root list comes from a flatfile database by abdalaziz alsaydi ([root-ext-service](https://github.com/alsaydi/root-ext-service)) along with a noun list from taha zerrouki's [arramooz](https://github.com/linuxscout/arramooz/). the page indices come from [ejtaal.net](https://www.ejtaal.net). the english glosses were scraped from an ocr'd copy of hans wehr and from the [living arabic project](https://www.livingarabic.com/), and the classical lexica were scraped from al-maktaba al-shamela and [lesanarab.com](https://www.lesanarab.com/). the project was inspired by [lexiqamus](https://www.lexiqamus.com/en).
