import { GooeyText } from "./ui/gooey-text-morphing"
import { SocialIcon } from "./SocialIcon"
import { SOCIAL_PLATFORM_CONFIG, detectPlatform } from "@/lib/social-media-config"

export interface SocialMediaItem {
  id: string
  name: string
  url: string
  icon: string | null
}

interface GAMSloganProps {
  socialMedias?: SocialMediaItem[]
}

const GAMSlogan = ({ socialMedias = [] }: GAMSloganProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100/80 to-stone-100 backdrop-blur-sm text-gray-800 py-8 md:py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,120,120,0.03)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-6 md:mb-8">
          <GooeyText
            texts={["Ensemble", "Unis", "Solidaires", "Forts"]}
            morphTime={1.5}
            cooldownTime={1}
            className="h-[70px] flex items-center justify-center"
            textClassName="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent drop-shadow-lg"
          />
        </div>

        <p className="text-gray-600/90 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed mb-6 md:mb-8 w-full">
          Rejoignez notre communauté et participez à la construction d&apos;un avenir meilleur
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
