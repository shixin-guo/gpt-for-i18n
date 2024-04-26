import { MutableRefObject } from 'react';

import saveAs from 'file-saver';
import JSZip from 'jszip';

import { todayDate } from '@/utils/date';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { LanguageShortKey } from './LanguageSelect';

export const DownloadButton: React.FC<{
  disabled?: boolean;
  fileType: string;
  translatedLangs: LanguageShortKey[];
  fileName: string;
  translatedContentRef: MutableRefObject<{ [key: string]: string }>;
}> = ({
  disabled,
  translatedLangs,
  fileType = 'properties',
  fileName = 'i18n',
  translatedContentRef,
}) => {
  const handleDownloadZip = async (): Promise<void> => {
    const zip = new JSZip();
    Object.keys(translatedContentRef.current).map((shortKey) => {
      const value = translatedContentRef.current[shortKey];
      if (value) {
        const filename = `${fileName}_${shortKey}.${fileType}`;
        zip.file(filename, value);
      }
    });
    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      saveAs(blob, `i18n-${todayDate()}.zip`);
    });
  };
  return (
    <TooltipProvider>
      <Tooltip>
        {/* todo why react server render wrong when don't have asChild */}
        <TooltipTrigger asChild>
          <Button
            onClick={handleDownloadZip}
            disabled={disabled}
            className="mx-2"
          >
            Export
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>
            {translatedLangs.length > 0 &&
              `[ ${translatedLangs.join(', ')} ] translated completed.`}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
