import { describe, it, expect } from "vitest";
import { createDemoCase, getStoredCase, simulateNextSignal, completeActionOnCase, demoInfoFor } from "@/server/caseStore";
import { toCaseDTO } from "@/server/dto";
import { JOURNEYS } from "@/domain/journeys";
import { MAGIC_DEMO_COPY } from "@/lib/magicDemoCopy";
import type { Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["en", "hi", "te", "ta", "kn", "mr", "bn", "pa"];

describe("Full 32-Permutation Magic Demo Matrix (4 Journeys x 8 Languages)", () => {
  for (const lang of LANGS) {
    describe(`Language: [${lang.toUpperCase()}]`, () => {
      for (const journey of JOURNEYS) {
        it(`walks journey ${journey.id} with complete 8-language magic demo copy at every step in ${lang}`, async () => {
          const c = await createDemoCase({ journeyId: journey.id });
          const stored = await getStoredCase(c.id);
          expect(stored).toBeDefined();
          const demo = demoInfoFor(stored!);
          const dto = toCaseDTO(stored!.case, demo);

          const journeyCopy = MAGIC_DEMO_COPY[journey.id];
          expect(journeyCopy).toBeDefined();

          // 1. If citizen action required at step 1
          if (dto.yourAction.required && dto.yourAction.action) {
            const step1Copy = journeyCopy[1];
            expect(step1Copy).toBeDefined();
            expect(step1Copy.status[lang]).toBeTruthy();
            if (step1Copy.timeLapse) {
              expect(step1Copy.timeLapse.daysText[lang]).toBeTruthy();
              expect(step1Copy.timeLapse.title[lang]).toBeTruthy();
              expect(step1Copy.timeLapse.description[lang]).toBeTruthy();
            }

            await completeActionOnCase(c.id, dto.yourAction.action.id as any);
          }

          // 2. Simulate through every step to resolution
          for (let step = 1; step <= journey.steps.length; step++) {
            const stepCopy = journeyCopy[step];
            if (stepCopy) {
              expect(stepCopy.status[lang]).toBeTruthy();
              if (stepCopy.timeLapse) {
                expect(stepCopy.timeLapse.daysText[lang]).toBeTruthy();
                expect(stepCopy.timeLapse.title[lang]).toBeTruthy();
                expect(stepCopy.timeLapse.description[lang]).toBeTruthy();
              }
            }
            await simulateNextSignal(c.id);
          }

          // 3. Verify terminal resolution state and copy
          const finalStored = await getStoredCase(c.id);
          expect(finalStored).toBeDefined();
          const finalDemo = demoInfoFor(finalStored!);
          const finalDto = toCaseDTO(finalStored!.case, finalDemo);

          expect(["PAYMENT_CREDITED", "RESOLVED"]).toContain(finalDto.currentState);
          expect(finalDto.stateCategory).toBe("resolved");

          const finalCopy = journeyCopy[journey.steps.length] || journeyCopy[4];
          expect(finalCopy.status[lang]).toBeTruthy();
        });
      }
    });
  }
});
