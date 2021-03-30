import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class RobotClass extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
        this.isPlayer=true;

        this.healthInitialCount=0;
        this.healthMaxCount=0;
        this.interfaceHealthBackground=null;
        this.interfaceHealthBackgroundPulseSize=0;
        this.interfaceHealthBackgroundPulseTick=0;
        this.interfaceHealthBitmapList=null;
        
        this.platformCameraDistance=0;
        this.platformCameraYUpMoveFactor=1;
        this.platformCameraYDownMoveFactor=1;
        this.platformCameraJumpPause=false;
        
        this.interfaceCollectItem=null;
        
        this.idleAnimation={"startFrame":1830,"endFrame":1930,"actionFrame":0,"meshes":null};
        this.walkAnimation={"startFrame":80,"endFrame":110,"actionFrame":0,"meshes":null};
        this.runAnimation={"startFrame":290,"endFrame":310,"actionFrame":0,"meshes":null};
        this.jumpAnimation={"startFrame":627,"endFrame":628,"actionFrame":0,"meshes":null};
        this.fallAnimation={"startFrame":5410,"endFrame":5500,"actionFrame":0,"meshes":null};
        this.hurtAnimation={"startFrame":630,"endFrame":640,"actionFrame":0,"meshes":null};
        this.shovedAnimation={"startFrame":640,"endFrame":655,"actionFrame":0,"meshes":null};
        this.dieAnimation={"startFrame":720,"endFrame":765,"actionFrame":0,"meshes":null};
        
        this.jumpSound={"name":"robot_jump","rate":0.1,"randomRateAdd":1.0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.landSound={"name":"robot_land","rate":0.2,"randomRateAdd":1.0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        this.hurtSound={"name":"robot_hit","rate":0.2,"randomRateAdd":1.0,"distance":50000,"loopStart":0,"loopEnd":0,"loop":false};
        this.dieSound={"name":"robot_die","rate":1,"randomRateAdd":0,"distance":30000,"loopStart":0,"loopEnd":0,"loop":false};
        
            // variables
            
        this.health=0;
            
        this.currentCameraY=0;
        this.inJumpCameraPause=false;
        
        this.shoveSpeed=0;
        this.shoveFadeFactor=0;
        
        this.lastFall=false;
        
        this.collectItemCount=0;
        
        this.hitIndicator=false;
        this.hitIndicatorFlashTick=0;
        
        this.animationFinishTick=0;

            // pre-allocates
            
        this.movement=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,90,0);      // requires a second draw angle because the camera has the angle on it
        
        Object.seal(this);
    }
    
    initialize()
    {
        if (!super.initialize()) return(false);
        

        
        this.healthInitialCount=this.core.game.lookupValue(this.json.config.healthInitialCount,this.data,1);
        this.healthMaxCount=this.core.game.lookupValue(this.json.config.healthMaxCount,this.data,1);
        this.interfaceHealthBackground=this.core.game.lookupValue(this.json.config.interfaceHealthBackground,this.data,null);
        this.interfaceHealthBackgroundPulseSize=this.core.game.lookupValue(this.json.config.interfaceHealthBackgroundPulseSize,this.data,0);
        this.interfaceHealthBackgroundPulseTick=this.core.game.lookupValue(this.json.config.interfaceHealthBackgroundPulseTick,this.data,0);
        this.interfaceHealthBitmapList=(this.json.config.interfaceHealthBitmapList===undefined)?null:this.json.config.interfaceHealthBitmapList;
        
        this.platformCameraDistance=this.core.game.lookupValue(this.json.config.platformCameraDistance,this.data,0);
        this.platformCameraYUpMoveFactor=this.core.game.lookupValue(this.json.config.platformCameraYUpMoveFactor,this.data,1);
        this.platformCameraYDownMoveFactor=this.core.game.lookupValue(this.json.config.platformCameraYDownMoveFactor,this.data,1);
        this.platformCameraJumpPause=this.core.game.lookupValue(this.json.config.platformCameraJumpPause,this.data,false);
        
        this.interfaceCollectItem=this.core.game.lookupValue(this.json.config.interfaceCollectItem,this.data,null);
        
        this.hitIndicator=this.core.game.lookupValue(this.json.config.hitIndicator,this.data,null);
        this.hitIndicatorFlashTick=this.core.game.lookupValue(this.json.config.hitIndicatorFlashTick,this.data,0);
        
        return(true);
    }
    
    ready()
    {
        super.ready();
        
        this.movement.setFromValues(0,0,0);
        this.drawAngle.setFromValues(0,0,0);
        
        this.health=this.healthInitialCount;
        
        this.currentCameraY=this.position.y;
        this.inJumpCameraPause=false;
        
        this.shoveSpeed=0;
        this.shoveFadeFactor=0;
        
        this.lastFall=false;
        
        this.collectItemCount=0;
        
        this.animationFinishTick=0;
        
        this.cameraGotoPlatform(this.platformCameraDistance,this.platformCameraYUpMoveFactor,this.platformCameraYDownMoveFactor);
        
        this.startAnimation(this.idleAnimation);
    }
    
    die()
    {
        this.health=0;
        
        this.playSound(this.dieSound);
        
        this.startAnimation(this.dieAnimation);
        this.queueAnimationStop();
        
        this.core.game.lost(this);
    }
    
    damage(damage)
    {
            // already dead?
            
        if (this.health<=0) return;
        
            // hit indicator
            
        if (this.hitIndicator) this.hitFlashAll(this.hitIndicatorFlashTick);
        
            // take damage
            
        this.health-=damage;
        
        if ((this.interfaceHealthBackground!==null) && (this.interfaceHealthBackgroundPulseSize!==0) && (this.interfaceHealthBackgroundPulseTick!==0)) {
            this.pulseElement(this.interfaceHealthBackground,this.interfaceHealthBackgroundPulseTick,this.interfaceHealthBackgroundPulseSize);
        }
        
        if (this.health>0) {
            this.interuptAnimation(this.hurtAnimation);
            this.animationFinishTick=this.core.game.timestamp+this.getAnimationTickCount(this.hurtAnimation);
            this.playSound(this.hurtSound);
        }
        else {
            this.die();
        } 
    }
    
    meleeHit(damage,shoveSpeed,shoveFadeFactor)
    {
        this.shoveSpeed=shoveSpeed;
        this.shoveFadeFactor=shoveFadeFactor;
        
        if (damage!==0) this.damage(damage);
    }
    
    addWinCollect(winCount)
    {
        this.collectItemCount++;
        
            // going into win
            
        if (this.collectItemCount>=winCount) this.core.game.won(this);
    }
        
    run()
    {
        let n,speed,fallY,x,oldY,cameraDiff;
        let backward,forward;
        let moveKeyDown,runKeyDown;
        
        super.run();
        
            // interface updates
            
        if (this.interfaceCollectItem!==null) this.setCount(this.interfaceCollectItem,this.collectItemCount);
        
        if (this.interfaceHealthBitmapList!==null) {
            for (n=0;n!==this.interfaceHealthBitmapList.length;n++) {
                this.showElement(this.interfaceHealthBitmapList[n],((n+1)===this.health));
            }
        }
        
            // freezes
            
        if (this.core.game.freezePlayer) return;
        
            // dead, can only fall
            
        if (this.health<=0) {
            this.movement.y=this.moveInMapY(this.movement,1.0,false);
            return;
        }
        
            // movement keys
            
        speed=200;
        runKeyDown=this.isKeyDown('Shift');
        speed=(runKeyDown)?250:200;
        
            // movement
            
        moveKeyDown=false;
            
        if (this.shoveSpeed!==0) {
            this.movement.x=this.shoveSpeed;
            this.shoveSpeed*=this.shoveFadeFactor;
            if (Math.abs(this.shoveSpeed)<20) this.shoveSpeed=0;
        }
        else {
            this.movement.x=0;
            
            forward=this.isKeyDown('d');
            backward=this.isKeyDown('a');
            if (this.hasTouch()) {
                if (this.isTouchStickLeftOn()) {
                    x=this.getTouchStickLeftX();
                    if (x!==0) {
                        if (x>0) {
                            forward=true;
                        }
                        else {
                            backward=true;
                        }
                    }
                }
            }

            if (forward) {
                moveKeyDown=true;
                if (this.drawAngle.turnYTowards(90,20)===0) this.movement.x=speed;
            }
            else {
                if (backward) {
                    moveKeyDown=true;
                    if (this.drawAngle.turnYTowards(270,20)===0) this.movement.x=-speed;
                }
            }
        }
        
            // if no movement and not falling/jumping face foward
            
        if ((this.movement.y===0) && (!moveKeyDown)) {
            this.drawAngle.turnYTowards(0,20);
        }
        
            // jumping
            

        if (((this.isKeyDown(' ')) || (this.isTouchStickRightDown())) && ((this.standOnMeshIdx!==-1) || (this.standOnEntity!==null))) {
            this.movement.y=1000;
            this.inJumpCameraPause=this.platformCameraJumpPause;
            this.startAnimation(this.jumpAnimation);
            this.playSound(this.jumpSound);
        }
        
            // falling and bouncing
            
        fallY=this.gravity-this.core.game.map.gravityMinValue;
        if (fallY>0) {
            if (this.standOnEntity!==null) {
                if (this.standOnEntity.stompable) this.standOnEntity.die();
                this.inJumpCameraPause=this.platformCameraJumpPause;
                if (this.standOnEntity.stompBounceHeight!==0) {
                    this.movement.y=this.standOnEntity.stompBounceHeight;
                    this.playSound(this.standOnEntity.stompSound);
                }
            }
        }
        
            // run the movement
            
        oldY=this.position.y;
        
        this.movement.y=this.moveInMapY(this.movement,1.0,false);
        this.moveInMapXZ(this.movement,false,false);
        
            // landing
            
        if ((this.position.y<oldY) && (this.standOnMeshIdx===-1)) {
            this.lastFall=true;
        }
        else {
            if (this.lastFall) {
                this.lastFall=false;
                this.playSound(this.landSound);
            }
        }
        
            // animation changes
            
        if (this.animationFinishTick!==0) {
            if (this.core.game.timestamp>this.animationFinishTick) this.animationFinishTick=0;
        }
        else {
            if (this.shoveSpeed!==0) {
                this.continueAnimation(this.shovedAnimation);
            }
            else {
                if ((this.movement.y<=0) && (this.standOnMeshIdx===-1)) {
                    this.continueAnimation(this.fallAnimation);
                }
                else {
                    if (this.movement.y<=0) {
                        if (moveKeyDown) {
                            this.continueAnimation(runKeyDown?this.runAnimation:this.walkAnimation);
                        }
                        else {
                            this.continueAnimation(this.idleAnimation);
                        }
                    }
                }
            }
        }
        
            // the camera Y has a slop, if you are standing
            // on something it always moves towards the player,
            // but if you are jumping it pauses until another
            // ground comes up or if it's falling past the original ground
            // this makes it easier to make run-and-stomp type games
            
        cameraDiff=this.currentCameraY-this.position.y;
        
        if (this.inJumpCameraPause) {
            if (this.standOnMeshIdx!==-1) this.inJumpCameraPause=false;
        }
        
        if (cameraDiff<0) {
            if (!this.inJumpCameraPause) {
                this.currentCameraY-=(cameraDiff*this.platformCameraYUpMoveFactor);
                if (this.currentCameraY>this.position.y) this.currentCameraY=this.position.y;
            }
        }
        else {
            this.currentCameraY-=(cameraDiff*this.platformCameraYDownMoveFactor);
            if (this.currentCameraY<this.position.y) this.currentCameraY=this.position.y;
        }

        this.cameraSetPlatformYOffset(this.currentCameraY-this.position.y);
    }

    drawSetup()
    {
        if (this.model===null) return(false);
        
        this.setModelDrawAttributes(this.position,this.drawAngle,this.scale,false);
        return(this.boundBoxInFrustum());
    }
}

