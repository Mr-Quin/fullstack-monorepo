import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

@Catch()
export class SqlExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(SqlExceptionFilter.name)
    isSqlException(exception: any) {
        return exception?.sql !== undefined
    }

    isPostgresException(exception: any) {
        return exception?.code !== undefined
    }

    catch(exception: any, host: ArgumentsHost) {
        this.logger.error(exception)

        if (this.isSqlException(exception)) {
            if (exception.errno === 1062) {
                return super.catch(new BadRequestException([exception.message]), host)
            }
            return super.catch(new InternalServerErrorException([exception.message]), host)
        }
        if (this.isPostgresException(exception)) {
            if (exception.code === '23505') {
                return super.catch(new BadRequestException([exception.detail]), host)
            }
            return super.catch(new InternalServerErrorException([exception.message]), host)
        }

        // let the default handler handle other things
        return super.catch(exception, host)
    }
}
