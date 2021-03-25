import CubeClass from '../../../code/game/cube.js';

export default class KillClass extends CubeClass
{
    constructor(core)
    {
        super(core);
    }
    
    enter(entity)
    {
        if (entity.die!==undefined) entity.die();
    }
    
    leave(entity)
    {
    }
}
