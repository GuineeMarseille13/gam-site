"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Users, CheckCircle2, Trash2 } from "lucide-react";
import { z } from "zod";
import { adhesionPayloadSchema, PRICE_PER_MEMBER_EUR, type Member } from "../_schemas/adhesion.schema";

export default function AdhesionView() {
  const [members, setMembers] = useState<Member[]>([
    { firstName: "", lastName: "", email: "", phone: "" },
  ]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const total = useMemo(() => members.length * PRICE_PER_MEMBER_EUR, [members.length]);

  const frenchPhoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{2}){4}$/;

  function isValidFrenchPhone(phone: string): boolean {
    const cleaned = phone.replace(/\s/g, "");
    return frenchPhoneRegex.test(cleaned);
  }

  function isValidEmail(email: string): boolean {
    if (!email || email.trim() === "") return true;
    return z.string().email().safeParse(email).success;
  }

  const canAddRow = useMemo(() => {
    const last = members[members.length - 1];
    if (!last) return false;
    const phoneCleaned = last.phone.replace(/\s/g, "");
    return (
      last.firstName.trim() &&
      last.lastName.trim() &&
      isValidFrenchPhone(phoneCleaned) &&
      isValidEmail(last.email || "")
    );
  }, [members]);

  const addRow = () => {
    if (canAddRow) {
      setMembers((prev) => [...prev, { firstName: "", lastName: "", email: "", phone: "" }]);
    }
  };
  const removeRow = (idx: number) => setMembers((prev) => prev.filter((_, i) => i !== idx));

  const updateField = (idx: number, field: keyof Member, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = adhesionPayloadSchema.safeParse({ members, message });
    if (!parsed.success) {
      const errors = parsed.error.flatten();
      const memberErrors = errors.fieldErrors.members;
      if (memberErrors && Array.isArray(memberErrors)) {
        const firstMemberError = memberErrors[0];
        if (firstMemberError && typeof firstMemberError === "object") {
          const fieldErrors = Object.values(firstMemberError).flat();
          alert(fieldErrors[0] || "Veuillez vérifier le formulaire.");
        } else {
          alert(firstMemberError || "Veuillez vérifier le formulaire.");
        }
      } else {
        alert("Veuillez vérifier le formulaire.");
      }
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-bold">Merci pour votre adhésion !</h2>
        <p className="mt-2 text-gray-600">Nous vous recontacterons rapidement. Total réglé: {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(total)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hero */}
      <div className="text-center mb-6 sm:mb-10">
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent">
          Adhérer à l'association
        </motion.h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
          Votre adhésion soutient nos actions, renforce notre impact et finance nos projets. Elle nous aide à organiser des évènements, à équiper nos équipes et à développer des initiatives concrètes au service de notre communauté.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-10">
        {[{
          title: "Impact direct",
          desc: "Chaque adhésion finance nos actions locales et solidaires.",
        },{
          title: "Voix et participation",
          desc: "Participez aux décisions, proposez des idées, rejoignez nos équipes.",
        },{
          title: "Transparence",
          desc: "Suivi clair de l'utilisation des fonds et des projets menés.",
        }].map((b, i) => (
          <motion.div key={b.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-100 text-amber-700 shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">{b.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{b.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }} className="rounded-3xl p-[1px] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-md space-y-4 sm:space-y-6">
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} viewport={{ once: true }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-base sm:text-lg font-semibold">Formulaire d'adhésion</h2>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-700">
            <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-gray-100 border border-gray-200">{members.length} personne{members.length>1?'s':''}</span>
            <span className="hidden sm:inline">·</span>
            <span className="font-semibold">{new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(total)}</span>
          </div>
        </motion.div>

        <div className="space-y-3 sm:space-y-3">
          {members.map((m, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-3 sm:items-center rounded-xl border border-gray-200 p-3 sm:p-3">
              <input className="w-full sm:col-span-3 rounded-md border px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300" placeholder="Prénom *" value={m.firstName} onChange={(e)=>updateField(idx,'firstName',e.target.value)} required />
              <input className="w-full sm:col-span-3 rounded-md border px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300" placeholder="Nom *" value={m.lastName} onChange={(e)=>updateField(idx,'lastName',e.target.value)} required />
              <input className="w-full sm:col-span-3 rounded-md border px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300" placeholder="Téléphone *" value={m.phone||""} onChange={(e)=>updateField(idx,'phone',e.target.value)} required inputMode="tel" />
              <div className="sm:col-span-2 flex items-center gap-2">
                <input className="flex-1 rounded-md border px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300" placeholder="Email (optionnel)" value={m.email||""} onChange={(e)=>updateField(idx,'email',e.target.value)} type="email" inputMode="email" />
              </div>
              <div className="sm:col-span-1 flex items-center justify-end sm:justify-end">
                {members.length>1 && (
                  <button type="button" onClick={()=>removeRow(idx)} aria-label="Retirer" title="Retirer" className="p-2 rounded-md border text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} viewport={{ once: true }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <button type="button" onClick={addRow} disabled={!canAddRow} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 sm:py-2 bg-gray-900 text-white shadow hover:opacity-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
            <Plus className="w-4 h-4" /> Ajouter une personne
          </button>
          <div className="text-center sm:text-right">
            <div className="text-xs sm:text-sm text-gray-600">{members.length} x {PRICE_PER_MEMBER_EUR.toFixed(0)} €</div>
            <div className="text-base sm:text-lg font-semibold">Total: {new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(total)}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} viewport={{ once: true }}>
          <label className="text-sm font-medium">Message (optionnel)</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300" rows={3} value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Un mot pour l'équipe..." />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} viewport={{ once: true }} className="flex justify-center">
          <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white font-semibold shadow-lg hover:shadow-xl hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 active:scale-95 ring-1 ring-white/10 cursor-pointer text-sm sm:text-base transition-all duration-200">
            <Users className="w-4 h-4" /> {members.length > 1 ? "Valider les adhésions" : "Valider l'adhésion"}
          </button>
        </motion.div>
      </form>
      </motion.div>
    </div>
  );
}


