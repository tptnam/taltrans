import { ResponseTransformer } from '../../plugins/transformer'

export class BaseMapper {
  static toDto<TDto, TEntity = unknown>(
    entity: TEntity,
    dtoClass: new (...args: never[]) => TDto,
  ): TDto {
    return ResponseTransformer.toResponse(dtoClass, entity)
  }

  static toDtoArray<TDto, TEntity = unknown>(
    entities: TEntity[],
    dtoClass: new (...args: never[]) => TDto,
  ): TDto[] {
    return ResponseTransformer.toResponseArray(dtoClass, entities)
  }
}
