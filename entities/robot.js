import PointClass from '../../../code/utility/point.js';
import EntityClass from '../../../code/game/entity.js';

export default class RobotClass extends EntityClass
{
    constructor(core,name,jsonName,position,angle,data,mapSpawn,spawnedBy,heldBy,show)
    {
        super(core,name,null,position,angle,data,mapSpawn,spawnedBy,heldBy,show);
        
            // this is the player entity
            
        this.isPlayer=true;
        
            // model
            
        this.modelName='robot';
        this.frameRate=30;
        this.rotationOrder=this.MODEL_ROTATION_ORDER_XYZ;
        this.scale.setFromValues(5000,5000,5000);
        this.radius=1500;
        this.height=4500;
        this.eyeOffset=4400;
        this.weight=400;
        this.modelHideMeshes=null;

            // physics
            
        this.maxBumpCount=2;
        this.floorRiseHeight=2000;
        this.collisionSpokeCount=24;
        this.collisionHeightSegmentCount=4;
        this.collisionHeightMargin=10;
        this.canBeClimbed=false;
        
            // variables
            
        this.health=0;
            
        this.currentCameraY=0;
        this.inJumpCameraPause=false;
        
        this.shoveSpeed=0;
        this.shoveFadeFactor=0;
        
        this.lastFall=false;
        
        this.collectItemCount=0;
        
        this.animationFinishTick=0;
        
            // some constants
            
        this.interfaceHealthBitmapList=["health_1","health_2","health_3","health_4"];
        
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

            // pre-allocates
            
        this.movement=new PointClass(0,0,0);
        this.drawAngle=new PointClass(0,90,0);      // requires a second draw angle because the camera has the angle on it
        
        Object.seal(this);
    }
    
    ready()
    {
        super.ready();
        
        this.movement.setFromValues(0,0,0);
        this.drawAngle.setFromValues(0,0,0);
        
        this.health=4;
        
        this.currentCameraY=this.position.y;
        this.inJumpCameraPause=false;
        
        this.shoveSpeed=0;
        this.shoveFadeFactor=0;
        
        this.lastFall=false;
        
        this.collectItemCount=0;
        
        this.animationFinishTick=0;
        
        this.cameraGotoPlatform(15000,0.2,0.3);
        
        this.startAnimation(this.idleAnimation);
    }
    
    addHealth(count)
    {
        this.health+=count;
        if (this.health>4) this.health=4;
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
            
        this.hitFlashAll(500);
        
            // take damage
            
        this.health-=damage;
        this.pulseElement('interfaceHealthBackground',500,5);
        
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
            
        this.setCount('stars',this.collectItemCount);
        
        for (n=0;n!==this.interfaceHealthBitmapList.length;n++) {
            this.showElement(this.interfaceHealthBitmapList[n],((n+1)===this.health));
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
            this.inJumpCameraPause=true;
            this.startAnimation(this.jumpAnimation);
            this.playSound(this.jumpSound);
        }
        
            // falling and bouncing
            
        fallY=this.gravity-this.core.game.map.gravityMinValue;
        if (fallY>0) {
            if (this.standOnEntity!==null) {
                if (this.standOnEntity.stompable) this.standOnEntity.die();
                this.inJumpCameraPause=true;
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
                this.currentCameraY-=(cameraDiff*0.2);
                if (this.currentCameraY>this.position.y) this.currentCameraY=this.position.y;
            }
        }
        else {
            this.currentCameraY-=(cameraDiff*0.3);
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

