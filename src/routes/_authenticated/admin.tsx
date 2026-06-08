import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { uploadGalleryFile, slugify } from "@/lib/admin-helpers";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · ChennaiFrames" }] }),
  component: AdminPage,
});

type Tab = "hero" | "couples" | "packages" | "bookings" | "content";

function AdminPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("hero");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/auth" });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "hero", label: "Hero" },
    { id: "couples", label: "Gallery" },
    { id: "packages", label: "Packages" },
    { id: "bookings", label: "Bookings" },
    { id: "content", label: "Site content" },
  ];

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="font-display text-4xl">Not an admin</h1>
          <p className="mt-3 text-muted-foreground">This account doesn't have admin access.</p>
          <button onClick={signOut} className="mt-6 eyebrow underline">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display tracking-[0.3em] text-sm">CHENNAIFRAMES</Link>
            <span className="eyebrow text-muted-foreground">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="eyebrow hover:text-gold">View site ↗</Link>
            <button onClick={signOut} className="eyebrow hover:text-gold">Sign out</button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-6 md:px-10 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-4 px-4 eyebrow border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-ivory"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {tab === "hero" && <HeroAdmin />}
        {tab === "couples" && <CouplesAdmin />}
        {tab === "packages" && <PackagesAdmin />}
        {tab === "bookings" && <BookingsAdmin />}
        {tab === "content" && <ContentAdmin />}
      </main>
    </div>
  );
}

/* ============================== HERO ============================== */

function HeroAdmin() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-hero"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_images").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });
  const [uploading, setUploading] = useState(false);

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadGalleryFile(file, "hero");
      const { error } = await supabase.from("hero_images").insert({
        url, title: "New slide", subtitle: "", eyebrow: "", sort_order: rows.length,
      });
      if (error) throw error;
      toast.success("Hero image added");
      qc.invalidateQueries({ queryKey: ["admin-hero"] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally { setUploading(false); }
  }

  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("hero_images").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-hero"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this hero slide?")) return;
    const { error } = await supabase.from("hero_images").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-hero"] }); }
  }

  return (
    <section>
      <SectionHeader title="Hero carousel" subtitle="Slides shown at the top of the homepage." />
      <UploadButton label={uploading ? "Uploading…" : "+ Add hero image"} disabled={uploading} onFile={onUpload} />
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((r) => (
          <div key={r.id} className="border border-border p-4 space-y-3">
            <img src={r.url} alt="" className="aspect-[3/4] w-full object-cover" />
            <Field label="Eyebrow" value={r.eyebrow ?? ""} onBlur={(v) => update(r.id, { eyebrow: v })} />
            <Field label="Title" value={r.title ?? ""} onBlur={(v) => update(r.id, { title: v })} />
            <Field label="Subtitle" value={r.subtitle ?? ""} onBlur={(v) => update(r.id, { subtitle: v })} />
            <Field label="Order" type="number" value={String(r.sort_order)} onBlur={(v) => update(r.id, { sort_order: Number(v) || 0 })} />
            <button onClick={() => remove(r.id)} className="eyebrow text-destructive hover:underline">Delete</button>
          </div>
        ))}
        {rows.length === 0 && <Empty msg="No hero images yet." />}
      </div>
    </section>
  );
}

/* ============================== COUPLES + IMAGES ============================== */

function CouplesAdmin() {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const { data: couples = [] } = useQuery({
    queryKey: ["admin-couples"],
    queryFn: async () => {
      const { data, error } = await supabase.from("couples").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });

  async function addCouple() {
    if (!newName.trim()) return;
    const slug = `${slugify(newName)}-${Date.now().toString(36).slice(-4)}`;
    const { error } = await supabase.from("couples").insert({ names: newName, slug, sort_order: couples.length });
    if (error) toast.error(error.message);
    else { setNewName(""); toast.success("Couple added"); qc.invalidateQueries({ queryKey: ["admin-couples"] }); }
  }

  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("couples").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-couples"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this couple and all its photos?")) return;
    const { error } = await supabase.from("couples").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-couples"] }); }
  }

  return (
    <section>
      <SectionHeader title="Gallery — couples" subtitle="Each couple is a folder of photos shown in the gallery." />
      <div className="flex gap-3 items-end max-w-md">
        <div className="flex-1">
          <label className="eyebrow">New couple name</label>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Anjali & Rahul"
            className="mt-2 w-full bg-transparent border-b border-border py-2 text-ivory outline-none focus:border-gold" />
        </div>
        <button onClick={addCouple} className="eyebrow px-5 py-2.5 bg-gold text-background">Add →</button>
      </div>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {couples.map((c) => (
          <div key={c.id} className="border border-border p-4 space-y-3">
            {c.cover_url ? (
              <img src={c.cover_url} alt="" className="aspect-[3/4] w-full object-cover" />
            ) : (
              <div className="aspect-[3/4] w-full bg-card flex items-center justify-center text-muted-foreground text-sm">
                No cover
              </div>
            )}
            <Field label="Names" value={c.names} onBlur={(v) => update(c.id, { names: v })} />
            <Field label="Venue" value={c.venue ?? ""} onBlur={(v) => update(c.id, { venue: v })} />
            <Field label="Date" value={c.event_date ?? ""} onBlur={(v) => update(c.id, { event_date: v })} />
            <Field label="Order" type="number" value={String(c.sort_order)} onBlur={(v) => update(c.id, { sort_order: Number(v) || 0 })} />
            <div className="flex gap-3">
              <button onClick={() => setOpenId(c.id)} className="eyebrow text-gold hover:underline">Manage photos →</button>
              <button onClick={() => remove(c.id)} className="eyebrow text-destructive hover:underline ml-auto">Delete</button>
            </div>
          </div>
        ))}
        {couples.length === 0 && <Empty msg="No couples yet." />}
      </div>

      {openId && <CoupleImagesModal coupleId={openId} onClose={() => setOpenId(null)} onCoverSet={(url) => update(openId, { cover_url: url })} />}
    </section>
  );
}

function CoupleImagesModal({ coupleId, onClose, onCoverSet }: { coupleId: string; onClose: () => void; onCoverSet: (url: string) => void }) {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const { data: images = [] } = useQuery({
    queryKey: ["admin-images", coupleId],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").eq("couple_id", coupleId).order("sort_order");
      if (error) throw error; return data;
    },
  });

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadGalleryFile(file, `couples/${coupleId}`);
      const { error } = await supabase.from("gallery_images").insert({ couple_id: coupleId, url, sort_order: images.length });
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["admin-images", coupleId] });
      if (images.length === 0) onCoverSet(url);
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setUploading(false); }
  }

  async function updateImg(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("gallery_images").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-images", coupleId] });
  }
  async function removeImg(id: string) {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-images", coupleId] });
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-3xl">Photos</h2>
          <button onClick={onClose} className="eyebrow">Close ✕</button>
        </div>
        <UploadButton label={uploading ? "Uploading…" : "+ Add photo"} disabled={uploading} onFile={onUpload} />
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {images.map((img) => (
            <div key={img.id} className="border border-border p-3 space-y-2">
              <img src={img.url} alt="" className="aspect-square w-full object-cover" />
              <Field label="Caption" value={img.caption ?? ""} onBlur={(v) => updateImg(img.id, { caption: v })} />
              <Field label="Order" type="number" value={String(img.sort_order)} onBlur={(v) => updateImg(img.id, { sort_order: Number(v) || 0 })} />
              <div className="flex justify-between">
                <button onClick={() => onCoverSet(img.url)} className="eyebrow text-gold hover:underline">Set as cover</button>
                <button onClick={() => removeImg(img.id)} className="eyebrow text-destructive hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {images.length === 0 && <Empty msg="No photos yet." />}
        </div>
      </div>
    </div>
  );
}

/* ============================== PACKAGES ============================== */

function PackagesAdmin() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").order("sort_order");
      if (error) throw error; return data;
    },
  });

  async function add() {
    const { error } = await supabase.from("packages").insert({
      name: "New package", price: "₹ 0", tag: "Tagline", points: ["Feature one"], sort_order: rows.length,
    });
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-packages"] });
  }
  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("packages").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-packages"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete package?")) return;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-packages"] });
  }

  return (
    <section>
      <SectionHeader title="Packages" subtitle="Pricing tiers shown on the homepage." />
      <button onClick={add} className="eyebrow px-5 py-2.5 bg-gold text-background">+ Add package</button>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((p) => (
          <div key={p.id} className="border border-border p-5 space-y-3">
            <Field label="Name" value={p.name} onBlur={(v) => update(p.id, { name: v })} />
            <Field label="Price" value={p.price} onBlur={(v) => update(p.id, { price: v })} />
            <Field label="Tag" value={p.tag ?? ""} onBlur={(v) => update(p.id, { tag: v })} />
            <div>
              <label className="eyebrow">Features (one per line)</label>
              <textarea
                defaultValue={(p.points ?? []).join("\n")} rows={5}
                onBlur={(e) => update(p.id, { points: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                className="mt-2 w-full bg-transparent border border-border p-2 text-ivory outline-none focus:border-gold text-sm"
              />
            </div>
            <Field label="Order" type="number" value={String(p.sort_order)} onBlur={(v) => update(p.id, { sort_order: Number(v) || 0 })} />
            <label className="flex items-center gap-2 eyebrow">
              <input type="checkbox" defaultChecked={p.featured} onChange={(e) => update(p.id, { featured: e.target.checked })} />
              Featured
            </label>
            <button onClick={() => remove(p.id)} className="eyebrow text-destructive hover:underline">Delete</button>
          </div>
        ))}
        {rows.length === 0 && <Empty msg="No packages yet." />}
      </div>
    </section>
  );
}

/* ============================== BOOKINGS ============================== */

function BookingsAdmin() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  return (
    <section>
      <SectionHeader title="Bookings" subtitle="Enquiries submitted via the website." />
      <div className="space-y-4">
        {rows.map((b) => (
          <div key={b.id} className="border border-border p-5 grid md:grid-cols-[1fr_auto] gap-4">
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-display text-xl">{b.name}</h3>
                <span className="eyebrow text-muted-foreground">{new Date(b.created_at).toLocaleString()}</span>
                <span className={`eyebrow px-2 py-0.5 border ${b.status === "new" ? "border-gold text-gold" : "border-border text-muted-foreground"}`}>{b.status}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <a href={`mailto:${b.email}`} className="text-ivory hover:text-gold">{b.email}</a>
                {b.event_date && <> · {b.event_date}</>}
                {b.venue && <> · {b.venue}</>}
              </div>
              {b.message && <p className="mt-3 text-sm whitespace-pre-wrap">{b.message}</p>}
            </div>
            <div className="flex md:flex-col gap-2">
              <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)}
                className="bg-transparent border border-border px-2 py-1 text-sm">
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="booked">booked</option>
                <option value="archived">archived</option>
              </select>
              <button onClick={() => remove(b.id)} className="eyebrow text-destructive hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <Empty msg="No bookings yet." />}
      </div>
    </section>
  );
}

/* ============================== SITE CONTENT ============================== */

const CONTENT_KEYS = [
  { key: "about_heading", label: "About — heading", multiline: true },
  { key: "about_body_1", label: "About — paragraph 1", multiline: true },
  { key: "about_body_2", label: "About — paragraph 2", multiline: true },
  { key: "contact_email", label: "Contact email" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "contact_address", label: "Contact address" },
];

function ContentAdmin() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error; return data;
    },
  });

  const map = new Map(rows.map((r) => [r.key, (r.value as { text?: string })?.text ?? ""]));

  async function save(key: string, text: string) {
    const { error } = await supabase.from("site_content").upsert({ key, value: { text } });
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-content"] });
  }

  return (
    <section>
      <SectionHeader title="Site content" subtitle="Editable text shown across the homepage." />
      <div className="space-y-6 max-w-2xl">
        {CONTENT_KEYS.map((k) => (
          <div key={k.key}>
            <label className="eyebrow">{k.label}</label>
            {k.multiline ? (
              <textarea
                defaultValue={map.get(k.key)} rows={3}
                onBlur={(e) => save(k.key, e.target.value)}
                className="mt-2 w-full bg-transparent border border-border p-3 text-ivory outline-none focus:border-gold text-sm"
              />
            ) : (
              <input
                defaultValue={map.get(k.key)}
                onBlur={(e) => save(k.key, e.target.value)}
                className="mt-2 w-full bg-transparent border-b border-border py-2 text-ivory outline-none focus:border-gold"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================== SHARED UI ============================== */

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
      <div className="hairline mt-6 w-24" />
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed border-border">{msg}</div>;
}

function Field({ label, value, onBlur, type = "text" }: { label: string; value: string; onBlur: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="eyebrow">{label}</label>
      <input
        defaultValue={value} type={type}
        onBlur={(e) => { if (e.target.value !== value) onBlur(e.target.value); }}
        className="mt-1 w-full bg-transparent border-b border-border py-1.5 text-ivory outline-none focus:border-gold text-sm"
      />
    </div>
  );
}

function UploadButton({ label, onFile, disabled }: { label: string; onFile: (f: File) => void; disabled?: boolean }) {
  return (
    <label className={`inline-block eyebrow px-5 py-2.5 bg-gold text-background cursor-pointer ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      {label}
      <input
        type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.currentTarget.value = ""; }}
      />
    </label>
  );
}
