# Personal Website

This repository contains the source code for my personal website, where I showcase my projects, experience, and blog posts.


The live site is available at: **[https://www.maimpilly.de]**

---

### Overview

This site is built using the [Astrofy](https://github.com/manuelernestog/astrofy) template and is powered by [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/).

I have customized the original template to fit my personal needs, including:
* A simplified, focused navigation (Home, Projects, Blog, CV, Contact).
* A custom-built page for my CV.
* A new contact form.
* Personalized content structure for projects and blog posts.


## How to Run This Project

This is primarily for my own reference.

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Run Development Server:**
    ```bash
    pnpm run dev
    ```

3.  **Build for Production:**
    ```bash
    pnpm build
    ```


#### Blog and Projects

Add your `md` blog post in the `/content/blog/` folder and projects in `/content/project`.

##### Blog format

Add code with this format at the top of each post file.

```js
---
title: "Demo Item 1"
description: "Item description"
pubDate: "Oct 01 2025"
heroImage: "/post.img.webp"
badge: "Featured"
tags: ["EV"]
updatedDate: "Oct 15 2025"
---
```

##### Project format

Add code with this format at the top of each project file.

```js
---
title: 'Test Project for Fun'
description: 'A simple test project to make sure the dynamic routing and content collections are working perfectly as expected on the site.'
heroImage: '/post_img.webp'
badge: 'Testing'
tags: ['Astro', 'Markdown', 'Test']
githubUrl: 'https://maimpilly.github.io'
order: 1
---
```


### License and Attribution

The original Astrofy template is open-source under the [MIT License](LICENSE). It is adapted from the [Astrofy Template](https://github.com/manuelernestog/astrofy), created by [Manuel Ernesto](https://github.com/manuelernestog).

**All personal content, including project descriptions, blog posts, and images, are my own property.**
