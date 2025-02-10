import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const dbPath = path.resolve('./database.json');
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, '[]');
    }

    let data = JSON.parse(fs.readFileSync(dbPath));
    let record = data.find(entry => entry.ip === ip);

    if (record) {
        res.json({ status: "found", ip, expiresAt: record.expiresAt });
    } else {
        res.json({ status: "not found", ip });
    }
}
