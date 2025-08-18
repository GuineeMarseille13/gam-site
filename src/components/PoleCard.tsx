import { cn } from "@/lib/utils";
import Image from "next/image";

interface PoleCardProps {
  image: string;
  title: string;
  className?: string;
}

export const PoleCard = ({ image, title, className }: PoleCardProps) => {
  return (
    <div
      className={cn(
        "w-[250px] h-[350px] overflow-hidden rounded-tr-2xl rounded-bl-2xl",
        "bg-gradient-to-br from-white to-gray-50",
        "hover:translate-y-[-4px] hover:shadow-lg",
        "shadow-2xl shadow-black/20 border-5 border-black-500/20 transition-all duration-300 ease-out",
        className
      )}
    >
      <Image
        src={image}
        alt={title}
        width={100}
        height={100}
        className="h-[85%] w-full object-cover flex items-center justify-center border-3 border-white rounded-tr-2xl"
      />
      <div className="flex items-center justify-center h-[15%] font-bold">
        {title}
      </div>
    </div>
  );
};
