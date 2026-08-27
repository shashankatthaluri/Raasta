import type { GovernmentSignal } from "../domain/types";
import { JOURNEY_BY_ID } from "../domain/journeys";
import type { GovernmentAdapter, GovernmentState } from "./governmentAdapter";

/**
 * MockGovernmentAdapter — plays a scripted journey of simulated government signals
 * based on publicly documented PM-KISAN workflows. Demo mode only.
 * Never presents simulated data as a real citizen's record; no live integration implied.
 */
export class MockGovernmentAdapter implements GovernmentAdapter {
  private cursor = 0;

  constructor(
    private readonly journeyId: string,
    private readonly identifier: string,
    startCursor = 0,
  ) {
    if (!JOURNEY_BY_ID[journeyId]) {
      throw new Error(`Unknown journey: ${journeyId}`);
    }
    this.cursor = Math.min(startCursor, JOURNEY_BY_ID[journeyId].steps.length);
  }

  get journey(): (typeof JOURNEY_BY_ID)[string] {
    return JOURNEY_BY_ID[this.journeyId];
  }

  /** The next scripted signal, or null when the script is exhausted.
   *  verifiedAt is stamped NOW, not at module load — simulated signals must
   *  carry believable timestamps ("Last verified" moves when a state changes). */
  nextSignal(): GovernmentSignal | null {
    const step = this.journey.steps[this.cursor];
    if (!step) return null;
    this.cursor += 1;
    return { ...step.signal, verifiedAt: new Date() };
  }

  peek(): { label: { en: string; hi: string }; waitSeconds?: number } | null {
    const step = this.journey.steps[this.cursor];
    return step ? { label: step.label, waitSeconds: step.waitSeconds } : null;
  }

  get currentStepIndex(): number {
    return this.cursor;
  }

  get isComplete(): boolean {
    return this.cursor >= this.journey.steps.length;
  }

  async getBeneficiaryState(id: string): Promise<GovernmentState> {
    return {
      identifier: id,
      lastSignal: this.cursor > 0 ? this.journey.steps[this.cursor - 1].signal : null,
      updatedAt: this.cursor > 0 ? this.journey.steps[this.cursor - 1].signal.verifiedAt : null,
    };
  }

  async getPaymentStatus(): Promise<GovernmentSignal | null> {
    for (let i = this.cursor - 1; i >= 0; i -= 1) {
      const s = this.journey.steps[i].signal;
      if (s.type === "PAYMENT_STATUS") return s;
    }
    return null;
  }

  async getKycStatus(): Promise<GovernmentSignal | null> {
    for (let i = this.cursor - 1; i >= 0; i -= 1) {
      const s = this.journey.steps[i].signal;
      if (s.type === "EKYC_STATUS") return s;
    }
    return null;
  }
}
