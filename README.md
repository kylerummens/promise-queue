# Node.js Promise Queue

## Usage
```typescript
import PromiseQueue from '...';

const queue = new PromiseQueue(75);

for(let i = 0; i < 10_000; i++) {
  queue.add((async () => {
    await myAsyncFunction();
    await doSomethingElse();
    return anotherAsyncFunction();
  }));
}

await queue.allComplete();
```
