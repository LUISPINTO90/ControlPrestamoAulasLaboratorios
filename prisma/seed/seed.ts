import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpiar los datos existentes solo de los espacios
  await prisma.space.deleteMany({});

  // Crear espacios personalizados para la Facultad de Telemática
  const spacesData: Array<{
    name: string;
    spaceType: "Classroom" | "Laboratory";
    capacity: number;
    location: string;
  }> = [
    {
      name: "Aula 1",
      spaceType: "Classroom",
      capacity: 50,
      location: "Posgrado",
    },
    {
      name: "Aula 2",
      spaceType: "Classroom",
      capacity: 30,
      location: "Posgrado",
    },
    {
      name: "Aula 3",
      spaceType: "Classroom",
      capacity: 30,
      location: "Posgrado",
    },
    {
      name: "Laboratorio redes",
      spaceType: "Laboratory",
      capacity: 25,
      location: "Facultad de Telemática",
    },
    {
      name: "Laboratorio arquitectura",
      spaceType: "Laboratory",
      capacity: 25,
      location: "Facultad de Telemática",
    },
    {
      name: "Centro de cómputo",
      spaceType: "Laboratory",
      capacity: 50,
      location: "Posgrado",
    },
    {
      name: "Centro de cómputo literatura",
      spaceType: "Laboratory",
      capacity: 50,
      location: "Facultad de Telemática",
    },
    {
      name: "Centro de cómputo",
      spaceType: "Classroom",
      capacity: 25,
      location: "Dirección General de Recursos Educativos Digitales (DGRED)",
    },
  ];

  // Crear los espacios
  await Promise.all(
    spacesData.map(async (space) => {
      return await prisma.space.create({
        data: {
          name: space.name,
          spaceType: space.spaceType,
          capacity: space.capacity,
          location: space.location,
        },
      });
    })
  );

  console.log("¡Espacios creados con éxito!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
