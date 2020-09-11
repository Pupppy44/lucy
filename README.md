## reddit
Simple module for **Reddit**, does **not** require any API key/login.

### Installation
**`npm i reddit`**

### Require
```
const Reddit = require('reddit');
```
### Examples
You **must** use **`.then()`** or **`async/await`** for every function. [**Learn more**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Fetch a **top post:**
```
const Post = Reddit.TopPost('memes');
```
Fetch a **random post:**
```
const Post = Reddit.RandomPost('memes');
```
