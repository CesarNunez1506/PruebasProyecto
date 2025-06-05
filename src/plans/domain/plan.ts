import { ApiProperty } from '@nestjs/swagger';

const idType = Number;

export class Plan {
  @ApiProperty({ type: idType })
  id: number | string;

  @ApiProperty({ type: String, example: 'Premium Plan' })
  name: string;

  @ApiProperty({ type: Number, example: 29.99 })
  price: number;

  @ApiProperty({
    type: [String],
    example: ['Access to all features', '24/7 Support', 'Monthly reports'],
  })
  features: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
