import type { QueryClient } from '../core/queryClient';
import type { Query, QueryState } from '../core/query';
import type { MutationKey, MutationOptions, QueryKey, QueryOptions } from '../core/types';
import type { Mutation, MutationState } from '../core/mutation';
export interface DehydrateOptions {
    dehydrateMutations?: boolean;
    dehydrateQueries?: boolean;
    shouldDehydrateMutation?: ShouldDehydrateMutationFunction;
    shouldDehydrateQuery?: ShouldDehydrateQueryFunction;
}
export interface HydrateOptions {
    defaultOptions?: {
        queries?: QueryOptions;
        mutations?: MutationOptions;
    };
}
interface DehydratedMutation {
    mutationKey?: MutationKey;
    state: MutationState;
}
interface DehydratedQuery {
    queryHash: string;
    queryKey: QueryKey;
    state: QueryState;
}
export interface DehydratedState {
    mutations: DehydratedMutation[];
    queries: DehydratedQuery[];
}
export declare type ShouldDehydrateQueryFunction = (query: Query) => boolean;
export declare type ShouldDehydrateMutationFunction = (mutation: Mutation) => boolean;
export declare function dehydrate(client: QueryClient, options?: DehydrateOptions): DehydratedState;
export declare function hydrate(client: QueryClient, dehydratedState: unknown, options?: HydrateOptions): void;
export {};
