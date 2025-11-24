export function getComponentName(fiber: any): string | null {
    try {
        const type = fiber.type;

        if (!type) return null;

        if (typeof type === 'string') {
            return null;
        }

        let name = null;

        if (type.displayName) {
            name = type.displayName;
        } else if (type.name && type.name !== 'Unknown') {
            name = type.name;
        } else if (type.$$typeof) {
            const typeofSymbol = type.$$typeof.toString();

            if (typeofSymbol.includes('memo')) {
                if (type.type?.name) {
                    name = `Memo(${type.type.name})`;
                } else {
                    name = 'Memo(Anonymous)';
                }
            } else if (typeofSymbol.includes('forward_ref')) {
                if (type.render?.name) {
                    name = `ForwardRef(${type.render.name})`;
                } else {
                    name = 'ForwardRef';
                }
            }
        } else if (fiber.elementType?.name) {
            name = fiber.elementType.name;
        } else if (fiber._debugSource) {
            const fileName = fiber._debugSource.fileName;
            if (fileName) {
                const match = fileName.match(/([^/\\]+)\.(jsx?|tsx?)$/);
                if (match) {
                    name = match[1];
                }
            }
        }

        if (!name) {
            const tag = fiber.tag;
            switch (tag) {
                case 0:
                case 1:
                    name = type.name || 'Anonymous';
                    break;
                case 11:
                    name = 'ForwardRef';
                    break;
                case 14:
                    name = 'Memo';
                    break;
                default:
                    return null;
            }
        }

        if (name) {

            name = name.replace(/[^a-zA-Z0-9_$]/g, '');

            if (name.length <= 2) {

                if (fiber._debugOwner?.type) {
                    const ownerName = fiber._debugOwner.type.name;
                    if (ownerName && ownerName.length > 2) {
                        name = `${ownerName}.${name}`;
                    } else {
                        name = `Component_${name}`;
                    }
                } else {
                    name = `Component_${name}`;
                }
            }
        }

        return name || null;

    } catch (error) {
        return null;
    }
}

export function getComponentId(fiber: any): string {

    const name = getComponentName(fiber) || 'unknown';
    const key = fiber.key || '';
    const index = fiber.index || 0;

    return `${name}_${key}_${index}`;

}