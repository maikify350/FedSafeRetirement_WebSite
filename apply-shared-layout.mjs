import fs from 'fs';
import path from 'path';

const siteRoot = path.resolve('New');
const templatePath = path.join(siteRoot, 'meet-the-partners', 'index.html');
const privacySource = path.resolve('..', 'WebSite_Designer', 'Privacy');
const termsSource = path.resolve('..', 'WebSite_Designer', 'Terms_Of_Service');

const template = fs.readFileSync(templatePath, 'utf8');
const portedPagePaths = [
  path.join(siteRoot, 'benefits-analysis', 'index.html'),
  path.join(siteRoot, 'fegli-analysis', 'index.html'),
  path.join(siteRoot, 'social-security-analysis', 'index.html'),
];

function pagePrefix(pagePath) {
  const relative = path.relative(siteRoot, pagePath).replace(/\\/g, '/');
  return relative === 'index.html' ? '' : '../';
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugifyHeading(value) {
  return value
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseLegalText(raw) {
  return raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function blockType(block, index) {
  if (/^\d+\.\s+/.test(block)) return 'h2';
  if (block.length <= 55 && /:$/.test(block)) return 'h3';
  if (index > 0 && block.length <= 80 && block === block.toUpperCase() && !/[.;]$/.test(block)) return 'h2';
  if (index > 0 && block.length <= 55 && /^[A-Z][A-Za-z0-9&,\- ]+$/.test(block)) return 'h2';
  return 'p';
}

function legalContent(title, rawText) {
  const blocks = parseLegalText(rawText);
  const bodyBlocks = blocks.slice(blocks[0]?.toLowerCase() === title.toLowerCase() ? 1 : 0);

  const htmlBlocks = bodyBlocks.map((block, index) => {
    const escaped = escapeHtml(block);
    const type = blockType(block, index);

    if (type === 'h2') {
      return `<h2 id="${slugifyHeading(escaped)}">${escaped}</h2>`;
    }

    if (type === 'h3') {
      return `<h3>${escaped}</h3>`;
    }

    return `<p>${escaped}</p>`;
  }).join('\n');

  return `
<div class="container-wrap fedsafe-legal-page">
  <div class="container main-content" role="main">
    <div class="row">
      <section class="fedsafe-legal-shell">
        <p class="fedsafe-eyebrow">FedSafe Retirement</p>
        <h1>${escapeHtml(title)}</h1>
        ${htmlBlocks}
      </section>
    </div>
  </div>
</div>`;
}

function legalStyle() {
  return `<style id="fedsafe-legal-page-css">
.fedsafe-legal-page {
  background: #f4f2ef;
  padding-top: 140px;
  padding-bottom: 60px;
}
.fedsafe-legal-shell {
  max-width: 980px;
  margin: 0 auto;
  background: #fff;
  border-radius: 15px;
  padding: clamp(28px, 5vw, 64px);
  box-shadow: 0 18px 55px rgba(0, 48, 88, 0.08);
}
.fedsafe-legal-shell .fedsafe-eyebrow {
  margin: 0 0 8px;
  color: #c1260d;
  font-family: 'Oswald', sans-serif;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: uppercase;
}
.fedsafe-legal-shell h1 {
  margin: 0 0 28px;
  color: #003058;
  font-family: 'Oswald', sans-serif;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.05;
  letter-spacing: 0;
}
.fedsafe-legal-shell h2 {
  margin: 34px 0 12px;
  color: #003058;
  font-family: 'Oswald', sans-serif;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.15;
  letter-spacing: 0;
}
.fedsafe-legal-shell h3 {
  margin: 22px 0 8px;
  color: #003058;
  font-family: 'Oswald', sans-serif;
  font-size: 21px;
  line-height: 1.25;
  letter-spacing: 0;
}
.fedsafe-legal-shell p {
  color: #252525;
  font-size: 17px;
  line-height: 1.72;
  margin: 0 0 16px;
}
@media only screen and (max-width: 690px) {
  .fedsafe-legal-page {
    padding-top: 112px;
  }
  .fedsafe-legal-shell {
    border-radius: 10px;
  }
  .fedsafe-legal-shell p {
    font-size: 16px;
  }
}
</style>`;
}

function footerLegalLinks(prefix) {
  return `<div id="fedsafe-legal-footer-links" class="fedsafe-legal-footer-links">
  <a href="${prefix}privacy-policy/">Privacy Policy</a>
  <span aria-hidden="true">|</span>
  <a href="${prefix}terms-of-service/">Terms of Service</a>
</div>`;
}

function footerLegalStyle() {
  return `<style id="fedsafe-footer-legal-css">
#footer-outer .fedsafe-legal-footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 18px 20px 26px;
  color: #003058;
  font-family: 'Oswald', sans-serif;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: uppercase;
}
#footer-outer .fedsafe-legal-footer-links a {
  color: #003058;
  text-decoration: none;
}
#footer-outer .fedsafe-legal-footer-links a:hover {
  color: #c1260d;
}
</style>`;
}

function responsiveHeaderStyle() {
  return `<style id="fedsafe-responsive-header-css">
@media only screen and (min-width: 1321px) {
  #header-outer {
    left: clamp(42px, 5vw, 110px) !important;
    right: clamp(42px, 5vw, 110px) !important;
  }
}
@media only screen and (max-width: 1320px) and (min-width: 1000px) {
  #header-outer {
    left: clamp(50px, 8vw, 120px) !important;
    right: clamp(50px, 8vw, 120px) !important;
  }
  #header-outer header#top nav {
    display: none !important;
  }
  #header-outer .slide-out-widget-area-toggle {
    display: flex !important;
  }
  #header-outer .col.span_9 {
    display: flex !important;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>`;
}

function portedPagePolishStyle() {
  return `<style id="fedsafe-ported-page-polish-css">
.subpage-content-wrap .elementor-invisible,
.subpage-content-wrap .elementor-invisible *,
.elementor-subpage-content .elementor-invisible,
.elementor-subpage-content .elementor-invisible * {
  visibility: visible !important;
  opacity: 1 !important;
  animation: none !important;
}
.subpage-content-wrap > .elementor > .elementor-section:first-child,
.elementor-subpage-content > .elementor > .elementor-section:first-child {
  background: transparent !important;
  min-height: 0 !important;
  padding-bottom: 24px !important;
}
.subpage-content-wrap > .elementor > .elementor-section:first-child .elementor-heading-title,
.elementor-subpage-content > .elementor > .elementor-section:first-child .elementor-heading-title {
  color: #003058 !important;
  text-shadow: none !important;
}
.subpage-content-wrap .elementor-element-5e97699 .elementor-heading-title {
  color: #003058 !important;
  text-shadow: none !important;
}
.subpage-content-wrap .elementor-widget-image img,
.elementor-subpage-content .elementor-widget-image img {
  max-width: min(100%, 980px);
  height: auto;
}
@media only screen and (max-width: 690px) {
  .subpage-content-wrap > .elementor > .elementor-section:first-child,
  .elementor-subpage-content > .elementor > .elementor-section:first-child {
    padding-bottom: 12px !important;
  }
}
</style>`;
}

function replaceTitleAndMeta(html, title, slug) {
  let next = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)} - FedSafe Retirement</title>`);
  next = next.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="../${slug}/" />`);
  next = next.replace(/<link rel='shortlink' href='[^']*' \/>/, '');
  next = next.replace(/<link rel="preload" fetchpriority="high" as="image" href="[^"]+" media="\([^"]+">\s*/g, '');
  return next;
}

function buildLegalPage(title, slug, rawText) {
  const ajaxStart = template.indexOf('<div id="ajax-content-wrap">');
  const footerStart = template.indexOf('<div id="fws_69d504e54ffc9"');
  if (ajaxStart === -1 || footerStart === -1) {
    throw new Error('Could not find legal page template insertion points.');
  }

  const beforeAjax = template.slice(0, ajaxStart + '<div id="ajax-content-wrap">'.length);
  const afterFooter = template.slice(footerStart);
  let html = beforeAjax + legalContent(title, rawText) + '\n' + afterFooter;
  html = replaceTitleAndMeta(html, title, slug);
  html = ensureHeadStyle(html, legalStyle());
  return applyFooterLinks(html, '../');
}

function ensureHeadStyle(html, styleBlock) {
  const styleIdMatch = styleBlock.match(/id="([^"]+)"/);
  if (!styleIdMatch) return html;

  const styleId = styleIdMatch[1];
  const existing = new RegExp(`<style id="${styleId}">[\\s\\S]*?<\\/style>`);
  if (existing.test(html)) {
    return html.replace(existing, styleBlock);
  }

  return html.replace('</head>', `${styleBlock}\n</head>`);
}

function applyFooterLinks(html, prefix) {
  let next = ensureHeadStyle(html, footerLegalStyle());
  next = ensureHeadStyle(next, responsiveHeaderStyle());
  const block = footerLegalLinks(prefix);
  const existing = /<div id="fedsafe-legal-footer-links"[\s\S]*?<\/div>/;

  if (existing.test(next)) {
    return next.replace(existing, block);
  }

  const footerPattern = /(<div id="footer-outer"[^>]*>)([\s\S]*?)(<\/div><!--\/footer-outer-->)/;
  if (!footerPattern.test(next)) {
    throw new Error('Could not find footer-outer block.');
  }

  return next.replace(footerPattern, `$1\n${block}\n$3`);
}

function mobileMenuBlock() {
  const start = template.indexOf('<div id="slide-out-widget-area-bg"');
  const end = template.indexOf('</div> <!--/ajax-content-wrap-->', start);
  if (start === -1 || end === -1) {
    throw new Error('Could not extract mobile menu block from template.');
  }
  return template.slice(start, end);
}

function applyPortedPagePolish() {
  const menuBlock = mobileMenuBlock();

  for (const page of portedPagePaths) {
    let html = fs.readFileSync(page, 'utf8');
    html = ensureHeadStyle(html, portedPagePolishStyle());

    if (!html.includes('id="slide-out-widget-area"')) {
      const closePattern = '</div><!--/ajax-content-wrap-->';
      if (!html.includes(closePattern)) {
        throw new Error(`Could not find ajax-content-wrap close in ${page}`);
      }
      html = html.replace(closePattern, `${menuBlock}\n${closePattern}`);
    }

    fs.writeFileSync(page, html, 'utf8');
    console.log(`Polished ported page ${path.relative(siteRoot, page).replace(/\\/g, '/')}`);
  }
}

function allSitePages() {
  const pages = [];
  const stack = [siteRoot];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === 'assets' || entry.name === '.vercel' || entry.name === '_backups') continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name === 'index.html') {
        pages.push(full);
      }
    }
  }

  return pages;
}

function writeLegalPages() {
  const pages = [
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      source: privacySource,
    },
    {
      title: 'Terms of Service',
      slug: 'terms-of-service',
      source: termsSource,
    },
  ];

  for (const page of pages) {
    const dir = path.join(siteRoot, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    const rawText = fs.readFileSync(page.source, 'utf8');
    fs.writeFileSync(path.join(dir, 'index.html'), buildLegalPage(page.title, page.slug, rawText), 'utf8');
    console.log(`Generated ${page.slug}/index.html`);
  }
}

function updateFooters() {
  for (const page of allSitePages()) {
    const prefix = pagePrefix(page);
    const html = fs.readFileSync(page, 'utf8');
    fs.writeFileSync(page, applyFooterLinks(html, prefix), 'utf8');
    console.log(`Updated footer links in ${path.relative(siteRoot, page).replace(/\\/g, '/')}`);
  }
}

writeLegalPages();
updateFooters();
applyPortedPagePolish();
