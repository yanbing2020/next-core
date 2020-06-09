import { ClassElement } from "./interfaces";
import { warnNativeHtmlElementProperty } from "./utils";

export function method(): any {
  return function decorateProperty(element: ClassElement): ClassElement {
    if (element.kind !== "method" || typeof element.key !== "string") {
      throw new Error("`@method()` only support decorate class string method");
    }

    warnNativeHtmlElementProperty(element.key);

    return { ...element };
  };
}
