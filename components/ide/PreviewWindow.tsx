"use client";
import { useEffect, useState } from "react";

interface Props {
  html: string;
  css: string;
  js: string;
}

export default function PreviewWindow({ html, css, js }: Props) {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    // Debounce compilation slightly to avoid flashing
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>
              body { margin: 0; font-family: sans-serif; color: #fff; }
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script>
              try {
                ${js}
              } catch (err) {
                console.error(err);
              }
            </script>
          </body>
        </html>
      `);
    }, 500);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <div className="h-full w-full bg-white">
      <iframe
        srcDoc={srcDoc}
        title="MuxDay Preview"
        sandbox="allow-scripts" // NO allow-same-origin to prevent cookie theft
        frameBorder="0"
        width="100%"
        height="100%"
        className="h-full w-full"
      />
    </div>
  );
}