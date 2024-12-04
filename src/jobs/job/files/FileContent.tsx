import { IFile } from "types";
import { useGetFileContentQuery } from "../files/filesApi";

export default function FileContent({ file }: { file: IFile }) {
  const { data: content, isLoading } = useGetFileContentQuery(file);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!content) {
    return null;
  }
  return <div>{content}</div>;
}
