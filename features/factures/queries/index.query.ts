import { useQueryClient } from '@tanstack/react-query';

// 1- Clé de cache
export const contestationsKeyQuery = (...params: any[]) => {
  if (params.length === 0) {
    return ['contestations'];
  }
  return ['contestations', ...params];
};

// 2. Hook personnalisé pour l'invalidation des contestations
export const useInvalidateContestationsQuery = () => {
  const queryClient = useQueryClient();

  return async (...params: any[]) => {
    await queryClient.invalidateQueries({
      queryKey: contestationsKeyQuery(...params),
      exact: false,
    });

    await queryClient.refetchQueries({
      queryKey: contestationsKeyQuery(),
      type: 'active',
    });
  };
};



