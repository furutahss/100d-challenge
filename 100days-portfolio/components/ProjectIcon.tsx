import type { Project } from "@/data/projects";
import { ArrowIcon } from "@/components/ArrowIcon";
import Image from "next/image";

const accentClasses = {
  lime: "from-[#ddff39] to-[#b7dd00]",
  orange: "from-[#ffb056] to-[#ff7043]",
  blue: "from-[#7dd9ff] to-[#4f7cff]",
  pink: "from-[#ff8dc7] to-[#eb4f89]",
  violet: "from-[#c4a6ff] to-[#7457e8]",
};

type ProjectIconProps = {
  project: Project;
};

export function ProjectIcon({ project }: ProjectIconProps) {
  const day = String(project.day).padStart(3, "0");

  if (!project.title) {
    return (
      <li className="min-w-0">
        <div className="group flex flex-col items-center gap-2.5">
          <div className="empty-icon flex aspect-square w-full max-w-[92px] items-center justify-center rounded-[24%] border border-white/25 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition-colors group-hover:bg-acid/70" />
          </div>
          <span className="font-mono text-[9px] font-medium tracking-[0.12em] text-white/35 sm:text-[10px]">
            DAY {day}
          </span>
        </div>
      </li>
    );
  }

  const iconContent = project.image ? (
    <Image
      alt={`${project.title}のアイコン`}
      className="object-cover"
      fill
      sizes="92px"
      src={project.image}
    />
  ) : project.icon ? (
    <span className="text-[clamp(1.8rem,4vw,3rem)]" aria-hidden="true">
      {project.icon}
    </span>
  ) : (
    <span className="max-w-[88%] text-center text-[clamp(0.58rem,1.4vw,0.76rem)] font-black leading-[1.05] tracking-[-0.04em] text-ink">
      {project.title}
    </span>
  );

  const icon = (
    <>
      <div
        className={`app-icon relative flex aspect-square w-full max-w-[92px] items-center justify-center overflow-hidden rounded-[24%] bg-gradient-to-br ${accentClasses[project.accent ?? "lime"]} shadow-[0_14px_34px_rgba(0,0,0,0.28),inset_0_1px_1px_rgba(255,255,255,0.6)]`}
      >
        <span className="absolute left-2 top-2 font-mono text-[8px] font-bold tracking-wider text-ink/45">
          {day}
        </span>
        {iconContent}
        {project.href && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-ink/10 p-1 text-ink/70">
            <ArrowIcon />
          </span>
        )}
      </div>
      <span className="line-clamp-2 max-w-[108px] text-center text-[10px] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[11px]">
        {project.title}
      </span>
    </>
  );

  return (
    <li className="min-w-0">
      {project.href ? (
        <a
          aria-label={`Day ${project.day}: ${project.title}を開く`}
          className="group flex flex-col items-center gap-2.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
          href={project.href}
          title={project.description}
        >
          {icon}
        </a>
      ) : (
        <div className="flex flex-col items-center gap-2.5">{icon}</div>
      )}
    </li>
  );
}
