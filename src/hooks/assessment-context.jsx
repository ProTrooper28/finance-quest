import { createContext, useContext } from "react";

import { useAssessment } from "@/hooks/use-assessment";

/**
 * Shares one assessment instance between the layout (header progress bar)
 * and the question page, so both stay in sync.
 */
const AssessmentContext = createContext(null);

export function AssessmentProvider({ children }) {
  const value = useAssessment();
  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

/** Returns the shared instance, or a fresh one when rendered outside the provider. */
export function useAssessmentContext() {
  const ctx = useContext(AssessmentContext);
  return ctx ?? useAssessment();
}
