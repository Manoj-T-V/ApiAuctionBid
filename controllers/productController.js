import Product from '../models/product.js';

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const createProduct = async (req, res) => {
    try {
      console.log("reques body is :", req);
      const { name, price, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
      const product = new Product(req.body);
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error creating product' });
    }
  };

export default { getProducts, createProduct };
