"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import {
  GraduationCap,
  Building2,
  Users,
  Sparkles,
//   Github,
//   Linkedin,
  Mail,
//   Instagram,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ---------------------------------------------
   DATA — replace image paths + text with your own
--------------------------------------------- */
const college = {
  name: "Osmania University College of Engineering",
  img: "/about/college.jpg",
  about:
    "Established as one of the oldest and most prestigious engineering institutions in India, Osmania University College of Engineering has been shaping engineers, innovators, and leaders for decades. With a legacy of academic excellence and a sprawling campus rich in history, the college continues to foster curiosity, discipline, and technical mastery in every student who walks through its gates.",
};

const department = {
  name: "Department of Computer Science & Engineering",
  about:
    "The CSE Department blends strong theoretical foundations with hands-on, industry-relevant learning. Guided by experienced faculty, students are encouraged to explore software engineering, AI, systems design, and research — building the skills needed to solve real-world problems.",
};

const lecturers = [
  {
    name: "V.B.N. Sir",
    dept: "CSE Department",
    img: "/about/lecturers/vbn.jpg",
    about:
      "Brings years of teaching experience with a focus on core computer science fundamentals and mentoring student projects.",
  },
  {
    name: "Sujatha Mam",
    dept: "CSE Department",
    img: "/about/lecturers/sujatha.jpg",
    about:
      "Known for her clarity in explaining complex concepts, she has guided countless students through their academic journey.",
  },
  {
    name: "Narender Reddy Sir",
    dept: "CSE Department",
    img: "/about/lecturers/narender.jpg",
    about:
      "A dedicated educator passionate about systems and databases, always encouraging students to think beyond the textbook.",
  },
  {
    name: "Satyanarayan Sir",
    dept: "CSE Department",
    img: "/about/lecturers/satyanarayan.jpg",
    about:
      "Combines academic rigor with real-world insight, helping students bridge the gap between theory and application.",
  },
  {
    name: "Jaya Mam",
    dept: "CSE Department",
    img: "/about/lecturers/jaya.jpg",
    about:
      "A supportive mentor who believes in nurturing curiosity and confidence in every student she teaches.",
  },
  {
    name: "Sukanya Mam",
    dept: "CSE Department",
    img: "/about/lecturers/sukanya.jpg",
    about:
      "Focuses on practical, project-based learning, encouraging students to build and experiment beyond the syllabus.",
  },
];

const team = [
  {
    name: "Arsalaan Sairab",
    role: "Creator, Coder, Designer",
    img: "/about/team/arsalaan.jpg",
    about:
      "The mind behind GrievanceFlow — responsible for the idea, the code, and the design that brings it all together.",
  },
  {
    name: "A. Shiva Charan",
    role: "Founder",
    img: "/about/team/shivacharan.jpg",
    about:
      "Co-founded the project with a vision to make grievance redressal simple, transparent, and accessible for everyone.",
  },
  {
    name: "A. Sadhvika",
    role: "Founder",
    img: "/about/team/sadhvika.jpg",
    about:
      "Co-founder driving the project's mission forward, focused on impact and building something students genuinely need.",
  },
  {
    name: "A. Raghu",
    role: "Designer",
    img: "/about/team/raghu.jpg",
    about:
      "Shapes the visual identity of the project, crafting interfaces that feel clean, modern, and easy to use.",
  },
];

/* ---------------------------------------------
   Reusable scroll-reveal wrapper
--------------------------------------------- */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------
   Lecturer / Team card — small circular photo
   top-left, rest is glassmorphism
--------------------------------------------- */
function ProfileCard({ img, name, subtitle, about, index = 0, accent = "primary" }) {
  const ring =
    accent === "accent"
      ? "ring-accent/40 dark:ring-accent-dark/40"
      : "ring-primary/40 dark:ring-primary-dark/40";
  const subtitleColor =
    accent === "accent"
      ? "text-accent dark:text-accent-dark"
      : "text-primary dark:text-primary-dark";




  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="relative rounded-2xl p-5 sm:p-6 bg-white/40 dark:bg-white/[0.04]
                 backdrop-blur-xl border border-white/40 dark:border-white/10
                 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]
                 transition-shadow duration-300 overflow-hidden"
    >
      {/* subtle glow accent */}
      <div
        className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20
        ${accent === "accent" ? "bg-accent dark:bg-accent-dark" : "bg-primary dark:bg-primary-dark"}`}
      />

      <div className="relative flex items-start gap-4">
        <img
          src={img}
          alt={name}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ${ring} shrink-0`}
        />
        <div className="pt-1">
          <h3 className="font-heading text-base sm:text-lg font-semibold text-text-primary dark:text-text-primary-dark">
            {name}
          </h3>
          <p className={`text-xs sm:text-sm font-medium ${subtitleColor}`}>
            {subtitle}
          </p>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
        {about}
      </p>
    </motion.div>
  );
}

/* ---------------------------------------------
   Section heading
--------------------------------------------- */
function SectionHeading({ icon: Icon, eyebrow, title, subtitle }) {
  return (
    <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-4">
        <Icon size={14} className="text-primary dark:text-primary-dark" />
        <span className="text-xs font-medium tracking-wide uppercase text-text-secondary dark:text-text-secondary-dark">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary dark:text-text-primary-dark">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-text-secondary dark:text-text-secondary-dark">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */
export default function AboutPage() {
  const blobRef1 = useRef(null);
  const blobRef2 = useRef(null);
  const blobRef3 = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });

    tl.to(blobRef1.current, { x: 40, y: 30, duration: 6 }, 0)
      .to(blobRef2.current, { x: -50, y: -20, duration: 7 }, 0)
      .to(blobRef3.current, { x: 20, y: -40, duration: 5.5 }, 0);

    return () => tl.kill();
  }, []);

  return (
    <>
    <Navbar />
      <main className="relative bg-bg dark:bg-bg-dark overflow-hidden">
      {/* ---------------- HERO ---------------- */}
      <section className="relative px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
        {/* floating gsap blobs */}
        <div
          ref={blobRef1}
          className="pointer-events-none absolute top-10 left-[8%] w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-primary/20 dark:bg-primary-dark/20 blur-3xl"
        />
        <div
          ref={blobRef2}
          className="pointer-events-none absolute top-24 right-[10%] w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-accent/20 dark:bg-accent-dark/20 blur-3xl"
        />
        <div
          ref={blobRef3}
          className="pointer-events-none absolute bottom-0 left-1/3 w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-secondary/20 dark:bg-secondary-dark/20 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark mb-6"
        >
          <Sparkles size={14} className="text-primary dark:text-primary-dark" />
          <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
            About Us
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary dark:text-text-primary-dark max-w-3xl mx-auto"
        >
          The people & the place behind{" "}
          <span className="text-primary dark:text-primary-dark">GrievanceFlow</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-5 text-sm sm:text-base text-text-secondary dark:text-text-secondary-dark max-w-xl mx-auto"
        >
          From the college that shaped us, to the faculty who guided us, to the
          team that built this — here's the story behind the project.
        </motion.p>
      </section>

      {/* ---------------- COLLEGE CARD ---------------- */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <Reveal className="max-w-5xl mx-auto">
          <div
            className="relative w-full rounded-[2rem] p-6 sm:p-10 bg-white/40 dark:bg-white/[0.04]
                       backdrop-blur-xl border border-white/40 dark:border-white/10
                       shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.45)]
                       flex flex-col md:flex-row items-center gap-8 overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary/15 dark:bg-primary-dark/15 blur-3xl" />

            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              src={college.img}
              alt={college.name}
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-primary/30 dark:ring-primary-dark/30 shrink-0"
            />

            <div className="relative text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-2 justify-center md:justify-start">
                <Building2 size={16} className="text-primary dark:text-primary-dark" />
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark">
                  Our Institution
                </span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-text-primary dark:text-text-primary-dark">
                {college.name}
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-text-secondary dark:text-text-secondary-dark">
                {college.about}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- CSE DEPARTMENT ---------------- */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <Reveal className="max-w-4xl mx-auto mb-10 sm:mb-14">
          <div
            className="relative w-full rounded-3xl p-6 sm:p-8 bg-white/35 dark:bg-white/[0.035]
                       backdrop-blur-lg border border-white/40 dark:border-white/10
                       shadow-[0_6px_28px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_28px_rgba(0,0,0,0.4)]
                       text-center overflow-hidden"
          >
            <div className="pointer-events-none absolute -bottom-14 -right-14 w-52 h-52 rounded-full bg-accent/15 dark:bg-accent-dark/15 blur-3xl" />
            <div className="relative inline-flex items-center gap-2 mb-3 justify-center">
              <GraduationCap size={16} className="text-accent dark:text-accent-dark" />
              <span className="text-xs font-medium uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark">
                Department
              </span>
            </div>
            <h2 className="relative font-heading text-lg sm:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              {department.name}
            </h2>
            <p className="relative mt-3 text-sm sm:text-base leading-relaxed text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto">
              {department.about}
            </p>
          </div>
        </Reveal>

        <SectionHeading
          icon={Users}
          eyebrow="Faculty"
          title="Meet our lecturers"
          subtitle="The educators who guided this project's foundations."
        />

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {lecturers.map((l, i) => (
            <ProfileCard
              key={l.name}
              img={l.img}
              name={l.name}
              subtitle={l.dept}
              about={l.about}
              index={i}
              accent="primary"
            />
          ))}
        </div>
      </section>

      {/* ---------------- TEAM ---------------- */}
      <section className="px-4 sm:px-6 pb-20 sm:pb-28">
        <SectionHeading
          icon={Sparkles}
          eyebrow="The Team"
          title="Built by us"
          subtitle="The people who turned an idea into GrievanceFlow."
        />

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {team.map((t, i) => (
            <ProfileCard
              key={t.name}
              img={t.img}
              name={t.name}
              subtitle={t.role}
              about={t.about}
              index={i}
              accent="accent"
            />
          ))}
        </div>
      </section>
    </main>
    <Footer/>
    </>
  );
}