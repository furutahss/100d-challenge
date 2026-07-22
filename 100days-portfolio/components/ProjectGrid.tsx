import { ProjectIcon } from "@/components/ProjectIcon";
import type { Project } from "@/data/projects";

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <section aria-labelledby="projects-title" className="relative">
      <div className="mb-5 flex items-end justify-between gap-4 px-1 text-white">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
            Home screen / 100 apps
          </p>
          <h2
            className="text-xl font-black tracking-[-0.045em] sm:text-2xl"
            id="projects-title"
          >
            つくったもの
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55 sm:text-[10px]">
          <span className="h-2 w-2 rounded-full bg-acid shadow-[0_0_12px_#dfff00]" />
          Built
          <span className="ml-1 h-2 w-2 rounded-full border border-white/30" />
          Waiting
        </div>
      </div>

      <div className="screen-shell overflow-hidden rounded-[2rem] border border-white/15 bg-[#20221d] shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:rounded-[2.75rem]">
        <div className="screen-wallpaper relative px-4 pb-10 pt-4 sm:px-8 sm:pb-14 sm:pt-5 lg:px-11">
          <div className="relative z-10 mb-8 flex items-center justify-between px-1 text-white/60 sm:mb-10">
            <span className="font-mono text-[9px] tracking-[0.16em]">
              100 DAYS
            </span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              <span className="h-1.5 w-4 rounded-full bg-acid" />
            </div>
          </div>

          <ul className="relative z-10 grid grid-cols-3 gap-x-5 gap-y-7 sm:grid-cols-4 sm:gap-x-7 sm:gap-y-9 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
            {projects.map((project) => (
              <ProjectIcon key={project.day} project={project} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
