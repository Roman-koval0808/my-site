# Trustpilot

The homepage shows a Trustpilot TrustBox above the contact details, plus plain links to the review
page in the contact block and the footer.

**The widget is not live yet.** It needs the NetSwagger business unit ID (below). Until that is
set, `TrustpilotWidget` renders a link to the review page instead, so nothing looks broken.

## Structure

| File                                   | Responsibility                                                      |
| -------------------------------------- | ------------------------------------------------------------------- |
| `src/components/trustpilot-widget.tsx` | The TrustBox, its two config values, and the link fallback.         |
| `src/routes/index.tsx`                 | Loads Trustpilot's bootstrap script via the route's `head.scripts`. |

## Going live

1. Sign in to [Trustpilot Business](https://businessapp.b2b.trustpilot.com), then open
   **Integrations -> TrustBox** and pick a widget. "Micro Star" is what the component is set up for.
2. Trustpilot shows you an HTML snippet. It contains two values:

   ```html
   <div
     class="trustpilot-widget"
     data-template-id="5419b732fbfb950b10de65e5"
     data-businessunit-id="abc123def456abc123def456"
   ></div>
   ```

3. Copy `data-businessunit-id` into `businessUnitId` in `src/components/trustpilot-widget.tsx`.
   If you chose a widget other than Micro Star, copy its `data-template-id` into `templateId` too.
4. Reload the page. The link is replaced by the live star rating and review count.

Neither value is a secret — both ship in the page source of every site using a TrustBox, which is
why they live in the component rather than in an environment variable.

## Notes

- Don't hardcode the score or review count anywhere. The widget reads them live; a number typed
  into the markup is wrong as soon as a review is posted.
- Don't use a screenshot of the Trustpilot profile page. Trustpilot's brand guidelines allow their
  official TrustBoxes and logo assets, not captures of their site.
- The bootstrap script is loaded `async`, so it never blocks first paint. If the script is blocked
  (ad blockers sometimes do), the markup inside the widget stays visible as a link to the reviews.

## Verification

Run `npx tsc --noEmit` and `npm run build`. To check the live widget, set `businessUnitId`, run
`npm run dev`, and confirm the stars render in the contact section.
