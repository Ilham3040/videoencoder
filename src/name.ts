import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAnimeNames = async (req: Request, res: Response) => {
  try {
    // Fetch all anime names
    const animeNames = await prisma.anime.findMany({
      select: { name: true },
    });

    res.json(animeNames.map((anime) => anime.name));
  } catch (error) {
    console.error('Error fetching anime names:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEpisode = async (req: Request, res: Response) => {
  const animeName = req.params.name;
  try {
    // Fetch all episodes for the provided anime name
    const anime = await prisma.anime.findUnique({
      where: { name: animeName },
      include: { episodes: true },
    });

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    res.json(anime.episodes);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
