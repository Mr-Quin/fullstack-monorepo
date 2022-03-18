import { Test, TestingModule } from '@nestjs/testing'
import { BanksService } from './banks.service'

describe('BanksService', () => {
    let service: BanksService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BanksService],
        }).compile()

        service = module.get<BanksService>(BanksService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
