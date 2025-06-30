import * as vscode from "vscode";

export function getChatWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  // Reference your actual built file
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "webview",
      "dist",
      "assets",
      "index-CIf4IPTg.js"
    )
  );

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>GPT: Chat</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${scriptUri}"></script>
  </body>
</html>
  `;
}
