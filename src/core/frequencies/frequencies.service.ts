import { Injectable } from "@nestjs/common";
import { FrequencyFiltersReqDto } from "./dto/req/frequency-filters.dto";
import { FrequenciesRepository } from "./frequencies.repository";




@Injectable()

export class FrequenciesService {

constructor(private readonly repository: FrequenciesRepository) {}

    async findAll(filters: FrequencyFiltersReqDto){
        const [entities, total] = await this.repository.findMany(filters)
    } 
}