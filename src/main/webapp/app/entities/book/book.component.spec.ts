import { vitest } from 'vitest';
import { type MountingOptions, shallowMount } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';

import Book from './book.vue';
import BookService from './book.service';
import AlertService from '@/shared/alert/alert.service';

type BookComponentType = InstanceType<typeof Book>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('Book Management Component', () => {
    let bookServiceStub: SinonStubbedInstance<BookService>;
    let mountOptions: MountingOptions<BookComponentType>['global'];

    beforeEach(() => {
      bookServiceStub = sinon.createStubInstance<BookService>(BookService);
      bookServiceStub.retrieve.resolves({ headers: {} });

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
          bookService: () => bookServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        bookServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(Book, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(bookServiceStub.retrieve.calledOnce).toBeTruthy();
        expect(comp.books[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: BookComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(Book, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        bookServiceStub.retrieve.reset();
        bookServiceStub.retrieve.resolves({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        bookServiceStub.delete.resolves({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeBook();
        await comp.$nextTick(); // clear components

        // THEN
        expect(bookServiceStub.delete.called).toBeTruthy();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(bookServiceStub.retrieve.callCount).toEqual(1);
      });
    });
  });
});
