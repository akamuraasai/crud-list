const List = require('../Models/List');
const { Sequelize } = require('../database');

const baseRoute = '/lists';

const toNumber = arr => arr.map(Number);

const productsToArray = obj => ({
  ...obj,
  products: (obj && obj.products.length > 0) ? toNumber(obj.products.split(',')) : [],
  createdAt: Math.floor(new Date(obj.createdAt || '') / 1000),
  updatedAt: Math.floor(new Date(obj.updatedAt || '') / 1000),
});

const routes = (router) => {
  router.get(baseRoute, async (req, res) => {
    const { userId } = req;
    const lists = await List.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    res.send(lists.map(productsToArray));
  });

  router.get(`${baseRoute}/:id`, async (req, res) => {
    const { userId } = req;
    const { id } = req.params;
    const list = await List.findOne({ where: { id, userId }, raw: true });

    res.send(productsToArray(list));
  });

  router.post(baseRoute, async (req, res) => {
    const { userId } = req;
    const { name, products } = req.body;
    const strProducts = products.join(',');
    const list = await List.create({ name, products: strProducts, userId });
    const obj = JSON.parse(JSON.stringify(list));

    res.status(201).send(productsToArray(obj));
  });

  router.patch(`${baseRoute}/:id`, async (req, res) => {
    const { userId } = req;
    const { id } = req.params;
    const { name, products } = req.body;
    const strProducts = products.join(',');
    const list = await List.findOne({ where: { id, userId } });
    if (list !== null) {
      await list.update({ name, products: strProducts });
      await list.save();
    }

    const obj = JSON.parse(JSON.stringify(list));
    res.send(productsToArray(obj));
  });

  router.delete(`${baseRoute}/:id`, async (req, res) => {
    const { userId } = req;
    const { id } = req.params;
    const list = await List.findOne({ where: { id, userId } });
    if (list !== null) {
      await list.destroy();
      await list.save();
    }

    const obj = JSON.parse(JSON.stringify(list));
    res.send(productsToArray(obj));
  });

  router.post(`${baseRoute}/delete`, async (req, res) => {
    const { userId } = req;
    const { ids } = req.body;
    await List.destroy({
      where: {
        id: {
          [Sequelize.Op.in]: ids,
        },
        userId,
      },
    });

    const lists = await List.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    res.send(lists.map(productsToArray));
  });

  return router;
};

module.exports = routes;
