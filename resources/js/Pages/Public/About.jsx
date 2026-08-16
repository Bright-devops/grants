// resources/js/Pages/Public/About.jsx
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Globe2, Heart, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

export default function About() {
  return (
    <PublicLayout>
      <Head title="About" />

      {/* HERO */}
      <section className="relative min-h-[380px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1800&q=80"
          alt="A UCA program officer reviewing an application with an applicant"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/80 to-navy/50" />
        <motion.div initial="hidden" animate="show" variants={stagger}
          className="relative z-10 max-w-4xl mx-auto px-6 py-20">
          <motion.span variants={fadeUp}
            className="inline-flex items-center gap-2 bg-white/10 text-signal text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            <Globe2 size={13} /> About United Care Alliance
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-display text-white text-3xl md:text-4xl font-bold max-w-xl mb-4">
            Funding shouldn't be complicated
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/80 text-base max-w-lg leading-relaxed">
            UCA connects individuals, nonprofits and researchers with grant funding
            through a process that's transparent from application to disbursement.
          </motion.p>
        </motion.div>
      </section>

      {/* MISSION — split text / photo, not a wall of paragraphs */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <span className="text-primary-700 text-xs font-medium tracking-wide uppercase">Our mission</span>
          <h2 className="font-display text-2xl font-bold text-navy mt-3 mb-5">
            One platform, from first application to funded
          </h2>
          <div className="text-navy/70 space-y-4 leading-relaxed">
            <p>
              United Care Alliance connects individuals with grant funding through a simple,
              transparent application process. We believe access to funding
              shouldn't be complicated.
            </p>
            <p>
              Our platform handles identity verification, application review, and
              secure fund disbursement — all in one place, with full visibility
              into your application status every step of the way.
            </p>
          </div>
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          className="rounded-xl overflow-hidden h-80 md:h-96">
          <img
            src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80"
            alt="A community clinic funded through a UCA grant"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* VALUES */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <span className="text-primary-700 text-xs font-medium tracking-wide uppercase">What guides us</span>
            <h2 className="font-display text-2xl font-bold text-navy mt-3">Three commitments we don't compromise on</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
            className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Verified, not assumed", desc: "Every applicant and every recipient organization is identity-checked before funds move." },
              { icon: Eye, title: "Visible at every step", desc: "You can see exactly where your application sits in review, no separate status calls needed." },
              { icon: Heart, title: "Funded on merit", desc: "Reviews are scored against published criteria for each cause area, not relationships or referrals." },
            ].map((v) => (
              <motion.div key={v.title} variants={fadeUp} className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-navy" />
                </div>
                <h3 className="font-display font-semibold text-navy mb-2">{v.title}</h3>
                <p className="text-sm text-navy/70 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}
        className="bg-navy">
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "$480M", label: "Disbursed to date" },
            { value: "3,200+", label: "Grants awarded" },
            { value: "140", label: "Countries reached" },
            { value: "21 days", label: "Average review time" },
          ].map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center">
              <div className="font-display text-signal text-2xl md:text-3xl font-bold">{s.value}</div>
              <div className="text-white/60 text-xs mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CLOSING CTA */}
      <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-navy mb-4">Ready to see if you qualify?</h2>
        <p className="text-navy/70 mb-8">Most applicants get a decision within 21 days.</p>
        <a href={route('register')}
           className="inline-flex items-center gap-2 bg-signal hover:bg-signal-dark transition-colors text-navy font-medium px-7 py-3.5 rounded-lg">
          Start an application <ArrowRight size={16} />
        </a>
      </motion.section>

    </PublicLayout>
  );
}