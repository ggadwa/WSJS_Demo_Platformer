import ProjectClass from '../../../code/main/project.js';
import KillClass from '../cubes/kill.js';
import StarClass from '../entities/star.js';
import RobotClass from '../entities/robot.js';

export default class DemoClass extends ProjectClass
{
    mapCube(name)
    {
        switch (name) {
            case 'kill':
                return(KillClass);
        }
        
        return(null);
    }
    
    mapEffect(name)
    {
        return(null);
    }

    mapEntity(name)
    {
        switch (name) {
            case 'star':
                return(StarClass);
            case 'robot':
                return(RobotClass);
        }
        
        return(null);
    }
}
