const privateResolver = resolverFunction => async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  if (!context.req['user_id']) {
    const error = new Error('UNAUTHENTICATED');
    error.message = '401_ERROR_NO_JWT_UNAUTHENTICATED';
    throw error;
  }

  const resolved = await resolverFunction(parent, args, context, info);
  return resolved;
};

export default privateResolver;
