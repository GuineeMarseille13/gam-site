"use client";

import { useState } from "react";
import { STYLE_CONFIG } from "../_config/contacts.config";
import ContactsHero from "@/components/contacts/ContactsHero";
import ContactInfo from "./contact-info";
import ContactForm from "./contact-form";
import SuccessMessage from "@/components/contacts/SuccessMessage";

export default function ContactsView() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return <SuccessMessage />;
  }

  return (
    <div className={STYLE_CONFIG.container}>
      <ContactsHero />
      <ContactInfo />
      <ContactForm onSubmit={handleSubmit} />
    </div>
  );
}

