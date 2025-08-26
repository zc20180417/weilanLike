import { NodeParticleSystem } from "./NodeParticleSystem";
import { Pool } from "./Pool";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const ZERO_VEC2 = cc.v2(0, 0);
let _pos = cc.v2();
let _tpa = cc.v2();
let _tpb = cc.v2();
let _tpc = cc.v2();
let _color = cc.color();

class Particle {
    pos = cc.v2(0, 0);
    startPos = cc.v2(0, 0);
    color = { r: 0, g: 0, b: 0, a: 255 };
    deltaColor = { r: 0, g: 0, b: 0, a: 255 };
    preciseColor = { r: 0, g: 0, b: 0, a: 255 };
    size = 0;
    deltaSize = 0;
    rotation = 0;
    startRotation = 0;
    deltaRotation = 0;
    timeToLive = 0;
    drawPos = cc.v2(0, 0);
    aspectRatio = 1;
    // Mode A
    dir = cc.v2(0, 0);
    radialAccel = 0;
    tangentialAccel = 0;
    // Mode B
    angle = 0;
    degreesPerSecond = 0;
    radius = 0;
    deltaRadius = 0;
    node: cc.Node = null;
}

let particlePool = new Pool(Particle, function (par) {
    par.pos.set(ZERO_VEC2);
    par.startPos.set(ZERO_VEC2);
    par.color["_val"] = 0xFF000000;
    par.deltaColor.r = par.deltaColor.g = par.deltaColor.b = 0;
    par.deltaColor.a = 255;
    par.size = 0;
    par.deltaSize = 0;
    par.rotation = 0;
    par.deltaRotation = 0;
    par.timeToLive = 0;
    par.drawPos.set(ZERO_VEC2);
    par.aspectRatio = 1;
    // Mode A
    par.dir.set(ZERO_VEC2);
    par.radialAccel = 0;
    par.tangentialAccel = 0;
    // Mode B
    par.angle = 0;
    par.degreesPerSecond = 0;
    par.radius = 0;
    par.deltaRadius = 0;
}, 1024);

export class NodeParticleSimulator {
    sys: NodeParticleSystem = null;
    particles: Particle[] = [];
    active = false;
    readyToPlay = true;
    finished = false;
    elapsed = 0;
    emitCounter = 0;
    _uvFilled = 0;
    _worldRotation = 0;
    nodePool: cc.NodePool = null;
    constructor(system: NodeParticleSystem) {
        this.sys = system;
        this.nodePool = new cc.NodePool("ParticleAnimation");
    }

    stop() {
        this.active = false;
        this.readyToPlay = false;
        this.elapsed = this.sys.duration;
        this.emitCounter = 0;
    }

    reset() {
        this.active = true;
        this.readyToPlay = true;
        this.elapsed = 0;
        this.emitCounter = 0;
        this.finished = false;
        let particles = this.particles;
        for (let id = 0; id < particles.length; ++id) {
            if (CC_EDITOR) {
                particles[id].node.destroy();
            } else {
                this.nodePool.put(particles[id].node);
            }
            particlePool.put(particles[id]);
        }
        particles.length = 0;
    }

    emitParticle(pos: cc.Vec2) {
        let psys = this.sys;
        let clampf = cc.misc.clampf;
        let particle = particlePool.get();
        this.particles.push(particle);
        particle.node = this.nodePool.size() > 0 ? this.nodePool.get() : cc.instantiate(this.sys.prefab);
        particle.node.parent = this.sys.node;
        // Init particle
        // timeToLive
        // no negative life. prevent division by 0
        particle.timeToLive = psys.life + psys.lifeVar * (Math.random() - 0.5) * 2;
        let timeToLive = particle.timeToLive = Math.max(0, particle.timeToLive);

        // position
        particle.pos.x = psys.sourcePos.x + psys.posVar.x * (Math.random() - 0.5) * 2;
        particle.pos.y = psys.sourcePos.y + psys.posVar.y * (Math.random() - 0.5) * 2;

        // Color
        let sr, sg, sb, sa;
        let startColor = psys.startColor, startColorVar = psys.startColorVar;
        let endColor = psys.endColor, endColorVar = psys.endColorVar;
        particle.color.r = sr = clampf(startColor.r + startColorVar.r * (Math.random() - 0.5) * 2, 0, 255);
        particle.color.g = sg = clampf(startColor.g + startColorVar.g * (Math.random() - 0.5) * 2, 0, 255);
        particle.color.b = sb = clampf(startColor.b + startColorVar.b * (Math.random() - 0.5) * 2, 0, 255);
        particle.color.a = sa = clampf(startColor.a + startColorVar.a * (Math.random() - 0.5) * 2, 0, 255);

        let color = particle.color;
        let preciseColor = particle.preciseColor;
        preciseColor.r = color.r;
        preciseColor.g = color.g;
        preciseColor.b = color.b;
        preciseColor.a = color.a;

        particle.deltaColor.r = (clampf(endColor.r + endColorVar.r * (Math.random() - 0.5) * 2, 0, 255) - sr) / timeToLive;
        particle.deltaColor.g = (clampf(endColor.g + endColorVar.g * (Math.random() - 0.5) * 2, 0, 255) - sg) / timeToLive;
        particle.deltaColor.b = (clampf(endColor.b + endColorVar.b * (Math.random() - 0.5) * 2, 0, 255) - sb) / timeToLive;
        particle.deltaColor.a = (clampf(endColor.a + endColorVar.a * (Math.random() - 0.5) * 2, 0, 255) - sa) / timeToLive;

        // scale
        let startS = psys.startScale + psys.startScaleVar * (Math.random() - 0.5) * 2;
        startS = Math.max(0, startS); // No negative value
        particle.size = startS;
        var endS = psys.endScale + psys.endScaleVar * (Math.random() - 0.5) * 2;
        endS = Math.max(0, endS); // No negative values
        particle.deltaSize = (endS - startS) / timeToLive;

        // rotation
        var startA = psys.startSpin + psys.startSpinVar * (Math.random() - 0.5) * 2;
        var endA = psys.endSpin + psys.endSpinVar * (Math.random() - 0.5) * 2;
        particle.rotation = startA;
        particle.deltaRotation = (endA - startA) / timeToLive;
        particle.startRotation = this._worldRotation;
        // position
        particle.startPos.x = pos.x;
        particle.startPos.y = pos.y;

        // aspect ratio
        particle.aspectRatio = psys.aspectRatio || 1;

        // direction
        let a = cc.misc.degreesToRadians(psys.angle + this._worldRotation + psys.angleVar * (Math.random() - 0.5) * 2);
        // Mode Gravity: A
        if (psys.emitterMode === cc.ParticleSystem.EmitterMode.GRAVITY) {
            let s = psys.speed + psys.speedVar * (Math.random() - 0.5) * 2;
            // direction
            particle.dir.x = Math.cos(a);
            particle.dir.y = Math.sin(a);
            particle.dir.mulSelf(s);
            // radial accel
            particle.radialAccel = psys.radialAccel + psys.radialAccelVar * (Math.random() - 0.5) * 2;
            // tangential accel
            particle.tangentialAccel = psys.tangentialAccel + psys.tangentialAccelVar * (Math.random() - 0.5) * 2;
            // rotation is dir
            if (psys.rotationIsDir) {
                particle.rotation = -cc.misc.radiansToDegrees(Math.atan2(particle.dir.y, particle.dir.x));
            }
        }
        // Mode Radius: B
        else {
            // Set the default diameter of the particle from the source position
            var startRadius = psys.startRadius + psys.startRadiusVar * (Math.random() - 0.5) * 2;
            var endRadius = psys.endRadius + psys.endRadiusVar * (Math.random() - 0.5) * 2;
            particle.radius = startRadius;
            particle.deltaRadius = (psys.endRadius === cc.ParticleSystem.START_RADIUS_EQUAL_TO_END_RADIUS) ? 0 : (endRadius - startRadius) / timeToLive;
            particle.angle = a;
            particle.degreesPerSecond = cc.misc.degreesToRadians(psys.rotatePerS + psys.rotatePerSVar * (Math.random() - 0.5) * 2);
        }
    }

    getWorldRotation(node) {
        let rotation = 0;
        let tempNode = node;
        while (tempNode) {
            rotation += tempNode.angle;
            tempNode = tempNode.parent;
        }
        return rotation;
    }

    step(dt: number) {
        dt = dt > cc.director["_maxParticleDeltaTime"] ? cc.director["_maxParticleDeltaTime"] : dt;
        let psys = this.sys;
        let node = psys.node;
        let particles = this.particles;
        const PositionType = NodeParticleSystem.PositionType;

        // Calculate pos
        node["_updateWorldMatrix"]();
        if (psys.positionType === PositionType.FREE) {
            this._worldRotation = this.getWorldRotation(node);
            // this._worldRotation = node.angle;
            let m = node["_worldMatrix"].m;
            _pos.x = m[12];
            _pos.y = m[13];
        } else if (psys.positionType === PositionType.RELATIVE) {
            this._worldRotation = node.angle;
            _pos.x = node.x;
            _pos.y = node.y;
        } else {
            this._worldRotation = 0;
        }

        // Emission
        if (this.active && psys.emissionRate) {
            var rate = 1.0 / psys.emissionRate;
            //issue #1201, prevent bursts of particles, due to too high emitCounter
            if (particles.length < psys.totalParticles)
                this.emitCounter += dt;

            while ((particles.length < psys.totalParticles) && (this.emitCounter > rate)) {
                this.emitParticle(_pos);
                this.emitCounter -= rate;
            }

            this.elapsed += dt;
            if (psys.duration !== -1 && psys.duration < this.elapsed) {
                psys.stopSystem();
            }
        }

        // Used to reduce memory allocation / creation within the loop
        let particleIdx = 0;
        while (particleIdx < particles.length) {
            // Reset temporary vectors
            _tpa.x = _tpa.y = _tpb.x = _tpb.y = _tpc.x = _tpc.y = 0;

            let particle = particles[particleIdx];

            // life
            particle.timeToLive -= dt;
            if (particle.timeToLive > 0) {
                // Mode A: gravity, direction, tangential accel & radial accel
                if (psys.emitterMode === cc.ParticleSystem.EmitterMode.GRAVITY) {
                    let tmp = _tpc, radial = _tpa, tangential = _tpb;

                    // radial acceleration
                    if (particle.pos.x || particle.pos.y) {
                        radial.set(particle.pos);
                        radial.normalizeSelf();
                    }
                    tangential.set(radial);
                    radial.mulSelf(particle.radialAccel);

                    // tangential acceleration
                    let newy = tangential.x;
                    tangential.x = -tangential.y;
                    tangential.y = newy;

                    tangential.mulSelf(particle.tangentialAccel);

                    tmp.set(radial);
                    tmp.addSelf(tangential);
                    tmp.addSelf(psys.gravity);
                    tmp.mulSelf(dt);
                    particle.dir.addSelf(tmp);

                    tmp.set(particle.dir);
                    tmp.mulSelf(dt);
                    particle.pos.addSelf(tmp);
                }
                // Mode B: radius movement
                else {
                    // Update the angle and radius of the particle.
                    particle.angle += particle.degreesPerSecond * dt;
                    particle.radius += particle.deltaRadius * dt;

                    particle.pos.x = -Math.cos(particle.angle) * particle.radius;
                    particle.pos.y = -Math.sin(particle.angle) * particle.radius;
                }

                // color
                let preciseColor = particle.preciseColor;
                let deltaColor = particle.deltaColor;
                preciseColor.r += deltaColor.r * dt;
                preciseColor.g += deltaColor.g * dt;
                preciseColor.b += deltaColor.b * dt;
                preciseColor.a += deltaColor.a * dt;

                let color = particle.color;
                color.r = preciseColor.r;
                color.g = preciseColor.g;
                color.b = preciseColor.b;
                color.a = preciseColor.a;

                // size
                particle.size += particle.deltaSize * dt;
                if (particle.size < 0) {
                    particle.size = 0;
                }

                // angle
                particle.rotation += particle.deltaRotation * dt;

                // update values in quad buffer
                let newPos = _tpa;
                let rotation = particle.rotation;
                if (psys.positionType === PositionType.GROUPED) {
                    newPos.set(particle.pos);
                } else if (psys.positionType === PositionType.RELATIVE) {
                    newPos.set(particle.startPos).subSelf(_pos).addSelf(particle.pos);
                } else {
                    newPos.set(particle.startPos).addSelf(particle.pos);
                    node.convertToNodeSpaceAR(newPos, newPos);
                }

                //将粒子数据同步到节点上
                particle.node.setPosition(newPos);
                particle.node.angle = rotation;
                _color.r = color.r;
                _color.g = color.g;
                _color.b = color.b;
                particle.node.color = _color;
                particle.node.opacity = color.a;
                particle.node.scale = particle.size;
                // update particle counter
                ++particleIdx;
            } else {
                // life < 0
                let deadParticle = particles[particleIdx];
                if (particleIdx !== particles.length - 1) {
                    particles[particleIdx] = particles[particles.length - 1];
                }
                if (CC_EDITOR) {
                    deadParticle.node.destroy();
                } else {
                    this.nodePool.put(deadParticle.node);
                }
                particlePool.put(deadParticle);
                particles.length--;
            }
        }

        if (!this.active && !this.readyToPlay) {
            this.finished = true;
            psys.finishedSimulation();
        }
    }

    clear() {
        this.nodePool.clear();
    }
}