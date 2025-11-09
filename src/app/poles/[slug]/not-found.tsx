import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Pôle non trouvé
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Le pôle que vous recherchez n&apos;existe pas ou a été déplacé.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour à l&apos;accueil</span>
        </Link>
      </div>
    </div>
  );
}

