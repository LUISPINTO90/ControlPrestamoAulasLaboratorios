import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t text-gray-500">
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 PrestaSalones™. Todos los derechos reservados.
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon">
              <Link
                href="https://github.com/LUISPINTO90/ControlPrestamoAulasLaboratorios"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
