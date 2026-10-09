# MediConnect implementation plan

## Product direction
MediConnect is a calm, editorial healthcare landing page for patients who need continuity across appointments, prescriptions, doctors, and uploaded records. The page is static by design for this marketing surface; it presents the product promise without inventing a working clinical data layer.

## Design system
- **Design movement:** Editorial healthcare minimalism with a Stripe/Linear-like product-marketing restraint.
- **Core principles:** trustworthy clarity, generous breathing room, quiet precision, and continuity over novelty.
- **Color philosophy:** soft sage-white keeps the page calm; clinical teal carries the single primary action and trust signal; primary dark creates a grounded contrast band; sage supports care and continuity; amber is reserved for tiny markers and moments of attention.
- **Layout paradigm:** asymmetrical editorial rhythm: hero copy and a timeline artifact, offset card compositions, horizontal steps, and a dark statistical interlude rather than a uniform centered grid.
- **Signature elements:** the connected patient timeline, small monospace clinical labels, and amber signal dots that mark moments in a care journey.
- **Conversion surface:** the former numeric trust band is a continuity path—Book what’s real, Keep what happened, Know what’s next—so the proof is product-relevant instead of vanity metrics. Get Started opens a calm auth flow with a simple signup form and role-based login tabs for Patient, Doctor, and Admin. Doctor login asks for email, Doctor ID, and password.
- **Ambient motion layer:** a silent 10-second realistic doctor-and-patient hospital loop sits behind the page at low opacity, with a sage-paper wash and reduced-motion fallback so it adds life without competing with reading. It is fixed to the viewport while content scrolls above it.
- **Interaction philosophy:** motion is quiet and informative. Sections reveal once as they enter view, actions lift slightly, and doctor cards respond with a small elevation.
- **Animation:** opacity and 22px vertical reveal over 700ms; staggered cards; no loops, particles, cursor effects, or 3D motion. Reduced-motion users receive the complete layout immediately.
- **Typography:** Fraunces for warm, characterful headlines; DM Sans for readable interface copy; DM Mono for dates, IDs, stats, and labels.
- **Brand essence:** A single, continuous view of care for people navigating more than one appointment. Personality: grounded, considerate, precise.
- **Brand voice:** calm and specific, never hype-driven. Example lines: “Your care history, finally in one place.” and “Every visit adds to the whole picture.”
- **Wordmark & logo:** MediConnect wordmark paired with a compact circular three-bar continuity mark, echoing a timeline without becoming a medical cross.
- **Signature brand color:** #145C54 clinical teal.

## Project structure
- `index.html` — semantic page structure and content for all required sections.
- `styles.css` — design tokens, layout, responsive breakpoints, hover states, and reduced-motion behavior.
- `script.js` — sticky navigation state, once-only reveal observers, and count-up statistics.
- `public/manus-routes.json` — route declaration for the single-page marketing route.
- `app.config.ts` — platform project metadata.
