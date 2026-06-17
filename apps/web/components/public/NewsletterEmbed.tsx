/**
 * Beehiiv slim subscribe form (rd-beats.beehiiv.com).
 * The `slim=true` variant renders a single-line email + button (~52px tall),
 * so it fits the no-scroll home overlay as well as the /about page.
 * Styling lives in the Beehiiv dashboard; the iframe background is transparent.
 */
export function NewsletterEmbed({ className = "" }: { className?: string }) {
  return (
    <iframe
      title="Subscribe to the Rajon Dey Music newsletter"
      src="https://embeds.beehiiv.com/c893af3a-0ad7-455c-b91a-ea51b01cb61c?slim=true"
      className={className}
      style={{
        width: "100%",
        height: 52,
        margin: 0,
        border: "none",
        background: "transparent",
      }}
    />
  );
}
