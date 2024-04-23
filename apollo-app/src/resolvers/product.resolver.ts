import ProductModel from '../models/product.model.js';
import throwCustomError, {
  ErrorTypes,
} from '../helpers/error-handler.helper.js';

const productResolver = {
  Query: {
    // get product by id
    product: async (parent, { id }, contextValue) => {
      const product = await ProductModel.findById(id);
      if (!product) {
        throwCustomError(
          `Product (${id}) does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      return {
        id: product._id,
        ...product.toObject(),
      };
    },

    // get all products
    async getProducts(parent, args, contextValue) {
      const amount = args.amount;
      const allProducts = await ProductModel.find()
        .sort({ createdAt: -1 })
        .limit(amount);
      return allProducts;
    },
  },

  Mutation: {
    // create product
    createProduct: async (
      parent,
      { productInput: { name, price, description, category, image } },
      contextValue
    ) => {
      const productToCreate = new ProductModel({
        name: name,
        price: price,
        description: description,
        category: category,
        image: "none"
      });
      const res = await productToCreate.save();
      return {
        id: res.id,
        ...res.toObject(),
      };
    },

    // delete product
    deleteProduct: async (_, { id }, contextValue) => {
      const isDeleted = (await ProductModel.deleteOne({ _id: id })).deletedCount;
      return {
        isSuccess: isDeleted,
        message: 'Product deleted.',
      };
    },

    // edit product
    editProduct: async (
      _,
      { id, productInput: { name, price, description, category, image } },
      { user }
    ) => {
      const isEdited = (
        await ProductModel.updateOne(
          { _id: id },
          { 
            name: name,
            price: price,
            description: description,
            category: category,
            image: "none"
          }
        )
      ).modifiedCount;
      return {
        isSuccess: isEdited,
        message: 'Product Edited.',
      };
    },
  },
};

export default productResolver;
