import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign in — ChennaiFrames" }] }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You are signed in.");
        nav({ to: "/admin" });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent. Check your email.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/admin" });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === "signin" ? "sign in" : mode === "signup" ? "sign up" : "reset password";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="eyebrow">← Back to site</Link>
        <h1 className="mt-8 font-display text-5xl">
          Admin <em className="serif-italic text-gold">{title}</em>
        </h1>
        <p className="mt-3 text-muted-foreground text-sm">
          {mode === "signup"
            ? "The very first account created becomes the admin."
            : mode === "forgot"
            ? "Enter your email and we'll send you a reset link."
            : "Sign in to manage the gallery, packages, and bookings."}
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <div>
            <label className="eyebrow">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-border py-3 text-ivory focus:border-gold outline-none"
            />
          </div>
          {mode !== "forgot" && (
            <div>
              <label className="eyebrow">Password</label>
              <input
                type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full bg-transparent border-b border-border py-3 text-ivory focus:border-gold outline-none"
              />
            </div>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full py-4 bg-gold text-background eyebrow hover:bg-ivory transition-colors disabled:opacity-50"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
              ? "Sign in →"
              : mode === "signup"
              ? "Create admin →"
              : "Send reset link →"}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3">
          {mode === "signin" && (
            <>
              <button onClick={() => setMode("forgot")} className="eyebrow text-muted-foreground hover:text-gold text-left">
                Forgot password?
              </button>
              <button onClick={() => setMode("signup")} className="eyebrow text-muted-foreground hover:text-gold text-left">
                First time? Create the admin account.
              </button>
            </>
          )}
          {mode === "signup" && (
            <button onClick={() => setMode("signin")} className="eyebrow text-muted-foreground hover:text-gold text-left">
              Already have an account? Sign in.
            </button>
          )}
          {mode === "forgot" && (
            <button onClick={() => setMode("signin")} className="eyebrow text-muted-foreground hover:text-gold text-left">
              ← Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
