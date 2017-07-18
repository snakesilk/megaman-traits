const expect = require('expect.js');
const sinon = require('sinon');

const {Object3D} = require('three');
const {Entity} = require('@snakesilk/engine');
const Headlight = require('../Headlight');

describe('Headlight', () => {
  let headlight, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      headlight = new Headlight();
    });

    it('has name', () => {
      expect(headlight.NAME).to.be('headlight');
    });

    describe('when applied', () => {
      const MOCK_FLARE_TEXTURE = Symbol('mock flare texture');

      beforeEach(() => {
        host = new Entity();
        host.textures.set('headlight_lensflare', {texture: MOCK_FLARE_TEXTURE});
        host.setModel(new Object3D());
        host.applyTrait(headlight);
      });

      it('exposes trait as "headlight"', () => {
        expect(host.headlight).to.be(headlight);
      });

      it('sets flate material to "headlight_lensflare" texture of host', () => {
        expect(host.headlight.flare.material.map).to.be(MOCK_FLARE_TEXTURE);
      });
    });
  });
});
