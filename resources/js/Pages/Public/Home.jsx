import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  BadgeCheck,
  HeartHandshake,
  Menu,
} from "lucide-react";

// Fixed: images live in resources/js/Pages/Public/images,
// so they must be imported as modules (Vite will bundle + hash them).
// Adjust the relative path below if Home.jsx moves elsewhere.
import logo from "./images/logo.png";
import heroImage from "./images/image-1.png";
import aboutImage from "./images/about.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const stats = [
  {
    value: "$480M+",
    label: "Support Distributed",
  },
  {
    value: "140+",
    label: "Countries Reached",
  },
  {
    value: "98%",
    label: "Verified Applications",
  },
  {
    value: "24/7",
    label: "Applicant Support",
  },
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Secure Application",
  },
  {
    icon: BadgeCheck,
    title: "Verified Process",
  },
  {
    icon: Globe2,
    title: "Global Reach",
  },
  {
    icon: HeartHandshake,
    title: "Community Focused",
  },
];

export default function Home() {
  return (
    <main className="bg-slate-50 text-slate-900">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/" className="flex items-center gap-3">

            <img
              src={logo}
              alt="United Care Alliance"
              className="h-11 w-auto"
            />

            

          </Link>

          <nav className="hidden items-center gap-10 text-sm font-medium lg:flex">

            <a href="#about" className="hover:text-blue-600">
              About
            </a>

            <a href="#programs" className="hover:text-blue-600">
              Programs
            </a>

            <a href="#process" className="hover:text-blue-600">
              How It Works
            </a>

            <a href="#faq" className="hover:text-blue-600">
              FAQ
            </a>

          </nav>

          <div className="hidden items-center gap-3 lg:flex">

            <Link
              href="/login"
              className="rounded-xl px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Application
            </Link>

          </div>

          <button className="lg:hidden">
            <Menu size={28} />
          </button>

        </div>

      </header>

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100" />

        <div className="relative mx-auto grid max-w-7xl gap-20 px-6 py-24 lg:grid-cols-2 lg:items-center">

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >

            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
            >
              Trusted Assistance Programs
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-xl text-5xl font-bold leading-tight tracking-tight lg:text-6xl"
            >
              Helping Individuals Access
              <span className="text-blue-600">
                {" "}Trusted Financial Assistance
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-lg text-lg leading-8 text-slate-600"
            >
              United Care Alliance provides secure application,
              verification, and community assistance programs designed
              to support eligible individuals through a transparent
              review process.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Start Application

                <ArrowRight
                  size={18}
                  className="ml-2"
                />

              </Link>

              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-4 font-semibold hover:border-blue-600"
              >
                Learn More
              </a>

            </motion.div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
          >

            <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-2xl">

              <img
                src={heroImage}
                alt="United Care Alliance"
                className="h-full w-full rounded-2xl object-cover"
              />

            </div>

          </motion.div>

        </div>

      </section>

      {/* ================= TRUST STRIP ================= */}

      <section className="border-y border-slate-200 bg-white">

        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">

          {trustItems.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="flex items-center gap-4"
              >

                <div className="rounded-2xl bg-blue-50 p-3">

                  <Icon
                    className="text-blue-600"
                    size={24}
                  />

                </div>

                <div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Built around transparency and accountability.
                  </p>

                </div>

              </div>

            );

          })}

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-14 max-w-2xl">

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              By The Numbers
            </span>

            <h2 className="mt-3 text-4xl font-bold">
              Supporting communities through structured assistance.
            </h2>

          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {stats.map((stat) => (

              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200 bg-white p-8"
              >

                <h3 className="text-4xl font-bold text-blue-600">
                  {stat.value}
                </h3>

                <p className="mt-3 text-slate-600">
                  {stat.label}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .7 }}
            >

              <img
                src={aboutImage}
                alt="United Care Alliance Community"
                className="rounded-3xl shadow-xl w-full object-cover"
              />

            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .7 }}
            >

              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                About United Care Alliance
              </span>

              <h2 className="mt-4 text-4xl font-bold leading-tight">
                Supporting people through transparent assistance programs.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                United Care Alliance is committed to connecting eligible
                individuals with assistance opportunities through a secure,
                transparent, and structured application process.
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Every application follows a review process designed to ensure
                fairness, accountability, and responsible distribution of
                available support programs.
              </p>

            </motion.div>

          </div>

        </div>
      </section>

      {/* ================= VALUES ================= */}

      <section className="bg-slate-50 py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center max-w-2xl mx-auto">

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Our Values
            </span>

            <h2 className="mt-4 text-4xl font-bold">
              Everything we do is built around trust.
            </h2>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                title: "Transparency",
                text: "Clear communication throughout every stage of the application."
              },
              {
                title: "Integrity",
                text: "Every application receives a structured review process."
              },
              {
                title: "Security",
                text: "Your personal information is handled with care and confidentiality."
              },
              {
                title: "Community",
                text: "Supporting individuals and families through meaningful programs."
              }
            ].map((item) => (

              <motion.div
                key={item.title}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200"
              >

                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                  <ShieldCheck className="text-blue-600" />

                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.text}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= PROGRAMS ================= */}

      <section
        id="programs"
        className="py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-3xl">

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Assistance Programs
            </span>

            <h2 className="mt-4 text-4xl font-bold">
              Explore the programs designed to support eligible applicants.
            </h2>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {[
              {
                title: "Financial Assistance",
                desc: "Support programs for qualified applicants experiencing financial hardship."
              },
              {
                title: "Healthcare Support",
                desc: "Helping eligible individuals access essential healthcare assistance."
              },
              {
                title: "Housing Assistance",
                desc: "Programs focused on housing stability and community development."
              },
              {
                title: "Education Support",
                desc: "Educational opportunities and scholarship assistance."
              },
              {
                title: "Emergency Relief",
                desc: "Rapid-response support for qualifying emergency situations."
              },
              {
                title: "Community Development",
                desc: "Initiatives that strengthen local communities and families."
              }

            ].map((program) => (

              <motion.div
                key={program.title}
                whileHover={{
                  y: -8
                }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-blue-500 hover:shadow-xl"
              >

                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                  <HeartHandshake className="text-blue-600" />

                </div>

                <h3 className="mt-6 text-2xl font-semibold">
                  {program.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {program.desc}
                </p>

                <button
                  className="mt-8 inline-flex items-center text-blue-600 font-semibold"
                >
                  Learn More

                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />

                </button>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= WHY CHOOSE UCA ================= */}

      <section className="bg-slate-900 text-white py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>

              <span className="text-blue-400 uppercase tracking-widest text-sm">
                Why Choose UCA
              </span>

              <h2 className="mt-4 text-4xl font-bold leading-tight">
                A transparent process focused on people.
              </h2>

              <p className="mt-6 text-slate-300 leading-8 text-lg">
                Our goal is to provide a clear and secure experience from
                application through final review. Every step is designed to
                reduce uncertainty and help applicants understand what comes
                next.
              </p>

            </div>

            <div className="grid gap-6">

              {[
                "Secure online application",
                "Transparent eligibility review",
                "Clear communication throughout the process",
                "Dedicated applicant support",
                "Privacy-focused information handling",
                "Accessible from anywhere"
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-start gap-4 rounded-2xl bg-slate-800 p-6"
                >

                  <BadgeCheck className="mt-1 text-blue-400" />

                  <div>

                    <h3 className="font-semibold text-lg">
                      {item}
                    </h3>

                    <p className="mt-2 text-slate-400">
                      Designed to improve clarity, transparency, and trust.
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
        id="process"
        className="bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              How It Works
            </span>

            <h2 className="mt-4 text-4xl font-bold">
              A simple application process from start to finish.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              We believe every applicant should understand exactly what happens
              after submitting an application.
            </p>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-5">

            {[
              {
                number: "01",
                title: "Create Account",
                text: "Register securely and create your applicant profile."
              },
              {
                number: "02",
                title: "Submit Application",
                text: "Complete the application and upload required information."
              },
              {
                number: "03",
                title: "Verification",
                text: "Our team reviews your submission and verifies eligibility."
              },
              {
                number: "04",
                title: "Application Review",
                text: "Applications are assessed using transparent review criteria."
              },
              {
                number: "05",
                title: "Decision",
                text: "You'll receive updates and next steps through your account."
              }

            ].map((step) => (

              <motion.div
                key={step.number}
                whileHover={{ y: -6 }}
                className="relative rounded-3xl border border-slate-200 bg-white p-8"
              >

                <span className="text-5xl font-bold text-blue-100">
                  {step.number}
                </span>

                <h3 className="mt-6 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {step.text}
                </p>

              </motion.div>

            ))}

          </div>

        </div>
      </section>

      {/* ================= ELIGIBILITY ================= */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>

              <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Eligibility
              </span>

              <h2 className="mt-4 text-4xl font-bold">
                Before you begin, check if you may qualify.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Eligibility requirements vary depending on the assistance
                program. Meeting these general criteria helps ensure your
                application can proceed to review.
              </p>

            </div>

            <div className="space-y-5">

              {[
                "You meet the minimum age requirement.",
                "You provide accurate personal information.",
                "Required supporting documents are available.",
                "You agree to the program terms and conditions.",
                "Your application is complete before submission."
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200"
                >

                  <BadgeCheck
                    className="mt-1 text-green-600"
                    size={22}
                  />

                  <p className="text-slate-700">
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ================= APPLICATION PORTAL ================= */}

      <section className="py-28">

        <div className="mx-auto max-w-4xl px-6">

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
            className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-2xl"
          >

            <div className="text-center">

              <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Claim Verification
              </span>

              <h2 className="mt-4 text-4xl font-bold">
                Verify your application or claim reference.
              </h2>

              <p className="mt-5 text-lg text-slate-600 leading-8">
                Already received a claim or application reference?
                Enter it below to continue your verification.
              </p>

            </div>

            <form className="mt-12" onSubmit={(e) => e.preventDefault()}>

              <label className="block">

                <span className="mb-3 block font-medium text-slate-700">
                  Claim Reference
                </span>

                <input
                  type="text"
                  placeholder="Example: UCA-20481-AB"
                  className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600"
                />

              </label>

              <button
                type="submit"
                className="mt-8 w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
              >
                Verify Reference
              </button>

            </form>

            <div className="mt-10 flex flex-wrap justify-center gap-8 border-t pt-8 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <ShieldCheck size={18} />
                Secure Verification
              </div>

              <div className="flex items-center gap-2">
                <BadgeCheck size={18} />
                Encrypted Submission
              </div>

              <div className="flex items-center gap-2">
                <Globe2 size={18} />
                Available Worldwide
              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ================= SUCCESS STORIES ================= */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-3xl text-center">

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Applicant Experiences
            </span>

            <h2 className="mt-4 text-4xl font-bold">
              Positive experiences from our community.
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              We believe transparency extends beyond our process. Here's what
              applicants have shared about their experience.
            </p>

          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">

            {[
              {
                name: "Sarah M.",
                location: "California",
                text: "The application process was straightforward and I always knew what stage my application was in."
              },
              {
                name: "David A.",
                location: "Texas",
                text: "Communication was clear and professional throughout the review process."
              },
              {
                name: "Grace O.",
                location: "Lagos",
                text: "I appreciated the transparency and the secure online application experience."
              }

            ].map((story) => (

              <div
                key={story.name}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >

                <div className="mb-6 flex items-center gap-1 text-yellow-400">

                  ★★★★★

                </div>

                <p className="leading-8 text-slate-600">
                  "{story.text}"
                </p>

                <div className="mt-8">

                  <h4 className="font-semibold">
                    {story.name}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {story.location}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= FAQ ================= */}

      <section
        id="faq"
        className="bg-white py-24"
      >

        <div className="mx-auto max-w-4xl px-6">

          <div className="text-center">

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Frequently Asked Questions
            </span>

            <h2 className="mt-4 text-4xl font-bold">
              Everything you need to know.
            </h2>

          </div>

          <div className="mt-16 space-y-6">

            {[
              {
                q: "Is there an application fee?",
                a: "No. Applications are submitted without an application fee where applicable."
              },
              {
                q: "How long does the review process take?",
                a: "Processing time varies depending on the program and application volume."
              },
              {
                q: "Can I track my application?",
                a: "Yes. Registered applicants can monitor application progress through their account."
              },
              {
                q: "Is my personal information secure?",
                a: "We use secure systems and privacy-focused practices when handling applicant information."
              }

            ].map((faq) => (

              <details
                key={faq.q}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >

                <summary className="cursor-pointer text-lg font-semibold">
                  {faq.q}
                </summary>

                <p className="mt-5 leading-8 text-slate-600">
                  {faq.a}
                </p>

              </details>

            ))}

          </div>

        </div>

      </section>

      {/* ================= FINAL CTA ================= */}

      <section className="bg-blue-600 py-24">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-5xl font-bold text-white">
            Ready to begin your application?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Start your application today and follow a secure, transparent
            review process designed with clarity and trust in mind.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/register"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 transition hover:bg-slate-100"
            >
              Start Application
            </Link>

            <a
              href="#about"
              className="rounded-xl border border-blue-300 px-8 py-4 font-semibold text-white transition hover:bg-blue-500"
            >
              Learn More
            </a>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-slate-950 text-slate-300">

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4">

          <div>

            <img
              src={logo}
              alt="United Care Alliance"
              className="h-12"
            />

            <p className="mt-6 leading-7 text-slate-400">
              United Care Alliance provides secure application,
              verification, and community assistance programs.
            </p>

          </div>

          <div>

            <h3 className="font-semibold text-white">
              Company
            </h3>

            <ul className="mt-6 space-y-3">

              <li>
                <a href="#about">About</a>
              </li>

              <li>
                <a href="#programs">Programs</a>
              </li>

              <li>
                <a href="#process">How It Works</a>
              </li>

            </ul>

          </div>

          <div>

            <h3 className="font-semibold text-white">
              Resources
            </h3>

            <ul className="mt-6 space-y-3">

              <li>
                <a href="#faq">FAQ</a>
              </li>

              <li>
                <a href="#">Privacy Policy</a>
              </li>

              <li>
                <a href="#">Terms</a>
              </li>

            </ul>

          </div>

          <div>

            <h3 className="font-semibold text-white">
              Contact
            </h3>

            <p className="mt-6 text-slate-400">
              support@uca.org
            </p>

            <p className="mt-2 text-slate-400">
              Available Monday–Friday
            </p>

          </div>

        </div>

        <div className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">

          © {new Date().getFullYear()} United Care Alliance.
          All rights reserved.

        </div>

      </footer>

    </main>

  );
}