# h40y.github.io

A dark, minimal Jekyll blog for GitHub Pages.

## Structure

- `_posts/` - Markdown posts
- `_layouts/` - shared page and post templates
- `index.html` - homepage and generated post index
- `styles.css` - shared dark-only visual style
- `feed.xml` - RSS feed
- `sitemap.xml` - search engine sitemap

## Writing

Create a Markdown file in `_posts/` named `YYYY-MM-DD-slug.md`. Set `title`, `date`, `description`, `summary`, and `permalink` in front matter. The homepage, RSS feed, and sitemap are generated from the posts automatically.

## Local preview

Install the local Jekyll bundle once:

```sh
bundle install
```

Then run:

```sh
bundle exec jekyll serve
```
