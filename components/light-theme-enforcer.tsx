'use client'

import { useEffect } from 'react'

export function LightThemeEnforcer() {
  useEffect(() => {
    // Funzione per rimuovere la classe dark
    const enforceLightTheme = () => {
      const html = document.documentElement
      const body = document.body
      
      // Rimuovi la classe dark se presente
      html.classList.remove('dark')
      body.classList.remove('dark')
      
      // Forza l'attributo data-theme a light
      html.setAttribute('data-theme', 'light')
      body.setAttribute('data-theme', 'light')
      
      // Assicurati che il color-scheme sia light
      html.style.colorScheme = 'light'
      body.style.colorScheme = 'light'
    }

    // Esegui immediatamente
    enforceLightTheme()

    // Osserva i cambiamenti alla classe dark
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement
          if (target.classList.contains('dark')) {
            target.classList.remove('dark')
            target.setAttribute('data-theme', 'light')
            target.style.colorScheme = 'light'
          }
        }
      })
    })

    // Osserva l'elemento html e body
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })

    // Controlla periodicamente (fallback)
    const interval = setInterval(enforceLightTheme, 1000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  return null
}