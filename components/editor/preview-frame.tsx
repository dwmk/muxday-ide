"use client"

import { useEffect, useRef, useMemo } from "react"

interface PreviewFrameProps {
  htmlCode: string
  cssCode: string
  jsCode: string
  autoReload?: boolean
}

export function PreviewFrame({ htmlCode, cssCode, jsCode, autoReload = true }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Send messages (logs/errors) to parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'preview-frame-log') {
        // Re-dispatch to window for the parent component to catch
        window.dispatchEvent(new CustomEvent('console-message', { detail: event.data }))
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const srcDoc = useMemo(() => {
    if (!autoReload) return ""

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset & Base Styles */
    *, *::before, *::after { box-sizing: border-box; }
    body { 
      margin: 0; 
      padding: 0; 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #000000;
      width: 100vw;
      height: 100vh;
      overflow-x: hidden;
    }
    /* User CSS */
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    // ----------------------------------------
    // MuxDay Preview Environment
    // ----------------------------------------
    (function() {
      // 1. Console Interception
      const customConsole = {
        log: (msg) => postLog('log', msg),
        info: (msg) => postLog('info', msg),
        warn: (msg) => postLog('warn', msg),
        error: (msg) => postLog('error', msg),
        clear: () => postLog('clear', null)
      };

      function postLog(type, args) {
        // Convert args to string if possible for safe transport
        const safeArgs = Array.isArray(args) ? args.map(arg => {
            try {
                return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            } catch(e) { return '[Circular/Unserializable]'; }
        }) : [String(args)];

        window.parent.postMessage({
          source: 'preview-frame-log',
          type,
          message: safeArgs.join(' ')
        }, '*');
      }

      // Overwrite global console
      window.console = { ...window.console, ...customConsole };

      // 2. Error Trapping
      window.onerror = function(message, source, lineno, colno, error) {
        customConsole.error(\`Runtime Error: \${message} (Line: \${lineno})\`);
        return true; 
      };

      window.addEventListener('unhandledrejection', function(event) {
        customConsole.error(\`Unhandled Promise: \${event.reason}\`);
      });

      // 3. Execution
      try {
        ${jsCode}
      } catch (err) {
        console.error(err.message);
      }
    })();
  </script>
</body>
</html>`
  }, [htmlCode, cssCode, jsCode, autoReload])

  return (
    <div className="w-full h-full bg-white relative">
      <iframe
        ref={iframeRef}
        title="Preview"
        className="w-full h-full border-none block"
        sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
        srcDoc={srcDoc}
      />
    </div>
  )
}
