import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';
import AnimationDefClass from '../../../code/model/animation_def.js';
import SoundDefClass from '../../../code/sound/sound_def.js';

export default class RockyClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
            
        this.modelName='rocky';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(4500,4500,4500);
        this.radius=1600;
        this.height=4400;
        this.eyeOffset=4000;
        this.weight=180;
        this.modelHideMeshes=null;

            // physics
            
        this.maxBumpCount=2;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=24;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // stomping setup
            
        this.stompable=false;
        this.stompBounceHeight=1000;
        
            // variables
            
        this.startX=0;
        
        this.walkDirection=1;
        
        this.meleeNextTick=0;
        this.animationFinishTick=0;
        
            // animations
        
        this.idleAnimation=new AnimationDefClass(910,1110,0);
        this.walkAnimation=new AnimationDefClass(80,110,0);
        this.hitAnimation=new AnimationDefClass(2870,2890,2880);
        
            // sounds
            
        this.stompSound=new SoundDefClass('rock_hit',1,0.1,30000,0,0,false);
        this.meleeSound=new SoundDefClass('monster_attack',1,0.5,30000,0,0,false);

            // pre-allocates
            
        this.movement=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,90,0);
        
        Object.seal(this);
    }
        
    ready()
    {
        super.ready();
        
        this.startX=this.position.x;
        this.walkDirection=-1;
        
        this.meleeNextTick=0;
        this.animationFinishTick=0;
        
        this.movement.setFromValues(0,0,0);
        this.angle.setFromValues(0,90,0);           // monsters don't have the camera so they can use the regular angle
        
        this.startAnimation(this.walkAnimation);
    }
    
    isMeleeOK(player)
    {
        let dist,halfHigh;
        
            // don't attack dead players
            
        if (player.health<=0) return(false);
        
            // melees only count if within distance
            // and within half the height of each other

        dist=player.position.x-this.position.x;
        if (Math.abs(dist)>5500) return(false);
                
        halfHigh=Math.abs(this.height*0.5);
        return((player.position.y<(this.position.y+halfHigh)) && (player.position.y>(this.position.y-halfHigh)));
    }
        
    run()
    {
        let timestamp=this.getTimestamp();
        let player=this.getPlayer();
        
        super.run();
        
            // any waiting melee
                    
        if (this.meleeNextTick!==0) {
            if (timestamp>=this.meleeNextTick) {
                this.meleeNextTick=0;
                if (this.isMeleeOK(player)) player.meleeHit(1,(Math.sign(player.position.x-this.position.x)*1100),0.9);
                this.playSound(this.meleeSound);
            }
        }
        
            // movement
            
        this.movement.x=0;
        
        if (this.walkDirection>0) {
            if (this.angle.turnYTowards(90,5)===0) this.movement.x=50;
        }
        else {
            if (this.angle.turnYTowards(270,5)===0) this.movement.x=-50;
        }
        
            // frozen in a finishing animation
            
        if (this.animationFinishTick!==0) {
            if (timestamp>this.animationFinishTick) this.animationFinishTick=0;
            this.movement.y=this.moveInMapY(this.movement,1.0,false);
            return;
        }
        
            // run the movement
            
        this.movement.y=this.moveInMapY(this.movement,1.0,false);
        this.moveInMapXZ(this.movement,false,false);
        
            // melee
            // don't run if already waiting on a melee
            
        if (this.meleeNextTick===0) {
            if (this.isMeleeOK(player)) {
                this.walkDirection=Math.sign(player.position.x-this.position.x);     // always turn towards player

                this.startAnimation(this.hitAnimation);
                this.queueAnimation(this.walkAnimation);

                this.meleeNextTick=this.getAnimationFinishTimestampFromFrame(this.hitAnimation.actionFrame,this.hitAnimation);
                this.animationFinishTick=timestamp+this.getAnimationTickCount(this.hitAnimation);
            }
        }
        
            // hitting something turns patrols around
            
        if (this.collideWallMeshIdx!==-1) {
            this.walkDirection=-this.walkDirection;
        }
        else {
        
                // time to turn around

            if (this.walkDirection>0) {
                if ((this.position.x-this.startX)>8000) {
                    this.position.x=this.startX+8000;
                    this.walkDirection=-1;
                }
            }
            else {
                if ((this.startX-this.position.x)>8000) {
                    this.position.x=this.startX-8000;
                    this.walkDirection=1;
                }
            }
        }
    }

    drawSetup()
    {
        if (this.model===null) return(false);
        
        this.setModelDrawAttributes(this.position,this.angle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

