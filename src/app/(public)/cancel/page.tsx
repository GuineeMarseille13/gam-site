"use client";

import { motion } from "framer-motion";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-50 text-orange-600 shadow-lg shadow-orange-100 mb-6"
        >
          <XCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 via-red-500 to-red-600 bg-clip-text text-transparent mb-4"
        >
          Paiement annulé
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-xl mx-auto mb-8"
        >
          Votre paiement a été annulé. Aucun montant n&apos;a été débité de votre compte.
          Vous pouvez réessayer à tout moment en retournant sur la page précédente.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-gray-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105"
          >
            <CreditCard className="w-4 h-4" />
            Réessayer le paiement
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="mt-8 p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-left max-w-md mx-auto"
        >
          <p className="text-sm text-blue-900">
            <strong className="font-semibold">Besoin d&apos;aide ?</strong> Si vous avez rencontré un problème lors du paiement, n&apos;hésitez pas à{" "}
            <Link href="/contacts" className="underline hover:text-blue-700 font-medium">
              nous contacter
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}

