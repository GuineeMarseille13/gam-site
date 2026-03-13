/**
 * Utilitaires pour le formulaire de contact
 */

import { ContactFormData } from "../_types/contacts.types";

/**
 * Nettoie les données du formulaire avant validation
 */
export function cleanFormData(data: ContactFormData): ContactFormData {
  return {
    ...data,
    phone: data.phone.replace(/\s/g, ""),
  };
}

/**
 * Vérifie si un champ est vide
 */
export function isEmpty(value: string): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Nettoie un numéro de téléphone (supprime les espaces)
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\s/g, "");
}

