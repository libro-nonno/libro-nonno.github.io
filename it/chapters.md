---
layout: page
lang: it
title: "Capitoli"
permalink: /it/chapters/
---

<ul class="chapter-list">
  {% assign chapters = site.pages | where:"lang","it" | where_exp:"p","p.path contains '_chapters'" | sort:"order" %}
  {% for c in chapters %}
    <li>
      <a href="{{ c.url }}">{{ c.title }}</a>
    </li>
  {% endfor %}
</ul>
