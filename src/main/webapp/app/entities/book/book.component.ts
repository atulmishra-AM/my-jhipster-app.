import { type Ref, defineComponent, inject, onMounted, ref } from 'vue';

import BookService from './book.service';
import { type IBook } from '@/shared/model/book.model';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Book',
  setup() {
    const bookService = inject('bookService', () => new BookService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const books: Ref<IBook[]> = ref([]);

    const isFetching = ref(false);

    const clear = () => {};

    const retrieveBooks = async () => {
      isFetching.value = true;
      try {
        const res = await bookService().retrieve();
        books.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveBooks();
    };

    onMounted(async () => {
      await retrieveBooks();
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IBook) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeBook = async () => {
      try {
        await bookService().delete(removeId.value);
        const message = `A Book is deleted with identifier ${removeId.value}`;
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveBooks();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      books,
      handleSyncList,
      isFetching,
      retrieveBooks,
      clear,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeBook,
    };
  },
});
