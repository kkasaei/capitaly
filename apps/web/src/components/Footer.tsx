import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Contact & Social */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6">
              <a
                href="mailto:hi@capitaly.com"
                className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors"
              >
                <span className="font-medium">hi@capitaly.com</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l10 10M7 17L17 7" />
                </svg>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <div className="space-y-3">
              <a href="/pricing" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="/features" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="/templates" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Enterprise
              </a>
              <a href="/blog" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Templates
              </a>
              <a href="/integrations" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Integrations
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <div className="space-y-3">
              <a href="/docs" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Docs
              </a>
              <Link href="/blog" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <a href="/forum" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Forum
              </a>
              <a href="/changelog" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Changelog
              </a>
              <Link href="/help" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Help Center
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <div className="space-y-3">
              <Link href="/about" className="block text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/careers" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Careers
              </Link>
              <Link href="/community" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Community
              </Link>
              <Link href="/customers" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Customers
              </Link>
              <Link href="/contact" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <div className="space-y-3">
              <Link href="/terms" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Terms
              </Link>
              <Link href="/security" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Security
              </Link>
              <Link href="/privacy" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Privacy
              </Link>
              <Link href="/compliance" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Compliance
              </Link>
            </div>
          </div>

          {/* Language & Theme */}
          <div className="col-span-2 md:col-span-1">
            <div className="space-y-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                  />
                </svg>
                <span className="text-sm text-gray-600">English</span>
              </div>

              {/* Theme Switch */}
              <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <button className="flex items-center space-x-1">
                  <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                    <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transition-transform"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} Made by Capitaly</div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4 md:mt-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>SOC 2 Certified</span>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="text-xs text-gray-400 leading-relaxed">
            Capitaly is not a registered broker-dealer and does not offer investment advice or advise on the raising
            of capital through securities offerings. Capitaly does not recommend or otherwise suggest that any
            investor make an investment in a particular company, or that any company offer securities to a particular
            investor. Capitaly takes no part in the negotiation or execution of transactions for the purchase or sale
            of securities, and at no time has possession of funds or securities. No securities transactions are
            executed or negotiated on or through the Capitaly platform. Capitaly receives no compensation in
            connection with the purchase or sale of securities and provides the service as retainer consulting &
            Strategic service to the founder(s) to help increase the volume of outreach to the investors.
          </div>
        </div>
      </div>
    </footer>
  );
} 