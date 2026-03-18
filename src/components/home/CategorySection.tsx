import Link from "next/link";
import {
  Smartphone,
  Monitor,
  Headphones,
  Camera,
  Watch,
  Tv,
} from "lucide-react";

const categories = [
  {
    name: "Smartphones",
    slug: "smartphones",
    Icon: Smartphone,
    description: "Latest flagships",
    color: "from-sky-500/10 to-sky-600/5",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-600",
    borderColor: "hover:border-sky-300",
  },
  {
    name: "Laptops",
    slug: "laptops",
    Icon: Monitor,
    description: "Work & gaming",
    color: "from-indigo-500/10 to-indigo-600/5",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-600",
    borderColor: "hover:border-indigo-300",
  },
  {
    name: "Headphones",
    slug: "headphones",
    Icon: Headphones,
    description: "Premium audio",
    color: "from-orange-500/10 to-orange-600/5",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-600",
    borderColor: "hover:border-orange-300",
  },
  {
    name: "Cameras",
    slug: "cameras",
    Icon: Camera,
    description: "Capture moments",
    color: "from-emerald-500/10 to-emerald-600/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-600",
    borderColor: "hover:border-emerald-300",
  },
  {
    name: "Accessories",
    slug: "accessories",
    Icon: Watch,
    description: "Smart wearables",
    color: "from-violet-500/10 to-violet-600/5",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-600",
    borderColor: "hover:border-violet-300",
  },
  {
    name: "TVs & Displays",
    slug: "tvs",
    Icon: Tv,
    description: "Big screen life",
    color: "from-rose-500/10 to-rose-600/5",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-600",
    borderColor: "hover:border-rose-300",
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge badge-primary badge-lg mb-4 px-4 py-3 font-semibold">
            Browse Categories
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-base-content mb-3">
            Shop by{" "}
            <span className="text-primary">Category</span>
          </h2>
          <p className="text-base-content/60 max-w-xl mx-auto">
            Explore our wide range of product categories and find exactly what
            you're looking for.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group"
            >
              <div
                className={`
                  relative flex flex-col items-center gap-3 p-5 rounded-2xl
                  bg-gradient-to-br ${cat.color}
                  border border-base-200 ${cat.borderColor}
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-lg
                  cursor-pointer
                `}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl ${cat.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <cat.Icon className={`w-7 h-7 ${cat.iconColor}`} />
                </div>

                {/* Text */}
                <div className="text-center">
                  <p className="font-bold text-base-content text-sm">
                    {cat.name}
                  </p>
                  <p className="text-xs text-base-content/50 mt-0.5">
                    {cat.description}
                  </p>
                </div>

                {/* Arrow on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className={`w-5 h-5 rounded-full ${cat.iconBg} flex items-center justify-center`}>
                    <svg className={`w-3 h-3 ${cat.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="btn btn-ghost btn-sm border border-base-300 hover:border-primary hover:text-primary gap-2"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
