type AnyFn = (...args: any[]) => any;
type Plugin = Constructor | AnyFn;
type Constructor<T = {}> = { new (...args: any[]): T };
type FunctionParams<T> = T extends (...args: infer U) => string ? U : Object;

export type GetPluginOptions<T> = 
  T extends Constructor ? ConstructorParameters<T>[0] : T extends AnyFn ? FunctionParams<T>[0] : T
;

export interface MetaPlugin<T> {
  plugin: Plugin;
  options: GetPluginOptions<T>;
}

export interface ManagerOptions {
  how?: 'after' | 'before' | 'fixed';
  location?: 'top' | 'bottom' | Plugin;
}

export type adjustPluginOptionsOptions<T> = GetPluginOptions<T> | (( options: GetPluginOptions<T>) => GetPluginOptions<T>)


// export interface MetaPluginWrapable extends MetaPlugin {
//   __noWrap?: boolean;
// }
