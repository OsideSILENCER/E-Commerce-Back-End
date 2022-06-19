const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');






router.get('/', async(req, res) => {
  
  try {
      const tagsData = await Tag.findAll({ include: [{ model: Product }] })
      res.status(200).json(tagsData)
  } catch (error) {
      res.status(500).json(error)
  }
});

router.get('/:id', async(req, res) => {
  
  try {
      const tag = await Tag.findByPk(req.params.id, {
          include: [{ model: Product }]
      });
      res.status(200).json(tag)
  } catch (error) {
      res.status(500).json(error)
  };

});

router.post('/', (req, res) => {
  Tag.create(req.body)
  
  
  .then((tag)=> res.json(tag))
  .catch((err)=>{console.log(err)
    res.status(500).json(err)})
});

router.put('/:id', (req, res) => {
  Tag.update(req.body,{
    where: {id: req.params.id}
  })
  .then((tag)=> res.json(tag))
  .catch((err)=>{console.log(err)
    res.status(500).json(err)})
});


router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tagData) {
      res.status(404).json({ message: 'Sorry no tag found with this id exist!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
