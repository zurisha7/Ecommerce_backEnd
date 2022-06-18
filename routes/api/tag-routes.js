const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  await Tag.findAll({
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['id',
        'product_name',
        'price',
        'stock',
        'category_id'],
          through: 'ProductTag'
        },
       ],  
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  await Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: [ 
    'id',
    'product_name',
    'price',
    'stock',
    'category_id'
    ],
    through: 'ProductTag',

    include: [
      {
        model: Category,
        attributes: ['id', 'category_name'],
      },
    ]
  })
  .then(db)
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  await Tag.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  await Tag.update(
    {
      product_name: req.body.product_name
    },
    {
      where: {
        id: req.params.id
      }
    })
    .then(dbTagData => {
      if(!dbTagData) {
        res.status(404).json({ message: 'No tag found with this id' })
        return;
      }
      res.json(dbTagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  await Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if(!dbTagData) {
    res.status(404).json({ message: 'No tag found with this id'});
    return;
  }
  res.json(dbTagData);
})
  .catch(err => {
    res.status(500).json(err)
  });
});

module.exports = router;