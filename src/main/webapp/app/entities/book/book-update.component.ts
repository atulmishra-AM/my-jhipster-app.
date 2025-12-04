import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import BookService from './book.service';
import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import CustomerService from '@/entities/customer/customer.service';
import { type ICustomer } from '@/shared/model/customer.model';
import { Book, type IBook } from '@/shared/model/book.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'BookUpdate',
  setup() {
    const bookService = inject('bookService', () => new BookService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const book: Ref<IBook> = ref(new Book());

    const customerService = inject('customerService', () => new CustomerService());

    const customers: Ref<ICustomer[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveBook = async bookId => {
      try {
        const res = await bookService().find(bookId);
        book.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.bookId) {
      retrieveBook(route.params.bookId);
    }

    const initRelationships = () => {
      customerService()
        .retrieve()
        .then(res => {
          customers.value = res.data;
        });
    };

    initRelationships();

    const validations = useValidation();
    const validationRules = {
      name: {},
      title: {},
      price: {},
      customer: {},
    };
    const v$ = useVuelidate(validationRules, book as any);
    v$.value.$validate();

    return {
      bookService,
      alertService,
      book,
      previousState,
      isSaving,
      currentLanguage,
      customers,
      v$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.book.id) {
        this.bookService()
          .update(this.book)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(`A Book is updated with identifier ${param.id}`);
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.bookService()
          .create(this.book)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(`A Book is created with identifier ${param.id}`);
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
