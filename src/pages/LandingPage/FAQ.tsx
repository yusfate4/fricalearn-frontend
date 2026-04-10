import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Is FricaLearn only for children in the diaspora?",
      answer: "No! While we specialize in helping children in the diaspora reconnect with their roots, our platform is perfect for any child (at home or abroad) who wants to master Yoruba, Igbo, or Hausa through modern, engaging methods."
    },
    {
      question: "How do the 1-on-1 sessions with tutors work?",
      answer: "Once enrolled, you can schedule live video sessions with our vetted native tutors. These sessions are personalized to your child's learning pace, focusing on conversation, grammar, and cultural etiquette."
    },
    {
      question: "How do you ensure the quality and safety of your tutors?",
      answer: "Our 'Gold Standard' vetting involves four rigorous steps: 1) Identity & Background Verification, 2) Native Proficiency & Cultural Depth Assessment, 3) Pedagogical Training for child-centered teaching, and 4) A monitored probation period. We only accept the top 5% of applicants to ensure your child’s safety and academic success."
    },
    {
      question: "What role does the Olukọ AI play in learning?",
      answer: "Olukọ AI is a 24/7 practice companion. Between live lessons, your child can chat with Olukọ to reinforce what they've learned. It’s a safe, monitored environment that strictly focuses on language and culture."
    },
    {
      question: "Are the live classes recorded or monitored?",
      answer: "Yes. For safety and quality assurance, all live sessions are recorded and subject to periodic reviews by our academic supervisors. This ensures that our high standards of child safety and teaching quality are consistently met."
    },
    {
      question: "Can my child earn rewards for learning?",
      answer: "Yes! FricaLearn is gamified. Students earn points for completing lessons and quizzes, which they can eventually use to unlock items in our Rewards Catalog, making the journey as fun as it is educational."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50" id="faq">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-indigo-900 font-bold uppercase tracking-widest text-sm mb-4">
            Got Questions?
          </h2>
          <h3 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Frequently Asked <span className="text-green-600">Questions</span>
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
                openIndex === index ? 'border-indigo-200 shadow-md' : 'border-gray-100'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`text-lg font-bold transition-colors ${
                  openIndex === index ? 'text-indigo-900' : 'text-gray-800'
                }`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-full transition-all ${
                  openIndex === index ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'
                }`}>
                  {openIndex === index ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                </div>
              </button>
              
              <div 
                className={`px-6 pb-6 text-gray-600 leading-relaxed transition-all ${
                  openIndex === index ? 'block' : 'hidden'
                }`}
              >
                <div className="pt-2 border-t border-gray-50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 italic">
            Don't see your question? <a href="#contact" className="text-indigo-900 font-bold underline hover:text-green-600 transition">Contact our support team.</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;