"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { NewsletterPopup } from "@/components/newsletter-popup"

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/come-funziona", label: "Come funziona" },
    { href: "/voli-economici", label: "Voli economici" },
    { href: "/blog", label: "Blog" },
    { href: "/premium", label: "Premium" },
    { href: "/elite", label: "Elite" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const handleNewsletterClick = () => {
    setShowNewsletterPopup(true)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b" style={{background:'#fcfaf3'}}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center" style={{marginLeft: '32px'}}>
              <Image
                src="/images/logo.png"
                alt="Punti Furbi Logo"
                width={120}
                height={48}
                priority
                quality={100}
                className="h-12 w-auto hover:opacity-80 transition-opacity"
                style={{color: 'transparent'}}
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary`}
                  style={{color:'#1a2e22'}}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Iscriviti Button */}
            <div className="hidden md:flex items-center" style={{marginRight: '32px'}}>
              <Button
                onClick={handleNewsletterClick}
                className="px-6 py-2 rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Iscriviti
              </Button>
            </div>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 px-2">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <nav className="flex flex-col space-y-4 mt-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-base font-medium transition-colors hover:text-primary truncate`}
                      style={{color:'#1a2e22'}}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button
                    onClick={() => {
                      setIsOpen(false)
                      handleNewsletterClick()
                    }}
                    className="px-6 py-2 rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg mt-4"
                  >
                    Iscriviti
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Newsletter Popup */}
      {showNewsletterPopup && (
        <NewsletterPopup
          isOpen={showNewsletterPopup}
          onClose={() => setShowNewsletterPopup(false)}
        />
      )}
    </>
  )
}
