---
layout: page
lang: it
title: "Capitoli"
permalink: /it/chapters/
---

<article class="chapters-index">

  <h1>{{ page.title }}</h1>

<ul class="chapter-list">
  {% assign chapters = site.chapters
    | where:"lang","it"
    | sort:"order" %}

  {% for c in chapters %}
    <li>
      <a href="{{ c.url }}">{{ c.title }}</a>
    </li>
  {% endfor %}
</ul>

</article>