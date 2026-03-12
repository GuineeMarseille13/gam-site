"use client";

import { useEffect, useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";
import { type Member } from "../_schemas/adhesion.schema";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface StripePaymentFormProps {
  clientSecret: string;
  members: Member[];
  message: string;
  total: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function PaymentForm({
  clientSecret,
  members,
  message,
  total,
  onSuccess,
  onCancel,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined')
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Une erreur est survenue");
        setIsProcessing(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        // Vérifier si c'est une annulation
        if (confirmError.type === 'card_error' && confirmError.code === 'card_declined') {
          // Carte refusée, afficher l'erreur
          setError(confirmError.message || "Votre carte a été refusée. Veuillez réessayer avec une autre carte.");
        } else if (confirmError.type === 'validation_error') {
          // Erreur de validation
          setError(confirmError.message || "Veuillez vérifier les informations de votre carte.");
        } else {
          // Autre erreur
          setError(confirmError.message || "Le paiement a échoué. Veuillez réessayer.");
        }
        setIsProcessing(false);
      } else {
        setSucceeded(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 5000);
      }
    } catch (err) {
      console.error("Erreur lors du paiement:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-6 sm:py-8"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 mb-3 sm:mb-4">
          <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
          Paiement réussi !
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Redirection en cours...
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
          <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Paiement par carte bancaire</span>
        </div>
        <div className="rounded-xl border-2 border-gray-200/80 bg-white/50 p-3 sm:p-4 md:p-6 shadow-sm">
          <PaymentElement
            options={{
              layout: "tabs",
              fields: {
                billingDetails: {
                  name: "auto",
                  email: "auto",
                  phone: "auto",
                  address: {
                    country: "auto",
                    line1: "auto",
                    city: "auto",
                    postalCode: "auto",
                    state: "auto",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-50 border-2 border-red-200 p-3 sm:p-4 text-red-700 text-xs sm:text-sm space-y-2"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              if (onCancel) {
                onCancel();
              }
            }}
            className="text-xs underline hover:text-red-800 font-medium"
          >
            Annuler et retourner
          </button>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={!stripe || isProcessing}
          whileHover={!isProcessing && stripe ? { scale: 1.02 } : {}}
          whileTap={!isProcessing && stripe ? { scale: 0.98 } : {}}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white font-bold text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 ring-1 ring-white/10 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-lime-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative z-10 inline-flex items-center gap-2 sm:gap-3">
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> 
                <span className="text-xs sm:text-sm md:text-base">Traitement du paiement...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> 
                <span className="text-xs sm:text-sm md:text-base">Payer {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(total)}</span>
              </>
            )}
          </span>
        </motion.button>
        <motion.button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              window.location.href = "/cancel";
            }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
        >
          Annuler
        </motion.button>
      </div>
    </form>
  );
}

export default function StripePaymentForm({
  clientSecret,
  members,
  message,
  total,
  onSuccess,
  onCancel,
}: StripePaymentFormProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#f59e0b",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        colorTextSecondary: "#6b7280",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "12px",
      },
      rules: {
        ".Input": {
          border: "2px solid #e5e7eb",
          borderRadius: "8px",
          padding: "12px",
          backgroundColor: "#ffffff",
          fontSize: "16px", // Évite le zoom sur iOS
        },
        ".Input:focus": {
          border: "2px solid #f59e0b",
          boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
        },
        ".Input--invalid": {
          border: "2px solid #ef4444",
        },
        ".Label": {
          fontWeight: "600",
          color: "#1f2937",
          marginBottom: "6px",
          fontSize: "14px",
        },
        ".AccordionItem": {
          border: "none",
          borderRadius: "8px",
        },
        ".AccordionItem--selected": {
          border: "2px solid #f59e0b",
        },
        ".Tab": {
          padding: "8px 12px",
          fontSize: "14px",
        },
      },
    },
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <PaymentForm
        clientSecret={clientSecret}
        members={members}
        message={message}
        total={total}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}

