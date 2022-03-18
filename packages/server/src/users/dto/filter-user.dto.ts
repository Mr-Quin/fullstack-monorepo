import { IsBoolean, IsOptional } from 'class-validator'

export class FilterUserDto {
    // any string is treated as true because of implicit conversion... maybe fix this later
    @IsOptional()
    @IsBoolean()
    qualified: boolean = false
}
