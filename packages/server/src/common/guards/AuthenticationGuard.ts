import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { ApiKeyService } from '../api-key.service'

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private readonly apiKeyService: ApiKeyService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        return this.apiKeyService.validateHttpRequest(request)
    }
}
