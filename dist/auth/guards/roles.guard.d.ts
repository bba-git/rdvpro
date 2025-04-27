import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class RolesGuard implements CanActivate {
    private readonly allowedRoles;
    constructor(allowedRoles: string[]);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
