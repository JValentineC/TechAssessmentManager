import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} i.c.stars. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a
              href="https://www.icstars.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-icstars-gold transition-colors"
            >
              About i.c.stars
            </a>
            <a
              href="mailto:support@icstars.org"
              className="hover:text-icstars-gold transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
