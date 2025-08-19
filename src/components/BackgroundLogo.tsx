"use client";

import Image from "next/image";

export default function BackgroundLogo() {
  return (
    <>
      {/* Logo principal au centre avec effet de parallaxe */}
      <div className="background-logo background-logo-parallax">
        <Image
          src="/images/gam-logo.png"
          alt="GAM Logo Background"
          width={1000}
          height={1000}
          className="block w-full h-auto"
          priority={true}
          quality={75}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
    </>
  );
}
