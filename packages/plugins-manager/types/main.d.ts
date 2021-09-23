type AnyFn = (...args: any[]) => any;
type Plugin = Constructor | AnyFn;
type Constructor<T = {}> = { new (...args: any[]): T };
type FunctionParams<T> = T extends (...args: infer U) => string ? U : never;

export type GetPluginOptions<T> = Partial<
  T extends Constructor ? ConstructorParameters<T>[0] : T extends AnyFn ? FunctionParams<T>[0] : T
>;

export interface MetaPlugin<T> {
  plugin: Plugin;
  options?: GetPluginOptions<T>;
}

export interface ManagerOptions {
  how?: 'after' | 'before' | 'fixed';
  location?: 'top' | 'bottom' | Plugin;
}

// --- TYPES for mergeOptions ---
// function adjustPluginOptions<T>(plugin: T, options: GetPluginOptions<T> | (( options: GetPluginOptions<T>) => GetPluginOptions<T>)) {



// ==== old =====

// export type AddPluginOptions<T> = MetaPlugin<T> & {
//   how?: 'after' | 'before' | 'fixed';
//   location?: 'top' | 'bottom' | string;
// };

// export type AddPluginType = <F>(metaPluginAndOptions: AddPluginOptions<F>) => AddPluginFn;

// export type AddPluginFn = (plugins: MetaPlugin[]) => MetaPlugin[];

// export interface MetaPluginWrapable extends MetaPlugin {
//   __noWrap?: boolean;
// }
