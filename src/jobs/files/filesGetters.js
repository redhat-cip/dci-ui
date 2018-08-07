export function humanFileSize(size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const newSize = (size / Math.pow(1024, i)).toFixed(2) * 1;
  const unit = ["B", "kB", "MB", "GB", "TB"][i];
  return `${newSize} ${unit}`;
}
