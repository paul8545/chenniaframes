import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Reset password — ChennaiFrames" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase auto-exchanges the recovery token from the URL hash on load.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. Please sign in.");
      await supabase.auth.signOut();
      nav({ to: "/auth" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/auth" className="eyebrow">← Back to sign in</Link>
        <h1 className="mt-8 font-display text-5xl">
          Set a <em className="serif-italic text-gold">new password</em>
        </h1>

        {!ready ? (
          <p className="mt-6 text-muted-foreground text-sm">
            Validating reset link… If nothing happens, request a new link from the sign-in page.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <div>
              <label className="eyebrow">New password</label>
              <input
                type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-ivory focus:border-gold outline-none"
              />
            </div>
            <div>
              <label className="eyebrow">Confirm password</label>
              <input
                type="password" required minLength={6} value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-ivory focus:border-gold outline-none"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-gold text-background eyebrow hover:bg-ivory transition-colors disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update password →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
