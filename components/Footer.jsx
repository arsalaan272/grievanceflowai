const team = [
  { name: "A. Sairab", role: "Backend" },
  { name: "A. Shiva", role: "Frontend" },
  { name: "A. Sadvika", role: "Design" },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
    >
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-lg font-bold">
              Grievance<span className="text-primary dark:text-primary-dark">Flow</span>
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
              Osmania University College of Engineering
              <br />
              Department of Computer Science
              <br />
              Hyderabad, Telangana
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark">
              Quick links
            </h4>
            <ul className="mt-3 space-y-2 font-body text-sm">
              <li>
                <a href="#features" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
                  Log in
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark">
              Built by
            </h4>
            <ul className="mt-3 space-y-2 font-body text-sm">
              {team.map((member) => (
                <li key={member.name} className="flex justify-between gap-4">
                  <span>{member.name}</span>
                  <span className="text-text-secondary dark:text-text-secondary-dark">
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border dark:border-border-dark pt-6">
          <p className="font-body text-xs text-text-secondary dark:text-text-secondary-dark">
            © {new Date().getFullYear()} GrievanceFlow. Built as a college mini project at Osmania University College of Engineering.
          </p>
        </div>
      </div>
    </footer>
  );
}