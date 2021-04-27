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
    initialize()
    {
        super.initialize();
        
            // project effects
            
        this.addEffectClass('flash',FlashClass);
        this.addEffectClass('warp',WarpClass);
        
            // project entities
            
        this.addEntityClass('star',StarClass);
        this.addEntityClass('robot',RobotClass);
        this.addEntityClass('pumpkin',PumpkinClass);
        this.addEntityClass('rocky',RockyClass);
        
            // project cubes
            
        this.addCubeClass('kill',KillClass);
        
            // models
            
        this.addCommonModel('pumpkin');
        this.addCommonModel('robot');
        this.addCommonModel('rocky');
        this.addCommonModel('star');
        
            // bitmaps
            
        this.addCommonBitmap('textures/particle_hit.png');
           
           // sounds
           
        this.addCommonSound('chime');
        this.addCommonSound('monster_attack');
        this.addCommonSound('pickup');
        this.addCommonSound('pumpkin_splat');
        this.addCommonSound('robot_die');
        this.addCommonSound('robot_hit');
        this.addCommonSound('robot_jump');
        this.addCommonSound('robot_land');
        this.addCommonSound('rock_hit');
        this.addCommonSound('teleport');
        
            // sequences
            
        this.addSequence('warp_in');
        this.addSequence('warp_out');
        this.addSequence('lost');
    }
    
        //
        // overrides
        //
        
    mapStartup(mapName)
    {
        this.startSequence('warp_in');
    }
}
