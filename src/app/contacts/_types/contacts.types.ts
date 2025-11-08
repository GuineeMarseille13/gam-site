/**
 * Types TypeScript pour la page contacts
 */

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactMethod {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  color: string;
}

export interface SocialNetwork {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  color: string;
}

export interface FormFieldConfig {
  name: keyof ContactFormData;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  placeholder: string;
  required: boolean;
  icon: React.ComponentType<{ className?: string }>;
  rows?: number;
}

