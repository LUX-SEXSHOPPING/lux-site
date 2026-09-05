const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = Number(process.env.PORT) || 3000;
const root = __dirname;
const dataDir = path.join(root, 'data');
const uploadDir = path.join(dataDir, 'uploads');
const recordsFile = path.join(dataDir, 'cadastros.json');

for (const directory of [dataDir, uploadDir]) {
    fs.mkdirSync(directory, { recursive: true });
}

function readRecords() {
    if (!fs.existsSync(recordsFile)) return [];
    return JSON.parse(fs.readFileSync(recordsFile, 'utf8'));
}

function saveRecords(records) {
    fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2));
}

function removeDirectory(directory) {
    fs.rmSync(directory, { recursive: true, force: true });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const directory = path.join(uploadDir, req.uploadId);
        fs.mkdirSync(directory, { recursive: true });
        callback(null, directory);
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        callback(null, `${file.fieldname}-${crypto.randomUUID()}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: {
        files: 3,
        fileSize: 100 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const allowed = file.fieldname === 'fotos'
            ? file.mimetype.startsWith('image/')
            : file.fieldname === 'video' && file.mimetype.startsWith('video/');
        callback(allowed ? null : new Error('Tipo de arquivo não permitido.'));
    }
});

app.use(express.json({ limit: '50kb' }));
app.use((req, res, next) => {
    const blocked = /(^|\/)(data|server\.js|package(?:-lock)?\.json)(\/|$)/i.test(req.path);
    if (blocked) return res.sendStatus(404);
    return next();
});
app.use(express.static(path.join(root, 'public'), { index: 'index.html', dotfiles: 'deny' }));

app.post('/api/pre-cadastros', (req, res) => {
    req.uploadId = crypto.randomUUID();
    upload.fields([
        { name: 'fotos', maxCount: 2 },
        { name: 'video', maxCount: 1 }
    ])(req, res, (error) => {
        if (error) {
            removeDirectory(path.join(uploadDir, req.uploadId));
            return res.status(400).json({ erro: error.message });
        }

        const fotos = req.files?.fotos || [];
        const video = req.files?.video || [];
        if (fotos.length > 2 || video.length > 1) {
            removeDirectory(path.join(uploadDir, req.uploadId));
            return res.status(400).json({ erro: 'Envie no máximo 2 fotos e 1 vídeo.' });
        }

        const idade = Number(req.body.idade);
        if (!req.body.nome || !req.body.telefone || !Number.isInteger(idade) || idade < 18) {
            removeDirectory(path.join(uploadDir, req.uploadId));
            return res.status(400).json({ erro: 'Nome, WhatsApp e idade (18+) são obrigatórios.' });
        }

        const record = {
            id: req.uploadId,
            status: 'pendente',
            criadoEm: new Date().toISOString(),
            nome: req.body.nome.trim(),
            telefone: req.body.telefone.trim(),
            idade,
            altura: (req.body.altura || '').trim(),
            cidade: (req.body.cidade || '').trim(),
            endereco: {
                rua: (req.body.endereco || '').trim(),
                numero: (req.body.numero || '').trim(),
                bairro: (req.body.bairro || '').trim(),
                cidade: (req.body.cidadeEndereco || '').trim(),
                estado: (req.body.estado || '').trim(),
                pais: (req.body.pais || '').trim()
            },
            descricao: (req.body.descricao || '').trim(),
            fotos: fotos.map((file) => file.filename),
            video: video[0]?.filename || null
        };

        const records = readRecords();
        records.push(record);
        saveRecords(records);
        return res.status(201).json({
            mensagem: 'Pré-cadastro recebido para avaliação.',
            id: record.id
        });
    });
});

app.get('/api/catalogo', (req, res) => {
    const records = readRecords()
        .filter((record) => record.status === 'aprovado')
        .map((record) => ({
            id: record.id,
            nome: record.nome,
            idade: record.idade,
            cidade: record.cidade,
            descricao: record.descricao,
            fotos: record.fotos.map((file) => `/media/${record.id}/${file}`),
            video: record.video ? `/media/${record.id}/${record.video}` : null
        }));
    res.json(records);
});

app.get('/api/pre-cadastros', (req, res) => {
    if (!process.env.ADMIN_TOKEN || req.get('x-admin-token') !== process.env.ADMIN_TOKEN) {
        return res.sendStatus(401);
    }
    return res.json(readRecords().map((record) => ({
        id: record.id,
        status: record.status,
        criadoEm: record.criadoEm,
        nome: record.nome,
        telefone: record.telefone,
        idade: record.idade,
        cidade: record.cidade,
        descricao: record.descricao,
        fotos: record.fotos,
        video: record.video
    })));
});

const accessLog = new Map();
function isRateLimited(req) {
    const now = Date.now();
    const key = req.ip;
    const recent = (accessLog.get(key) || []).filter((time) => now - time < 60_000);
    recent.push(now);
    accessLog.set(key, recent);
    return recent.length > 60;
}

app.use('/media', (req, res, next) => {
    if (isRateLimited(req)) return res.status(429).json({ erro: 'Muitas solicitações. Tente novamente.' });
    return next();
});

app.get('/media/:id/:filename', (req, res) => {
    const record = readRecords().find((item) => item.id === req.params.id);
    if (!record || record.status !== 'aprovado' || ![...record.fotos, record.video].includes(req.params.filename)) {
        return res.sendStatus(404);
    }
    return res.sendFile(path.join(uploadDir, record.id, req.params.filename));
});

app.post('/api/pre-cadastros/:id/aprovar', (req, res) => {
    if (!process.env.ADMIN_TOKEN || req.get('x-admin-token') !== process.env.ADMIN_TOKEN) {
        return res.sendStatus(401);
    }
    const records = readRecords();
    const record = records.find((item) => item.id === req.params.id);
    if (!record) return res.sendStatus(404);
    record.status = 'aprovado';
    record.aprovadoEm = new Date().toISOString();
    saveRecords(records);
    return res.json({ mensagem: 'Modelo publicada no catálogo.' });
});

app.listen(port, () => {
    console.log(`LUX servidor disponível em http://localhost:${port}`);
});
