const fileInput = document.querySelector("#file-input");
const dropZone = document.querySelector("#drop-zone");
const results = document.querySelector("#results");
const emptyState = document.querySelector("#empty-state");
const fileCount = document.querySelector("#file-count");
const clearButton = document.querySelector("#clear-button");
const downloadButton = document.querySelector("#download-button");
const template = document.querySelector("#result-template");
const toast = document.querySelector("#toast");
let encodedFiles = [];
let toastTimer;

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
}

function render() {
  results.replaceChildren();
  emptyState.hidden = encodedFiles.length > 0;
  fileCount.textContent = encodedFiles.length;
  clearButton.disabled = encodedFiles.length === 0;
  downloadButton.disabled = encodedFiles.length === 0;

  encodedFiles.forEach((item) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".result-card");
    const image = fragment.querySelector("img");
    const title = fragment.querySelector("h3");
    const meta = fragment.querySelector(".file-meta");
    const output = fragment.querySelector(".base64-output");
    const count = fragment.querySelector(".character-count");
    image.src = item.dataUrl;
    image.alt = `${item.name} のプレビュー`;
    title.textContent = item.name;
    meta.textContent = `${item.type || "image"} · ${formatBytes(item.size)}`;
    output.value = item.dataUrl;
    count.textContent = `${item.dataUrl.length.toLocaleString()} characters`;
    fragment.querySelector(".copy-button").addEventListener("click", async () => {
      await copyText(item.dataUrl);
      showToast(`${item.name} をコピーしました`);
    });
    fragment.querySelector(".remove-button").addEventListener("click", () => {
      encodedFiles = encodedFiles.filter((file) => file.id !== item.id);
      render();
    });
    results.append(card);
  });
}

function readFiles(files) {
  const images = [...files].filter((file) => file.type.startsWith("image/"));
  if (!images.length) {
    showToast("画像ファイルを選択してください");
    return;
  }
  if (images.length !== files.length) showToast("画像以外のファイルはスキップしました");
  images.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      encodedFiles.unshift({ id: createId(), name: file.name, type: file.type, size: file.size, dataUrl: String(reader.result) });
      render();
    };
    reader.onerror = () => showToast(`${file.name} を読み込めませんでした`);
    reader.readAsDataURL(file);
  });
}

fileInput.addEventListener("change", (event) => {
  readFiles(event.target.files);
  fileInput.value = "";
});
dropZone.addEventListener("click", (event) => {
  if (event.target !== fileInput) fileInput.click();
});
["dragenter", "dragover"].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropZone.classList.add("drag-active");
}));
["dragleave", "drop"].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropZone.classList.remove("drag-active");
}));
dropZone.addEventListener("drop", (event) => readFiles(event.dataTransfer.files));
dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileInput.click(); }
});
clearButton.addEventListener("click", () => { encodedFiles = []; render(); showToast("変換結果をクリアしました"); });
downloadButton.addEventListener("click", () => {
  const content = encodedFiles.map((file) => `# ${file.name}\n${file.dataUrl}`).join("\n\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "base64-images.txt";
  link.click();
  URL.revokeObjectURL(url);
  showToast("テキストファイルを保存しました");
});
render();
