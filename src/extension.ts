import * as vscode from "vscode";
import { getChatWebviewContent } from "./getChatWebviewContent";

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
  console.log("Extension activating...");

  const output = vscode.window.createOutputChannel("VSCodeGPT");
  output.appendLine("GPT EXTENSION ACTIVATED!");
  output.show(true);

  // Register IMMEDIATELY
  const provider = new ChatWebviewProvider(context, output);
  output.appendLine("Provider instance created");

  const disposable = vscode.window.registerWebviewViewProvider(
    ChatWebviewProvider.viewType,
    provider
  );

  context.subscriptions.push(disposable);
  output.appendLine("Provider registered and pushed to subscriptions");

  console.log("Extension activation complete");

  const testCommand = vscode.commands.registerCommand('vscodegpt.helloWorld', () => {
    output.appendLine("Hello World command executed");
    vscode.window.showInformationMessage('VSCodeGPT is working!');
  });

  context.subscriptions.push(testCommand);
}
