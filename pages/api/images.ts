import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const imagesDir = path.join(process.cwd(), 'public/images');
    
    // Check if directory exists
    try {
      await fs.access(imagesDir);
    } catch {
      return res.status(404).json({ error: 'Images directory not found' });
    }

    const imageFiles = await getAllFiles(imagesDir);
    
    const images = imageFiles
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
      .map(file => ({
        path: file.replace(path.join(process.cwd(), 'public'), ''),
        name: path.basename(file)
      }));
    
    res.status(200).json(images);
  } catch (error) {
    console.error('Error reading images directory:', error);
    res.status(500).json({ error: 'Failed to read images directory' });
  }
}

async function getAllFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map(dirent => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getAllFiles(res) : res;
  }));
  return files.flat();
}
