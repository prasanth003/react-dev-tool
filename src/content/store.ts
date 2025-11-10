import type { ComponentData } from "../shared/types";

export class TrackStore {

    private _renderCount: number = 0;
    private _componentData = new Map<string, ComponentData>();
    private _fiberMap = new Map<string, any>();

    public getRenderCount(): number {
        return this._renderCount;
    }

    public incrementRenderCount() {
        this._renderCount++;
    }

    public resetRenderCount() {
        this._renderCount = 0;
    }

    public getComponentData(): Map<string, ComponentData> {
        return this._componentData;
    }

    public setComponent(id: string, data: ComponentData): void {
        this._componentData.set(id, data);
    }

    public getComponent(id: string): ComponentData | undefined {
        return this._componentData.get(id);
    }

    public clearComponentData(): void {
        this._componentData.clear();
    }

    public getFiberMap(): Map<string, any> {
        return this._fiberMap;
    }

    public setFiber(id: string, fiber: any): void {
        this._fiberMap.set(id, fiber);
    }

    public getFiber(id: string): any | undefined {
        return this._fiberMap.get(id);
    }

    public clearFiberMap(): void {
        this._fiberMap.clear();
    }

}

export const store = new TrackStore();