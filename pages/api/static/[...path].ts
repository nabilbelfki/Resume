import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: filePathParams } = req.query;
  
  if (!filePathParams || !Array.isArray(filePathParams)) {
    return res.status(400).send('Invalid path');
  }
  
  const filePath = path.join(process.cwd(), 'public', ...filePathParams);

  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return res.status(404).send('File not found');
    }

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.webm') contentType = 'video/webm';
    else if (ext === '.ogg') contentType = 'video/ogg';
    else if (ext === '.mp3') contentType = 'audio/mpeg';
    else if (ext === '.wav') contentType = 'audio/wav';

    return new Promise((resolve, reject) => {
      const range = req.headers.range;
      let start = 0;
      let end = stat.size - 1;
      let isPartial = false;

      if (range) {
        isPartial = true;
        const parts = range.replace(/bytes=/, "").split("-");
        if (parts[0]) start = parseInt(parts[0], 10);
        if (parts[1]) end = parseInt(parts[1], 10);
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });

      if (isPartial) {
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
        });
      } else {
        res.writeHead(200, {
          'Content-Length': stat.size,
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        });
      }

      file.pipe(res);
      file.on('end', () => resolve(true));
      file.on('error', (err) => {
        console.error("Stream error:", err);
        res.end();
        resolve(true); 
      });
      res.on('close', () => {
        file.destroy();
        resolve(true);
      });
    });
  } catch (err) {
    res.status(404).send('File not found');
  }
}
