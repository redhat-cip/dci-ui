export function humanFileSize(size: number) {
  if (!size) return "0 B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const newSize = parseFloat((size / Math.pow(1024, i)).toFixed(2));
  const unit = ["B", "kB", "MB", "GB", "TB"][i];
  return `${newSize} ${unit}`;
}
