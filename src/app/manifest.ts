import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Raasta — One Clear Next Step Through Government Services",
    short_name: "Raasta",
    description: "Citizen recovery layer for public services — PM-KISAN, DBT, and welfare entitlement tracking.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfbf7",
    theme_color: "#1c1917",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
