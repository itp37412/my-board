@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted: #6b7280;
  --border: #e5e7eb;
  --hover: #f9fafb;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Pretendard",
    "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  font-feature-settings: "ss01", "ss02";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 숫자를 깔끔하게 (tabular figures) */
.tabular {
  font-variant-numeric: tabular-nums;
}

/* 링크 호버 효과 */
a {
  transition: opacity 0.15s ease;
}

a:hover {
  opacity: 0.6;
}
