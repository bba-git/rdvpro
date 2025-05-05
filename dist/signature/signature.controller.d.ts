import { SignatureService } from './signature.service';
export declare class SignatureController {
    private readonly signatureService;
    constructor(signatureService: SignatureService);
    create(): Promise<{}>;
    get(id: string): Promise<{}>;
    update(id: string): Promise<{}>;
    delete(id: string): Promise<{}>;
}
