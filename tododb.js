const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });


// Endpoint untuk menambahkan tugas baru dengan gambar
router.post('/', upload.single('image'), (req, res) => {
    const { task } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save the file path if there's an image

    if (!task || task.trim() === '') {
        return res.status(400).send('Task cannot be empty');
    }

    db.query('INSERT INTO todos (task, image_url) VALUES (?, ?)', [task.trim(), imageUrl], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newTodo = { id: results.insertId, task: task.trim(), image_url: imageUrl, completed: false };
        res.status(201).json(newTodo);
    });
});
