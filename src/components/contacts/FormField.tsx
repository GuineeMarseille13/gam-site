/**
 * Composant réutilisable pour un champ de formulaire
 */

"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { ContactFormData } from "@/app/contacts/_types/contacts.types";
import { STYLE_CONFIG, ANIMATION_CONFIG } from "@/app/contacts/_config/contacts.config";

interface FormFieldProps {
  name: keyof ContactFormData;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  placeholder: string;
  value: string;
  error?: string;
  icon: React.ComponentType<{ className?: string }>;
  onChange: (value: string) => void;
  onBlur: () => void;
  required?: boolean;
  rows?: number;
  inputMode?: "tel" | "email" | "text";
  delay?: number;
}

export default function FormField({
  name,
  label,
  type,
  placeholder,
  value,
  error,
  icon: Icon,
  onChange,
  onBlur,
  required = false,
  rows = 6,
  inputMode,
  delay = 0,
}: FormFieldProps) {
  const isTextarea = type === "textarea";
  const inputClassName = `${STYLE_CONFIG.form.input} ${
    error ? STYLE_CONFIG.form.inputError : STYLE_CONFIG.form.inputValid
  } ${isTextarea ? STYLE_CONFIG.form.textarea : ""}`;

  return (
    <motion.div
      initial={ANIMATION_CONFIG.form.field.initial}
      animate={ANIMATION_CONFIG.form.field.animate}
      transition={{ ...ANIMATION_CONFIG.form.field.transition, delay }}
      className="space-y-2"
    >
      <label className={STYLE_CONFIG.form.label}>
        <Icon className="w-4 h-4" />
        {label} {required && "*"}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputClassName}
          placeholder={placeholder}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputClassName}
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
        />
      )}
      {error && (
        <motion.p
          {...ANIMATION_CONFIG.form.error}
          className={STYLE_CONFIG.form.error}
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </motion.p>
      )}
    </motion.div>
  );
}

