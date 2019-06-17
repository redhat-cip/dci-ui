export default function copyToClipboard(event, text) {
  const clipboard = event.currentTarget.parentElement;
  const el = document.createElement("input");
  el.value = text;
  clipboard.appendChild(el);
  el.select();
  document.execCommand("copy");
  clipboard.removeChild(el);
}
