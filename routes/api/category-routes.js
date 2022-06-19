const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get("/", async(req, res) => {
  try {
      const categoriesData = await Category.findAll({
          include: [{ model: Product }],
      });
      res.status(200).json(categoriesData);
  } catch (error) {
      res.status(500).json(error);
  }
});


router.get("/:id", async(req, res) => {
 
  try {
      const category = await Category.findByPk(req.params.id, {
          include: [{ model: Product }],
      });
      res.status(200).json(category);
  } catch (error) {
      res.status(500).json(error);
  }
});


router.post('/', (req, res) => {
  Category.create(req.body)
  .then( (Categories)=> res.status(200).json(Categories) )
  .catch( (err)=> res.status(500).json(err) )
  
});

router.put('/:id', (req, res) => {
  Category.update(req.body,{
    where: {id:req.params.id}
  })
  .then( (Categories)=> res.status(200).json(Categories) )
  .catch( (err)=> res.status(500).json(err) )
  
});


router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'Sorry no category with this id exist !' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;




