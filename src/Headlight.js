const THREE = require('three');
const {Light} = require('@snakesilk/platform-traits');

class Headlight extends Light
{
    constructor()
    {
        super();
        this.NAME = 'headlight';

        this.threshold = .8;

        this._nextUpdate = 0;
        this._updateFrequency = 2.5;

        this.position = new THREE.Vector3(4, 7.5, -1);

        const target = new THREE.Object3D();
        target.position.set(200, -10, 0);

        this.beam = new THREE.SpotLight(0x8cc6ff, 20, 256);
        this.beam.angle = .6;
        this.beam.exponent = 50;
        this.beam.position.y = 7.5;
        this.beam.position.z = 6;
        this.beam.target = target;

        this.point = new THREE.PointLight(0x8cc6ff, 5, 30);
        this.point.position.copy(this.position);

        this.flare = new THREE.Mesh(
            new THREE.PlaneGeometry(64, 64),
            new THREE.MeshBasicMaterial({
                opacity: 0,
                side: THREE.DoubleSide,
                transparent: true,
            }));

        this.point.add(this.flare);

        this.headbob = 2;

        this.lamps = [
            new Light.Lamp(this.beam),
            new Light.Lamp(this.point),
        ];
    }
    __attach(host)
    {
        if (host.textures['headlight_lensflare']) {
            this.flare.material.map = host.textures['headlight_lensflare'].texture;
            this.flare.material.needsUpdate = true;
        }

        super.__attach(host);
        this._host.model.add(this.lamps[0].light);
        this._host.model.add(this.lamps[0].light.target);
    }
    __detach()
    {
        this.flare.material.map = undefined;
        this.flare.material.needsUpdate = true;

        this._host.model.remove(this.lamps[0].light);
        this._host.model.remove(this.lamps[0].light.target);
        super.__detach();
    }

    _detectAmbient(deltaTime)
    {
        if (this._nextUpdate > this._updateFrequency) {
            this._nextUpdate = 0;
            if (this._host.world === undefined) {
                return;
            }
            const ambientLight = this._host.world.ambientLight;
            if (ambientLight.color.r < this.threshold
            || ambientLight.color.g < this.threshold
            || ambientLight.color.b < this.threshold) {
                this.on();
            }
            else {
                this.off();
            }
        }

        this._nextUpdate += deltaTime;
    }
    __timeshift(deltaTime)
    {
        const
            host = this._host,
            animator = host.animators[0];

        this.flare.material.opacity = this.point.intensity / this.lamps[1].intensity;

        this.point.position.y = this.beam.position.y = this.position.y;
        if (animator._currentAnimation === host.animations.run) {
            if (animator._currentIndex === 1 || animator._currentIndex === 3) {
                this.point.position.y = this.beam.position.y -= this.headbob;
            }
        }

        this._detectAmbient(deltaTime);

        super.__timeshift(deltaTime);
    }
}

module.exports = Headlight;
