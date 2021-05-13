import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

export default class StarClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
            
        this.modelName='star';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(600,600,600);
        this.radius=1200;
        this.height=1200;
        this.eyeOffset=0;
        this.weight=100;
        this.modelHideMeshes=null;
        
            // physics

        this.maxBumpCount=0;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=8;
        this.collisionHeightSegmentCount=2;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;

        this.passThrough=true;           // can pass through
        
            // variables
            
        this.originalY=0;
        
        this.pickupSound=new SoundDefClass('pickup',1.0,0.0,50000,0,0,false);
        
        Object.seal(this);
    }
    
    ready()
    {
        super.ready();
        
        this.originalY=this.position.y;
    }
    
    run()
    {
        super.run();
        
            // hidden, picked out
            
        if (!this.show) return;
        
            // animation

        this.position.y=this.originalY+this.getPeriodicCos(5000,200);
        this.angle.y=this.getPeriodicLinear(5000,360);
        
            // check for collisions from
            // entities that can add win star
            
        if (this.touchEntity===null) return;
        if (this.touchEntity.addWinCollect===undefined) return;
        
            // pickup and add star
            
        this.touchEntity.addWinCollect(10);
            
        this.show=false;
        
        this.touchEntity.playSound(this.pickupSound);
    }
    
    drawSetup()
    {
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

