import { TGetExamInfo } from "@src/types/personal";
import qs from "@src/utils/qs";
import { network } from ".";

export function getExamInfo(cookie: string) {
  return network.get<TBaseRes<TGetExamInfo>>(
    `/api/dean/exam?${qs.parse({ cas: cookie })}}`
  );
}
