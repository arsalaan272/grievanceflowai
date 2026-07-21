import BackgroundLight from "./BackgroundLight";
import BackgroundDark from "./BackgroundDark";

export default function SectionBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="dark:hidden">
        <BackgroundLight />
      </div>
      <div className="hidden dark:block">
        <BackgroundDark />
      </div>
    </div>
  );
}