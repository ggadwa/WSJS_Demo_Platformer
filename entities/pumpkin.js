import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class PumpkinClass extends EntityClass
{
    constructor(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // model
            
        this.modelName='pumpkin';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(4500,4500,4500);
        this.radius=1700;
        this.height=3500;
        this.eyeOffset=3000;
        this.weight=180;
        this.modelHideMeshes=null;

            // physics
            
        this.maxBumpCount=2;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=24;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // some stomping setup
            
        this.stompable=true;
        this.stompBounceHeight=500;
        
            // animations
        
        this.idleAnimation={"startFrame":910,"endFrame":1110,"actionFrame":0,"meshes":null};
        this.walkAnimation={"startFrame":80,"endFrame":110,"actionFrame":0,"meshes":null};
        this.hitAnimation={"startFrame":2710,"endFrame":2730,"actionFrame":2720,"meshes":null};
        this.dieAnimation={"startFrame":2750,"endFrame":2790,"actionFrame":2755,"meshes":null};
            
            // sounds
        
        this.stompSound=null;   // called by player
        this.meleeSound={"name":"monster_attack","rate":1,"randomRateAdd":0.5,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.dieSound={"name":"pumpkin_splat","rate":1,"randomRateAdd":0.2,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        
            // variables
            
        this.startX=0;
        
        this.walkDirection=1;
        this.nextJumpTick=0;
        
        this.meleeNextTick=0;
        
        this.dead=false;
        this.shrinkFactor=0;
        this.effectLaunchTick=0;
        this.animationFinishTick=0;

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
        this.nextJumpTick=0;
        
        this.meleeNextTick=0;

        this.dead=false;
        this.passThrough=false;
        this.shrinkFactor=0;
        this.effectLaunchTick=0;
        this.animationFinishTick=0;
        
        this.movement.setFromValues(0,0,0);
        this.angle.setFromValues(0,90,0);           // monsters don't have the camera so they can use the regular angle
        
        this.startAnimation(this.walkAnimation);
    }
    
    die()
    {
        this.dead=true;
        this.passThrough=true;
        
        this.startAnimation(this.dieAnimation);
        this.queueAnimationStop();
        
        this.effectLaunchTick=this.getAnimationFinishTimestampFromFrame(this.dieAnimation.actionFrame,this.dieAnimation);
        this.animationFinishTick=this.core.game.timestamp+this.getAnimationTickCount(this.dieAnimation);
        
        this.playSound(this.dieSound);
    }
    
    isMeleeOK(player)
    {
        let dist,halfHigh;
        
            // don't attack dead players
            
        if (player.health<=0) return(false);
        
            // melees only count if within distance
            // and within half the height of each other

        dist=player.position.x-this.position.x;
        if (Math.abs(dist)>4500) return(false);
                
        halfHigh=Math.abs(this.height*0.5);
        return((player.position.y<(this.position.y+halfHigh)) && (player.position.y>(this.position.y-halfHigh)));
    }
        
    run()
    {
        let player=this.core.game.map.entityList.getPlayer();
        
        super.run();
        
            // if dead
            
        if (this.dead) {
            if (this.animationFinishTick===0) return;
            
            if ((this.core.game.timestamp>this.effectLaunchTick) && (this.effectLaunchTick!==0)) {
                this.effectLaunchTick=0;
                this.addEffect(this,'flash',this.position,null,true);
            }
            
            if (this.core.game.timestamp>this.animationFinishTick) {
                this.animationFinishTick=0;
                this.show=false;
            }
            
            this.scale.scale(0.97);
            
            return;
        }
        
            // any waiting melee
                    
        if (this.meleeNextTick!==0) {
            if (this.core.game.timestamp>=this.meleeNextTick) {
                this.meleeNextTick=0;
                if (this.isMeleeOK(player)) player.meleeHit(1,0,0);
                this.playSound(this.meleeSound);
            }
        }
        
            // movement
            
        this.movement.x=0;
        
        if (this.walkDirection>0) {
            if (this.angle.turnYTowards(90,10)===0) this.movement.x=100;
        }
        else {
            if (this.angle.turnYTowards(270,10)===0) this.movement.x=-100;
        }
        
            // frozen in a finishing animation
            
        if (this.animationFinishTick!==0) {
            if (this.core.game.timestamp>this.animationFinishTick) this.animationFinishTick=0;
            this.movement.y=this.moveInMapY(this.movement,1.0,false);
            return;
        }
        
            // jumping
            
        if ((this.standOnMeshIdx!==-1) || (this.standOnEntity!==null)) {
            if (this.core.game.timestamp>this.nextJumpTick) {
                this.nextJumpTick=this.core.game.timestamp+(2000+Math.trunc(Math.random()*100));

                this.movement.y=200;
            }
        }
        else {
            this.nextJumpTick=this.core.game.timestamp+(2000+Math.trunc(Math.random()*100));
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
                this.animationFinishTick=this.core.game.timestamp+this.getAnimationTickCount(this.hitAnimation);
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

