import db from '../models/index.js'
import dotenv from 'dotenv';

dotenv.config();

export async function createAdmin() {
  try {

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUser = await db.User.findOne({ where: { email: adminEmail } });

    if (adminUser) {
      console.log('Admin user already exists!');
    } else {
      // Create the admin user
      const admin = await db.User.create({
        name: 'admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD,
        userType: 'admin'
      });
      console.log('Admin user created successfully with ID:', admin.id);
    }
  } catch (err) {
    console.error('Error creating admin user:', err.message);

    console.log(err)
  }
}
