import { Module } from "@nestjs/common";
import { SeatTypesRepository } from "./seat-types.repository";
import { SeatTypesService } from "./seat-types.service";
import { SeatTypesController } from "./seat-types.controller";



@Module({
    controllers: [SeatTypesController],
    providers: [SeatTypesRepository, SeatTypesService],
})

export class SeatTypesModule {}