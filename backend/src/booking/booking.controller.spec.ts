import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

// Mock CreateBookingDto
class CreateBookingDto {
  username: string;
  no_of_people: number;
  date: string;
  time: string;
}

// Mock BookingModel
const mockBookingModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  findClient :jest.fn()
};

describe('BookingController', () => {
  let bookingController: BookingController;
  let bookingService: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        BookingService,
        {
          provide: 'BookingModel',
          useValue: mockBookingModel,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockToken'),
          },
        },
        Reflector,
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    bookingController = module.get<BookingController>(BookingController);
    bookingService = module.get<BookingService>(BookingService);
  });

  describe('create', () => {
    let mockBooking: any;

    beforeEach(() => {
      mockBooking = {
        bookingId: 5,
        username: 'john_doe',
        no_of_people: 4,
        date: '2024-12-25',
        time: '18:00',
      };

      jest.spyOn(bookingService, 'create').mockResolvedValue(mockBooking);
    });

    it('should call bookingService.create and return the created booking', async () => {
      const createBookingDto: CreateBookingDto = {
        username: 'john_doe',
        no_of_people: 4,
        date: '2024-12-25',
        time: '18:00',
      };

      const result = await bookingController.create(createBookingDto);

      expect(result).toEqual(mockBooking);
      expect(bookingService.create).toHaveBeenCalledWith(createBookingDto);
    });

    it('should ensure bookingId is between 1 and 100', async () => {
      const createBookingDto: CreateBookingDto = {
        username: 'john_doe',
        no_of_people: 4,
        date: '2024-12-25',
        time: '18:00',
      };

      const result = await bookingController.create(createBookingDto);

      expect(result.bookingId).toBeGreaterThanOrEqual(1);
      expect(result.bookingId).toBeLessThanOrEqual(100);
    });
  });

  describe('findById', () => {
    it('should return a booking by id', async () => {
      const mockBooking = {
        bookingId: 1,
        username: 'john_doe',
        no_of_people: 4,
        date: new Date('2024-12-25'), // Fixed: using Date object
        time: '18:00',
      };
  
      const bookingId = 1;
  
      // Mock the service call
      jest.spyOn(bookingService, 'findById').mockResolvedValue(mockBooking);
  
      // Call the controller method
      const result = await bookingController.findById(bookingId);
  
      // Assertions
      expect(bookingService.findById).toHaveBeenCalledWith(bookingId);
      expect(result).toEqual(mockBooking);
    });
  
    it('should throw an error if booking not found', async () => {
      const bookingId = 999; // Non-existent booking
  
      // Mock the service to return null or throw an error
      jest.spyOn(bookingService, 'findById').mockResolvedValue(null);
  
      // Call the controller method and expect an error
      await expect(bookingController.findById(bookingId)).rejects.toThrow(
        new Error('Booking not found'),
      );
    });

  });  

  describe('findClient', () => {
    it('should return bookings for a specific username', async () => {
      const mockBookings = [
        {
          bookingId: 1,
          username: 'john_doe',
          no_of_people: 4,
          date: new Date('2024-12-25'),
          time: '18:00',
        },
        {
          bookingId: 2,
          username: 'john_doe',
          no_of_people: 2,
          date: new Date('2024-12-26'),
          time: '12:00',
        },
      ];
      const username = 'john_doe';
  
      // Mock the service call
      jest.spyOn(bookingService, 'findClient').mockResolvedValue(mockBookings);
  
      // Call the controller method
      const result = await bookingController.findClient(username);
  
      // Assertions
      expect(bookingService.findClient).toHaveBeenCalledWith(username);
      expect(result).toEqual(mockBookings);
    });
  
    it('should return an empty array if no bookings are found', async () => {
      const username = 'non_existent_user';
  
      // Mock the service to return an empty array
      jest.spyOn(bookingService, 'findClient').mockResolvedValue([]);
  
      // Call the controller method
      const result = await bookingController.findClient(username);
  
      // Assertions
      expect(bookingService.findClient).toHaveBeenCalledWith(username);
      expect(result).toEqual([]);
    });
  
    it('should throw an error if the service call fails', async () => {
      const username = 'john_doe';
  
      // Mock the service to throw an error
      jest.spyOn(bookingService, 'findClient').mockRejectedValue(
        new Error('Service error'),
      );
  
      // Call the controller method and expect an error
      await expect(bookingController.findClient(username)).rejects.toThrow(
        new Error('Service error'),
      );
    });
  });

});
