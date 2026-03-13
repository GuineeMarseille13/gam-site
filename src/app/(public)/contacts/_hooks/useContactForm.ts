/**
 * Hook personnalisé pour gérer le formulaire de contact
 */

import { useState, useCallback } from "react";
import { z } from "zod";
import { ContactFormData } from "../_types/contacts.types";
import { contactFormSchema } from "../_schemas/contact.schema";
import { MESSAGES } from "../_config/contacts.config";

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateField = useCallback((field: keyof ContactFormData, value: string): string | undefined => {
    // Le téléphone est optionnel, pas de validation si vide
    if (field === "phone" && !value.trim()) {
      return undefined;
    }

    const trimmedValue = value.trim();

    // Validation manuelle pour afficher les bons messages dans le bon ordre
    if (!trimmedValue) {
      switch (field) {
        case "firstName":
          return MESSAGES.formValidation.firstName.required;
        case "lastName":
          return MESSAGES.formValidation.lastName.required;
        case "email":
          return MESSAGES.formValidation.email.required;
        case "subject":
          return MESSAGES.formValidation.subject.required;
        case "message":
          return MESSAGES.formValidation.message.required;
      }
    }

    // Validation avec le schéma pour les autres cas
    try {
      const fieldSchema = contactFormSchema.shape[field];
      if (!fieldSchema) {
        return undefined;
      }

      // Nettoyer la valeur pour le téléphone
      const valueToValidate = field === "phone" ? value.replace(/\s/g, "") : value;
      
      // Valider le champ
      fieldSchema.parse(valueToValidate);
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError && error.errors && error.errors.length > 0) {
        // Prendre la première erreur avec son message personnalisé
        const firstError = error.errors[0];
        if (firstError && firstError.message) {
          return firstError.message;
        }
      }
      
      // Fallback avec messages personnalisés selon le champ
      switch (field) {
        case "firstName":
          if (trimmedValue.length < 2) return MESSAGES.formValidation.firstName.min;
          break;
        case "lastName":
          if (trimmedValue.length < 2) return MESSAGES.formValidation.lastName.min;
          break;
        case "email":
          return MESSAGES.formValidation.email.invalid;
        case "subject":
          if (trimmedValue.length < 5) return MESSAGES.formValidation.subject.min;
          break;
        case "message":
          if (trimmedValue.length < 10) return MESSAGES.formValidation.message.min;
          break;
        case "phone":
          return MESSAGES.formValidation.phone.invalid;
      }
      
      return "Erreur de validation";
    }
  }, []);

  const handleBlur = useCallback((field: keyof ContactFormData) => {
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      // Effacer l'erreur si la validation réussit
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formData, validateField]);

  const validateForm = useCallback((): boolean => {
    // Validation complète avec nettoyage du téléphone
    const dataToValidate = {
      ...formData,
      phone: formData.phone.replace(/\s/g, ""),
    };
    
    const result = contactFormSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ContactFormData;
        if (field) {
          fieldErrors[field] = error.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    
    return true;
  }, [formData]);

  const scrollToFirstError = useCallback(() => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [errors]);

  const resetForm = useCallback(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    scrollToFirstError,
    resetForm,
  };
}

