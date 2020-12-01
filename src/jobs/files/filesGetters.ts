export function humanFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const newSize = parseFloat((size / Math.pow(1024, i)).toFixed(2));
  const unit = ["B", "kB", "MB", "GB", "TB"][i];
  return `${newSize} ${unit}`;
}
