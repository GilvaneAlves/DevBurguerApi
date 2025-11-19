
const adminMidleware = (request, response, next) => {
  console.log('isUserAdmin:', request.userIsAdmin);

  const isUserAdmin = request.userIsAdmin;

  if (!isUserAdmin) {
    return response.status(401).json();
  }


  return next();
};

export default adminMidleware;