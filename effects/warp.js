import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class FlashClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
   
        this.lifeTick=1000;
        this.billboards=
            [
                {
                    "bitmap":"textures/particle_hit.png","mode":"transparent",
                    "frames":
                        [
                            {"tick":0,"width":10,"height":100,"rotate":0,"color":{"r":1.0,"g":1.0,"b":1.0},"alpha":0.3},
                            {"tick":100,"width":10000,"height":15000,"rotate":30,"color":{"r":0.9,"g":0.9,"b":0.95},"alpha":1.0},
                            {"tick":800,"width":15000,"height":25000,"rotate":90,"color":{"r":0.7,"g":0.7,"b":0.9},"alpha":1.0},
                            {"tick":1500,"width":500,"height":800,"rotate":180,"color":{"r":0.5,"g":0.5,"b":0.85},"alpha":0.1}
                        ]
                }
            ];
        
        this.startSound={"name":"teleport","rate":1.0,"randomRateAdd":0,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
    }
    
    initialize()
    {
        if (!super.initialize()) return(false);
        
        this.playSound(this.startSound);
        
        return(true);
    }

}
