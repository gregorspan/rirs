export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="text-4xl lg:text-5xl font-semibold text-center max-w-2xl">
        Unlock your team&apos;s potential with the RIRS Training Platform
      </h1>
      <p className="text-lg lg:text-xl text-muted-foreground text-center max-w-3xl">
        Create personalized learning paths, track progress in real time, and deliver engaging
        courses that keep your workforce ahead of the curve. Launch workshops, certifications, and
        microlearning experiences in minutes—no technical setup required.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/get-started"
          className="px-6 py-3 rounded-md bg-foreground text-background font-medium hover:opacity-90 transition"
        >
          Explore the platform
        </a>
        <a
          href="/demo"
          className="px-6 py-3 rounded-md border border-foreground/20 font-medium hover:bg-foreground/5 transition"
        >
          Book a demo
        </a>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
