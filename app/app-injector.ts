let appInjectorRef;

export const appInjector = (injector) => {
    if (!injector) {
        return appInjectorRef;
    }
    appInjectorRef = injector;
    return appInjectorRef;
}