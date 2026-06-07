import Vendor from '@/lib/models/Vendor';
import Service from '@/lib/models/Service';

const SEED_VENDORS = [
  {
    shopName: 'Elite Barber Shop',
    email: 'elite@queue.local',
    password: 'demo',
    businessPhone: '+91 9876543210',
    whatsappNumber: '+91 9876543210',
    services: [
      { name: 'Haircut', estimatedTime: 30, price: 500 },
      { name: 'Beard Trim', estimatedTime: 15, price: 200 },
      { name: 'Hair Color', estimatedTime: 60, price: 1500 },
    ],
  },
  {
    shopName: 'Pro Salon',
    email: 'pro@queue.local',
    password: 'demo',
    businessPhone: '+91 9876543211',
    whatsappNumber: '+91 9876543211',
    services: [
      { name: 'Haircut', estimatedTime: 30, price: 450 },
      { name: 'Hair Spa', estimatedTime: 50, price: 1200 },
      { name: 'Facial', estimatedTime: 40, price: 1000 },
    ],
  },
  {
    shopName: 'Style Studio',
    email: 'style@queue.local',
    password: 'demo',
    businessPhone: '+91 9876543212',
    whatsappNumber: '+91 9876543212',
    services: [
      { name: 'Haircut', estimatedTime: 25, price: 400 },
      { name: 'Hair Color', estimatedTime: 60, price: 1400 },
      { name: 'Massage', estimatedTime: 45, price: 800 },
    ],
  },
  {
    shopName: 'Groom House',
    email: 'groom@queue.local',
    password: 'demo',
    businessPhone: '+91 9876543213',
    whatsappNumber: '+91 9876543213',
    services: [
      { name: 'Haircut', estimatedTime: 30, price: 550 },
      { name: 'Beard Trim', estimatedTime: 15, price: 250 },
      { name: 'Facial', estimatedTime: 40, price: 900 },
    ],
  },
];

export async function seedVendorsIfEmpty() {
  const count = await Vendor.countDocuments();
  if (count > 0) {
    return false;
  }

  for (const seed of SEED_VENDORS) {
    const vendor = new Vendor({
      shopName: seed.shopName,
      email: seed.email,
      password: seed.password,
      businessPhone: seed.businessPhone,
      whatsappNumber: seed.whatsappNumber,
      services: [],
      currentQueue: [],
    });
    await vendor.save();

    const serviceIds = [];
    for (const svc of seed.services) {
      const service = new Service({
        vendorId: vendor._id,
        name: svc.name,
        estimatedTime: svc.estimatedTime,
        price: svc.price,
        active: true,
      });
      await service.save();
      serviceIds.push(service._id);
    }

    vendor.services = serviceIds;
    await vendor.save();
  }

  return true;
}
