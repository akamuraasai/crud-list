const List = require('../Models/List');
const baseRoute = '/lists';

const productsToArray = list => {
  const str = JSON.stringify(list);
  const obj = JSON.parse(str);
  return {
    ...obj,
    products: (obj.products || '').split(','),
  };
};

const routes = (router) => {
  router.get(baseRoute, async (req, res) => {
    const { userId = 1 } = req.body;
    const lists = await List.findAll({
      where: {
        userId,
      },
    });
    res.send(lists.map(productsToArray));
  });

  router.get(`${baseRoute}/:id`, async (req, res) => {
    const { id } = req.params;
    const { userId = 1 } = req.body;
    const list = await List.findOne({ where: { id, userId } });

    res.send(productsToArray(list));
  });

  router.post(baseRoute, async (req, res) => {
    const { name, products, userId = 1 } = req.body;
    const list = await List.create({ name, products, userId });

    res.send(productsToArray(list));
  });

  router.patch(`${baseRoute}/:id`, async (req, res) => {
    const { id } = req.params;
    const { name, products, userId = 1 } = req.body;
    const list = await List.findOne({ where: { id, userId } });
    if (list !== null) {
      await list.update({ name, products });
      await list.save();
    }

    res.send(productsToArray(list));
  });

  router.delete(`${baseRoute}/:id`, async (req, res) => {
    const { id } = req.params;
    const { userId = 1 } = req.body;
    const list = await List.findOne({ where: { id, userId } });
    if (list !== null) {
      await list.destroy();
      await list.save();
    }

    res.send(productsToArray(list));
  });

  return router;
};

module.exports = routes;
