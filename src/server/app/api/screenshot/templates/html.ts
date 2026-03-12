import { GOOGLE_FONTS_URL, WIDGET_CSS } from "./styles";

const NOTO_EMOJI_URL =
  "https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap";

export function buildFullHtml(bodyContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
  <link href="${NOTO_EMOJI_URL}" rel="stylesheet">
  <style>${WIDGET_CSS}</style>
</head>
<body>${bodyContent}</body>
</html>`;
}
