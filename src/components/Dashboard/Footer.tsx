import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {

    const quickLinks = [
        { name: 'Home', href: '/' },
        { name: 'Rooms & Suites', href: '/rooms' },
        { name: 'About Us', href: '/about' },
    ];

    const supportLinks = [
        { name: 'FAQs', href: '/faqs' },
        { name: 'Terms & Conditions and Policy', href: '/terms' },
    ];

    const LinkItem: React.FC<{ name: string; href: string }> = ({ name, href }) => {
        if (name === 'Terms & Conditions and Policy') {
            return (
                <Link
                    to={href}
                    state={{ fromHome: true }} // Pass state to show Back button on the page
                    className="text-gray-300 hover:text-[var(--color-brand-gold)] transition-colors text-sm font-normal"
                >
                    {name}
                </Link>
            );
        }

        return (
            <a
                href={href}
                className="text-gray-300 hover:text-[var(--color-brand-gold)] transition-colors text-sm font-normal"
            >
                {name}
            </a>
        );
    };

    const ContactDetail: React.FC<{ icon: React.ReactNode, content: React.ReactNode, isAddress?: boolean }> = ({ icon, content, isAddress = false }) => (
        <div className={`flex items-start gap-2 ${isAddress ? 'pt-1' : ''}`}>
            {icon}
            <div className={`text-sm ${
                isAddress
                    ? `text-gray-400`
                    : `text-gray-300 hover:text-white transition-colors`
            }`}>
                {content}
            </div>
        </div>
    );

    return (
        <footer className={`bg-[var(--color-brand-navy)] text-white`}>
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="flex flex-col">
                        <div className={`text-xl font-medium text-[var(--color-brand-gold)] mb-4`}>
                            LuxeStay
                        </div>

                        <div className="space-y-2">
                            <ContactDetail
                                icon={<Phone className={`h-4 w-4 text-[var(--color-brand-gold)] flex-shrink-0 mt-0.5`} />}
                                content={<a href="tel:+18005550123" className='hover:text-white'>+1 (800) 555-0123</a>}
                            />

                            <ContactDetail
                                icon={<Mail className={`h-4 w-4 text-[var(--color-brand-gold)] flex-shrink-0 mt-0.5`} />}
                                content={<a href="mailto:contact@luxestay.com" className='hover:text-white'>contact@luxestay.com</a>}
                            />

                            <ContactDetail
                                isAddress
                                icon={<MapPin className={`h-4 w-4 text-[var(--color-brand-gold)] flex-shrink-0 mt-0.5`} />}
                                content={<p className="max-w-xs">123 Luxury Lane, Suite 400, New York, NY 10001</p>}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-white mb-3">Quick Links</h3>
                        <div className="flex flex-col space-y-2">
                            {quickLinks.map(link => <LinkItem key={link.name} {...link} />)}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-white mb-3">Policies & Support</h3>
                        <div className="flex flex-col space-y-2">
                            {supportLinks.map(link => <LinkItem key={link.name} {...link} />)}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`border-t border-white/10`}>
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
                    <div className="flex justify-center md:justify-center">
                        <p className={`text-sm font-normal text-gray-400`}>
                            &copy; {new Date().getFullYear()} LuxeStay, Inc. All rights reserved. Built with premium quality in mind.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
