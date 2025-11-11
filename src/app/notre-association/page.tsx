"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PresidentSection from "@/components/association/PresidentSection";
import AboutUsSection from "@/components/association/AboutUsSection";
import ActivityReportsSection from "@/components/association/ActivityReportsSection";
import TeamSection from "@/components/association/TeamSection";

const DEFAULT_TAB = "president";
const VALID_TABS = ["president", "about", "reports", "team"];

function NotreAssociationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = searchParams.get("tab");
  
  // Valider et initialiser l'onglet depuis l'URL
  const initialTab = tabFromUrl && VALID_TABS.includes(tabFromUrl) 
    ? tabFromUrl 
    : DEFAULT_TAB;
  
  const [activeTab, setActiveTab] = useState(initialTab);

  // Mettre à jour l'URL quand l'onglet change
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === DEFAULT_TAB) {
      // Supprimer le paramètre si c'est l'onglet par défaut
      params.delete("tab");
    } else {
      params.set("tab", newTab);
    }
    router.push(`/notre-association?${params.toString()}`, { scroll: false });
  };

  // Synchroniser avec l'URL au chargement initial
  useEffect(() => {
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl]);

  const tabs = [
    { id: "president", label: "Le Président" },
    { id: "about", label: "Qui sommes-nous ?" },
    { id: "reports", label: "Rapport d'activité" },
    { id: "team", label: "Notre équipe" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent mb-4">
            Notre Association
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1.5 w-32 mx-auto bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"
          />
          <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Découvrez notre histoire, nos valeurs et les personnes qui font vivre l&apos;association
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 h-auto p-1.5 sm:p-2 bg-gray-100/80 backdrop-blur-sm">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="text-xs sm:text-sm md:text-base font-medium px-2 sm:px-4 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md transition-all duration-300 cursor-pointer"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="president" className="mt-8 sm:mt-12">
            <PresidentSection />
          </TabsContent>

          <TabsContent value="about" className="mt-8 sm:mt-12">
            <AboutUsSection />
          </TabsContent>

          <TabsContent value="reports" className="mt-8 sm:mt-12">
            <ActivityReportsSection />
          </TabsContent>

          <TabsContent value="team" className="mt-8 sm:mt-12">
            <TeamSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function NotreAssociationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    }>
      <NotreAssociationContent />
    </Suspense>
  );
}
