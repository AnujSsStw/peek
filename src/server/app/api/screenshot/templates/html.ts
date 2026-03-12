import { GOOGLE_FONTS_URL, WIDGET_CSS } from "./styles";

export function buildFullHtml(bodyContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
  <style>${WIDGET_CSS}</style>
</head>
<body>${bodyContent}</body>
</html>`;
}
