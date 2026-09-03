import { CitizenJourney, StepStatus } from "../types/domain";

export class JourneyService {
  /**
   * Calculate overall journey progress percentage based on completed steps
   */
  static calculateProgress(journey: CitizenJourney): number {
    if (!journey.steps || journey.steps.length === 0) return 0;
    const completedCount = journey.steps.filter(
      (s) => s.status === "completed"
    ).length;
    return Math.round((completedCount / journey.steps.length) * 100);
  }

  /**
   * Advance a journey by completing a specific step number and activating the next
   */
  static completeStep(
    journey: CitizenJourney,
    stepNumber: number
  ): CitizenJourney {
    const updatedSteps = journey.steps.map((step) => {
      if (step.stepNumber === stepNumber) {
        return {
          ...step,
          status: "completed" as StepStatus,
          completedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        };
      } else if (step.stepNumber === stepNumber + 1) {
        return {
          ...step,
          status:
            step.status === "locked" ? ("active" as StepStatus) : step.status,
        };
      }
      return step;
    });

    const progressPercentage = this.calculateProgress({
      ...journey,
      steps: updatedSteps,
    });

    return {
      ...journey,
      steps: updatedSteps,
      progressPercentage,
    };
  }

  /**
   * Check if a journey has missing required documents
   */
  static getMissingDocuments(
    journey: CitizenJourney,
    uploadedDocTitles: string[]
  ): string[] {
    const requiredSet = new Set<string>();
    journey.steps.forEach((step) => {
      step.requiredDocuments.forEach((doc) => {
        requiredSet.add(doc);
      });
    });

    const missing: string[] = [];
    requiredSet.forEach((reqDoc) => {
      const found = uploadedDocTitles.some((title) =>
        title.toLowerCase().includes(reqDoc.toLowerCase())
      );
      if (!found) {
        missing.push(reqDoc);
      }
    });

    return missing;
  }
}
