import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgDir = path.join(__dirname, 'img');

const app = express()
const port = process.argv[2] ? parseInt(process.argv[2], 10) : 3000;
if (isNaN(port) || port <= 0) {
  console.log(process.argv[2])
  console.error('jakas dich, napishi cyfru');
  process.exit(1);
}

const favicon = readFileSync(path.join(imgDir, 'moon.jpg'));

app.get('/img/:width/:height', (req, res) => {
  const width = parseInt(req.params.width, 10);
  const height = parseInt(req.params.height, 10);

  console.log(`Received request for image with width: ${width} and height: ${height}`);

  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return res.status(400).send('Invalid width || height');
  }
// додав команду path.join для формування шляху до зображення, а також додав умову для вибору зображення залежно від розміру
  let sourceImage = path.join(imgDir, 'moon.jpg');
  
  if (width === 1000 && height === 1000) {
    sourceImage = path.join(imgDir, 'luntik.jpg');
  }

  res.setHeader('Content-Type', 'image/jpeg');

  sharp(sourceImage)
    .resize(width, height, {
      fit: "cover",
      position: "center"
    })
    .jpeg({ quality: 80 })
    .pipe(res);
});

app.get('/', (req, res) => {
  res.redirect('/img/100/100');

});

// starts a simple http server locally on port 127.0.0.1:3000

app.listen(port, () => {
    console.log(`Server is running on port 127.0.0.1:${port}`)
});

