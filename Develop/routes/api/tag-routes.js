const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/',async (req, res) => {
  // find all tags
  // be sure to include its associated Product data

  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
    include: [{ model: Product, through: Tag, as: "all_tag" }];
  }



});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: Category,
        attributes: ["tag_id"],
      },
    });

    if (TagData) {
      res.status(404).json({ message: "No tag with this ID!" });
      return;
    }

    res.status(200).json(TagData);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.post('/', async(req, res) => {
  // create a new tag

  Tag.create(req.body)
  .then((product) => {
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(product);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });





});

router.put('/:id', async(req, res) => {
  // update a tag's name by its `id` value

  try {
    const TagData = await Tag.update(
      {
        tag_name: req.body.tag_name
      },
      {
        where: {id: req.params.id}
      })
    if (!TagData[0]) {
      res.status(404).json({ message: 'No Tag with this that ID!' });
      return;
    }
    res.status(200).json(TagData);
  } catch (err) {
    res.status(500).json(err);
  }






  
});

router.delete('/:id', async(req, res) => {
  // delete on tag by its `id` value
  try {
    const TagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })

    if (!TagData) {
      res.status(404).json({ message: 'No Tag with this that ID!' });
      return;
    }

    res.status(200).json(TagData);
  } catch (err) {
    res.status(500).json(err);
  }


});

module.exports = router;
