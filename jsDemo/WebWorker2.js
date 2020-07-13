console.log(2);
// console.log(' --', window, document);
// console.log('WorkerGlobalScope: ', WorkerGlobalScope());
console.log('Location: ', location);
console.log('Navigator: ', navigator);
console.log('console: ', console);
console.log('self: ', self);
console.log('this: ', this, self === this);

this.addEventListener('message', function (e) {
    console.log('e: ', e.data);
});
