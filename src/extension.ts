import * as vscode from "vscode";
import { getWebviewHtml } from "./getWebviewHtml";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vscodegpt.chat", // this should match your package.json view id
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
        vscode.Uri.joinPath(this.context.extensionUri, "media"), // Add this if you need to load your icon or other assets!
      ],
    };

    // Set the HTML content for your webview
    webviewView.webview.html = getWebviewHtml(
      webviewView.webview,
      this.context.extensionUri
    );

    // Optional: Listen to messages from your React app in the webview
    webviewView.webview.onDidReceiveMessage((msg) => {
      // handle messages from React app here if needed
    });
  }
}
