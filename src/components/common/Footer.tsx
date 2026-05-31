import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#d2d2d7] bg-[#f5f5f7]">
      <div className="max-w-screen-lg mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-[13px] text-[#6e6e73]">
            © {new Date().getFullYear()} PrestaSalones. Facultad de Telemática.
          </p>
          <Link
            href="https://github.com/LUISPINTO90/ControlPrestamoAulasLaboratorios"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[#0071e3] hover:underline underline-offset-2"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
