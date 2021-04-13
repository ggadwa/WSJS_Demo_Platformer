import ProjectClass from '../../../code/main/project.js';
import KillClass from '../cubes/kill.js';
import FlashClass from '../effects/flash.js';
import WarpClass from '../effects/warp.js';
import StarClass from '../entities/star.js';
import RobotClass from '../entities/robot.js';
import PumpkinClass from '../entities/pumpkin.js';
import RockyClass from '../entities/rocky.js';

export default class DemoClass extends ProjectClass
{
    mapModels(mapName,singlePlayer)
    {
        return(['pumpkin','robot','rocky','star']);
    }
    
    mapBitmaps(mapName,singlePlayer)
    {
        return(['textures/particle_hit.png']);
    }
    
    mapSounds(mapName,singlePlayer)
    {
        return(['chime','monster_attack','pickup','pumpkin_splat','robot_die','robot_hit','robot_jump','robot_land','rock_hit','teleport']);
    }
    
    mapCube(mapName,cubeName)
    {
        switch (cubeName) {
            case 'kill':
                return(KillClass);
        }
        
        return(null);
    }
    
    mapEffect(mapName,effectName)
    {
        switch (effectName) {
            case 'flash':
                return(FlashClass);
            case 'warp':
                return(WarpClass);
        }
        return(null);
    }

    mapEntity(mapName,entityName)
    {
        switch (entityName) {
            case 'star':
                return(StarClass);
            case 'robot':
                return(RobotClass);
            case 'pumpkin':
                return(PumpkinClass);
            case 'rocky':
                return(RockyClass);
        }
        
        return(null);
    }
    
    mapStartup(mapName)
    {
    }
}
