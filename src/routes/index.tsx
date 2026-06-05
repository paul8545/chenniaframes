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
      { name: "description", content: "Editorial wedding photography across Kerala — backwaters, temples, beaches. Stories told with light and patience." },
    ],
  }),
  component: Index,
});

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
};

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <About />
      <Gallery />
      <Packages />
      <Booking />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight">Kaarmukil</span>
          <span className="eyebrow hidden sm:inline">Kerala</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-sm">
          {["About", "Gallery", "Packages", "Booking"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="relative hover:text-primary transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full">
              {l}
            </a>
          ))}
        </nav>
        <a href="#booking" className="eyebrow border border-foreground/30 px-4 py-2 hover:bg-foreground hover:text-background transition-colors">Enquire</a>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-screen min-h-[720px] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={hero} alt="Kerala wedding couple under a temple arch at golden hour" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }} className="eyebrow text-ivory/80">
          Est. 2014 — Kochi, Kerala
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-[14vw] md:text-[8vw] leading-[0.95] text-ivory text-balance max-w-5xl"
        >
          Quiet light,<br />
          <em className="italic font-light">loud</em> love.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-8 max-w-md text-ivory/85 text-base md:text-lg leading-relaxed">
          A small studio photographing weddings across Kerala — backwaters, temple courtyards, ancestral homes.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-ivory/70"
      >
        <span className="eyebrow text-ivory/60">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="h-10 w-px bg-ivory/60" />
      </motion.div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-32 md:py-44 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          className="md:col-span-4"
        >
          <span className="eyebrow">About — 01</span>
          <div className="hairline mt-4 w-24" />
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
          className="md:col-span-8 space-y-8"
        >
          <h2 className="font-display text-5xl md:text-7xl leading-[1.02] text-balance">
            We are storytellers <em className="italic text-clay">first</em>,<br />
            photographers second.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Born in Fort Kochi, raised among monsoons and brass lamps. For a decade we've followed
            Kerala weddings from the first turmeric paste to the last laugh at dawn —
            making images that feel like memory, not performance.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border max-w-xl">
            {[
              ["240+", "Weddings"],
              ["14", "Districts"],
              ["10 yrs", "Of practice"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl md:text-4xl text-primary">{n}</div>
                <div className="eyebrow mt-2">{l}</div>
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
    <section id="gallery" className="py-32 md:py-44 bg-secondary/40">
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <span className="eyebrow">Gallery — 02</span>
            <div className="hairline mt-4 w-24" />
            <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[1.02] text-balance max-w-2xl">
              Frames from <em className="italic text-clay">recent</em> stories.
            </h2>
          </div>
          <div className="flex gap-2">
            {(["all", "image", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 border transition-colors ${
                  filter === f
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground"
                }`}
              >
                <span className="eyebrow">{f === "all" ? "All" : f === "image" ? "Photos" : "Films"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[220px] gap-4">
          {items.map((item, i) => (
            <motion.figure
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`relative overflow-hidden group ${item.span} h-[300px] md:h-auto`}
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="font-display italic text-ivory text-xl">{item.title}</span>
                {item.type === "video" && (
                  <span className="eyebrow text-ivory/80 border border-ivory/60 px-2 py-1">Film</span>
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
    <section id="packages" className="py-32 md:py-44 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="eyebrow">Packages — 03</span>
        <div className="hairline mt-4 w-24 mx-auto" />
        <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[1.02] text-balance">
          Three ways to <em className="italic text-clay">begin</em>.
        </h2>
        <p className="mt-6 text-muted-foreground text-lg">
          Every collection is tailored after a conversation. These are starting points.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`relative p-8 md:p-10 border ${
              p.featured
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border"
            } flex flex-col`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-8 bg-gold text-foreground eyebrow px-3 py-1">Most loved</span>
            )}
            <span className={`eyebrow ${p.featured ? "text-ivory/70" : ""}`}>{p.tag}</span>
            <h3 className="font-display text-4xl mt-4">{p.name}</h3>
            <div className="font-display text-5xl mt-6 mb-8">{p.price}</div>
            <ul className={`space-y-3 mb-10 text-sm ${p.featured ? "text-ivory/85" : "text-muted-foreground"}`}>
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-3">
                  <span className={`mt-2 h-px w-4 shrink-0 ${p.featured ? "bg-gold" : "bg-foreground/40"}`} />
                  {pt}
                </li>
              ))}
            </ul>
            <a
              href="#booking"
              className={`mt-auto text-center eyebrow py-3 border transition-colors ${
                p.featured
                  ? "border-gold bg-gold text-foreground hover:bg-transparent hover:text-ivory"
                  : "border-foreground/40 hover:bg-foreground hover:text-background"
              }`}
            >
              Enquire
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
    <section id="booking" className="relative py-32 md:py-44 bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={g3} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="relative px-6 md:px-12 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <motion.div initial={fadeUp.hidden} whileInView={fadeUp.show} viewport={{ once: true }}>
          <span className="eyebrow text-ivory/70">Book — 04</span>
          <div className="hairline mt-4 w-24" />
          <h2 className="mt-6 font-display text-5xl md:text-6xl leading-[1.02]">
            Tell us about<br /><em className="italic text-gold">your day</em>.
          </h2>
          <p className="mt-6 text-ivory/80 leading-relaxed">
            We take on a small number of weddings each season so every story
            gets the attention it deserves. Share a few details — we usually reply within two days.
          </p>
          <div className="mt-10 space-y-2 text-sm text-ivory/70">
            <p>hello@kaarmukil.studio</p>
            <p>+91 98470 00000 · Fort Kochi, Kerala</p>
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
              <label className="eyebrow text-ivory/60">{f.label}</label>
              <input
                required type={f.type} name={f.name}
                className="mt-2 w-full bg-transparent border-b border-ivory/30 py-3 text-ivory focus:border-gold outline-none transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="eyebrow text-ivory/60">A few words</label>
            <textarea
              rows={3}
              className="mt-2 w-full bg-transparent border-b border-ivory/30 py-3 text-ivory focus:border-gold outline-none transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full md:w-auto px-10 py-4 bg-gold text-foreground eyebrow hover:bg-ivory transition-colors"
          >
            {sent ? "Thank you — we'll be in touch" : "Send enquiry"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-8 items-start md:items-end">
        <div>
          <div className="font-display text-3xl">Kaarmukil</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Wedding photography & film, made slowly in Kerala.
          </p>
        </div>
        <div className="flex gap-8 text-sm">
          <a href="#" className="hover:text-primary">Instagram</a>
          <a href="#" className="hover:text-primary">Vimeo</a>
          <a href="mailto:hello@kaarmukil.studio" className="hover:text-primary">Email</a>
        </div>
      </div>
      <div className="hairline mt-12" />
      <p className="mt-6 text-xs text-muted-foreground eyebrow">© 2026 Kaarmukil Studio · Kochi</p>
    </footer>
  );
}
