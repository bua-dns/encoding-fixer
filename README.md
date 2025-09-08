# Encoding Fix Tool

This repository contains a small Node.js script to repair text files
with broken character encodings (e.g. German umlauts shown as `Ã¤`
instead of `ä`).\
Typical cause: UTF-8 bytes misinterpreted as Latin-1 / Windows-1252.

## Features

-   Detects and repairs common *Mojibake* patterns (e.g. `Ã¶` → `ö`)
-   Converts all files from `./input` to valid UTF-8 and writes them to
    `./output`
-   Uses [`jschardet`](https://www.npmjs.com/package/jschardet) for
    heuristic charset detection and
    [`iconv-lite`](https://www.npmjs.com/package/iconv-lite) for
    decoding

## Usage

### 1. Install dependencies

```{=html}
<details>
```
```{=html}
<summary>
```
npm
```{=html}
</summary>
```
``` bash
npm install
```

```{=html}
</details>
```
```{=html}
<details>
```
```{=html}
<summary>
```
pnpm
```{=html}
</summary>
```
``` bash
pnpm install
```

```{=html}
</details>
```
### 2. Prepare input

Put your text files into the `input` folder.

### 3. Run the script

``` bash
node fix-latin-1-to-utf-8.js
```

### 4. Collect output

Corrected UTF-8 files will be written into the `output` folder.

## Example

Input (`./input/sample.ris`):

    PB  - Alfred Burkhardt (ABK Reise- und StÃ¤dtefÃ¼hrer)
    CP  - MÃ¼nchen

Output (`./output/sample.ris`):

    PB  - Alfred Burkhardt (ABK Reise- und Städteführer)
    CP  - München

## Author

Michael Müller, Digitales Netzwerk Sammlungen der Berlin University
Alliance

## License

[MIT License](https://opensource.org/licenses/MIT)
