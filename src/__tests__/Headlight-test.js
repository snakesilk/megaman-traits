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
      beforeEach(() => {
        host = new Entity();
        host.setModel(new Object3D());
        host.applyTrait(headlight);
      });

      it('exposes trait as "headlight"', () => {
        expect(host.headlight).to.be(headlight);
      });
    });
  });
});
