import BookModel from '../models/book.model.js';
import throwCustomError, {
  ErrorTypes,
} from '../helpers/error-handler.helper.js';

const bookResolver = {
  Query: {
    // get book by id
    book: async (parent, { id }, contextValue) => {
      const book = await BookModel.findById(id);
      if (!book) {
        throwCustomError(
          `Book (${id}) does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      return {
        id: book._id,
        ...book.toObject(),
      };
    },

    // get all books
    async getBooks(parent, args, contextValue) {
      const amount = args.amount;
      const allBooks = await BookModel.find()
        .sort({ createdAt: -1 })
        .limit(amount);
      return allBooks;
    },
  },

  Mutation: {
    // create book
    createBook: async (
      parent,
      { bookInput: { title, author } },
      contextValue
    ) => {
      const bookToCreate = new BookModel({
        title: title,
        author: author
      });
      const res = await bookToCreate.save();
      return {
        id: res.id,
        ...res.toObject(),
      };
    },

    // delete book
    deleteBook: async (_, { id }, contextValue) => {
      const isDeleted = (await BookModel.deleteOne({ _id: id })).deletedCount;
      return {
        isSuccess: isDeleted,
        message: 'Book deleted.',
      };
    },

    // edit book
    editBook: async (
      _,
      { id, bookInput: { title, author } },
      { user }
    ) => {
      const isEdited = (
        await BookModel.updateOne(
          { _id: id },
          { 
            name: title,
            author: author 
          }
        )
      ).modifiedCount;
      return {
        isSuccess: isEdited,
        message: 'Book Edited.',
      };
    },
  },
};

export default bookResolver;
