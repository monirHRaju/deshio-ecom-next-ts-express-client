import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Tech Enthusiast",
    location: "New York, USA",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
    rating: 5,
    text: "Deshio has completely changed how I shop for electronics. The prices are unbeatable, the delivery was faster than expected, and customer support was phenomenal. I've ordered 4 times already!",
    product: "Sony WH-1000XM5",
    verified: true,
  },
  {
    name: "James Kowalski",
    role: "Software Engineer",
    location: "Austin, TX",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=James&backgroundColor=c0aede",
    rating: 5,
    text: "I was skeptical at first, but after receiving my MacBook in perfect condition at 15% off retail — I'm a believer. The return policy gave me peace of mind and the product quality exceeded expectations.",
    product: "Apple MacBook Pro M3",
    verified: true,
  },
  {
    name: "Priya Sharma",
    role: "Content Creator",
    location: "London, UK",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc",
    rating: 5,
    text: "As a content creator, I need reliable equipment quickly. Deshio delivered my camera kit in 24 hours and even helped me compare models via chat. The experience was absolutely seamless!",
    product: "Canon EOS R6 II",
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge badge-primary badge-lg mb-4 px-4 py-3 font-semibold">
            Customer Reviews
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-base-content">
            What Our{" "}
            <span className="text-primary">Customers Say</span>
          </h2>
          <p className="text-base-content/60 mt-3 max-w-xl mx-auto">
            Real reviews from real customers. We're proud of the trust we've
            built with our community.
          </p>
          {/* Overall rating */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="font-black text-lg text-base-content">4.9</span>
            <span className="text-base-content/50 text-sm">
              from 12,000+ reviews
            </span>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="group relative bg-base-100 border border-base-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-primary fill-primary" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= t.rating
                        ? "fill-secondary text-secondary"
                        : "fill-base-300 text-base-300"
                    }`}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-base-content/70 text-sm leading-relaxed mb-5 line-clamp-4">
                "{t.text}"
              </p>

              {/* Product tag */}
              <div className="inline-flex items-center gap-1.5 bg-primary/5 text-primary rounded-full px-3 py-1 text-xs font-semibold mb-5 border border-primary/10">
                Purchased: {t.product}
              </div>

              {/* Divider */}
              <div className="divider my-0 before:bg-base-200 after:bg-base-200" />

              {/* Author */}
              <div className="flex items-center gap-3 mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full bg-base-200 border border-base-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-base-content text-sm">
                      {t.name}
                    </p>
                    {t.verified && (
                      <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-base-content/50 truncate">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
