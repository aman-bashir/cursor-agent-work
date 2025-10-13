#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function log(message) {
  process.stdout.write(`${message}\n`);
}

function readJson(filePath, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    return fallback;
  }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileIfMissing(filePath, contents) {
  if (fs.existsSync(filePath)) return false;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents, "utf8");
  return true;
}

function getPortFromDir(dirName) {
  // Expect dirName like: tool-01-password-generator
  const match = dirName.match(/^tool-(\d{2})-/);
  if (!match) return 3000;
  const n = parseInt(match[1], 10);
  return 3000 + n; // 01 -> 3001, ..., 10 -> 3010
}

function toTitleCase(slug) {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function getToolTitle(dirName) {
  const parts = dirName.split("-");
  // remove leading "tool", index, keep rest
  if (parts.length >= 3) {
    return toTitleCase(parts.slice(2).join("-"));
  }
  return toTitleCase(dirName);
}

function scaffoldTool(toolDirAbs) {
  const dirName = path.basename(toolDirAbs);
  const port = getPortFromDir(dirName);
  const toolTitle = getToolTitle(dirName);

  const pkgPath = path.join(toolDirAbs, "package.json");
  if (fs.existsSync(pkgPath)) {
    log(`- Skipping ${dirName}: already has package.json`);
    return { dirName, created: false };
  }

  // package.json
  const pkg = {
    name: dirName,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: `next dev -p ${port}`,
      build: "next build",
      start: `next start -p ${port}`,
      lint: "next lint"
    },
    dependencies: {
      next: "14.2.14",
      react: "18.3.1",
      "react-dom": "18.3.1",
      "lucide-react": "^0.451.0"
    },
    devDependencies: {
      typescript: "^5.6.3",
      tailwindcss: "^3.4.13",
      postcss: "^8.4.47",
      autoprefixer: "^10.4.20"
    }
  };

  writeFileIfMissing(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  // tsconfig.json (Next.js baseline)
  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: false,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "ESNext",
      moduleResolution: "Bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      increment: true,
      plugins: [{ name: "next" }]
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
  };
  writeFileIfMissing(path.join(toolDirAbs, "tsconfig.json"), JSON.stringify(tsconfig, null, 2) + "\n");

  // next-env.d.ts
  writeFileIfMissing(
    path.join(toolDirAbs, "next-env.d.ts"),
    [
      "/// <reference types=\"next\" />",
      "/// <reference types=\"next/image-types/global\" />",
      "",
      "// NOTE: This file should not be edited",
      "// see https://nextjs.org/docs/pages/building-your-application/configuring/typescript#typescript-plugin",
      ""
    ].join("\n") + "\n"
  );

  // next.config.ts
  writeFileIfMissing(
    path.join(toolDirAbs, "next.config.ts"),
    [
      "import type { NextConfig } from 'next';",
      "",
      "const nextConfig: NextConfig = {",
      "  reactStrictMode: true,",
      "};",
      "",
      "export default nextConfig;",
      ""
    ].join("\n") + "\n"
  );

  // postcss.config.js
  writeFileIfMissing(
    path.join(toolDirAbs, "postcss.config.js"),
    [
      "module.exports = {",
      "  plugins: {",
      "    tailwindcss: {},",
      "    autoprefixer: {},",
      "  },",
      "};",
      ""
    ].join("\n") + "\n"
  );

  // tailwind.config.ts
  writeFileIfMissing(
    path.join(toolDirAbs, "tailwind.config.ts"),
    [
      "import type { Config } from 'tailwindcss'",
      "",
      "export default {",
      "  content: [",
      "    './app/**/*.{js,ts,jsx,tsx}',",
      "    './components/**/*.{js,ts,jsx,tsx}',",
      "  ],",
      "  theme: {",
      "    extend: {},",
      "  },",
      "  plugins: [],",
      "} satisfies Config",
      ""
    ].join("\n") + "\n"
  );

  // app/globals.css
  writeFileIfMissing(
    path.join(toolDirAbs, "app/globals.css"),
    [
      "@tailwind base;",
      "@tailwind components;",
      "@tailwind utilities;",
      "",
      ":root {",
      "  --background: 255 255 255;",
      "  --foreground: 17 24 39;",
      "}",
      "",
      "html, body, #__next { height: 100%; }",
      "body { color: rgb(var(--foreground)); background: rgb(var(--background)); }",
      ""
    ].join("\n") + "\n"
  );

  // app/layout.tsx
  writeFileIfMissing(
    path.join(toolDirAbs, "app/layout.tsx"),
    [
      "import type { Metadata } from 'next';",
      "import './globals.css';",
      "",
      `export const metadata: Metadata = { title: '${toolTitle}', description: '${toolTitle} built with Next.js' };`,
      "",
      "export default function RootLayout({ children }: { children: React.ReactNode }) {",
      "  return (",
      "    <html lang=\"en\">",
      "      <body>",
      "        <div className=\"min-h-screen flex flex-col\">{children}</div>",
      "      </body>",
      "    </html>",
      "  );",
      "}",
      ""
    ].join("\n") + "\n"
  );

  // app/page.tsx
  writeFileIfMissing(
    path.join(toolDirAbs, "app/page.tsx"),
    [
      "export default function Page() {",
      "  return (",
      "    <main className=\"max-w-3xl mx-auto px-4 py-12\">",
      `      <h1 className=\"text-3xl font-bold mb-4\">${toolTitle}</h1>`,
      "      <p className=\"text-gray-600\">",
      "        Starter scaffold generated from README. Build the full tool here.",
      "      </p>",
      "    </main>",
      "  );",
      "}",
      ""
    ].join("\n") + "\n"
  );

  // components/.keep (placeholder)
  writeFileIfMissing(path.join(toolDirAbs, "components/.keep"), "\n");

  // .gitignore
  writeFileIfMissing(
    path.join(toolDirAbs, ".gitignore"),
    [
      "# Dependencies",
      "node_modules/",
      "",
      "# Next.js",
      ".next/",
      "out/",
      "",
      "# Env",
      ".env.local",
      ".env.*.local",
      "",
      "# Logs",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      ""
    ].join("\n") + "\n"
  );

  log(`- Scaffolded ${dirName} on port ${port}`);
  return { dirName, created: true };
}

function main() {
  const root = process.cwd();
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const toolDirs = entries
    .filter((e) => e.isDirectory() && e.name.startsWith("tool-") )
    .map((e) => path.join(root, e.name))
    .filter((abs) => fs.existsSync(path.join(abs, "README.md")));

  if (toolDirs.length === 0) {
    log("No tool folders found. Nothing to do.");
    process.exit(0);
  }

  log(`Found ${toolDirs.length} tool folders. Creating scaffolds where missing...`);
  const results = toolDirs.map(scaffoldTool);
  const created = results.filter((r) => r.created).length;
  log(`Done. Created ${created} new scaffolds; ${results.length - created} skipped.`);
}

main();
