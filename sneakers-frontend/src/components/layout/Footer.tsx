import { NavLink } from 'react-router-dom';
import { Zap, Github, Twitter, Instagram } from 'lucide-react';
import { AppContainer } from './AppContainer';

export const Footer = () => {
  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { label: 'All Sneakers', href: '/products' },
        { label: 'New Releases', href: '/new-releases' },
        { label: 'Sale', href: '/sale' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Shipping & Returns', href: '/shipping' },
        { label: 'Track Order', href: '/track-order' },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <AppContainer>
        <div className="py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <NavLink to="/" className="mb-4 flex items-center gap-2">
                <Zap className="h-6 w-6 text-slate-900" />
                <span className="text-lg font-bold tracking-tight">Sneakers</span>
              </NavLink>
              <p className="text-sm text-slate-600">The best place to find your sole mate.</p>
              <div className="mt-4 flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-slate-500 hover:text-slate-800"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <NavLink
                        to={link.href}
                        className="text-sm text-slate-600 hover:text-slate-900"
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} Sneakers, Inc. All rights reserved.</p>
        </div>
      </AppContainer>
    </footer>
  );
};