import { Request, ResponseToolkit } from "@hapi/hapi";

/**
 * This file is automatically generated from swagger.  It is safe to overwrite an existing file with this one.
 *
 * This file defines the interface that the TeamController must conform to.  This helps the Typescript
 * compiler to alert the developer when the swagger specification for methods covered by this controller have changed, and the
 * developer needs to make changes to the implementation in order to support the updated API.
 */
interface ITeamController {



  /**
  * Add a new team to the system
  */
  public async addTeam(request: Request, toolkit: ResponseToolkit);

  /**
  * Finds all the teams
  */
  public async findTeams(request: Request, toolkit: ResponseToolkit);

  /**
  * Returns a single team
  */
  public async getTeamById(request: Request, toolkit: ResponseToolkit);

  /**
  * Updates an existing team by ID
  */
  public async updateTeam(request: Request, toolkit: ResponseToolkit);

  /**
  * Deletes a team by ID
  */
  public async deleteTeam(request: Request, toolkit: ResponseToolkit);

}

export { ITeamController }
