import EventEmitter from "events";

export type PromiseType = (...args: any[]) => Promise<any>;

class PromiseQueue {
    private _queuedItems: PromiseType[] = [];
    private _runningItems: PromiseType[] = [];
    private _maxItems: number = 50;

    get maxItems() {
        return this._maxItems;
    }

    events = new EventEmitter();

    constructor(maxItems?: number) {
        if(typeof maxItems === 'number' && maxItems > 0) {
            this._maxItems = maxItems;
        }
    }

    add(fn: PromiseType) {
        this._queuedItems.push(fn);
        this._checkQueue();
    }

    allComplete() {
        return new Promise<void>(resolve => {
            this.events.on('complete', resolve);
        });
    }

    private _checkQueue() {
        if(this._runningItems.length < this._maxItems) {
            const nextItem = this._queuedItems.pop();
            if(nextItem) {
                this._runningItems.push(nextItem);
                nextItem().finally(() => {
                    const index = this._runningItems.indexOf(nextItem);
                    if(index !== -1) {
                        this._runningItems.splice(index, 1);
                        if(this._runningItems.length === 0) {
                            this.events.emit('complete')
                        }
                    }
                    this._checkQueue();
                })
            }
        }
    }

}

export default PromiseQueue;