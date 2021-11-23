import 'automapper-ts';
import { injectable } from 'inversify';
import { TeamDTO } from '../../dto/team';
import { Team } from '../../entity/Team';

/**
 * Wrapper around automapper, for dependency injection convenience (static/global variables bad)
 */
@injectable()
class TeamMapper {

  /**
   * Helper method, shorthand for "map all properties of the source to the same properties in
   * the destination".  This is useful when your model and entity share the same structuer.
   */
  private createDefaultMap(
    fromType: any,
    toType: any,
    fields: Array<string>
  ): AutoMapperJs.ICreateMapFluentFunctions {
    const map = automapper.createMap(fromType, toType);
    fields.forEach(key => {
      map.forMember(key, (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom(key));
    });

    return map;
  }

  /** 
   * Helper method, creates mappings between two types in both directions 
   */
  private createDefaultBiDiMap(
    typeA: any,
    typeB: any,
    fields: Array<string>
  ): Array<AutoMapperJs.ICreateMapFluentFunctions> {
    return [
      this.createDefaultMap(typeA, typeB, fields),
      this.createDefaultMap(typeB, typeA, fields)
    ];
  }

  constructor() {
    // Add code here to configure mappings
    this.createDefaultBiDiMap(
      TeamDTO,
      Team,
      ['id', 'name', 'nationality', 'businessAddress', 'drivers']
    )
  }

  public map(source: any, destination: any, value: any): any {
    return automapper.map(source, destination, value);
  }
}

export { TeamMapper }