import { GooeyText, GOOEY_TEXT_DEFAULTS } from "./ui/gooey-text-morphing"
import { SocialIcon } from "./SocialIcon"
import { SOCIAL_PLATFORM_CONFIG, detectPlatform } from "@/helpers/social-media-config"

export interface SocialMediaItem {
  id: string
  name: string
  url: string
  icon: string | null
}

interface GAMSloganProps {
  socialMedias?: SocialMediaItem[]
}

const SLOGAN_WORDS: string[] = ["Ensemble", "Unis", "Forts", "Solidaires"]

const GAMSlogan = ({ socialMedias = [] }: GAMSloganProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100/80 to-stone-100 backdrop-blur-sm text-gray-800 py-8 md:py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,120,120,0.03)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-6 md:mb-8">
          <GooeyText
            texts={SLOGAN_WORDS}
            morphTime={GOOEY_TEXT_DEFAULTS.morphTime}
            cooldownTime={GOOEY_TEXT_DEFAULTS.cooldownTime}
            className="flex min-h-[3rem] items-center justify-center md:min-h-[4.5rem] lg:min-h-[5rem]"
            textClassName="text-3xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent drop-shadow-lg md:text-5xl lg:text-6xl"
          />
        </div>

        <p className="mx-auto mb-6 w-full max-w-2xl text-lg font-medium leading-relaxed text-gray-600/90 md:mb-8 md:max-w-none md:whitespace-nowrap md:text-xl">
          Rejoignez notre association et participez à la construction d&apos;un avenir meilleur
        </p>

        {socialMedias.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-500 text-sm font-medium">Suivez-nous sur</p>
            <div className="flex items-center flex-wrap justify-center gap-4 md:gap-6">
              {socialMedias.map((sm) => {
                const platform = detectPlatform(sm.icon, sm.name)
                const cfg = platform ? SOCIAL_PLATFORM_CONFIG[platform] : null

                return (
                  <a
                    key={sm.id}
                    href={sm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={sm.name}
                    className={`group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/80 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 ${cfg?.hoverBg ?? "hover:bg-gray-50"}`}
                  >
                    <span className={`text-gray-600 transition-colors ${cfg?.hoverColor ?? "group-hover:text-gray-800"}`}>
                      <SocialIcon icon={sm.icon} name={sm.name} className="w-6 h-6" />
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GAMSlogan
