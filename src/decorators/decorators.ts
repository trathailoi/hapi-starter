import { ServerRoute, ValidationObject } from '@hapi/hapi'

/**
 * Decorator that allows developers to specify HAPI route information as metadata
 */
function HapiRoute(serverRoute: ServerRoute) {
    return function(target:Object, key: string | symbol, descriptor?: PropertyDescriptor): any {
        const t: any = target
        if (!t.routes) {
            t.routes = []
        }

        serverRoute.handler = (target as any)[key]
        t.routes.push(serverRoute)
    }
}

export { HapiRoute }