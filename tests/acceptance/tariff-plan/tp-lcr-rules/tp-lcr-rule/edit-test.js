import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import startApp from 'cgrates-web-frontend/tests/helpers/start-app';
import destroyApp from 'cgrates-web-frontend/tests/helpers/destroy-app';
import { authenticateSession } from 'cgrates-web-frontend/tests/helpers/ember-simple-auth';
import registerPowerSelectHelpers from 'cgrates-web-frontend/tests/helpers/ember-power-select';

registerPowerSelectHelpers();

describe("Acceptance: TpLcrRule.Edit", function() {
  beforeEach(function() {
    this.App = startApp();
    this.tariffPlan = server.create('tariff-plan', {name: 'Test', alias: 'tptest'});
    this.tpDestination1 = server.create('tp-destination', {tpid: this.tariffPlan.alias, tag: 'DST_1001'});
    this.tpDestination2 = server.create('tp-destination', {tpid: this.tariffPlan.alias, tag: 'DST_1002'});
    this.tpLcrRule = server.create('tp-lcr-rule', {
      tpid: this.tariffPlan.alias,
      destination_tag: this.tpDestination1.tag
    });
    authenticateSession(this.App, {email: "user@example.com"});
  });


  afterEach(function () {
    destroyApp(this.App);
  });

  describe('fill form with incorrect data and submit', () =>
    it('does not submit data', function() {
      visit('/tariff-plans/1/tp-lcr-rules');
      click('table tbody tr:first-child a.edit');
      return andThen(function() {
        fillIn(`#${find("label:contains('Tenant')").attr('for')}`, '');
        fillIn(`#${find("label:contains('Category')").attr('for')}`, '');
        fillIn(`#${find("label:contains('Account')").attr('for')}`, '');
        fillIn(`#${find("label:contains('Subject')").attr('for')}`, '');
        fillIn(`#${find("label:contains('RP category')").attr('for')}`, '');
        fillIn(`#${find("label:contains('Strategy params')").attr('for')}`, '');
        fillIn(`#${find("label:contains('Activation time')").attr('for')}`, '');
        fillIn(`#${find("label:contains('Weight')").attr('for')}`, '');
        click('button[type="submit"]');
        return andThen(function() {
          expect(find(`#${find("label:contains('Direction')").attr('for')}`).length).to.eq(1);
          expect(find(`#${find("label:contains('Tenant')").attr('for')}`).length).to.eq(1);
          expect(find(`#${find("label:contains('Category')").attr('for')}`).length).to.eq(1);
          expect(find(`#${find("label:contains('Account')").attr('for')}`).length).to.eq(1);
          expect(find(`#${find("label:contains('Subject')").attr('for')}`).length).to.eq(1);
          expect(find(`#${find("label:contains('Destination tag')").attr('for')}`).length).to.eq(1);
          expect(find(`#${find("label:contains('RP category')").attr('for')}`).length).to.eq(1);
          expect(find(`#${find("label:contains('Strategy')").attr('for')}`).length).to.eq(1);
          expect(find(`#${find("label:contains('Strategy params')").attr('for')}`).length).to.eq(1);
          expect(find(`#${find("label:contains('Activation time')").attr('for')}`).length).to.eq(1);
          return expect(find(`#${find("label:contains('Weight')").attr('for')}`).length).to.eq(1);
        });
      });
    })
  );

  return describe('fill form with correct data and submit', () =>
    it('sends correct data to the backend', function() {
      let counter = 0;

      server.patch('/tp-lcr-rules/:id', (schema, request) => {
        counter = counter + 1;
        const params = JSON.parse(request.requestBody);
        expect(params.data.attributes['tpid']).to.eq('tptest');
        expect(params.data.attributes['direction']).to.eq('*out');
        expect(params.data.attributes['tenant']).to.eq('cgrates.org');
        expect(params.data.attributes['category']).to.eq('call');
        expect(params.data.attributes['account']).to.eq('1001');
        expect(params.data.attributes['subject']).to.eq('*any');
        expect(params.data.attributes['destination-tag']).to.eq('DST_1002');
        expect(params.data.attributes['rp-category']).to.eq('lcr_profile1');
        expect(params.data.attributes['strategy']).to.eq('*load_distribution');
        expect(params.data.attributes['strategy-params']).to.eq('supplier1:5;supplier2:3;*default:1');
        expect(params.data.attributes['activation-time']).to.eq('2014-01-14T00:00:00Z');
        expect(params.data.attributes['weight']).to.eq(10);
        return { data: {id: this.tpLcrRule.id, type: 'tp-lcr-rule'} };
      });

      visit('/tariff-plans/1/tp-lcr-rules');
      click('table tbody tr:first-child a.edit');
      return andThen(function() {
        selectChoose(`#${find("label:contains('Direction')").attr('for')}`, '*out');
        fillIn(`#${find("label:contains('Tenant')").attr('for')}`, 'cgrates.org');
        fillIn(`#${find("label:contains('Category')").attr('for')}`, 'call');
        fillIn(`#${find("label:contains('Account')").attr('for')}`, '1001');
        fillIn(`#${find("label:contains('Subject')").attr('for')}`, '*any');
        selectSearch(`#${find("label:contains('Destination tag')").attr('for')}`, '1002');
        return andThen(function() {
          selectChoose(`#${find("label:contains('Destination tag')").attr('for')}`, 'DST_1002');
          fillIn(`#${find("label:contains('RP category')").attr('for')}`, 'lcr_profile1');
          selectChoose(`#${find("label:contains('Strategy')").attr('for')}`, '*load_distribution');
          fillIn(`#${find("label:contains('Strategy params')").attr('for')}`, 'supplier1:5;supplier2:3;*default:1');
          fillIn(`#${find("label:contains('Activation time')").attr('for')}`, '2014-01-14T00:00:00Z');
          fillIn(`#${find("label:contains('Weight')").attr('for')}`, '10');
          click('button[type="submit"]');
          return andThen(() => expect(counter).to.eq(1));
        });
      });
    })
  );
});