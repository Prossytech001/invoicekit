Rename this folder to `[token]` and add `page.tsx` in the PDF milestone.
The page fetches `/api/pdf/render-data/<token>`, renders the template component with that data,
and uses a print stylesheet (`@page { size: A4; margin: 0 }`). Playwright (in the backend) opens
this URL and saves it as a PDF. The token is signed and expires in 2 minutes.
