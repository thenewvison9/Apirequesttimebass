import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const dbPath = path.resolve('./database.json');
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const hr = parseInt(req.query.hr) || 24;
    const expiresAt = Date.now() + hr * 3600000; // Convert hours to milliseconds

    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, '[]');
    }

    let data = JSON.parse(fs.readFileSync(dbPath));
    let record = data.find(entry => entry.ip === ip);

    if (record) {
        record.expiresAt = expiresAt;
    } else {
        data.push({ ip, expiresAt });
    }

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    res.json({ status: "generated", ip, expiresAt });
}
