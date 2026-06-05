import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import hero from "@/assets/hero.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaarmukil — Wedding Photography in Kerala" },
      { name: "description", content: "Cinematic wedding photography & film across Kerala. Quiet light, loud love — stories made slowly." },
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
          <a href="#top" className="font-display tracking-[0.4em] text-xl md:text-2xl">KAARMUKIL</a>
          <a href="#booking" className="eyebrow !text-ivory hidden md:inline">Enquire ↗</a>
        </div>
      </header>

      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl flex flex-col"
        >
          <div className="px-6 md:px-10 h-20 flex items-center justify-between">
            <span className="eyebrow">Index</span>
            <button onClick={() => setOpen(false)} className="eyebrow">Close ✕</button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-6">
            {links.map((l, i) => (
              <motion.a
                key={l}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.6 }}
                href={`#${l.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="font-display text-6xl md:text-8xl hover:text-gold transition-colors italic"
              >
                {l}.
              </motion.a>
            ))}
          </nav>
          <div className="px-10 pb-8 flex justify-between text-xs eyebrow">
            <span>Fort Kochi · Kerala</span>
            <span>+91 98470 00000</span>
          </div>
        </motion.div>
      )}
    </>
  );
}

const columns = [
  { src: hero, eyebrow: "Archive your day with the best", title: "Pure Love.", sub: "Premium Kerala Wedding Photography" },
  { src: g2, eyebrow: "Enjoy the services of cinematic", title: "Authentic Stories.", sub: "Wedding Films in Kerala" },
  { src: g1, eyebrow: "Register for our creative", title: "Heartwarming.", sub: "Classic Wedding Photography" },
  { src: g4, eyebrow: "Reach out for the best", title: "True Love.", sub: "Engagement Photography" },
];

function ColumnHero() {
  const [active, setActive] = useState(0);
  return (
    <section id="top" className="relative h-screen min-h-[700px] w-full overflow-hidden bg-background">
      <div className="flex h-full w-full">
        {columns.map((c, i) => (
          <motion.div
            key={i}
            onMouseEnter={() => setActive(i)}
            animate={{ flex: active === i ? 3 : 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full overflow-hidden border-r border-ivory/10 last:border-r-0 cursor-pointer group"
          >
            <motion.img
              src={c.src}
              alt={c.title}
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
                <p className="serif-italic text-ivory/80 text-sm md:text-base leading-relaxed mb-6">
                  {c.eyebrow}
                </p>
                <h2 className="font-display text-ivory text-4xl md:text-6xl leading-[1] mb-3">
                  {c.title}
                </h2>
                <p className="eyebrow !text-ivory/70">{c.sub}</p>
              </motion.div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full border border-ivory/50 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="ml-1 border-l-[10px] border-l-ivory border-y-[6px] border-y-transparent" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Kerala", "·", "Backwaters", "·", "Temples", "·", "Beaches", "·", "Heirloom Films", "·", "Since 2014", "·"];
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

function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section id="about" ref={ref} className="relative py-32 md:py-44 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          className="md:col-span-5 md:sticky md:top-32"
        >
          <span className="eyebrow">Studio — 01</span>
          <div className="hairline mt-4 w-24" />
          <h2 className="mt-8 font-display text-5xl md:text-7xl leading-[0.95]">
            Quiet light,<br />
            <em className="serif-italic text-gold">loud</em> love.
          </h2>
          <motion.div style={{ y }} className="mt-12 aspect-[3/4] overflow-hidden hidden md:block">
            <img src={g3} alt="" className="h-full w-full object-cover" />
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
          className="md:col-span-7 space-y-10 md:pt-8"
        >
          <p className="text-xl md:text-2xl font-display italic text-ivory/90 leading-snug">
            Born in Fort Kochi, raised among monsoons and brass lamps. For a decade we've followed
            Kerala weddings — from the first turmeric paste to the last laugh at dawn.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
            We are a small studio. Two photographers, one filmmaker, and a colourist who still develops
            film by hand. We take on twelve weddings each season so every story gets the patience it deserves.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border">
            {[
              ["240+", "Weddings"],
              ["14", "Districts"],
              ["10 yrs", "Of practice"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-4xl md:text-5xl text-ivory">{n}</div>
                <div className="eyebrow mt-3">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const galleryItems = [
  { src: g1, type: "image", title: "The Garland", span: "md:col-span-5 md:row-span-2" },
  { src: g2, type: "image", title: "Backwaters", span: "md:col-span-7" },
  { src: g3, type: "image", title: "Jasmine", span: "md:col-span-4" },
  { src: g4, type: "image", title: "The Fire", span: "md:col-span-3" },
  { src: g5, type: "video", title: "Varkala — film", span: "md:col-span-7 md:row-span-2" },
  { src: g6, type: "image", title: "Reception", span: "md:col-span-5" },
];

function Gallery() {
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const items = galleryItems.filter((i) => filter === "all" || i.type === filter);

  return (
    <section id="gallery" className="py-32 md:py-44 border-t border-border">
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <span className="eyebrow">Archive — 02</span>
            <div className="hairline mt-4 w-24" />
            <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[1.02] text-balance max-w-2xl">
              Frames from <em className="serif-italic text-gold">recent</em> stories.
            </h2>
          </div>
          <div className="flex gap-2">
            {(["all", "image", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 border transition-colors ${
                  filter === f
                    ? "bg-ivory text-background border-ivory"
                    : "border-border hover:border-ivory"
                }`}
              >
                <span className="eyebrow" style={filter === f ? { color: "var(--color-background)" } : undefined}>
                  {f === "all" ? "All" : f === "image" ? "Photos" : "Films"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[220px] gap-3">
          {items.map((item, i) => (
            <motion.figure
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`relative overflow-hidden group ${item.span} h-[300px] md:h-auto bg-card`}
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="font-display italic text-ivory text-2xl">{item.title}</span>
                {item.type === "video" && (
                  <span className="eyebrow !text-ivory border border-ivory/60 px-2 py-1">Film</span>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const packages = [
  {
    name: "Half Day",
    price: "₹ 45,000",
    tag: "Intimate ceremonies",
    points: ["6 hours coverage", "One lead photographer", "150+ edited images", "Online gallery, 1 year"],
  },
  {
    name: "Full Wedding",
    price: "₹ 1,20,000",
    tag: "Most loved",
    featured: true,
    points: ["Two days, two photographers", "500+ edited images", "Cinematic 5-min film", "Heirloom photo book"],
  },
  {
    name: "The Heirloom",
    price: "₹ 2,40,000",
    tag: "Multi-day celebrations",
    points: ["Up to 4 days coverage", "Three artists, photo + film", "1000+ images, full film", "Engraved walnut album"],
  },
];

function Packages() {
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
            key={p.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`relative p-10 border flex flex-col group transition-colors ${
              p.featured
                ? "bg-ivory text-background border-ivory"
                : "bg-card border-border hover:border-gold"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-8 bg-gold text-background eyebrow px-3 py-1">Most loved</span>
            )}
            <span className={`eyebrow ${p.featured ? "!text-background/60" : ""}`}>{p.tag}</span>
            <h3 className="font-display text-4xl mt-5">{p.name}</h3>
            <div className="font-display text-5xl mt-6 mb-10">{p.price}</div>
            <ul className={`space-y-3 mb-10 text-sm ${p.featured ? "text-background/75" : "text-muted-foreground"}`}>
              {p.points.map((pt) => (
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
                  ? "border-background bg-background !text-ivory hover:bg-transparent"
                  : "border-ivory/30 hover:bg-ivory hover:!text-background"
              }`}
              style={p.featured ? { color: "var(--color-ivory)" } : undefined}
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
  const [sent, setSent] = useState(false);

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
            <p className="serif-italic text-lg text-ivory">hello@kaarmukil.studio</p>
            <p>+91 98470 00000</p>
            <p>Fort Kochi, Kerala 682001</p>
          </div>
        </motion.div>

        <motion.form
          initial={fadeUp.hidden} whileInView={fadeUp.show} viewport={{ once: true }}
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="space-y-5"
        >
          {[
            { name: "name", label: "Your name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "date", label: "Wedding date", type: "date" },
            { name: "venue", label: "Venue or town", type: "text" },
          ].map((f) => (
            <div key={f.name}>
              <label className="eyebrow">{f.label}</label>
              <input
                required type={f.type} name={f.name}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-ivory focus:border-gold outline-none transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="eyebrow">A few words</label>
            <textarea
              rows={3}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-ivory focus:border-gold outline-none transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full md:w-auto px-10 py-4 bg-gold text-background eyebrow hover:bg-ivory transition-colors"
          >
            {sent ? "Thank you — we'll be in touch" : "Send enquiry →"}
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
            <div className="font-display text-6xl md:text-8xl tracking-tight">Kaarmukil<span className="text-gold">.</span></div>
            <p className="mt-6 text-muted-foreground max-w-sm">
              Wedding photography & film, made slowly in Kerala.
            </p>
          </div>
          <div className="md:col-span-3 space-y-3">
            <div className="eyebrow mb-4">Studio</div>
            {["About", "Gallery", "Packages", "Journal"].map((l) => (
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
          <span>© 2026 Kaarmukil Studio · Kochi</span>
          <span>Made slowly, with film and patience</span>
        </div>
      </div>
    </footer>
  );
}
