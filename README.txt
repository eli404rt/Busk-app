Busk-app
========

This is a Next.js-based web application for creative writing, journaling, and interactive posts. It features a typewriter effect, dynamic post generation from Markdown files, and a unique 'whoami' interactive page.

Features:
- Dynamic blog/journal posts generated from Markdown (.md) files in the codebase.
- To add a new post, simply add a new .md file to the appropriate directory (e.g., /journal/ or /posts/).
- On the next production build, all .md files are parsed and rendered as posts.
- Typewriter effect and interactive UI for the 'whoami' page.
- Modern, accessible, and responsive design using Tailwind CSS.

How to add a new post:
1. Create a new Markdown (.md) file in the designated posts directory (e.g., /journal/ or /posts/).
2. The filename (without extension) will be used as the post slug.
3. On the next build, the new post will be available on the site.

Development:
- Built with Next.js, React, and Tailwind CSS.
- Custom components for blog, journal, and interactive features.

