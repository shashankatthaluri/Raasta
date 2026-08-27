import type { GovernmentSignal } from "../domain/types";
import { JOURNEY_BY_ID } from "../domain/journeys";
import type { GovernmentAdapter, GovernmentState } from "./governmentAdapter";

/**
 * MockGovernmentAdapter — plays a scripted journey of simulated official signals.
 * Demo mode only. Never presents simulated data as a real citizen's record.
 */
export class MockGovernmentAdapter implements GovernmentAdapter {
  private cursor = 0;

  constructor(
    private readonly journeyId: string,
    private readonly identifier: string,
  ) {
    if (!JOURNEY_BY_ID[journeyId]) {
      throw new Error(`Unknown journey: ${journeyId}`);
    }
  }

  get journey(): (typeof JOURNEY_BY_ID)[string] {
    return JOURNEY_BY_ID[this.journeyId];
  }

  /** The next scripted signal, or null when the script is exhausted. */
  nextSignal(): GovernmentSignal | null {
    const step = this.journey.steps[this.cursor];
    if (!step) return null;
    this.cursor += 1;
    return step.signal;
  }

  peek(): { label: string; waitSeconds?: number } | null {
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
