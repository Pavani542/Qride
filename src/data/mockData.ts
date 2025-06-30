
export const mockDrivers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    rating: 4.8,
    phone: '+91 98765 43210',
    vehicleNumber: 'KA 01 AB 1234',
    vehicleModel: 'Honda Activa',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: { latitude: 12.9716, longitude: 77.5946 },
    eta: 3,
    distance: 0.8,
  },
  {
    id: '2',
    name: 'Suresh Reddy',
    rating: 4.9,
    phone: '+91 87654 32109',
    vehicleNumber: 'KA 02 CD 5678',
    vehicleModel: 'TVS Jupiter',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: { latitude: 12.9716, longitude: 77.5946 },
    eta: 5,
    distance: 1.2,
  },
];

export const mockRideHistory = [
  {
    id: '1',
    date: '2024-01-15',
    time: '09:30 AM',
    from: 'Koramangala',
    to: 'Electronic City',
    driver: 'Rajesh Kumar',
    fare: 85,
    distance: 12.5,
    duration: 25,
    status: 'completed',
    rating: 5,
  },
  {
    id: '2',
    date: '2024-01-14',
    time: '06:45 PM',
    from: 'Indiranagar',
    to: 'Whitefield',
    driver: 'Suresh Reddy',
    fare: 120,
    distance: 18.2,
    duration: 35,
    status: 'completed',
    rating: 4,
  },
  {
    id: '3',
    date: '2024-01-13',
    time: '02:15 PM',
    from: 'MG Road',
    to: 'HSR Layout',
    driver: 'Arun Singh',
    fare: 65,
    distance: 8.5,
    duration: 18,
    status: 'completed',
    rating: 5,
  },
];

export const mockPaymentMethods = [
  {
    id: '1',
    type: 'upi',
    name: 'Google Pay',
    identifier: 'user@okaxis',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    name: 'HDFC Credit Card',
    identifier: '**** **** **** 1234',
    isDefault: false,
  },
  {
    id: '3',
    type: 'cash',
    name: 'Cash',
    identifier: 'Pay with cash',
    isDefault: false,
  },
];

export const mockLocations = [
  {
    id: '1',
    name: 'Home',
    address: '123, Brigade Road, Bangalore',
    type: 'home',
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
  },
  {
    id: '2',
    name: 'Office',
    address: 'Manyata Tech Park, Bangalore',
    type: 'work',
    coordinates: { latitude: 13.0389, longitude: 77.6197 },
  },
];

export const mockPromoCodes = [
  {
    id: '1',
    code: 'FIRST50',
    title: 'First Ride Offer',
    description: 'Get 50% off on your first ride',
    discount: 50,
    type: 'percentage',
    minAmount: 0,
    maxDiscount: 100,
    validTill: '2024-12-31',
  },
  {
    id: '2',
    code: 'SAVE20',
    title: 'Flat ₹20 Off',
    description: 'Save ₹20 on rides above ₹100',
    discount: 20,
    type: 'fixed',
    minAmount: 100,
    maxDiscount: 20,
    validTill: '2024-12-31',
  },
];

export const onboardingData = [
  {
    id: '1',
    title: 'Quick & Safe Rides',
    description: 'Get a bike ride in minutes with verified drivers and real-time tracking',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Affordable Pricing',
    description: 'Transparent pricing with no hidden charges. Pay less, travel more',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Beat the Traffic',
    description: 'Navigate through traffic easily and reach your destination faster',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop',
  },
];
