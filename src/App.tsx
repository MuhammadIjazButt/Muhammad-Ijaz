/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Linkedin, 
  Facebook, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Globe, 
  Award, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  Search,
  CheckCircle,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

// --- CONFIG & THEME constants ---
const THEME = {
  bg: '#0a0e1a',
  bgSecondary: '#0d1221',
  card: '#1a2035',
  gold: '#c9a84c',
  goldLight: '#e8c97e',
  textPrimary: '#f0f0f0',
  textSecondary: '#8a9bb5',
  border: 'rgba(255,255,255,0.07)',
  fonts: {
    heading: '"Cormorant Garamond", serif',
    body: '"DM Sans", sans-serif',
    accent: '"Space Mono", monospace'
  }
};

const LOGOS = {
  pakistanGov: "https://upload.wikimedia.org/wikipedia/commons/e/ef/State_emblem_of_Pakistan.svg",
  sbp: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/State_Bank_of_Pakistan_Logo.svg/1200px-State_Bank_of_Pakistan_Logo.svg.png",
  ndu: "https://upload.wikimedia.org/wikipedia/commons/6/64/National_Defence_University_Pakistan_logo.png",
  qau: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Quaid-i-Azam_University_logo.svg/1200px-Quaid-i-Azam_University_logo.svg.png",
  lums: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/LUMS_logo.svg/1200px-LUMS_logo.svg.png",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png",
  google: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
  nust: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/NUST_Pakistan_logo.svg/1200px-NUST_Pakistan_logo.svg.png",
  un: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/1200px-Flag_of_the_United_Nations.svg.png",
  suparco: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/SUPARCO_Logo.png/800px-SUPARCO_Logo.png",
  youthParliament: "https://youthparliament.pk/wp-content/uploads/2021/08/logo.png",
  unfpa: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/UNFPA_logo.svg/1200px-UNFPA_logo.svg.png",
  hec: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/HEC_Pakistan_logo.svg/1200px-HEC_Pakistan_logo.svg.png",
  ahss: "https://ahss.org.pk/images/logo.png",
  jads: "https://poverty.com.pk/public/images/favicon.png"
};

// --- REUSABLE COMPONENTS ---

/**
 * Hook for intersection observer animations
 */
const OrgLogo = ({ src, alt, size = 32 }: { src: string; alt: string; size?: number }) => {
  if (!src) return null;
  
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{ height: `${size}px`, maxWidth: `${size * 2}px`, width: 'auto', objectFit: 'contain', filter: 'brightness(1.1) contrast(1.1)' }} 
      referrerPolicy="no-referrer"
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        img.style.display = 'none';
        
        // Hide the container if it's just the icon placeholder
        const iconContainer = img.parentElement;
        if (iconContainer && iconContainer.classList.contains('icon-logo-container')) {
          iconContainer.style.display = 'none';
        }
      }}
    />
  );
};

const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return { isVisible, domRef };
};

const FadeIn = ({ children, delay = 0, ...props }: { children: React.ReactNode; delay?: number; [key: string]: any }) => {
  const { isVisible, domRef } = useScrollReveal();
  
  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s, transform 1s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
  };

  return (
    <div ref={domRef} style={{...style, ...props.style}} {...props}>
      {children}
    </div>
  );
};

const SectionLabel = ({ text }: { text: string }) => (
  <span style={{
    fontFamily: THEME.fonts.accent,
    color: THEME.gold,
    fontSize: '0.75rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '1rem'
  }}>
    {text}
  </span>
);

const GoldDivider = () => (
  <div style={{
    height: '1px',
    width: '60px',
    background: THEME.gold,
    margin: '2rem 0',
    opacity: 0.6
  }} />
);

// --- MAIN APPLICATION COMPONENT ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Typewriter effect state
  const [typewriterText, setTypewriterText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const roles = ["Policy & Data Analyst", "Governance Researcher", "Strategic Policy Analyst", "Published Academic"];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter Logic
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && typewriterText === currentRole) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && typewriterText === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        const nextText = isDeleting 
          ? currentRole.substring(0, typewriterText.length - 1)
          : currentRole.substring(0, typewriterText.length + 1);
        setTypewriterText(nextText);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, roleIndex]);

  // Inline Styles
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=Space+Mono&display=swap');
    
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { 
      margin: 0; 
      background-color: ${THEME.bg}; 
      color: ${THEME.textPrimary}; 
      font-family: ${THEME.fonts.body};
      line-height: 1.6;
      overflow-x: hidden;
    }
    
    a { text-decoration: none; color: inherit; transition: color 0.3s; }
    
    .glass {
      background: rgba(26, 32, 53, 0.6);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .pill {
      padding: 4px 14px;
      border-radius: 9999px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      background: rgba(201, 168, 76, 0.1);
      border: 1px solid rgba(201, 168, 76, 0.25);
      color: ${THEME.gold};
      font-family: ${THEME.fonts.accent};
      width: fit-content;
    }

    .stat-box {
      border-left: 3px solid ${THEME.gold};
      padding-left: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-box:hover {
       transform: translateX(5px);
    }

    .glass-nav {
      background: ${isScrolled ? 'rgba(10, 14, 26, 0.8)' : 'transparent'};
      backdrop-filter: ${isScrolled ? 'blur(20px)' : 'none'};
      box-shadow: ${isScrolled ? '0 10px 40px rgba(0, 0, 0, 0.4)' : 'none'};
      border-bottom: ${isScrolled ? `1px solid ${THEME.border}` : 'none'};
    }

    .card-hover:hover {
      transform: translateY(-10px) scale(1.01);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      border-color: rgba(201, 168, 76, 0.4) !important;
    }

    .btn-gold:hover {
      background: ${THEME.goldLight} !important;
      transform: translateY(-2px);
    }

    .btn-ghost:hover {
      background: rgba(201, 168, 76, 0.1) !important;
      transform: translateY(-2px);
    }

    @keyframes float {
      0% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(-20px) translateX(10px); }
      100% { transform: translateY(0px) translateX(0px); }
    }

    .award-card:hover .award-icon {
      transform: rotate(15deg) scale(1.1);
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .floating-shape {
      position: absolute;
      border: 1px solid rgba(201, 168, 76, 0.05);
      border-radius: 50%;
      pointer-events: none;
      animation: float 8s infinite ease-in-out;
    }

    .timeline-dot::before {
      content: '';
      position: absolute;
      left: -9px;
      top: 0;
      width: 18px;
      height: 18px;
      background: ${THEME.bg};
      border: 2px solid ${THEME.gold};
      border-radius: 50%;
      z-index: 2;
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 3.5rem !important; }
      .desktop-nav { display: none !important; }
      .mobile-menu-btn { display: block !important; }
      .split-layout { flex-direction: column !important; }
      .stat-row { flex-wrap: wrap !important; }
      .stat-box { min-width: 45% !important; margin-bottom: 1rem !important; }
    }
  `;

  return (
    <div id="portfolio-root" style={{ width: '100%' }}>
      <style>{globalStyles}</style>

      {/* --- SECTION 1: NAVBAR --- */}
      <nav 
        className="glass-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5%',
          zIndex: 1000,
          transition: 'all 0.4s ease'
        }}
      >
        <div style={{
          fontFamily: THEME.fonts.heading,
          fontSize: '1.8rem',
          fontWeight: 700,
          color: THEME.gold,
          cursor: 'pointer'
        }}>
          MIjaz
        </div>

        {/* Desktop Links */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem' }}>
          {['About', 'Experience', 'Research', 'Skills', 'Contact'].map(link => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              style={{
                fontFamily: THEME.fonts.accent,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = THEME.gold)}
              onMouseOut={(e) => (e.currentTarget.style.color = 'inherit')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <div 
          className="mobile-menu-btn"
          style={{ display: 'none', cursor: 'pointer', color: THEME.gold }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            width: '100%',
            background: THEME.bgSecondary,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            borderBottom: `1px solid ${THEME.border}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            {['About', 'Experience', 'Research', 'Skills', 'Contact'].map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontFamily: THEME.fonts.accent, textTransform: 'uppercase' }}
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* --- SECTION 2: HERO --- */}
      <section id="hero" style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 10%',
        position: 'relative',
        background: `radial-gradient(circle at 10% 20%, rgba(20, 28, 48, 1) 0%, rgba(10, 14, 26, 1) 90%)`,
        overflow: 'hidden'
      }}>
        {/* Decorative Shapes */}
        <div className="floating-shape" style={{ width: '300px', height: '300px', top: '10%', right: '5%' }} />
        <div className="floating-shape" style={{ width: '150px', height: '150px', bottom: '20%', left: '10%', animationDelay: '-2s' }} />
        <div style={{
          position: 'absolute', 
          width: '1px', 
          height: '40%', 
          background: `linear-gradient(to bottom, transparent, ${THEME.gold}, transparent)`,
          left: '5%',
          opacity: 0.3
        }} />

        <FadeIn>
          <h1 className="hero-title" style={{
            fontFamily: THEME.fonts.heading,
            fontSize: '5.5rem',
            margin: '0 0 1rem 0',
            fontWeight: 700,
            lineHeight: 1.1
          }}>
            Muhammad Ijaz
          </h1>
          
          <div style={{
            fontFamily: THEME.fonts.accent,
            fontSize: '1.5rem',
            color: THEME.goldLight,
            marginBottom: '2rem',
            height: '1.6rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            {typewriterText}
            <span style={{
              marginLeft: '4px',
              width: '2px',
              height: '80%',
              background: THEME.gold,
              animation: 'blink 1s step-end infinite'
            }} />
          </div>

          <p style={{
            maxWidth: '700px',
            fontSize: '1.2rem',
            color: THEME.textSecondary,
            marginBottom: '3rem'
          }}>
            Policy and data analyst and researcher with a proven track record of driving impact across Pakistan's national development landscape.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a 
              href="#research"
              className="btn-gold" 
              style={{
                padding: '1.2rem 2.5rem',
                background: THEME.gold,
                color: '#000',
                borderRadius: '4px',
                fontWeight: 700,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              View My Work
            </a>
            <a 
              href="#contact"
              className="btn-ghost" 
              style={{
                padding: '1.2rem 2.5rem',
                border: `1px solid ${THEME.gold}`,
                color: THEME.gold,
                borderRadius: '4px',
                fontWeight: 700,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Get In Touch
            </a>
          </div>
        </FadeIn>

        {/* Scroll Arrow */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'float 2s infinite ease-in-out'
        }}>
          <div style={{
            width: '30px',
            height: '50px',
            border: `2px solid ${THEME.textSecondary}`,
            borderRadius: '15px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10px'
          }}>
            <div style={{
              width: '4px',
              height: '8px',
              background: THEME.gold,
              borderRadius: '2px'
            }} />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: ABOUT --- */}
      <section id="about" style={{ padding: '10rem 10%', background: THEME.bgSecondary }}>
        <div className="split-layout" style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
          <FadeIn>
            <div style={{
              width: '300px',
              height: '300px',
              background: THEME.card,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: `2px solid ${THEME.gold}`,
              boxShadow: `0 0 40px rgba(201, 168, 76, 0.1)`,
              fontSize: '4rem',
              fontFamily: THEME.fonts.heading,
              color: THEME.gold,
              position: 'relative'
            }}>
              MJ
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '80px',
                height: '80px',
                background: THEME.gold,
                borderRadius: '50%',
                opacity: 0.1
              }} />
            </div>
          </FadeIn>

          <div style={{ flex: 1 }}>
            <FadeIn delay={0.2}>
              <SectionLabel text="WHO I AM" />
              <h2 style={{
                fontFamily: THEME.fonts.heading,
                fontSize: '3.5rem',
                margin: '0 0 1.5rem 0',
                color: THEME.textPrimary
              }}>
                Bridging Policy, Research & Digital Governance
              </h2>
              <p style={{ fontSize: '1.2rem', color: THEME.textSecondary, marginBottom: '2rem' }}>
                Based in Islamabad, I am a Fellow at the Ministry of Planning & Development driven by a passion for governance reform in Pakistan. My work sits at the intersection of bureaucratic efficiency and digital transformation.
              </p>

              <div className="stat-row" style={{ display: 'flex', gap: '3rem', margin: '3rem 0' }}>
                <div className="stat-box">
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: THEME.gold, fontFamily: THEME.fonts.heading, lineHeight: 1 }}>2+</div>
                  <div style={{ fontFamily: THEME.fonts.accent, fontSize: '0.7rem', color: THEME.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>HEC Publications</div>
                </div>
                <div className="stat-box">
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: THEME.gold, fontFamily: THEME.fonts.heading, lineHeight: 1 }}>7+</div>
                  <div style={{ fontFamily: THEME.fonts.accent, fontSize: '0.7rem', color: THEME.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Strategic Initiatives</div>
                </div>
                <div className="stat-box">
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: THEME.gold, fontFamily: THEME.fonts.heading, lineHeight: 1 }}>40+</div>
                  <div style={{ fontFamily: THEME.fonts.accent, fontSize: '0.7rem', color: THEME.textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Stakeholders Engaged</div>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button className="btn-ghost" style={{
                  padding: '1rem 2rem',
                  border: `1px solid ${THEME.gold}`,
                  color: THEME.gold,
                  borderRadius: '4px',
                  background: 'transparent',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Download CV
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: EXPERIENCE --- */}
      <section id="experience" style={{ padding: '10rem 10%' }}>
        <FadeIn>
          <SectionLabel text="MY JOURNEY" />
          <h2 style={{ fontFamily: THEME.fonts.heading, fontSize: '3.5rem', marginBottom: '4rem' }}>Professional Experience</h2>
        </FadeIn>

        <div style={{ position: 'relative', borderLeft: `2px solid ${THEME.gold}`, paddingLeft: '3rem', marginLeft: '1rem' }}>
          {[
            {
              role: "Young Development Fellow",
              org: "Ministry of Planning, Development & Special Initiatives",
              duration: "Oct 2024 – Nov 2025",
              highlight: "Contributed to URAAN Pakistan — the national economic transformation plan",
              points: [
                "Focal Person for STED Initiative — engaged 40–50 stakeholders from government, academia & development sector",
                "Built digital monitoring dashboards for 500+ PSDP projects, reducing operational costs by 20–30%",
                "Supported UNFPA joint initiative on population policy & civil service reform via SMART framework"
              ]
            },
            {
              role: "Intern",
              org: "Public Private Partnership Authority, Islamabad",
              duration: "Aug 2023 – Oct 2023",
              highlight: "Assisted in procurement compliance and tender document review under PPRA rules"
            },
            {
              role: "Intern",
              org: "State Bank of Pakistan",
              duration: "Jun 2022 – Aug 2022",
              highlight: "Supported RAAST digital payment system — awareness campaign reached 2,000+ users, boosting adoption 10%"
            }
          ].map((exp, idx) => (
            <div key={idx} className="timeline-dot" style={{ marginBottom: '5rem', position: 'relative' }}>
              <FadeIn delay={idx * 0.1}>
                <div 
                  className="card-hover glass"
                  style={{
                    padding: '2.5rem',
                    borderRadius: '8px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.8rem', margin: 0, color: THEME.textPrimary, fontFamily: THEME.fonts.heading }}>{exp.role}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.5rem' }}>
                        <OrgLogo 
                          src={
                            exp.org.includes('Ministry of Planning') ? LOGOS.pakistanGov :
                            exp.org.includes('Public Private') ? LOGOS.pakistanGov : 
                            exp.org.includes('State Bank') ? LOGOS.sbp : LOGOS.pakistanGov
                          } 
                          alt={exp.org} 
                          size={28}
                        />
                        <p style={{ fontSize: '0.9rem', color: THEME.gold, margin: 0, fontFamily: THEME.fonts.accent, textTransform: 'uppercase', letterSpacing: '1px' }}>{exp.org}</p>
                      </div>
                    </div>
                    <span style={{ fontFamily: THEME.fonts.accent, color: THEME.textSecondary, fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px' }}>{exp.duration}</span>
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontWeight: 700, color: THEME.goldLight, display: 'block', marginBottom: '1rem' }}>
                      {exp.highlight}
                    </p>
                    {exp.points && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: THEME.textSecondary }}>
                          {exp.points.map((p, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{p}</li>)}
                        </ul>
                        {exp.org.includes('Ministry of Planning') && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px 15px', borderRadius: '4px', width: 'fit-content' }}>
                            <span style={{ fontSize: '0.7rem', color: THEME.gold, fontFamily: THEME.fonts.accent }}>Joint Partner:</span>
                            <OrgLogo src={LOGOS.unfpa} alt="UNFPA" size={24} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 5: RESEARCH --- */}
      <section id="research" style={{ padding: '10rem 10%', background: THEME.bgSecondary }}>
        <FadeIn>
          <SectionLabel text="ACADEMIC WORK" />
          <h2 style={{ fontFamily: THEME.fonts.heading, fontSize: '3.5rem', marginBottom: '1rem' }}>Research & Publications</h2>
          <p style={{ color: THEME.textSecondary, fontSize: '1.2rem', marginBottom: '4rem' }}>
            Peer-reviewed research in governance, AI policy, and digital transformation.
          </p>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {[
            {
              badge: "National Priority Policy",
              title: "Population as a national emergency",
              journal: "Planning Commission — Official Blog",
              logo: LOGOS.pakistanGov,
              details: "Planning Commission official blog | Jan 2024",
              author: "Muhammad Ijaz",
              summary: "Analysing the demographic challenges facing Pakistan and proposing strategic policy interventions to address the population growth as a critical national emergency.",
              tags: ["Population Policy", "National Security", "Demographics"],
              link: "https://pc.gov.pk/web/blog/getblog/16"
            },
            {
              badge: "HEC Recognized — Y Category",
              title: "Algorithmic Governance: Unveiling the Nexus between Artificial Intelligence and Policy Dynamics",
              journal: "Annals of Human and Social Sciences",
              logo: LOGOS.ahss,
              details: "Vol. 5, No. 2 | April–June 2024",
              author: "Muhammad Ijaz",
              summary: "Explores the intersection of AI and public policy through algorithmic governance — examining regulatory challenges and policy responses needed to govern AI systems in modern governance structures.",
              tags: ["AI Policy", "Governance", "Regulation"]
            },
            {
              title: "Major Factors Contributing to the Failure of Digitalization in Public Sector Organizations: An Analysis of the Federal Government of Pakistan",
              journal: "Journal of Asian Development Studies",
              logo: LOGOS.hec,
              details: "Vol. 13, No. 3 | September 2024",
              author: "Muhammad Ijaz, Moiz Abbas, Mohibullah",
              summary: "Examines barriers to digital transformation in Pakistan's federal government. Identifies bureaucratic resistance, limited technical capacity, and weak governance as key obstacles.",
              tags: ["Digital Governance", "Pakistan", "Public Sector"]
            }
          ].map((pub, idx) => (
            <FadeIn key={idx} delay={idx * 0.2}>
              <div 
                className="card-hover glass"
                style={{
                  borderRadius: '12px',
                  borderLeft: `4px solid ${THEME.gold}`,
                  padding: '3rem',
                  position: 'relative',
                  cursor: pub.link ? 'pointer' : 'default'
                }}
                onClick={() => pub.link && window.open(pub.link, '_blank')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                  <OrgLogo src={pub.logo || LOGOS.hec} alt={pub.journal} size={50} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {pub.badge && (
                      <div className="pill">
                        {pub.badge}
                      </div>
                    )}
                    {pub.link && <ExternalLink size={16} color={THEME.gold} />}
                  </div>
                </div>
                
                <h3 style={{ fontFamily: THEME.fonts.heading, fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.3, color: THEME.textPrimary }}>{pub.title}</h3>
                <div style={{ color: THEME.goldLight, fontFamily: THEME.fonts.accent, marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>{pub.journal}</div>
                <div style={{ color: THEME.textSecondary, marginBottom: '2rem', fontSize: '0.9rem' }}>{pub.details} | Author: {pub.author}</div>
                
                <p style={{ color: THEME.textSecondary, marginBottom: '2rem', fontSize: '1.1rem' }}>{pub.summary}</p>
                
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {pub.tags.map(tag => (
                    <span 
                      key={tag} 
                      style={{ 
                        padding: '0.3rem 0.8rem', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        fontFamily: THEME.fonts.accent,
                        color: THEME.textSecondary
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* --- SECTION 6: AWARDS --- */}
      <section id="awards" style={{ padding: '10rem 10%' }}>
        <FadeIn>
          <SectionLabel text="RECOGNITION" />
          <h2 style={{ fontFamily: THEME.fonts.heading, fontSize: '3.5rem', marginBottom: '4rem' }}>Awards & Honors</h2>
          
          <div 
            className="award-card"
            style={{
              background: THEME.gold,
              padding: '4rem',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              color: '#0a0e1a'
            }}
          >
            <div className="award-icon" style={{ position: 'absolute', top: 0, right: 0, fontSize: '10rem', opacity: 0.1, transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}>🏆</div>
            
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '15px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)'
              }}>
                <OrgLogo src={LOGOS.pakistanGov} alt="Ministry of Planning" size={80} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: THEME.fonts.heading, fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>Shield of Recognition — STED 2025 Policy Dialogue</h3>
                <p style={{ fontWeight: 700, marginBottom: '1rem', opacity: 0.9 }}>Awarded by: Federal Minister Prof. Ahsan Iqbal</p>
                <div style={{ fontFamily: THEME.fonts.accent, marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', opacity: 0.7 }}>Ministry of Planning, Development & Special Initiatives</div>
                <p style={{ fontSize: '1.2rem', fontWeight: 500, lineHeight: 1.5 }}>Recognized as Focal Person from the Ministry of Planning for bridging academia, industry and government under the URAAN Pakistan sustainable development framework at the national STED 2025 Policy Dialogue.</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* --- SECTION 7: EDUCATION --- */}
      <section id="education" style={{ padding: '10rem 10%', background: THEME.bgSecondary }}>
        <FadeIn>
          <SectionLabel text="ACADEMIC BACKGROUND" />
          <div className="stat-row" style={{ display: 'flex', gap: '2rem' }}>
            {[
              {
                degree: "Master of Philosophy (MPhil)",
                special: "Government and Public Policy",
                school: "National Defence University, Islamabad",
                period: "2025 – 2026",
                thesis: "Citizen Trust and Adoption of Digital Public Services: The Role of Privacy Concerns in Lahore, Pakistan"
              },
              {
                degree: "Bachelor of Science (BS)",
                special: "Public Administration",
                school: "Quaid-i-Azam University, Islamabad",
                period: "2020 – 2024"
              }
            ].map((edu, idx) => (
              <div 
                key={idx} 
                className="card-hover glass"
                style={{
                  flex: 1,
                  padding: '3rem',
                  borderRadius: '8px',
                  borderTop: `4px solid ${THEME.gold}`,
                  transition: 'all 0.4s ease'
                }}
              >
                <div style={{ fontFamily: THEME.fonts.accent, color: THEME.gold, marginBottom: '1rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>{edu.period}</div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{edu.degree}</h3>
                <div style={{ fontSize: '1.2rem', color: THEME.textPrimary, marginBottom: '1.5rem' }}>{edu.special}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                  <OrgLogo 
                    src={edu.school.includes('National Defence') ? LOGOS.ndu : LOGOS.qau} 
                    alt={edu.school} 
                    size={40}
                  />
                  <p style={{ color: THEME.textSecondary, margin: 0 }}>{edu.school}</p>
                </div>
                {edu.thesis && (
                  <div style={{ borderTop: `1px solid ${THEME.border}`, paddingTop: '1.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: THEME.goldLight, textTransform: 'uppercase', fontFamily: THEME.fonts.accent }}>Thesis</span>
                    <p style={{ fontSize: '0.9rem', color: THEME.textSecondary, fontStyle: 'italic', marginTop: '0.5rem' }}>"{edu.thesis}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* --- SECTION 8: CERTIFICATIONS --- */}
      <section id="certifications" style={{ padding: '10rem 10%' }}>
        <FadeIn>
          <SectionLabel text="CONTINUOUS LEARNING" />
          <h2 style={{ fontFamily: THEME.fonts.heading, fontSize: '3.5rem', marginBottom: '4rem' }}>Certifications & Training</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {[
              { title: "Advanced Qualitative Methods in Conflict Studies", org: "NDU", icon: LOGOS.ndu, isLogo: true },
              { title: "GIS Applications Certification", org: "Ministry of Planning", icon: LOGOS.pakistanGov, isLogo: true },
              { title: "International Peace and Stability", org: "NUST", icon: LOGOS.nust, isLogo: true },
              { title: "Transparency, Accountability & Ethics in Public Institutions", org: "United Nations", icon: LOGOS.un, isLogo: true },
              { title: "Google Project Management Professional", org: "Google", icon: LOGOS.google, isLogo: true },
              { title: "Data Analytics and Visualization with Power BI", org: "LUMS", icon: LOGOS.lums, isLogo: true },
              { title: "Microsoft PL300 Power BI certification", org: "Microsoft", icon: LOGOS.microsoft, isLogo: true },
              { title: "Spatial Planning in Context of DRR", org: "SUPARCO", icon: LOGOS.suparco, isLogo: true }
            ].map((cert, idx) => (
              <div 
                key={idx} 
                className="card-hover glass"
                style={{
                  padding: '2rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  cursor: 'default'
                }}
              >
                {cert.isLogo && cert.icon ? (
                  <div className="icon-logo-container" style={{ width: '50px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                    <OrgLogo src={cert.icon} alt={cert.org} size={40} />
                  </div>
                ) : cert.icon && !cert.isLogo ? (
                  <div style={{ width: '50px', display: 'flex', justifyContent: 'center', flexShrink: 0, fontSize: '2rem' }}>
                    {cert.icon}
                  </div>
                ) : null}
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.3rem', fontSize: '0.95rem' }}>{cert.title}</div>
                  <div style={{ color: THEME.gold, fontSize: '0.8rem', fontFamily: THEME.fonts.accent, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cert.org}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* --- SECTION 9: SKILLS --- */}
      <section id="skills" style={{ padding: '10rem 10%', background: THEME.bgSecondary }}>
        <FadeIn>
          <SectionLabel text="WHAT I BRING" />
          <h2 style={{ fontFamily: THEME.fonts.heading, fontSize: '3.5rem', marginBottom: '4rem' }}>Skills & Competencies</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            {[
              { 
                title: "Policy & Governance", 
                skills: ["Public Administration", "Governance Reform", "Policy Analysis", "Civil Service Reform", "Stakeholder Engagement", "SMART Framework"] 
              },
              { 
                title: "Research & Publication", 
                skills: ["Academic Writing", "Qualitative Research", "HEC Publications", "Policy Drafting", "Literature Review"] 
              },
              { 
                title: "Digital & Technical", 
                skills: ["Microsoft Power BI", "Data Dashboard Development", "GIS Applications", "Microsoft Office", "Project Coordination", "Digital Monitoring Systems"] 
              },
              { 
                title: "Languages", 
                skills: ["English (Fluent)", "Urdu (Fluent)", "Punjabi (Fluent)", "German (Basic)"] 
              }
            ].map((group, idx) => (
              <div key={idx}>
                <h4 style={{ 
                  fontFamily: THEME.fonts.accent, 
                  color: THEME.gold, 
                  fontSize: '0.9rem', 
                  textTransform: 'uppercase', 
                  marginBottom: '2rem',
                  borderBottom: `1px solid ${THEME.gold}`,
                  paddingBottom: '0.5rem',
                  display: 'inline-block'
                }}>
                  {group.title}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                  {group.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="skill-pill"
                      style={{
                        padding: '0.5rem 1rem',
                        background: THEME.bg,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        color: THEME.textSecondary,
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = THEME.gold;
                        e.currentTarget.style.color = THEME.gold;
                        e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = THEME.border;
                        e.currentTarget.style.color = THEME.textSecondary;
                        e.currentTarget.style.background = THEME.bg;
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* --- SECTION 10: VOLUNTEERING --- */}
      <section id="volunteering" style={{ padding: '8rem 10%' }}>
        <FadeIn>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div 
              style={{
                background: THEME.card,
                padding: '3rem',
                borderRadius: '12px',
                border: `1px solid ${THEME.border}`,
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <OrgLogo src={LOGOS.youthParliament} alt="Youth Parliament Pakistan" size={80} />
              </div>
              <h3 style={{ fontSize: '1.8rem', color: THEME.gold, marginBottom: '0.5rem' }}>Youth Parliament Pakistan</h3>
              <div style={{ fontFamily: THEME.fonts.accent, color: THEME.textSecondary, marginBottom: '1.5rem' }}>Senior Vice President | Jul 2023 – Jun 2024</div>
              <p style={{ fontSize: '1.1rem', color: THEME.textSecondary }}>
                Participated in high-level parliamentary debates, policy formulation exercises, and national conventions. Championed democratic values and youth advocacy in national governance discussions.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* --- SECTION 11: CONTACT --- */}
      <section id="contact" style={{ padding: '10rem 10%', background: THEME.bgSecondary }}>
        <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <FadeIn>
              <SectionLabel text="LET'S CONNECT" />
              <h2 style={{ fontFamily: THEME.fonts.heading, fontSize: '3.5rem', marginBottom: '1rem' }}>Open to Opportunities</h2>
              <p style={{ color: THEME.textSecondary, fontSize: '1.2rem', marginBottom: '3rem' }}>
                Available for international fellowships, PhD programs, policy collaborations, and research partnerships.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>📧</span>
                  <a href="mailto:muhammadijazbutt999@gmail.com" style={{ color: THEME.textPrimary }}>muhammadijazbutt999@gmail.com</a>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>📍</span>
                  <span>Islamabad, Pakistan</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>📞</span>
                  <span>+92 311 0497285</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4rem' }}>
                <a 
                  href="https://www.linkedin.com/in/ijaz999?utm_source=share_via&utm_content=profile&utm_medium=member_ios" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    border: `1px solid ${THEME.border}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: THEME.gold,
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = THEME.gold; e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = THEME.border; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    border: `1px solid ${THEME.border}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: THEME.gold,
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = THEME.gold; e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = THEME.border; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Facebook size={24} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    border: `1px solid ${THEME.border}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: THEME.gold,
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = THEME.gold; e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = THEME.border; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Instagram size={24} />
                </a>
              </div>
            </FadeIn>
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <FadeIn delay={0.3}>
              <form 
                onSubmit={(e) => e.preventDefault()}
                style={{
                  background: THEME.card,
                  padding: '3rem',
                  borderRadius: '12px',
                  border: `1px solid ${THEME.border}`
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: THEME.fonts.accent, fontSize: '0.8rem', color: THEME.textSecondary }}>NAME</label>
                  <input type="text" style={{ width: '100%', padding: '1rem', background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: '4px', color: '#fff' }} placeholder="John Doe" />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: THEME.fonts.accent, fontSize: '0.8rem', color: THEME.textSecondary }}>EMAIL</label>
                  <input type="email" style={{ width: '100%', padding: '1rem', background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: '4px', color: '#fff' }} placeholder="john@example.com" />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: THEME.fonts.accent, fontSize: '0.8rem', color: THEME.textSecondary }}>MESSAGE</label>
                  <textarea rows={4} style={{ width: '100%', padding: '1rem', background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: '4px', color: '#fff' }} placeholder="How can I help you?" />
                </div>
                <button 
                  className="btn-gold"
                  type="submit" 
                  style={{ 
                    width: '100%', 
                    padding: '1.2rem', 
                    background: THEME.gold, 
                    border: 'none', 
                    borderRadius: '4px', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Send Message
                </button>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- SECTION 12: FOOTER --- */}
      <footer style={{ padding: '5rem 10%', textAlign: 'center', borderTop: `1px solid ${THEME.border}` }}>
        <div style={{
          fontFamily: THEME.fonts.heading,
          fontSize: '2rem',
          color: THEME.gold,
          marginBottom: '1rem'
        }}>
          Muhammad Ijaz
        </div>
        <p style={{ fontFamily: THEME.fonts.accent, color: THEME.textSecondary, marginBottom: '2rem' }}>Policy. Research. Impact.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
          {['About', 'Experience', 'Research', 'Skills', 'Contact'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} style={{ fontSize: '0.9rem', color: THEME.textSecondary }}>{link}</a>
          ))}
        </div>
        
        <div style={{ borderTop: `1px solid ${THEME.border}`, paddingTop: '2rem', fontSize: '0.8rem', color: THEME.textSecondary }}>
          © 2025 Muhammad Ijaz. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
