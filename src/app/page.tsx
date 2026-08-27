import { cookies } from "next/headers";
import { HomeClient } from "@/components/HomeClient";
import { isSupportedLang, LANG_COOKIE_KEY, type Lang } from "@/lib/i18n";

/**
 * Entry — server side. Reads the language cookie so the server can render:
 *  - the LANGUAGE GATE for genuinely fresh visitors (no stored choice), and
 *  - the LANDING directly, in the stored language, for returning visitors —
 *    with NO flash of the language page (the reported bug: gate appeared and
 *    auto-jumped). The client never decides on first paint.
 */
export default async function Home() {
  const langCookie = (await cookies()).get(LANG_COOKIE_KEY)?.value ?? null;
  const initialLang: Lang | null = isSupportedLang(langCookie) ? langCookie : null;
  return <HomeClient initialLang={initialLang} />;
}
