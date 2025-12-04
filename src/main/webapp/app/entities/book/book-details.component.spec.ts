import { vitest } from 'vitest';
import { type MountingOptions, shallowMount } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import BookDetails from './book-details.vue';
import BookService from './book.service';
import AlertService from '@/shared/alert/alert.service';

type BookDetailsComponentType = InstanceType<typeof BookDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const bookSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Book Management Detail Component', () => {
    let bookServiceStub: SinonStubbedInstance<BookService>;
    let mountOptions: MountingOptions<BookDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      bookServiceStub = sinon.createStubInstance<BookService>(BookService);

      alertService = new AlertService({
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'router-link': true,
        },
        provide: {
          alertService,
          bookService: () => bookServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        bookServiceStub.find.resolves(bookSample);
        route = {
          params: {
            bookId: `${123}`,
          },
        };
        const wrapper = shallowMount(BookDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.book).toMatchObject(bookSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        bookServiceStub.find.resolves(bookSample);
        const wrapper = shallowMount(BookDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
