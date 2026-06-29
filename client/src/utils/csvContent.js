import { portfolio as fallbackPortfolio } from '../data/portfolio.js';

const csvFiles = {
  profile: '/data/profile.csv',
  stats: '/data/stats.csv',
  heroImages: '/data/hero-images.csv',
  services: '/data/services.csv',
  projects: '/data/projects.csv',
  blogSlides: '/data/blog-slides.csv',
  skills: '/data/skills.csv',
  experience: '/data/experience.csv',
  certifications: '/data/certifications.csv',
  testimonials: '/data/testimonials.csv'
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== '')) rows.push(row);

  return rows;
}

function toObjects(csv) {
  const rows = parseCsv(csv);
  const headers = rows.shift() || [];

  return rows.map((row) =>
    headers.reduce((item, header, index) => {
      item[header] = row[index] || '';
      return item;
    }, {})
  );
}

function escapeCsv(value) {
  const output = String(value ?? '');
  return /[",\n\r]/.test(output) ? `"${output.replaceAll('"', '""')}"` : output;
}

function makeCsv(headers, rows) {
  return [headers.join(','), ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(','))].join('\n');
}

async function fetchCsv(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.text();
}

export async function loadCsvContent() {
  const [profile, stats, heroImages, services, projects, blogSlides, skills, experience, certifications, testimonials] =
    await Promise.all([
      fetchCsv(csvFiles.profile),
      fetchCsv(csvFiles.stats),
      fetchCsv(csvFiles.heroImages),
      fetchCsv(csvFiles.services),
      fetchCsv(csvFiles.projects),
      fetchCsv(csvFiles.blogSlides),
      fetchCsv(csvFiles.skills),
      fetchCsv(csvFiles.experience),
      fetchCsv(csvFiles.certifications),
      fetchCsv(csvFiles.testimonials)
    ]);

  const profileRows = toObjects(profile);

  return {
    ...fallbackPortfolio,
    profile: profileRows.reduce((profileData, row) => ({ ...profileData, [row.key]: row.value }), {
      ...fallbackPortfolio.profile
    }),
    stats: toObjects(stats),
    heroImages: toObjects(heroImages),
    services: toObjects(services),
    projects: toObjects(projects).map((project) => ({
      ...project,
      tags: project.tags ? project.tags.split('|').map((tag) => tag.trim()).filter(Boolean) : []
    })),
    blogSlides: toObjects(blogSlides),
    skills: toObjects(skills).map((row) => row.skill).filter(Boolean),
    experience: toObjects(experience).map((item) => ({
      ...item,
      points: item.points ? item.points.split('|').map((point) => point.trim()).filter(Boolean) : []
    })),
    certifications: toObjects(certifications).map((row) => row.certification).filter(Boolean),
    testimonials: toObjects(testimonials)
  };
}

export function contentToCsvFiles(content) {
  return {
    'profile.csv': makeCsv(
      ['key', 'value'],
      Object.entries(content.profile || {}).map(([key, value]) => ({ key, value }))
    ),
    'stats.csv': makeCsv(['value', 'label'], content.stats || []),
    'hero-images.csv': makeCsv(['title', 'caption', 'url'], content.heroImages || []),
    'services.csv': makeCsv(['title', 'text'], content.services || []),
    'projects.csv': makeCsv(
      ['title', 'category', 'summary', 'tags', 'accent', 'image', 'link'],
      (content.projects || []).map((project) => ({
        ...project,
        tags: (project.tags || []).join('|')
      }))
    ),
    'blog-slides.csv': makeCsv(['title', 'caption', 'image'], content.blogSlides || []),
    'skills.csv': makeCsv(
      ['skill'],
      (content.skills || []).map((skill) => ({
        skill
      }))
    ),
    'experience.csv': makeCsv(
      ['title', 'company', 'period', 'points'],
      (content.experience || []).map((item) => ({
        ...item,
        points: (item.points || []).join('|')
      }))
    ),
    'certifications.csv': makeCsv(
      ['certification'],
      (content.certifications || []).map((certification) => ({
        certification
      }))
    ),
    'testimonials.csv': makeCsv(['quote', 'name', 'role'], content.testimonials || [])
  };
}

export function downloadCsvFiles(content) {
  const files = contentToCsvFiles(content);

  Object.entries(files).forEach(([filename, csv], index) => {
    window.setTimeout(() => {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }, index * 150);
  });
}
