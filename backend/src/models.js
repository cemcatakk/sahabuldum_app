const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');
const bcrypt = require('bcrypt');
const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[env];

const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
    logging: false
  }
);

// User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  }
});

// District model
const District = sequelize.define('District', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'districts',
  timestamps: false,
});

// FieldProvider model
const FieldProvider = sequelize.define('FieldProvider', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  districtId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: District,
      key: 'id',
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rentalShoes: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  rentalGloves: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  cafe: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  shower: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  lockerRoom: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  availableHoursStart: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  availableHoursEnd: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {
  tableName: 'field_providers',
  timestamps: false,
});

// Field model
const Field = sequelize.define('Field', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surface: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FieldProvider,
      key: 'id',
    },
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'fields',
  timestamps: false,
});
const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fieldId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Field,
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hour: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  booked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'schedules',
  timestamps: false,
});

// Define relationships
User.hasMany(FieldProvider, { foreignKey: 'customerId', as: 'customer' });
FieldProvider.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

District.hasMany(FieldProvider, { foreignKey: 'districtId' });
FieldProvider.belongsTo(District, { foreignKey: 'districtId', as: 'district' });

FieldProvider.hasMany(Field, { foreignKey: 'providerId', as:'fields', onDelete: 'CASCADE' });
Field.belongsTo(FieldProvider, { foreignKey: 'providerId' });

User.hasMany(Field, { foreignKey: 'ownerId' });
Field.belongsTo(User, { foreignKey: 'ownerId' });

Field.hasMany(Schedule, { foreignKey: 'fieldId' });
Schedule.belongsTo(Field, { foreignKey: 'fieldId' });

sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch(err => console.log('Error:', err));

module.exports = {
  User,
  District,
  FieldProvider,
  Field,
  Schedule,
  sequelize,
};
