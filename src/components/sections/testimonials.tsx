"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Client Feedback</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {portfolioData.testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border rounded-xl p-8 shadow-sm relative"
              >
                <Quote className="h-8 w-8 text-muted-foreground/20 absolute top-6 left-6" />
                <div className="space-y-4 pt-4 relative z-10">
                  <p className="text-lg text-muted-foreground italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
