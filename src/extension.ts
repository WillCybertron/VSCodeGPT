import * as vscode from "vscode";
import { getWebviewHtml } from "./getWebviewHtml"; // We'll write this next

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vscodegpt.chat",
      new ChatWebviewProvider(context)
    )
  );
}

class ChatWebviewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "dist"),
      ],
    };

    // Use your generated HTML
    webviewView.webview.html = getWebviewHtml(
      webviewView.webview,
      this.context.extensionUri
    );

    // Listen to messages from webview (optional for now)
    webviewView.webview.onDidReceiveMessage((msg) => {
      // handle messages from React app here
    });
  }
}
