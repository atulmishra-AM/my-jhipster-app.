<template>
  <div>
    <h2 id="page-heading" data-cy="BookHeading">
      <span id="book-heading">Books</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon> <span>Refresh list</span>
        </button>
        <router-link :to="{ name: 'BookCreate' }" custom v-slot="{ navigate }">
          <button @click="navigate" id="jh-create-entity" data-cy="entityCreateButton" class="btn btn-primary jh-create-entity create-book">
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>Create a new Book</span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && books && books.length === 0">
      <span>No Books found</span>
    </div>
    <div class="table-responsive" v-if="books && books.length > 0">
      <table class="table table-striped" aria-describedby="books">
        <thead>
          <tr>
            <th scope="row"><span>ID</span></th>
            <th scope="row"><span>Name</span></th>
            <th scope="row"><span>Title</span></th>
            <th scope="row"><span>Price</span></th>
            <th scope="row"><span>Customer</span></th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'BookView', params: { bookId: book.id } }">{{ book.id }}</router-link>
            </td>
            <td>{{ book.name }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.price }}</td>
            <td>
              <div v-if="book.customer">
                <router-link :to="{ name: 'CustomerView', params: { customerId: book.customer.id } }">{{ book.customer.id }}</router-link>
              </div>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'BookView', params: { bookId: book.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">View</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'BookEdit', params: { bookId: book.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">Edit</span>
                  </button>
                </router-link>
                <b-button
                  @click="prepareRemove(book)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntity
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline">Delete</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <template #modal-title>
        <span id="myJhipsterAppApp.book.delete.question" data-cy="bookDeleteDialogHeading">Confirm delete operation</span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-book-heading">Are you sure you want to delete Book {{ removeId }}?</p>
      </div>
      <template #modal-footer>
        <div>
          <button type="button" class="btn btn-secondary" @click="closeDialog()">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-book"
            data-cy="entityConfirmDeleteButton"
            @click="removeBook()"
          >
            Delete
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./book.component.ts"></script>
