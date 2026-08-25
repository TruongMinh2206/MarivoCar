import { PrismaClient, PriceType, LocationType, UserRole } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

const SALT_ROUNDS = 10

async function main() {
  console.log("🌱 Seeding MARIVO database...")

  // ============ USERS ============
  console.log("👤 Creating users...")
  const adminPassword = await hash("Admin@123456", SALT_ROUNDS)
  const customerPassword = await hash("Customer@123456", SALT_ROUNDS)

  const admin = await prisma.user.upsert({
    where: { email: "admin@marivo.vn" },
    update: {},
    create: {
      email: "admin@marivo.vn",
      name: "MARIVO Admin",
      phone: "+84901234567",
      passwordHash: adminPassword,
      role: UserRole.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  })

  const staff = await prisma.user.upsert({
    where: { email: "staff@marivo.vn" },
    update: {},
    create: {
      email: "staff@marivo.vn",
      name: "Staff Member",
      phone: "+84901234568",
      passwordHash: customerPassword,
      role: UserRole.STAFF,
      emailVerified: new Date(),
    },
  })

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "John Tourist",
      phone: "+84912345678",
      passwordHash: customerPassword,
      role: UserRole.CUSTOMER,
      emailVerified: new Date(),
    },
  })

  console.log("  ✓ Users created")

  // ============ SERVICE CATEGORIES ============
  console.log("📂 Creating service categories...")
  const categories = await Promise.all([
    prisma.serviceCategory.upsert({
      where: { slug: "airport-transfer" },
      update: {},
      create: {
        name: "Airport Transfer",
        slug: "airport-transfer",
        description: "Comfortable airport pickup and drop-off services in Phu Quoc",
        icon: "plane-landing",
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "private-car" },
      update: {},
      create: {
        name: "Private Car",
        slug: "private-car",
        description: "Private car rental with driver for personalized travel",
        icon: "car",
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "rent-a-car" },
      update: {},
      create: {
        name: "Rent a Car",
        slug: "rent-a-car",
        description: "Self-drive car rental for independent exploration",
        icon: "key",
        isActive: true,
        sortOrder: 3,
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "tours" },
      update: {},
      create: {
        name: "Tours & Experiences",
        slug: "tours",
        description: "Discover the best tours and experiences in Phu Quoc",
        icon: "map",
        isActive: true,
        sortOrder: 4,
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "tickets" },
      update: {},
      create: {
        name: "Sightseeing Tickets",
        slug: "tickets",
        description: "Entry tickets to attractions, shows, and theme parks",
        icon: "ticket",
        isActive: true,
        sortOrder: 5,
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "hotels" },
      update: {},
      create: {
        name: "Hotels",
        slug: "hotels",
        description: "Best hotels and resorts in Phu Quoc",
        icon: "building",
        isActive: true,
        sortOrder: 6,
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "restaurants" },
      update: {},
      create: {
        name: "Restaurants",
        slug: "restaurants",
        description: "Top dining experiences and local cuisine",
        icon: "utensils",
        isActive: true,
        sortOrder: 7,
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "spa" },
      update: {},
      create: {
        name: "Spa & Wellness",
        slug: "spa",
        description: "Relax and rejuvenate at the best spas",
        icon: "sparkles",
        isActive: true,
        sortOrder: 8,
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "products" },
      update: {},
      create: {
        name: "Local Products",
        slug: "products",
        description: "Authentic Phu Quoc specialties and souvenirs",
        icon: "shopping-bag",
        isActive: true,
        sortOrder: 9,
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "guide" },
      update: {},
      create: {
        name: "Phu Quoc Guide",
        slug: "guide",
        description: "Your complete guide to Phu Quoc island",
        icon: "book-open",
        isActive: true,
        sortOrder: 10,
      },
    }),
  ])

  const [
    catAirportTransfer,
    catPrivateCar,
    catRentACar,
    catTours,
    catTickets,
    catHotels,
    catRestaurants,
    catSpa,
    catProducts,
    catGuide,
  ] = categories

  console.log("  ✓ Categories created")

  // ============ LOCATIONS ============
  console.log("📍 Creating locations...")
  const locations = await Promise.all([
    prisma.location.upsert({
      where: { slug: "phu-quoc-airport" },
      update: {},
      create: {
        name: "Phu Quoc International Airport (PQC)",
        slug: "phu-quoc-airport",
        type: LocationType.AIRPORT,
        address: "Duong To, Phu Quoc, Kien Giang",
        latitude: 10.2270,
        longitude: 103.9635,
        area: "Duong To",
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "hon-thom-cable-car" },
      update: {},
      create: {
        name: "Hon Thom Cable Car Station",
        slug: "hon-thom-cable-car",
        type: LocationType.ATTRACTION,
        address: "An Thoi, Phu Quoc, Kien Giang",
        latitude: 10.0435,
        longitude: 104.0068,
        area: "An Thoi",
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "duong-dong" },
      update: {},
      create: {
        name: "Duong Dong Town",
        slug: "duong-dong",
        type: LocationType.CITY,
        address: "Duong Dong, Phu Quoc, Kien Giang",
        latitude: 10.2245,
        longitude: 103.9665,
        area: "Duong Dong",
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "khem-beach" },
      update: {},
      create: {
        name: "Khem Beach",
        slug: "khem-beach",
        type: LocationType.ATTRACTION,
        address: "An Thoi, Phu Quoc, Kien Giang",
        latitude: 10.0132,
        longitude: 104.0193,
        area: "An Thoi",
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "sao-beach" },
      update: {},
      create: {
        name: "Sao Beach",
        slug: "sao-beach",
        type: LocationType.ATTRACTION,
        address: "An Thoi, Phu Quoc, Kien Giang",
        latitude: 10.0685,
        longitude: 104.0257,
        area: "An Thoi",
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "vinpearl-safari" },
      update: {},
      create: {
        name: "Vinpearl Safari Phu Quoc",
        slug: "vinpearl-safari",
        type: LocationType.ATTRACTION,
        address: "Bai Dai, Ganh Dau, Phu Quoc",
        latitude: 10.2198,
        longitude: 103.9332,
        area: "Ganh Dau",
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "vinwonders" },
      update: {},
      create: {
        name: "VinWonders Phu Quoc",
        slug: "vinwonders",
        type: LocationType.ATTRACTION,
        address: "Bai Dai, Ganh Dau, Phu Quoc",
        latitude: 10.2205,
        longitude: 103.9325,
        area: "Ganh Dau",
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "long-beach" },
      update: {},
      create: {
        name: "Long Beach (Bai Truong)",
        slug: "long-beach",
        type: LocationType.ATTRACTION,
        address: "Duong To, Phu Quoc, Kien Giang",
        latitude: 10.1860,
        longitude: 103.9755,
        area: "Duong To",
        isActive: true,
      },
    }),
    // Hotels
    prisma.location.upsert({
      where: { slug: "jw-marriott-phu-quoc" },
      update: {},
      create: {
        name: "JW Marriott Phu Quoc Emerald Bay",
        slug: "jw-marriott-phu-quoc",
        type: LocationType.RESORT,
        address: "Khem Beach, An Thoi, Phu Quoc",
        latitude: 10.0135,
        longitude: 104.0190,
        area: "An Thoi",
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "intercontinental-phu-quoc" },
      update: {},
      create: {
        name: "InterContinental Phu Quoc Long Beach",
        slug: "intercontinental-phu-quoc",
        type: LocationType.RESORT,
        address: "Long Beach, Duong To, Phu Quoc",
        latitude: 10.1865,
        longitude: 103.9750,
        area: "Duong To",
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "sheraton-phu-quoc" },
      update: {},
      create: {
        name: "Sheraton Phu Quoc Resort",
        slug: "sheraton-phu-quoc",
        type: LocationType.RESORT,
        address: "Mang Cau, Phu Quoc",
        latitude: 10.2285,
        longitude: 103.9515,
        area: "Mang Cau",
        isActive: true,
      },
    }),
  ])

  console.log("  ✓ Locations created")

  // ============ VEHICLE TYPES ============
  console.log("🚗 Creating vehicle types...")
  const vehicleTypes = await Promise.all([
    prisma.vehicleType.upsert({
      where: { slug: "sedan" },
      update: {},
      create: {
        name: "Sedan",
        slug: "sedan",
        description: "Comfortable 4-seat sedan for couples and small groups",
        seats: 4,
        luggage: 3,
        icon: "sedan",
        isActive: true,
      },
    }),
    prisma.vehicleType.upsert({
      where: { slug: "suv" },
      update: {},
      create: {
        name: "SUV",
        slug: "suv",
        description: "Spacious SUV for families and small groups",
        seats: 7,
        luggage: 5,
        icon: "suv",
        isActive: true,
      },
    }),
    prisma.vehicleType.upsert({
      where: { slug: "minivan" },
      update: {},
      create: {
        name: "Minivan",
        slug: "minivan",
        description: "Comfortable minivan for larger groups",
        seats: 16,
        luggage: 10,
        icon: "minivan",
        isActive: true,
      },
    }),
    prisma.vehicleType.upsert({
      where: { slug: "motorbike" },
      update: {},
      create: {
        name: "Motorbike",
        slug: "motorbike",
        description: "Motorbike rental for solo adventurers",
        seats: 1,
        luggage: 1,
        icon: "motorbike",
        isActive: true,
      },
    }),
  ])

  const [vtSedan, vtSUV, vtMinivan, vtMotorbike] = vehicleTypes
  console.log("  ✓ Vehicle types created")

  // ============ SERVICES ============
  console.log("🎯 Creating services...")

  // --- Airport Transfer Services ---
  const airportTransferSedan = await prisma.service.upsert({
    where: { slug: "airport-transfer-sedan" },
    update: {},
    create: {
      name: "Airport Transfer - Sedan (4 Seats)",
      slug: "airport-transfer-sedan",
      shortDescription: "Comfortable airport transfer with 4-seat sedan",
      description:
        "Enjoy a comfortable ride from Phu Quoc Airport to your hotel or any destination on the island. Our professional drivers will ensure a safe and pleasant journey. Includes meet & greet at the airport, free cancellation up to 24 hours, and complimentary bottled water.",
      categoryId: catAirportTransfer.id,
      locationId: locations[0].id, // Airport
      basePrice: 350000,
      currency: "VND",
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      metadata: {
        duration: "30-45 min",
        pickupIncluded: true,
        meetAndGreet: true,
        freeWater: true,
      },
      policies: {
        freeCancellation: "Up to 24 hours before pickup",
        childPolicy: "Children under 6 free when sharing seat",
        waitingTime: "60 minutes free after flight arrival",
      },
      cancellationPolicy: {
        allowed: true,
        cutoff: 24,
        refundType: "FULL",
        refundPercentage: 100,
        conditions: "Free cancellation up to 24 hours before pickup",
      },
    },
  })

  const airportTransferSUV = await prisma.service.upsert({
    where: { slug: "airport-transfer-suv" },
    update: {},
    create: {
      name: "Airport Transfer - SUV (7 Seats)",
      slug: "airport-transfer-suv",
      shortDescription: "Spacious airport transfer with 7-seat SUV",
      description:
        "Perfect for families and groups, our 7-seat SUV offers ample space for passengers and luggage. Includes professional driver, meet & greet service, and complimentary refreshments.",
      categoryId: catAirportTransfer.id,
      locationId: locations[0].id,
      basePrice: 500000,
      currency: "VND",
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
      metadata: {
        duration: "30-45 min",
        pickupIncluded: true,
        meetAndGreet: true,
        freeWater: true,
      },
      policies: {
        freeCancellation: "Up to 24 hours before pickup",
        childPolicy: "Children under 6 free when sharing seat",
        waitingTime: "60 minutes free after flight arrival",
      },
      cancellationPolicy: {
        allowed: true,
        cutoff: 24,
        refundType: "FULL",
        refundPercentage: 100,
      },
    },
  })

  const airportTransferMinivan = await prisma.service.upsert({
    where: { slug: "airport-transfer-minivan" },
    update: {},
    create: {
      name: "Airport Transfer - Minivan (16 Seats)",
      slug: "airport-transfer-minivan",
      shortDescription: "Group airport transfer with 16-seat minivan",
      description:
        "Ideal for large groups and tour parties. Our 16-seat minivan provides comfortable transportation with generous luggage space. Professional driver and door-to-door service included.",
      categoryId: catAirportTransfer.id,
      locationId: locations[0].id,
      basePrice: 800000,
      currency: "VND",
      isActive: true,
      isFeatured: false,
      sortOrder: 3,
      metadata: {
        duration: "30-45 min",
        pickupIncluded: true,
        meetAndGreet: true,
      },
      policies: {
        freeCancellation: "Up to 48 hours before pickup",
        waitingTime: "60 minutes free after flight arrival",
      },
      cancellationPolicy: {
        allowed: true,
        cutoff: 48,
        refundType: "FULL",
        refundPercentage: 100,
      },
    },
  })

  // --- Private Car Services ---
  const privateCarSedan = await prisma.service.upsert({
    where: { slug: "private-car-sedan" },
    update: {},
    create: {
      name: "Private Car with Driver - Sedan",
      slug: "private-car-sedan",
      shortDescription: "Hire a private car with professional driver",
      description:
        "Explore Phu Quoc at your own pace with a private car and experienced local driver. Perfect for sightseeing, shopping, or business travel. Hourly and daily rates available.",
      categoryId: catPrivateCar.id,
      basePrice: 200000,
      currency: "VND",
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      metadata: {
        type: "private-car",
        hourlyRate: 200000,
        fullDayRate: 1200000,
        maxHours: 12,
      },
      policies: {
        pricing: "Per hour, minimum 3 hours",
        cancellation: "Free cancellation up to 12 hours",
      },
    },
  })

  const privateCarSUV = await prisma.service.upsert({
    where: { slug: "private-car-suv" },
    update: {},
    create: {
      name: "Private Car with Driver - SUV",
      slug: "private-car-suv",
      shortDescription: "Spacious private SUV with driver for families",
      description:
        "Our 7-seat SUV with professional driver is perfect for family outings and group travel. Enjoy the comfort and space while our experienced driver navigates the island.",
      categoryId: catPrivateCar.id,
      basePrice: 300000,
      currency: "VND",
      isActive: true,
      isFeatured: false,
      sortOrder: 2,
      metadata: {
        type: "private-car",
        hourlyRate: 300000,
        fullDayRate: 1800000,
        maxHours: 12,
      },
    },
  })

  // --- Tours ---
  const fourIslandsTour = await prisma.service.upsert({
    where: { slug: "four-islands-tour" },
    update: {},
    create: {
      name: "4 Islands Tour by Speedboat",
      slug: "four-islands-tour",
      shortDescription: "Visit 4 stunning islands around Phu Quoc",
      description:
        "Experience the beauty of Phu Quoc's surrounding islands on this exciting speedboat tour. Visit May Rut Island, Thom Island, Gam Ghi Island, and Addison's Reef. Snorkeling equipment, lunch, and drinks included.",
      categoryId: catTours.id,
      locationId: locations[1].id,
      basePrice: 1200000,
      currency: "VND",
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      metadata: {
        duration: "Full day (8 hours)",
        groupSize: "2-20 people",
        languages: ["English", "Vietnamese"],
        includes: [
          "Hotel pickup/drop-off",
          "Speedboat transfer",
          "Snorkeling equipment",
          "Lunch",
          "Drinks",
          "Insurance",
        ],
        excludes: ["Tips", "Personal expenses"],
      },
      policies: {
        departure: "8:00 AM from An Thoi Port",
        return: "4:00 PM",
        bring: "Swimwear, sunscreen, camera",
      },
    },
  })

  const sunsetFishingTour = await prisma.service.upsert({
    where: { slug: "sunset-fishing-tour" },
    update: {},
    create: {
      name: "Sunset Squid Fishing Tour",
      slug: "sunset-fishing-tour",
      shortDescription: "Traditional squid fishing at sunset",
      description:
        "Join local fishermen for an authentic squid fishing experience as the sun sets over the Gulf of Thailand. Learn traditional fishing techniques, enjoy fresh catch, and watch the stunning Phu Quoc sunset.",
      categoryId: catTours.id,
      basePrice: 800000,
      currency: "VND",
      isActive: true,
      isFeatured: false,
      sortOrder: 2,
      metadata: {
        duration: "4 hours",
        groupSize: "2-15 people",
        includes: ["Fishing equipment", "Bait", "Snacks", "Drinks"],
      },
    },
  })

  // --- Tickets ---
  const vinWondersTicket = await prisma.service.upsert({
    where: { slug: "vinwonders-ticket" },
    update: {},
    create: {
      name: "VinWonders Phu Quoc Entry Ticket",
      slug: "vinwonders-ticket",
      shortDescription: "Entry ticket to VinWonders theme park",
      description:
        "Get access to VinWonders Phu Quoc, the largest theme park in Vietnam. Enjoy thrilling rides, water park, aquarium, and live shows. Perfect for families and adventure seekers.",
      categoryId: catTickets.id,
      locationId: locations[6].id,
      basePrice: 950000,
      currency: "VND",
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      metadata: {
        validFor: "Single day entry",
        openingHours: "9:00 AM - 9:00 PM",
        includes: [
          "All rides and attractions",
          "Water park access",
          "Aquarium",
          "Live shows",
        ],
      },
    },
  })

  const safariTicket = await prisma.service.upsert({
    where: { slug: "vinpearl-safari-ticket" },
    update: {},
    create: {
      name: "Vinpearl Safari Phu Quoc Entry Ticket",
      slug: "vinpearl-safari-ticket",
      shortDescription: "Explore the largest safari in Vietnam",
      description:
        "Visit Vinpearl Safari, home to over 3,000 animals from 150 species. Experience the open safari tram ride, animal shows, and interactive zones.",
      categoryId: catTickets.id,
      locationId: locations[5].id,
      basePrice: 650000,
      currency: "VND",
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
      metadata: {
        validFor: "Single day entry",
        openingHours: "9:00 AM - 4:00 PM",
        includes: ["Safari tram ride", "All exhibits", "Animal shows"],
      },
    },
  })

  // --- Hotels ---
  const jwMarriott = await prisma.service.upsert({
    where: { slug: "jw-marriott-phu-quoc-emerald-bay" },
    update: {},
    create: {
      name: "JW Marriott Phu Quoc Emerald Bay Resort & Spa",
      slug: "jw-marriott-phu-quoc-emerald-bay",
      shortDescription: "Luxury beachfront resort on Khem Beach",
      description:
        "Designed by Bill Bensley, JW Marriott Phu Quoc Emerald Bay is a stunning beachfront resort featuring luxurious rooms, world-class dining, a spa, and direct access to the pristine Khem Beach.",
      categoryId: catHotels.id,
      locationId: locations[8].id,
      basePrice: 5000000,
      currency: "VND",
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      metadata: {
        stars: 5,
        amenities: ["Pool", "Spa", "Beach", "Restaurant", "Bar", "Gym", "Kids Club"],
        checkIn: "15:00",
        checkOut: "12:00",
      },
    },
  })

  // --- Restaurants ---
  const crabHouse = await prisma.service.upsert({
    where: { slug: "crab-house-phu-quoc" },
    update: {},
    create: {
      name: "Crab House - Seafood Restaurant",
      slug: "crab-house-phu-quoc",
      shortDescription: "Fresh seafood with ocean views",
      description:
        "Enjoy the freshest seafood in Phu Quoc at Crab House. Located on the waterfront, we offer a wide selection of crabs, prawns, fish, and shellfish, all caught daily by local fishermen.",
      categoryId: catRestaurants.id,
      locationId: locations[2].id,
      basePrice: 200000,
      currency: "VND",
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      metadata: {
        cuisine: "Vietnamese Seafood",
        openingHours: "10:00 AM - 10:00 PM",
        priceRange: "$$",
        reservation: true,
      },
    },
  })

  // --- Spa ---
  const spaRetreat = await prisma.service.upsert({
    where: { slug: "phu-quoc-spa-retreat" },
    update: {},
    create: {
      name: "Phu Quoc Spa Retreat",
      slug: "phu-quoc-spa-retreat",
      shortDescription: "Traditional Vietnamese spa treatments",
      description:
        "Immerse yourself in relaxation at Phu Quoc Spa Retreat. Our skilled therapists offer traditional Vietnamese massages, aromatherapy, body scrubs, and facial treatments using local ingredients.",
      categoryId: catSpa.id,
      locationId: locations[7].id,
      basePrice: 400000,
      currency: "VND",
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      metadata: {
        services: [
          "Vietnamese Traditional Massage",
          "Aromatherapy Massage",
          "Body Scrub",
          "Facial Treatment",
          "Foot Reflexology",
        ],
        openingHours: "9:00 AM - 9:00 PM",
      },
    },
  })

  console.log("  ✓ Services created")

  // ============ SERVICE IMAGES ============
  console.log("🖼️ Creating service images...")
  await Promise.all([
    prisma.serviceImage.create({
      data: {
        serviceId: airportTransferSedan.id,
        url: "/images/services/airport-transfer-sedan.jpg",
        alt: "Airport transfer sedan at Phu Quoc Airport",
        isPrimary: true,
        sortOrder: 0,
      },
    }),
    prisma.serviceImage.create({
      data: {
        serviceId: airportTransferSUV.id,
        url: "/images/services/airport-transfer-suv.jpg",
        alt: "Airport transfer SUV for families",
        isPrimary: true,
        sortOrder: 0,
      },
    }),
    prisma.serviceImage.create({
      data: {
        serviceId: airportTransferMinivan.id,
        url: "/images/services/airport-transfer-minivan.jpg",
        alt: "Airport transfer minivan for groups",
        isPrimary: true,
        sortOrder: 0,
      },
    }),
    prisma.serviceImage.create({
      data: {
        serviceId: privateCarSedan.id,
        url: "/images/services/private-car-sedan.jpg",
        alt: "Private sedan with driver",
        isPrimary: true,
        sortOrder: 0,
      },
    }),
    prisma.serviceImage.create({
      data: {
        serviceId: fourIslandsTour.id,
        url: "/images/services/four-islands-tour.jpg",
        alt: "4 Islands Tour speedboat adventure",
        isPrimary: true,
        sortOrder: 0,
      },
    }),
    prisma.serviceImage.create({
      data: {
        serviceId: vinWondersTicket.id,
        url: "/images/services/vinwonders.jpg",
        alt: "VinWonders Phu Quoc theme park",
        isPrimary: true,
        sortOrder: 0,
      },
    }),
  ])

  console.log("  ✓ Service images created")

  // ============ SERVICE PRICES ============
  console.log("💰 Creating service prices...")
  await Promise.all([
    // Airport Transfer Sedan - Round Trip discount
    prisma.servicePrice.create({
      data: {
        serviceId: airportTransferSedan.id,
        name: "Round Trip Discount",
        priceType: PriceType.PROMOTIONAL,
        basePrice: 300000,
        currency: "VND",
        minQuantity: 2,
        maxQuantity: 2,
        isActive: true,
      },
    }),
    // Peak Season pricing
    prisma.servicePrice.create({
      data: {
        serviceId: airportTransferSedan.id,
        name: "Peak Season Surcharge",
        priceType: PriceType.PEAK_SEASON,
        basePrice: 450000,
        currency: "VND",
        minQuantity: 1,
        isActive: true,
        validFrom: new Date("2025-12-20"),
        validUntil: new Date("2026-01-05"),
      },
    }),
    // 4 Islands Tour - Group pricing
    prisma.servicePrice.create({
      data: {
        serviceId: fourIslandsTour.id,
        name: "Group Rate (4+ people)",
        priceType: PriceType.GROUP,
        basePrice: 1000000,
        currency: "VND",
        minQuantity: 4,
        isActive: true,
      },
    }),
  ])

  console.log("  ✓ Service prices created")

  // ============ SERVICE AVAILABILITY ============
  console.log("📅 Creating service availability...")
  const today = new Date()
  const availabilityPromises: Promise<unknown>[] = []

  // Create daily availability for airport transfer services for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    // Airport Transfer Sedan - 10 per day
    availabilityPromises.push(
      prisma.serviceAvailability.create({
        data: {
          serviceId: airportTransferSedan.id,
          specificDate: date,
          maxCapacity: 10,
          bookedCount: Math.floor(Math.random() * 7),
          isActive: true,
        },
      })
    )

    // Airport Transfer SUV - 8 per day
    availabilityPromises.push(
      prisma.serviceAvailability.create({
        data: {
          serviceId: airportTransferSUV.id,
          specificDate: date,
          maxCapacity: 8,
          bookedCount: Math.floor(Math.random() * 5),
          isActive: true,
        },
      })
    )

    // Airport Transfer Minivan - 5 per day
    availabilityPromises.push(
      prisma.serviceAvailability.create({
        data: {
          serviceId: airportTransferMinivan.id,
          specificDate: date,
          maxCapacity: 5,
          bookedCount: Math.floor(Math.random() * 3),
          isActive: true,
        },
      })
    )
  }

  await Promise.all(availabilityPromises)
  console.log("  ✓ Service availability created")

  // ============ VEHICLES ============
  console.log("🚗 Creating vehicles...")
  await Promise.all([
    // Airport Transfer vehicles
    prisma.vehicle.create({
      data: {
        serviceId: airportTransferSedan.id,
        vehicleTypeId: vtSedan.id,
        name: "Toyota Vios",
        slug: "toyota-vios-airport",
        description: "Reliable and comfortable sedan for airport transfers",
        seats: 4,
        luggage: 3,
        pricePerTrip: 350000,
        currency: "VND",
        isActive: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        serviceId: airportTransferSUV.id,
        vehicleTypeId: vtSUV.id,
        name: "Toyota Fortuner",
        slug: "toyota-fortuner-airport",
        description: "Spacious SUV perfect for families and groups",
        seats: 7,
        luggage: 5,
        pricePerTrip: 500000,
        currency: "VND",
        isActive: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        serviceId: airportTransferMinivan.id,
        vehicleTypeId: vtMinivan.id,
        name: "Ford Transit",
        slug: "ford-transit-airport",
        description: "Comfortable 16-seat minivan for large groups",
        seats: 16,
        luggage: 10,
        pricePerTrip: 800000,
        currency: "VND",
        isActive: true,
      },
    }),
    // Private Car vehicles
    prisma.vehicle.create({
      data: {
        serviceId: privateCarSedan.id,
        vehicleTypeId: vtSedan.id,
        name: "Toyota Camry",
        slug: "toyota-camry-private",
        description: "Premium sedan for private car service",
        seats: 4,
        luggage: 3,
        pricePerTrip: 200000,
        pricePerHour: 200000,
        currency: "VND",
        isActive: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        serviceId: privateCarSUV.id,
        vehicleTypeId: vtSUV.id,
        name: "Toyota Land Cruiser",
        slug: "toyota-land-cruiser-private",
        description: "Luxury SUV for VIP private car service",
        seats: 7,
        luggage: 5,
        pricePerTrip: 300000,
        pricePerHour: 300000,
        currency: "VND",
        isActive: true,
      },
    }),
  ])

  console.log("  ✓ Vehicles created")

  // ============ HOTEL ============
  console.log("🏨 Creating hotel data...")
  const hotel = await prisma.hotel.create({
    data: {
      serviceId: jwMarriott.id,
      stars: 5,
      amenities: [
        "Private Beach",
        "Outdoor Pool",
        "Spa & Wellness Center",
        "Fitness Center",
        "Restaurant",
        "Bar",
        "Kids Club",
        "Water Sports",
        "Conference Room",
        "Free WiFi",
      ],
      checkIn: "15:00",
      checkOut: "12:00",
    },
  })

  await prisma.hotelRoom.createMany({
    data: [
      {
        hotelId: hotel.id,
        name: "Deluxe Garden View",
        description: "Elegant room with garden views and modern amenities",
        price: 5000000,
        currency: "VND",
        capacity: 2,
        amenities: ["King Bed", "Rain Shower", "Balcony", "Mini Bar"],
        isActive: true,
      },
      {
        hotelId: hotel.id,
        name: "Deluxe Ocean View",
        description: "Stunning ocean views from your private balcony",
        price: 7000000,
        currency: "VND",
        capacity: 2,
        amenities: ["King Bed", "Rain Shower", "Ocean View Balcony", "Mini Bar"],
        isActive: true,
      },
      {
        hotelId: hotel.id,
        name: "Family Suite",
        description: "Spacious suite perfect for families with children",
        price: 12000000,
        currency: "VND",
        capacity: 4,
        amenities: ["2 Bedrooms", "Living Room", "2 Bathrooms", "Kitchenette"],
        isActive: true,
      },
    ],
  })

  console.log("  ✓ Hotel and rooms created")

  // ============ RESTAURANT ============
  console.log("🍽️ Creating restaurant data...")
  await prisma.restaurant.create({
    data: {
      serviceId: crabHouse.id,
      openingHours: {
        monday: "10:00-22:00",
        tuesday: "10:00-22:00",
        wednesday: "10:00-22:00",
        thursday: "10:00-22:00",
        friday: "10:00-23:00",
        saturday: "10:00-23:00",
        sunday: "10:00-22:00",
      },
      menu: {
        categories: [
          {
            name: "Crabs",
            items: [
              { name: "Alaska King Crab", price: "1,200,000 VND/kg" },
              { name: "Flower Crab", price: "450,000 VND/kg" },
              { name: "Mud Crab", price: "550,000 VND/kg" },
            ],
          },
          {
            name: "Prawns",
            items: [
              { name: "Tiger Prawn", price: "650,000 VND/kg" },
              { name: "River Prawn", price: "480,000 VND/kg" },
            ],
          },
          {
            name: "Fish",
            items: [
              { name: "Grilled Snapper", price: "380,000 VND/kg" },
              { name: "Steamed Grouper", price: "420,000 VND/kg" },
            ],
          },
        ],
      },
      contact: {
        phone: "+842973999999",
        email: "info@crabhouse.vn",
      },
      reservation: true,
    },
  })

  console.log("  ✓ Restaurant created")

  // ============ SPA ============
  console.log("💆 Creating spa data...")
  await prisma.spa.create({
    data: {
      serviceId: spaRetreat.id,
      services: [
        {
          name: "Vietnamese Traditional Massage",
          duration: "60 min",
          price: 400000,
          description: "Ancient Vietnamese massage technique for deep relaxation",
        },
        {
          name: "Aromatherapy Massage",
          duration: "90 min",
          price: 600000,
          description: "Essential oils massage for stress relief",
        },
        {
          name: "Body Scrub & Mask",
          duration: "45 min",
          price: 350000,
          description: "Exfoliating body treatment with local ingredients",
        },
        {
          name: "Foot Reflexology",
          duration: "30 min",
          price: 250000,
          description: "Traditional foot massage for energy balance",
        },
      ],
      schedule: {
        open: "09:00",
        close: "21:00",
        lastBooking: "19:00",
      },
    },
  })

  console.log("  ✓ Spa created")

  // ============ GUIDES ============
  console.log("📖 Creating guide data...")
  const guideCat = await prisma.serviceCategory.upsert({
    where: { slug: "guide-articles" },
    update: {},
    create: {
      name: "Guide Articles",
      slug: "guide-articles",
      description: "Travel guides and articles about Phu Quoc",
      icon: "book-open",
      isActive: true,
      sortOrder: 100,
    },
  })

  await prisma.guide.createMany({
    data: [
      {
        categoryId: guideCat.id,
        title: "Top 10 Things to Do in Phu Quoc",
        slug: "top-10-things-to-do",
        content:
          "Phu Quoc island offers a wealth of activities for every type of traveler. From pristine beaches and snorkeling adventures to night markets and pepper farms, here are the top 10 things you shouldn't miss...",
        excerpt: "Discover the best activities and attractions in Phu Quoc",
        heroImage: "/images/guides/top-10.jpg",
        publishedAt: new Date(),
        isPublished: true,
      },
      {
        categoryId: guideCat.id,
        title: "Phu Quoc Food Guide: What to Eat",
        slug: "phu-quoc-food-guide",
        content:
          "Phu Quoc is famous for its fresh seafood, fish sauce, and pepper. Don't miss the night market for local delicacies, and be sure to try the Bun Quay at Dinh Cau Night Market...",
        excerpt: "A complete guide to the best food in Phu Quoc",
        heroImage: "/images/guides/food-guide.jpg",
        publishedAt: new Date(),
        isPublished: true,
      },
      {
        categoryId: guideCat.id,
        title: "Getting Around Phu Quoc: Transportation Guide",
        slug: "phu-quoc-transportation-guide",
        content:
          "From airport transfers to motorbike rentals, this guide covers all transportation options in Phu Quoc. Learn about the best ways to explore the island...",
        excerpt: "Everything you need to know about getting around Phu Quoc",
        heroImage: "/images/guides/transportation.jpg",
        publishedAt: new Date(),
        isPublished: true,
      },
    ],
  })

  console.log("  ✓ Guides created")

  // ============ CONTACT MESSAGES (sample) ============
  console.log("📮 Creating sample contact messages...")
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1234567890",
        subject: "Airport Transfer Inquiry",
        message:
          "Hi, I'm arriving on flight VN1234 on December 25th. I need a transfer from the airport to JW Marriott for 4 adults with 6 luggage pieces. Can you arrange this?",
      },
      {
        name: "Nguyen Van A",
        email: "nguyenvana@example.com",
        phone: "+84901234567",
        subject: "Tour Group Booking",
        message:
          "We have a group of 12 people interested in the 4 Islands Tour. Do you offer group discounts?",
      },
    ],
  })

  console.log("  ✓ Contact messages created")

  console.log("\n✅ Seed completed successfully!")
  console.log(`
  📊 Summary:
  - Users: 3 (Admin, Staff, Customer)
  - Categories: 10 + 1 (guide articles)
  - Locations: 11
  - Vehicle Types: 4
  - Services: 12
  - Vehicles: 5
  - Hotels: 1 with 3 rooms
  - Restaurants: 1
  - Spas: 1
  - Guides: 3
  - Service Availability: 30 days × 3 services
  `)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
