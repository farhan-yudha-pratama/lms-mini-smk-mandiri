export type VirtualProjectFiles = Record<string, string>;

export const DEFAULT_WEB_PROJECT: VirtualProjectFiles = {
  'index.html': `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proyek Web Siswa</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="card">
    <h1 id="title">Halo SMK Mandiri!</h1>
    <p>Silakan kerjakan instruksi tugas atau kuis ini.</p>
    <button id="btnAction">Klik Saya</button>
  </div>

  <script src="js/script.js"></script>
</body>
</html>`,
  'css/style.css': `body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  padding: 1rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

h1 {
  color: #2563eb;
  margin-top: 0;
  font-size: 1.5rem;
}

p {
  color: #64748b;
  line-height: 1.5;
}

button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;
}

button:hover {
  background: #1d4ed8;
}`,
  'js/script.js': `const btn = document.getElementById('btnAction');
const title = document.getElementById('title');

btn.addEventListener('click', () => {
  console.log('Tombol aksi diklik oleh user!');
  title.textContent = 'Tombol Berhasil Diklik! 🎉';
  title.style.color = '#16a34a';
});

console.log('Script js/script.js berhasil dimuat.');`
};

/**
 * Mendeteksi bahasa Monaco berdasarkan ekstensi file
 */
export function getFileLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
      return 'css';
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'json':
      return 'json';
    case 'ts':
      return 'typescript';
    case 'svg':
    case 'xml':
      return 'xml';
    default:
      return 'plaintext';
  }
}

/**
 * Normalisasi path file virtual (menghapus ./ di awal dan trailing slash)
 */
export function normalizeVirtualPath(path: string): string {
  let cleaned = path.trim().replace(/\\/g, '/');
  if (cleaned.startsWith('./')) {
    cleaned = cleaned.substring(2);
  }
  if (cleaned.startsWith('/')) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Parsing teks jawaban siswa atau initialCode:
 * Jika JSON valid berisi Record<string, string>, parse sebagai file proyek.
 * Jika teks biasa (HTML legacy atau kosong), bungkus dalam 'index.html'.
 */
export function parseProjectFiles(raw: string | null | undefined): VirtualProjectFiles {
  if (!raw || !raw.trim()) {
    return { ...DEFAULT_WEB_PROJECT };
  }

  const trimmed = raw.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        const result: VirtualProjectFiles = {};
        for (const [key, val] of Object.entries(parsed)) {
          if (typeof val === 'string') {
            result[normalizeVirtualPath(key)] = val;
          }
        }
        if (Object.keys(result).length > 0) {
          // Pastikan setidaknya ada index.html
          if (!result['index.html']) {
            const firstHtml = Object.keys(result).find(k => k.endsWith('.html'));
            if (!firstHtml) {
              result['index.html'] = '<!DOCTYPE html><html><body><h1>Proyek Siswa</h1></body></html>';
            }
          }
          return result;
        }
      }
    } catch {
      // bukan JSON, fallback ke single file
    }
  }

  // Fallback untuk single-file HTML legacy
  return {
    'index.html': raw
  };
}

/**
 * Serialisasi file proyek ke string JSON untuk disimpan di database
 */
export function serializeProjectFiles(files: VirtualProjectFiles): string {
  return JSON.stringify(files);
}

/**
 * Mem-bundle file proyek virtual ke dalam satu HTML string yang siap dirender di iframe sandbox.
 * Otomatis me-resolve <link rel="stylesheet" href="..."> dan <script src="...">
 * serta menyuntikkan script interceptor untuk console.log/error ke parent window.
 */
export function bundleVirtualProject(files: VirtualProjectFiles): string {
  // 1. Cari entry point HTML utama
  let mainHtmlKey = 'index.html';
  if (!files[mainHtmlKey]) {
    const foundHtml = Object.keys(files).find(k => k.endsWith('.html'));
    mainHtmlKey = foundHtml || Object.keys(files)[0];
  }

  let html = files[mainHtmlKey] || '<!DOCTYPE html><html><body><p>Tidak ada konten HTML.</p></body></html>';

  // 2. Map file yang sudah dinormalisasi untuk pencarian cepat
  const normalizedFiles: Record<string, string> = {};
  for (const [p, content] of Object.entries(files)) {
    normalizedFiles[normalizeVirtualPath(p)] = content;
  }

  // 3. Resolve CSS: <link rel="stylesheet" ... href="...">
  // Regex untuk menangkap <link ...> dengan rel="stylesheet" dan href="..."
  const linkRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*>|<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi;

  html = html.replace(linkRegex, (fullMatch) => {
    const hrefMatch = fullMatch.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return fullMatch;
    const href = hrefMatch[1];

    // Jika external URL (http/https), biarkan utuh
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      return fullMatch;
    }

    const normPath = normalizeVirtualPath(href);
    if (normalizedFiles[normPath] !== undefined) {
      return `\n<style data-source="${normPath}">\n/* ${normPath} */\n${normalizedFiles[normPath]}\n</style>\n`;
    }

    // Coba cari nama file saja (jika path folder tidak persis)
    const baseName = normPath.split('/').pop() || '';
    const foundKey = Object.keys(normalizedFiles).find(k => k.endsWith('/' + baseName) || k === baseName);
    if (foundKey && normalizedFiles[foundKey] !== undefined) {
      return `\n<style data-source="${foundKey}">\n/* ${foundKey} */\n${normalizedFiles[foundKey]}\n</style>\n`;
    }

    return fullMatch;
  });

  // 4. Resolve JS: <script ... src="..."></script>
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi;

  html = html.replace(scriptRegex, (fullMatch, src) => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
      return fullMatch;
    }

    const normPath = normalizeVirtualPath(src);
    if (normalizedFiles[normPath] !== undefined) {
      return `\n<script data-source="${normPath}">\n// ${normPath}\n${normalizedFiles[normPath]}\n</script>\n`;
    }

    const baseName = normPath.split('/').pop() || '';
    const foundKey = Object.keys(normalizedFiles).find(k => k.endsWith('/' + baseName) || k === baseName);
    if (foundKey && normalizedFiles[foundKey] !== undefined) {
      return `\n<script data-source="${foundKey}">\n// ${foundKey}\n${normalizedFiles[foundKey]}\n</script>\n`;
    }

    return fullMatch;
  });

  // 5. Suntikkan Console Log Interceptor & Error Handler ke dalam iframe
  const consoleInterceptor = `
<script>
(function() {
  const origLog = console.log;
  const origError = console.error;
  const origWarn = console.warn;
  const origInfo = console.info;

  function safeFormat(arg) {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return String(arg);
      }
    }
    return String(arg);
  }

  function emit(type, args) {
    try {
      const msg = Array.from(args).map(safeFormat).join(' ');
      window.parent.postMessage({
        source: 'lms-sandbox-console',
        type: type,
        message: msg,
        timestamp: new Date().toLocaleTimeString()
      }, '*');
    } catch (err) {}
  }

  console.log = function(...args) { emit('log', args); origLog.apply(console, args); };
  console.error = function(...args) { emit('error', args); origError.apply(console, args); };
  console.warn = function(...args) { emit('warn', args); origWarn.apply(console, args); };
  console.info = function(...args) { emit('info', args); origInfo.apply(console, args); };

  window.addEventListener('error', function(event) {
    emit('error', [event.message + (event.filename ? ' (' + event.filename + ':' + event.lineno + ')' : '')]);
  });

  window.addEventListener('unhandledrejection', function(event) {
    emit('error', ['Unhandled Promise Rejection: ' + (event.reason ? safeFormat(event.reason) : 'Unknown reason')]);
  });
})();
</script>
`;

  if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>' + consoleInterceptor);
  } else if (html.includes('<body>')) {
    html = html.replace('<body>', '<body>' + consoleInterceptor);
  } else {
    html = consoleInterceptor + html;
  }

  return html;
}
