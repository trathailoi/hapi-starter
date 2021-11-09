
// Utility function to add identifying information to an item
function trackDecorator(item: any, decoratorName: string) {
    if (!item.prototype.__classAnnotations) {
        item.prototype.__classAnnotations = [];
    }

    item.prototype.__classAnnotations.push(decoratorName);
}

function RouteController(item: any) {
    trackDecorator(item, 'RouteController');
}

const DECORATORS = [
    'RouteController'
];

export { RouteController, DECORATORS }