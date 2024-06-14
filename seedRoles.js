const sequelize = require('./config/database');
const Role = require('./entities/Role');

const seedRoles = async () => {
    try {
        await sequelize.sync({ force: true }); // This will recreate all tables - use with caution!
        
        // Create roles
        await Role.bulkCreate([
            { name: 'admin' },
            { name: 'user' }
        ]);

        console.log('Roles have been added!');
        process.exit();
    } catch (error) {
        console.error('Error seeding roles:', error);
        process.exit(1);
    }
};

seedRoles();
