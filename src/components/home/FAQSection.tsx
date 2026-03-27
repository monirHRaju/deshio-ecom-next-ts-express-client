import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available at checkout. Free standard shipping on all orders over ৳50.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards (Visa, MasterCard, Amex), PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secured with 256-bit SSL encryption.",
  },
  {
    q: "Can I return a product if I'm not satisfied?",
    a: "Absolutely! We offer a 30-day hassle-free return policy. Simply initiate a return from your dashboard, ship the item back in its original packaging, and receive a full refund within 5-7 business days.",
  },
  {
    q: "Do products come with a warranty?",
    a: "Yes! All products sold on Deshio come with the manufacturer's official warranty. Most electronics include 1-2 years of coverage. Extended warranties are also available at checkout.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, you'll receive a tracking number via email. You can also track your order in real-time from your dashboard under 'My Orders'.",
  },
  {
    q: "Are the products on Deshio genuine?",
    a: "100% yes. We partner directly with authorized distributors and verified manufacturers. Every product is authentic and backed by official warranties.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-7 h-7 text-primary" />
            </div>
            <div className="badge badge-primary badge-lg mb-4 px-4 py-3 font-semibold">
              FAQ
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-base-content">
              Frequently Asked{" "}
              <span className="text-primary">Questions</span>
            </h2>
            <p className="text-base-content/60 mt-3">
              Everything you need to know about shopping with Deshio.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="collapse collapse-arrow bg-base-100 border border-base-200 rounded-2xl hover:border-primary/30 transition-colors group"
              >
                <summary className="collapse-title font-semibold text-base-content pr-12 cursor-pointer hover:text-primary transition-colors">
                  {faq.q}
                </summary>
                <div className="collapse-content">
                  <p className="text-base-content/70 text-sm leading-relaxed pt-0">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <p className="text-base-content/60 text-sm mb-3">
              Still have questions?
            </p>
            <a
              href="/contact"
              className="btn btn-outline btn-primary gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
