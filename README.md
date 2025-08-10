# Jekyll New Post Generator

A simple VS Code extension to quickly create new Jekyll blog posts with proper file name and front matter.

---

## Features

* Create a new Jekyll post with a command.
* Prompt for a post filename (default to `new-post` if empty).
* Automatically prepend current date (`YYYY-MM-DD`) to filename.
* Open a new unsaved editor with the post filename shown in the tab.
* Insert `YAML Front Matter snippet` including `layout`, `title`, `date`, and `tags`.
* Supports custom front matter templates.

---

## Usage

1. Open your Jekyll folder in VS Code.
2. Press `Ctrl+Shift+P` (`Cmd+Shift+P` on macOS) to open the Command Palette.
3. Run the command `New Jekyll Post`.
4. Enter your post filename (without date or extension).

   * If you press Enter directly without typing, the filename defaults to `new-post`.
   * Press `Esc` to cancel the process.

5. A new editor tab opens with the file named like `YYYY-MM-DD-your-post.md`.
6. The editor inserts the YAML front matter snippet, cursor stops at the `title` field.
7. After editing, save the file (`Ctrl+S` / `Cmd+S`), it will be saved to the `_posts` folder.

---

## Custom Front Matter Template

You can customize the front matter template by placing a file named `.post-matter-template` in your project root.

* The file should be a VS Code snippet-style template supporting placeholders.
* Use `${date}` to represent the post date (will be replaced automatically).
* Use `${title}` to represent the post title (will be replaced automatically).
* You can include snippet tab stops like `${1:title}`, `${2:tags}`, `${0}` for cursor navigation.

**Example `.post-matter-template`**:

```yaml
---
layout: post
title: "${1:${title}}"
date: ${date}
tags: ["${2:}"]
---
${0}
```

If `.post-matter-template` is not found, the extension will use a built-in default snippet.

---

## Notes

* The filename is sanitized by removing invalid filesystem characters.
* The date in front matter and filename is formatted like `2025-08-10 07:30:00 +0800`.
* The new post is created as an untitled file and only saved to disk when you explicitly save.
* Make sure your project contains a `_posts` directory; it will be created automatically if missing.

---

## Contributing

Feel free to open issues or pull requests for improvements.

---

## License

MIT License
