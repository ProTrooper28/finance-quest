import { useCallback, useMemo, useState } from "react";

import { questions } from "@/data/assessment";
import { analyzeAnswers } from "@/utils/assessment";
import { storage } from "@/utils";

const STORAGE_KEY = "finquest-assessment-v1";

/**
 * Owns the assessment lifecycle: answers per question, navigation,
 * persistence across reloads, and the final analysis result.
 */
export function useAssessment() {
  const [state, setState] = useState(() => storage.get(STORAGE_KEY, { step: 0, answers: {} }));
  const [result, setResult] = useState(null);

  const persist = useCallback((next) => {
    setState(next);
    storage.set(STORAGE_KEY, next);
  }, []);

  const total = questions.length;
  const step = Math.min(state.step ?? 0, total - 1);
  const question = questions[step];
  const answers = state.answers ?? {};
  const progress = Math.round((step / total) * 100);
  const answeredCurrent = useMemo(() => {
    const a = answers[question?.id];
    return Array.isArray(a) ? a.length > 0 : a != null;
  }, [answers, question]);

  const setAnswer = useCallback(
    (questionId, value) => {
      setState((prev) => {
        const next = { ...prev, answers: { ...prev.answers, [questionId]: value } };
        storage.set(STORAGE_KEY, next);
        return next;
      });
    },
    [],
  );

  const goTo = useCallback((nextStep) => {
    setState((prev) => {
      const next = { ...prev, step: Math.max(0, Math.min(nextStep, total - 1)) };
      storage.set(STORAGE_KEY, next);
      return next;
    });
  }, [total]);

  const next = useCallback(() => goTo(step + 1), [goTo, step]);
  const back = useCallback(() => goTo(step - 1), [goTo, step]);
  const skip = useCallback(() => goTo(step + 1), [goTo, step]);

  const finish = useCallback(() => {
    const finalAnswers = { ...answers };
    /* Fill any skipped answers with safe defaults so the analysis always
       has a complete answer set. */
    for (const q of questions) {
      const a = finalAnswers[q.id];
      if (q.kind === "multi") {
        if (!Array.isArray(a)) finalAnswers[q.id] = [];
      } else if (a == null) {
        finalAnswers[q.id] = q.options[0]?.value;
      }
    }
    const analysis = analyzeAnswers(finalAnswers);
    const payload = {
      ...analysis,
      name: storage.get("finquest-user", {})?.name ?? "",
      completedAt: new Date().toISOString(),
    };
    setResult(payload);
    storage.set("finquest-result-v1", payload);
    return payload;
  }, [answers]);

  const reset = useCallback(() => {
    storage.clear(STORAGE_KEY);
    storage.clear("finquest-result-v1");
    setState({ step: 0, answers: {} });
    setResult(null);
  }, []);

  return {
    total,
    step,
    question,
    answers,
    progress,
    answeredCurrent,
    setAnswer,
    goTo,
    next,
    back,
    skip,
    finish,
    result,
    reset,
  };
}

/**
 * Progress-only slice for layout consumers (e.g. the assessment shell).
 */
export function useAssessmentProgress() {
  const { progress } = useAssessment();
  return { progress };
}
