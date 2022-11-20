import { TGetExamInfo } from "@src/types/personal";
import qs from "@src/utils/qs";
import { manualNetwork } from ".";

export function getExamInfo(cookie: string) {
  return manualNetwork.get<TBaseRes<TGetExamInfo>>(
    `/api/dean/exam?${qs.parse({ cas: cookie })}}`
  );
}
