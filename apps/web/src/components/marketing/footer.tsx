import { SiLinkedin } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="https://www.linkedin.com/company/hoookio" className="text-gray-400 hover:text-gray-500">
            <SiLinkedin className="h-6 w-6" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
          {new Date().getFullYear()} &copy; Hoook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 