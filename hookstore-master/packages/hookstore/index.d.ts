import * as React from 'react';
import { PropsWithChildren } from 'react';

export type State = {};

export type ActionFn = () => any | Promise<any>;

export type Model = {
  readonly name: string, // name of model
  state?: State, // model state
  actions: {
    [action: string]: ActionFn,
  }
}

// export type BoundAction = (this: { ctx: Context }, ...args: any[]) => Promise<any>;
export type BoundAction = (...args: any[]) => Promise<any>;

export type Actions = {
  [ action: string ]: BoundAction
}

// selector(state => state.count);
export type Selector<S = State> = (state: S) => any;

export type Context<S = {}> = {
  // access current store's name
  readonly name: string,
  // access current action's name
  readonly action: string,
  // access the lastest state in current store
  state: S,
  // access the bound action collection of current store
  actions: Actions,
  // access the lastest state and actions of some other store
  getStore: (name?: string, selector?: Selector<S>) => [ any, Actions ],
  // fresh the changed state to DOM(inside action handler) before action run finished
  fresh: (msg?: string) => void,
}

export type Next = () => Promise<any>;

export type Middleware = (ctx: Context, next: Next) => Promise<any>;

export type ProviderProps = {
  model?: Model,
  models?: Model[],
}

export const Provider: React.FC<PropsWithChildren<ProviderProps>>;

export function useStore<S = State>(
  name: string,
  selector?: Selector<S>,
  equalityFn?: (a: any, b: any) => boolean
): [ any, Actions ];

export function useStatus(actionWithName: string): {
  error: null | Error,
  pending: boolean,
};

export function getStore<S = State>(name: string, selector?: Selector<S>): [ any, Actions ];

export function applyMiddlewares(middlewares: Middleware[]): void;
