import { Stencil } from "@antv/x6-plugin-stencil";
import { register } from "@antv/x6-vue-shape";
import * as Common from "@/common";
import { Graph, Node } from "@antv/x6";
import { PluginConfig } from ".";
import { getDropComponent } from '@/editor/components/canvas-editor/DropComponent'
import { Component } from "vue";
/**
 * @author cxs
 * @date 2023-04-20
 * @update 2023-04-20
 * @description 左侧组件列表
 * @class StencilConfig
 * @param containerId 组件列表容器id
 * @param graph 画布
 */
class StencilConfig implements IStencilConfig {
    private static instance: StencilConfig;
    graph: Graph | undefined = undefined;
    stencil: Stencil | undefined = undefined;
    stencilId: string;
    groups: Stencil.Group[];
    dropNodes: Map<string, Node> = new Map<string, Node>();
    /**
     * 构造函数
     * @param graph 
     * @param groups 
     * @param stencilId 
     */
    private constructor(
        graph: Graph, 
        groups: Stencil.Group[],
        stencilId: string) {
        this.graph = graph;
        this.stencilId = stencilId;
        this.groups = groups;
        this.initStencil();
    }

    /**
     * 获取单例
     * @param graph 
     * @param groups 
     * @param stencilId 
     * @returns 
     */
    public static getInstance (
        graph: Graph, 
        groups: Stencil.Group[], 
        stencilId: string = Common.DEFAULT_STENCIL_CONTAINER_ID): StencilConfig {
        if (!StencilConfig.instance) {
            StencilConfig.instance = new StencilConfig(graph, groups, stencilId);
        }
        return StencilConfig.instance;
    }

    initStencil(): void {
        const __this = this;
        this.stencil = new Stencil({
            title: '组件列表',
            target: this.graph,
            search(cell, keyword) {
                const text = cell.getAttrs()?.text?.text || '';
                if (typeof text === 'string') {
                    return text.indexOf(keyword) !== -1
                }
                return false;
            },
            groups: this.groups,
            layoutOptions: {    
                columns: 2,
                resizeToFit: true,
            },
            stencilGraphWidth: 280,
            getDropNode(draggingNode) {
                return __this.getDropNode(draggingNode);
            }
        });

        document.getElementById(this.stencilId)?.appendChild(this.stencil.container);
    }

    public getStencil(): Stencil | undefined {
        return this.stencil;
    }


    /**
     * 获取拖拽到画布上的组件
     * @param node 
     * @returns 
     */
    private getDropNode(node: any): Node {
        if (!this.graph) 
            throw new Error('Graph is undefined.'); 
        const { data } = node;
        const pluginConfig: IPluginConfig = PluginConfig.getInstance();
        const cpt = pluginConfig.getComponent(data.name);
        const dropCpt: Component = getDropComponent(cpt.Main);
        // 注册组件
        registerShape(data.name, dropCpt);

        // 创建拖拽到画布上的组件
        const dropNode: Node = this.graph.createNode({
            shape: data.name,
            x: 100,
            y: 40,
            width: 200,
            height: 200,
            label: data.name,
            //在创建节点时增加连接点属性;  *@author; 王炳宏  2023-05-23
            ports: {
                groups: {
                    link: {
                        attrs: {
                            circle: {
                                r: 6,
                                magnet: true,
                                stroke: '#31d0c6',
                                strokeWidth: 2,
                                fill: '#fff',
                            },
                        },
                        position: 'top',
                    }
                },
                items: [
                    {
                        id: 'port1',
                        group: 'link',
                    }
                ]
            },
        });

        return dropNode;
    }



    public addGroup(group: string): void {
        if (!this.stencil) 
            throw new Error('Stencil is undefined.'); 
        this.groups.push({
            name: group,
            title: group,
            collapsable: true
        });
    }


}

/**
 * 注册组件
 * @param shape 
 * @param component 
 */
const registerShape = (shape: string, component: any) => {
    register({
        shape,
        width: 100,
        height: 100,
        component
      });
}


export { StencilConfig }