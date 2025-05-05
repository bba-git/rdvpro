"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const signature_controller_1 = require("./signature.controller");
const signature_service_1 = require("./signature.service");
const mockSignatureService = {
    createSignature: jest.fn().mockResolvedValue({}),
    getSignature: jest.fn().mockResolvedValue({}),
    updateSignature: jest.fn().mockResolvedValue({}),
    deleteSignature: jest.fn().mockResolvedValue({}),
};
describe('SignatureController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [signature_controller_1.SignatureController],
            providers: [
                { provide: signature_service_1.SignatureService, useValue: mockSignatureService },
            ],
        }).compile();
        controller = module.get(signature_controller_1.SignatureController);
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
//# sourceMappingURL=signature.controller.spec.js.map