import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Core } from 'src/common/entities/core.entity';
import Restaurant from '../entities/restaurant.entity';

class RestaurantInfo extends Restaurant {
  @ApiProperty({ description: '소속구' })
  local: string;
}

export class GetRestaurantsQuery {
  locationInfo: string;
}

export class GetRestaurantsOutput extends PickType(Core, ['error', 'ok']) {
  @ApiPropertyOptional({ type: [RestaurantInfo] })
  restaurants?: Restaurant[];
}
