import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  }
});

const BookModel = model('Book', bookSchema);
export default BookModel;
