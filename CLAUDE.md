# CLAUDE.md — Eqdeha Mobile App (Expo)

## What this is
Mobile app for **Eqdeha**, a local delivery app in Ezbet Sekina (Egypt). One app, two roles:
- **Customer**: orders from local shops or "anything", tracks the courier, chats, pays the courier directly.
- **Courier**: registers, waits for admin approval, accepts orders, makes shop invoices, delivers.
The admin dashboard is a separate web project — not here.

Backend: Spring Boot REST API (`/api/v1/**`). Base URL from `EXPO_PUBLIC_API_URL`.

## Design source of truth
`design/` contains every screen as an HTML file (390×844, RTL Arabic, inline styles). See `design/INDEX.md`.
- Rebuild each screen in React Native to match the HTML: layout, spacing, radii, colors, font sizes, texts.
- `{{...}}`, `<sc-for>`, `<sc-if>` and the script at the bottom are the screen's dynamic data and states — implement them with real state/API data.
- `<a href="X.dc.html">` = navigate to screen X.
- Never invent new colors or fonts. If a screen is missing (e.g. password fields), design it in the same style.

## Stack
- Expo (latest SDK) + **Expo Router** (file-based routes in `app/`), TypeScript strict.
- State: Zustand (auth/session). Server data: TanStack Query. HTTP: axios with one instance + interceptors.
- Forms: react-hook-form + zod.
- Token: `expo-secure-store` (never AsyncStorage).
- Fonts: `@expo-google-fonts/cairo` (400, 600, 700, 800).
- Maps: `react-native-maps` + `expo-location`. Camera/images: `expo-image-picker` / `expo-camera`.
- Icons: draw them as `react-native-svg` components matching the SVGs in the HTML.

## RTL
The whole app is Arabic RTL. Force RTL at startup (`I18nManager.allowRTL(true)` + `forceRTL(true)`, reload once if needed). Use `start/end` instead of `left/right`. Phone numbers, codes and wallet numbers stay LTR.

## Theme tokens (`src/theme/`)
| Token | Value | Use |
|---|---|---|
| primary | #0F4C5C | headers, main brand |
| primaryLight | #1A5E70 | chips/buttons on top of primary |
| primaryDark | #0A3540 | pressed/link hover |
| accent | #FFB703 | main action buttons (text on it: #3A2A00) |
| accentLight | #FFF1CC | highlights, points |
| background | #F7F5F0 | screen background |
| surface | #FFFFFF | cards |
| text | #1F2A30 | main text |
| textMuted | #5B6770 | secondary text |
| textOnPrimary | #FFFFFF / #CFE6EA | text on primary (main / secondary) |
| border | #D9D6CE | inputs |
| divider | #E6E2D8 / #EFECE4 | separators |
| success | #2A9D8F (bg #DDF1EE, text #1B6B61) | done states |
| danger | #E63946 (bg #FBE3E4, text #A32D2D / #C1121F) | errors, cancel |
Radii: inputs 14, cards 18, big cards 22, pills 999. Header bottom radius 28. Buttons height 52–56.

## Structure
```
app/                     # Expo Router routes only (thin)
  (auth)/                # splash, phone, terms, otp, profile, login, forgot
  (customer)/            # tabs: home, orders, account + stack screens
  (courier)/             # tabs: orders, wallet, account + stack screens
src/
  api/                   # axios instance, endpoints per feature
  components/ui/         # Button, TextField, PhoneField, OtpInput, Card, Header, Chip, Pill, ScreenContainer...
  features/<feature>/    # hooks, components, schemas per feature (auth, shops, orders...)
  store/                 # zustand stores
  theme/                 # colors, spacing, typography
  utils/                 # phone normalize (+201XXXXXXXXX), formatters (Arabic digits, EGP)
```
Rules: screens use shared `components/ui` (no copy-pasted styles); API calls only through `src/api`; show backend `message` (already Arabic) on errors.

## Backend connection
- `src/api/config.ts`: base URL = `EXPO_PUBLIC_API_URL` (`.env.local`), else in dev the Metro host IP on port 8080, else localhost / `10.0.2.2` (Android emulator).
- `src/api/client.ts`: the one axios instance. It adds `Authorization: Bearer <token>` from the session store and turns every failure into `ApiError { code, message, status, fieldErrors }` (`message` is Arabic from the backend; network errors get a local Arabic message). Show `errorMessage(e)`; put `fieldErrors[field]` under the matching input.
- `src/api/<feature>.ts`: typed endpoint functions mirroring the backend DTOs. Phones are sent as `+20` + the 10 digits the screens keep.
- Multipart: append files as `{ uri, name, type }` on native and as a Blob on web (see `appendImage` in `src/api/auth.ts`).
- Session: `src/store/session.ts` (zustand) — `signIn(authResponse)` stores the JWT in expo-secure-store (localStorage on web, dev only).
- Sign-up step data (phone, verificationToken) lives in `features/auth/signupDraft.ts`, never in route params.
- Terms: `src/api/terms.ts` + `features/auth/termsStore.ts`. The Terms screen shows the server text (`## ` lines = section titles) for `?role=customer|courier`; sign-up step 1 sends the loaded `termsVersion`. On `TERMS_NOT_ACCEPTED` the box is unticked and the new version reloaded. `user.termsUpToDate === false` after login → show the terms and call `acceptTerms(id)` (to build with login).
- Connected so far:
  - **Customer sign-up**: phone → `/customer/signup/send-otp`, OTP → `/verify-otp`, profile → `/complete` → signed in → `/home`.
  - **Courier sign-up**: phone → `/courier/signup/send-otp`, OTP → `/verify-otp`, info (23-CInfo) is only saved in the draft, vehicle (24-CVehicle) sends everything to `/courier/signup/complete` (multipart, 4 photos, 120 s timeout) → `/courier-pending?message=` (no token: the account waits for admin approval). Backend field errors for step-3 fields are put in `signupDraft.courierInfoErrors` and the vehicle screen goes back so the info screen shows and focuses them; step 4 is kept in `signupDraft.courierVehicle` so the photos survive that trip.
  - **Login** (customer and courier, one endpoint `POST /api/v1/auth/login`): the tab only changes the links; the response's `user.role` decides the home. Routing after login / app start is in `features/auth/afterLogin.ts` (`goAfterLogin`): `termsUpToDate === false` → `/terms?mode=update` (accept → `POST /api/v1/terms/accept` → home; back = sign out); courier `needs_fix` → `/courier-pending?mode=fix&message=<note>` (limited token; the resubmit screen isn't built yet); otherwise `/home` or `/courier-home`. Errors: `INVALID_CREDENTIALS` under the password; `COURIER_PENDING_APPROVAL` → `/courier-pending?mode=wait`; rejected / suspended / banned / network → popup.
  - **Saved session**: the splash hydrates the session and calls `GET /api/v1/auth/me` (8 s timeout). 401 → signed out → login; 403 (needs_fix token) or no internet → the saved profile is used. "تسجيل الخروج" on the placeholder homes signs out (local only, no backend logout endpoint yet).
  - **Home → "محلات عزبة سكينة"**: categories from `GET /api/v1/categories` (`src/api/catalog.ts`, store `src/store/categories.ts`, reloaded each time Home is focused; the last good list stays on screen if a refresh fails). Icon: `iconUrl` image (via `fileUrl()` in `src/api/config.ts`) → `iconKey` if it's one of `CATEGORY_ICON_KEYS` (`components/CategoryIcon.tsx`) → first letter. The icon fills the whole 56×56 tile with no background (image: `cover`, rounded 18; drawn icon / letter in the category `color`). Tapping opens `/shops?categoryId=<id>&category=<iconKey>`; the Shops screen is still on mocks (its filter uses `category`).
  - Forgot-password is still UI-only. The `add_wallet` nextStep has no screen yet (goes to courier home).

## Phase 2 screens (UI only, not connected yet)
- Customer tabs `src/app/(customer)/(tabs)/` (home 05, orders 20, account 18) + stack screens 06–17, 19. Courier tabs `src/app/(courier)/(tabs)/` (courier-home 26, courier-wallet 30, courier-account 31) + 27, 28, 29, 32. Route files only re-export `src/features/<role>/screens/*`.
- Sample data: `src/mocks/*` (typed like API responses, `{ data }`). Replace with `src/api` calls when connecting; screens never hardcode data.
- Local state: zustand in `src/store/` — `orderDraft` (07/08/09 form), `activeOrder` (11–16), `chat` (13/27 threads), `customer` (profile + notifications), `points`, `courier` (26–32 flow, debt, wallet).
- `<DevSwitch>` / dev-only toggles (12, 26, 30, 10/32 header, 17 push preview, 27 "جرّب: اتبعتت") render only when `__DEV__`.
- Map: `components/map/MapCanvas.tsx` (react-native-maps) with a static `.web.tsx` fallback.

## Commands
```bash
npx expo start          # dev server (press a / i, or scan with Expo Go)
npx expo start -c       # clear cache
npx tsc --noEmit        # type check
```
