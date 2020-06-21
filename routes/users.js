const router = require('express').Router();
var _ = require('underscore');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function(req, file, cb) {
		cb(null, Date().toISOString() + file.filename);
	}
});

const upload = multer({ storage: storage });

// User Model
const User = require('../models/User');

// Auth middleware
const auth = require('../middleware/auth');

// @Route GET api/Users
// @desc GET All Users
// @access Public
router.get('/', async (req, res) => {
	await User.find().then((users) => (res.json(users)['success'] = true)).catch((err) =>
		res.json({
			message: err.toString(),
			success: false
		})
	);
});

// @Route GET api / Users
// @desc GET All Users
// @access Private
router.get('/users', auth, async (req, res) => {
	await User.find().then((users) => (res.json(users)['success'] = true)).catch((err) =>
		res.json({
			message: err.toString(),
			success: false
		})
	);
});

// @Route POST api/Users
// @desc Create a User
// @access Public
router.post('/register', async (req, res) => {
	console.log(JSON.stringify(req.body));
	var password = crypto.createHash('sha256').update(req.body.password).digest('hex');
	const newUser = new User({
		email: req.body.email,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		password: password
	});
	await newUser
		.save()
		.then((user) => {
			res.status(201).json(user)['success'] = true;
		})
		.catch((err) =>
			res.json({
				message: err.toString(),
				success: false
			})
		);
});

// @Route POST api/Users
// @desc Create a User with Picture
// @access Public
router.post('/registerp', upload.single('picture'), async (req, res) => {
	console.log(JSON.stringify(req.body));
	var password = crypto.createHash('sha256').update(req.body.password).digest('hex');
	const newUser = new User({
		email: req.body.email,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		password: password
	});
	await newUser
		.save()
		.then((user) => {
			res.status(201).json(user)['success'] = true;
		})
		.catch((err) =>
			res.json({
				message: err.toString(),
				success: false
			})
		);
});

// @Route POST api/Users
// @desc Login an User
// @access Public
router.post('/login', async (req, res) => {
	var password = crypto.createHash('sha256').update(req.body.password).digest('hex');
	const newUser = new User({
		email: req.body.email,
		password: password
	});
	await User.findOne({
		email: newUser.email
	})
		.then((user) => {
			if (newUser.password == user.password) {
				var payload = {
					email: req.body.email,
					password: password,
					firstname: user.firstname,
					lastname: user.lastname
				};

				var token = jwt.sign(payload, process.env.KEY, {
					algorithm: 'HS256',
					expiresIn: '15d'
				});
				console.log('login success');
				res.json({
					success: true,
					token: token
				});
			} else {
				console.log('login failure');
				res.json({
					success: false,
					message: "Passwords don't match"
				});
			}
		})
		.catch((err) => {
			console.log('login failure 2');
			res.json({
				message: err.toString(),
				success: false
			});
		});
});

module.exports = router;
