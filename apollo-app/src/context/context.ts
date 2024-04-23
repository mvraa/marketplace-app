import jwt from 'jsonwebtoken';
import throwCustomError, {
  ErrorTypes,
} from '../helpers/error-handler.helper.js';

const getUser = async (token) => {
  try {
    if (token) {
      const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const context = async ({ req, res }) => {
  if (req.body.operationName === 'IntrospectionQuery') {
    return {};
  }

  if (
    req.body.operationName === 'CreateUser' ||
    req.body.operationName === 'Login'
  ) {
    return {};
  }

  const token = req.headers.authorization || '';

  const user = await getUser(token);

  if (!user) {
    throwCustomError('User is not Authenticated', ErrorTypes.UNAUTHENTICATED);
  }

  return { user };
};

export default context;
