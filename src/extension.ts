import * as vscode from "vscode";
import { getChatWebviewContent } from "./webview/getChatWebviewContent";

// ---------------------
// Provider needs to be defined BEFORE activate()
// ---------------------
class ChatWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "supergpt.chat";

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly output: vscode.OutputChannel
  ) {
    this.output.appendLine("ChatWebviewProvider constructor called!");
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ): void {
    this.output.appendLine("resolveWebviewView called!");

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "webview", "dist"),
        vscode.Uri.joinPath(this.context.extensionUri, "media"),
      ],
    };

    webviewView.webview.html = getChatWebviewContent(
      webviewView.webview,
      this.context.extensionUri
    );

    webviewView.webview.onDidReceiveMessage((msg) => {
      if (msg.type === "chat-message" && typeof msg.text === "string") {
        webviewView.webview.postMessage({
          type: "chat-response",
          text: `Echo: ${msg.text}`,
        });
      }
    });
  }
}

// ---------------------
// ACTIVATE function
// ---------------------
export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel("VSCodeGPT");
  output.appendLine("GPT EXTENSION ACTIVATED!");
  output.show(true);

  try {
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        ChatWebviewProvider.viewType,
        new ChatWebviewProvider(context, output)
      )
    );
    output.appendLine("Provider registration succeeded.");
  } catch (err) {
    output.appendLine("Provider registration failed: " + err);
    vscode.window.showErrorMessage(
      "Provider registration failed: " + (err as Error).message
    );
  }
}
