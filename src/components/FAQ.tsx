'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { emailAddress } from "@/data/constant";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the AI interview analysis work?",
      answer: "Our AI uses advanced natural language processing and machine learning algorithms to analyze verbal responses, communication patterns, and technical competency. It evaluates factors like problem-solving approach, clarity of explanation, and domain expertise while maintaining objectivity and reducing human bias."
    },
    {
      question: "Is the AI interview platform suitable for all types of roles?",
      answer: "Yes! Our platform is highly customizable and works for technical roles (engineering, data science), business roles (sales, marketing), creative positions, and leadership roles. You can create custom question sets and evaluation criteria tailored to any position."
    },
    {
      question: "How do you ensure the AI assessment is fair and unbiased?",
      answer: "We've trained our AI models on diverse datasets and continuously monitor for bias. The system focuses on job-relevant skills and competencies rather than personal characteristics. We also provide transparency reports showing how decisions are made and regular bias audits."
    },
    {
      question: "What kind of support do you provide during implementation?",
      answer: "We provide comprehensive onboarding including setup assistance, team training, best practices workshops, and dedicated customer success support. Enterprise customers get a dedicated account manager and customized training programs."
    },
    {
      question: "How quickly can we see results after implementation?",
      answer: "Most customers see immediate improvements in interview consistency and candidate experience. Measurable results like reduced time-to-hire and improved quality of hire typically become apparent within 30-60 days of implementation."
    }
  ];

  return (
    <section className="py-24 bg-[#FAF8F4] text-[#12151B] dark:bg-[#12151B] dark:text-white border-t border-[#12151B]/10 dark:border-white/10 transition-colors duration-200">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .faq-display { font-family: 'Space Grotesk', sans-serif; }
        .faq-body { font-family: 'IBM Plex Sans', sans-serif; }
        .faq-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto mb-16">
          <div className="faq-mono text-xs tracking-[0.18em] uppercase text-[#3E63DD] dark:text-[#8FA8FF] mb-4">
            FAQ
          </div>
          <h2 className="faq-display text-4xl md:text-5xl font-bold text-[#12151B] dark:text-white mb-6 leading-tight">
            Questions, answered
          </h2>
          <p className="faq-body text-lg text-[#6B7280] dark:text-white/60 leading-relaxed">
            Everything you need to know about the platform. Can&apos;t find what
            you&apos;re looking for?{" "}
            <a
              href={`mailto:${emailAddress}`}
              className="text-[#3E63DD] dark:text-[#8FA8FF] hover:underline"
            >
              Reach out to our support team.
            </a>
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-[#12151B]/10 dark:border-white/10 first:border-t"
              >
                <AccordionTrigger className="group text-left py-6 hover:no-underline [&>svg]:text-[#8A8F9C] dark:[&>svg]:text-white/40">
                  <span className="flex items-baseline gap-4">
                    <span className="faq-mono text-xs text-[#8A8F9C] dark:text-white/40 shrink-0 pt-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="faq-display text-lg font-semibold text-[#12151B] group-hover:text-[#3E63DD] dark:text-white dark:group-hover:text-[#8FA8FF] transition-colors">
                      {faq.question}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="faq-body text-[#6B7280] dark:text-white/60 pb-6 pl-9 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;