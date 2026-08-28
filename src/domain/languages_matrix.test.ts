import { describe, it, expect } from "vitest";
import { createDemoCase, getStoredCase, simulateNextSignal, completeActionOnCase, demoInfoFor } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";
import { JOURNEYS } from "@/domain/journeys";
import { CASE_PAGE_COPY } from "@/lib/caseTranslations";
import type { Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["en", "hi", "te", "ta", "kn", "mr", "bn", "pa"];

describe("Full 8-Language Matrix Verification Across All Scenarios", () => {
  for (const lang of LANGS) {
    describe(`Language: [${lang.toUpperCase()}]`, () => {
      it(`has valid case page translations for ${lang}`, () => {
        const cp = CASE_PAGE_COPY[lang];
        expect(cp).toBeDefined();
        expect(cp.recoveryDocket).toBeTruthy();
        expect(cp.currentStatus).toBeTruthy();
        expect(cp.backToCheck).toBeTruthy();
      });

      for (const journey of JOURNEYS) {
        it(`renders journey ${journey.id} with full native translations in ${lang} from start to resolution`, async () => {
          const c = await createDemoCase({ journeyId: journey.id });
          let stored = await getStoredCase(c.id);
          expect(stored).toBeDefined();
          let demo = demoInfoFor(stored!);
          let dto = toCaseDTO(stored!.case, demo);

          // 1. Initial State Checks
          const initialTitle = dto.title[lang];
          const initialWhy = dto.why[lang];
          const initialActor = dto.nextActorLabel[lang];
          const initialChain = (dto.chain as Record<Lang, string[]>)[lang];

          expect(typeof initialTitle).toBe("string");
          expect(initialTitle.length).toBeGreaterThan(0);

          expect(typeof initialWhy).toBe("string");
          expect(initialWhy.length).toBeGreaterThan(0);

          expect(typeof initialActor).toBe("string");
          expect(initialActor.length).toBeGreaterThan(0);

          expect(Array.isArray(initialChain)).toBe(true);
          expect(initialChain.length).toBeGreaterThan(0);

          // 2. Action Check if required
          if (dto.yourAction.required && dto.yourAction.action) {
            const actTitle = (dto.yourAction.action.title as Record<Lang, string>)[lang];
            const actWhy = (dto.yourAction.action.why as Record<Lang, string>)[lang];
            expect(typeof actTitle).toBe("string");
            expect(actTitle.length).toBeGreaterThan(0);
            expect(typeof actWhy).toBe("string");
            expect(actWhy.length).toBeGreaterThan(0);

            // Perform citizen action
            const actRes = await completeActionOnCase(c.id, dto.yourAction.action.id as any);
            expect(actRes).toBeDefined();
          }

          // 3. Play through official signals to reach terminal resolution
          for (let s = 0; s < journey.steps.length; s++) {
            const stepLabel = journey.steps[s].label[lang];
            expect(typeof stepLabel).toBe("string");
            expect(stepLabel.length).toBeGreaterThan(0);

            await simulateNextSignal(c.id);
          }

          // 4. End Solution / Terminal Resolved State Check
          const finalStored = await getStoredCase(c.id);
          expect(finalStored).toBeDefined();
          const finalDemo = demoInfoFor(finalStored!);
          const finalDto = toCaseDTO(finalStored!.case, finalDemo);
          const finalTitle = finalDto.title[lang];
          const finalWhy = finalDto.why[lang];

          expect(["PAYMENT_CREDITED", "RESOLVED"]).toContain(finalDto.currentState);
          expect(typeof finalTitle).toBe("string");
          expect(finalTitle.length).toBeGreaterThan(0);
          expect(typeof finalWhy).toBe("string");
          expect(finalWhy.length).toBeGreaterThan(0);
        });
      }
    });
  }
});
