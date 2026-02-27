const fs = require('fs');

const breakpoints = {
    md: '768px',
    lg: '992px'
};

const classes = `
/* Display */
.eg-ui-block { display: block !important; }
.eg-ui-inline-block { display: inline-block !important; }
.eg-ui-inline { display: inline !important; }
.eg-ui-flex { display: flex !important; }
.eg-ui-inline-flex { display: inline-flex !important; }
.eg-ui-grid { display: grid !important; }
.eg-ui-hidden { display: none !important; }

/* Legacy support */
.eg-ui-d-none { display: none !important; }
.eg-ui-d-block { display: block !important; }
.eg-ui-d-inline-block { display: inline-block !important; }
.eg-ui-d-flex { display: flex !important; }

/* Position */
.eg-ui-static { position: static !important; }
.eg-ui-fixed { position: fixed !important; }
.eg-ui-absolute { position: absolute !important; }
.eg-ui-relative { position: relative !important; }
.eg-ui-sticky { position: sticky !important; }

/* Flexbox & Grid */
.eg-ui-flex-row { flex-direction: row !important; }
.eg-ui-flex-col { flex-direction: column !important; }
.eg-ui-flex-wrap { flex-wrap: wrap !important; }
.eg-ui-flex-nowrap { flex-wrap: nowrap !important; }

.eg-ui-items-start { align-items: flex-start !important; }
.eg-ui-items-end { align-items: flex-end !important; }
.eg-ui-items-center { align-items: center !important; }
.eg-ui-items-baseline { align-items: baseline !important; }
.eg-ui-items-stretch { align-items: stretch !important; }

/* Legacy support */
.eg-ui-align-center { align-items: center !important; }

.eg-ui-justify-start { justify-content: flex-start !important; }
.eg-ui-justify-end { justify-content: flex-end !important; }
.eg-ui-justify-center { justify-content: center !important; }
.eg-ui-justify-between { justify-content: space-between !important; }
.eg-ui-justify-around { justify-content: space-around !important; }
.eg-ui-justify-evenly { justify-content: space-evenly !important; }

/* Gap */
.eg-ui-gap-0 { gap: 0 !important; }
.eg-ui-gap-1 { gap: var(--eg-ui-space-1) !important; }
.eg-ui-gap-2 { gap: var(--eg-ui-space-2) !important; }
.eg-ui-gap-3 { gap: var(--eg-ui-space-3) !important; }
.eg-ui-gap-4 { gap: var(--eg-ui-space-4) !important; }
.eg-ui-gap-5 { gap: var(--eg-ui-space-5) !important; }
.eg-ui-gap-6 { gap: var(--eg-ui-space-6) !important; }
.eg-ui-gap-8 { gap: var(--eg-ui-space-8) !important; }
.eg-ui-gap-10 { gap: var(--eg-ui-space-10) !important; }
.eg-ui-gap-12 { gap: var(--eg-ui-space-12) !important; }

/* Grid Columns */
.eg-ui-grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
.eg-ui-grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
.eg-ui-grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
.eg-ui-grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
.eg-ui-grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
.eg-ui-grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)) !important; }
.eg-ui-grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }

/* Sizing (Width/Height) */
.eg-ui-w-full { width: 100% !important; }
.eg-ui-w-screen { width: 100vw !important; }
.eg-ui-w-auto { width: auto !important; }
.eg-ui-h-full { height: 100% !important; }
.eg-ui-h-screen { height: 100vh !important; }
.eg-ui-h-auto { height: auto !important; }

/* Legacy */
.eg-ui-w-100 { width: 100% !important; }
`;

let finalCSS = '/* eGlobe UI Layout (Responsive) */\n\n' + classes;

for (const [bp, width] of Object.entries(breakpoints)) {
    finalCSS += '\n@media (min-width: ' + width + ') {\n';
    const lines = classes.split('\n');
    for (const line of lines) {
        if (line.trim().startsWith('.eg-ui-')) {
            finalCSS += '  .' + bp + '\\:' + line.trim().substring(1) + '\n';
        } else if (line.trim() !== '') {
            finalCSS += '  ' + line + '\n';
        }
    }
    finalCSS += '}\n';
}

fs.writeFileSync('eg-ui-layout.css', finalCSS);
console.log('Generated eg-ui-layout.css');
