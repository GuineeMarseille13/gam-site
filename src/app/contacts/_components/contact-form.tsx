"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, Phone } from "lucide-react";
import { useContactForm } from "../_hooks/useContactForm";
import { cleanFormData } from "../_utils/form.utils";
import { STYLE_CONFIG, ANIMATION_CONFIG, MESSAGES } from "../_config/contacts.config";
import FormField from "@/components/contacts/FormField";

interface ContactFormProps {
  onSubmit: () => void;
}

const ContactForm = memo(function ContactForm({ onSubmit }: ContactFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    scrollToFirstError,
  } = useContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      scrollToFirstError();
      return;
    }

    // Ici, vous pouvez envoyer le formulaire à votre API
    // Exemple: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(cleanFormData(formData)) })
    
    // Simulation d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    onSubmit();
  };

  const fieldDelays = {
    firstName: 0.5,
    lastName: 0.5,
    email: 0.55,
    phone: 0.55,
    subject: 0.6,
    message: 0.65,
  };

  return (
    <motion.div
      {...ANIMATION_CONFIG.form.container}
      className={STYLE_CONFIG.form.wrapper}
    >
      <form
        onSubmit={handleSubmit}
        className={STYLE_CONFIG.form.container}
      >
        <motion.div
          {...ANIMATION_CONFIG.form.header}
          className={STYLE_CONFIG.form.header}
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {MESSAGES.form.title}
          </h2>
          <div className={STYLE_CONFIG.form.badge}>
            <Mail className="w-4 h-4" />
            <span className="text-sm font-semibold">{MESSAGES.form.badge}</span>
          </div>
        </motion.div>

        {/* Nom et Prénom */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: fieldDelays.firstName }}
          className={STYLE_CONFIG.form.fieldGrid}
        >
          <FormField
            name="firstName"
            label="Prénom"
            type="text"
            placeholder="Votre prénom"
            value={formData.firstName}
            error={errors.firstName}
            icon={User}
            onChange={(value) => handleChange("firstName", value)}
            onBlur={() => handleBlur("firstName")}
            required
            delay={0}
          />
          <FormField
            name="lastName"
            label="Nom"
            type="text"
            placeholder="Votre nom"
            value={formData.lastName}
            error={errors.lastName}
            icon={User}
            onChange={(value) => handleChange("lastName", value)}
            onBlur={() => handleBlur("lastName")}
            required
            delay={0}
          />
        </motion.div>

        {/* Email et Téléphone */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: fieldDelays.email }}
          className={STYLE_CONFIG.form.fieldGrid}
        >
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="votre.email@exemple.com"
            value={formData.email}
            error={errors.email}
            icon={Mail}
            onChange={(value) => handleChange("email", value)}
            onBlur={() => handleBlur("email")}
            required
            inputMode="email"
            delay={0}
          />
          <FormField
            name="phone"
            label="Téléphone (optionnel)"
            type="tel"
            placeholder="06 12 34 56 78"
            value={formData.phone}
            error={errors.phone}
            icon={Phone}
            onChange={(value) => handleChange("phone", value)}
            onBlur={() => handleBlur("phone")}
            inputMode="tel"
            delay={0}
          />
        </motion.div>

        {/* Sujet */}
        <FormField
          name="subject"
          label="Sujet"
          type="text"
          placeholder="Sujet de votre message"
          value={formData.subject}
          error={errors.subject}
          icon={MessageSquare}
          onChange={(value) => handleChange("subject", value)}
          onBlur={() => handleBlur("subject")}
          required
          delay={fieldDelays.subject}
        />

        {/* Message */}
        <FormField
          name="message"
          label="Message"
          type="textarea"
          placeholder="Votre message..."
          value={formData.message}
          error={errors.message}
          icon={MessageSquare}
          onChange={(value) => handleChange("message", value)}
          onBlur={() => handleBlur("message")}
          required
          rows={6}
          delay={fieldDelays.message}
        />

        {/* Bouton d'envoi */}
        <motion.div
          {...ANIMATION_CONFIG.form.submit}
          className="flex justify-center pt-2"
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={!isSubmitting ? ANIMATION_CONFIG.form.button.whileHover : {}}
            whileTap={!isSubmitting ? ANIMATION_CONFIG.form.button.whileTap : {}}
            className={`${STYLE_CONFIG.form.submitButton} ${
              isSubmitting ? STYLE_CONFIG.form.submitButtonDisabled : ""
            }`}
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? MESSAGES.form.submitting : MESSAGES.form.submit}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
});

export default ContactForm;
