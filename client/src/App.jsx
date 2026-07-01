import {
  ArrowRight,
  BarChart3,
  Cctv,
  Code2,
  CreditCard,
  Database,
  DraftingCompass,
  ExternalLink,
  Github,
  ImagePlus,
  LayoutDashboard,
  Mail,
  Map,
  Menu,
  MessageCircle,
  Network,
  Phone,
  Plus,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { portfolio as fallbackPortfolio } from './data/portfolio.js';

const iconMap = [Code2, BarChart3, LayoutDashboard, Map, Database, Network];
const serviceIconMap = {
  'Payment Integration': CreditCard,
  'QGIS & GIS Mapping': Map,
  'AutoCAD Drafting': DraftingCompass,
  'Networking, Equipment & CCTV': Cctv
};
const emptyHeroImage = { title: '', caption: '', url: '' };
const emptyProject = { title: '', category: '', summary: '', tags: [], accent: '#6dc6ff', image: '', link: '' };
const emptyBlogSlide = { title: '', caption: '', image: '' };
const emptyService = { title: '', text: '' };
const emptyExperience = { title: '', company: '', period: '', points: [] };

function imageUrl(url) {
  return url || '';
}

function TextWithLinks({ text }) {
  const parts = String(text).split(/(https?:\/\/[^\s]+|www\.[^\s]+)/g);

  return parts.map((part, index) => {
    if (!/^(https?:\/\/|www\.)/.test(part)) return part;

    const href = part.startsWith('http') ? part : `https://${part}`;
    return (
      <a className="inline-link" href={href} key={`${part}-${index}`} target="_blank" rel="noreferrer">
        {part}
      </a>
    );
  });
}

function mergePortfolioContent(baseContent, storedContent = {}) {
  return {
    ...baseContent,
    ...storedContent,
    kilimoSlides: baseContent.kilimoSlides
  };
}

function usePortfolioContent() {
  const [content, setContent] = useState(fallbackPortfolio);

  return { content, setContent };
}

function Header({ content }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'About', href: '/#about' },
    { label: 'What I Do', href: '/#what-i-do' },
    { label: 'Work', href: '/#work' },
    { label: 'Notes', href: '/#notes' },
    { label: 'Contact', href: '/#contact' }
  ];

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label={`${content.profile.name} home`}>
        <span className="brand-mark">A</span>
        <span>{content.profile.name}</span>
      </a>
      <nav className={open ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
        {links.map((link) => (
          <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
      <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

function HeroCarousel({ images }) {
  const slides = images?.length ? images : fallbackPortfolio.heroImages;
  const [active, setActive] = useState(0);
  const slide = slides[active] || emptyHeroImage;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="hero-carousel" aria-label="Portfolio focus carousel">
      <div className="carousel-media">
        {slide.url ? (
          <img src={imageUrl(slide.url)} alt={slide.title || 'Portfolio slide'} />
        ) : (
          <div className="carousel-placeholder">
            <LayoutDashboard size={44} />
          </div>
        )}
      </div>
      <div className="carousel-caption">
        <strong>{slide.title}</strong>
        <span>{slide.caption}</span>
      </div>
      <div className="carousel-dots">
        {slides.map((item, index) => (
          <button
            aria-label={`Show ${item.title || `slide ${index + 1}`}`}
            className={index === active ? 'is-active' : ''}
            key={`${item.title}-${index}`}
            type="button"
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}

function Hero({ content }) {
  return (
    <section className="hero section" id="home">
      <div className="hero-copy">
        <h1>{content.profile.role}</h1>
        <p>{content.profile.intro}</p>
        <div className="hero-actions">
          <a className="button primary" href="#contact">
            Contact Me <ArrowRight size={18} />
          </a>
          <a className="button secondary" href="#work">
            View My Work
          </a>
        </div>
      </div>
      <div className="hero-panel" aria-label="IT operations and software development preview">
        <div className="panel-toolbar">
          <span />
          <span />
          <span />
        </div>
        <HeroCarousel images={content.heroImages} />
      </div>
    </section>
  );
}

function Services({ content }) {
  return (
    <section className="section" id="what-i-do">
      <div className="section-heading">
        <span>What I Do</span>
        <h2>Web systems for corporates, commerce, and agritech.</h2>
      </div>
      <div className="service-grid">
        {content.services.map((service, index) => {
          const Icon = serviceIconMap[service.title] || iconMap[index] || Code2;
          return (
            <article className="service-card" key={`${service.title}-${index}`}>
              <Icon size={26} />
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Work({ content }) {
  return (
    <section className="section muted" id="work">
      <div className="section-heading split">
        <div>
          <span>Selected Work</span>
          <h2>Practical work shaped by real operations.</h2>
        </div>
        <a className="text-link" href="#contact">
          Start a project <ArrowRight size={17} />
        </a>
      </div>
      <div className="project-grid">
        {content.projects.map((project, index) => (
          <article className="project-card" key={`${project.title}-${index}`}>
            <div className="project-visual" style={{ '--accent': project.accent || '#6dc6ff' }}>
              {project.image ? <img src={imageUrl(project.image)} alt={project.title} /> : <ExternalLink size={22} />}
            </div>
            <div className="project-body">
              <span>{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="tag-list">
                {(project.tags || []).map((tag) => (
                  <small key={tag}>{tag}</small>
                ))}
              </div>
              {project.link ? (
                <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                  Open project <ExternalLink size={16} />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function KilimoCarousel({ slides }) {
  const carouselSlides = slides?.length ? slides : fallbackPortfolio.kilimoSlides;
  const [active, setActive] = useState(0);
  const slide = carouselSlides[active] || carouselSlides[0];

  useEffect(() => {
    if (carouselSlides.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % carouselSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [carouselSlides.length]);

  if (!slide) return null;

  return (
    <aside className="kilimo-carousel" aria-label="Kilimo Kisasa AI founder carousel">
      <div className="kilimo-media">
        <img src={imageUrl(slide.image)} alt={slide.title} />
      </div>
      <div className="kilimo-content">
        <span>Founder</span>
        <h3>{slide.title}</h3>
        <p>{slide.description}</p>
        <a className="text-link" href="https://kilimokisasaai.netlify.app/" target="_blank" rel="noreferrer">
          Visit Kilimo Kisasa AI <ExternalLink size={17} />
        </a>
      </div>
      <div className="kilimo-controls">
        {carouselSlides.map((item, index) => (
          <button
            aria-label={`Show ${item.title}`}
            className={index === active ? 'is-active' : ''}
            key={`${item.title}-${index}`}
            type="button"
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </aside>
  );
}

function About({ content }) {
  return (
    <section className="section about" id="about">
      <div>
        <span className="eyebrow">About</span>
        <h2>Hey, I am {content.profile.name}.</h2>
        <p>{content.profile.bio}</p>
        <div className="skill-list">
          {content.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
      <KilimoCarousel slides={content.kilimoSlides} />
    </section>
  );
}

function Notes({ content }) {
  const slides = content.blogSlides?.length ? content.blogSlides : fallbackPortfolio.blogSlides;

  return (
    <section className="section blog-section" id="notes">
      <div className="section-heading split">
        <div>
          <span>Notes</span>
          <h2>Notes on activism, agritech, and useful technology.</h2>
          <p>
            A short space for the ideas that keep shaping my work: community, agriculture, and tools that make life a little easier.
          </p>
        </div>
      </div>
      <div className="blog-card-list">
        {slides.map((slide, index) => (
          <article className="blog-card" key={`${slide.title}-${index}`}>
            <div className="blog-media">
              <img src={imageUrl(slide.image)} alt={slide.title} />
            </div>
            <div className="blog-copy">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{slide.title}</h3>
              <p>{slide.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Experience({ content }) {
  return (
    <section className="section experience-section">
      <div className="section-heading split">
        <div>
          <span>Experience</span>
          <h2>IT leadership, support, and software delivery.</h2>
        </div>
        <a className="text-link" href={content.profile.github} target="_blank" rel="noreferrer">
          GitHub <Github size={17} />
        </a>
      </div>
      <div className="experience-grid">
        {content.experience.map((item) => (
          <article className="experience-card" key={`${item.title}-${item.company}`}>
            <span>{item.period}</span>
            <h3>{item.title}</h3>
            <p>{item.company}</p>
            <ul>
              {(item.points || []).map((point) => (
                <li key={point}>
                  <TextWithLinks text={point} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="certification-strip">
        {(content.certifications || []).map((certification) => (
          <span key={certification}>{certification}</span>
        ))}
      </div>
    </section>
  );
}

function Testimonial({ content }) {
  const testimonial = content.testimonials[0];

  return (
    <section className="testimonial">
      <blockquote>"{testimonial.quote}"</blockquote>
      <p>
        {testimonial.name} <span>{testimonial.role}</span>
      </p>
    </section>
  );
}

function Contact({ content }) {
  const whatsappNumber = content.profile.phone.replace(/\D/g, '').replace(/^0/, '254');
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') || 'Portfolio visitor';
    const email = formData.get('email') || '';
    const projectType = formData.get('projectType') || 'General enquiry';
    const message = formData.get('message') || '';
    const subject = encodeURIComponent(`Portfolio enquiry: ${projectType}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\n${message}`);

    window.location.href = `mailto:${content.profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="section contact" id="contact">
      <div>
        <span className="eyebrow">Contact</span>
        <h2>Need a corporate site, online store, or agritech platform?</h2>
        <p>Send the details and I will get back with a practical next step.</p>
        <a className="mail-link" href={`mailto:${content.profile.email}`}>
          <Mail size={18} />
          {content.profile.email}
        </a>
        <a className="mail-link" href={`tel:${content.profile.phone.replaceAll(' ', '')}`}>
          <Phone size={18} />
          {content.profile.phone}
        </a>
        <a className="mail-link" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          WhatsApp {content.profile.phone}
        </a>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your name" />
        <input type="email" name="email" placeholder="Email address" />
        <select name="projectType" defaultValue="">
          <option value="" disabled>
            What do you need?
          </option>
          <option>Corporate website</option>
          <option>E-commerce platform</option>
          <option>Payment integration (Mpesa, Card)</option>
          <option>Agritech platform</option>
          <option>GIS mapping or QGIS services</option>
          <option>AutoCAD drafting</option>
          <option>Admin dashboard</option>
          <option>IT support or systems consulting</option>
        </select>
        <textarea name="message" rows="5" placeholder="Tell me about the project" />
        <button className="button primary" type="submit">
          Send Enquiry <ArrowRight size={18} />
        </button>
      </form>
    </section>
  );
}

function Field({ label, value, onChange, multiline = false }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value || ''} rows="4" onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input value={value || ''} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function ListEditor({ title, items, setItems, emptyItem, renderItem }) {
  return (
    <section className="admin-card">
      <div className="admin-card-title">
        <h2>{title}</h2>
        <button type="button" onClick={() => setItems([...(items || []), emptyItem])}>
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="admin-list">
        {(items || []).map((item, index) => (
          <div className="admin-list-item" key={index}>
            {renderItem(item, index)}
            <button className="danger" type="button" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>
              <Trash2 size={16} /> Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminApp({ content, setContent }) {
  const [draft, setDraft] = useState(content);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const updateProfile = (key, value) => {
    setDraft((current) => ({ ...current, profile: { ...current.profile, [key]: value } }));
  };

  const saveContent = () => {
    const saved = mergePortfolioContent(fallbackPortfolio, draft);
    setContent(saved);
    setDraft(saved);
    setMessage('Preview updated. Make permanent content changes in client/src/data/portfolio.js.');
  };

  const uploadImage = (file, onUploaded) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUploaded(reader.result);
      setMessage(`Image added: ${file.name}. Click Save All Changes to keep it.`);
    };
    reader.readAsDataURL(file);
  };

  const resetContent = () => {
    setDraft(fallbackPortfolio);
    setContent(fallbackPortfolio);
    setMessage('Browser preview reset to the content coded in client/src/data/portfolio.js.');
  };

  const setCollection = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const updateCollectionItem = (key, index, nextItem) => {
    setCollection(
      key,
      draft[key].map((item, itemIndex) => (itemIndex === index ? nextItem : item))
    );
  };

  const skillsText = useMemo(() => (draft.skills || []).join('\n'), [draft.skills]);
  const certificationsText = useMemo(() => (draft.certifications || []).join('\n'), [draft.certifications]);

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-topbar">
          <div>
            <a href="/" className="text-link">
              <ArrowRight className="back-icon" size={17} /> Portfolio
            </a>
            <h1>Admin Dashboard</h1>
            <p>Edit content visually and preview it in this browser. Permanent content lives in the code.</p>
          </div>
          <button className="danger" type="button" onClick={resetContent}>
            <Trash2 size={16} /> Reset local edits
          </button>
        </div>

        <section className="admin-card">
          <div className="admin-card-title">
            <h2>Profile</h2>
            <button type="button" onClick={saveContent}>
              <Save size={16} /> Save All
            </button>
          </div>
          <div className="admin-grid-form">
            {['name', 'role', 'location', 'availability', 'email', 'phone', 'github'].map((field) => (
              <Field key={field} label={field} value={draft.profile[field]} onChange={(value) => updateProfile(field, value)} />
            ))}
            <Field label="intro" value={draft.profile.intro} multiline onChange={(value) => updateProfile('intro', value)} />
            <Field label="bio" value={draft.profile.bio} multiline onChange={(value) => updateProfile('bio', value)} />
          </div>
        </section>

        <ListEditor
          title="Hero Carousel"
          items={draft.heroImages}
          setItems={(items) => setCollection('heroImages', items)}
          emptyItem={emptyHeroImage}
          renderItem={(item, index) => (
            <>
              <Field label="title" value={item.title} onChange={(value) => updateCollectionItem('heroImages', index, { ...item, title: value })} />
              <Field label="caption" value={item.caption} onChange={(value) => updateCollectionItem('heroImages', index, { ...item, caption: value })} />
              <Field label="image url" value={item.url} onChange={(value) => updateCollectionItem('heroImages', index, { ...item, url: value })} />
              <label className="upload-button">
                <ImagePlus size={16} /> Upload slide image
                <input
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  type="file"
                  onChange={(event) =>
                    uploadImage(event.target.files?.[0], (url) => updateCollectionItem('heroImages', index, { ...item, url }))
                  }
                />
              </label>
            </>
          )}
        />

        <ListEditor
          title="Services"
          items={draft.services}
          setItems={(items) => setCollection('services', items)}
          emptyItem={emptyService}
          renderItem={(item, index) => (
            <>
              <Field label="title" value={item.title} onChange={(value) => updateCollectionItem('services', index, { ...item, title: value })} />
              <Field label="text" value={item.text} multiline onChange={(value) => updateCollectionItem('services', index, { ...item, text: value })} />
            </>
          )}
        />

        <ListEditor
          title="Projects"
          items={draft.projects}
          setItems={(items) => setCollection('projects', items)}
          emptyItem={emptyProject}
          renderItem={(item, index) => (
            <>
              <Field label="title" value={item.title} onChange={(value) => updateCollectionItem('projects', index, { ...item, title: value })} />
              <Field label="category" value={item.category} onChange={(value) => updateCollectionItem('projects', index, { ...item, category: value })} />
              <Field label="summary" value={item.summary} multiline onChange={(value) => updateCollectionItem('projects', index, { ...item, summary: value })} />
              <Field
                label="tags, comma separated"
                value={(item.tags || []).join(', ')}
                onChange={(value) => updateCollectionItem('projects', index, { ...item, tags: value.split(',').map((tag) => tag.trim()).filter(Boolean) })}
              />
              <Field label="image url" value={item.image} onChange={(value) => updateCollectionItem('projects', index, { ...item, image: value })} />
              <Field label="project link" value={item.link} onChange={(value) => updateCollectionItem('projects', index, { ...item, link: value })} />
              <label className="upload-button">
                <ImagePlus size={16} /> Upload project image
                <input
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  type="file"
                  onChange={(event) =>
                    uploadImage(event.target.files?.[0], (url) => updateCollectionItem('projects', index, { ...item, image: url }))
                  }
                />
              </label>
            </>
          )}
        />

        <ListEditor
          title="Notes Cards"
          items={draft.blogSlides}
          setItems={(items) => setCollection('blogSlides', items)}
          emptyItem={emptyBlogSlide}
          renderItem={(item, index) => (
            <>
              <Field label="title" value={item.title} onChange={(value) => updateCollectionItem('blogSlides', index, { ...item, title: value })} />
              <Field label="text" value={item.caption} multiline onChange={(value) => updateCollectionItem('blogSlides', index, { ...item, caption: value })} />
              <Field label="image url" value={item.image} onChange={(value) => updateCollectionItem('blogSlides', index, { ...item, image: value })} />
              <label className="upload-button">
                <ImagePlus size={16} /> Upload note image
                <input
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  type="file"
                  onChange={(event) =>
                    uploadImage(event.target.files?.[0], (url) => updateCollectionItem('blogSlides', index, { ...item, image: url }))
                  }
                />
              </label>
            </>
          )}
        />

        <ListEditor
          title="Experience"
          items={draft.experience}
          setItems={(items) => setCollection('experience', items)}
          emptyItem={emptyExperience}
          renderItem={(item, index) => (
            <>
              <Field label="title" value={item.title} onChange={(value) => updateCollectionItem('experience', index, { ...item, title: value })} />
              <Field label="company" value={item.company} onChange={(value) => updateCollectionItem('experience', index, { ...item, company: value })} />
              <Field label="period" value={item.period} onChange={(value) => updateCollectionItem('experience', index, { ...item, period: value })} />
              <Field
                label="points, one per line"
                value={(item.points || []).join('\n')}
                multiline
                onChange={(value) => updateCollectionItem('experience', index, { ...item, points: value.split('\n').filter(Boolean) })}
              />
            </>
          )}
        />

        <section className="admin-card">
          <div className="admin-card-title">
            <h2>Skills & Certifications</h2>
          </div>
          <div className="admin-grid-form">
            <Field label="skills, one per line" value={skillsText} multiline onChange={(value) => setCollection('skills', value.split('\n').filter(Boolean))} />
            <Field
              label="certifications, one per line"
              value={certificationsText}
              multiline
              onChange={(value) => setCollection('certifications', value.split('\n').filter(Boolean))}
            />
          </div>
        </section>

        <section className="admin-actions">
          <button type="button" onClick={saveContent}>
            <Save size={16} /> Save Preview
          </button>
          <span>{message}</span>
        </section>
      </div>
    </main>
  );
}

function PortfolioApp({ content }) {
  return (
    <>
      <Header content={content} />
      <main>
        <Hero content={content} />
        <Services content={content} />
        <Work content={content} />
        <Testimonial content={content} />
        <About content={content} />
        <Notes content={content} />
        <Experience content={content} />
        <Contact content={content} />
      </main>
      <footer className="footer">
        <span>{content.profile.name}</span>
        <p>
          {content.profile.role} based in {content.profile.location}.
        </p>
      </footer>
    </>
  );
}

function App() {
  const { content, setContent } = usePortfolioContent();
  const isAdmin = window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminApp content={content} setContent={setContent} />;
  }

  return <PortfolioApp content={content} />;
}

export default App;
