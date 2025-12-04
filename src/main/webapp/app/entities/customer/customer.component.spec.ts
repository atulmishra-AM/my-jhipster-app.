import { vitest } from 'vitest';
import { type MountingOptions, shallowMount } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';

import Customer from './customer.vue';
import CustomerService from './customer.service';
import AlertService from '@/shared/alert/alert.service';

type CustomerComponentType = InstanceType<typeof Customer>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('Customer Management Component', () => {
    let customerServiceStub: SinonStubbedInstance<CustomerService>;
    let mountOptions: MountingOptions<CustomerComponentType>['global'];

    beforeEach(() => {
      customerServiceStub = sinon.createStubInstance<CustomerService>(CustomerService);
      customerServiceStub.retrieve.resolves({ headers: {} });

      alertService = new AlertService({
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          bModal: bModalStub as any,
          'font-awesome-icon': true,
          'b-badge': true,
          'b-button': true,
          'router-link': true,
        },
        directives: {
          'b-modal': {},
        },
        provide: {
          alertService,
          customerService: () => customerServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        customerServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(Customer, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(customerServiceStub.retrieve.calledOnce).toBeTruthy();
        expect(comp.customers[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: CustomerComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(Customer, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        customerServiceStub.retrieve.reset();
        customerServiceStub.retrieve.resolves({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        customerServiceStub.delete.resolves({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeCustomer();
        await comp.$nextTick(); // clear components

        // THEN
        expect(customerServiceStub.delete.called).toBeTruthy();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(customerServiceStub.retrieve.callCount).toEqual(1);
      });
    });
  });
});
