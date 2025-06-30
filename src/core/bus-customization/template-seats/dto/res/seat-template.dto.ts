import { TemplateSeatDto } from './template-seat.dto';

export class SeatTemplateDto {
  id: number;
  name: string;
  description?: string;
  totalSeats: number;
  rows: number;
  columns: number;
  floors: number;
  isActive: boolean;
  createdAt: Date;
  templateSeats: TemplateSeatDto[];
} 