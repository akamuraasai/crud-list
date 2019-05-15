const fetch = require('node-fetch');

const endpoint = process.env.MAGENTO_ENDPOINT;
const url = `${endpoint}/users/me`;
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

const userMiddleware = async (req, res, next) => {
  const token = getToken(req);
  const { id } = await getUserByToken(token);

  if (id !== undefined) {
    req.userId = id;
    return next();
  }

  return res.status(401).send('Unauthorized');
};

module.exports = userMiddleware;
