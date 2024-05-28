import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create the anime entry first
    const Days = await prisma.anime.create({
      data: {
        name: 'Egao_Daika', // Make sure this name is unique
        totalEpisodes: 12,
        episodes: {
          // Include the episodes creation here
          create: Array.from({ length: 12 }, (_, i) => ({
            eps: `Episode_${i + 1}`,
          })),
        },
      },
      include: {
        episodes: true, // Ensure episodes are included in the response
      },
    });

    console.log('Anime and episodes created successfully:', Days);
  } catch (error) {
    console.error('Error creating anime:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
