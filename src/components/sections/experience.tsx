import { EXPERIENCE, SkillNames, SKILLS } from "@/data/constants";
import { SectionHeader } from "./section-header";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExperienceSection = () => {
  return (
    <SectionWrapper
      id="experience"
      className="flex flex-col items-center justify-center min-h-[120vh] py-20"
    >
      <div className="w-full max-w-4xl px-4 md:px-8 mx-auto">
        <SectionHeader
          id="experience"
          title="Experience"
          desc="My professional journey."
          className="relative mb-12 md:mb-16"
        />

        <div className="flex flex-col gap-8 md:gap-12 relative z-10">
          {/* Connector Line - crisp white subtle line */}
          <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-px bg-white/20 hidden md:block -translate-x-1/2" />

          {EXPERIENCE.map((exp, index) => (
            <div key={exp.id} className="relative">
              <ExperienceCard experience={exp} index={index} />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

const ExperienceCard = ({
  experience,
  index,
}: {
  experience: (typeof EXPERIENCE)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card
        style={{ backgroundColor: "#000000" }}
        className={cn(
          "!bg-black text-white border border-white/25",
          "hover:border-white/50 transition-all duration-300",
          "shadow-2xl shadow-black rounded-2xl overflow-hidden"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-white">
                {experience.title}
              </CardTitle>
              <div className="text-base font-medium text-white/80">
                {experience.company}
              </div>
            </div>
            <Badge className="w-fit font-mono text-xs font-medium bg-black text-white border border-white/30 px-3 py-1 rounded-full shadow-sm">
              {experience.startDate} - {experience.endDate}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="list-disc list-outside ml-4 space-y-2.5 text-base text-white/90 leading-relaxed marker:text-white">
            {experience.description.map((point, i) => (
              <li key={i} className="pl-1">
                {point}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/15">
            {experience.skills.map((skillName) => {
              const skill = SKILLS[skillName as SkillNames];
              if (!skill) return null;
              return (
                <Badge
                  key={skillName}
                  variant="outline"
                  className="gap-2 text-xs font-medium bg-black text-white border-white/30 hover:border-white/60 hover:bg-zinc-950 transition-colors py-1 px-2.5 rounded-lg"
                >
                  <img
                    src={skill.icon}
                    alt={skill.label}
                    className="w-3.5 h-3.5 object-contain filter brightness-0 invert opacity-95"
                  />
                  <span className="text-white">{skill.label}</span>
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExperienceSection;
