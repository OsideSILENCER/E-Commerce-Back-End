const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');




router.get('/', (req, res) => {
  Product.findAll({
    include: [Category, 
    {model: Tag, through: ProductTag}]
  })
  .then((Products)=> res.json(Products))
  .catch((err)=>{console.log(err)
  res.status(500).json(err)})
  
});


router.get('/:id', (req, res) => {
  Product.findOne({
    where :{id:req.params.id},
    include: [Category, 
      {model: Tag, through: ProductTag}]
  })
  .then((Products)=> res.json(Products))
  .catch((err)=>{console.log(err)
  res.status(500).json(err)})
  
});


router.post('/', (req, res) => {
  Product.create(req.body)
  .then((product)=>{
    if(req.body.tagIds && req.body.tagIds.length){
      const productTagIdArr=req.body.tagIds.map((tag_id)=>{
        return {
          product_id: product.id,
          tag_id
        }
      })
      return ProductTag.bulkCreate(productTagIdArr)
    }
    res.status(200).json(product)
  })
  .then((productTagIds)=> res.status(200).json(productTagIds))
  .catch((err)=> {res.status(400).json(err)})
  

  router.post('/', (req, res) => {
    Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      tagIds: req.body.tagIds
    })
      .then((product) => {
        
        if (req.body.tagIds) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
        }
        res.status(200).json(product);
      })
      .then((productTagIds) => res.status(200).json(productTagIds))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  });
  


router.put('/:id', (req, res) => {
  
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      
      res.status(400).json(err);
    });
});



router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productData) {
      res.status(404).json({ message: 'Sorry no product found with this id exist!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});
});

module.exports = router;