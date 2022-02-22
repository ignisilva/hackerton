import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalGradeService } from 'src/local-grade/local-grade.service';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  GetRestaurantsOutput,
  GetRestaurantsQuery,
} from './dtos/get-restaurant.dto';
import Restaurant from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,

    private readonly localGradeService: LocalGradeService,
  ) {}

  async createRestaurant({
    name,
    address,
    kindOf,
    latitude,
    longitude,
    local,
  }: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
    try {
      const localGrade = await this.localGradeService.getLocalGrade(local);
      await this.restaurantRepo.save(
        this.restaurantRepo.create({
          name,
          address,
          kindOf,
          latitude,
          longitude,
          localGrade,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: true,
        error,
      };
    }
  }

  async getRestaurants({
    locationInfo,
  }: GetRestaurantsQuery): Promise<GetRestaurantsOutput> {
    try {
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
