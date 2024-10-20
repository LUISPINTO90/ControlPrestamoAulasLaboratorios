import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/es";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes
  await prisma.historialReserva.deleteMany({});
  await prisma.reserva.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.espacio.deleteMany({});

  // Crear usuarios
  const usuarios = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      return await prisma.usuario.create({
        data: {
          nombre: faker.person.firstName(),
          apellido: faker.person.lastName(),
          email: faker.internet.email(),
          password: await bcrypt.hash("password123", 10),
          tipoUsuario: faker.helpers.arrayElement([
            "Estudiante",
            "Profesor",
            "Administrador",
          ]),
        },
      });
    })
  );

  // Crear espacios
  const espacios = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return await prisma.espacio.create({
        data: {
          nombre:
            faker.helpers.arrayElement([
              "Laboratorio de Informática",
              "Laboratorio de Química",
              "Aula Magna",
              "Sala de Conferencias",
              "Aula Regular",
            ]) +
            " " +
            faker.number.int({ min: 100, max: 999 }),
          tipoEspacio: faker.helpers.arrayElement(["Laboratorio", "Aula"]),
          capacidad: faker.number.int({ min: 20, max: 100 }),
          ubicacion: `Edificio ${faker.helpers.arrayElement([
            "A",
            "B",
            "C",
            "D",
          ])}, Piso ${faker.number.int({ min: 1, max: 5 })}`,
        },
      });
    })
  );

  // Crear reservas
  const reservas = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      const fechaBase = faker.date.future();
      const horaInicio = new Date(fechaBase);
      horaInicio.setHours(faker.number.int({ min: 7, max: 18 }), 0, 0);

      const horaFin = new Date(horaInicio);
      horaFin.setHours(
        horaInicio.getHours() + faker.number.int({ min: 1, max: 3 })
      );

      return await prisma.reserva.create({
        data: {
          usuarioId: faker.helpers.arrayElement(usuarios).id,
          espacioId: faker.helpers.arrayElement(espacios).id,
          fecha: fechaBase,
          horaInicio: horaInicio,
          horaFin: horaFin,
        },
      });
    })
  );

  // Crear historiales de reservas
  await Promise.all(
    reservas.map(async (reserva) => {
      return await prisma.historialReserva.create({
        data: {
          reservaId: reserva.id,
          estado: faker.helpers.arrayElement([
            "Reservado",
            "Cancelado",
            "Completado",
          ]),
          fechaCambio: faker.date.recent(),
        },
      });
    })
  );

  console.log("Base de datos poblada exitosamente!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
