"use client";

import { motion } from "motion/react";
import { FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { activityReports } from "@/data/association";
import Link from "next/link";

export default function ActivityReportsSection() {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Titre de section */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            RAPPORT D&apos;ACTIVITÉ
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-green-600 to-transparent rounded-full"
          />
          <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Consultez nos rapports d&apos;activité annuels pour découvrir nos réalisations et notre impact.
          </p>
        </div>

        {/* Liste des rapports */}
        <div className="space-y-4 sm:space-y-6">
          {activityReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <Link href={report.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500 cursor-pointer bg-gradient-to-r from-white to-gray-50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                            {report.title}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600">
                            Année {report.year}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 group-hover:bg-green-500 flex items-center justify-center transition-colors duration-300">
                          <Download className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {activityReports.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun rapport disponible pour le moment.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

