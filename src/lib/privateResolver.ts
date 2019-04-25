const privateResolver = resolverFunction => async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  if (!context.req['user_id']) {
    throw new Error('401_ERROR_NO_JWT_UNAUTHENTICATED');
  }

  const resolved = await resolverFunction(parent, args, context, info);
  return resolved;
};

export default privateResolver;
