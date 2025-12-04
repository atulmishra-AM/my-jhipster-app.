import { type Ref, defineComponent, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BookService from './book.service';
import { type IBook } from '@/shared/model/book.model';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'BookDetails',
  setup() {
    const bookService = inject('bookService', () => new BookService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);
    const book: Ref<IBook> = ref({});

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

    return {
      alertService,
      book,

      previousState,
    };
  },
});
