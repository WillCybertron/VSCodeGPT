// /webview/src/vscode-api.d.ts

interface VsCodeApi {
  postMessage<T = unknown>(message: T): void;
  setState<T = unknown>(state: T): void;
  getState<T = unknown>(): T | undefined;
}

interface Window {
  acquireVsCodeApi(): VsCodeApi;
}
