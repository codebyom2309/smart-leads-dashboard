import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/smart-leads';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'sales'], default: 'sales' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost'] },
  source: { type: String, enum: ['Website', 'Instagram', 'Referral'] },
  notes: String,
  phone: String,
  company: String,
  createdBy: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Lead = mongoose.model('Lead', LeadSchema);

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@smartleads.io',
    password: 'Password1',
    role: 'admin',
  },
  {
    name: 'Sales User',
    email: 'sales@smartleads.io',
    password: 'Password1',
    role: 'sales',
  },
];

const seedLeads = (adminId: mongoose.Types.ObjectId) => [
  { name: 'Alice Johnson', email: 'alice@techcorp.io', status: 'New', source: 'Website', company: 'TechCorp', phone: '+1 555-0101', notes: 'Interested in enterprise plan', createdBy: adminId },
  { name: 'Bob Williams', email: 'bob@startup.co', status: 'Contacted', source: 'Instagram', company: 'StartupCo', phone: '+1 555-0102', createdBy: adminId },
  { name: 'Carol Davis', email: 'carol@innovate.com', status: 'Qualified', source: 'Referral', company: 'Innovate Inc', phone: '+1 555-0103', notes: 'Ready for demo call', createdBy: adminId },
  { name: 'David Martinez', email: 'david@globaltech.net', status: 'Lost', source: 'Website', company: 'GlobalTech', createdBy: adminId },
  { name: 'Emma Wilson', email: 'emma@future.io', status: 'New', source: 'Instagram', company: 'Future IO', phone: '+1 555-0105', createdBy: adminId },
  { name: 'Frank Brown', email: 'frank@enterprise.com', status: 'Contacted', source: 'Referral', company: 'Enterprise Ltd', notes: 'Follow up next week', createdBy: adminId },
  { name: 'Grace Lee', email: 'grace@webdev.io', status: 'Qualified', source: 'Website', company: 'WebDev Studio', phone: '+1 555-0107', createdBy: adminId },
  { name: 'Henry Clark', email: 'henry@saas.co', status: 'New', source: 'Instagram', company: 'SaaS Co', createdBy: adminId },
  { name: 'Isabella Taylor', email: 'isabella@design.com', status: 'Contacted', source: 'Referral', company: 'Design Studio', phone: '+1 555-0109', createdBy: adminId },
  { name: 'James Anderson', email: 'james@cloud.io', status: 'Qualified', source: 'Website', company: 'Cloud Solutions', notes: 'High priority lead', createdBy: adminId },
  { name: 'Kate Thompson', email: 'kate@mobile.co', status: 'New', source: 'Instagram', company: 'Mobile Apps', createdBy: adminId },
  { name: 'Liam Garcia', email: 'liam@ai.tech', status: 'Lost', source: 'Website', company: 'AI Technologies', createdBy: adminId },
];

async function seed(): Promise<void> {
  await mongoose.connect(MONGO_URI);
  console.log('🌱 Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Lead.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create users
  const createdUsers = [];
  for (const userData of seedUsers) {
    const hashed = await bcrypt.hash(userData.password, 12);
    const user = await User.create({ ...userData, password: hashed });
    createdUsers.push(user);
    console.log(`✅ Created user: ${user.name} (${user.email})`);
  }

  const adminUser = createdUsers[0];

  // Create leads
  const leads = seedLeads(adminUser._id as mongoose.Types.ObjectId);
  await Lead.insertMany(leads);
  console.log(`✅ Created ${leads.length} sample leads`);

  console.log(`
✨ Seed complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin:  admin@smartleads.io / Password1
Sales:  sales@smartleads.io / Password1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
