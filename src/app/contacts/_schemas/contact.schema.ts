/**
 * Schéma de validation Zod pour le formulaire de contact
 */

import { z } from "zod";
import { MESSAGES } from "../_config/contacts.config";

export const contactFormSchema = z.object({
  firstName: z
    .string({ required_error: MESSAGES.formValidation.firstName.required })
    .refine((val) => val.trim().length > 0, MESSAGES.formValidation.firstName.required)
    .refine((val) => val.trim().length >= 2, MESSAGES.formValidation.firstName.min),
  lastName: z
    .string({ required_error: MESSAGES.formValidation.lastName.required })
    .refine((val) => val.trim().length > 0, MESSAGES.formValidation.lastName.required)
    .refine((val) => val.trim().length >= 2, MESSAGES.formValidation.lastName.min),
  email: z
    .string({ required_error: MESSAGES.formValidation.email.required })
    .refine((val) => val.trim().length > 0, MESSAGES.formValidation.email.required)
    .email(MESSAGES.formValidation.email.invalid),
  phone: z
    .string()
    .refine(
      (val) => !val || /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{2}){4}$/.test(val.replace(/\s/g, "")),
      MESSAGES.formValidation.phone.invalid
    )
    .optional()
    .or(z.literal("")),
  subject: z
    .string({ required_error: MESSAGES.formValidation.subject.required })
    .refine((val) => val.trim().length > 0, MESSAGES.formValidation.subject.required)
    .refine((val) => val.trim().length >= 5, MESSAGES.formValidation.subject.min),
  message: z
    .string({ required_error: MESSAGES.formValidation.message.required })
    .refine((val) => val.trim().length > 0, MESSAGES.formValidation.message.required)
    .refine((val) => val.trim().length >= 10, MESSAGES.formValidation.message.min),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;

