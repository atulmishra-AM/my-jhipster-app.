import { vitest } from 'vitest';
import { type MountingOptions, shallowMount } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import BookUpdate from './book-update.vue';
import BookService from './book.service';
import AlertService from '@/shared/alert/alert.service';

import CustomerService from '@/entities/customer/customer.service';

type BookUpdateComponentType = InstanceType<typeof BookUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const bookSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<BookUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Book Management Update Component', () => {
    let comp: BookUpdateComponentType;
    let bookServiceStub: SinonStubbedInstance<BookService>;

    beforeEach(() => {
      route = {};
      bookServiceStub = sinon.createStubInstance<BookService>(BookService);
      bookServiceStub.retrieve.onFirstCall().resolves(Promise.resolve([]));

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
          bookService: () => bookServiceStub,
          customerService: () =>
            sinon.createStubInstance<CustomerService>(CustomerService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      };
    });

    afterEach(() => {
      vitest.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(BookUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.book = bookSample;
        bookServiceStub.update.resolves(bookSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(bookServiceStub.update.calledWith(bookSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        bookServiceStub.create.resolves(entity);
        const wrapper = shallowMount(BookUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.book = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(bookServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        bookServiceStub.find.resolves(bookSample);
        bookServiceStub.retrieve.resolves([bookSample]);

        // WHEN
        route = {
          params: {
            bookId: `${bookSample.id}`,
          },
        };
        const wrapper = shallowMount(BookUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.book).toMatchObject(bookSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        bookServiceStub.find.resolves(bookSample);
        const wrapper = shallowMount(BookUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
