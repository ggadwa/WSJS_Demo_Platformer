import PointClass from '../../../code/utility/point.js';
import ColorClass from '../../../code/utility/color.js';
import EffectClass from '../../../code/game/effect.js';

export default class FlashClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=1400;
        
        this.addBillboard("textures/particle_hit.png",this.DRAW_MODE_TRANSPARENT)
                .addBillboardFrame(0,10000,10000,0,new ColorClass(1.0,1.0,0.0),0.3)
                .addBillboardFrame(10,10000,10000,30,new ColorClass(1.0,0.7,0.0),1.0)
                .addBillboardFrame(800,15000,15000,90,new ColorClass(1.0,0.6,0.0),1.0)
                .addBillboardFrame(1400,50,50,180,new ColorClass(0.7,0.5,0.5),0.2);
    }

}
