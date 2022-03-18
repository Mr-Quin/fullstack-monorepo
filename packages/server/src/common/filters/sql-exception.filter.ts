import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    InternalServerErrorException,
} from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

@Catch()
export class SqlExceptionFilter extends BaseExceptionFilter {
    isSqlException(exception: any) {
        return exception?.sql !== undefined
    }

    catch(exception: any, host: ArgumentsHost) {
        if (this.isSqlException(exception)) {
            if (exception.errno === 1062) {
                return super.catch(new BadRequestException([exception.message]), host)
            }
            return super.catch(new InternalServerErrorException([exception.message]), host)
        }

        // let the default handler handle other things
        return super.catch(exception, host)
    }
}
