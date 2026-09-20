import { motion } from "motion/react";

import { OptionCard } from "@/components/assessment/option-card";
import { cn } from "@/utils";

const ease = [0.23, 0.86, 0.44, 1];

export function QuestionCard({ question, value, onChange }) {
  const isMulti = question.kind === "multi";

  const handleSelect = (optionValue) => {
    if (!isMulti) {
      onChange(optionValue);
      return;
    }
    const set = Array.isArray(value) ? value : [];
    onChange(set.includes(optionValue) ? set.filter((v) => v !== optionValue) : [...set, optionValue]);
  };

  const isSelected = (v) => (isMulti ? Array.isArray(value) && value.includes(v) : value === v);

  return (
    <div>
      <motion.h2
        key={`${question.id}-label`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
        className="text-2xl font-medium tracking-[-0.02em] text-white md:text-3xl"
      >
        {question.label}
      </motion.h2>
      {question.helper ? (
        <motion.p
          key={`${question.id}-helper`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-2 text-[15px] font-light text-white/65"
        >
          {question.helper}
        </motion.p>
      ) : null}

      <div className={cn("mt-7 grid gap-2.5", question.options.length > 4 && "sm:grid-cols-2")}>
        {question.options.map((opt, i) => (
          <OptionCard
            key={opt.value}
            index={i}
            icon={opt.icon}
            label={opt.label}
            multi={isMulti}
            selected={isSelected(opt.value)}
            onClick={() => handleSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
