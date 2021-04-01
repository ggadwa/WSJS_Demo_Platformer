import PointClass from '../../../code/utility/point.js';
import EffectClass from '../../../code/game/effect.js';

export default class FlashClass extends EffectClass
{
    constructor(core,spawnedBy,position,data,mapSpawn,show)
    {
        super(core,spawnedBy,position,data,mapSpawn,show);
        
        this.lifeTick=1500;
        this.billboards=
            [
                {
                    "bitmap":"textures/particle_hit.png","mode":"transparent",
                    "frames":
                        [
                            {"tick":0,"width":10,"height":10,"rotate":0,"color":{"r":1.0,"g":1.0,"b":0.0},"alpha":0.3},
                            {"tick":100,"width":10000,"height":10000,"rotate":30,"color":{"r":1.0,"g":0.7,"b":0.0},"alpha":1.0},
                            {"tick":800,"width":15000,"height":15000,"rotate":90,"color":{"r":1.0,"g":0.6,"b":0.0},"alpha":1.0},
                            {"tick":1500,"width":500,"height":500,"rotate":180,"color":{"r":0.7,"g":0.5,"b":0.5},"alpha":0.1}
                        ]
                }
            ];
    }

}
