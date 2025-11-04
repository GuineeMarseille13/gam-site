"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, CheckCircle2, DollarSign, Target, Users, Sparkles } from "lucide-react";
import { z } from "zod";
import { donPayloadSchema, SUGGESTED_AMOUNTS, MIN_DON_AMOUNT_EUR, MAX_DON_AMOUNT_EUR, type Don } from "../_schemas/don.schema";

export default function DonView() {
  const [formData, setFormData] = useState<Partial<Don>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: undefined,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const frenchPhoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{2}){4}$/;

  function isValidFrenchPhone(phone: string): boolean {
    if (!phone || phone.trim() === "") return true;
    const cleaned = phone.replace(/\s/g, "");
    return frenchPhoneRegex.test(cleaned);
  }

  function isValidEmail(email: string): boolean {
    if (!email || email.trim() === "") return true;
    return z.string().email().safeParse(email).success;
  }

  function handleAmountSelect(amount: number) {
    setFormData((prev) => ({ ...prev, amount }));
    setCustomAmount("");
  }

  function handleCustomAmountChange(value: string) {
    setCustomAmount(value);
    const numValue = parseFloat(value.replace(",", "."));
    if (!isNaN(numValue) && numValue > 0) {
      setFormData((prev) => ({ ...prev, amount: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, amount: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.amount || formData.amount < MIN_DON_AMOUNT_EUR || formData.amount > MAX_DON_AMOUNT_EUR) {
      alert(`Le montant doit être entre ${MIN_DON_AMOUNT_EUR}€ et ${MAX_DON_AMOUNT_EUR}€`);
      return;
    }

    const payload = {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      amount: formData.amount,
      message: formData.message || "",
    };

    const parsed = donPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      const errors = parsed.error.flatten();
      const fieldErrors = Object.values(errors.fieldErrors).flat();
      alert(fieldErrors[0] || "Veuillez vérifier le formulaire.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100"
        >
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent"
        >
          Merci pour votre générosité !
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto"
        >
          Votre don de <span className="font-semibold text-emerald-600">{new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(formData.amount || 0)}</span> nous permet de poursuivre nos actions et de développer nos projets. 
          Votre soutien fait toute la différence.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mt-6 text-sm sm:text-base text-gray-500"
        >
          Nous vous recontacterons rapidement pour finaliser le paiement.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hero */}
      <div className="text-center mb-8 sm:mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent mb-3 sm:mb-4"
        >
          Faire un don
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto px-4"
        >
          Votre don est essentiel pour notre association. Il nous permet de financer nos projets, d'organiser nos événements et d'amplifier notre impact au service de notre communauté.
        </motion.p>
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-pink-300 to-transparent rounded-full"
        />
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12">
        {[
          {
            title: "Financement des projets",
            desc: "Vos dons permettent de financer directement nos initiatives et projets concrets.",
            icon: DollarSign,
          },
          {
            title: "Impact durable",
            desc: "Chaque don contribue à créer un impact positif et durable dans notre communauté.",
            icon: Target,
          },
          {
            title: "Développement des actions",
            desc: "Votre soutien nous permet d'organiser des événements et d'étendre nos activités.",
            icon: Sparkles,
          },
        ].map((b, i) => {
          const IconComponent = b.icon;
          return (
          <motion.div 
            key={b.title} 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.08, duration: 0.4 }} 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 text-pink-700 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1.5">{b.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Form */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.5 }} 
        className="rounded-3xl p-[2px] bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 shadow-xl shadow-pink-100/50"
      >
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200/50 bg-white/90 backdrop-blur-sm p-5 sm:p-8 shadow-inner space-y-5 sm:space-y-7">
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.35 }} 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-200/60"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Formulaire de don</h2>
            {formData.amount && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200/50">
                <span className="font-bold text-base sm:text-lg">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(formData.amount)}</span>
              </div>
            )}
          </motion.div>

          {/* Amount Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }} 
            className="space-y-4"
          >
            <label className="text-sm sm:text-base font-semibold text-gray-900">Montant du don *</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {SUGGESTED_AMOUNTS.map((amount) => (
                <motion.button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-3 rounded-xl border-2 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer ${
                    formData.amount === amount
                      ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white border-pink-500 shadow-lg shadow-pink-200/50 scale-105"
                      : "bg-white text-gray-700 border-gray-300 hover:border-pink-400 hover:bg-pink-50 hover:shadow-md"
                  }`}
                >
                  {amount} €
                </motion.button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <span className="text-sm font-medium text-gray-700">Montant personnalisé :</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="Montant en €"
                  className="flex-1 max-w-[220px] rounded-xl border-2 border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 hover:border-pink-300 transition-colors"
                  inputMode="decimal"
                />
                <span className="text-sm text-gray-500">€</span>
              </div>
            </div>
          </motion.div>

          {/* Personal Information */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.45 }} 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 hover:border-pink-300 transition-all duration-200 bg-white"
              placeholder="Prénom *"
              value={formData.firstName || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 hover:border-pink-300 transition-all duration-200 bg-white"
              placeholder="Nom *"
              value={formData.lastName || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 hover:border-pink-300 transition-all duration-200 bg-white"
              placeholder="Téléphone (optionnel)"
              value={formData.phone || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              inputMode="tel"
            />
            <input
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 hover:border-pink-300 transition-all duration-200 bg-white"
              placeholder="Email (optionnel)"
              value={formData.email || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              type="email"
              inputMode="email"
            />
          </motion.div>

          {/* Message */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.55 }} 
            className="space-y-2"
          >
            <label className="text-sm sm:text-base font-semibold text-gray-900">Message (optionnel)</label>
            <textarea
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 hover:border-pink-300 transition-all duration-200 bg-white resize-none"
              rows={4}
              value={formData.message || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Un mot pour l'équipe..."
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }} 
            className="flex justify-center pt-2"
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 ring-1 ring-white/10 cursor-pointer transition-all duration-300"
            >
              <Heart className="w-5 h-5" /> Faire un don
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

