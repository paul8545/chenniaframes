import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import hero from "@/assets/hero.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChennaiFrames — Wedding Photography" },
      { name: "description", content: "Cinematic wedding photography & film across South India. Quiet light, loud love — stories made slowly." },
    ],
  }),
  component: Index,
});

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } },
};

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <ColumnHero />
      <Marquee />
      <About />
      <Gallery />
      <Packages />
      <Booking />
      <Footer />
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = ["About", "Gallery", "Packages", "Booking"];
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="px-6 md:px-10 h-20 flex items-center justify-between text-ivory">
          <button onClick={() => setOpen(true)} className="flex items-center gap-3 group">
            <span className="grid grid-cols-3 gap-[3px]">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="h-[3px] w-[3px] bg-ivory rounded-full" />
              ))}
            </span>
            <span className="eyebrow !text-ivory">Menu</span>
          </button>
          <a href="#top" className="font-display tracking-[0.4em] text-xl md:text-2xl">CHENNAIFRAMES</a>
          <a href="#booking" className="eyebrow !text-ivory hidden md:inline">Enquire ↗</a>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl flex flex-col"
          >
            <div className="px-6 md:px-10 h-20 flex items-center justify-between">
              <span className="eyebrow">Index</span>
              <button onClick={() => setOpen(false)} className="eyebrow">Close ✕</button>
            </div>
            <nav className="flex-1 flex flex-col items-center justify-center gap-4 md:gap-6 px-6">
              {links.map((l, i) => (
                <motion.a
                  key={l}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.6 }}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="font-display text-5xl sm:text-6xl md:text-8xl hover:text-gold transition-colors italic"
                >
                  {l}.
                </motion.a>
              ))}
            </nav>
            <div className="px-6 md:px-10 pb-8 flex justify-between text-xs eyebrow">
              <span>Chennai · Tamil Nadu</span>
              <span>+91 98470 00000</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const fallbackHero = [
  { url: hero, eyebrow: "Archive your day with the best", title: "Pure Love.", subtitle: "Premium South Indian Wedding Photography" },
  { url: g2, eyebrow: "Enjoy the services of cinematic", title: "Authentic Stories.", subtitle: "Wedding Films" },
  { url: g1, eyebrow: "Register for our creative", title: "Heartwarming.", subtitle: "Classic Wedding Photography" },
  { url: g4, eyebrow: "Reach out for the best", title: "True Love.", subtitle: "Engagement Photography" },
];

function ColumnHero() {
  const { data: db } = useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const { data } = await supabase.from("hero_images").select("*").order("sort_order");
      return data ?? [];
    },
  });
  const columns = db && db.length > 0 ? db : fallbackHero;
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (columns.length < 2 || isHovered) return;
    const interval = setInterval(() => setActive((prev) => (prev + 1) % columns.length), 5000);
    return () => clearInterval(interval);
  }, [columns.length, isHovered]);

  return (
    <section id="top" className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden bg-background">
      <div className="md:hidden relative h-full w-full">
        {columns.map((c, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 ${active === i ? "z-10" : "z-0"}`}
            initial={false}
            animate={{ opacity: active === i ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={c.url} alt={c.title ?? ""} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
            <div className="relative h-full flex flex-col justify-end p-6 pb-20">
              <div className="max-w-sm">
                <p className="serif-italic text-ivory/80 text-sm leading-relaxed mb-4">{c.eyebrow}</p>
                <h2 className="font-display text-ivory text-4xl leading-[1] mb-2">{c.title}</h2>
                <p className="eyebrow !text-ivory/70">{c.subtitle}</p>
              </div>
            </div>
          </motion.div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {columns.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${active === i ? "w-8 bg-ivory" : "w-2 bg-ivory/40"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div 
        className="hidden md:flex h-full w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {columns.map((c, i) => (
          <motion.div
            key={i}
            onMouseEnter={() => setActive(i)}
            animate={{ flex: active === i ? 3 : 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full overflow-hidden border-r border-ivory/10 last:border-r-0 cursor-pointer group"
          >
            <motion.img
              src={c.url}
              alt={c.title ?? ""}
              className="absolute inset-0 h-full w-full object-cover"
              animate={{ scale: active === i ? 1.05 : 1, opacity: active === i ? 1 : 0.55 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
            <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
              <motion.div
                animate={{ opacity: active === i ? 1 : 0.7, y: active === i ? 0 : 10 }}
                transition={{ duration: 0.6 }}
                className="max-w-sm"
              >
                <p className="serif-italic text-ivory/80 text-sm md:text-base leading-relaxed mb-6">{c.eyebrow}</p>
                <h2 className="font-display text-ivory text-4xl md:text-6xl leading-[1] mb-3">{c.title}</h2>
                <p className="eyebrow !text-ivory/70">{c.subtitle}</p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Chennai", "·", "Temples", "·", "Beaches", "·", "Backwaters", "·", "Heirloom Films", "·", "Since 2014", "·"];
  return (
    <div className="relative overflow-hidden border-y border-border py-8 bg-background">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className={`font-display text-4xl md:text-6xl ${w === "·" ? "text-gold" : "italic text-ivory/70"}`}>
            {w}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function useContent() {
  const { data } = useQuery({
    queryKey: ["content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      const map = new Map<string, string>();
      (data ?? []).forEach((r) => {
        const text = (r.value as { text?: string })?.text;
        if (text) map.set(r.key, text);
      });
      return map;
    },
  });
  return data ?? new Map<string, string>();
}

function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const content = useContent();

  const heading = content.get("about_heading") ?? "Quiet light, loud love.";
  const body1 = content.get("about_body_1") ?? "Born in Chennai, shaped by temple mornings and coastal light. For a decade we've followed South Indian weddings — from the first turmeric paste to the last laugh at dawn.";
  const body2 = content.get("about_body_2") ?? "We are a small studio. Two photographers, one filmmaker, and a colourist who still develops film by hand. We take on twelve weddings each season so every story gets the patience it deserves.";

  return (
    <section id="about" ref={ref} className="relative py-20 md:py-44 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          className="md:col-span-5 md:sticky md:top-32"
        >
          <span className="eyebrow">Studio — 01</span>
          <div className="hairline mt-4 w-24" />
          <h2 className="mt-8 font-display text-4xl md:text-7xl leading-[0.95]">
            {heading.split(",").map((part, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? <em className="serif-italic text-gold">{part}</em> : part}
                {i < arr.length - 1 && <>,<br /></>}
              </span>
            ))}
          </h2>
          <motion.div style={{ y }} className="mt-8 md:mt-12 aspect-[3/4] overflow-hidden">
            <img src={g3} alt="" className="h-full w-full object-cover" />
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
          className="md:col-span-7 space-y-10 md:pt-8"
        >
          <p className="text-lg md:text-2xl font-display italic text-ivory/90 leading-snug">{body1}</p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">{body2}</p>
          <div className="grid grid-cols-3 gap-4 md:gap-6 pt-10 border-t border-border">
            {[
              ["240+", "Weddings"],
              ["14", "Districts"],
              ["10 yrs", "Of practice"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl md:text-5xl text-ivory">{n}</div>
                <div className="eyebrow mt-3">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type CoupleWithImages = {
  id: string;
  names: string;
  venue: string | null;
  event_date: string | null;
  cover_url: string | null;
  images: { id: string; url: string; caption: string | null }[];
};

function Gallery() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { data: couples = [] } = useQuery<CoupleWithImages[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data } = await supabase
        .from("couples")
        .select("id, names, venue, event_date, cover_url, gallery_images(id, url, caption, sort_order)")
        .order("sort_order");
      return (data ?? []).map((c) => ({
        id: c.id,
        names: c.names,
        venue: c.venue,
        event_date: c.event_date,
        cover_url: c.cover_url,
        images: (c.gallery_images ?? [])
          .slice()
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((img) => ({ id: img.id, url: img.url, caption: img.caption })),
      }));
    },
  });

  const active = couples.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    setLightboxIndex(null);
  }, [activeId]);

  useEffect(() => {
    if (lightboxIndex === null || !active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < active.images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : active.images.length - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, active]);

  return (
    <section id="gallery" className="py-32 md:py-44 border-t border-border">
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <span className="eyebrow">Archive — 02</span>
            <div className="hairline mt-4 w-24" />
            <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[1.02] text-balance max-w-2xl">
              {active ? (
                <>Inside <em className="serif-italic text-gold">{active.names}</em>.</>
              ) : (
                <>Stories from <em className="serif-italic text-gold">our</em> couples.</>
              )}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg">
              {active
                ? `${active.venue ?? ""}${active.venue && active.event_date ? " · " : ""}${active.event_date ?? ""}`
                : "Each folder is a wedding. Open one to step inside the day."}
            </p>
          </div>
          {active && (
            <button
              onClick={() => setActiveId(null)}
              className="px-5 py-2.5 border border-border hover:border-ivory transition-colors self-start"
            >
              <span className="eyebrow">← All couples</span>
            </button>
          )}
        </div>

        {!active && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {couples.map((c, i) => (
              <motion.button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[3/4] overflow-hidden bg-card text-left"
              >
                {c.cover_url && (
                  <img
                    src={c.cover_url}
                    alt={c.names}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="eyebrow !text-ivory/80 backdrop-blur-sm bg-background/30 px-2 py-1">
                    Folder · {c.images.length}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="font-display italic text-ivory text-2xl md:text-3xl leading-tight">{c.names}</div>
                  {c.venue && <div className="mt-2 eyebrow !text-ivory/70">{c.venue}</div>}
                  <div className="mt-4 flex items-center gap-2 text-ivory translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100 transition-all duration-500">
                    <span className="eyebrow !text-gold">Open folder</span>
                    <span className="text-gold">→</span>
                  </div>
                </div>
              </motion.button>
            ))}
            {couples.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                The gallery is being curated. Check back soon.
              </div>
            )}
          </div>
        )}

        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[220px] gap-3"
          >
            {active.images.map((img, i) => {
              const spans = [
                "md:col-span-7 md:row-span-2",
                "md:col-span-5",
                "md:col-span-5",
                "md:col-span-7 md:row-span-2",
                "md:col-span-12",
              ];
              return (
                <motion.figure
                  key={img.id}
                  onClick={() => setLightboxIndex(i)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative overflow-hidden group ${spans[i % spans.length]} h-[300px] md:h-auto bg-card cursor-zoom-in`}
                >
                  <img
                    src={img.url}
                    alt={img.caption ?? ""}
                    loading="lazy"
                    className="h-full w-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  {img.caption && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <figcaption className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="font-display italic text-ivory text-xl">{img.caption}</span>
                      </figcaption>
                    </>
                  )}
                </motion.figure>
              );
            })}
          </motion.div>
        )}

        <AnimatePresence>
          {lightboxIndex !== null && active && active.images[lightboxIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-md flex flex-col justify-between p-6"
            >
              <div className="flex justify-between items-center text-ivory z-10">
                <span className="eyebrow">
                  {active.names} · {lightboxIndex + 1} / {active.images.length}
                </span>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="eyebrow p-2 hover:text-gold transition-colors"
                >
                  Close ✕
                </button>
              </div>

              <div className="relative flex-1 flex items-center justify-center min-h-0">
                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null && prev > 0 ? prev - 1 : active.images.length - 1
                    )
                  }
                  className="absolute left-4 md:left-8 text-ivory/60 hover:text-gold text-3xl font-light p-4 z-10 transition-colors"
                  aria-label="Previous image"
                >
                  &larr;
                </button>

                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  src={active.images[lightboxIndex].url}
                  alt={active.images[lightboxIndex].caption ?? ""}
                  className="max-h-[80vh] max-w-[85vw] object-contain select-none shadow-2xl"
                />

                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null && prev < active.images.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="absolute right-4 md:right-8 text-ivory/60 hover:text-gold text-3xl font-light p-4 z-10 transition-colors"
                  aria-label="Next image"
                >
                  &rarr;
                </button>
              </div>

              {active.images[lightboxIndex].caption && (
                <div className="text-center pb-4 text-ivory/90 z-10 font-display italic text-lg md:text-xl">
                  {active.images[lightboxIndex].caption}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const fallbackPackages = [
  { id: "1", name: "Half Day", price: "₹ 45,000", tag: "Intimate ceremonies", featured: false,
    points: ["6 hours coverage", "One lead photographer", "150+ edited images", "Online gallery, 1 year"] },
  { id: "2", name: "Full Wedding", price: "₹ 1,20,000", tag: "Most loved", featured: true,
    points: ["Two days, two photographers", "500+ edited images", "Cinematic 5-min film", "Heirloom photo book"] },
  { id: "3", name: "The Heirloom", price: "₹ 2,40,000", tag: "Multi-day celebrations", featured: false,
    points: ["Up to 4 days coverage", "Three artists, photo + film", "1000+ images, full film", "Engraved walnut album"] },
];

function Packages() {
  const { data: db } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data } = await supabase.from("packages").select("*").order("sort_order");
      return data ?? [];
    },
  });
  const packages = db && db.length > 0 ? db : fallbackPackages;

  return (
    <section id="packages" className="py-32 md:py-44 px-6 md:px-12 max-w-7xl mx-auto border-t border-border">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="eyebrow">Collections — 03</span>
        <div className="hairline mt-4 w-24 mx-auto" />
        <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[1.02] text-balance">
          Three ways to <em className="serif-italic text-gold">begin</em>.
        </h2>
        <p className="mt-6 text-muted-foreground text-lg">
          Every collection is tailored after a conversation. These are starting points.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {packages.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`relative p-6 md:p-10 border flex flex-col group transition-colors ${
              p.featured ? "bg-ivory text-background border-ivory" : "bg-card border-border hover:border-gold"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-8 bg-gold text-background eyebrow px-3 py-1">Most loved</span>
            )}
            <span className={`eyebrow ${p.featured ? "!text-background/60" : ""}`}>{p.tag}</span>
            <h3 className="font-display text-4xl mt-5">{p.name}</h3>
            <div className="font-display text-5xl mt-6 mb-10">{p.price}</div>
            <ul className={`space-y-3 mb-10 text-sm ${p.featured ? "text-background/75" : "text-muted-foreground"}`}>
              {(p.points ?? []).map((pt) => (
                <li key={pt} className="flex gap-3">
                  <span className={`mt-2 h-px w-4 shrink-0 ${p.featured ? "bg-background/50" : "bg-gold"}`} />
                  {pt}
                </li>
              ))}
            </ul>
            <a
              href="#booking"
              className={`mt-auto text-center eyebrow py-3.5 border transition-colors ${
                p.featured
                  ? "border-background bg-background text-ivory hover:bg-transparent hover:text-background"
                  : "border-ivory/30 text-ivory hover:bg-ivory hover:text-background"
              }`}
            >
              Enquire →
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Booking() {
  const content = useContent();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", event_date: "", venue: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        name: form.name.trim().slice(0, 100),
        email: form.email.trim().slice(0, 255),
        event_date: form.event_date || null,
        venue: form.venue.trim().slice(0, 200) || null,
        message: form.message.trim().slice(0, 2000) || null,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Enquiry sent — we'll be in touch soon");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not send. Try again?");
    } finally { setSubmitting(false); }
  }

  return (
    <section id="booking" className="relative py-32 md:py-44 overflow-hidden border-t border-border">
      <div className="absolute inset-0 opacity-20">
        <img src={g3} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      <div className="relative px-6 md:px-12 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <motion.div initial={fadeUp.hidden} whileInView={fadeUp.show} viewport={{ once: true }}>
          <span className="eyebrow">Begin — 04</span>
          <div className="hairline mt-4 w-24" />
          <h2 className="mt-6 font-display text-5xl md:text-6xl leading-[1.02]">
            Tell us about<br /><em className="serif-italic text-gold">your day</em>.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
            We take on a small number of weddings each season so every story
            gets the attention it deserves. Share a few details — we usually reply within two days.
          </p>
          <div className="mt-12 space-y-3 text-sm text-muted-foreground">
            <p className="serif-italic text-lg text-ivory">{content.get("contact_email") ?? "hello@chennaiframes.com"}</p>
            <p>{content.get("contact_phone") ?? "+91 98470 00000"}</p>
            <p>{content.get("contact_address") ?? "Chennai, Tamil Nadu 600001"}</p>
          </div>
        </motion.div>

        <motion.form
          initial={fadeUp.hidden} whileInView={fadeUp.show} viewport={{ once: true }}
          onSubmit={onSubmit}
          className="space-y-5"
        >
          {([
            { name: "name", label: "Your name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "event_date", label: "Wedding date", type: "date" },
            { name: "venue", label: "Venue or town", type: "text" },
          ] as const).map((f) => (
            <div key={f.name}>
              <label className="eyebrow">{f.label}</label>
              <input
                required={f.name === "name" || f.name === "email"}
                type={f.type} name={f.name}
                value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-ivory focus:border-gold outline-none transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="eyebrow">A few words</label>
            <textarea
              rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-ivory focus:border-gold outline-none transition-colors resize-none"
            />
          </div>
          <button
            type="submit" disabled={submitting || sent}
            className="mt-6 w-full md:w-auto px-10 py-4 bg-gold text-background eyebrow hover:bg-ivory transition-colors disabled:opacity-60"
          >
            {sent ? "Thank you — we'll be in touch" : submitting ? "Sending…" : "Send enquiry →"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-6">
            <div className="font-display text-6xl md:text-8xl tracking-tight">ChennaiFrames<span className="text-gold">.</span></div>
            <p className="mt-6 text-muted-foreground max-w-sm">
              Wedding photography & film, made slowly in Chennai.
            </p>
          </div>
          <div className="md:col-span-3 space-y-3">
            <div className="eyebrow mb-4">Studio</div>
            {["About", "Gallery", "Packages", "Booking"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="block text-ivory/80 hover:text-gold transition-colors">{l}</a>
            ))}
          </div>
          <div className="md:col-span-3 space-y-3">
            <div className="eyebrow mb-4">Elsewhere</div>
            {["Instagram", "Vimeo", "Pinterest", "Email"].map((l) => (
              <a key={l} href="#" className="block text-ivory/80 hover:text-gold transition-colors">{l}</a>
            ))}
          </div>
        </div>
        <div className="hairline mt-16" />
        <div className="mt-6 flex flex-col md:flex-row justify-between gap-4 text-xs eyebrow">
          <span>© 2026 ChennaiFrames Studio · Chennai</span>
          <span>Made slowly, with film and patience</span>
        </div>
      </div>
    </footer>
  );
}
