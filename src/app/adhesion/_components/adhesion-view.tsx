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
          Merci pour votre adhésion !
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto"
        >
          Nous vous recontacterons rapidement. Total réglé: <span className="font-semibold text-emerald-600">{new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(total)}</span>
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
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent mb-3 sm:mb-4"
        >
          Adhérer à l'association
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto px-4"
        >
          Votre adhésion soutient nos actions, renforce notre impact et finance nos projets. Elle nous aide à organiser des évènements, à équiper nos équipes et à développer des initiatives concrètes au service de notre communauté.
        </motion.p>
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full"
        />
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12">
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
          <motion.div 
            key={b.title} 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.08, duration: 0.4 }} 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <Users className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1.5">{b.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.5 }} 
        className="rounded-3xl p-[2px] bg-gradient-to-br from-amber-200 via-yellow-200 to-lime-200 shadow-xl shadow-amber-100/50"
      >
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200/50 bg-white/90 backdrop-blur-sm p-5 sm:p-8 shadow-inner space-y-5 sm:space-y-7">
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.35 }} 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-200/60"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Formulaire d'adhésion</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-200/50">
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-white/20 text-sm font-semibold">{members.length} personne{members.length>1?'s':''}</span>
              <span className="font-bold text-base sm:text-lg">{new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(total)}</span>
            </div>
          </motion.div>

        <div className="space-y-4">
          {members.map((m, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.05 }} 
              className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center rounded-xl border-2 border-gray-200/80 bg-white/50 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <input className="w-full sm:col-span-3 rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 hover:border-amber-300 transition-all duration-200 bg-white" placeholder="Prénom *" value={m.firstName} onChange={(e)=>updateField(idx,'firstName',e.target.value)} required />
              <input className="w-full sm:col-span-3 rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 hover:border-amber-300 transition-all duration-200 bg-white" placeholder="Nom *" value={m.lastName} onChange={(e)=>updateField(idx,'lastName',e.target.value)} required />
              <input className="w-full sm:col-span-3 rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 hover:border-amber-300 transition-all duration-200 bg-white" placeholder="Téléphone *" value={m.phone||""} onChange={(e)=>updateField(idx,'phone',e.target.value)} required inputMode="tel" />
              <input className="w-full sm:col-span-2 rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 hover:border-amber-300 transition-all duration-200 bg-white" placeholder="Email (optionnel)" value={m.email||""} onChange={(e)=>updateField(idx,'email',e.target.value)} type="email" inputMode="email" />
              <div className="sm:col-span-1 flex items-center justify-end">
                {members.length>1 && (
                  <motion.button 
                    type="button" 
                    onClick={()=>removeRow(idx)} 
                    aria-label="Retirer" 
                    title="Retirer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }} 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <motion.button 
            type="button" 
            onClick={addRow} 
            disabled={!canAddRow}
            whileHover={canAddRow ? { scale: 1.02 } : {}}
            whileTap={canAddRow ? { scale: 0.98 } : {}}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-gray-900 text-white shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold transition-all duration-200"
          >
            <Plus className="w-4 h-4" /> Ajouter une personne
          </motion.button>
          <div className="text-center sm:text-right space-y-1">
            <div className="text-xs sm:text-sm text-gray-600">{members.length} x {PRICE_PER_MEMBER_EUR.toFixed(0)} €</div>
            <div className="text-lg sm:text-xl font-bold text-gray-900">Total: {new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(total)}</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.55 }} 
          className="space-y-2"
        >
          <label className="text-sm sm:text-base font-semibold text-gray-900">Message (optionnel)</label>
          <textarea 
            className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 hover:border-amber-300 transition-all duration-200 bg-white resize-none" 
            rows={4} 
            value={message} 
            onChange={(e)=>setMessage(e.target.value)} 
            placeholder="Un mot pour l'équipe..." 
          />
        </motion.div>

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
            <Users className="w-5 h-5" /> {members.length > 1 ? "Valider les adhésions" : "Valider l'adhésion"}
          </motion.button>
        </motion.div>
      </form>
      </motion.div>
    </div>
  );
}


