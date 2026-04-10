import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-text-inverse">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="font-heading text-xl tracking-tight">Rélwè</span>
            <p className="text-sm opacity-50 mt-1">Ride the rails.</p>
          </div>
          <nav className="flex gap-8 text-sm">
            <Link
              className="opacity-70 hover:opacity-100 transition-opacity"
              href="/timetable"
            >
              Timetable
            </Link>
            <Link
              className="opacity-70 hover:opacity-100 transition-opacity"
              href="/help"
            >
              FAQ
            </Link>
            <Link
              className="opacity-70 hover:opacity-100 transition-opacity"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="opacity-70 hover:opacity-100 transition-opacity"
              href="/contact"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="mt-10 pt-6 border-t border-text-inverse/10 text-sm opacity-40">
          Built for Nigeria
        </div>
      </div>
    </footer>
  );
}
