import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn"; // 导入本地化语言

dayjs.extend(relativeTime);
// 使用文档详见：https://dayjs.gitee.io/docs/zh-CN/installation/typescript
dayjs.locale("zh-cn"); // 使用本地化语言

export default dayjs;
