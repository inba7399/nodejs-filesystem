const express = require('express');
const fs = require('fs');
const moment = require('moment');
const path = require('path');

const app = express();
const PORT = 3000;
const FOLDER_PATH = path.join(__dirname, 'files');

if (!fs.existsSync(FOLDER_PATH)) {
    fs.mkdirSync(FOLDER_PATH);
}

app.use(express.json());

app.post('/create-file', (req, res) => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const filename = moment().format('YYYY-MM-DD_HH-mm-ss') + '.txt';
    const filepath = path.join(FOLDER_PATH, filename);

    fs.writeFile(filepath, timestamp, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating file', error: err });
        }
        res.status(201).json({ message: 'File created successfully', filename });
    });
});

app.get('/list-files', (req, res) => {
    fs.readdir(FOLDER_PATH, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading folder', error: err });
        }

        const textFiles = files.filter((file) => path.extname(file) === '.txt');
        res.status(200).json({ files: textFiles });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
