import { TGetExamInfo } from "@src/types/personal";
import { network } from ".";

export function getExamInfo(cookie: string) {
  return network.get<TBaseRes<TGetExamInfo>>(`/api/dean/exam?cas=${cookie}}`);
}
