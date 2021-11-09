import { ServerRoute } from "@hapi/hapi";

// Utility function to add identifying information to an item
function trackDecorator(item: any, decoratorName: string) {
    if (!item.prototype.__classAnnotations) {
        item.prototype.__classAnnotations = [];
    }

    item.prototype.__classAnnotations.push(decoratorName);
}

function Route(serverRoute: ServerRoute) {
    return function(target:Object, key: string | symbol, descriptor?: PropertyDescriptor): any {
        const t: any = target;
        if (!t.routes) {
            t.routes = [];
        }

        serverRoute.handler = (target as any)[key];
        t.routes.push(serverRoute);
    }
}

function RouteController(target: any) {
    trackDecorator(target, 'RouteController');
}

const DECORATORS = [
    'RouteController'
];

export { RouteController, Route, DECORATORS }