export function convertLinksToHtml(text: string | null | undefined) {
  if (!text) return "";
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  return text.replace(urlRegex, '<a href="$&">$&</a>');
}
