import { useState } from "react";

import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
    const city = (data.get("city") as string) || "";

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      toast({ title: "Please enter a valid email." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "You're in!",
        description: `Thanks ${name || "friend"} — we’ll keep you posted${city ? ` about ${city}` : ""}.`,
      });
      form.reset();
    }, 600);

    console.log("Newsletter signup:", { name, email, city });
  };

  return (
    <>
      <header className="container py-6 flex items-center justify-end">
        <div aria-hidden className="font-hand text-sm px-3 py-1 border-2 border-foreground rounded-md">FR / ENG</div>
      </header>
      <main>
        <section className="container pb-24 pt-2">
          <h1 className="display-title text-primary text-6xl sm:text-7xl md:text-8xl leading-[0.9] tracking-tight">
            The<br />
            Action<br />
            Pact<span className="text-primary">.</span>
            <span className="sr-only"> — Newsletter Signup</span>
          </h1>

          <article id="signup" className="mt-10 max-w-2xl">
            <p className="font-hand text-2xl mb-4">Get in on the Action.</p>
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Newsletter signup form">
              <div>
                <label htmlFor="name" className="scribble-label">Name</label>
                <input id="name" name="name" type="text" className="scribble-input" placeholder="Your name" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="email" className="scribble-label">Email</label>
                <input id="email" name="email" type="email" required className="scribble-input" placeholder="you@example.com" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="city" className="scribble-label">City</label>
                <input id="city" name="city" type="text" className="scribble-input" placeholder="Your city" autoComplete="address-level2" />
              </div>

              <div className="pt-4">
                <button type="submit" className="scribble-button" disabled={loading} aria-busy={loading} aria-live="polite">
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </article>
        </section>
      </main>
    </>
  );
};

export default Index;
