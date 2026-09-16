// components/landing/TestimonialsSection.tsx
// Displays user testimonials in a responsive grid, matching the Poste dark/light theme

import { Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Gola Verinyuy",
    role: "Fashion Creator",
    quote:
      "Poste helped me figure out exactly when my audience is online. My engagement went up within the first two weeks.",
    initials: "GV",
  },
  {
    name: "Mendez kerenyu",
    role: "Freelance Photographer",
    quote:
      "Scheduling used to eat my whole morning. Now I plan a week of posts in under 20 minutes.",
    initials: "MK",
  },
  {
    name: "Fatima Mbuh",
    role: "Small Business Owner",
    quote:
      "Being able to pay with mobile money made this the first tool like this I could actually use without hassle.",
    initials: "FM",
  },
];

// Displays user testimonials in a 3-column responsive grid with dark and light theme support.
export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Loved by creators and small businesses
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Real feedback from people growing their presence with Poste.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl"
          >
            <Quote className="h-6 w-6 text-indigo-600 mb-4" />
            <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
              &quot;{testimonial.quote}&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white dark:text-white text-sm font-semibold">
                {testimonial.initials}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {testimonial.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;