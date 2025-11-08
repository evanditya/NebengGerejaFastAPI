import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  // Create sample environments
  const environments = [
    "Lingkungan St. Petrus",
    "Lingkungan St. Paulus",
    "Lingkungan St. Yohanes",
    "Lingkungan St. Maria",
    "Lingkungan St. Fransiskus",
  ];

  for (const envName of environments) {
    try {
      await storage.createEnvironment({ name: envName });
      console.log(`Created environment: ${envName}`);
    } catch (error) {
      console.log(`Environment ${envName} might already exist`);
    }
  }

  // Create sample users
  const users = [
    {
      name: "Admin User",
      email: "admin@nebeng.com",
      phone: "081234567890",
      lingkungan: "Lingkungan St. Petrus",
      role: "admin",
      password: "admin123",
    },
    {
      name: "Budi Santoso",
      email: "budi@example.com",
      phone: "081234567891",
      lingkungan: "Lingkungan St. Paulus",
      role: "driver",
      password: "password123",
    },
    {
      name: "Maria Wijaya",
      email: "maria@example.com",
      phone: "082345678901",
      lingkungan: "Lingkungan St. Yohanes",
      role: "driver",
      password: "password123",
    },
    {
      name: "Yohanes Tan",
      email: "yohanes@example.com",
      phone: "083456789012",
      lingkungan: "Lingkungan St. Maria",
      role: "driver",
      password: "password123",
    },
    {
      name: "Siti Rahma",
      email: "siti@example.com",
      phone: "084567890123",
      lingkungan: "Lingkungan St. Fransiskus",
      role: "passenger",
      password: "password123",
    },
  ];

  const createdUsers: any[] = [];
  for (const userData of users) {
    try {
      const user = await storage.createUser(userData);
      createdUsers.push(user);
      console.log(`Created user: ${userData.name} (${userData.email})`);
    } catch (error) {
      console.log(`User ${userData.email} might already exist`);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) createdUsers.push(existingUser);
    }
  }

  // Create sample masses
  const now = new Date();
  const masses = [
    {
      name: "Misa Minggu Pagi",
      datetime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 7, 0),
      special: false,
    },
    {
      name: "Misa Sabtu Sore",
      datetime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6, 18, 0),
      special: false,
    },
    {
      name: "Misa Minggu Sore",
      datetime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 17, 30),
      special: false,
    },
    {
      name: "Misa Jumat Pertama",
      datetime: new Date(now.getFullYear(), now.getMonth() + 1, 1, 19, 0),
      special: true,
    },
  ];

  const createdMasses: any[] = [];
  for (const massData of masses) {
    const mass = await storage.createMass(massData);
    createdMasses.push(mass);
    console.log(`Created mass: ${massData.name}`);
  }

  // Create sample rides
  const drivers = createdUsers.filter(u => u.role === "driver");
  const rides = [
    {
      driverId: drivers[0]?.id,
      massId: createdMasses[0]?.id,
      pickupPoint: "Lippo Cikarang, depan Supermal",
      seatsTotal: 5,
      notes: "Berangkat jam 6:30 pagi. Mohon konfirmasi H-1.",
    },
    {
      driverId: drivers[1]?.id,
      massId: createdMasses[1]?.id,
      pickupPoint: "Cibitung, Perumahan Grand Cikarang",
      seatsTotal: 4,
      notes: null,
    },
    {
      driverId: drivers[2]?.id,
      massId: createdMasses[0]?.id,
      pickupPoint: "Jababeka, dekat Gate Utama",
      seatsTotal: 3,
      notes: "Siap jemput di area Jababeka.",
    },
    {
      driverId: drivers[0]?.id,
      massId: createdMasses[2]?.id,
      pickupPoint: "Lippo Cikarang, depan Supermal",
      seatsTotal: 6,
      notes: "Berangkat jam 17:00. Ada AC dan audio system.",
    },
  ];

  for (const rideData of rides) {
    if (rideData.driverId && rideData.massId) {
      const ride = await storage.createRide(rideData);
      console.log(`Created ride: ${rideData.pickupPoint}`);
    }
  }

  console.log("\nSeed complete!");
  console.log("\nTest credentials:");
  console.log("Admin: admin@nebeng.com / admin123");
  console.log("Driver: budi@example.com / password123");
  console.log("Passenger: siti@example.com / password123");
}

seed()
  .then(() => {
    console.log("Seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
