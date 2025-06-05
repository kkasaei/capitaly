import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-sm transition-all duration-200">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <span className="font-bold text-xl text-gray-900">Hoook</span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">Features</Link>
          <Link href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">How it Works</Link>
          <Link href="#testimonials" className="text-sm font-semibold leading-6 text-gray-900">Testimonials</Link>
          <Link href="/blog" className="text-sm font-semibold leading-6 text-gray-900">Blog</Link>
          <Link href="#pricing" className="text-sm font-semibold leading-6 text-gray-900">Pricing</Link>
          <Link href="#about" className="text-sm font-semibold leading-6 text-gray-900">About</Link>
        </div>
        <div className="flex items-center gap-4 hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/auth/sign-in" className="text-sm font-semibold leading-6 text-gray-900 mr-4">
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
          <a href="https://form.typeform.com/to/awrhYESs" target="_blank" rel="noopener noreferrer" className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Schedule a Demo
          </a>
        </div>
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </nav>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 lg:hidden"
          style={{ zIndex: 999 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 right-0 h-full min-h-screen w-[80vw] max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 1000, backgroundColor: '#fff' }}
      >
        <div className="p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <Link href="#features" className="block py-2 text-base font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" className="block py-2 text-base font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>How it Works</Link>
            <Link href="#testimonials" className="block py-2 text-base font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</Link>
            <Link href="/blog" className="block py-2 text-base font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            <Link href="#pricing" className="block py-2 text-base font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            <Link href="#about" className="block py-2 text-base font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <div className="pt-4 border-t border-gray-200">
              <Link href="/auth/sign-in" className="block py-2 text-base font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                Log in
              </Link>
              <a href="https://form.typeform.com/to/awrhYESs" target="_blank" rel="noopener noreferrer" className="mt-4 block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Schedule a Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 