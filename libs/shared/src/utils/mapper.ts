export class Mapper {
    /**
     * Maps properties from source object to a new instance of the target class
     * @param source Source object with properties to map
     * @param targetType Constructor of the target class
     * @returns New instance of target class with mapped properties
     */
    static map<T extends new () => InstanceType<T>, K extends object>(
        source: K,
        targetType: T
    ): InstanceType<T> {
        // Create a new instance of the target class
        const instance = new targetType();
        const sourceObj = source as Record<string, unknown>;
        // Get all property names from the instance
        const keys = Object.getOwnPropertyNames(instance);

        // Copy matching properties from source to instance
        keys.forEach(key => {
            if (key in source && sourceObj[key] as Record<string, unknown> !== undefined) {
                (instance as Record<string, unknown>)[key] = sourceObj[key] as Record<string, unknown>;
            }
        });

        return instance;
    }
}