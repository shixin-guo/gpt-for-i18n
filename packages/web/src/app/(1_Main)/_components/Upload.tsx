import { useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  className?: string;
  onSuccess?: (files: File[]) => void;
}
const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  padding: '16px',
  borderWidth: 1,
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  borderColor: '#2196f3',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};
export const Upload: React.FC<Props> = ({ onSuccess, className = '' }) => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone();

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );
  useEffect(() => {
    acceptedFiles.length > 0 && onSuccess?.(acceptedFiles);
  }, [acceptedFiles, onSuccess]);
  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <div className={'container flex flex-col items-center' + className}>
      <div {...getRootProps({ style })} className="w-80 rounded-lg">
        <input {...getInputProps()} />
        <p> Import(.properties, .json, .yaml, .md) </p>
      </div>
      <p className="gray text-muted-foreground mt-1 text-center">
        * or drop file here
      </p>
      <ul className="mt-1 text-center">{files}</ul>
    </div>
  );
};
