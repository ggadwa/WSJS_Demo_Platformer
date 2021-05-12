import ProjectClass from '../../../code/main/project.js';
import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
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
        
            // interface
            
        this.addInterfaceElement('health_background','textures/health_background.png',128,128,this.POSITION_BOTTOM_RIGHT,new PointClass(-133,-133,0),new ColorClass(1.0,1.0,1.0),1.0,true);
        this.addInterfaceElement('health_4','textures/health_4.png',128,128,this.POSITION_BOTTOM_RIGHT,new PointClass(-133,-133,0),new ColorClass(1.0,1.0,1.0),1.0,true);
        this.addInterfaceElement('health_3','textures/health_3.png',128,128,this.POSITION_BOTTOM_RIGHT,new PointClass(-133,-133,0),new ColorClass(1.0,1.0,1.0),1.0,false);
        this.addInterfaceElement('health_2','textures/health_2.png',128,128,this.POSITION_BOTTOM_RIGHT,new PointClass(-133,-133,0),new ColorClass(1.0,1.0,1.0),1.0,false);
        this.addInterfaceElement('health_1','textures/health_1.png',128,128,this.POSITION_BOTTOM_RIGHT,new PointClass(-133,-133,0),new ColorClass(1.0,1.0,1.0),1.0,false);
        
        this.addInterfaceCount('stars','textures/star.png',10,32,32,this.POSITION_TOP_LEFT,new PointClass(5,5,0),new PointClass(0,32,0),new ColorClass(1.0,1.0,1.0),1.0,new ColorClass(0.8,0.8,0.8),0.5,true);            
        
            // title setup
            
        this.setTitleConfig('Arial','click','select');
        this.setTitleMenu(80,82,new ColorClass(1.0,1.0,0.0),new ColorClass(1.0,0.5,0.0),this.MENU_X_ALIGN_RIGHT,this.MENU_Y_ALIGN_BOTTOM);
        this.setTitlePlayButton('Play',true);
        this.setTitleMultiplayerButton('',false);
        this.setTitleSetupButton('Setup',true);
        this.setTitleQuitButton('Quit',true);
        
            // touch setup
            
        this.setTouchControls(256,48,this.POSITION_BOTTOM_LEFT,new PointClass(5,53,0),false,true);
        
            // multiplayer setup
            
        this.setMultiplayerUI(null,null,0);
        
            // starting map
            
        this.setStartMap('platformer');
        
            // developer setup
            
        this.setDeveloper(true);
    }
    
        //
        // overrides
        //
        
    mapStartup(mapName)
    {
        this.startSequence('warp_in');
    }
}
