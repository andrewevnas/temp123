'use client'

import Image from 'next/image'

export default function AboutEditorial() {
  return (
    <section id="about" className="page scroll-mt-16">
      <div className="page-body">
        <div className="page-grid items-start lg:items-center">

          {/* Left: image panel */}
          <div className="w-full flex justify-center lg:self-center max-w-sm mx-auto">
            <div className="card overflow-hidden">
              <Image
                src="/images/about-portrait.jpg"
                alt="Emily working in studio"
                width={450}
                height={600}
                className="w-full h-auto object-cover"
                priority={false}
              />
            </div>
          </div>

          {/* Middle: vertical rule */}
          <div className="hidden lg:block page-rule min-h-[52vh]" aria-hidden />

          {/* Right: text block */}
          <div className="lg:self-center w-full flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="eyebrow mb-2">About</div>
            <h2 className="page-head">A calm, luxe experience.</h2>

            <p className="lead mt-4">
              Belfast-based makeup artist specialising in bridal, editorial and events.
              Charlotte Tilbury–trained, with a skin-first approach that enhances your
              natural features and lasts all day.
            </p>

            <ul className="mt-4 text-ink/80 space-y-2">
              <li>• Bridal, Editorial, TV & Film</li>
              <li>• Mobile and studio appointments</li>
              <li>• Lessons & masterclasses available</li>
            </ul>
          </div>
        </div>

        <div className="rule mt-10" />
      </div>
    </section>
  )
}
