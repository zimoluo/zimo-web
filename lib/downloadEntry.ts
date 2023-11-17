import { marked } from "marked";
import { calendarDate } from "./dateUtil";

export function downloadHtml(
  markdown: string,
  title: string = "Downloaded Document"
) {
  try {
    const html = marked(markdown);

    const fullHtml = `<html><head><meta charset="UTF-8"><style>${downloadCss}</style><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title></head><body>${html}</body></html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.html`;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error:", error);
  }
}

export function getFullMarkdown(
  content: string,
  title: string,
  date: string,
  description: string = ""
) {
  return `# ${title}\n\n### ${calendarDate(date)}\n\n${
    description ? `${description}\n\n` : ""
  }\n\n------\n\n${content}`;
}

const downloadCss =
  'hr,img{border:0}a,ins{text-decoration:none}ins,mark{color:#000}dfn,mark{font-style:italic}hr,ol,p,ul{margin:1em 0}html{font-size:100%;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}body{color:#444;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-size:12px;line-height:1.5em;padding:.8em;margin:auto;max-width:42em;background:#fefefe}a{color:#0645ad}a:visited{color:#0b0080}a:hover{color:#06e}a:active{color:#faa700}a:focus{outline:dotted thin}a:active,a:hover{outline:0}::-moz-selection{background:rgba(255,255,0,.3);color:#000}::selection{background:rgba(255,255,0,.3);color:#000}a::-moz-selection{background:rgba(255,255,0,.3);color:#0645ad}a::selection{background:rgba(255,255,0,.3);color:#0645ad}img{max-width:100%;-ms-interpolation-mode:bicubic;vertical-align:middle}h1,h2,h3,h4,h5,h6{font-weight:400;color:#111;line-height:1em}b,h4,h5,h6,mark,strong{font-weight:700}h1{font-size:2em}h2{font-size:1.5em}h3{font-size:1.2em}h4{font-size:1em}h5{font-size:.9em}h6{font-size:.75em}blockquote{color:#666;margin:0;padding-left:3em;border-left:.5em solid #eee}hr{display:block;height:2px;border-top:1px solid #aaa;border-bottom:1px solid #eee;padding:0}code,kbd,pre,samp{color:#000;font-family:monospace,monospace;font-size:.98em}pre{white-space:pre;white-space:pre-wrap;word-wrap:break-word}ins{background:#ff9}mark{background:#ff0}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}ol,ul{padding:0 0 0 1.5em}li p:last-child{margin:0}dd{margin:0 0 0 2em}table{border-collapse:collapse;border-spacing:0;width:100%}th{border-bottom:1px solid #000}td{vertical-align:top}@media only screen and (min-width:480px){body{font-size:14px}}@media only screen and (min-width:768px){body{font-size:16px}}@media print{blockquote,img,pre,tr{page-break-inside:avoid}*{background:0 0!important;color:#000!important;filter:none!important;-ms-filter:none!important}body{font-size:12pt;max-width:100%}a,a:visited{text-decoration:underline}hr{height:1px;border:0;border-bottom:1px solid #000}a[href]:after{content:" (" attr(href) ")"}abbr[title]:after{content:" (" attr(title) ")"}.ir a:after,a[href^="#"]:after,a[href^="javascript:"]:after{content:""}blockquote,pre{border:1px solid #999;padding-right:1em}img{max-width:100%!important}@page{margin:15mm 10mm 15mm 10mm}h2,h3,p{orphans:3;widows:3}h2,h3{page-break-after:avoid}}';
