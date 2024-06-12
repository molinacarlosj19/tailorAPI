const sequelize = require('./config/database');
const User = require('./entities/User');
const Role = require('./entities/Role');

const syncModels = async () => {
    try {
        await sequelize.sync({ force: true }); // This will drop and recreate all tables - use with caution!
        console.log('Database & tables created!');
    } catch (error) {
        console.error('Unable to create tables, shutting down...', error);
    }
};

syncModels();
