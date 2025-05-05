"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const signature_service_1 = require("./signature.service");
describe('SignatureService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [signature_service_1.SignatureService],
        }).compile();
        service = module.get(signature_service_1.SignatureService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('createSignature returns object', async () => {
        expect(await service.createSignature({})).toEqual({});
    });
    it('getSignature returns object', async () => {
        expect(await service.getSignature('id')).toEqual({});
    });
    it('updateSignature returns object', async () => {
        expect(await service.updateSignature('id', {})).toEqual({});
    });
    it('deleteSignature returns object', async () => {
        expect(await service.deleteSignature('id')).toEqual({});
    });
});
//# sourceMappingURL=signature.service.spec.js.map