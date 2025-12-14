const galleryImages = [
  { src: "https://picsum.photos/seed/1990s/800/1200", decade: "1990s Grunge" },
  { src: "https://picsum.photos/seed/1980s/800/1000", decade: "1980s Neon" },
  { src: "https://picsum.photos/seed/1950s/800/1100", decade: "1950s Americana" },
  { src: "https://picsum.photos/seed/memento/800/1200", decade: "Memento Noir" },
  { src: "https://picsum.photos/seed/1970s/800/1000", decade: "1970s Disco" },
  { src: "https://picsum.photos/seed/1960s/800/1100", decade: "1960s Mod" },
];

export function ShowcaseGallery() {
  return (
    <section id="gallery" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
          Every Version of <span className="text-secondary">You</span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-foreground/70 mb-16">
          Our AI doesn't just change your clothes. It captures the authentic aesthetic of each era, from film grain to color grading.
        </p>
        <div className="columns-2 md:columns-3 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="mb-4 break-inside-avoid relative group overflow-hidden rounded-2xl">
              <img
                src={image.src}
                alt={`Example of ${image.decade} generation`}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="font-heading text-lg font-bold text-white drop-shadow-md">{image.decade}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}