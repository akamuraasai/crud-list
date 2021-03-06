const fetch = require('node-fetch');

// const endpoint = process.env.MAGENTO_ENDPOINT;
// const url = `${endpoint}/users/me`;
const urlCustomer = 'https://staging.zaxapp.com.br/graphql';
const urlCustomerProd = 'https://www.zaxapp.com.br/graphql';
const getToken = ({ headers = {} }) => headers.authorization;

// const getUserByToken = async (Authorization) => {
//   try {
//     const response = await fetch(url, {
//       method: 'get',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization,
//       },
//     });
//     const { id } = await response.json();
//
//     return { id };
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.log(err);
//     return {};
//   }
// };

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
    const { data } = await response.json();
    const { customer } = data || {};
    const { id } = customer || {};

    return { id };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return { error: err.type, message: err.message };
  }
};

const getCustomerByTokenProd = async (Authorization) => {
  try {
    const response = await fetch(urlCustomerProd, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
      body: '{"query":"{customer{id}}"}',
    });
    const { data } = await response.json();
    const { customer } = data || {};
    const { id } = customer || {};

    return { id };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return { error: err.type, message: err.message };
  }
};

const userMiddleware = async (req, res, next) => {
  const token = getToken(req);
  // const user = await getUserByToken(token);
  const customer = await getCustomerByToken(token);
  console.log('customer staging', customer);
  if (customer.id !== undefined) {
    req.userId = customer.id;
    return next();
  }

  // if (user.id !== undefined) {
  //   req.userId = user.id;
  //   return next();
  // }

  const customerProd = await getCustomerByTokenProd(token);
  console.log('customer production', customerProd);
  if (customerProd.id !== undefined) {
    req.userId = customerProd.id;
    return next();
  }


  if (customerProd.error === 'invalid-json') {
    return res.status(500).send(customerProd.message);
  }
  if (customer.error === 'invalid-json') {
    return res.status(500).send(customer.message);
  }

  if (customer.error === undefined && customerProd.error === undefined) {
    return res.status(401).send('"Unauthorized"');
  }

  return res.status(500).send('"Internal Server Error"');
};

module.exports = userMiddleware;
