import {
  HttpResponseError,
  HttpParseError,
  HttpFetchError
} from "@easyops/brick-http";
import { Modal } from "antd";
import { ModalFuncProps } from "antd/lib/modal";
import i18next from "i18next";
import { K, NS_BRICK_KIT } from "./i18n/constants";
import { getHistory } from "./history";
import { isUnauthenticatedError } from "./isUnauthenticatedError";

export const httpErrorToString = (
  error: Error | HttpFetchError | HttpResponseError | HttpParseError
): string => {
  if (error instanceof HttpResponseError) {
    if (error.responseJson && typeof error.responseJson.error === "string") {
      return error.responseJson.error;
    }
  }
  return error.toString();
};

export const handleHttpError = (
  error: Error | HttpFetchError | HttpResponseError | HttpParseError
): {
  destroy: () => void;
  update: (newConfig: ModalFuncProps) => void;
} => {
  // Redirect to login page if not logged in.
  if (isUnauthenticatedError(error)) {
    const history = getHistory();
    history.push("/auth/login", {
      from: history.location
    });
    return;
  }

  return Modal.error({
    title: i18next.t(`${NS_BRICK_KIT}:${K.REQUEST_FAILED}`),
    content: httpErrorToString(error),
    okText: i18next.t(`${NS_BRICK_KIT}:${K.MODAL_OK}`)
  });
};