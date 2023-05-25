
/**
 * @author cxs
 * @date 2023-05-20
 * @update 2023-05-20
 * @description 插件配置接口
 * @interface IPluginConfig
 * @export
 */
class PluginConfig implements IPluginConfig  {
    private static instance: PluginConfig;
    components: Map<String, any>;

    private constructor() {
        this.components = new Map<String, any>();
    }

    public static getInstance(): PluginConfig {
        if (!PluginConfig.instance) {
            PluginConfig.instance = new PluginConfig();
        }
        return PluginConfig.instance;
    }
    
    public addComponent(name: String, component: any): void {
        this.components.set(name, component);
    }

    public setComponents(components: Map<String, any>): void {
        this.components = components;
    }

    public getComponent(name: String): any {
        return this.components.get(name);
    }

    public getComponents(): Map<String, any> {
        return this.components;
    }
   
}

export { PluginConfig }