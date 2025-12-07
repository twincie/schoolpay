import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-slate-600">
            © 2025 SchoolPay. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;