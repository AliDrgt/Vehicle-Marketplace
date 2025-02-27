import { Test, TestingModule } from '@nestjs/testing';
import { VehiclePhotoService } from './vehicle-photo.service';

describe('VehiclePhotoService', () => {
  let service: VehiclePhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclePhotoService],
    }).compile();

    service = module.get<VehiclePhotoService>(VehiclePhotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
