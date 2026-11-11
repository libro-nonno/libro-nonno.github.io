# Ricordi del Nonno – sito

Sito del libro *Ricordi del Nonno* di Pierluigi Melzani, in italiano, inglese e bagosso.
Pubblicato con GitHub Pages: **per pubblicare basta caricare le modifiche sul ramo principale** (GitHub costruisce il sito da solo in un paio di minuti).

## Dove si trova il testo

| Cartella | Contenuto | Indirizzo |
|---|---|---|
| `_chapters/` | capitoli in italiano | `/chapters/nome/` |
| `_chapters_en/` | capitoli in inglese | `/en/chapters/nome/` |
| `_chapters_bag/` | capitoli in bagosso | `/bag/chapters/nome/` |

Lo **stesso nome di file** nelle tre cartelle indica lo stesso capitolo: è così che il selettore di lingua sa dove portare il lettore.
In cima a ogni file ci sono il titolo (`title`) e la posizione nell'indice (`order`).

### Aggiungere un capitolo in bagosso
**Per ora il bagosso è nascosto** (non compare nel selettore e le sue pagine non vengono pubblicate). Per riattivarlo segui le istruzioni scritte in `_data/lingue.yml`.

Copia il nome del file italiano (per esempio `01-famiglia.md`) in `_chapters_bag/`, con in cima:

```
---
title: "Titolo in bagosso"
order: 1
---
```

Il pulsante "Bagòs" smette da solo di essere grigio per quel capitolo.

### Note, didascalie, foto
- Foto: `![descrizione della foto](/assets/img/12.png)`
- Didascalia sotto la foto: una riga di testo seguita da `{: .caption}`
- Nota dell'autore in riquadro: testo racchiuso tra `<div class="note" markdown="1">` e `</div>`

## Commenti dei lettori
1. Crea un Modulo Google con due domande: "Nome" (risposta breve) e "Messaggio" (paragrafo).
2. In Google Moduli premi **Invia → link** e copia il link.
3. Incollalo in `_config.yml` alla voce `comment_form_url`.
4. Le risposte arrivano nel foglio Google del modulo. Per pubblicarne qualcuna sul sito, copiala in `_data/commenti.yml` (dentro c'è un esempio).

## Testi dell'interfaccia
Le scritte dei pulsanti ("Capitolo successivo", "Indice"…) sono in `_data/testi.yml`.

## Anteprima sul proprio computer (facoltativa)
Serve Ruby recente (`brew install ruby`), poi nella cartella del sito:

```
bundle install
bundle exec jekyll serve
```

e apri http://localhost:4000.
