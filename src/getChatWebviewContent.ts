import * as vscode from "vscode";

export function getChatWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "webview", "dist", "assets", "index-CIf4IPTg.js")
  );

  const viteIconUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "webview", "dist", "vite.svg")
  );

  console.log("Script URI:", scriptUri.toString());

  return /* html */ `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="${viteIconUri}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GPT Chat</title>
    <script type="module" crossorigin src="${scriptUri}"></script>
  </head>
  <body>
    <div id="root">Loading React App...</div>
    <script>
      console.log("Webview HTML loaded");
    </script>
  </body>
</html>`;
}