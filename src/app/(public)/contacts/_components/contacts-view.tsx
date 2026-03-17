"use client";

import { useState } from "react";
import { STYLE_CONFIG } from "../_config/contacts.config";
import ContactsHero from "@/components/contacts/ContactsHero";
import ContactInfo from "./contact-info";
import ContactForm from "./contact-form";
import SuccessMessage from "@/components/contacts/SuccessMessage";
import { DbContact, DbSocialMedia } from "../_types/contacts.types";

interface ContactsViewProps {
  contact: DbContact | null;
  socialMedias: DbSocialMedia[];
}

export default function ContactsView({ contact, socialMedias }: ContactsViewProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <SuccessMessage />;
  }

  return (
    <div className={STYLE_CONFIG.container}>
      <ContactsHero />
      <ContactInfo contact={contact} socialMedias={socialMedias} />
      <ContactForm onSubmit={() => setSubmitted(true)} />
    </div>
  );
}

