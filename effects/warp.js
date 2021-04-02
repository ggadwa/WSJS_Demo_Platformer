import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class FlashClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
   
        this.lifeTick=1500;
        
        this.addBillboard("textures/particle_hit.png",this.DRAW_MODE_ADDITIVE)
                .addBillboardFrame(0,100,100,0,new ColorClass(1.0,1.0,1.0),0.3)
                .addBillboardFrame(50,10000,15000,5,new ColorClass(0.9,0.9,0.95),1.0)
                .addBillboardFrame(50,12500,20000,0,new ColorClass(0.9,0.9,0.95),1.0)
                .addBillboardFrame(800,15000,25000,-5,new ColorClass(0.7,0.7,0.9),1.0)
                .addBillboardFrame(1500,500,500,0,new ColorClass(0.5,0.5,0.85),0.1);

        this.startSound={"name":"teleport","rate":1.0,"randomRateAdd":0,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
    }
    
    initialize()
    {
        if (!super.initialize()) return(false);
        
        this.playSound(this.startSound);
        
        return(true);
    }

}
