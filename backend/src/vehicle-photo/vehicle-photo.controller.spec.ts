import { Test, TestingModule } from '@nestjs/testing';
import { VehiclePhotoController } from './vehicle-photo.controller';

describe('VehiclePhotoController', () => {
  let controller: VehiclePhotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclePhotoController],
    }).compile();

    controller = module.get<VehiclePhotoController>(VehiclePhotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
