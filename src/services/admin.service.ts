import { PrismaClient } from "@prisma/client";
import { Event } from "../models/models"; // Adjust according to your actual model file
import { eventSchema } from "../validators/event.validator"; // Adjust according to your actual validator file

export class AdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Retrieve all events
  async getEvents() {
    return this.prisma.events.findMany();
  }

  // Retrieve a specific event by ID
  async getEventById(eventId: number) {
    return this.prisma.events.findUnique({
      where: { event_id: eventId },
    });
  }

  // Create a new event
  async createEvent(data: Event) {
    // Validate the incoming event data
    const validatedData = eventSchema.parse(data);

    // Create a new event in the database
    return this.prisma.events.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || "",
        date: new Date(), // Adjust date as needed; you may want to take it from data
        stock: validatedData.stock,
        image: validatedData.image,
        category: validatedData.category, // Assuming category corresponds to venue
        price: validatedData.price,
        discounted_price: validatedData.price, // Default to price initially
        created_by: 1, // Replace with the actual admin user ID
      },
    });
  }

  // Update an existing event
  async updateEvent(eventId: number, data: Partial<Event>) {
    // Validate the incoming event data if necessary
    const validatedData = eventSchema.partial().parse(data); // Validate only provided fields

    return this.prisma.events.update({
      where: { event_id: eventId },
      data: {
        ...validatedData,
        stock: validatedData.stock ? validatedData.stock : undefined,
      },
    });
  }

  // Delete an event
  async deleteEvent(eventId: number) {
    return this.prisma.events.delete({
      where: { event_id: eventId },
    });
  }

  // Retrieve all transactions with related user and event details
  async getTransactionHistory() {
    return this.prisma.transactions.findMany({
      include: {
        user: true,    // Include related user details
        event: true,   // Include related event details
      },
    });
  }

  // Retrieve all coupons (admin use case)
  async getCoupons() {
    return this.prisma.coupons.findMany();
  }

  // Creating Coupons for Transaction.
  async createCoupon(couponData: {
    code: string;
    discount_percentage: number;
    start_date: Date;
    end_date: Date;
    created_by: number;
  }) {
    try {
      const newCoupon = await this.prisma.coupons.create({
        data: {
          code: couponData.code,
          discount_percentage: couponData.discount_percentage,
          start_date: couponData.start_date,
          end_date: couponData.end_date,
          created_by: couponData.created_by,
        },
      });
      return newCoupon;
    } catch (error) {
      console.error("Error creating coupon:", error);
      throw new Error("Could not create coupon");
    }
  }
}