import { HomeClient } from "@/components/HomeClient";

/**
 * Entry — server side. For demo presentation, fresh visits and hard refreshes
 * showcase the full cinematic logo intro and Apple language selection card.
 */
export default async function Home() {
  return <HomeClient initialLang={null} />;
}
