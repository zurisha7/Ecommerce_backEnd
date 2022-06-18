const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
 await Category.findAll({
    attributes: [
      'id',
      'category_name'
    ],
    include: [{
      model: Product,
      attributes: [
        'id',
        'product_name',
        'price',
        'stock',
        'category_id'
      ],
     include: {
      model: Tag,
      attributes: ['id','tag_name'],
      through: 'ProductTag'
     }
 }]
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
    await Category.findOne({
      where: {
        id: req.params.id 
      },
      include: [
        {
          model: Product,
          attributes: [ 'id',
          'product_name',
          'price',
          'stock',
          'category_id'],
        }
      ]
     })
     .then(dbCategoryData => res.json(dbCategoryData))
     .catch(err => {
       console.log(err);
       res.status(500).json(err);
     })
});


router.post('/', async (req, res) => {
await Category.create({
    category_name: req.body.category_name,
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  });

});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(
    {
      category_name: req.body.category_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbCategoryData => {
    res.json(dbCategoryData);
  })
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  })
});

router.delete('/:id', async (req, res) => {

  // delete a category by its `id` value
  await Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbCategoryData => {
    if(!dbCategoryData) {
    res.status(404).json({ message: 'No category found with this id'});
    return;
  }
  res.json(dbCategoryData);
})
  .catch(err => {
    res.status(500).json(err)
  });

  
});

module.exports = router;