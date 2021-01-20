import { Expose } from "class-transformer";

export class ShowServiceDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;
}