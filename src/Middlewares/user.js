const fetch = require('node-fetch');

const endpoint = process.env.MAGENTO_ENDPOINT;
const url = `${endpoint}/users/me`;
const urlCustomer = 'https://staging.zaxapp.com.br/graphql';
const getToken = ({ headers = {} }) => headers.authorization;

const getUserByToken = async (Authorization) => {
  try {
    const response = await fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
    });
    const { id } = await response.json();

    return { id };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return {};
  }
};

const getCustomerByToken = async (Authorization) => {
  try {
    const response = await fetch(urlCustomer, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
      body: '{"query":"{customer{id}}"}',
    });
    const { data = {} } = await response.json();
    const { customer } = data;
    const { id } = customer;

    return { id };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return {};
  }
};

const userMiddleware = async (req, res, next) => {
  const token = getToken(req);
  const user = await getUserByToken(token);
  const customer = await getCustomerByToken(token);

  if (user.id !== undefined) {
    req.userId = user.id;
    return next();
  }

  if (customer.id !== undefined) {
    req.userId = customer.id;
    return next();
  }

  return res.status(401).send('"Unauthorized"');
};

module.exports = userMiddleware;
