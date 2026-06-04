import { useEffect, useRef } from "react";



export const COLOR_PALETTE = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#ffffff", border: true },
  { name: "Grey", hex: "#6b7280" },
  { name: "Light Grey", hex: "#d1d5db" },
  { name: "Charcoal", hex: "#36454f" },

  { name: "Red", hex: "#dc2626" },
  { name: "Wine Red", hex: "#7f1d1d" },
  { name: "Maroon", hex: "#800000" },
  { name: "Crimson", hex: "#b91c1c" },

  { name: "Blue", hex: "#2563eb" },
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Sky Blue", hex: "#38bdf8" },
  { name: "Royal Blue", hex: "#4169e1" },
  { name: "Teal", hex: "#0f766e" },

  { name: "Green", hex: "#16a34a" },
  { name: "Olive", hex: "#556b2f" },
  { name: "Mint", hex: "#98ff98" },
  { name: "Emerald", hex: "#10b981" },

  { name: "Yellow", hex: "#facc15" },
  { name: "Mustard", hex: "#d4a017" },
  { name: "Gold", hex: "#f59e0b" },

  { name: "Orange", hex: "#f97316" },
  { name: "Burnt Orange", hex: "#cc5500" },
  { name: "Peach", hex: "#ffb07c" },

  { name: "Pink", hex: "#ec4899" },
  { name: "Hot Pink", hex: "#ff69b4" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Lavender", hex: "#c4b5fd" },

  { name: "Purple", hex: "#7c3aed" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Lilac", hex: "#c8a2c8" },

  { name: "Brown", hex: "#78350f" },
  { name: "Coffee", hex: "#6f4e37" },
  { name: "Chocolate", hex: "#5c4033" },
  { name: "Tan", hex: "#d2b48c" },
  { name: "Beige", hex: "#f5f5dc" },

  { name: "Cream", hex: "#fffdd0" },
  { name: "Ivory", hex: "#fffff0" },
  { name: "Khaki", hex: "#c3b091" },

  { name: "Silver", hex: "#c0c0c0" },

  { name: "Cyan", hex: "#06b6d4" },
  { name: "Turquoise", hex: "#40e0d0" },

  { name: "Magenta", hex: "#ff00ff" },

  { name: "Multi", hex: "linear-gradient(45deg, red, blue, green)" },
];
// ];will put color picker in admin side so admin can send color in object wiht name and avlue
// have to bring this from bakend accorfing to the gender.it would be avg or whole new difernt  palatles.i mean from whole table we'll first take out gender based then gonna find colors wchih are available in remaingin table data and then gonnna remove copies

export const ALSO_LIKED = [
  {
    name: "Polo Neck Sweater",
    price: "$45",
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=300&q=80&fit=crop&crop=top",
  },
  {
    name: "Chinos Slim Fit",
    price: "$55",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&q=80&fit=crop&crop=top",
  },
  {
    name: "Cargo Jogger Pants",
    price: "$60",
    img: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=300&q=80&fit=crop&crop=top",
  },
  {
    name: "Marble Print Jacket",
    price: "$75",
    img: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&q=80&fit=crop&crop=top",
  },
  {
    name: "Classic White Tee",
    price: "$30",
    img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&q=80&fit=crop&crop=top",
  },
  {
    name: "Camo Print Jacket",
    price: "$90",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80&fit=crop&crop=top",
  },
];

export const HERO_SUBS = {
  men: "Crafted for the modern man — bold, refined, effortless.",
  women: "Elegance that moves with you — free, fierce, timeless.",
  kid: "Playful styles for little ones — bright, comfy, durable.",
};

export const ITEMS_PER_PAGE = 9;

/* ─── Category banner pools (random on each mount) ─── */
const CROP = "w=1400&h=520&fit=crop&crop=center&q=85";

export const CATEGORY_BANNERS = {
  men: [
    `https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?${CROP}`, // men's suits hanging on rack
    `https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?${CROP}`, // folded men's jackets
    `https://images.unsplash.com/photo-1507679799987-c73779587ccf?${CROP}`, // men's dress shirts flat lay
    `https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?${CROP}`, // men's clothing store rack
    `https://images.unsplash.com/photo-1558769132-cb1aea458c5e?${CROP}`, // men's wardrobe flat lay
  ],
  women: [
    `https://images.unsplash.com/photo-1558171813-3b392e917d84?${CROP}`, // women's dresses on hangers
    `https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?${CROP}`, // women's clothing rack
    `https://images.unsplash.com/photo-1512436991641-6745cdb1723f?${CROP}`, // women's fashion flat lay
    `https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?${CROP}`, // women's clothes folded
    `https://images.unsplash.com/photo-1539109136881-3be0616acf4b?${CROP}`, // women's boutique rack
  ],
  kids: [
    `https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?${CROP}`,
    `https://unsplash.com/photos/a-pair-of-overalls-hanging-on-a-clothes-rack-aInjxJUHWkA${CROP}`,
    `https://unsplash.com/photos/boy-seating-on-rock-fragments-OPTW9ruQPyc${CROP}`,
    `https://unsplash.com/photos/boy-walking-on-snow-l_SeBO-53dY${CROP}`,
    `https://images.unsplash.com/photo-1543854704-2b1b011701e6?${CROP}`,
  ],
};

/** Returns a random banner URL for the given category */
export function getRandomBanner(category) {
  // const pool = CATEGORY_BANNERS[category] ?? CATEGORY_BANNERS["men"];
  const pool = CATEGORY_BANNERS[category];
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ─── Shared hook ─── */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.07 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
