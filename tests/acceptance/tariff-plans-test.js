import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { setupApplicationTest } from 'ember-mocha';
import { authenticateSession } from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { visit, find, findAll, click, currentURL } from '@ember/test-helpers';

describe('Acceptance: TariffPlans', function () {
  let hooks = setupApplicationTest();
  setupMirage(hooks);

  beforeEach(async function () {
    await authenticateSession({email: 'user@exmple.com'});
  });

  describe('visit /tariff-plans', function () {
    it('renders list of tariff-plans cards', async function () {
      server.createList('tariff-plan', 5);
      await visit('/tariff-plans');
      expect(findAll('[data-test-tarif-plan-card]').length).to.eq(5);
    });
    it('displays tp-plan name', async function () {
      this.tpPlan = server.create('tariff-plan');
      await visit('/tariff-plans');
      expect(find('[data-test-tarif-plan-card] .card-header').textContent).to.eq(this.tpPlan.name);
    });
    it('displays tp-plan description', async function () {
      this.tpPlan = server.create('tariff-plan');
      await visit('/tariff-plans');
      expect(find('[data-test-tarif-plan-card] .card-text').textContent.trim()).to.eq(this.tpPlan.description);
    });
  });

  describe('select tariff plan', () =>
    it('reditects to tariff plan page', async function () {
      this.tpPlan = server.create('tariff-plan');
      await visit('/tariff-plans');
      await click('[data-test-tarif-plan-card] [data-test-select-tp-plan]');
      expect(currentURL()).to.eq(`/tariff-plans/${this.tpPlan.id}`);
    })
  );

  describe('click to edit button', () =>
    it('reditects to edit tariff plan page', async function () {
      this.tpPlan = server.create('tariff-plan');
      await visit('/tariff-plans');
      await click('[data-test-tarif-plan-card] [data-test-edit-tp-plan]');
      expect(currentURL()).to.equal(`/tariff-plans/${this.tpPlan.id}/edit`);
    })
  );

  describe('click to add button', () =>
    it('redirects to tariff-plans/new page', async function () {
      this.tpPlan = server.create('tariff-plan');
      await visit('/tariff-plans');
      await click('[data-test-add-tp-plan]');
      expect(currentURL()).to.equal('/tariff-plans/new');
    })
  );
});
