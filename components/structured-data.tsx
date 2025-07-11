import Script from 'next/script'

interface OrganizationSchemaProps {
  name: string
  url: string
  logo?: string
  socialLinks?: string[]
}

export function OrganizationSchema({ name, url, logo, socialLinks }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: logo || `${url}/placeholder-logo.png`,
    sameAs: socialLinks || [],
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  name: string
  url: string
  description: string
}

export function WebsiteSchema({ name, url, description }: WebsiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/voli-economici/?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FlightOfferSchemaProps {
  offers: Array<{
    id: number
    origin: string
    destination: string
    price: number
    originalPrice: number
    airline: string
    dates: string
  }>
}

export function FlightOffersSchema({ offers }: FlightOfferSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: offers.map((offer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `Volo ${offer.origin} - ${offer.destination}`,
        description: `Volo economico da ${offer.origin} a ${offer.destination} con ${offer.airline}`,
        offers: {
          '@type': 'Offer',
          price: offer.price,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          validThrough: '2025-12-31',
        },
        brand: {
          '@type': 'Brand',
          name: offer.airline,
        },
      },
    })),
  }

  return (
    <Script
      id="flight-offers-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}