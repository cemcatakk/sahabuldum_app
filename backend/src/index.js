const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const upload = require('./upload'); 
const { User, District, FieldProvider, Field, Schedule, sequelize } = require('./models');
const Sequelize = require('sequelize')

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://sahabuldum.com.tr', 'http://localhost:3000'];

const corsOptions = {
 origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Create an admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        password: 'admin',
        type: 'admin',
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

// Call the function to create the admin user
createAdminUser();
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const fieldProvider = await FieldProvider.findOne({ where: { customerId: user.id } });
      const token = jwt.sign({
        id: user.id,
        userType: user.type,
        availableHoursStart: fieldProvider ? fieldProvider.availableHoursStart : '00:00',
        availableHoursEnd: fieldProvider ? fieldProvider.availableHoursEnd : '23:59'
      }, 'SECRET_KEY', { expiresIn: '1h' });
      res.json({ token, userType: user.type });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// User routes
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// District routes
router.post('/districts', async (req, res) => {
  try {
    const district = await District.create(req.body);
    res.status(201).json(district);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/districts', async (req, res) => {
  try {
    const districts = await District.findAll();
    res.json(districts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/districts/:id', async (req, res) => {
  try {
    const district = await District.findByPk(req.params.id);
    if (district) {
      await district.update(req.body);
      res.json(district);
    } else {
      res.status(404).json({ error: 'District not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/districts/:id', async (req, res) => {
  try {
    const district = await District.findByPk(req.params.id);
    if (district) {
      await district.destroy();
      res.json({ message: 'District deleted' });
    } else {
      res.status(404).json({ error: 'District not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/field-providers', upload.array('images', 50), async (req, res) => {
  const { fields, ...fieldProviderData } = req.body;

  try {
    const fieldProvider = await FieldProvider.create(fieldProviderData);
    const providerId = fieldProvider.id;
    const ownerId = fieldProvider.customerId;

    const parsedFields = JSON.parse(fields);

    for (let i = 0; i < parsedFields.length; i++) {
      const field = parsedFields[i];
      const { id, images, ...fieldData } = field;
      const imagePaths = req.files
        .filter(file => file.originalname.startsWith(`${i}_`))
        .map(file => `/uploads/${file.filename}`);
      await Field.create({ ...fieldData, images: imagePaths, providerId, ownerId });
    }

    res.status(201).json(fieldProvider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/field-providers', async (req, res) => {
  try {
    const fieldProviders = await FieldProvider.findAll({
      include: [
        { model: User, as: 'customer', attributes: ['firstName', 'lastName'] },
        { model: District, as: 'district', attributes: ['name'] },
        { model: Field, as: 'fields' }
      ]
    });
    res.json(fieldProviders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/field-providers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const fieldProvider = await FieldProvider.findByPk(id, {
      include: [
        { model: User, as: 'customer', attributes: ['firstName', 'lastName'] },
      { model: District, as: 'district', attributes: ['name'] },
      { model: Field, as: 'fields' }
      ]
    });
    res.json(fieldProvider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/field-providers/:id', upload.array('images', 50), async (req, res) => {
  const { fields, ...fieldProviderData } = req.body;
  const { id } = req.params;

  try {
    await FieldProvider.update(fieldProviderData, { where: { id } });

    const parsedFields = JSON.parse(fields);

    for (let i = 0; i < parsedFields.length; i++) {
      const field = parsedFields[i];
      const { images, ...fieldData } = field;
      const newImagePaths = req.files
        .filter(file => file.originalname.startsWith(`${i}_`))
        .map(file => `/uploads/${file.filename}`);

      await Field.create({ ...fieldData, images: newImagePaths, providerId: id, ownerId: fieldProviderData.customerId });
    }

    res.status(200).json({ message: 'Field provider updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/field-providers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const provider = await FieldProvider.findByPk(id);
    if (!provider) {
      return res.status(404).json({ error: 'Field provider not found' });
    }

    await Field.destroy({ where: { providerId: id } });
    await provider.destroy();

    res.json({ message: 'Field provider and associated fields deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/fields', async (req, res) => {
  try {
    const field = await Field.create(req.body);
    res.status(201).json(field);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/fields/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const field = await Field.findByPk(id, {
      include: [
        {
          model: FieldProvider,
          attributes: ['availableHoursStart', 'availableHoursEnd']
        }
      ]
    });
    res.json(field);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/all-fields', async (req, res) => {
  try {
    const fields = await Field.findAll({
      include: [
        {
          model: FieldProvider,
          include: {
            model: District,
            as: 'district',
            attributes: ['name']
          }
        }
      ]
    });
    res.json(fields);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/fields', async (req, res) => {
  const { ownerId } = req.query;
  try {
    const fields = await Field.findAll({
      where: { ownerId },
      include: [
        {
          model: FieldProvider,
          attributes: ['city'],
          include: {
            model: District,
            as: 'district',
            attributes: ['name']
          }
        }
      ]
    });
    res.json(fields);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put('/fields/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Field.update(req.body, { where: { id } });
    res.json({ message: 'Field updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/fields/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Field.destroy({ where: { id } });
    res.json({ message: 'Field deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/schedules', async (req, res) => {
  const { fieldId, startDate } = req.query;
  try {
    const schedules = await Schedule.findAll({
      where: {
        fieldId,
        date: {
          [Sequelize.Op.gte]: startDate,
          [Sequelize.Op.lt]: new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/schedules', async (req, res) => {
  try {
    const schedules = req.body;
    for (const schedule of schedules) {
      await Schedule.upsert(schedule, { fields: ['booked', 'name', 'phone'] });
    }
    res.json({ message: 'Schedules updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/schedules/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (schedule) {
      await schedule.update(req.body);
      res.json(schedule);
    } else {
      res.status(404).json({ error: 'Schedule not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/schedules', async (req, res) => {
  try {
    const { fieldId, date, hour } = req.body;
    await Schedule.destroy({
      where: {
        fieldId,
        date,
        hour
      }
    });
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

