/**
 * Implements a scheme for identifying classes using decorators.  
 * At runtime, a context can be scanned to tag classes decorated 
 * with a specific annotation in a way that can be queried later.
 * 
 * We do this by injecting an array property called __classAnnotations
 * and inside our decorators, we push the name of the decorator into
 * __classAnnotations
 */

class Reflector {
    private decoratorMap: any = { };
    private classMap: any = { };

    constructor(context: Array<object>) {
        context.forEach((instance: any) => {
            const className = instance.constructor.name;

            if (instance && instance.__proto__.__classAnnotations) {
                instance.__proto__.__classAnnotations.forEach((decoratorName: string) => {
                    if (!this.decoratorMap[decoratorName]) {
                        this.decoratorMap[decoratorName] = {};
                    }
                    this.decoratorMap[decoratorName][className] = true;

                    if (!this.classMap[className]) {
                        this.classMap[className] = {};
                    }
                    this.classMap[className][decoratorName] = true;
                });
            }
        });        
    }

    public getClassesAnnotatedWith(decoratorName: string): Array<any> {
        if (this.decoratorMap[decoratorName]) {
            return Object.keys(this.decoratorMap[decoratorName]);
        } else {
            return [];
        }
    }

    public getAnnotationsForClassName(className: string): Array<string> {
        if (this.classMap[className]) {
            return Object.keys(this.classMap[className]);
        } else {
            return [];
        }
    }
}

export { Reflector }
