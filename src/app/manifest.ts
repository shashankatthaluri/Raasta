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
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
