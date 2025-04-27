import { Test, TestingModule } from '@nestjs/testing';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';

const mockSignatureService = {
  createSignature: jest.fn().mockResolvedValue({}),
  getSignature: jest.fn().mockResolvedValue({}),
  updateSignature: jest.fn().mockResolvedValue({}),
  deleteSignature: jest.fn().mockResolvedValue({}),
};

describe('SignatureController', () => {
  let controller: SignatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignatureController],
      providers: [
        { provide: SignatureService, useValue: mockSignatureService },
      ],
    }).compile();
    controller = module.get<SignatureController>(SignatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create returns object', async () => {
    expect(await controller.create()).toEqual({});
  });

  it('get returns object', async () => {
    expect(await controller.get('id')).toEqual({});
  });

  it('update returns object', async () => {
    expect(await controller.update('id')).toEqual({});
  });

  it('delete returns object', async () => {
    expect(await controller.delete('id')).toEqual({});
  });
}); 