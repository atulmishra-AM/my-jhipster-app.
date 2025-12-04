import { vitest } from 'vitest';
import { type MountingOptions, shallowMount } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import CustomerUpdate from './customer-update.vue';
import CustomerService from './customer.service';
import AlertService from '@/shared/alert/alert.service';

type CustomerUpdateComponentType = InstanceType<typeof CustomerUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const customerSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<CustomerUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Customer Management Update Component', () => {
    let comp: CustomerUpdateComponentType;
    let customerServiceStub: SinonStubbedInstance<CustomerService>;

    beforeEach(() => {
      route = {};
      customerServiceStub = sinon.createStubInstance<CustomerService>(CustomerService);
      customerServiceStub.retrieve.onFirstCall().resolves(Promise.resolve([]));

      alertService = new AlertService({
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'b-input-group': true,
          'b-input-group-prepend': true,
          'b-form-datepicker': true,
          'b-form-input': true,
        },
        provide: {
          alertService,
          customerService: () => customerServiceStub,
        },
      };
    });

    afterEach(() => {
      vitest.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(CustomerUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.customer = customerSample;
        customerServiceStub.update.resolves(customerSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(customerServiceStub.update.calledWith(customerSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        customerServiceStub.create.resolves(entity);
        const wrapper = shallowMount(CustomerUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.customer = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(customerServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        customerServiceStub.find.resolves(customerSample);
        customerServiceStub.retrieve.resolves([customerSample]);

        // WHEN
        route = {
          params: {
            customerId: `${customerSample.id}`,
          },
        };
        const wrapper = shallowMount(CustomerUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.customer).toMatchObject(customerSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        customerServiceStub.find.resolves(customerSample);
        const wrapper = shallowMount(CustomerUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
