import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Script from "next/script";

import { SITE } from "@/lib/site";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      durationMin: true,
      depositPence: true,
      basePricePence: true,
    },
  });

  return (
    <section className="page">
      <div className="page-body">
        <div className="page-grid items-start">
          {/* Left: text */}
          <div className="lg:self-center">
            <div className="eyebrow mb-2">Services</div>
            <h1 className="page-head">Luxury, but still you.</h1>
            <p className="lead mt-4">
              Select a service to book instantly. Deposits are taken securely
              and your slot is reserved.
            </p>
          </div>

          {/* Divider */}
          <div className="hidden lg:block page-rule min-h-[52vh]" aria-hidden />

          {/* Right: cards */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {services.map((s) => (
                <Link
                  key={s.id}
                  href={`/booking?service=${s.id}`}
                  className="group block border border-ink/10 hover:border-ink/30 rounded-[14px] p-4 sm:p-5 transition"
                >
                  <div className="kicker mb-1">{"Service"}</div>
                  <div className="font-medium text-lg">{s.name}</div>
                  <p className="subtle mt-1">Duration: {s.durationMin} min</p>
                  <p className="mt-2 text-sm">
                    <span className="text-ink/70">Price: </span>
                    <strong>£{(s.basePricePence / 100).toFixed(2)}</strong>
                    <span className="text-ink/50"> &nbsp;•&nbsp; Deposit </span>
                    <strong>£{(s.depositPence / 100).toFixed(2)}</strong>
                  </p>
                  <span className="subtle inline-block mt-3 underline group-hover:no-underline">
                    Book now
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="rule mt-10" />
      </div>

      {/* JSON-LD OfferCatalog */}
      <Script
        id="ld-offercatalog"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            name: 'Makeup Services',
            itemListElement: services.map((s) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: s.name },
              priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'GBP',
                // use full price if you store it, else fall back to deposit
                price: ((s.basePricePence ?? s.depositPence) || 0) / 100,
              },
              url: `${SITE}/booking?service=${s.id}`,
            })),
          }),
        }}
      />
      
    </section>
  );
}
