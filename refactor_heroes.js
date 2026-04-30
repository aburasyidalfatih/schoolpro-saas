const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/app/site/[slug]');

function findFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(file));
    } else if (file.endsWith('page.tsx') && !file.includes('_components') && !file.endsWith('[slug]\\page.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = findFiles(directoryPath);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Extract the hero section:
  // <section className="relative py-16 md:py-20 flex items-center justify-center overflow-hidden bg-primary/90 text-white">
  // ...
  // </section>
  const heroRegex = /<section className="relative py-16 md:py-20 flex items-center justify-center overflow-hidden bg-primary\/90 text-white">[\s\S]*?<\/section>/;

  const match = content.match(heroRegex);
  if (match) {
    const heroStr = match[0];
    
    // Extract Label
    let label = '';
    const labelMatch = heroStr.match(/<p className="[^"]*uppercase[^"]*">([^<]+)<\/p>/);
    if (labelMatch) label = labelMatch[1];

    // Extract Title
    let title = '';
    const titleMatch = heroStr.match(/<h1 className="[^"]*">([^<]+)(?:\{tenant\.name\})?([^<]*)<\/h1>/);
    if (titleMatch) {
        // If it includes {tenant.name}, we need to reconstruct it exactly, but since we are writing TSX, we can just grab the inner JSX.
        const fullTitleMatch = heroStr.match(/<h1 className="[^"]*">([\s\S]*?)<\/h1>/);
        if (fullTitleMatch) title = fullTitleMatch[1].trim();
    }

    // Extract Description
    let desc = '';
    const descMatch = heroStr.match(/<p className="text-lg[^"]*">([\s\S]*?)<\/p>/);
    if (descMatch) desc = descMatch[1].trim();

    // Determine breadcrumb based on filename
    const basename = path.basename(path.dirname(file));
    const breadcrumbLabel = basename.charAt(0).toUpperCase() + basename.slice(1);
    
    // Construct new PageHeader
    // We need to make sure PageHeader is imported
    const importStatement = `import { PageHeader } from "@/app/site/[slug]/_components/page-header"`;
    if (!content.includes('PageHeader')) {
      // Add import after the last import
      content = content.replace(/(import.*?\n)(?!import)/, `$1${importStatement}\n`);
    }

    let pageHeaderStr = `<PageHeader\n        title="${title.replace(/"/g, '&quot;')}"`;
    
    // If title contains curly braces, it's an expression
    if (title.includes('{')) {
       pageHeaderStr = `<PageHeader\n        title={<>${title}</>}`;
    }

    if (desc) {
       if (desc.includes('{')) {
          pageHeaderStr += `\n        description={<>${desc}</>}`;
       } else {
          pageHeaderStr += `\n        description="${desc.replace(/"/g, '&quot;')}"`;
       }
    }
    
    let parentLabel = "Halaman";
    let parentHref = "";
    if (['profil', 'gtk', 'fasilitas', 'program', 'ekstrakurikuler'].includes(basename)) {
        parentLabel = "Profil Sekolah";
    } else if (['berita', 'agenda', 'unduhan'].includes(basename)) {
        parentLabel = "Informasi";
    } else if (['gallery', 'prestasi', 'alumni'].includes(basename)) {
        parentLabel = "Galeri & Alumni";
    }

    pageHeaderStr += `\n        breadcrumbs={[\n          { label: "${parentLabel}" },\n          { label: "${label || breadcrumbLabel}" }\n        ]}\n      />`;

    content = content.replace(heroRegex, pageHeaderStr);
  }

  // Also replace some spacing for cleanliness if needed
  content = content.replace(/py-24 mx-auto/g, 'py-12 mx-auto');
  content = content.replace(/py-24 bg-muted\/30/g, 'py-12 bg-muted/30');
  content = content.replace(/py-24 bg-white/g, 'py-12 bg-white');
  content = content.replace(/pb-20/g, 'pb-12');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Refactored hero to PageHeader in', file);
  }
});
