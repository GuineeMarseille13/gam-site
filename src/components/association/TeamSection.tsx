"use client";

import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Users } from "lucide-react";
import { teamMembers } from "@/data/association";
import { useTeamData } from "@/hooks/use-association";
import { TeamMember } from "@/types/association";

// Configuration des animations
const ANIMATION_CONFIG = {
  delays: {
    title: 0.1,
    president: 0.2,
    vicePresidents: 0.3,
    others: 0.4,
  },
  duration: 0.6,
} as const;

// Configuration des variantes de cartes
const CARD_VARIANTS = {
  president: {
    photoSize: "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32",
    photoTop: "-top-12 sm:-top-14 md:-top-16",
    paddingTop: "pt-20 sm:pt-24 md:pt-28",
    padding: "p-6 sm:p-8",
    rounded: "rounded-2xl sm:rounded-3xl",
    shadow: "shadow-xl group-hover:shadow-2xl",
    nameSize: "text-xl sm:text-2xl md:text-3xl",
    roleSize: "text-sm sm:text-base md:text-lg",
    ringSize: "ring-4",
    marginTop: "mt-4",
    nameMargin: "mb-2",
    imageSizes: "(max-width: 640px) 100px, (max-width: 768px) 120px, 140px",
  },
  vicePresident: {
    photoSize: "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28",
    photoTop: "-top-10 sm:-top-12 md:-top-14",
    paddingTop: "pt-16 sm:pt-20 md:pt-24",
    padding: "p-5 sm:p-6",
    rounded: "rounded-2xl",
    shadow: "shadow-lg group-hover:shadow-xl",
    nameSize: "text-lg sm:text-xl md:text-2xl",
    roleSize: "text-sm sm:text-base",
    ringSize: "ring-4",
    marginTop: "mt-2",
    nameMargin: "mb-1.5",
    imageSizes: "(max-width: 640px) 80px, (max-width: 768px) 100px, 120px",
  },
  other: {
    photoSize: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
    photoTop: "-top-8 sm:-top-10 md:-top-12",
    paddingTop: "pt-14 sm:pt-16 md:pt-18",
    padding: "p-4 sm:p-5",
    rounded: "rounded-xl sm:rounded-2xl",
    shadow: "shadow-md group-hover:shadow-lg",
    nameSize: "text-base sm:text-lg md:text-xl",
    roleSize: "text-xs sm:text-sm",
    ringSize: "ring-3",
    marginTop: "mt-1",
    nameMargin: "mb-1",
    imageSizes: "(max-width: 640px) 65px, (max-width: 768px) 80px, 100px",
  },
} as const;

// Classes CSS communes
const COMMON_STYLES = {
  card: "relative bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white",
  photoContainer: "absolute left-1/2 -translate-x-1/2 z-10 rounded-full overflow-hidden bg-white",
  photo: "object-cover transition-transform duration-700 ease-out group-hover:scale-110",
  content: "text-center",
} as const;

export default function TeamSection() {
  const { data: teamData, isLoading, error } = useTeamData();
  const members = teamData || teamMembers;

  // Grouper les membres par rôle
  const president = members.find((m) => m.order === 1);
  const vicePresidents = members.filter((m) => m.order >= 2 && m.order <= 3);
  const others = members.filter((m) => m.order > 3);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    console.warn("Error loading team data, using fallback:", error);
  }

  return (
    <div className="w-full py-8 sm:py-12 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle />

        {president && (
          <div className="flex justify-center mb-12 sm:mb-16 md:mb-20">
            <MemberCard member={president} variant="president" index={0} />
          </div>
        )}

        {vicePresidents.length > 0 && (
          <div className="mb-12 sm:mb-16 md:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-4xl mx-auto">
              {vicePresidents.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  variant="vicePresident"
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {others.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                variant="other"
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Titre de section
function SectionTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_CONFIG.delays.title, duration: ANIMATION_CONFIG.duration }}
      className="text-center mb-12 sm:mb-16 md:mb-20"
    >
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-10 sm:h-12 md:h-14 w-1 bg-gradient-to-b from-green-600 via-green-500 to-green-400 rounded-full" />
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-xl">
          <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        </div>
        <div className="h-10 sm:h-12 md:h-14 w-1 bg-gradient-to-b from-green-600 via-green-500 to-green-400 rounded-full" />
      </div>

      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4">
        <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
          Notre Équipe
        </span>
      </h2>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: ANIMATION_CONFIG.delays.title + 0.2, duration: ANIMATION_CONFIG.duration }}
        className="h-1.5 w-32 sm:w-40 mx-auto bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: ANIMATION_CONFIG.delays.title + 0.3, duration: ANIMATION_CONFIG.duration }}
        className="mt-6 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto"
      >
        Découvrez les membres dévoués qui font vivre notre association
      </motion.p>
    </motion.div>
  );
}

// Composant générique pour les cartes de membres
interface MemberCardProps {
  member: TeamMember;
  variant: keyof typeof CARD_VARIANTS;
  index: number;
}

function MemberCard({ member, variant, index }: MemberCardProps) {
  const config = CARD_VARIANTS[variant];
  const delay = ANIMATION_CONFIG.delays[variant === "president" ? "president" : variant === "vicePresident" ? "vicePresidents" : "others"];
  const cardDelay = delay + (variant === "president" ? 0 : variant === "vicePresident" ? 0.1 + index * 0.15 : 0.1 + index * 0.1);
  const contentDelay = delay + (variant === "president" ? 0.2 : variant === "vicePresident" ? 0.2 + index * 0.15 : 0.2 + index * 0.1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: cardDelay, duration: ANIMATION_CONFIG.duration }}
      className="relative group"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: contentDelay, duration: ANIMATION_CONFIG.duration }}
        className={`${COMMON_STYLES.card} ${config.rounded} ${config.padding} ${config.paddingTop} ${config.shadow} transition-all duration-500`}
      >
        {/* Photo circulaire superposée */}
        <div className={`${COMMON_STYLES.photoContainer} ${config.photoTop} ${config.photoSize} ${config.ringSize} ring-green-800 ${config.shadow.replace("group-hover:", "")}`}>
          <ImageWithFallback
            src={member.image}
            alt={member.name}
            fill
            className={COMMON_STYLES.photo}
            sizes={config.imageSizes}
            priority={variant === "president"}
          />
        </div>

        {/* Nom et rôle */}
        <div className={`${COMMON_STYLES.content} ${config.marginTop}`}>
          <h3 className={`${config.nameSize} font-bold text-white ${config.nameMargin} ${variant === "other" ? "line-clamp-2" : ""}`}>
            {member.name}
          </h3>
          <p className={`${config.roleSize} text-green-100 font-medium ${variant === "other" ? "line-clamp-2" : ""}`}>
            {member.role}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// État de chargement optimisé
function LoadingState() {
  const SkeletonCard = ({ variant }: { variant: keyof typeof CARD_VARIANTS }) => {
    const config = CARD_VARIANTS[variant];
    const spaceY = variant === "president" ? "space-y-3" : "space-y-2";
    const nameHeight = variant === "president" ? "h-6" : variant === "vicePresident" ? "h-5" : "h-4";
    const nameWidth = variant === "president" ? "w-40" : variant === "vicePresident" ? "w-36" : "w-32";
    const roleHeight = variant === "president" ? "h-5" : variant === "vicePresident" ? "h-4" : "h-3";
    const roleWidth = variant === "president" ? "w-32" : variant === "vicePresident" ? "w-28" : "w-24";

    return (
      <div className={`${COMMON_STYLES.card} ${config.rounded} ${config.padding} ${config.paddingTop} ${config.shadow.replace("group-hover:", "")}`}>
        <div className={`${COMMON_STYLES.photoContainer} ${config.photoTop} ${config.photoSize} ${config.ringSize} ring-green-800 bg-gray-300 animate-pulse`} />
        <div className={`${COMMON_STYLES.content} ${config.marginTop} ${spaceY}`}>
          <div className={`${nameHeight} ${nameWidth} bg-green-700 rounded animate-pulse mx-auto`} />
          <div className={`${roleHeight} ${roleWidth} bg-green-700 rounded animate-pulse mx-auto`} />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-8 sm:py-12 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Skeleton titre */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="h-12 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mx-auto mb-6" />
          <div className="h-1 w-32 bg-gray-200 rounded-full animate-pulse mx-auto" />
        </div>

        {/* Skeleton président */}
        <div className="flex justify-center mb-12 sm:mb-16 md:mb-20">
          <div className="w-full max-w-xs sm:max-w-sm">
            <SkeletonCard variant="president" />
          </div>
        </div>

        {/* Skeleton vice-présidents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12">
          <SkeletonCard variant="vicePresident" />
          <SkeletonCard variant="vicePresident" />
        </div>

        {/* Skeleton autres membres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <SkeletonCard variant="other" />
          <SkeletonCard variant="other" />
          <SkeletonCard variant="other" />
          <SkeletonCard variant="other" />
        </div>
      </div>
    </div>
  );
}
