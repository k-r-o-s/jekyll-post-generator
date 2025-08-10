const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
  let disposable = vscode.commands.registerCommand('jekyll.newPost', async () => {
    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showErrorMessage('Open a jekyll folder first');
      return;
    }

    let fileName = await vscode.window.showInputBox({
      prompt: 'Enter file name',
      placeHolder: 'new-post'
    });

    if (fileName === undefined) { return; }

    // 清理非法字符
    fileName = fileName.replace(/[\\\/:*?"<>|\x00-\x1F]/g, '').trim();
    // 空格替换为 '-'
    fileName = fileName.replace(/\s+/g, '-');
    if (fileName === '') fileName = 'new-post';

    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const postsDir = path.join(workspaceRoot, '_posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // 格式化日期为 "YYYY-MM-DD HH:mm:ss ±HHMM"
    function formatDate(date) {
      const pad = n => String(n).padStart(2, '0');

      const Y = date.getFullYear();
      const M = pad(date.getMonth() + 1);
      const D = pad(date.getDate());

      const h = pad(date.getHours());
      const m = pad(date.getMinutes());
      const s = pad(date.getSeconds());

      // 时区偏移，单位分钟，正值代表西区，负值代表东区
      const offsetMinutes = -date.getTimezoneOffset();
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const absOffsetH = pad(Math.floor(Math.abs(offsetMinutes) / 60));
      const offset = `${sign}${absOffsetH}00`;  // 分钟固定写00

      return `${Y}-${M}-${D} ${h}:${m}:${s} ${offset}`;
    }

    const dateString = formatDate(new Date());

    const finalFileName = `${dateString.slice(0, 10)}-${fileName}.md`; // 用 YYYY-MM-DD 作为前缀

    const fileUri = vscode.Uri.file(path.join(postsDir, finalFileName)).with({ scheme: 'untitled' });

    // 读取模板文件
    const templatePath = path.join(workspaceRoot, '.post-matter-template');
    let content;
    try {
      content = fs.readFileSync(templatePath, 'utf8');
      // 替换约定字符串
      content = content.replace(/\$\{date\}/g, dateString);
      content = content.replace(/\$\{title\}/g, fileName.replace(/-/g, ' '));
    } catch (e) {
      // 模板不存在或读失败，使用默认模板
      content = [
        '---',
        'layout: post',
        `title: "${fileName.replace(/-/g, ' ')}"`,
        `date: ${dateString}`,
        'tags: ["${2}"]',
        '---',
        '${0}',
      ].join('\n');
    }
    
    const snippet = new vscode.SnippetString(content);
    const doc = await vscode.workspace.openTextDocument(fileUri);
    const editor = await vscode.window.showTextDocument(doc, { preview: false });
    await editor.insertSnippet(snippet);
  });

  context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = { activate, deactivate };
